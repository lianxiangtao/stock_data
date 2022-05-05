import datetime
import json
import time
import traceback

import pandas as pd
import requests


def urljoin(params):
    s = [f'{k}={v}' for k, v in params.items()]
    return "&".join(s)

def get_stock_data(id, k_period):
    base_url = 'https://push2his.eastmoney.com/api/qt/stock/kline/get?'
    params = {
        'fields1': 'f1,f2,f3,f4,f5,f6',
        'fields2': 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
        'klt': KLINES_CODE.get(k_period, '101'),
        'fqt': '1',
        'secid': f"{STOCK_MAEKET_CODE[id[:3]]}.{id}",  # 取id前两位判断market
        'beg': '0',
        'end': '20500000',
        'lmt': 
        }
    url = base_url + urljoin(params)
    res = requests.get(url).text
    return res

def parse(js):
    columns = ['日期', '开盘', '收盘', '最高', '最低', '成交量', '成交额', '振幅', '涨跌幅', '涨跌额', '换手率']
    res_info = json.loads(js)['data']
    res_detail = [q.split(',') for q in res_info.pop('klines')]
    df_detail = pd.DataFrame(res_detail, columns=columns)
    df_detail = df_detail[['日期']].join(df_detail.drop(['日期'], axis=1).astype(float))
    df_detail['振幅值'] = df_detail['最高'] - df_detail['最低']
    df_detail = df_detail.sort_values(by='日期', ascending=0, ignore_index=1)
    return res_info, df_detail

def main(stock_id, k_period='d'):
    stock_info_all = []
    stock_details_all = {}

    for id in stock_id:
        time.sleep(0.5)
        try:
            res = get_stock_data(id, k_period)
            stock_info, stock_details = parse(res)
            stock_name = stock_info['name']
            stock_info_all.append(stock_info)
            stock_details_all[stock_name] = stock_details
            print(f"========== {id} {stock_name} success ==========")
        except Exception:
            exc_msg = traceback.format_exc()
            print(f"========== {id} {stock_name} ERROR ==========", exc_msg)

    df_stock_info = pd.DataFrame(stock_info_all)

    # excel 文件名
    excel_path = f"stock_info_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
    writer = pd.ExcelWriter(excel_path)  # 创建 excel 对象
    df_stock_info.to_excel(writer, index=False, sheet_name='股票信息')
    for sname, sdet in stock_details_all.items():
        sdet.to_excel(writer, index=False, sheet_name=sname)
    writer.save()
    print('输出', excel_path)

# 市场代码
STOCK_MAEKET_CODE = {
    '1': '600|601|603|605|688',  # 沪市
    '0': '002|300',  # 深市/中小板
    }
STOCK_MAEKET_CODE = {q: k for k, v in STOCK_MAEKET_CODE.items() for q in v.split('|')}

# K线周期
KLINES_CODE = {
    'd': '101',  # 天
    'w': '102',  # 周
    'm': '103'  # 月
    }

if __name__ == '__main__':
    stock_id = ['002205', '002941', '600581', '600502', '601398', '603288', '688008', '300251']  # 股票代码
    main(stock_id, k_period='d')
