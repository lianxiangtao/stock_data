# -*- coding: utf-8 -*-
"""
Created on Sun May  8 19:53:44 2022

@author: lianxiangtao
"""

import datetime
import json
import sys
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
    '0': '000|002|003|300|120|121|122|123|124|125|126|127|128|129',  # 002深市/300中小板/120-129可转债
    }
STOCK_MAEKET_CODE = {q: k for k, v in STOCK_MAEKET_CODE.items() for q in v.split('|')}

# 股票信息指标
FIELD_CURRENT_DAY_DICT = {
    'f50': '量比',
    'f57': '代码',
    'f58': '股名',
    'f71': '均价',
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

# 顺序优先级字段
HIGHER_PRIORITY_COL = ['日期', '股名', 'MA命中数']

# 某字段插入某字段后
DICT_COL_BEHIND_COL = {
    # key begind value
    '均价': '最低'
    }

IS_DEBUG = True if sys.gettrace() else False

def urljoin(params: Dict) -> str:
    s = [f'{k}={v}' for k, v in params.items()]
    return "&".join(s)


def sort_columns(columns: List[str], higher_priority_col: List[str]) -> List[str]:
    """
    将优先级字段靠前展示

    Args:
        columns (List[str]): 初始字段列表.
        higher_priority_col (List[str]): 优先级字段

    Returns:
        finally_col (List[str]): 最终字段列表.

    """
    finally_col = []

    # 优先级排序
    for col in higher_priority_col:
        finally_col.append(columns.pop(columns.index(col)))

    finally_col.extend(columns)

    # behind 排序
    for bcol, fcol in DICT_COL_BEHIND_COL.items():
        idx_fcol = finally_col.index(fcol)
        # 删除 finally_col 原有 bcol, fcol 后插入 bcol
        finally_col.insert(idx_fcol+1, finally_col.pop(finally_col.index(bcol)))

    return finally_col


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


def get_stock_data_history(id: str, k_period: str, limit: int) -> str:
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
        'lmt': limit  # 近n天记录条数
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

    df_detail['大于MA5'] = df_detail.apply(
        lambda x: 1 if x['收盘'] > x['MA5'] else 0, axis=1)
    df_detail['大于MA10'] = df_detail.apply(
        lambda x: 1 if x['收盘'] > x['MA10'] else 0, axis=1)
    df_detail['大于MA20'] = df_detail.apply(
        lambda x: 1 if x['收盘'] > x['MA20'] else 0, axis=1)

    df_detail['MA命中数'] = df_detail['大于MA5'] + df_detail['大于MA10'] + df_detail['大于MA20']

    df_detail_common = df_detail[~df_detail['股名'].str.contains('^..转债')]
    df_detail_convertible = df_detail[df_detail['股名'].str.contains('^..转债')]

    # 计算均价, 股票均价=成交额/100/成交量，转债均价=成交额/10/成交量
    df_detail_common['均价'] = (
        df_detail_common['成交额'] / 100 / df_detail_common['成交量']).apply(
            lambda x: round(x, 2))
    df_detail_convertible['均价'] = (
        df_detail_convertible['成交额'] / 10 / df_detail_convertible['成交量']).apply(
            lambda x: round(x, 2))

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
        ma = round(np.sum(x[q: q+days])/days, 2)
        res.append(ma)
    res.extend(np.nan for _ in range(len(x)-len(res)))
    return res


def main(stock_id: List[str], k_period: str = 'd', limit: int = 60):
    """主程序

    Args:
        stock_id (List[str]): 股票代码
        k_period (str, optional): K线周期选项. Defaults to 'd'.
        limit (int, optional): 近n天记录数. Defaults to 60.
    """
    stock_info_all = []  # 股票信息
    stock_history_common_all = []  # 普通股票明细
    stock_history_convertible_all = []  # 可转债明细

    n = 0
    for id in stock_id:
        n += 1
        if n % 50 == 0:
            time.sleep(10)
        time.sleep(0.1)

        try:
            res_current = get_stock_data_current(id)
            res_history = get_stock_data_history(id, k_period, limit)
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

    # 列字段优先级排序
    df_history_common = df_history_common[
        sort_columns(df_history_common.columns.tolist(), HIGHER_PRIORITY_COL)]
    df_history_convertible = df_history_convertible[
        sort_columns(df_history_convertible.columns.tolist(), HIGHER_PRIORITY_COL)]

    # excel 文件名
    excel_path = f"result/stock_info_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    writer = pd.ExcelWriter(excel_path)  # 创建 excel 对象
    df_stock_info.to_excel(writer, index=False, sheet_name='股票信息')
    df_history_common.to_excel(writer, index=False, sheet_name='股票明细')
    df_history_convertible.to_excel(writer, index=False, sheet_name='转债明细')
    writer.save()
    print('--->', excel_path)


if __name__ == '__main__':
    stock_id = [
        '002205', '002941', '600581', '600502', '123136', '128021', '113595', '111003',
        '123027', '123138', '123072', '127057', '113597', '127007', '123134', '113537',
        '123135', '128070', '123039', '113630', '123140', '123135', '127057', '113027',
        '128132', '128040', '113626', '113519', '113618', '123130', '002432', '600056',
        '000665', '600096', '000912', '002349', '002780', '003037', '600838', '600581',
        '002699', '000815', '002761', '123136', '111002', '603123', '002717', '000968',
        '002613', '002550', '000722', '600062', '600510', '000514', '000797', '002060',
        '002059', '600938', '123039', '603696', '002104', '603363', '003040', '601666',
        '600988', '601888', '601899', '601007', '113027', '601225', '600381', '603215'
    ]  # 股票代码

    if not IS_DEBUG:  # 判断是否为 debug 模式运行
        main(stock_id, k_period='d')
    else:
        main(stock_id[:5], k_period='d')
