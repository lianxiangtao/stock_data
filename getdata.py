# %%
import datetime
import json
import time
import traceback

import numpy as np
import pandas as pd
import requests


def urljoin(params):
    s = [f'{k}={v}' for k, v in params.items()]
    return "&".join(s)

def get_stock_data_current(id):

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

def get_stock_data_history(id, k_period):
    base_url = 'https://push2his.eastmoney.com/api/qt/stock/kline/get?'
    params = {
        'fields1': ",".join(FIELD_1_DICT.keys()),
        'fields2': ",".join(FIELD_2_DICT.keys()),
        'klt': KLINES_CODE.get(k_period, '101'),
        'fqt': '1',
        'secid': f"{STOCK_MAEKET_CODE[id[:3]]}.{id}",  # 取id前两位判断market
        'beg': '0',
        'end': '20500000'
        }
    url = base_url + urljoin(params)
    res = requests.get(url).text
    return res

def parse_history(js):
    res_info = json.loads(js)['data']
    # 将K线历史数据模块剔除出 res_info 并赋值给 res_detail
    res_detail = [q.split(',') for q in res_info.pop('klines')]
    # FIELD_2_DICT key排序
    dict_sort = dict(sorted(FIELD_2_DICT.items(),
        key=lambda x: int(x[0].replace('f', ''))))
    df_detail = pd.DataFrame(res_detail, columns=dict_sort.values())
    
    df_detail = df_detail[['日期']].join(df_detail.drop(['日期'], axis=1).astype(float))
    df_detail['振幅值'] = df_detail['最高'] - df_detail['最低']
    df_detail = df_detail.sort_values(by='日期', ascending=0, ignore_index=1)
    df_detail['股名'] = res_info['name']
    
    df_detail['MA5'] = cal_MA(df_detail['收盘'], 5)
    df_detail['MA10'] = cal_MA(df_detail['收盘'], 10)
    df_detail['MA20'] = cal_MA(df_detail['收盘'], 20)
    
    df_detail['大于MA5'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA5'] else 0, axis=1)
    df_detail['大于MA10'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA10'] else 0, axis=1)
    df_detail['大于MA20'] = df_detail.apply(lambda x: 1 if x['收盘'] > x['MA20'] else 0, axis=1)

    df_detail['MA命中数'] = df_detail['大于MA5'] + df_detail['大于MA10'] + df_detail['大于MA20']
    return df_detail

def parse_current(js):
    res_info = json.loads(js)['data']
    res_info = {FIELD_CURRENT_DAY_DICT[k]: v for k, v in res_info.items()}
    return res_info

def cal_MA(x, days):
    res = []
    for q in range(len(x)-days):
        ma = round(np.sum(x[q: q+days])/days ,2)
        res.append(ma)
    res.extend(None for _ in range(len(x)-len(res)))
    return res
        

def main(stock_id, k_period='d'):
    stock_info_all = []
    stock_history_all = []

    for id in stock_id:
        time.sleep(0.1)
        try:
            res_current = get_stock_data_current(id)
            res_history = get_stock_data_history(id, k_period)
            stock_info_current = parse_current(res_current)
            stock_name = stock_info_current['股名']
            stock_history = parse_history(res_history)
            
            stock_info_all.append(stock_info_current)
            stock_history_all.append(stock_history)
            
            print(f"========== {id} {stock_name} success ==========")
        except Exception:
            exc_msg = traceback.format_exc()
            print(f"========== {id} {stock_name} ERROR ==========", exc_msg)

    df_stock_info = pd.DataFrame(stock_info_all)
    df_history = pd.concat(stock_history_all, ignore_index=1)

    # excel 文件名
    excel_path = f"stock_info_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    writer = pd.ExcelWriter(excel_path)  # 创建 excel 对象
    df_stock_info.to_excel(writer, index=False, sheet_name='股票信息')
    df_history.to_excel(writer, index=False, sheet_name='股票明细')
    writer.save()
    print('输出', excel_path)

# 市场代码
STOCK_MAEKET_CODE = {
    '1': '600|601|603|605|688',  # 沪市
    '0': '002|300',  # 深市/中小板
    }
STOCK_MAEKET_CODE = {q: k for k, v in STOCK_MAEKET_CODE.items() for q in v.split('|')}

FIELD_CURRENT_DAY_DICT = {
    'f50': '量比',
    'f57': '代码',
    'f58': '股名',
}

FIELD_1_DICT = {
    # 'f1': '代码',
    # 'f2': '板块',
    'f3': '股名',
    # 'f4': 'decimal',
    # 'f5': 'dktotal',
    # 'f6': 'preKPrice',
}

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



# %%
if __name__ == '__main__':
    stock_id = ['002205', '002941', '600581', '600502', '601398', '603288', '688008', '300251']  # 股票代码 
    main(stock_id, k_period='d')
