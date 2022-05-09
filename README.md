# stock_data

爬取股票当前及历史数据，数据来源于东方财富网。

## 环境

```text
python>=3.6
numpy==1.20.3
panda==1.3.4
```

## 使用方法

```python
>>> from getdata import main
>>> stock_id = ['002205', '002941', '600581', '600502', '123136', '128021']
>>> main(stock_id)
========== 002205 国统股份 success ==========
========== 002941 新疆交建 success ==========
========== 600581 八一钢铁 success ==========
========== 600502 安徽建工 success ==========
========== 123136 城市转债 success ==========
========== 128021 兄弟转债 success ==========
---> result/stock_info_20220508165202.xlsx
```

```python
main(stock_id, k_period='w')  # 周K线
main(stock_id, k_period='m')  # 月K线
main(stock_id, limit=120)  # 近120天数据
```
