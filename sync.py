# -*- coding: utf-8 -*-
"""
Created on Sun May 15 15:39:36 2022

@author: lianxiangtao
"""

from fake_useragent import UserAgent
from selenium.webdriver import Chrome, DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

import os
import platform
import time
import pandas as pd
from PIL import Image

import re
import xmltodict
import json
import datetime
from getdata import urljoin
from bs4 import BeautifulSoup


# 用户名
USERNAME = os.environ.get("USERNAME")
# chrome 用户资料文件夹
PATH_USER_DATA = rf"C:/Users/{USERNAME}/AppData/Local/Google/Chrome/User Data"
# chromedriver 路径
PATH_CHROMEDRIVER = rf"C:/Program Files (x86)/Google/Chrome/Application/chromedriver.exe"
# QRcode 保存文件夹
QRCODE_PATH = rf'qrcode/qrcode.png'

def open_browser(proxy=None, if_desired_capabilities=False):
    u_system = platform.system()  # 系统平台
    if u_system == 'Windows':
        chrome_options = Options()
        # chrome_options.add_argument("--headless")  # 无界面模式
        chrome_options.add_argument("--user-data-dir="+PATH_USER_DATA)  # 加载用户数据伪装
        # chrome_options.add_argument('user-agent={}'.format(UserAgent().chrome))
        prefs = {
            "profile.managed_default_content_settings.images": 1,  # 禁止加载图片
            'permissions.default.stylesheet': 1  # 禁止加载CSS
            }
        chrome_options.add_experimental_option('prefs', prefs)
        chrome_options.add_experimental_option('excludeSwitches', ['enable-automation'])
        if proxy is not None:
            chrome_options.add_argument('--proxy-server={0}'.format(proxy.proxy))

        if if_desired_capabilities:
            # 实现Network功能
            d = DesiredCapabilities.CHROME
            d['goog:loggingPrefs'] = {'performance': 'ALL'}  # type: ignore
        else:
            d = None
        driver = Chrome(PATH_CHROMEDRIVER, options=chrome_options)
        driver.set_page_load_timeout(60)  # timeout限时

        with open('./stealth.min.js-main/stealth.min.js') as f:
            js = f.read()

        driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
          "source": js
        })
        # driver.get('https://bot.sannysoft.com/')
        # time.sleep(5)
        # driver.save_screenshot('walkaround.png')

        # # 你可以保存源代码为 html 再双击打开，查看完整结果
        # source = driver.page_source
        # with open('result.html', 'w') as f:
        #     f.write(source)
        return driver
    elif u_system == 'Linux':
        chrome_options = Options()
        chrome_options.add_argument("start-maximized")
        chrome_options.add_argument("enable-automation")
        chrome_options.add_argument("--disable-infobars")
        chrome_options.add_argument("--disable-browser-side-navigation")
        chrome_options.add_argument("--headless")  # 无界面模式
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument("binary_location"+r"/usr/bin/google-chrome")

        driver = Chrome(r"/usr/bin/chromedriver", chrome_options=chrome_options)
        driver.set_page_load_timeout(60)
        with open('./stealth.min.js-main/stealth.min.js') as f:
            js = f.read()

        driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
          "source": js
        })

        return driver


def close_browser(driver):
    u_system = platform.system()  # 系统平台
    if u_system == 'Windows':
        driver.quit()
        chrome_options = Options()
        # chrome_options.add_argument("--headless")  # 无界面模式
        chrome_options.add_argument("--user-data-dir="+PATH_USER_DATA)  # 加载用户数据伪装
        prefs = {
            "profile.managed_default_content_settings.images": 1,  # 恢复加载图片
            'permissions.default.stylesheet': 1  # 恢复加载CSS
            }
        chrome_options.add_experimental_option('prefs', prefs)

        driver = Chrome(PATH_CHROMEDRIVER, options=chrome_options)
        time.sleep(3)
        driver.quit()
    elif u_system == 'Linux':
        driver.quit()
    else:
        pass

class Sync_qq_docs():
    # https://docs.qq.com/desktop/
    def __init__(self):
        self.login_status = None
        self.qrcode_status = None

    def bget(self, browser, url):
        try:
            browser.get(url)
        except TimeoutException:
            browser.execute_script('window.stop()')
        return browser

    def join_params(self, data):
        p = "&".join(['%s=%s' % (k, v) for k, v in data.items()])
        p = p.replace(' ', '').replace("'", "\"").replace('True', 'true')
        return p

    def login_estimate(self):
        source = self.browser.page_source
        soup = BeautifulSoup(source, 'lxml')
        user_info = soup.find_all('script', type='text/javascript')[1]
        reg_info = re.findall(r'"uid":"(\d+)"', user_info.string)
        return True if reg_info else False

    def qrcode_save(self):
        xpath_qrcode = '/html/body/div[4]/div/div/div/div[2]/div[2]/div[2]/div/'\
            'div[1]/div[2]/div[1]/div/div[3]/div/img'
        img_dirver = self.browser.find_elements(by=By.XPATH, value=xpath_qrcode)
        if img_dirver:
            save_status = img_dirver[0].screenshot(QRCODE_PATH)
            print('二维码保存成功')
        else:
            print('二维码保存失败')

    def qrcode_invalid(self):
        """判断二维码是否失效"""
        try:
            ele_qrcode_invalid = self.browser.find_element(
                by=By.XPATH, value='//div[@class="qrcode-invalid-tips"]')
            return True if ele_qrcode_invalid else False
        except Exception:
            return False

    def qrcode_reset(self):
        try:
            # 刷新二维码
            xpath_ele_qrcode = '//div[@class="dui-loading-container '\
                'dui-loading-container-wrap"]'
            ele_qrcode = self.browser.find_element(
                by=By.XPATH, value=xpath_ele_qrcode)
            ele_qrcode.click()
            WebDriverWait(self.browser, 5).until(
                EC.presence_of_element_located((By.XPATH, '//*[@class="wechat-qrcode"]'))
            )
        except Exception:
            pass

    def qrcode_process(self):
        while True:
            self.login_status = self.login_estimate()
            if self.login_status:
                print('登录成功')
                break
            self.qrcode_status = self.qrcode_invalid()  # 二维码是否过期
            if not self.qrcode_status:
                print('二维码未过期')
            else:
                self.qrcode_reset()  # 重置二维码
                print('二维码过期，重置二维码')
                self.qrcode_save()  # 保存二维码
            time.sleep(5)

    def login(self, browser):
        '''登录'''
        browser.maximize_window()
        self.bget(browser, 'https://docs.qq.com/')  # 腾讯文档官网
        # 点击登录按钮
        if browser.current_url != 'https://docs.qq.com/desktop/':
            browser.find_element(by=By.XPATH,
                                 value='//button[@class="login-btn"]').click()

        # 等待60s直到二维码加载
        WebDriverWait(browser, 60).until(
            EC.presence_of_element_located((By.XPATH, '//*[@class="wechat-qrcode"]'))
        )

        self.login_status = self.login_estimate()
        if self.login_status:
            print('自动登录成功')
        else:
            self.qrcode_process()

        return browser

    # def start_requests(self, browser, fid):
    #     '''
    #     最新发表帖子
    #     '''
    #     df_url = []
    #     for page in range(1, 10):
    #         print(page)
    #         self.logger.info('----page {}----'.format(page))
    #         data = {'mod': 'forumdisplay', 'fid': fid, 'orderby': 'dateline',
    #                 'filter': 'author', 'page': page}
    #         base_url = 'http://www.haokouzi.com/forum.php?'
    #         self.bget(browser, base_url + self.join_params(data))
    #         source = browser.page_source
    #         df_info, status_stop = self.getinfo(source)
    #         df_url.append(df_info)
    #         if status_stop == 1 or (page == 1 and df_info.empty):
    #             break
    #     self.logger.info('----帖子获取停止----')
    #     df_url = pd.concat(df_url, ignore_index=True)
    #     time.sleep(1)
    #     return df_url

    def getid(self, urltext):
        try:
            cms_id = re.findall('tid=(\d+)', urltext)[0]
            return cms_id
        except Exception:
            return None

    # def getinfo(self, html):
    #     """提取BBS帖子链接"""
    #     # BeautifulSoup/xmltodict都无法解析，坑爹网站的代表
    #     regex = '<a href="(.*?)".*?class="s xst">(.*?)</a>'  # 提取帖子链接
    #     reg_info = re.findall(regex, html)
    #     # 提取帖子发帖时间
    #     regex_date = r'<a href="http://www.haokouzi.com/home.php\?mod=space&amp;uid=\d+".*?<em><span.*?>(.*?)</span></em>'
    #     reg_info_date = re.findall(regex_date, html, re.S)
    #     # 规范提取时间
    #     reg_info_date = [re.findall('\d+-\d+-\d+', q)[0] for q in reg_info_date]
    #     reg_info_date = [datetime.datetime.strptime(t, '%Y-%m-%d') for t in reg_info_date]

    #     df_info = pd.DataFrame(reg_info, columns=['url', 'title'])
    #     df_info['url'] = df_info['url'].apply(lambda x: unquote_url(x))  # 去除特殊字符
    #     # df_info['publish_time'] = reg_info_date
    #     df_info['cms_id'] = df_info['url'].apply(self.getid)  # 提取cms_id
    #     df_info = df_info[df_info['cms_id'].notnull()]
    #     df_info = df_info.drop_duplicates(['cms_id'], ignore_index=True)
    #     self.logger.info('共识别新闻条数{}个'.format(df_info.shape[0]))
    #     # 对已经保存在库中的新闻进行剔除，不纳入获取范围
    #     has_exist_id = get_exist_id('cms_id', 'fk_data.t_news_haokouzi',
    #                                 df_info['cms_id'].tolist())
    #     df_info_fin = df_info[~df_info['cms_id'].isin(
    #         pd.DataFrame(has_exist_id)['cms_id'])].reset_index(drop=1)
    #     self.logger.info('入库检验剔除后新闻条数{}个'.format(df_info_fin.shape[0]))
    #     # 若帖子不在近48小时内，则停止爬取帖子，status_stop=1
    #     status_stop = 1 if datetime.datetime.now()-datetime.timedelta(days=2) \
    #         > min(reg_info_date) else 0
    #     return df_info_fin, status_stop

    # def get_article_body(self, source):
    #     """提取文章主体段落"""
    #     regex_sub = '(?<=post_body).*(?=//初始化反作弊)'  # 提取文章主体
    #     body = re.findall(regex_sub, re.sub('[\t\n\r\f\v]', '', source))[0]
    #     idx = body.rfind('<!--结束-->')
    #     body = body[idx:] if idx != -1 else body

    #     regex = '<p.*?>(.*?)</p>'  # 提取正文段落
    #     reg_info = ''.join(re.findall(regex, body))
    #     # 剔除无关段落
    #     reg_info = article_cleaner(reg_info)

    #     t1 = '特别声明：以上内容'
    #     reg_info = reg_info[:reg_info.rfind(t1)] if reg_info.rfind(t1) != -1 else reg_info
    #     t2 = 'Notice: The content above'
    #     reg_info = reg_info[:reg_info.rfind(t2)] if reg_info.rfind(t2) != -1 else reg_info

    #     return reg_info

    # def get_news_report(self, browser, data):
    #     """获取每个新闻链接内容"""
    #     if data.empty:
    #         return {}

    #     self.logger.info('待爬取新闻链接{}个'.format(data.shape[0]))
    #     res_details = []
    #     for q in range(len(data)):
    #         try:
    #             if q % 5 == 0:  # 5次休眠2s
    #                 time.sleep(2)
    #             url = data['url'][q]
    #             self.logger.info('url:{}, q:{}'.format(url, q))
    #             self.bget(browser, url)
    #             source = browser.page_source
    #             soup = BeautifulSoup(source, 'lxml')

    #             res = {}

    #             # 标题 url
    #             res['title'] = str(soup.find('span', id="thread_subject").string)
    #             res['url'] = url

    #             # 发布时间
    #             reg_info = soup.find('em', id=re.compile("authorposton"))
    #             try:
    #                 res['publish_time'] = reg_info.span['title']
    #             except Exception:
    #                 res['publish_time'] = re.findall('\d+-\d+-\d+ \d+:\d+:\d+', reg_info.string)[0]

    #             # 作者
    #             user_url = soup.find_all('div', class_="authi")[0].a['href']
    #             res['author'] = user_url[user_url.rfind('uid=')+len('uid='):]

    #             # 阅读量 评论量
    #             reg_info = soup.find_all('span', class_="xi1")
    #             res['read_cnt'] = str(reg_info[0].string) if reg_info else None
    #             res['comments_cnt'] = str(reg_info[1].string) if reg_info else None

    #             # cms_id
    #             res['cms_id'] = data['cms_id'][q]

    #             # 文章正文
    #             reg_info = str(soup.find('td', class_="t_f"))
    #             regex = ['本帖最后.*?编辑',
    #                      '\d+-\d+-\d+ \d+:\d+ 上传',
    #                      '\xa0',
    #                      '\d+天前.上传',
    #                      '下载附件',
    #                      '保存到相册',
    #                      '\w+\.(png|jpg|jpeg|gif) \(.*? (KB|MB), 下载次数: \d+\)',
    #                      '来自(苹果|安卓)APP客户端']
    #             res['article'] = article_cleaner(reg_info, regex) if reg_info else None

    #             res_details.append(res)
    #         except Exception:
    #             self.logger.error('url:{}, q:{}, 报错:'.format(url, q),
    #                               exc_info=True)
    #             res_details.append({})

    #     return res_details

    def start_sync(self):
        self.browser = open_browser()

        self.browser = self.login(self.browser)
        df_url_fid38 = self.start_requests(self.browser, 38)  # 信用贷交流模块 fid=38
        df_url_fid39 = self.start_requests(self.browser, 39)  # 网贷问答模块 fid=39
        df_url_fid44 = self.start_requests(self.browser, 44)  # 口子分享模块 fid=44
        df_url = pd.concat([df_url_fid38, df_url_fid39, df_url_fid44], ignore_index=1)
        df_news = self.get_news_report(self.browser, df_url)

        df_news = pd.DataFrame(df_news)
        df_res_fin = df_news

        if df_res_fin.empty:
            return None
        df_res_fin = df_res_fin.where(df_res_fin != '', None)
        df_res_fin = df_res_fin[df_res_fin['cms_id'].notnull()].reset_index(drop=1)
        df_res_fin['create_time'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        return df_res_fin


if __name__ == '__main__':
    process_sync = Sync_qq_docs()
    process_sync.start_sync()