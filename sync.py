# -*- coding: utf-8 -*-
"""
Created on Sun May 15 15:39:36 2022

@author: lianxiangtao
"""

import datetime
import os
import platform
import re
import time

import win32con
import win32gui
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException
from selenium.webdriver import Chrome, DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


# 用户名
USERNAME = os.environ.get("USERNAME")
# chrome 用户资料文件夹
PATH_USER_DATA = rf"C:/Users/{USERNAME}/AppData/Local/Google/Chrome/User Data"
# chromedriver 路径
PATH_CHROMEDRIVER = r"C:/Program Files (x86)/Google/Chrome/Application/chromedriver.exe"
# QRcode 保存文件
QRCODE_PATH = r'qrcode/qrcode.png'
# 结果文件夹
SAVE_PATH = r'result/'

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
            print(f'二维码保存成功 save_status:{save_status}')
        else:
            print('二维码保存失败')

    def qrcode_invalid(self):
        """判断二维码是否失效"""
        try:
            timeStruct = time.localtime(os.path.getmtime(QRCODE_PATH))
            filetime = time.strftime('%Y-%m-%d %H:%M:%S', timeStruct)
            timedetla = datetime.datetime.now() - \
                datetime.datetime.strptime(filetime, '%Y-%m-%d %H:%M:%S')
            return True if timedetla.total_seconds() > 60 else False
        except Exception:
            return True
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
            time.sleep(1)
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

    def login(self):
        '''登录'''
        self.browser.maximize_window()
        self.bget(self.browser, 'https://docs.qq.com/')  # 腾讯文档官网
        # 点击登录按钮
        if self.browser.current_url != 'https://docs.qq.com/desktop/':
            self.browser.find_element(by=By.XPATH,
                                      value='//button[@class="login-btn"]').click()

        # 等待60s直到二维码加载
        WebDriverWait(self.browser, 60).until(
            EC.presence_of_element_located((By.XPATH, '//*[@class="wechat-qrcode"]'))
        )

        self.login_status = self.login_estimate()
        if self.login_status:
            print('自动登录成功')
        else:
            self.qrcode_process()
        time.sleep(2)

    def get_result_mtime_lastest(self):
        filelist = os.listdir(SAVE_PATH)
        if not filelist:
            print('文件夹内无最新文件')
            return
        file_mt = [os.path.getmtime(os.path.join(SAVE_PATH, file))
                   for file in filelist]
        mtime_max = max(file_mt)
        filename_mt_max = filelist[file_mt.index(mtime_max)]
        filepath_mt_max = os.path.join(SAVE_PATH, filename_mt_max)
        abspath_filepath_mt_max = os.path.abspath(filepath_mt_max)
        return abspath_filepath_mt_max, filename_mt_max

    def file_upload_manager(self, realpath):
        time.sleep(2)
        dialog = win32gui.FindWindow('#32770', '打开')  # 对话框  这里的值即上一步winspy检测到的值
        ComboBoxEx32 = win32gui.FindWindowEx(dialog, 0, 'ComboBoxEx32', None)
        ComboBox = win32gui.FindWindowEx(ComboBoxEx32, 0, 'ComboBox', None)
        Edit = win32gui.FindWindowEx(ComboBox, 0, 'Edit', None)  # 上面三句依次寻找对象，直到找到输入框Edit对象的句柄
        button = win32gui.FindWindowEx(dialog, 0, 'Button', None)  # 确定按钮Button
        win32gui.SendMessage(Edit, win32con.WM_SETTEXT, None, realpath)  # 往输入框输入绝对地址
        win32gui.SendMessage(dialog, win32con.WM_COMMAND, 1, button)  # 按button
        time.sleep(2)

    def wait_upload(self, filename):
        check_times = 0
        while check_times < 60:
            source = self.browser.page_source
            soup = BeautifulSoup(source, 'lxml')
            ele_filebox = soup.find('div', class_='ReactVirtualized__Grid__'
                                    'innerScrollContainer')
            filename_lastest = ele_filebox.find('span', class_='title').string
            if filename_lastest == os.path.splitext(filename)[0]:
                print('上传成功')
                return
            time.sleep(1)
            check_times += 1
            print(f'等待上传成功---->{check_times}')

    def upload(self):
        '''
        上传
        '''
        # 取最新结果文件绝对路径
        filepath_abspath, filename = self.get_result_mtime_lastest()
        xpath_btn_upload = '/html/body/div[1]/div[2]/div[2]/div[1]/div/div/div/' \
            'div[1]/div/div[1]/button[2]'
        # 点击导入按钮
        self.browser.find_element(by=By.XPATH, value=xpath_btn_upload).click()
        self.file_upload_manager(filepath_abspath)  # 文件管理器选择文件
        # 点击确定
        xpath_btn_ensure = '/html/body/div[9]/div/div[2]/div/div[4]/button[2]/div'
        self.browser.find_element(by=By.XPATH, value=xpath_btn_ensure).click()
        # 等待上传成功
        self.wait_upload(filename)

    def start_sync(self):
        self.browser = open_browser()

        self.login()  # 登录
        self.upload()  # 上传

        close_browser(self.browser)


if __name__ == '__main__':
    process_sync = Sync_qq_docs()
    process_sync.start_sync()