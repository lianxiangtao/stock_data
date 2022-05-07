# %%
import datetime
import json
import time
import traceback

import numpy as np
import pandas as pd
import requests
from typing import List, Dict, Sequence, Tuple, Union, Optional, Literal
from pandas.core.frame import DataFrame
from pandas.core.series import Series

# 市场代码
STOCK_MAEKET_CODE = {
    '1': '600|601|603|605|688|110|111|112|113|114|115|116|117|118|119',  # 沪市/110-120可转债
    '0': '002|300|120|121|122|123|124|125|126|127|128|129',  # 002深市/300中小板/120-129可转债
    }
STOCK_MAEKET_CODE = {q: k for k, v in STOCK_MAEKET_CODE.items() for q in v.split('|')}

# 股票信息指标
FIELD_CURRENT_DAY_DICT = {
    'f50': '量比',
    'f57': '代码',
    'f58': '股名',
    'f127': '行业'
}

# 一级指标
FIELD_1_DICT = {
    # 'f1': '代码',
    # 'f2': '板块',
    'f3': '股名',
    # 'f4': 'decimal',
    # 'f5': 'dktotal',
    # 'f6': 'preKPrice',
}

# 二级指标
FIELD_2_DICT = {
    'f51': '日期',
    'f52': '开盘',
    'f53': '收盘',
    'f54': '最高',
    'f55': '最低',
    'f56': '成交量',
    'f57': '成交额',
    'f58': '振幅',
    'f59': '涨跌幅',
    'f60': '涨跌额',
    'f61': '换手率',
}

# K线周期
KLINES_CODE = {
    'd': '101',  # 天
    'w': '102',  # 周
    'm': '103'  # 月
    }



def urljoin(params: Dict) -> str:
    s = [f'{k}={v}' for k, v in params.items()]
    return "&".join(s)

def get_stock_data_current(id: str) -> str:
    '''获取股票当前信息'''
    base_url = 'https://push2.eastmoney.com/api/qt/stock/get?'
    params = {
        'fields': ",".join(FIELD_CURRENT_DAY_DICT.keys()),
        'invt': 2,
        'fltt': 2,
        'secid': f"{STOCK_MAEKET_CODE[id[:3]]}.{id}",  # 取id前两位判断market
        }
    url = base_url + urljoin(params)
    res = requests.get(url).text
    return res

def get_stock_data_history(id: str, k_period: str) -> str:
    """获取股票历史数据

    Args:
        id (str): 股票代码
        k_period (str): k线周期

    Returns:
        str: k线json数据
    """    
    base_url = 'https://push2his.eastmoney.com/api/qt/stock/kline/get?'
    params = {
        'fields1': ",".join(FIELD_1_DICT.keys()),
        'fields2': ",".join(FIELD_2_DICT.keys()),
        'klt': KLINES_CODE.get(k_period, '101'),
        'fqt': '1',
        'secid': f"{STOCK_MAEKET_CODE[id[:3]]}.{id}",  # 取id前两位判断market
        'end': '20500000',
        'lmt': 60  # 记录条数
        }
    url = base_url + urljoin(params)
    res = requests.get(url).text
    return res

def parse_history(js: str) -> Tuple[DataFrame, DataFrame]:
    """解析K线历史数据，计算额外指标

    Args:
        js (str): k线历史数据json

    Returns:
        df_detail_common (DataFrame): 普通股票明细
        df_detail_convertible(DataFrame): 可转债明细
    """    
    res_info = json.loads(js)['data']
    # 将K线历史数据模块剔除出 res_info 并赋值给 res_detail
    res_detail = [q.split(',') for q in res_info.pop('klines')]
    # FIELD_2_DICT key排序
    dict_sort = dict(sorted(FIELD_2_DICT.items(),
        key=lambda x: int(x[0].replace('f', ''))))
    df_detail = pd.DataFrame(res_detail, columns=dict_sort.values())  # type: ignore
    
    df_detail = df_detail[['日期']].join(df_detail.drop(['日期'], axis=1).astype(float))
    df_detail['振幅值'] = df_detail['最高'] - df_detail['最低']
    df_detail = df_detail.sort_values(by='日期', ascending=False, ignore_index=True)
    df_detail['股名'] = res_info['name']
    
    df_detail['MA5'] = cal_MA(df_detail['收盘'], 5)
    df_detail['MA10'] = cal_MA(df_detail['收盘'], 10)
    df_detail['MA20'] = cal_MA(df_detail['收盘'], 20)
    
    df_detail['大于MA5'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA5'] else 0, axis=1)
    df_detail['大于MA10'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA10'] else 0, axis=1)
    df_detail['大于MA20'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA20'] else 0, axis=1)

    df_detail['MA命中数'] = df_detail['大于MA5'] + df_detail['大于MA10'] + df_detail['大于MA20']

    df_detail_common = df_detail[~df_detail['股名'].str.contains('^..转债')]
    df_detail_convertible = df_detail[df_detail['股名'].str.contains('^..转债')]
    return df_detail_common, df_detail_convertible

def parse_current(js: str) -> Dict:
    res_info = json.loads(js)['data']
    res_info = {FIELD_CURRENT_DAY_DICT[k]: v for k, v in res_info.items()}
    return res_info

def cal_MA(x: Series, days: int) -> List:
    """_summary_

    Args:
        x (Series): _description_
        days (int): _description_

    Returns:
        List: _description_
    """    
    res = []
    for q in range(len(x)-days):
        ma = round(np.sum(x[q: q+days])/days ,2)
        res.append(ma)
    res.extend(np.nan for _ in range(len(x)-len(res)))
    return res
        

def main(stock_id: List[str], k_period: str ='d'):
    """主程序

    Args:
        stock_id (List[str]): 股票代码
        k_period (str, optional): K线周期选项. Defaults to 'd'.
    """    
    stock_info_all = []  # 股票信息
    stock_history_common_all = []  # 普通股票明细
    stock_history_convertible_all = []  # 可转债明细

    for id in stock_id:
        time.sleep(0.1)
        try:
            res_current = get_stock_data_current(id)
            res_history = get_stock_data_history(id, k_period)
            stock_info_current = parse_current(res_current)
            stock_name = stock_info_current['股名']
            stock_history_common, stock_history_convertible = parse_history(res_history)
            
            stock_info_all.append(stock_info_current)
            stock_history_common_all.append(stock_history_common)
            stock_history_convertible_all.append(stock_history_convertible)
            
            print(f"========== {id} {stock_name} success ==========")
        except Exception:
            exc_msg = traceback.format_exc()
            stock_name = '-'
            print(f"========== {id} {stock_name} ERROR ==========", exc_msg)

    df_stock_info = pd.DataFrame(stock_info_all)
    df_history_common = pd.concat(stock_history_common_all, ignore_index=True)
    df_history_convertible = pd.concat(stock_history_convertible_all, ignore_index=True)

    # excel 文件名
    excel_path = f"result/stock_info_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    writer = pd.ExcelWriter(excel_path)  # 创建 excel 对象
    df_stock_info.to_excel(writer, index=False, sheet_name='股票信息')
    df_history_common.to_excel(writer, index=False, sheet_name='股票明细')
    df_history_convertible.to_excel(writer, index=False, sheet_name='转债明细')
    writer.save()
    print('输出', excel_path)


# %%
if __name__ == '__main__':
    stock_id = [
        '002205', '002941', '600581', '600502', '123136', '128021', '113595', '111003', '123027',
        '123138', '123072', '127057', '113597', '127007', '123134', '113537', '123135', '128070',
        '123039', '113630', '123140', '123135', '127057', '113027', '128132', '128040', '113626',
        '113519', '113618', '123130' 
    ]  # 股票代码
    main(stock_id, k_period='d')
