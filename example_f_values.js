
var gdomain = "http://hqdigi2.eastmoney.com/EM_Quote2010NumericApplication/";
var PicK = "http://hqpick.eastmoney.com/k/";
// var PicN = "//pifm.eastmoney.com/EM_Finance2014PictureInterface/Index.aspx?id={0}{1}&imageType={2}&token=44c9d251add88e27b65ed86506f6e5da";
var PicN = "//webquotepic.eastmoney.com/GetPic.aspx?id={0}{1}&imageType={2}&token=44c9d251add88e27b65ed86506f6e5da";
var token = "4f1862fc3b5e77c150a2b985b12db0fd";
var commonApi = "//push2.eastmoney.com/"; //行情接口通用域名
var tsApi = "//" + (Math.floor(Math.random() * 99) + 1) + ".push2.eastmoney.com/"; //行情接口推送域名
var zxrc = 0; //未登陆或国外用户自选不自刷
var ggrc = 0; //未登陆或国外用户港股不自刷
var isAbroadIp = false;//是否为国外ip
/**
 * 获取url参数
 * @param {string} variable 参数名
 */
function getQueryString(variable) {
    try {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

if (getQueryString("env") === "test") {
    commonApi = "http://61.152.230.207/";
    tsApi = "http://61.152.230.207/";
}


var $x = function (id) { return "string" == typeof id ? document.getElementById(id) : id; };
function inArray(el, array) { for (var i = 0, n = array.length; i < n; i++) { if (array[i] === el) { return true; } } return false; }
function unique(array) { var i = 0, n = array.length, ret = []; for (; i < n; i++) { if (!inArray(array[i], ret)) { ret.push(array[i]); } } return ret; }
function ForDight(Dight, How) { rDight = parseFloat(Dight).toFixed(How); if (rDight == "NaN") { rDight = "--"; } return rDight; }
//显示完整时间
function GetFullWeekTime(time) {
    var dt = new Date(Date.parse(time.replace(/-/g, "/")));
    var day = dt.getDay();
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = arr_week[day];
    return time.replace(" ", " " + week + " ");
}
//刷新本页
function prefresh() {
    window.location.reload();
}
//新版闪烁 
function blinker(num, dom) {
    if (num > 0) {
        dom.addClass('blinkred');
        setTimeout(function () {
            dom.removeClass('blinkred')
        }, 500);
    } else if (num < 0) {
        dom.addClass('blinkgreen');
        setTimeout(function () {
            dom.removeClass('blinkgreen')
        }, 500);
    } else {
        dom.addClass('blinkblue');
        setTimeout(function () {
            dom.removeClass('blinkblue')
        }, 500);
    }

}

//涨跌标记
function udt(vs) {
    if (vs > 0) {
        return "↑";
    } else if (vs < 0) {
        return "↓";
    } else { return ""; }
}

//涨跌颜色
function udcls(vsa, vsb) {
    // vsa = String(vsa).replace("%", "");
    // console.log(vsa)
    // console.log(vsb)
    if (arguments.length == 1) {
        if (vsa > 0) { return "red"; } else if (vsa < 0) { return "green"; } else { return ""; }
    } else {
        // vsb = vsb.replace("%", "");

        if (vsa - vsb > 0) {
            return "red";
        } else if (vsa - vsb < 0) {
            return "green";
        } else {
            return "";
        }
    }
}

//涨跌颜色
function udc(vsa, vsb) {
    vsa = vsa.replace("%", "");
    if (vsb == "" || vsb == null || vsb == "undefined") {
        if (vsa > 0) {
            return "#f00";
        } else if (vsa < 0) {
            return "#090";
        } else {
            return "";
        }
    } else {
        vsb = vsb.replace("%", "");
        if (vsa - vsb > 0) {
            return "#f00";
        } else if (vsa - vsb < 0) {
            return "#090";
        } else {
            return "";
        }
    }
}

//添加百分号
function addPercent(vs) {
    var num = parseFloat(vs), item;
    if (num == 0) {
        item = num.toFixed(2) + "%"
    } else if (num) {
        var abs = Math.abs(num);
        if (abs >= 1000) { //大于10倍的用倍来表示 1000%
            item = (num / 100).toFixed(2) + "倍"
        } else {
            item = num.toFixed(2) + "%";
        }
    } else {
        item = vs;
    }
    return item
}

// 大额现价处理
function bigPriceFun(vs) {
    var num = parseFloat(vs), item;
    if (num >= 0) {
        if (num >= 10000) {
            item = (num / 10000).toFixed(2) + "万"
        } else {
            item = num.toFixed(2);
        }
    } else {
        item = vs
    }
    return item;
}

function showSalePrice(itemdata, $dom, yestoday  ){
    if (itemdata == undefined ){
        return;
    }
    if (itemdata === "" || itemdata == null || itemdata == '-' || itemdata == 0){
        $dom.html('-');
        return;
    };
    // $dom.innerHTML = itemdata.toFixed(2);
    $dom.html(itemdata.toFixed(2));
    // $dom.className = udcls(itemdata, yestoday);
    $dom.addClass(udcls(itemdata, yestoday));
    blinker(itemdata - yestoday, $dom)
}

function showSaleNumber(itemdata, $dom  ){
    if (itemdata == undefined) {
        return;
    }
    if (itemdata === "" || itemdata == null || itemdata == '-' || itemdata == 0) {
        $dom.html('-');
        return;
    };
    // $dom.innerHTML = itemdata;
    $dom.html(itemdata)
    blinker(0, $dom)
}


//涨跌颜色
function udcolor(vsa, vsb) {
    vsa = vsa.replace("%", "");
    if (vsb == "" || vsb == null || vsb == "undefined") {
        if (vsa > 0) {
            return "color:#f00";
        } else if (vsa < 0) {
            return "color:#090";
        } else {
            return "";
        }
    } else {
        vsb = vsb.replace("%", "");
        if (vsa - vsb > 0) {
            return "color:#f00";
        } else if (vsa - vsb < 0) {
            return "color:#090";
        } else {
            return "";
        }
    }
}

//涨跌平判断
function zdp(Pnum) {
    if (Pnum > 0) {
        return 1;
    } else if (Pnum < 0) {
        return -1;
    } else {
        return 0;
    }
}

//增减标记
function fvc(vs) {
    if (vs == 0 || vs == "") {
        return "";
    } else {
        if (vs > 0) {
            return "+" + vs;
        } else {
            return vs;
        }
    }
}

//数字格式化
function ForDight(Dight, How) {
    rDight = parseFloat(Dight).toFixed(How);
    if (rDight == "NaN") {
        rDight = "--";
    }
    return rDight;
}

//数字格式化
function ForWc(Di) {
    var chu = 1;
    var res = Di;
    if (Di > 0 && Di.length >= 6) {
        chu = 6;
    } if (Di < 0 && Di.length >= 7) {
        chu = 6;
    } if (chu == 6) {
        res = ForDight((Di / 10000), 2) + "万";
    }
    return res;
}

//获取市场
function getmarket(cd) {
    var j = cd.substring(0, 3);
    var i = j.substring(0, 1);
    if (i == "5" || i == "6" || i == "9") {
        return "1";
    } else {
        if (j == "009" || j == "126" || j == "110") {
            return "1";
        } else {
            return "2";
        }
    }
}

//写cookies
function WriteCookie(name, value, hours) {
    var expire = "";
    if (hours != null) {
        expire = new Date((new Date()).getTime() + hours * 3600000);
        expire = "; expires=" + expire.toGMTString() + ";path=/;domain=.eastmoney.com";
    }
    document.cookie = name + "=" + escape(value) + expire;
}
//取cookies
function GetCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) {
            return null;
        };
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

function Getcks(key) {
    var result = document.cookie.match(new RegExp(key + "=([^;]*)"));
    return result != null ? unescape(decodeURI(result[1])) : null;
}

//拉长缩短K线
function picklc() {
    KBd.Change('-');
}

//拉长缩短K线
function picksd() {
    KBd.Change('+');
}

/** 
* js截取字符串，中英文都能用 
* @param {string} str: 需要截取的字符串 
* @param {number} len: 需要截取的长度
* @param {string} ellipsis: 溢出文字
* @returns {string} 截取后的字符串
*/
function cutstr(str, len, ellipsis) {
    if (typeof ellipsis != "string") ellipsis = "...";
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    if (str) {
        for (var i = 0; i < str.length; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            //str_cut = str_cut.concat(a);
            if (str_length <= len) {
                str_len++;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length <= len) {
            return str.toString();
        } else {
            return str.substr(0, str_len).concat(ellipsis);
        }
    } else {
        return ""
    }

};

//分时静图地址
function changeimageurl(Code) {
    //测试初始化
    if (window.location.search.indexOf('env=test') > -1) {
        imgurl = "http://61.129.249.32:8870/GetPic.aspx?";
        $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=r');
        //k图
        setTimeout(function () {
            $("#pictit").children("span")[0].click();
        }, 1000);
    };
    $("#actTab4 span").click(function (e) {
        $("#actTab4 span").removeClass("cur");
        $(this).addClass("cur");
        var imgurl = "//webquotepic.eastmoney.com/GetPic.aspx?";

        if (window.location.search.indexOf('env=test') > -1) {
            imgurl = "http://61.129.249.32:8870/GetPic.aspx?";   //http://61.129.249.32:8870/GetPic.aspx?nid=0.300059&imageType=rp
        };

        switch ($(this).attr("data-id")) {
            case "imageper":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=rc');
                break;
            case "imageaf":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=rp')
                break;
            case "image1":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=r')
                break;
            case "image2":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=t&type=M1')
                break;
            case "image3":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=t&type=M2')
                break;
            case "image4":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=t&type=M3')
                break;
            case "image5":
                $("#picr-link img").attr('src', imgurl + 'nid=0.' + Code + '&imageType=t&type=M4')
                break;
        }
        return false;
    });
};

(function () {
    var ggrlN = 0;
    var yestoday = 0;
    var Hyestoday = 0;
    var UKyestoday = 0;
    var zzyestoday = 0;
    function QaDefault(Code, Market, Market_10, Name, HyId, RType, RCode, RMarket, tz, isag, lstng, cektp, ssrq, isxg, tfpxx) {
        //代码，市场_12，市场_10，名称，行业ID，关联类型，关联代码，关联市场, 通知页面刷新, 是否A股, 股票状态, 停牌检查, 上市日期, 是否新股, 停复牌信息
        _this = this; _this._Code = Code; _this._Market = Market; _this._Market_10 = Market_10; _this._Name = Name; _this._HyId = HyId;
        _this._RType = RType; _this._RCode = RCode; _this._RMarket = RMarket; _this.IsNotify = tz; _this.IsAGu = isag; _this.Lstng = lstng;
        _this.CekTp = cektp; _this.Ssrq = ssrq; _this.IsXg = isxg; _this.tfpxx = tfpxx;
        _this.$ = function (id) { return "string" == typeof id ? document.getElementById(id) : id; };
        _this.sansuoNum = 0; _this.cbian = true; _this.sansuo; _this.tempStatus = {}; _this.ColorStatus = {};
        _this.hongdise = function () {
            var span = [_this.$("price9"), _this.$("km1"), _this.$("km2")];
            for (i = 0; i < 3; i++) {
                _this.ColorStatus[i] = (_this.ColorStatus[i]) ? false : true;
                if (_this.cbian && span[i]) {
                    if (!_this.ColorStatus[i]) {
                        _this.tempStatus[i] = span[i].style.color; span[i].style.color = "#000000";
                    } else {
                        span[i].style.color = _this.tempStatus[i];
                    }
                }
            }

            _this.sansuoNum++;
            if (_this.sansuoNum > 6 && _this.$("km1")) {
                clearInterval(_this.sansuo);
                _this.sansuoNum = 0; _this.tempStatus = {}; _this.ColorStatus = {}; _this.cbian = false;
                _this.$("price9").style.color = ""; _this.$("km1").style.color = ""; _this.$("km2").style.color = "";
            }
        };

        //静态图
        changeimageurl(Code);
    };
    QaDefault.prototype = {
        code: "-",
        market: "-",
        init: function () {
            window.quoteIsFirst = true; window.quoteRefresh = 24000 //window.quoteRefresh = 12000;//行情
            window.zxgIsFirst = true; window.zxgRefresh = 30000; window.zxgDisNum = 9; window.favorsetInterval = 0;//自选股

            //window.quoteIsFirst = true; window.quoteRefresh = 12000;//行情
            //window.zxgIsFirst = true; window.zxgRefresh = 15000; window.zxgDisNum = 13; window.favorsetInterval = 0;//自选股

            window.GetTimeZoneInfo = false; window.phIsFirst = true;//行业排名
            _this.bindPageEvent();
            _this.code = _this._Code;
            _this.market = _this._Market;
            //tixing("addTX1", _this._Market, _this._Code);
            tixing("addTX2", _this._Market, _this._Code);
            //createSWF(_this._Code, _this._Market, _this._Name, 578, 276, 565, 415, "1", "0", "");

            //setTimeout(function () { _this.GetFavorList(_this._Code); }, 100);

            // setTimeout(_this.UpZjlx, 500); setInterval(_this.UpZjlx, 300000);//资金流向
            // _this.DISRSI(); setInterval(_this.DISRSI, 60000);//关联股票
            _this.YBCutstr();

            _this.Gethis(); //只渲染头部的最近访问，行情列表不加载
            var timer_history = null;
            $("#tab6 li").mouseover(function () {
                if ($(this).find('h3').html() == "最近访问") {
                    if ($('#history-items tbody tr td').length < 2) {
                        //最近访问
                        _this.Gethis(true);//true是加载行情列表的
                        timer_history = setInterval(function () { _this.Gethis(true) }, 60 * 1000);
                    }
                } else {
                    if (timer_history) {
                        clearInterval(timer_history);
                        $('#history-items tbody').html("");
                    }
                }
            })
            setInterval(function () {
                _this.Gethis()
            }, 30 * 1000);

            // //加自选
            // getUserZW(function (zw) {
            //     //console.log(zw, "初次")
            //     //console.log(getCookie('qgqp_b_id'))
            //     _this.GetFavorList()
            // })

            // setInterval(function () {
            //     getUserZW(function (zw) {
            //         //console.log(zw,"自刷")
            //         _this.GetFavorList()
            //     });
            // }, 60 * 1000)

            //百度隐藏广告
            if (_this.getQueryStringByName("from") == "BaiduAladdin") {
                $("#tbggiframe").hide();
                $("#ifhqheadad").hide();

                $.ajax({
                    url: "//emres.eastmoney.com/public/js/aldtg.js",
                    method: "GET",
                    scriptCharset: 'UTF-8',
                    dataType: "script"
                });

            } else {
                $.ajax({
                    url: "//emres.eastmoney.com/public/js/left.js",
                    method: "GET",
                    scriptCharset: 'UTF-8',
                    dataType: "script"
                });

                $.ajax({
                    url: "/newstatic/js/old/em_news_fixed_right.js",
                    method: "GET",
                    scriptCharset: 'UTF-8',
                    dataType: "script"
                });
            }

            _this.ZJLBind();
            //熔断，沪港通标志
            // _this.IconBind();
            // _this.JYSfun();
            // _this.holidayFun();
            _this.exNameFun();
            _this.GetJGMJ();
        },
        stop: function () {
            clearInterval(this.quoteId);
        },
        /*
         *
         *@description: 修改了quote.eastmoney.com/unify/r/跳转地址，此方法之前已被注释调用，如放开，需要从新测试下面的改动
         *@modifyContent:
         *@author: qiuhongyang
         *@date: 2020-06-02 13:14:07
         *
        */
        IconBind: function () {
            var _this = this;
            var url = "http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&js=((x))&cmd=" + _this.code + _this.market + "&sty=MCSS&st=z&token=de1161e2380d231908d46298ae339369";
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (json) {
                    if (!json || json.stats === false) {
                        $("#hgt_icon").hide();
                        $("#sgt_icon").hide();
                        $("#cdr_icon").hide();
                        $("#rongi").hide();

                        $("#HB-box").hide();
                    }
                    else {
                        var itemlist = json.split(",");
                        $("#hgt_icon").hide();
                        $("#sgt_icon").hide();
                        var hgt = itemlist[4];
                        var rongzi = itemlist[5], crd = itemlist[9], BId = itemlist[6], HId = itemlist[7], BondId = itemlist[8];

                        if (hgt == "沪股通") {
                            $("#hgt_icon").show();
                        } else if (hgt == "深股通") {
                            $("#sgt_icon").show();
                        }

                        if (rongzi == "True") {
                            $("#rongi").show();
                        } else {
                            $("#rongi").hide();
                        }
                        var $Z_box = $("#Z-box");
                        var $H_box = $("#H-box");
                        var $B_box = $("#B-box");
                        $Hb_box.hide();
                        var newMarketNum = itemlist[0] == '1' ? '1' : '0';
                        var unifyUrl = '//quote.eastmoney.com/unify/r/' + newMarketNum + '.' + itemlist[1];
                        if (!isNaN(BId)) {
                            $B_box.show().find("b ").text("B股");
                            $B_box.attr("title", "点击查看关联B股行情");
                            // $B_box.find("a").attr("href", "//quote.eastmoney.com/web/r/" + BId);
                            $B_box.find("a").attr("href", unifyUrl);
                        }
                        if (!isNaN(HId)) {
                            $H_box.show().find("b").text("H股");
                            $H_box.attr("title", "点击查看关联H股行情");
                            // $H_box.find("a").attr("href", " //quote.eastmoney.com/web/r/" + HId);
                            $H_box.find("a").attr("href", unifyUrl);
                        }
                        if (!isNaN(BondId)) {
                            $Z_box.show().find("b").text("可转债");
                            $Z_box.attr("title", "点击查看关联可转债行情");
                            // $Z_box.find("a").attr("href", "//quote.eastmoney.com/web/r/" + BondId);
                            $Z_box.find("a").attr("href", unifyUrl);
                        }


                        if (crd == 1) {
                            $("#cdr_icon").show();
                            $("#relation-container").hide();
                            var $container = $("#quote-digest").css({
                                "border-right": "none",
                                "margin-right": 0
                            });
                            $container.find("table").css("width", 800);
                            var $tr = $container.find("table tr");
                            $tr.each(function (idx, ele) {
                                if (idx === 0) {
                                    $(ele).append("<td>是否盈利：</td><td class='txtl'>" + (itemlist[11] == 0 ? "亏损" : "盈利") + "</td>");
                                }
                                else {
                                    $(ele).append("<td>投票权：</td><td class='txtl'>" + (itemlist[10] == 0 ? "无投票权" : "有投票权") + "</td>");
                                }
                            });

                        } else {
                            $("#cdr_icon").hide();
                        }
                    }
                }
            });
        },
        JYSfun: function () {
            var _this = this;
            var url = "http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&js=((x))&cmd=" + _this.code + _this.market + "&sty=GBIDLTA&st=z&token=de1161e2380d231908d46298ae339369";
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (json) {
                    //console.log(json,"测试Jys")
                    if (!json || json.stats === false) {
                        $("#jys-box").hide();
                    } else {
                        var jys = json.split(",")[5], $Jys = $('#jys-box');
                        if (jys == 2) {
                            $Jys.show().find("b ").text("沪主板");
                            $Jys.attr("title", "该股票在沪主板上市");
                            $Jys.find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sh_a_board");
                        }
                        else if (jys == 6) {
                            $Jys.show().find("b ").text("深主板");
                            $Jys.attr("title", "该股票在深主板上市");
                            $Jys.find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sz_a_board");
                        }
                        else if (jys == 13) {
                            $Jys.show().find("b ").text("中小板");
                            $Jys.attr("title", "该股票在中小板上市");
                            $Jys.find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sme_board");
                        }
                        else if (jys == 80) {
                            $Jys.show().find("b ").text("创业板");
                            $Jys.attr("title", "该股票在创业板上市");
                            $Jys.find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#gem_board");
                        }

                    }
                }
            })
        },
        //节假日判断
        checkHoliday: function (toDay) {
            if (!toDay) return;
            var today = "'" + toDay.replace(/-/g, '/') + "'"; //日期要求加单引号，字符串要加双引号 
            // var today = "'2020/10/08'";
            $.ajax({
                url: encodeURI('//datacenter.eastmoney.com/api/data/get?type=RPTA_WEB_XSRQ&sty=ALL&source=WEB&filter=(mktcode="069001001")(scal=' + today + ')'),
                dataType: 'jsonp',
                jsonp: "callback",
                jsonpCallback: "data",
                // jsonp: 'jsonp_callback',
                success: function (json) {
                    if (json && json.code === 0) {
                        var data = json['result'].data;
                        if (data instanceof Array && data.length > 0) {
                            var time = utils.formatDate(new Date(data[0].scal), "yyyy年MM月dd日"),
                                holiday = data[0].holiday;
                            $('#close-tips').show();
                            $('#quote-time').hide();
                            $('#close-tips .close-tips-msg').text(time + '因' + holiday + '休市');
                        } else {
                            $('#close-tips').hide();
                            $('#quote-time').show();
                        }
                    }
                }
            });
        },
        holidayFun: function () {
            var _this = this;
            var toDay = "";
            $.ajax({
                url: "http://quotationtest.eastmoney.com/api/clock/time/china?fmt=yyyy-MM-dd",
                dataType: "jsonp",
                jsonp: "cb",
                success: function (json) {
                    // console.log(888888888888888)
                    // console.log(json)
                    if (json) {
                        toDay = json.data["Time"];
                        _this.checkHoliday(toDay)
                        // toDay = json.data["Time"];
                        // $.ajax({
                        //     url: "http://api.dataide.eastmoney.com/data/get_xsrq?mktcode=069001001",
                        //     data: { date: toDay },
                        //     dataType: "jsonp",
                        //     jsonp: "jsonp_callback",
                        //     success: function (json) {
                        //         // console.log(json)
                        //         if (json) {
                        //             var data = json.data;

                        //             if (data.length > 0) {
                        //                 var time = _this.formateDate(new Date(data[0].scal), "yyyy年MM月dd日"),
                        //                     holiday = data[0].holiday;
                        //                 $('#close-tips').show();
                        //                 $('#day').hide();
                        //                 $('#close-tips .close-tips-msg').text(time + '因' + holiday + '休市');
                        //             }
                        //             else {
                        //                 $('#close-tips').hide();
                        //                 $('#day').show();
                        //             }
                        //         }

                        //     }
                        // })
                    }

                }
            })

        },
        exNameFun: function () {
            var _this = this;

            function showDate(str) {
                try {
                    var newdate = new Date(str)
                    return newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate()
                }
                catch (error) {
                    return ''
                }
            }

            //新版更名
            $.ajax({
                // url: '//dcfm.eastmoney.com/em_mutisvcexpandinterface/api/js/get?type=ABLS_MB&token=70f12f2f4f091e459a279469fe49eca5&filter=(scode=%27' + _this._Code +'%27)&st=rn&sr=-1',
                url: '//datacenter-web.eastmoney.com/api/data/v1/get?callback=?',
                dataType: "jsonp",
                data: {
                reportName: 'RPT_IPO_ABSTOCK',
                columns: 'SECURITY_CODE,CHANGE_DATE,CHANGE_AFTER_FN,CHANGE_AFTER_AB,TRADE_MARKET_TYPE,RANK,SECUCODE',
                quoteColumns: '',
                filter: '(SECUCODE="' + _this._Code + '.' + (_this._Market_10 == '1' ? 'SH' : 'SZ') + '")',
                pageNumber: 1,
                pageSize: 200,
                sortTypes: 1,
                sortColumns: 'CHANGE_DATE',
                source: 'QuoteWeb',
                client: 'WEB'
              },
                // scriptCharset: "utf-8",
                // jsonp: "cb",
                // accept:"json",
                success: function (json) {  
                    //console.log(json)
                    // if(json.length>1){
                    //     // json = json.reverse()
                    //     $("#stock_change_name").show();
                    //     $("#stock_change_name .rongi").css('display','block');
                    //     // var html = '<span class=usedName>' + json[json.length-1].sname+'</span> &gt;&gt;&gt;';
                    //     var html = ''
                    //     for(var i=0;i<json.length;i++){
                    //         html+='<span class="usedName">'+json[i].sname+'<span class="hasDate">('+showDate(json[i].changedate)+')</span></span>'
                    //         if(i != json.length - 1){
                    //             html += '&gt;&gt;&gt;'
                    //         }
                    //     }
                    //     // html+='<span class="usedName">'+json[json.length-1].sname+'<span class="hasDate">('+showDate(json[json.length-1].changedate)+')</span></span>'
                    //     $('#stock_change_name .shorthandInfo').html(html)
                    // }
                    if(json && json.result && json.result.data instanceof Array && json.result.data.length > 1){
                        // json = json.reverse()
                        $("#stock_change_name").show();
                        $("#stock_change_name .rongi").css('display','block');
                        // var html = '<span class=usedName>' + json[json.length-1].sname+'</span> &gt;&gt;&gt;';
                        var html = ''
                        for(var i=0;i<json.result.data.length;i++){
                            html+='<span class="usedName">'+json.result.data[i].CHANGE_AFTER_FN+'<span class="hasDate">('+(json.result.data[i].CHANGE_DATE).substring(0, 10)+')</span></span>'
                            if(i != json.result.data.length - 1){
                                html += '&gt;&gt;&gt;'
                            }
                        }
                        // html+='<span class="usedName">'+json[json.length-1].sname+'<span class="hasDate">('+showDate(json[json.length-1].changedate)+')</span></span>'
                        $('#stock_change_name .shorthandInfo').html(html)
                    }
                }

            })
        },

        //机构名家
        GetJGMJ: function () {
            var models = [];
            var $html = "";
            var items = [], item_jg = [], item_mj = [];
            //机构
            $.ajax({
                url: "//cmsdataapi.eastmoney.com/api/organization/GetOrganizationArticleByIds?channelIds=9&pageIndex=1&pageSize=5",
                dataType: "jsonp",
                jsonp: "cb",
                success: function (json) {
                    if (!json || !json.Result) { return; }
                    if (json.Result.length > 0) {
                        item_jg = json.Result
                        //console.log(json.Result,"机构")
                    }

                    //名家
                    $.ajax({
                        url: "//cmsdataapi.eastmoney.com/api/author/GetAuthorArticleByIds?channelIds=9&pageIndex=1&pageSize=18",
                        dataType: "jsonp",
                        jsonp: "cb",
                        success: function (data) {
                            if (!data || !data.Result) { return; }
                            if (data.Result.length > 0) {
                                item_mj = data.Result;
                                //console.log(data.Result, "名家")
                            }

                            items = item_jg.concat(item_mj)

                            function distinct(arr) {
                                var result = [],
                                    obj = {};
                                for (var i = 0; i < arr.length; i++) {
                                    if (!obj[arr[i].Art_Code]) {
                                        result.push(arr[i]);
                                        obj[arr[i].Art_Code] = true;
                                    }
                                }
                                return result;
                            };

                            items = distinct(items);

                            for (var i = 0; i < 19; i++) {
                                $html += '<tr><td><a target = "_blank" href = "' + items[i].Art_Url + '" class="jgmj-con" ' +
                                    'title = "' + items[i].Art_Title + '" > ' + cutstr(items[i].Art_Title, 54) + '</a ></td > </tr>';

                            }
                            $("#jgmj-list").html($html);

                        }
                    })


                }
            })



        },

        //资金流JS图
        ZJLBind: function () {

            //$("#tab4 li").eq(1).trigger("mouseover");

            //setTimeout(function() {
            //    $("#tab4 li").eq(0).trigger("mouseover");
            //}, 2000);

        },
        //根据QueryString参数名称获取值
        getQueryStringByName: function (name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        bindPageEvent: function () {//页面事件绑定
            phrankS();//行业个股排行 
            setInterval(function () {
                phrankS();//行业个股排行
            }, 30000);
            _this.DisQuote();
            _this.DisQuote_sse();
            // 分时成交自刷
            this.GetFbFj(_this._Code + "" + _this._Market);
            this.tradeId = setInterval(function () {
                _this.GetFbFj(_this._Code + "" + _this._Market);
            }, window.quoteRefresh);
            if (_this.Lstng == "1") {


                this.quoteId = setInterval(function () {
                    _this.DisQuote();
                    _this.GetAllPKYD();
                }, window.quoteRefresh);


                // _this.GetFbFj_sse(_this._Code + "" + _this._Market);


                _this.GetTimeZone(_this._Code + "" + _this._Market);
                setInterval(function () { _this.GetTimeZone(_this._Code + "" + _this._Market); }, 60000);//时间戳

                // setInterval(function () {_this.UpPic(true);}, 180000);//更新R图和K线
            } else {
                var lststr = "";
                switch (_this.Lstng) { case "0": lststr = "未上市"; break; case "2": lststr = "已退市"; break; case "3": lststr = "暂停上市"; break; case "4": lststr = "终止上市"; break; }
                // _this.$("price9").style.width = "130px";
                _this.$("price9").innerHTML = "<span class=\"lstng\">" + lststr + "</span>";
                _this.$("km1").innerHTML = ""; _this.$("km1").className = "xp3";
                _this.$("km2").innerHTML = ""; _this.$("km2").className = "xp4";
            }
            _this.$("RefPR").onclick = function () { prefresh(); }
            _this.$("hq_cr_close").onclick = function () { _this.$("hq_cr_tips").style.display = "none"; WriteCookie("emhq_cr", "1", 12); };
            _this.$("hq_cr_b").onmouseover = function () { _this.$("hq_cr_tips").style.display = "block"; };
            _this.$("hq_cr_b").onmouseout = function () { _this.$("hq_cr_tips").style.display = "none"; };

            //盘口异动
            this.GetPKYD(_this._Code, _this._Market);
            this.GetAllPKYD();
            // this.GetAllPKYD_sse(_this._Code, _this._Market);    
            // this.GetPKYD_sse(_this._Code, _this._Market);     
            this.positionId = setInterval(function () {
                _this.GetAllPKYD();
                _this.GetPKYD();
            }, window.quoteRefresh);
            //四分位属性
            this.quartile();
            //个股研报
            this.stockReport();
            //行业研报
            this.hyReport();

            // _this.$("refgbauls").onclick = function () {
            //     var dl = _this.$("gbauls").getElementsByTagName("dl");
            //     var sedl = GetRandomNum(0, dl.length - 1);
            //     for (var i = 0; i < dl.length; i++) {
            //         if (i == sedl) {
            //             if (dl[i].hasChildNodes()) {
            //                 var dd = dl[i].childNodes;
            //                 for (var j = 0; j < dd.length; j++) {
            //                     if (dd[j].hasChildNodes()) {
            //                         var ddimg = dd[j].childNodes[0].getElementsByTagName('img')[0];
            //                         if (ddimg && !ddimg.getAttribute('src'))
            //                             ddimg.setAttribute('src', ddimg.getAttribute('data-value'));
            //                     }
            //                 }
            //             }
            //             dl[i].style.display = "";
            //         } else {
            //             dl[i].style.display = "none";
            //         }
            //     }
            // };


            //利润趋势图
            $("#profit_img").hide();
            $("#profit_js").show();

            $("#stockcanlendar").vTicker({
                showItems: 1,
                height: 26
            });
            _this.bindBkList();
            setInterval(_this.bindBkList, 30 * 1000);
            _this.testMethod();
            setInterval(_this.testMethod, 20 * 1000);

        },

        bindBkList: function () {
            //新版所属板块
            var url = commonApi + "api/qt/slist/get?ut=fa5fd1943c7b386f172d6893dbfba10b&spt=3&pi=0&pz=5&po=1&fields=f14,f3,f128,f12,f13,f100,f102,f103&secid=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams;
            //var url = "http://push2.eastmoney.com/api/qt/slist/get?ut=fa5fd1943c7b386f172d6893dbfba10b&spt=3&pi=0&pz=5&po=1&fields=f14,f3,f128,f12,f13,f100,f102,f103&secid=" + _this._Market_10 +"."+ _this._Code;
            jQuery.ajax({
                url: url,
                dataType: "jsonp",
                scriptCharset: "utf-8",
                jsonp: "cb",
                success: function (json) {
                    // console.log(json)
                    var html = "";
                    var item = [];
                    if (!(json.data)) return;
                    var count = json.data.total >= 5 ? 5 : json.data.total;
                    for (var i = 0; i < count; i++) {
                        item = json.data.diff[i];
                        if (!item) return;
                        var color = item.f3 >= 0 ? "red" : "green";
                        // var market = item.f141 == "1" ? "sh" : "sz";
                        // if(item.f140){
                        //     html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/center/boardlist.html#boards-' + item.f13+'.'+item.f12 + '" target="_blank" title="' + item.f14 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                        //     '<td class="' + color + '">' + (item.f3/100).toFixed(2)+'%' + '</td><td><a href="http://quote.eastmoney.com/' + market + item.f140 + '.html" target="_blank" title="' + item.f128 + '">' + cutstr(item.f128, 8) + '</a></td></tr>';
                        // }else{
                        //     html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/center/boardlist.html#boards-' + item.f13+'.'+item.f12 + '" target="_blank" title="' + item.f14 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                        //     '<td class="' + color + '">' + (item.f3/100).toFixed(2)+'%' + '</td><td><a>' +'-  ' + '</a></td></tr>';
                        // }
                        var market = item.f141 + '.';
                        if (item.f140) {
                            html += '<tr><td class="nm"><a href="//quote.eastmoney.com/center/boardlist.html#boards2-90.'+item.f12+'" target="_blank" title="' + item.f14 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                                '<td class="' + color + '">' + (item.f3 / 100).toFixed(2) + '%' + '</td><td><a href="http://quote.eastmoney.com/unify/r/' + item.f141 + '.' + item.f140 + '" target="_blank" title="' + item.f128 + '">' + cutstr(item.f128, 8) + '</a></td></tr>';
                        } else {
                            html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/center/boardlist.html#boards2-90.' + item.f12 + '" target="_blank" title="' + item.f14 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                                '<td class="' + color + '">' + (item.f3 / 100).toFixed(2) + '%' + '</td><td><a>' + '-  ' + '</a></td></tr>';
                        }

                    }
                    $("#zjlxbk").html(html);

                }
            });
            //新版所属板块推送
            // var sseurl = "http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/slist/sse?fid=f3&ut=fa5fd1943c7b386f172d6893dbfba10b&spt=3&pi=0&pz=5&po=1&fields=f14,f3,f128,f12,f13&secid=" + _this._Market_10 +"."+ _this._Code;
            // var evtSource = new EventSource(sseurl);
            // evtSource.onmessage = function (msg) {
            //     var json = msg.data;
            //     // console.log(json)
            //     var html = "";
            //     var item=[];
            //     if(json.data){
            //         for (var i = 0; i < 5; i++) {
            //             item = json.data.diff[i];
            //             var color = item.f3 >= 0 ? "red" : "green";
            //             var market = item.f141 == "1" ? "sh" : "sz";
            //             html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/center/boardlist.html#boards-' + item.f13+'.'+item.f12 + '" target="_blank" title="' + item.f14 + '">' + cutstr(item.f14, 8) + '</a></td>' +
            //                 '<td class="' + color + '">' + item.f3/100+'%' + '</td><td><a href="http://quote.eastmoney.com/' + market + item.f140 + '.html" target="_blank" title="' + item.f128 + '">' + cutstr(item.f128, 8) + '</a></td></tr>';
            //         }
            //         $("#zjlxbk").html(html);
            //     }

            // }
        },
        testMethod: function () {
            //if (Math.random() > 0.7) return;
            // 图片导流测试
            // http://61.129.129.78:8870/GetPic.aspx?id=0,300059&tpl=R&period=1 
            //var _image = document.createElement("img");
            //var begin = +(new Date);
            //console.log('begin', begin);
            //_image.setAttribute('src', 'http://61.129.129.78:8870/GetPic.aspx?id=' + _this._Market_10 + ',' + _this._Code + '&tpl=R&period=1&_=' + begin);
            //_image.onload = _image.onreadystatechange = function (e) {
            //    if (!_image.readyState || /loaded|complete/.test(_image.readyState)) {
            //        // Handle memory leak in IE
            //        _image.onload = _image.onreadystatechange = null;
            //        // Callback if not abort
            //        console.log('successful', +(new Date));
            //    }
            //}
        },
        Bian: function (dt) {//是否在开盘期间
            var res = false;
            var hs = dt.getHours();
            var ms = dt.getMinutes();
            if (hs >= 9 && hs <= 11) {
                res = true;
                if ((hs == 11) && ms >= 30)
                    res = false;
            }
            if (hs >= 13 && hs < 15) { res = true; }
            return res;
        },
        PanQian: function (dt) {//是否在盘前期间
            var res = false;
            var hs = dt.getHours();
            var ms = dt.getMinutes();
            if (hs == 9) { if ((ms >= 14) && ms < 29) { res = true; } }
            return res;
        },
        setPicrTab: function (iftm) {
            var izpz = _this.Bian(iftm);
            if (izpz) {
                var res = _this.PanQian(iftm);
                if (res) {
                    if (_this.$("image_box").style.display != "none") {
                        _this.UpPic(false, true);
                    } else {
                        setTimeout(function () {
                            flyqd(8);
                        }, 5000);
                    }
                }
                else {
                    if (_this.$("image_box").style.display != "none") {
                        _this.UpPic(false, false);
                    } else {
                        setTimeout(function () {
                            flyqd(0);
                        }, 5000);
                    }
                }
            }
        },
        GetTimeZone: function (id) {//系统时间
            var ua = navigator.userAgent.toLowerCase();
            window.GetTimeZoneInfo = true;
            //     if (/ipad/i.test(ua)) {
            //         window.GetTimeZoneInfo = true;
            //     } else {
            //         $.getScript("http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&cmd=" + id + "&sty=HC&st=z&sr=&p=&ps=&cb=&js=var%20bjTime=(x)&token=4f1862fc3b5e77c150a2b985b12db0fd", function () {
            //             var dt = new Date(window.bjTime);
            //             window.GetTimeZoneInfo = _this.Bian(dt);
            //             _this.setPicrTab(dt);
            //             var Notify = window["Notify"];
            //             //if (Notify != "undefined" && Notify != "" && !window.Notifyed && _this.IsNotify) {
            //             //    if (Notify == 0) {
            //             //        clearInterval(window.NotifyS);
            //             //    } else {
            //             //        //_this.NotifyPage(Notify * 60000);
            //             //    }
            //             //}
            //             //if (_this.tfpxx != "") { _this.DisTfpxx(); }                   
            //         });

            //     }
        },
        NotifyPage: function (num) {//通知页面刷新
            window.Notifyed = true; window.NotifyS = setInterval("prefresh()", num);
        },
        ImgHtml: function (model) {
            var mathNum = Math.floor(Math.random() * 100);
            var Tr = '<tr>' +
                '<td><a title="' + model.name + '" href="' + model.link + '" target="_blank">' + cutstr(model.name, 8, '..') + '<br>' + cutstr(model.code, 8, '..') + '</a></td>' +
                '<td class="' + model.color + '">' + model.price + '<br>' + model.changePercent + '</td>' +
                '<td class="img-td"><a href="' + model.link + '" target="_blank" title="点击查看' + model.name + '分时图">' +
                ' <img   src="' + model.dataSrc + mathNum + '" data-src= "' + model.dataSrc + '"  >' +
                '</a ></td > ' +
                '</tr > ';
            return Tr;
        },



        // 最近访问和最近访问列表
        Gethis: function (status) {
            var _hismarket = "1";
            if (_this._Market_10 == "1") { _hismarket = "sh"; } else { _hismarket = "sz"; }
            var arg = { def: "", set: "a-" + _hismarket + "-" + _this._Code + "-" + _this._Name, lns: 11 };
            var HV = new HistoryViews("historyest", arg);
            //console.log(HV)           

            //var dis = $("#historyBox").css("display");
            if (status) {
                _this.HistoryList(HV);
            }

            //    timer = setInterval(function () { _this.HistoryList(HV); }, 30 * 1000)
            //})
            //$("#tab6 li").eq(0).mouseover(function () { 
            //    clearInterval(timer)
            //});                     

        },

        //最近访问列表
        HistoryList: function (hv) {
            var hvArr = hv.ret ? hv.ret : null;
            var ids = [];
            var len = hvArr.length;
            for (var i = 0; i < len; i++) {
                var arr = hvArr[i].split('-');
                var code = "", market = "";
                if (arr[0] && arr[0] !== 'undefined') {
                    if (arr[0] === 'sh') {
                        market = "1";
                    } else if (arr[0] === 'sz') {
                        market = "0";
                    } else {
                        market = arr[0];
                    }
                };
                if (arr[1]) { code = arr[1] };

                ids.push(market + '.' + code);
            }
            // console.log(ids)        
            _this.RenderHistoryList(ids)

        },
        RenderHistoryList: function (ids) {
            if (ids && ids.length > 0) {
                var secid = ids.join(',');
            } else {
                var secid = '';
            }
            // console.log(secid)
            // var ab = ['2', '3', '6', '7', '13', '80'];
            //var _url = '//push2.eastmoney.com/api/qt/ulist.np/get?fields=f12,f13,f14,f2,f1,f3,f152&invt=2&';
            var _url = commonApi + 'api/qt/ulist.np/get?fields=f12,f13,f14,f2,f1,f3,f152&invt=2&ut=fa5fd1943c7b386f172d6893dbfba10b' + '&wbp2u=' + delayparams;

            $.ajax({
                url: _url,
                data: { secids: secid },
                dataType: "jsonp",
                jsonp: "cb",
                success: function (json) {
                    //console.log(json)          
                    if (json && json.data && json.data.diff && json.data.diff instanceof Array) {
                        var models = [], historyHtml = '';
                        // 最多显示6条
                        var len = json.data.diff.length > 6 ? 6 : json.length;
                        for (var i = 0; i < json.data.diff.length; i++) {
                            // if (typeof json[i] !== 'string') break;
                            var items = json.data.diff[i];
                            var model;
                            model = {
                                id: items.f13 + '.' + items.f12,
                                code: items.f12,
                                market: items.f13 === '1' ? 'sh' : 'sz',
                                name: items.f14,
                                //close: items[3],
                                changePercent: typeof (items.f3) == 'number' ? addPercent(items.f3 * Math.pow(10, -items.f152).toFixed(items.f152)) : '-',
                                price: Number(items.f2) >= 0 ? (items.f2 * Math.pow(10, -items.f1)).toFixed(items.f1) : '-',
                                // jys: items[6],
                                color: udcls(items.f3),
                                dataSrc: "//webquotepic.eastmoney.com/GetPic.aspx?nid=" + items.f13 + '.' + items.f12 + "&imageType=RJY&token=44c9d251add88e27b65ed86506f6e5da"
                            }
                            // console.log(model)
                            // var link = model.market + model.code + '.html';

                            var link = (items.f13 == '1' ? '1' : '0') + '.' + model.code;
                            model.link = '//quote.eastmoney.com/unify/r/' + model.id;
                            if (i < 6) {
                                var _tr = _this.ImgHtml(model);
                                historyHtml += _tr;
                            }
                        }
                        $('#history-items tbody').html(historyHtml);
                    }
                }
            });
        },
        GetFbFj: function (cd) {
            var _num = 10;
            _this.$("fblist").className = "line22";
            //if ($("#flash_box").is(":visible")) {
            //    _num = window.fbfjDisNum = 20;

            //} else {
            //    _num = window.fbfjDisNum = 17;
            //    _this.$("fblist").className = "line22";
            //}

            //新版分时成交commonApi
            //http://push2.eastmoney.com/
            $.ajax({
                url: commonApi + "api/qt/stock/details/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&pos=-11&secid=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams,
                dataType: "jsonp",
                jsonp: "cb",
                beforeSend: function () {
                    $("#fblist").html('<td colspan="3" style="height: 249px; text-align: center;" class="waiting ">加载中...</td>');
                },
                success: function (json) {
                    //t-时间，p-价格，v-成交量，bs-内外盘，wh-仓差，type-性质，vc-成交笔数或增仓量,pch-方向
                    //内外盘：1:内盘(流出) 2:外盘(流入) 3:未知 4:集合竞价
                    // console.log(json)
                    if (!json.data) return;

                    if (!json || !(json.data.details.length)) {
                        //var height = _num == 21 ? 462 : 396;
                        var height = " 271px";
                        $("#fblist").html("<tr><td colspan=3 style='height: " + height + "px;text-align:center'>暂无数据</td></tr>");
                        $("#vvcc .more3").hide();
                        return;
                    }
                    var pc = parseFloat(json.data.prePrice), $tbody = $("<tbody></tbody>");
                    var price = [];
                    for (var i = 0; i < json.data.details.length; i++) {
                        price.push(parseFloat(json.data.details[i].substring(9, 14)))
                    }
                    // console.log(JSON.stringify(price))
                    var pch = [];
                    for (var i = 0; i < price.length - 1; i++) {
                        pch[i] = price[i + 1] - price[i];
                    }
                    // console.log(pch)
                    var data = [];
                    var singledata = [];
                    for (var i = 1; i < json.data.details.length; i++) {
                        // console.log()
                        // data.push(json.data.details[i]);
                        singledata = JSON.stringify(json.data.details[i])
                        data = singledata.split(',');
                        data[0] = data[0].substring(1);
                        data[4] = data[4].substring(0, 1);
                        // console.log(data)
                        var $tr = $("<tr></tr>"),

                            priceColor = data[4] != 4 ? data[1] - pc > 0 ? "red" : data[1] - pc < 0 ? "green" : "#333333" : "",
                            dir = pch[i - 1] < 0 ? "↓" : pch[i - 1] > 0 ? "↑" : "",
                            dir_c = pch[i - 1] < 0 ? "green" : pch[i - 1] > 0 ? "red" : "",
                            vp = data[2] * data[1] * 100 * (data[4] == 1 ? -1 : data[4] == 2 ? 1 : 0),
                            v_c = data[4] != 4 ? vp >= 200000 ? "#ff00ff" : vp > 0 ? "red" : vp <= -200000 ? "#14c3dc" : vp < 0 ? "green" : "" : "";

                        $("<td />").text(data[0]).appendTo($tr);
                        $("<td />").text(data[1]).css("color", priceColor).appendTo($tr);
                        $("<td class=jtTd />")
                            .append($("<span />").text(data[2]).css("color", v_c))
                            .append($("<span class=jtIcon />").text(dir).css("color", dir_c))
                            .appendTo($tr);
                        $tbody.append($tr);
                    }
                    // console.log(data)
                    // for (var i = 1; i < json.data.details.length; i++) {
                    //     $tbody.append("<tr><td>-</td><td>-</td><td>-</td></tr>");
                    // }
                    $("#fblist").html($tbody.html());
                    // // 修改盘口异动边框高度
                    // //$("#pkydList").height($("#vvcc").outerHeight(true));
                }
            });
        },
        //新版分时成交推送
        GetFbFj_sse: function (cd) {
            var url = "http://" + (Math.floor(Math.random() * 99) + 1) + ".push2.eastmoney.com/api/qt/stock/details/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&pos=-11&secid=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams;
            var evtSource = new EventSource(url);
            evtSource.onmessage = function (json) {
                // console.log(json.data)
                if (!json || !(json.data.details)) {
                    //var height = _num == 21 ? 462 : 396;
                    // var height = " 271px";
                    // $("#fblist").html("<tr><td colspan=3 style='height: " + height + "px;text-align:center'>暂无数据</td></tr>");
                    return;
                }
                var pc = parseFloat(json.data.prePrice), $tbody = $("<tbody></tbody>");
                var price = [];
                for (var i = 0; i < json.data.details.length; i++) {
                    price.push(parseFloat(json.data.details[i].substring(9, 14)))
                }
                // console.log(JSON.stringify(price))
                var pch = [];
                for (var i = 0; i < price.length - 1; i++) {
                    pch[i] = price[i + 1] - price[i];
                }
                // console.log(pch)
                var data = [];
                var singledata = [];
                for (var i = 1; i < json.data.details.length; i++) {
                    // console.log()
                    // data.push(json.data.details[i]);
                    singledata = JSON.stringify(json.data.details[i])
                    data = singledata.split(',');
                    data[0] = data[0].substring(1);
                    data[4] = data[4].substring(0, 1);
                    // console.log(data)
                    var $tr = $("<tr></tr>"),

                        priceColor = data[4] != 4 ? data[1] - pc > 0 ? "red" : data[1] - pc < 0 ? "green" : "#333333" : "",
                        dir = pch[i - 1] < 0 ? "↓" : pch[i - 1] > 0 ? "↑" : "",
                        dir_c = pch[i - 1] < 0 ? "green" : pch[i - 1] > 0 ? "red" : "",
                        vp = data[2] * data[1] * 100 * (data[4] == 1 ? -1 : data[4] == 2 ? 1 : 0),
                        v_c = data[4] != 4 ? vp >= 200000 ? "#ff00ff" : vp > 0 ? "red" : vp <= -200000 ? "#14c3dc" : vp < 0 ? "green" : "" : "";

                    $("<td />").text(data[0]).appendTo($tr);
                    $("<td />").text(data[1]).css("color", priceColor).appendTo($tr);
                    $("<td />")
                        .append($("<span />").text(data[2]).css("color", v_c))
                        .append($("<span />").text(dir).css("color", dir_c))
                        .appendTo($tr);
                    $tbody.append($tr);
                }
                // console.log(data)
                // for (var i = 1; i < json.data.details.length; i++) {
                //     $tbody.append("<tr><td>-</td><td>-</td><td>-</td></tr>");
                // }
                $("#fblist").html($tbody.html());
            }
        },
        // 新版个股异动数据
        GetPKYD: function (code, market) {
            $.ajax({
                //url: "http://push2.eastmoney.com/api/qt/pkyd/get?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f2,f3,f4,f5,f6,f7&secids=" + _this._Market_10 + "." + _this._Code,
                url: commonApi + "api/qt/pkyd/get?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f2,f3,f4,f5,f6,f7&secids=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams,
                dataType: "jsonp",
                scriptCharset: "utf-8",
                jsonp: "cb",
                success: function (msg) {
                    // console.log('个股异动')
                    // console.log(msg)
                    var json = msg.data;
                    if(!json)return false;
                    var trs = [];
                    var length = json.pkyd.length >= 5 ? 5 : json.pkyd.length
                    if (json.pkyd instanceof Array) {
                        for (var i = 0; i < length; i++) {
                            // if (typeof json.pkyd[i] !== "string") continue;
                            var items = json.pkyd[i].split(',');
                            var color = '';
                            var ydtype = '';
                            if (items[4] == 1) {
                                ydtype = '有大买盘'
                                color = 'red';
                            }
                            if (items[4] == 2) {
                                ydtype = '大笔买入'
                                color = 'red';
                            }
                            if (items[4] == 101) {
                                ydtype = '有大卖盘'
                                color = "green"
                            }
                            if (items[4] == 102) {
                                ydtype = '大笔卖出'
                                color = "green"
                            }
                            if (items[4] == 201) {
                                ydtype = '封涨停板'
                                color = 'red';
                            }
                            if (items[4] == 202) {
                                ydtype = '打开涨停'
                                color = "green"
                            }
                            if (items[4] == 203) {
                                ydtype = '高开5日线'
                                color = 'red';
                            }
                            if (items[4] == 204) {
                                ydtype = '60日新高'
                                color = 'red';
                            }
                            if (items[4] == 301) {
                                ydtype = '封跌停板'
                                color = "green"
                            }
                            if (items[4] == 302) {
                                ydtype = '打开跌停'
                                color = 'red';
                            }
                            if (items[4] == 303) {
                                ydtype = '低开5日线'
                                color = "green"
                            }
                            if (items[4] == 304) {
                                ydtype = '60日新低'
                                color = "green"
                            }
                            if (items[4] == 401) {
                                ydtype = '向上缺口'
                                color = 'red';
                            }
                            if (items[4] == 402) {
                                ydtype = '火箭发射'
                                color = 'red';
                            }
                            if (items[4] == 403) {
                                ydtype = '快速反弹'
                                color = 'red';
                            }
                            if (items[4] == 404) {
                                ydtype = '竞价上涨'
                                color = 'red';
                            }
                            if (items[4] == 405) {
                                // ydtype = '60日大幅上涨'
                                ydtype = '大幅上涨'
                                color = 'red';
                            }
                            if (items[4] == 501) {
                                ydtype = '向下缺口'
                                color = "green"
                            }
                            if (items[4] == 502) {
                                ydtype = '高台跳水'
                                color = "green"
                            }
                            if (items[4] == 503) {
                                ydtype = '快速下跌'
                                color = "green"
                            }
                            if (items[4] == 504) {
                                ydtype = '竞价下跌'
                                color = "green"
                            }
                            if (items[4] == 505) {
                                // ydtype = '60日大幅下跌'
                                ydtype = '大幅下跌'
                                color = "green"
                            }
                            var $tr = $("<tr></tr>")
                                .append("<td>" + items[0] + "</td>")
                                .append("<td class=" + color + ">" + ydtype + "</td>")
                                .append("<td class=" + color + ">" + items[5] + "</td>");
                            trs.push($tr);
                        }
                    }
                    if (trs.length > 0) {
                        $("#pkydList tbody").html("").append(trs);
                    }
                    else {
                        $("#pkydList").hide();
                        $("#plydUl").removeClass("tab1").find("li[value=2]").hide();
                        $(".changeList[value=1]").show();
                    }
                }
            });

        },
        //新版盘口异动推送
        GetPKYD_sse: function (code, market) {
            //var url="http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/pkyd/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f4,f5&secids=" + _this._Market_10 +"."+ _this._Code;
            var url = tsApi + "api/qt/pkyd/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f4,f5&secids=" + _this._Market_10 + "." + _this._Code;
            var evtSource = new EventSource(url);
            evtSource.onmessage = function (msg) {
                // console.log(msg.data)
                var json = msg.data;
                var trs = [];
                var length = json.pkyd.length >= 5 ? 5 : json.pkyd.length
                if (json.pkyd instanceof Array) {
                    for (var i = 0; i < length; i++) {
                        // if (typeof json.pkyd[i] !== "string") continue;
                        var items = json.pkyd[i].split(',');
                        var color = items[6] == 1 ? "red" : "green";
                        var ydtype = '';
                        if (items[4] == 1) {
                            ydtype = '有大买盘'
                        }
                        if (items[4] == 2) {
                            ydtype = '大笔买入'
                        }
                        if (items[4] == 101) {
                            ydtype = '有大卖盘'
                        }
                        if (items[4] == 102) {
                            ydtype = '大笔卖出'
                        }
                        if (items[4] == 201) {
                            ydtype = '封涨停板'
                        }
                        if (items[4] == 202) {
                            ydtype = '打开涨停'
                        }
                        if (items[4] == 203) {
                            ydtype = '高开5日线'
                        }
                        if (items[4] == 204) {
                            ydtype = '60日新高'
                        }
                        if (items[4] == 301) {
                            ydtype = '封跌停板'
                        }
                        if (items[4] == 302) {
                            ydtype = '打开跌停'
                        }
                        if (items[4] == 303) {
                            ydtype = '低开5日线'
                        }
                        if (items[4] == 304) {
                            ydtype = '60日新低'
                        }
                        if (items[4] == 401) {
                            ydtype = '向上缺口'
                        }
                        if (items[4] == 402) {
                            ydtype = '火箭发射'
                        }
                        if (items[4] == 403) {
                            ydtype = '快速反弹'
                        }
                        if (items[4] == 404) {
                            ydtype = '竞价上涨'
                        }
                        if (items[4] == 405) {
                            ydtype = '60日大幅上涨'

                        }
                        if (items[4] == 501) {
                            ydtype = '向下缺口'
                        }
                        if (items[4] == 502) {
                            ydtype = '高台跳水'
                        }
                        if (items[4] == 503) {
                            ydtype = '快速下跌'
                        }
                        if (items[4] == 504) {
                            ydtype = '竞价下跌'
                        }
                        if (items[4] == 505) {
                            ydtype = '60日大幅下跌'
                        }
                        var $tr = $("<tr></tr>")
                            .append("<td>" + items[0] + "</td>")
                            .append("<td><a target=_blank href=//quote.eastmoney.com/changes/stocks/" + items[1] + ".html>" + cutstr(items[3], 8, "..") + "</a></td>")
                            .append("<td class=" + color + ">" + ydtype + "</td>");
                        trs.push($tr);
                    }
                }
                if (trs.length > 0) {
                    $("#allPkyd tbody").html("").append(trs);
                }
                else {
                    $("#pkydList").hide();
                    $("#plydUl").removeClass("tab1").find("li[value=2]").hide();
                    $(".changeList[value=1]").show();
                }
            }
        },
        //新版盘口异动推送
        GetAllPKYD_sse: function (code, market) {
            //var url="http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/pkyd/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f4,f5&secid=" + _this._Market_10 +"."+ _this._Code;
            var url = tsApi + "api/qt/pkyd/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f4,f5&secid=" + _this._Market_10 + "." + _this._Code;
            var evtSource = new EventSource(url);
            evtSource.onmessage = function (msg) {
                // console.log(msg.data)
                var json = msg.data;
                var trs = [];
                var length = json.pkyd.length >= 5 ? 5 : json.pkyd.length
                if (json.pkyd instanceof Array) {
                    for (var i = 0; i < length; i++) {
                        // if (typeof json.pkyd[i] !== "string") continue;
                        var items = json.pkyd[i].split(',');
                        var color = items[6] == 1 ? "red" : "green";
                        var ydtype = '';
                        if (items[4] == 1) {
                            ydtype = '有大买盘'
                        }
                        if (items[4] == 2) {
                            ydtype = '大笔买入'
                        }
                        if (items[4] == 101) {
                            ydtype = '有大卖盘'
                        }
                        if (items[4] == 102) {
                            ydtype = '大笔卖出'
                        }
                        if (items[4] == 201) {
                            ydtype = '封涨停板'
                        }
                        if (items[4] == 202) {
                            ydtype = '打开涨停'
                        }
                        if (items[4] == 203) {
                            ydtype = '高开5日线'
                        }
                        if (items[4] == 204) {
                            ydtype = '60日新高'
                        }
                        if (items[4] == 301) {
                            ydtype = '封跌停板'
                        }
                        if (items[4] == 302) {
                            ydtype = '打开跌停'
                        }
                        if (items[4] == 303) {
                            ydtype = '低开5日线'
                        }
                        if (items[4] == 304) {
                            ydtype = '60日新低'
                        }
                        if (items[4] == 401) {
                            ydtype = '向上缺口'
                        }
                        if (items[4] == 402) {
                            ydtype = '火箭发射'
                        }
                        if (items[4] == 403) {
                            ydtype = '快速反弹'
                        }
                        if (items[4] == 404) {
                            ydtype = '竞价上涨'
                        }
                        if (items[4] == 405) {
                            ydtype = '60日大幅上涨'
                        }
                        if (items[4] == 501) {
                            ydtype = '向下缺口'
                        }
                        if (items[4] == 502) {
                            ydtype = '高台跳水'
                        }
                        if (items[4] == 503) {
                            ydtype = '快速下跌'
                        }
                        if (items[4] == 504) {
                            ydtype = '竞价下跌'
                        }
                        if (items[4] == 505) {
                            ydtype = '60日大幅下跌'
                        }
                        var $tr = $("<tr></tr>")
                            .append("<td>" + items[0] + "</td>")
                            .append("<td><a target=_blank href=//quote.eastmoney.com/changes/stocks/" + items[1] + ".html>" + cutstr(items[3], 8, "..") + "</a></td>")
                            .append("<td class=" + color + ">" + ydtype + "</td>");
                        trs.push($tr);
                    }
                }
                if (trs.length > 0) {
                    $("#allPkyd tbody").html("").append(trs);
                }
                else {
                    $("#pkydList").hide();
                    $("#plydUl").removeClass("tab1").find("li[value=2]").hide();
                    $(".changeList[value=1]").show();
                }
            }
        },
        // 新版盘口异动数据
        GetAllPKYD: function () {
            $.ajax({
                //url: "http://push2.eastmoney.com/api/qt/pkyd/get?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f2,f3,f4,f5,f6,f7&secid=" + _this._Market_10 +"."+ _this._Code,
                url: commonApi + "api/qt/pkyd/get?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=5&fields=f1,f2,f3,f4,f5,f6,f7&secid=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams,
                dataType: "jsonp",
                scriptCharset: "utf-8",
                jsonp: "cb",
                success: function (msg) {
                    // console.log('盘口异动')
                    // console.log(msg)
                    var json = msg.data;
                    if (!json) return false;
                    var trs = [];
                    var length = json.pkyd.length >= 5 ? 5 : json.pkyd.length
                    if (json.pkyd instanceof Array) {
                        for (var i = 0; i < length; i++) {
                            // if (typeof json.pkyd[i] !== "string") continue;
                            var items = json.pkyd[i].split(',');
                            var color = items[6] == 1 ? "red" : "green";
                            var ydtype = '';
                            if (items[4] == 1) {
                                ydtype = '有大买盘'
                            }
                            if (items[4] == 2) {
                                ydtype = '大笔买入'
                            }
                            if (items[4] == 101) {
                                ydtype = '有大卖盘'
                            }
                            if (items[4] == 102) {
                                ydtype = '大笔卖出'
                            }
                            if (items[4] == 201) {
                                ydtype = '封涨停板'
                            }
                            if (items[4] == 202) {
                                ydtype = '打开涨停'
                            }
                            if (items[4] == 203) {
                                ydtype = '高开5日线'
                            }
                            if (items[4] == 204) {
                                ydtype = '60日新高'
                            }
                            if (items[4] == 301) {
                                ydtype = '封跌停板'
                            }
                            if (items[4] == 302) {
                                ydtype = '打开跌停'
                            }
                            if (items[4] == 303) {
                                ydtype = '低开5日线'
                            }
                            if (items[4] == 304) {
                                ydtype = '60日新低'
                            }
                            if (items[4] == 401) {
                                ydtype = '向上缺口'
                            }
                            if (items[4] == 402) {
                                ydtype = '火箭发射'
                            }
                            if (items[4] == 403) {
                                ydtype = '快速反弹'
                            }
                            if (items[4] == 404) {
                                ydtype = '竞价上涨'
                            }
                            if (items[4] == 405) {
                                // ydtype = '60日大幅上涨'
                                ydtype = '大幅上涨'
                            }
                            if (items[4] == 501) {
                                ydtype = '向下缺口'
                            }
                            if (items[4] == 502) {
                                ydtype = '高台跳水'
                            }
                            if (items[4] == 503) {
                                ydtype = '快速下跌'
                            }
                            if (items[4] == 504) {
                                ydtype = '竞价下跌'
                            }
                            if (items[4] == 505) {
                                // ydtype = '60日大幅下跌'
                                ydtype = '大幅下跌'
                            }
                            var market = items[2] == "1" ? "sh" : "sz";
                            var $tr = $("<tr></tr>")
                                .append("<td>" + items[0] + "</td>")
                                .append("<td><a target=_blank href=//quote.eastmoney.com/changes/stocks/" + market + items[1] + ".html>" + cutstr(items[3], 8, "..") + "</a></td>")
                                .append("<td class=" + color + ">" + ydtype + "</td>");
                            trs.push($tr);
                        }
                    }
                    if (trs.length > 0) {
                        $("#allPkyd tbody").html("").append(trs);
                    }
                    else {
                        $("#pkydList").hide();
                        $("#plydUl").removeClass("tab1").find("li[value=2]").hide();
                        $(".changeList[value=1]").show();
                    }
                }
            });
        },
        Setudclass: function (zd) {
            var hqcr = _this.$("arrowud").getAttribute("xid");
            if (zd > 0) {
                _this.$("arrowud").className = hqcr == "1" ? "cr red" : "red";
                _this.$("arrow-find").className = "xp2 up-arrow";
            } else if (zd < 0) {
                _this.$("arrowud").className = hqcr == "1" ? "cr green" : "green";
                _this.$("arrow-find").className = "xp2 down-arrow";
            } else {
                _this.$("arrowud").className = hqcr == "1" ? "cr" : "";
                _this.$("arrow-find").className = "";
            }
        },


        //格式化转债相关时间
        formatymd: function (str) {
            if (!str || str == '-') { return "" };
            var back = Number(str.split(' ')[0].replace(/-/g, ''));
            return back
        },
        
        //格式化转债相关时间
        formatymd2: function (str) {
            if (!str || str == '-') { return "" };
            var back = str.split(' ')[0]
            return back
        },

        getcurtime: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var back = Number(year + '' + month + '' + day);
            return back
        },

        //可转债处理
        kzzFun: function (marketzhai, quotedata, zzcolor) {
            var that = this;
            var bondcode = quotedata.data.f262;
            // console.info(arguments)
            // var bondcode = '123043'
            $.ajax({
                // url: "//dcfm.eastmoney.com/em_mutisvcexpandinterface/api/js/get?type=KZZ_GB&token=4d2cd9e55b669a2b3dec49542914281d&filter=(BONDCODE = " + bondcode + ")",
                url: "//datacenter-web.eastmoney.com/api/data/v1/get?callback=?",
                data: {
                    reportName: 'RPT_BOND_CB_LIST',
                    columns: 'SECURITY_CODE,TRADE_MARKET,SECURITY_NAME_ABBR,DELIST_DATE,LISTING_DATE,CONVERT_STOCK_CODE,EXPIRE_DATE,BOND_COMBINE_CODE,CORRECODE,CORRECODE_NAME_ABBR,PUBLIC_START_DATE,CORRECODEO,CORRECODE_NAME_ABBRO,BOND_START_DATE,SECURITY_START_DATE,SECURITY_SHORT_NAME,FIRST_PER_PREPLACING,ONLINE_GENERAL_LWR,TRANSFER_END_DATE,TRANSFER_START_DATE',
                    quoteColumns: '',
                    filter: '',
                    pageNumber: 1,
                    pageSize: 1,
                    sortTypes: '',
                    sortColumns: '',
                    source: 'WEB',
                    client: 'WEB',
                    filter: '(SECUCODE="' + bondcode + '.' + marketzhai.toUpperCase() + '")'
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data && data.result && data.result.data instanceof Array && data.result.data.length > 0) {
                        var item = data.result.data[0]
                        var infos = {
                            STARTDATE: item.PUBLIC_START_DATE,
                            BONDCODE: bondcode,
                            CORRESNAME: item.CORRECODE_NAME_ABBR,
                            CORRESCODE: item.CORRECODE,
                            OLDCORRESCODE: item.CORRECODEO,
                            ZQHDATE: item.BOND_START_DATE,
                            LISTDATE: item.LISTING_DATE,
                            SNAME: item.SECURITY_NAME_ABBR
                        };
                        // console.info(infos)
                        if (infos.STARTDATE == '-') return; //公布申购日期,申购日期: STARTDATE

                        var startNum = that.formatymd(infos.STARTDATE);
                        var curtimeNum = that.getcurtime();
                        if (startNum > curtimeNum) {//申购日期之前
                            //申购日期公布到申购日期天数之前:**发债
                            $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.CORRESNAME + '</a><span class="zzlab">申购日期:' + that.formatymd(infos.STARTDATE) + '</span><a class="zzdetail" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">查看详情>></a></div>')

                            //申购当天
                        } else if (startNum == curtimeNum) {
                            if (startNum == curtimeNum) { //申购当天
                                var hh = (new Date()).getHours();
                                if (hh < 15) { //申购当天 00:00 -- 15:00:今日申购
                                    $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.CORRESNAME + '今日申购</a><span class="zzlab">申购代码:' + infos.CORRESCODE + '</span><span class="zzlab">配售代码:' + infos.OLDCORRESCODE + '</span></div>')
                                    return false
                                }
                                else { //申购当天15：00至中签公布日:---转债
                                    $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.SNAME + '</a><span class="zzlab">债券代码:' + infos.BONDCODE + '</span><span class="zzlab">中签公布:' + that.formatymd(infos.ZQHDATE) + '</span></div>')
                                    return false
                                }
                            }
                        } else {
                            //申购之后至中签公布日:---转债
                            if (infos.ZQHDATE == '-') {
                                $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.SNAME + '</a><span class="zzlab">债券代码:' + infos.BONDCODE + '</span><span class="zzlab">中签公布:' + that.formatymd(infos.ZQHDATE) + '</span></div>')
                            }

                            //中签号公布日 ZQHDATE                       
                            if (infos.ZQHDATE && infos.ZQHDATE != null && infos.LISTDATE == null) {
                                var zqtimeNum = that.formatymd(infos.ZQHDATE);
                                //中签公布日当天
                                if (zqtimeNum >= curtimeNum) {
                                    $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.SNAME + '</a><span class="zzlab">债券代码:' + infos.BONDCODE + '</span><span class="zzlab">中签公布:' + that.formatymd(infos.ZQHDATE) + '</span></div>')
                                }
                                //中签日当天到公布上市日期之前
                                if (zqtimeNum < curtimeNum) {
                                    $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.SNAME + '</a><span class="zzlab">债券代码:' + infos.BONDCODE + '</span><a class="zzdetail" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">查看详情>></a></div>')
                                }
                            }

                            //公布上市日期到上市日当天 LISTDATE
                            if (infos.LISTDATE && infos.LISTDATE != null) {
                                var listtimeNum = that.formatymd(infos.LISTDATE);
                                //当前日期小于上市日期
                                if (listtimeNum > curtimeNum) {
                                    $("#relation-container").html('<div class="kzz-wrap"><a class="zzname" target="_blank" href="//data.eastmoney.com/kzz/detail/' + infos.BONDCODE + '.html">' + infos.CORRESNAME + '</a><span class="zzlab">债券代码:' + infos.BONDCODE + '</span><span class="zzdetail">上市日期:' + that.formatymd2(infos.LISTDATE) + '</span></div>')
                                } else {
                                    //上市当天及之后
                                    if (quotedata.data.f267 == '-') {
                                        $("#relation-container").html('<div><a target="_blank" href="//quote.eastmoney.com/bond/' + marketzhai + quotedata.data.f262 + '.html">' + quotedata.data.f264 + '行情</a></div><div id =zzprice><span class=' + zzcolor + '>' + '-' + '</span></div><div><span id=zzm class=' + zzcolor + '>' + '-' + '</span><span id =zzper class=' + zzcolor + '>' + '-</span></div>').removeClass('data-right').addClass('fr bond-right')
                                    } else {
                                        $("#relation-container").html('<div><a target="_blank" href="//quote.eastmoney.com/bond/' + marketzhai + quotedata.data.f262 + '.html">' + quotedata.data.f264 + '行情</a></div><div id =zzprice><span class=' + zzcolor + '>' + quotedata.data.f267.toFixed(3) + '</span></div><div><span id=zzm class=' + zzcolor + '>' + (parseFloat(quotedata.data.f267) - parseFloat(quotedata.data.f266)).toFixed(3) + '</span><span id =zzper class=' + zzcolor + '>' + quotedata.data.f268.toFixed(2) + '%</span></div>').removeClass('data-right').addClass('fr bond-right')
                                    }
                                }
                            }
                        };
                    };
                },
                error: function (err) { }
            })
        },

        //新版个股行情
        /*
         *
         *@description: 新增交易状态 292
         *@modifyContent:
         *@author: qiuhongyang
         *@date: 2020-05-18 11:19:17
         *
        */
        DisQuote: function () {
            var that = this;
            if ((window.GetTimeZoneInfo || window.quoteIsFirst)) {
                jQuery.ajax({
                    url: commonApi + "api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&"
                        + "fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,"
                        + "f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,"
                        + "f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,"
                        + "f260,f261,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,"
                        + "f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292,f293,f181,f294,f295,"
                        + "f279,f288&secid=" + _this._Market_10 + "." + _this._Code + '&wbp2u=' + delayparams,
                    scriptCharset: "utf-8",
                    dataType: "jsonp",
                    jsonp: "cb",
                    success: function (json) {
                        //console.log(json)
                        if (json && json.data) {
                            /** 大数据统计 */
                            if(window.loadtimestat){
                                loadtimestat()
                            }
                            $('#name').html(json.data.f58)
                            $('#code').html(json.data.f57)

                            //后端行业信息不显示，前端覆盖
                            var hqName = json.data.f127;
                            $("#hyName1").html(hqName)
                            if (hqName && hqName.length === 4) {
                                $("#hyName2").html(hqName.substring(0, 2) + "<br/>" + hqName.substring(2, 4))
                            } else {
                                $("#hyName2").html(hqName);
                            };

                            yestoday = json.data.f60;
                            Hyestoday = json.data.f250;
                            UKyestoday = json.data.f280;
                            zzyestoday = json.data.f266;

                            //交易状态和时间展示处理
                            _this.tradestatus(json);

                            //新版两融，深股通，创业板，转债标志
                            _this.stockattribute(json);

                            //可转债相关子模块
                            _this.relationModules(json);

                            window.ischangetitle = false;
                            //头部核心行情信息模块
                            _this.quotedigestFun(json);
                            //行情报价
                            _this.hqbjinfos(json);
                            //特色指标
                            _this.specialindec(json);
                            //资金流相关
                            _this.zjlmodules(json);

                            //新版公司核心数据
                            //console.info(json.data.f92)
                            _this.coredataFun(json);

                        }
                    }
                });
                _this.sansuo = setInterval(_this.hongdise, 300);
                window.quoteIsFirst = false;
            }
        },
        /*
         *
         *@Title:个股标签属性展示
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 11:13:06
         *
        */
        stockattribute:function(json) {
            if (json.data.f110 == 1 && json.data.f111 == 2) {
                $('#jys-box').show().find("b ").text("沪主板");
                $('#jys-box').attr("title", "该股票在沪主板上市");
                $('#jys-box').find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sh_a_board");
            }
            if (json.data.f110 == 0 && json.data.f111 == 6) {
                $('#jys-box').show().find("b ").text("深主板");
                $('#jys-box').attr("title", "该股票在深主板上市");
                $('#jys-box').find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sz_a_board");
            }
            if (json.data.f107 == 0 && json.data.f111 == 13) {
                $('#jys-box').show().find("b ").text("中小板");
                $('#jys-box').attr("title", "该股票在中小板上市");
                $('#jys-box').find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#sme_board");
            }
            if (json.data.f107 == 0 && json.data.f111 == 80) {
                $('#jys-box').show().find("b ").text("创业板");
                $('#jys-box').attr("title", "该股票在创业板上市");
                $('#jys-box').find("a").attr("href", "//quote.eastmoney.com/center/gridlist.html#gem_board");
            }

            if ((json.data.f177) & 512) {
                $("#hgt_icon").show();
            } else if ((json.data.f177) & 1024) {
                $("#sgt_icon").show();
            }
            if ((json.data.f177) & 64) {
                $("#rongi").show();
            } else {
                $("#rongi").hide();
            }
            if (json.data.f177 & 32768) {
                //接口稳定后改回来
                $("#hlt").show().find("b ").text("沪伦通");
                $("#hlt").attr("title", "该股票为沪伦通标的");
                $("#hlt").find("a").attr("href", "http://quote.eastmoney.com/uk/" + json.data.f286 + "." + json.data.f285 + ".html");


                $("#GDR").show().find("b ").text("GDR");
                $("#GDR").attr("title", "该股票存在关联的GDR（全球存托凭证）");
                $("#GDR").find("a").attr("href", "http://quote.eastmoney.com/uk/" + json.data.f286 + "." + json.data.f285 + ".html");

            }

            var marketzhai = json.data.f263 == "1" ? "sh" : "sz";
            if (json.data.f262 && json.data.f262 != '-') {
                $("#Z-box").show().find("b").text("可转债");
                $("#Z-box").attr("title", "点击查看关联可转债行情");
                $("#Z-box").find("a").attr("href", "http://quote.eastmoney.com/bond/" + marketzhai + json.data.f262 + ".html");
            } else {
                $("#Z-box").hide()
            }
            var marketH = json.data.f257;
            if (json.data.f256 && json.data.f256 != '-') {
                $("#H-box").show().find("b").text("H股");
                $("#H-box").attr("title", "点击查看关联H股行情");
                $("#H-box").find("a").attr("href", "http://quote.eastmoney.com/unify/r/" + marketH + '.' + json.data.f256);
            } else {
                $("#H-box").hide()
            }
            var marketB = json.data.f270 == "1" ? "sh" : "sz";
            if (json.data.f269 && json.data.f269 != '-') {
                $("#B-box").show().find("b ").text("B股");
                $("#B-box").attr("title", "点击查看关联B股行情");
                $("#B-box").find("a").attr("href", "http://quote.eastmoney.com/" + marketB + json.data.f269 + ".html");
            } else {
                $("#B-box").hide();
            }
            //注册制
            if (json.data.f294 == '1') {
                $("#ZCZ-btn").css({ "display": "block" })
            };
        },
        /*
         *
         *@Title: 右侧可转债相关子模块
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 11:07:53
         *
        */
        relationModules: function(json) {
            var that = this;
            //新版可转债H股B股显示
            var zzcolor = json.data.f268 > 0 ? 'red' : (json.data.f268 < 0 ? 'green' : '');
            var Hcolor = json.data.f252 > 0 ? 'red' : (json.data.f252 < 0 ? 'green' : '');
            var Bcolor = json.data.f275 > 0 ? 'red' : (json.data.f275 < 0 ? 'green' : '');

            if (json.data.f262 && json.data.f262 != '-') {
                var marketzhai = json.data.f263 == "1" ? "sh" : "sz";
                that.kzzFun(marketzhai, json, zzcolor);
            } else if ((json.data.f256 && json.data.f256 != '-') || (json.data.f177 & 32768)) { //如果是沪伦通或者港股
                //未登陆及国外ip用户不刷新
                if (!ggrc) {
                    var ukcolor = json.data.f282 > 0 ? 'red' : (json.data.f282 < 0 ? 'green' : '');
                    var ukprice = json.data.f281 == '-' ? '-' : json.data.f281.toFixed(json.data.f284);
                    var ukmi = json.data.f281 == '-' ? '-' : (json.data.f281 - json.data.f280).toFixed(json.data.f284);
                    var ukpercent = json.data.f282 == '-' ? '-' : json.data.f282.toFixed(2) + '%';
                    var newprice = json.data.f251 == '-' ? '-' : json.data.f251; //最新价 
                    var hm = '-';
                    if (newprice != '-') {
                        newprice = (json.data.f251).toFixed(3);
                        if (Hyestoday != '-') {
                            hm = (parseFloat(json.data.f251) - Hyestoday).toFixed(3)
                        }
                    };
                    var Hper = json.data.f252 == '-' ? '-' : json.data.f252;
                    if (Hper != '-') {
                        Hper = json.data.f252.toFixed(2) + '%'
                    };

                    var marketH = json.data.f257;
                    
                    if ((json.data.f256 && json.data.f256 != '-') && (json.data.f177 & 32768)) {  //既是港股又是沪伦通
                        $("#relation-container").html('<div id="rstocka" style="padding-top:0px">'
                            + '<a style=font-size:13px href="http://quote.eastmoney.com/unify/r/' + marketH + '.' + json.data.f256 + '" target="_blank">' + json.data.f258 + ' H股行情</a>'
                            + '</div><div id="rstockinfo"><span id="rstockb" class=' + Hcolor + '>'
                            + '<span id=Hprice style=margin:5px>' + newprice + '</span>'
                            + '<span id=Hm style=margin:5px>' + hm + '</span>'
                            + '<span id=Hper style=margin:5px>' + Hper + '</span>'
                            + '</span></div><div id="rstockc" style="padding-top:0px">'
                            + '<a style=font-size:13px href="http://quote.eastmoney.com/uk/' + json.data.f286 + '.' + json.data.f285 + '.html" target="_blank">' + json.data.f287 + ' 英股行情</a>'
                            + '</div>'
                            + '<div id="rstockinfo1">'
                            + '<span id="rstockb" class=' + ukcolor + '>'
                            + '<span id=ukprice style=margin:5px>' + ukprice + '</span>'
                            + '<span id = ukmi style=margin:5px>' + ukmi + '</span>'
                            + '<span id = ukpercent style=margin:5px>' + ukpercent + '</span></span></div>').addClass('fr quote_right').css('line-height', '17px').removeClass('data-right')
                    } else if (json.data.f256 && json.data.f256 != '-') { // 是港股

                        $("#relation-container").html('<div id="rstocka">'
                            + '<a href="http://quote.eastmoney.com/unify/r/' + marketH + '.' + json.data.f256 + '" target="_blank">' + json.data.f258 + ' H股行情</a>'
                            + '</div><div id="rstockinfo"><span id="rstockb" class=' + Hcolor + '><span id=Hprice style=margin:5px>' + newprice + '</span>'
                            + '<span id=Hm style=margin:5px>' + hm + '</span><span id=Hper style=margin:5px>' + Hper + '</span></span></div>').addClass('fr quote_right').removeClass('data-right').addClass('fr');
                    } else if (json.data.f177 & 32768) {  // 是沪伦通
                        $("#relation-container").html('<div id="rstockc" style="padding-top:16px">'
                            + '<a style=font-size:13px href="http://quote.eastmoney.com/uk/' + json.data.f286 + '.' + json.data.f285 + '.html" target="_blank">' + json.data.f287 + ' 英股行情</a></div>'
                            + '<div id="rstockinfo1"><span id="rstockb" class=' + ukcolor + '><span id=ukprice style=margin:5px>' + ukprice + '</span>'
                            + '<span id = ukmi style=margin:5px>' + ukmi + '</span><span id = ukpercent style=margin:5px>' + ukpercent + '</span></span></div>').addClass('fr quote_right').css('line-height', '17px').removeClass('data-right');
                    }

                    if (!(GetCookie("uidal") && GetCookie("ut") && GetCookie("ct"))) { //未登陆
                        ggrc++;
                    }
                    //国外IP
                    if (json.lt == "2") {
                        ggrc++;
                    }
                }

            } else if (json.data.f269 && json.data.f269 != '-') {
                if (json.data.f275 == '-') {
                    $("#relation-container").html('<div id="rstocka"><a href="http://quote.eastmoney.com/' + marketB + json.data.f269 + '.html" target="_blank">' + json.data.f271 + ' B股行情</a></div><div id="rstockb" class=' + Bcolor + '>' + '-' + '&nbsp;&nbsp;' + '-</div>').addClass('fr quote_right').removeClass('data-right')
                } else {
                    $("#relation-container").html('<div id="rstocka"><a href="http://quote.eastmoney.com/' + marketB + json.data.f269 + '.html" target="_blank">' + json.data.f271 + ' B股行情</a></div><div id="rstockb" class=' + Bcolor + '>' + json.data.f274 + '&nbsp;&nbsp;' + json.data.f275.toFixed(2) + '%</div>').addClass('fr quote_right').removeClass('data-right')
                }
            } else {
                $("#relation-container").html('<a href="http://data.eastmoney.com/zlsj/detail/' + json.data.f57 + '-1.html" target="_blank" class="n1">持有该股的基金</a><a href="http://acttg.eastmoney.com/pub/web_jcb_hqsy_mmd_01_01_01_1 " target="_blank" class="n2">查看' + json.data.f58 + '买卖点</a><a href="http://acttg.eastmoney.com/pub/web_jcb_hqsy_gjyj_01_01_02_1 " target="_blank" class="n3">' + json.data.f58 + '股价预警</a>').addClass('fr data-right')
            };
        },
        /*
         *
         *@Title:头部行情模块信息展示
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:47:11
         *
        */
        quotedigestFun: function(json) {
            if (json.data.f292 == 8) {
                $("#arrowud").html('<strong id="price9" class="xp1" data-bind="43" style="width: 130px;"><span class="lstng">暂停上市</span></strong>')
            } else if (json.data.f292 == 6) {
                $("#arrowud").html('<strong id="price9" class="xp1" data-bind="43""><span class="lstng"><a href="http://data.eastmoney.com/tfpxx/" target="_blank" class="red wz">停牌</a></span></strong>')
            } else if (json.data.f292 == 9) {
                $("#arrowud").html('<strong id="price9" class="xp1" data-bind="43""><span class="lstng"><a href="http://data.eastmoney.com/tfpxx/" target="_blank" class="red wz">未上市</a></span></strong>')
            } else if (json.data.f292 == 7) {
                $("#arrowud").html('<strong id="price9" class="xp1" data-bind="43""><span class="lstng"><a href="http://data.eastmoney.com/tfpxx/" target="_blank" class="red wz">已退市</a></span></strong>')
            }
            else {
                if (json.data.f43 != '-') {
                    _this.$("price9").innerHTML = json.data.f43.toFixed(2);
                }
                if (json.data.f43 >= 1000) {
                    $("#price9").css({ 'top': '20px', 'font-size': '25px' })
                }
                if (json.data.f169 != '-') {
                    _this.$("km1").innerHTML = json.data.f169.toFixed(2);
                    if (json.data.f169 > 9999) {
                        $("#km1").css({ "font-size": "12px" })
                    }
                }
                if (json.data.f170 != '-') {
                    _this.$("km2").innerHTML = json.data.f170.toFixed(2) + "%";
                    if (json.data.f170 > 9999){
                        $("#km2").css({"font-size":"12px"})
                    }
                }
                if (json.data.f43 != '-') {
                    window.ischangetitle = true
                    window.stockname = json.data.f58
                    document.title = (json.data.f58 + " " + json.data.f43.toFixed(2) + " " + json.data.f169.toFixed(2) + "(" + json.data.f170.toFixed(2) + "%) _ 股票行情 _ 东方财富网");
                }
            };
            if (json.data.f169 < 0) {
                $("#arrowud").css('color', 'green');
                $("#arrow-find").removeClass("xp2 up-arrow");
                $("#arrow-find").addClass("xp2 down-arrow");
                $("#rgt3").css('color', 'green');
                $("#rgt4").css('color', 'green');
            } else if (json.data.f169 > 0) {
                $("#arrowud").css('color', 'red');
                $("#arrow-find").removeClass("xp2 down-arrow");
                $("#arrow-find").addClass("xp2 up-arrow");
                $("#rgt3").css('color', 'red');
                $("#rgt4").css('color', 'red');
            } else {
                $("#arrow-find").removeClass("xp2 up-arrow");
                $("#arrow-find").removeClass("xp2 down-arrow");
                $("#arrowud").css('color', '#494949');
                $("#rgt3").css('color', '#494949');
                $("#rgt4").css('color', '#494949');
            }
            if (json.data.f46 != '-') {
                _this.$("gt1").innerHTML = json.data.f46.toFixed(2); _this.$("gt1").className = udcls(json.data.f46, json.data.f60); $("#gt1").addClass('txtl');//今开
                _this.$("rgt11").innerHTML = json.data.f46.toFixed(2); _this.$("rgt11").className = udcls(json.data.f46, json.data.f60);//今开                     
            }
            if (json.data.f44 != '-') {
                _this.$("gt2").innerHTML = json.data.f44.toFixed(2); _this.$("gt2").className = udcls(json.data.f44, json.data.f60); $("#gt2").addClass('txtl');//最高
                _this.$("rgt9").innerHTML = json.data.f44.toFixed(2); _this.$("rgt9").className = udcls(json.data.f44, json.data.f60);//最高          
            }
            if (json.data.f51 != '-') {
                _this.$("gt3").innerHTML = json.data.f51.toFixed(2); _this.$("gt3").className = "txtl red";//涨停                           
            }
            if (json.data.f168 != '-') {
                _this.$("gt4").innerHTML = json.data.f168.toFixed(2) + "%";//换手                                
            }
            if (json.data.f47 != '-') {
                _this.$("gt5").innerHTML = fmtdig(json.data.f47, 1, 2, "", true) + "手";//成交量                           
            }
            if (json.data.f162 != '-') {
                _this.$("gt6").innerHTML = toFixed(json.data.f162);//市盈动   
                _this.$("dtsyl").innerHTML = toFixed(json.data.f162);//市盈动                          
            }
            if (json.data.f163 != '-') {
                _this.$("jtsyl").innerHTML = toFixed(json.data.f163);//市盈静
            }
            if (json.data.f164 != '-') {
                _this.$("gdsyl").innerHTML = toFixed(json.data.f164);//市盈滚动
            }
            if (json.data.f116 != '-') {
                _this.$("gt7").innerHTML = fmtdig(json.data.f116, 1, 2, "", true);//总市值
            }
            if (json.data.f60 != '-') {
                _this.$("gt8").innerHTML = json.data.f60.toFixed(2);//昨收
            }
            if (json.data.f45 != '-') {
                _this.$("gt9").innerHTML = json.data.f45.toFixed(2); _this.$("gt9").className = udcls(json.data.f45, json.data.f60); $("#gt9").addClass('txtl');//最低
                _this.$("rgt10").innerHTML = json.data.f45.toFixed(2); _this.$("rgt10").className = udcls(json.data.f45, json.data.f60);//最低                           
            }
            if (json.data.f52 != '-') {
                _this.$("gt10").innerHTML = json.data.f52; _this.$("gt10").className = "txtl green";//跌停                           
            }
            if (json.data.f50 != '-') {
                _this.$("gt11").innerHTML = json.data.f50.toFixed(2);//量比
                _this.$("rgt8").innerHTML = json.data.f50.toFixed(2);//量比                           
            }
            if (json.data.f48 != '-') {
                _this.$("gt12").innerHTML = fmtdig(json.data.f48, 1, 2, "", true);//成交额                               
            }
            if (json.data.f167 != '-') {
                _this.$("gt13").innerHTML = json.data.f167.toFixed(2);//市净                           
            }
        },
        /*
         *@Title:交易状态处理
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:42:54
         *
        */
        tradestatus: function(json) {
            //新版时间
            if (json.data.f86 && json.data.f86 != '-' && json.data.f292 && json.data.f292 != '-') {
                var time = _this.formateDate(new Date(json.data.f86 * 1000), "yyyy-MM-dd EEE HH:mm:ss");
                var time1 = _this.formateDate(new Date(json.data.f86 * 1000), "yyyy-MM-dd HH:mm:ss");
                $x("zjlxupta").innerHTML = "更新时间 " + time1;
                $x("zjlxuptb").innerHTML = "更新时间 " + time1;
                $x("zjlxuptc").innerHTML = "更新时间 " + time1;
                $("#day").html('(' + time + ')');

                if (json.data.f292 && json.data.f292 != '-') {
                    var jycontent = '';
                    if (json.data.f292 == 1) {
                        jycontent = "开盘竞价"
                    }
                    else if (json.data.f292 == 2) {
                        jycontent = "交易中"
                    }
                    else if (json.data.f292 == 3) {
                        jycontent = "盘中休市"
                    }
                    else if (json.data.f292 == 4) {
                        jycontent = "收盘竞价"
                    }
                    else if (json.data.f292 == 5) {
                        jycontent = "已收盘"
                    }
                    else if (json.data.f292 == 6) {
                        jycontent = "停牌"
                    }
                    else if (json.data.f292 == 7) {
                        jycontent = "退市"
                    }
                    else if (json.data.f292 == 8) {
                        jycontent = "暂停上市"
                    }
                    else if (json.data.f292 == 9) {
                        jycontent = "未上市"
                    }
                    else if (json.data.f292 == 10) {
                        jycontent = "未开盘"
                    }
                    else if (json.data.f292 == 11) {
                        jycontent = "盘前"
                    }
                    else if (json.data.f292 == 12) {
                        jycontent = "盘后"
                    }
                    else if (json.data.f292 == 13) {
                        jycontent = "节假日休市"
                    }
                    else if (json.data.f292 == 14) {
                        jycontent = "盘中停牌"
                    }
                    else if (json.data.f292 == 15) {
                        jycontent = "非交易代码"
                    }
                    else if (json.data.f292 == 16) {
                        jycontent = "波动性中断"
                    }
                    else if (json.data.f292 == 17) {
                        jycontent = "盘后交易启动"
                    }
                    else if (json.data.f292 == 18) {
                        jycontent = "盘后集中撮合交易"
                    }
                    else if (json.data.f292 == 19) {
                        jycontent = "盘后固定价格交易"
                    }
                    $('#tradestatus').html(jycontent)
                }

            }
        },
        /*
         *
         *@Title:行情报价
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:29:07
         *
        */
        hqbjinfos: function(json) {
            if (json.data.f51 != '-') {
                _this.$("gtbzt").innerHTML = json.data.f51; _this.$("gtbzt").className = "red";//涨停
            }
            if (json.data.f52 != '-') {
                _this.$("gtbdt").innerHTML = json.data.f52; _this.$("gtbdt").className = "green";//跌停
            }
            if (json.data.f31 != '-') {
                _this.$("gts5a").innerHTML = json.data.f31.toFixed(2); _this.$("gts5a").className = udcls(json.data.f31, json.data.f60);
            }
            if (json.data.f32 != '-') {
                _this.$("gts5b").innerHTML = json.data.f32;
            }
            if (json.data.f33 != '-') {
                _this.$("gts4a").innerHTML = json.data.f33.toFixed(2); _this.$("gts4a").className = udcls(json.data.f33, json.data.f60);
            }
            if (json.data.f34 != '-') {
                _this.$("gts4b").innerHTML = json.data.f34;
            }
            if (json.data.f35 != '-') {
                _this.$("gts3a").innerHTML = json.data.f35.toFixed(2); _this.$("gts3a").className = udcls(json.data.f35, json.data.f60);
            }
            if (json.data.f36 != '-') {
                _this.$("gts3b").innerHTML = json.data.f36;
            }
            if (json.data.f37 != '-') {
                _this.$("gts2a").innerHTML = json.data.f37.toFixed(2); _this.$("gts2a").className = udcls(json.data.f37, json.data.f60);
            }
            if (json.data.f38 != '-') {
                _this.$("gts2b").innerHTML = json.data.f38;
            }
            if (json.data.f39 != '-') {
                _this.$("gts1a").innerHTML = json.data.f39.toFixed(2); _this.$("gts1a").className = udcls(json.data.f39, json.data.f60);
            }
            if (json.data.f40 != '-') {
                _this.$("gts1b").innerHTML = json.data.f40;
            }
            if (json.data.f19 != '-') {
                _this.$("gtb1a").innerHTML = json.data.f19.toFixed(2); _this.$("gtb1a").className = udcls(json.data.f19, json.data.f60);
            }
            if (json.data.f20 != '-') {
                _this.$("gtb1b").innerHTML = json.data.f20;
            }
            if (json.data.f17 != '-') {
                _this.$("gtb2a").innerHTML = json.data.f17.toFixed(2); _this.$("gtb2a").className = udcls(json.data.f17, json.data.f60);
            }
            if (json.data.f18 != '-') {
                _this.$("gtb2b").innerHTML = json.data.f18;
            }
            if (json.data.f15 != '-') {
                _this.$("gtb3a").innerHTML = json.data.f15.toFixed(2); _this.$("gtb3a").className = udcls(json.data.f15, json.data.f60);
            }
            if (json.data.f16 != '-') {
                _this.$("gtb3b").innerHTML = json.data.f16;
            }
            if (json.data.f13 != '-') {
                _this.$("gtb4a").innerHTML = json.data.f13.toFixed(2); _this.$("gtb4a").className = udcls(json.data.f13, json.data.f60);
            }
            if (json.data.f14 != '-') {
                _this.$("gtb4b").innerHTML = json.data.f14;
            }
            if (json.data.f11 != '-') {
                _this.$("gtb5a").innerHTML = json.data.f11.toFixed(2); _this.$("gtb5a").className = udcls(json.data.f11, json.data.f60);
            }
            if (json.data.f12 != '-') {
                _this.$("gtb5b").innerHTML = json.data.f12;
            }
            if (json.data.f117 != '-') {
                _this.$("gt14").innerHTML = fmtdig(json.data.f117, 1, 2, "", true);//流通市值                          
            }
            if (json.data.f191 != '-') {
                _this.$("irwb").innerHTML = json.data.f191.toFixed(2) + "%"; _this.$("irwb").className = udcls(json.data.f191);//委比                         
            }
            if (json.data.f192 != '-') {
                _this.$("irwc").innerHTML = json.data.f192; _this.$("irwc").className = udcls(json.data.f192);//委差                        
            }
            if (json.data.f43 != '-') {
                _this.$("rgt1").innerHTML = json.data.f43.toFixed(2); _this.$("rgt1").className = udcls(json.data.f43, json.data.f60);//最新价                         
            }
            if (json.data.f71 != '-') {
                _this.$("rgt2").innerHTML = json.data.f71.toFixed(2); _this.$("rgt2").className = udcls(json.data.f71, json.data.f60);//均价                          
            }
            if (json.data.f170 != '-') {
                _this.$("rgt3").innerHTML = json.data.f170.toFixed(2) + "%";
            }
            if (json.data.f169 != '-') {
                _this.$("rgt4").innerHTML = json.data.f169;
            }
            if (json.data.f47 != '-') {
                _this.$("rgt5").innerHTML = fmtdig(json.data.f47, 1, 2, "", true) + "手";//总手                            
            }
            if (json.data.f48 != '-') {
                _this.$("rgt6").innerHTML = fmtdig(json.data.f48, 1, 2, "", true);//金额                         
            }
            if (json.data.f168 != '-') {
                _this.$("rgt7").innerHTML = json.data.f168 + "%";//换手
            }
            _this.$("rgt12").innerHTML = json.data.f60.toFixed(2);//昨收
            // _this.$("rgt13").innerHTML = json.data.f51; _this.$("rgt13").className = "red";//涨停
            // _this.$("rgt14").innerHTML = json.data.f52; _this.$("rgt14").className = "green";//跌停
            if (json.data.f49 < 10000) {
                _this.$("rgt15").innerHTML = json.data.f49; _this.$("rgt15").className = "red";//外盘
            } else {
                _this.$("rgt15").innerHTML = fmtdig(json.data.f49, 1, 2, "", true); _this.$("rgt15").className = "red";//外盘
            }
            if (json.data.f161 < 10000) {
                _this.$("rgt16").innerHTML = json.data.f161; _this.$("rgt16").className = "green";
            } else {
                _this.$("rgt16").innerHTML = fmtdig(json.data.f161, 1, 2, "", true); _this.$("rgt16").className = "green";//内盘                                
            }
        },
        /*
         *
         *@Title:特色指标
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:27:23
         *
        */
        specialindec: function(json) {
            if (json.data.f294 != '-') { //是否注册制
                _this.$("tszb-zcz").innerHTML = json.data.f294 == 1 ? "是" : "否";
            }
            if (json.data.f295 != '-') { //是否注册制
                _this.$("tszb-xykz").innerHTML = json.data.f295 == 1 ? "是" : "否";
            }
            if (json.data.f293 != '-') { //是否同股同权f279->是否有表决权差异293 
                _this.$("tszb-tgtq").innerHTML = json.data.f293 == 1 ? "是" : "否";
            }
            if (json.data.f288 == '1' || json.data.f288 == '0') { //是否盈利
                _this.$("tszb-yl").innerHTML = json.data.f288 == 1 ? "否" : "是"; 
            } 
            if (json.data.f260 != '-') { //盘后成交量：默认手
                _this.$("tszb-phnum").innerHTML = fmtdig(json.data.f260, 1, 2, "", true) + "手";//成交量         
            }
            if (json.data.f261 != '-') { //盘后成交额
                _this.$("tszb-phmoney").innerHTML = fmtdig(json.data.f261, 1, 2, "", true);
            }
        },
        /*
         *
         *@Title: 公司核心数据
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:39:56
         *
        */
        coredataFun: function(json) {
            var coredata = '';
            coredata +=
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">收益</a>(<span title=第' + SectionToChinese(json.data.f62) + '季度>' + SectionToChinese(json.data.f62) + '</span>):' + (json.data.f55 != '-' ? json.data.f55.toFixed(3) : '-') + '</td>' +
                '<td>PE(动):<span id="gt6_2">' + json.data.f162 + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">每股净资产</a>:' + (json.data.f92 != '-' ? json.data.f92.toFixed(3) : '-') + '</td>' +
                '<td>市净率:<span id="gt13_2">' + json.data.f167 + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td>总营收:' + fmtdig(json.data.f183, 1, 2, "", true) + '</td>' +
                '<td>同比:' + (json.data.f184 != '-' ? json.data.f184.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>净利润:' + fmtdig(json.data.f105, 1, 2, "", true) + '</td>' +
                '<td>同比:' + (json.data.f185 != '-' ? json.data.f185.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">毛利率</a>:' + (json.data.f186 != '-' ? json.data.f186.toFixed(2) + '%' : '-') + '</td>' +
                '<td>净利率:' + (json.data.f187 != '-' ? json.data.f187.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">ROE<b title="加权净资产收益率" class="hxsjccsyl"></b></a>:' + (json.data.f173 != '-' ? json.data.f173.toFixed(2) + '%' : '-') + '</td>' +
                '<td>负债率:' + (json.data.f188 != '-' ? json.data.f188.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td title="12.36亿">总股本:' + fmtdig(json.data.f84, 1, 2, "", true) + '</td>' +
                '<td>总值:<span id="gt7_2">' + fmtdig(json.data.f116, 1, 2, "", true) + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td title="12.36亿">流通股:' + fmtdig(json.data.f85, 1, 2, "", true) + '</td>' +
                '<td>流值:<span id="gt14_2">' + fmtdig(json.data.f117, 1, 2, "", true) + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2">每股未分配利润:' + (json.data.f190 != '-' ? json.data.f190.toFixed(3) + '元' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" class="pb3">上市时间:' + json.data.f189.toString().substring(0, 4) + '-' + json.data.f189.toString().substring(4, 6) + '-' + json.data.f189.toString().substring(6, 8) + '</td>' +
                '</tr>';
            var cores = '';
            cores +=
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">收益</a>(<span title=第' + SectionToChinese(json.data.f62) + '季度>' + SectionToChinese(json.data.f62) + '</span>):' + (json.data.f55 != '-' ? json.data.f55.toFixed(3) : '-') + '</td>' +
                '<td>PE(动):<span id="gt6_2">' + json.data.f162 + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">每股净资产</a>:' + (json.data.f92 != '-' ? json.data.f92.toFixed(3) : '-') + '</td>' +
                '<td>市净率:<span id="gt13_2">' + json.data.f167 + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td>总营收:19.98亿</td>' +
                '<td>同比</a>:22.20%</td>' +
                '</tr>' +
                '<tr>' +
                '<td>净利润:' + fmtdig(json.data.f105, 1, 2, "", true) + '</td>' +
                '<td>同比:' + (json.data.f185 != '-' ? json.data.f185.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">毛利率</a>:' + (json.data.f186 != '-' ? json.data.f186.toFixed(2) + '%' : '-') + '</td>' +
                '<td>净利率:' + (json.data.f187 != '-' ? json.data.f187.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><a href="http://data.eastmoney.com/bbsj/' + _this._Code + '.html" target="_blank">ROE<b title="加权净资产收益率" class="hxsjccsyl"></b></a>:' + (json.data.f173 != '-' ? json.data.f173.toFixed(2) + '%' : '-') + '</td>' +
                '<td>负债率:' + (json.data.f188 != '-' ? json.data.f188.toFixed(2) + '%' : '-') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td title="12.36亿">总股本:' + fmtdig(json.data.f84, 1, 2, "", true) + '</td>' +
                '<td>总值:<span id="gt7_2">' + fmtdig(json.data.f116, 1, 2, "", true) + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td title="12.36亿">流通股:' + fmtdig(json.data.f85, 1, 2, "", true) + '</td>' +
                '<td>流值:<span id="gt14_2">' + fmtdig(json.data.f117, 1, 2, "", true) + '</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2">每股未分配利润:' + (json.data.f190 != '-' ? json.data.f190.toFixed(3) : '-') + '元</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" class="pb3">上市时间:' + json.data.f189.toString().substring(0, 4) + '-' + json.data.f189.toString().substring(4, 6) + '-' + json.data.f189.toString().substring(6, 8) + '</td>' +
                '</tr>';

            if (_this._Code == '300059') {
                $("#rtp2").html(coredata)
            } else {
                $("#rtp2").html(coredata)
            }
        },
        /*
         *
         *@Title: 资金流相关
         *@params1: 参数1
         *@description:
         *@return: 
         *@author: qiuhongyang
         *@date: 2020-06-16 10:37:17
         *
        */
        zjlmodules: function(json) {
            var zjlxcjfw = "";
            if (json.data.f138 != "-") { zjlxcjfw += "<li class='cdlr'><b></b>超大单(<span class='red'>" + (json.data.f138 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='cdlr'><b></b>超大单(<span class='red'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f139 != "-") { zjlxcjfw += "<li class='cdlc'><b></b>超大单(<span class='green'>" + '-' + (json.data.f139 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='cdlc'><b></b>超大单(<span class='green'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f141 != "-") { zjlxcjfw += "<li class='ddlr'><b></b>大单(<span class='red'>" + (json.data.f141 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='ddlr'><b></b>大单(<span class='red'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f142 != "-") { zjlxcjfw += "<li class='ddlc'><b></b>大单(<span class='green'>" + '-' + (json.data.f142 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='ddlc'><b></b>大单(<span class='green'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f144 != "-") { zjlxcjfw += "<li class='zdlr'><b></b>中单(<span class='red'>" + (json.data.f144 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='zdlr'><b></b>中单(<span class='red'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f145 != "-") { zjlxcjfw += "<li class='zdlc'><b></b>中单(<span class='green'>" + '-' + (json.data.f145 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='zdlc'><b></b>中单(<span class='green'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f147 != "-") { zjlxcjfw += "<li class='xdlr'><b></b>小单(<span class='red'>" + (json.data.f147 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='xdlr'><b></b>小单(<span class='red'>" + '-' + "</span>万元)</li>";
            }
            if (json.data.f148 != "-") { zjlxcjfw += "<li class='xdlc'><b></b>小单(<span class='green'>" + '-' + (json.data.f148 / 10000).toFixed(2) + "</span>万元)</li>"; }
            else {
                zjlxcjfw += "<li class='xdlc'><b></b>小单(<span class='green'>" + '-' + "</span>万元)</li>";
            }
            $x("zjlxcjfbt").innerHTML = zjlxcjfw;

            if (json.data.f137 != "-") { $x("zjlxa").innerHTML = (json.data.f137 / 10000).toFixed(2) + "万元"; $x("zjlxb").innerHTML = json.data.f193.toFixed(2) + '%'; $x("zjlxa").style.color = udcls(json.data.f137, "0"); $x("zjlxb").style.color = udc(json.data.f193 + '%', "0"); }
            if (json.data.f140 != "-") { $x("zjlxc").innerHTML = (json.data.f140 / 10000).toFixed(2) + "万元"; $x("zjlxd").innerHTML = json.data.f194.toFixed(2) + '%'; $x("zjlxc").style.color = udcls(json.data.f140, "0"); $x("zjlxd").style.color = udc(json.data.f194 + '%', "0"); }
            if (json.data.f143 != "-") { $x("zjlxe").innerHTML = (json.data.f143 / 10000).toFixed(2) + "万元"; $x("zjlxf").innerHTML = json.data.f195.toFixed(2) + '%'; $x("zjlxe").style.color = udcls(json.data.f143, "0"); $x("zjlxf").style.color = udc(json.data.f195 + '%', "0"); }
            if (json.data.f146 != "-") { $x("zjlxg").innerHTML = (json.data.f146 / 10000).toFixed(2) + "万元"; $x("zjlxh").innerHTML = json.data.f196.toFixed(2) + '%'; $x("zjlxg").style.color = udcls(json.data.f146, "0"); $x("zjlxh").style.color = udc(json.data.f196 + '%', "0"); }
            if (json.data.f149 != "-") { $x("zjlxi").innerHTML = (json.data.f149 / 10000).toFixed(2) + "万元"; $x("zjlxj").innerHTML = json.data.f197.toFixed(2) + '%'; $x("zjlxi").style.color = udcls(json.data.f149, "0"); $x("zjlxj").style.color = udc(json.data.f197 + '%', "0"); }
            //资金流分析
            if (json.data.f135 != "-") {
                $x("hz_a").innerHTML = ForDight(parseFloat(json.data.f135 / 10000), 2);
                $x("hz_a").className = udcls(json.data.f135);
            }
            if (json.data.f136 != "-") {
                $x("hz_b").innerHTML = ForDight(parseFloat(json.data.f136 / 10000), 2).replace("-", "");
                $x("hz_b").className = udcls(-json.data.f136);
            }
            if (json.data.f137 != "-") {
                $x("hz_c").innerHTML = (json.data.f137 / 10000).toFixed(2);
                $x("hz_c").className = udcls(json.data.f137);
            }
            if (json.data.f138 != "-") {
                $x("hz_d").innerHTML = (json.data.f138 / 10000).toFixed(2) || "";
            }
            if (json.data.f139 != "-") {
                $x("hz_e").innerHTML = (json.data.f139 / 10000).toFixed(2).replace("-", "") || "";
            }
            if (json.data.f141 != "-") {
                $x("hz_f").innerHTML = (json.data.f141 / 10000).toFixed(2) || "";
            }
            if (json.data.f142 != "-") {
                $x("hz_g").innerHTML = (json.data.f142 / 10000).toFixed(2).replace("-", "") || "";
            }
            if (json.data.f144 != "-") {
                $x("hz_h").innerHTML = (json.data.f144 / 10000).toFixed(2) || "";
            }
            if (json.data.f145 != "-") {
                $x("hz_i").innerHTML = (json.data.f145 / 10000).toFixed(2).replace("-", "") || "";
            }
            if (json.data.f147 != "-") {
                $x("hz_j").innerHTML = (json.data.f147 / 10000).toFixed(2) || "";
            }
            if (json.data.f148 != "-") {
                $x("hz_k").innerHTML = (json.data.f148 / 10000).toFixed(2).replace("-", "") || "";
            }
            //资金流柱状图
            var total = Math.abs(parseFloat(json.data.f140)) + Math.abs(parseFloat(json.data.f143)) + Math.abs(parseFloat(json.data.f146)) + Math.abs(parseFloat(json.data.f149));
            var i = [json.data.f140, json.data.f143, json.data.f146, json.data.f149]
            $(".picNum ul").each(function (index, elm) {

                if (i[index] > 0) {
                    $(this).find("div").eq(0).html("<div class=\"box\" id=\"hz_" + index + "h\"></div><span class=\"red\">" + parseFloat(Math.floor(i[index] / 10000)).toFixed(0) + "</span>");
                    $(this).find("div").eq(0).css("border-bottom", "1px solid #ccc");
                    $x("hz_" + index + "h").style.height = Math.abs(parseFloat(i[index])) / total * 36 + "px";
                }
                if (i[index] <= 0) {
                    $(this).find("div").eq(1).html("<div class=\"box\" id=\"hz_" + index + "h\"></div><span class=\"green\">" + parseFloat(Math.floor(i[index] / 10000)).toFixed(0) + "</span>");
                    $(this).find("div").eq(1).css("border-top", "1px solid #ccc");
                    $x("hz_" + index + "h").style.height = Math.abs(parseFloat(i[index])) / total * 36 + "px";
                }
                if (i[index] == 0) {
                    $(this).find("div").eq(1).html("<div class=\"box\" id=\"hz_" + index + "h\"></div><span class=\"\">" + parseFloat(Math.floor(i[index] / 10000)).toFixed(0) + "</span>");
                    $(this).find("div").eq(1).css("border-top", "1px solid #ccc");
                    $x("hz_" + index + "h").style.height = Math.abs(parseFloat(i[index])) / total * 36 + "px";
                }

            });
        },
        /**
         * 更改网页title
         * @param {*} data 数据
         * @param {*} isfull 全量数据
         */
        // titledata: null,
        // changeTitle: function(data, isfull){
        //     if(data == undefined){
        //         return false
        //     }
        //     if(data.f43!='-' && isfull){

        //         document.title = (data.f58 + " " + data.f43.toFixed(2) + " " + data.f169.toFixed(2) + "(" + data.f170.toFixed(2) + "%) _ 股票行情 _ 东方财富网");   
        //     }
        // },
        //新版个股推送
        DisQuote_sse: function () {
            var _this = this;
            // var url = "http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f206,f207,f208,f209,f210,f211,f212,f213,f214,f215,f86,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275&secid=" + _this._Market_10 +"."+ _this._Code;
            var url = tsApi + "api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f260,f261,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292,f181,f294,f295,f279,f288&secid=" + _this._Market_10 + "." + _this._Code;
            var evtSource = new EventSource(url);
            evtSource.onmessage = function (msg) {
                //console.log(msg.data)
                var json = JSON.parse(msg.data)
                //console.info(json)
                if (json.data) {

                    //交易状态和时间展示处理
                    _this.tradestatus(json);
                    //console.info(json)
                    if (json.data.f43 != undefined && json.data.f43 != '-' && json.data.f169 != undefined && json.data.f170 != undefined && window.stockname != undefined && window.ischangetitle) {
                        document.title = (window.stockname + " " + json.data.f43.toFixed(2) + " " + json.data.f169.toFixed(2) + "(" + json.data.f170.toFixed(2) + "%) _ 股票行情 _ 东方财富网");
                    }

                    if (json.data.f292 == 8) {

                    } else if (json.data.f292 == 6) {

                    } else if (json.data.f292 == 9) {

                    } else if (json.data.f292 == 7) {

                    }
                    else {
                        if (json.data.f43 != undefined && json.data.f43 != '-') {
                            _this.$("price9").innerHTML = json.data.f43.toFixed(2);
                            if (json.data.f43 >= 1000) {
                                $("#price9").css({ 'top': '20px', 'font-size': '25px' })
                            }
                            blinker(json.data.f169, $("#price9"))
                            _this.$("rgt1").innerHTML = json.data.f43.toFixed(2); _this.$("rgt1").className = udcls(json.data.f43, yestoday);//最新价
                            blinker(json.data.f169, $("#rgt1"))
                        }
                        if (json.data.f169 != undefined) {
                            _this.$("km1").innerHTML = json.data.f169.toFixed(2);
                            if (json.data.f169 > 9999) {
                                $("#km1").css({ "font-size": "12px" })
                            }
                            blinker(json.data.f169, $("#km1"))
                            _this.$("rgt4").innerHTML = json.data.f169; _this.$("rgt4").className = udcls(json.data.f169, yestoday);//涨跌 
                            blinker(json.data.f169, $("#rgt4"))
                            if (json.data.f169 < 0) {
                                $("#arrowud").css('color', 'green');
                                $("#arrow-find").removeClass("xp2 up-arrow");
                                $("#arrow-find").addClass("xp2 down-arrow");
                            } else if (json.data.f169 > 0) {
                                $("#arrowud").css('color', 'red');
                                $("#arrow-find").removeClass("xp2 down-arrow");
                                $("#arrow-find").addClass("xp2 up-arrow");
                            } else {
                                $("#arrow-find").removeClass("xp2 up-arrow");
                                $("#arrow-find").removeClass("xp2 down-arrow");
                                $("#arrowud").css('color', '#494949');
                            }
                        }
                        if (json.data.f170 != undefined) {
                            _this.$("km2").innerHTML = json.data.f170.toFixed(2) + "%";
                            if (json.data.f170 > 9999) {
                                $("#km2").css({ "font-size": "12px" })
                            };
                            blinker(json.data.f169, $("#km2"))
                            _this.$("rgt3").innerHTML = json.data.f170.toFixed(2) + "%"; _this.$("rgt3").className = udcls(json.data.f170, yestoday);//涨幅
                            blinker(json.data.f169, $("#rgt3"))
                        }
                    }

                    if (json.data.f168) {
                        _this.$("gt4").innerHTML = json.data.f168 + "%";//换手
                        blinker(0, $("#gt4"))
                        _this.$("rgt7").innerHTML = json.data.f168 + "%";//换手
                        blinker(0, $("#rgt7"))
                    }
                    if (json.data.f47) {
                        _this.$("gt5").innerHTML = fmtdig(json.data.f47, 1, 2, "", true) + "手";//成交量
                        blinker(0, $("#gt5"))
                        _this.$("rgt5").innerHTML = fmtdig(json.data.f47, 1, 2, "", true) + "手";//总手
                        blinker(0, $("#rgt5"))
                    }
                    if (json.data.f162) {
                        _this.$("gt6").innerHTML = toFixed(json.data.f162);//市盈（动）
                        _this.$("dtsyl").innerHTML = toFixed(json.data.f162);//市盈（动）
                        blinker(0, $("#gt6"))
                    }
                    if (json.data.f163) {
                        _this.$("jtsyl").innerHTML = toFixed(json.data.f163);//市盈（静）
                    }

                    if (json.data.f164) {
                        _this.$("gdsyl").innerHTML = toFixed(json.data.f164);//市盈（动）
                    }

                    if (json.data.f116) {
                        _this.$("gt7").innerHTML = fmtdig(json.data.f116, 1, 2, "", true);//总市值
                        blinker(0, $("#gt7"))
                    }
                    if (json.data.f45) {
                        _this.$("gt9").innerHTML = json.data.f45; _this.$("gt9").className = udcls(json.data.f45, yestoday); $("#gt9").addClass('txtl');//最低
                        _this.$("rgt10").innerHTML = json.data.f45; _this.$("rgt10").className = udcls(json.data.f45, yestoday);//最低
                        blinker(json.data.f169, $("#gt9"))
                        blinker(json.data.f169, $("#gt10"))
                    }
                    if (json.data.f50) {
                        _this.$("gt11").innerHTML = json.data.f50.toFixed(2);//量比
                        _this.$("rgt8").innerHTML = json.data.f50.toFixed(2);//量比
                        blinker(0, $("#gt11"))
                        blinker(0, $("#rgt8"))
                    }
                    if (json.data.f48) {
                        _this.$("gt12").innerHTML = fmtdig(json.data.f48, 1, 2, "", true);//成交额
                        _this.$("rgt6").innerHTML = fmtdig(json.data.f48, 1, 2, "", true);//金额  
                        blinker(0, $("#gt12"))
                        blinker(0, $("#rgt6"))
                    }
                    if (json.data.f167) {
                        _this.$("gt13").innerHTML = json.data.f167.toFixed(2);//市净  
                        blinker(0, $("#gt13"))
                    }
                    if (json.data.f117) {
                        _this.$("gt14").innerHTML = fmtdig(json.data.f117, 1, 2, "", true);//流通市值
                        blinker(0, $("#gt14"))
                    }
                    if (json.data.f191) {
                        _this.$("irwb").innerHTML = json.data.f191.toFixed(2) + "%"; _this.$("irwb").className = udcls(json.data.f191);//委比
                        blinker(json.data.f191, $("#irwb"))
                    }
                    if (json.data.f192) {
                        _this.$("irwc").innerHTML = json.data.f192; _this.$("irwc").className = udcls(json.data.f192);//委差        
                        blinker(json.data.f192, $("#irwc"))
                    }
                    if (json.data.f71) {
                        _this.$("rgt2").innerHTML = json.data.f71; _this.$("rgt2").className = udcls(json.data.f71, yestoday);//均价
                        blinker(json.data.f71 - yestoday, $("#rgt2"))
                    }
                    if (json.data.f161) {
                        _this.$("rgt16").innerHTML = fmtdig(json.data.f161, 1, 2, "", true); _this.$("rgt16").className = "green";//内盘   
                        blinker(-1, $("#irwc"))
                    }
                    if (json.data.f49) {
                        _this.$("rgt15").innerHTML = fmtdig(json.data.f49, 1, 2, "", true); _this.$("rgt15").className = "red";//外盘
                        blinker(1, $("#irwc"))
                    }
                    if (json.data.f44) {
                        _this.$("rgt9").innerHTML = json.data.f44.toFixed(2); _this.$("rgt9").className = udcls(json.data.f44, yestoday);//最高        
                        _this.$("gt2").innerHTML = json.data.f44.toFixed(2); _this.$("gt2").className = udcls(json.data.f44, yestoday); $("#gt2").addClass('txtl');//最高           
                        blinker(json.data.f44 - yestoday, $("#rgt9"))
                        blinker(json.data.f44 - yestoday, $("#gt2"))
                    }
                    //行情报价
                    // if (json.data.f31 && json.data.f32) {
                    //     _this.$("gts5a").innerHTML = json.data.f31.toFixed(2); _this.$("gts5b").innerHTML = json.data.f32; _this.$("gts5a").className = udcls(json.data.f31, yestoday);
                    //     blinker(json.data.f31 - yestoday, $("#gts5a"))
                    //     blinker(0, $("#gts5b"))
                    // }
                    
                    // if (json.data.f33 && json.data.f34) {
                    //     _this.$("gts4a").innerHTML = json.data.f33.toFixed(2); _this.$("gts4b").innerHTML = json.data.f34; _this.$("gts4a").className = udcls(json.data.f33, yestoday);
                    //     blinker(json.data.f33 - yestoday, $("#gts4a"))
                    //     blinker(0, $("#gts4b"))
                    // }
                    
                    // if (json.data.f35 && json.data.f36) {
                    //     _this.$("gts3a").innerHTML = json.data.f35.toFixed(2); _this.$("gts3b").innerHTML = json.data.f36; _this.$("gts3a").className = udcls(json.data.f35, yestoday);
                    //     blinker(json.data.f35 - yestoday, $("#gts3a"))
                    //     blinker(0, $("#gts3b"))
                    // }
                    
                    // if (json.data.f37 && json.data.f38) {
                    //     _this.$("gts2a").innerHTML = json.data.f37.toFixed(2); _this.$("gts2b").innerHTML = json.data.f38; _this.$("gts2a").className = udcls(json.data.f37, yestoday);
                    //     blinker(json.data.f37 - yestoday, $("#gts2a"))
                    //     blinker(0, $("#gts2b"))
                    // }
                    
                    // if (json.data.f39 && json.data.f40) {
                    //     _this.$("gts1a").innerHTML = json.data.f39.toFixed(2);
                    //      _this.$("gts1b").innerHTML = json.data.f40;
                    //       _this.$("gts1a").className = udcls(json.data.f39, yestoday);
                    //     blinker(json.data.f39 - yestoday, $("#gts1a"))
                    //     blinker(0, $("#gts1b"))
                    // }
                    showSalePrice(json.data.f31, $("#gts5a"), yestoday);
                    showSaleNumber(json.data.f32, $("#gts5b"));

                    showSalePrice(json.data.f33, $("#gts4a"), yestoday);
                    showSaleNumber(json.data.f34, $("#gts4b"));

                    showSalePrice(json.data.f35, $("#gts3a"), yestoday);
                    showSaleNumber(json.data.f36, $("#gts3b"));

                    showSalePrice(json.data.f37, $("#gts2a"), yestoday);
                    showSaleNumber(json.data.f38, $("#gts2b"));

                    showSalePrice(json.data.f39, $("#gts1a"), yestoday);
                    showSaleNumber(json.data.f40, $("#gts1b"));



                    // if (json.data.f19 && json.data.f20) {
                    //     _this.$("gtb1a").innerHTML = json.data.f19.toFixed(2); _this.$("gtb1b").innerHTML = json.data.f20; _this.$("gtb1a").className = udcls(json.data.f19, yestoday);
                    //     blinker(json.data.f19 - yestoday, $("#gtb1a"))
                    //     blinker(0, $("#gtb1b"))
                    // }
                    // if (json.data.f17 && json.data.f18) {
                    //     _this.$("gtb2a").innerHTML = json.data.f17.toFixed(2); _this.$("gtb2b").innerHTML = json.data.f18; _this.$("gtb2a").className = udcls(json.data.f17, yestoday);
                    //     blinker(json.data.f17 - yestoday, $("#gtb2a"))
                    //     blinker(0, $("#gtb2b"))
                    // }
                    // if (json.data.f15 && json.data.f16) {
                    //     _this.$("gtb3a").innerHTML = json.data.f15.toFixed(2); _this.$("gtb3b").innerHTML = json.data.f16; _this.$("gtb3a").className = udcls(json.data.f15, yestoday);
                    //     blinker(json.data.f15 - yestoday, $("#gtb3a"))
                    //     blinker(0, $("#gtb3b"))
                    // }
                    // if (json.data.f13 && json.data.f14) {
                    //     _this.$("gtb4a").innerHTML = json.data.f13.toFixed(2); _this.$("gtb4b").innerHTML = json.data.f14; _this.$("gtb4a").className = udcls(json.data.f13, yestoday);
                    //     blinker(json.data.f13 - yestoday, $("#gtb4a"))
                    //     blinker(0, $("#gtb4b"))
                    // }
                    // if (json.data.f11 && json.data.f12) {
                    //     _this.$("gtb5a").innerHTML = json.data.f11.toFixed(2); _this.$("gtb5b").innerHTML = json.data.f12; _this.$("gtb5a").className = udcls(json.data.f11, yestoday);
                    //     blinker(json.data.f11 - yestoday, $("#gtb5a"))
                    //     blinker(0, $("#gtb5b"))
                    // }

                    showSalePrice(json.data.f19, $("#gtb1a"), yestoday);
                    showSaleNumber(json.data.f20, $("#gtb1b"));

                    showSalePrice(json.data.f17, $("#gtb2a"), yestoday);
                    showSaleNumber(json.data.f18, $("#gtb2b"));

                    showSalePrice(json.data.f15,$("#gtb3a"), yestoday);
                    showSaleNumber(json.data.f16, $("#gtb3b"));

                    showSalePrice(json.data.f13, $("#gtb4a"), yestoday);
                    showSaleNumber(json.data.f14, $("#gtb4b"));

                    showSalePrice(json.data.f11, $("#gtb5a"), yestoday);
                    showSaleNumber(json.data.f12, $("#gtb5b"));

                    //资金流分析
                    if (json.data.f135) {
                        $x("hz_a").innerHTML = ForDight(parseFloat(json.data.f135 / 10000), 2);
                        $x("hz_a").className = udcls(json.data.f135);
                    }
                    if (json.data.f136) {
                        $x("hz_b").innerHTML = ForDight(parseFloat(json.data.f136 / 10000), 2).replace("-", "");
                        $x("hz_b").className = udcls(-json.data.f136);
                    }
                    if (json.data.f137) {
                        $x("hz_c").innerHTML = (json.data.f137 / 10000).toFixed(2);
                        $x("hz_c").className = udcls(json.data.f137);
                    }
                    if (json.data.f138) {
                        $x("hz_d").innerHTML = (json.data.f138 / 10000).toFixed(2) || "";
                    }
                    if (json.data.f139) {
                        $x("hz_e").innerHTML = (json.data.f139 / 10000).toFixed(2).replace("-", "") || "";
                    }
                    if (json.data.f141) {
                        $x("hz_f").innerHTML = (json.data.f141 / 10000).toFixed(2) || "";
                    }
                    if (json.data.f142) {
                        $x("hz_g").innerHTML = (json.data.f142 / 10000).toFixed(2).replace("-", "") || "";
                    }
                    if (json.data.f144) {
                        $x("hz_h").innerHTML = (json.data.f144 / 10000).toFixed(2) || "";
                    }
                    if (json.data.f145) {
                        $x("hz_i").innerHTML = (json.data.f145 / 10000).toFixed(2).replace("-", "") || "";
                    }
                    if (json.data.f147) {
                        $x("hz_j").innerHTML = (json.data.f147 / 10000).toFixed(2) || "";
                    }
                    if (json.data.f148) {
                        $x("hz_k").innerHTML = (json.data.f148 / 10000).toFixed(2).replace("-", "") || "";
                    }
                    if (json.data.f206) {
                        _this.$("gts5c").innerHTML = json.data.f206; _this.$("gts5c").className = udcls(json.data.f206);
                    }
                    if (json.data.f206 == 0) {
                        _this.$("gts5c").innerHTML = '';
                    }
                    if (json.data.f207) {
                        _this.$("gts4c").innerHTML = json.data.f207; _this.$("gts4c").className = udcls(json.data.f207);
                    }
                    if (json.data.f207 == 0) {
                        _this.$("gts4c").innerHTML = '';
                    }
                    if (json.data.f208) {
                        _this.$("gts3c").innerHTML = json.data.f208; _this.$("gts3c").className = udcls(json.data.f208);
                    }
                    if (json.data.f208 == 0) {
                        _this.$("gts3c").innerHTML = '';
                    }
                    if (json.data.f209) {
                        _this.$("gts2c").innerHTML = json.data.f209; _this.$("gts2c").className = udcls(json.data.f209);
                    }
                    if (json.data.f209 == 0) {
                        _this.$("gts2c").innerHTML = '';
                    }
                    if (json.data.f210) {
                        _this.$("gts1c").innerHTML = json.data.f210; _this.$("gts1c").className = udcls(json.data.f210);
                        if (json.data.f210 > 0) {
                            $("gts1c").css('backgro')
                        }
                    }
                    if (json.data.f210 == 0) {
                        _this.$("gts1c").innerHTML = '';
                    }
                    if (json.data.f211) {
                        _this.$("gtb1c").innerHTML = json.data.f211; _this.$("gtb1c").className = udcls(json.data.f211);
                    }
                    if (json.data.f211 == 0) {
                        _this.$("gtb1c").innerHTML = '';
                    }
                    if (json.data.f212) {
                        _this.$("gtb2c").innerHTML = json.data.f212; _this.$("gtb2c").className = udcls(json.data.f212);
                    }
                    if (json.data.f212 == 0) {
                        _this.$("gtb2c").innerHTML = '';
                    }
                    if (json.data.f213) {
                        _this.$("gtb3c").innerHTML = json.data.f213; _this.$("gtb3c").className = udcls(json.data.f213);
                    }
                    if (json.data.f213 == 0) {
                        _this.$("gtb3c").innerHTML = '';
                    }
                    if (json.data.f214) {
                        _this.$("gtb4c").innerHTML = json.data.f214; _this.$("gtb4c").className = udcls(json.data.f214);
                    }
                    if (json.data.f214 == 0) {
                        _this.$("gtb4c").innerHTML = '';
                    }
                    if (json.data.f215) {
                        _this.$("gtb5c").innerHTML = json.data.f215; _this.$("gtb5c").className = udcls(json.data.f215);
                    }
                    if (json.data.f215 == 0) {
                        _this.$("gtb5c").innerHTML = '';
                    }
                    //新版可转债H股B股推送显示
                    var marketB = json.data.f270 == "1" ? "sh" : "sz";
                    var marketH = json.data.f257;
                    var marketzhai = json.data.f263 == "1" ? "sh" : "sz";
                    if (json.data.f268) {
                        var zzcolor = json.data.f268 > 0 ? 'red' : (json.data.f268 < 0 ? 'green' : '');
                        $('#zzper').html(json.data.f268.toFixed(2) + '%').addClass(zzcolor)
                        $('#zzprice').html('<span class=' + zzcolor + '>' + json.data.f267.toFixed(3) + '<span>')
                        $('#zzm').html((parseFloat(json.data.f267) - parseFloat(zzyestoday)).toFixed(3)).addClass(zzcolor)
                        blinker(json.data.f268, $("#zzper")); blinker(json.data.f268, $("#zhuanzhaic"));
                        blinker((parseFloat(json.data.f267) - parseFloat(zzyestoday)).toFixed(3), $("#zzm"));
                    }
                    // console.log(json.data.f251&&($("#Z-box").find("b").text()==''))
                    if (json.data.f251 && ($("#Z-box").find("b").text() == '') && ($("#H-box").find("b").text() != '') && !ggrc) {
                        var Hcolor = json.data.f252 > 0 ? 'red' : (json.data.f252 < 0 ? 'green' : '');
                        $('#Hprice').html(json.data.f251.toFixed(3)).addClass(Hcolor)
                        $('#Hm').html((parseFloat(json.data.f251) - Hyestoday).toFixed(3)).addClass(Hcolor)
                        $('#Hper').html(json.data.f252.toFixed(2) + '%').addClass(Hcolor)
                        if ($("#GDR").find("b").text() != '') {
                            if (json.data.f281) {
                                var ukcolor = json.data.f282 > 0 ? 'red' : (json.data.f282 < 0 ? 'green' : '');
                                $('#ukprice').html(json.data.f281.toFixed(3)).addClass(ukcolor)
                                $('#ukmi').html((json.data.f281 - UKyestoday).toFixed(3)).addClass(ukcolor)
                                $('#ukpercent').html(json.data.f282.toFixed(2) + '%').addClass(ukcolor)
                                blinker(json.data.f282, $("#ukpercent"));
                                blinker(json.data.f282, $("#ukprice"));
                                blinker(json.data.f282, $("#ukmi"));
                            }
                        }
                        blinker(json.data.f252, $("#relation-container"));
                        blinker(json.data.f252, $("#rstockb"));
                    }
                    if (json.data.f275 && ($("#Z-box").find("b").text() == '') && ($("#H-box").find("b").text() == '')) {
                        var Bcolor = json.data.f275 > 0 ? 'red' : (json.data.f275 < 0 ? 'green' : '');
                        // $("#relation-container").html('<div id="rstocka"><a href="http://quote.eastmoney.com/'+marketB+ json.data.f269+'.html" target="_blank">'+_this._Name+' B股行情</a></div><div id="rstockb" class='+Bcolor+'>'+json.data.f274+'&nbsp;&nbsp;'+json.data.f275.toFixed(2)+'%</div>').addClass('fr quote_right')                        
                        $("#rstockb").html(json.data.f274 + '&nbsp;&nbsp;' + json.data.f275.toFixed(2) + '%').addClass(Bcolor)
                        blinker(json.data.f275, $("#rstockb"));
                    }
                }
            }
        },
        //转债股H股B股
        DISRSI: function () {//关联股票
            switch (_this._RType)//1A股 B股 2港股
            {
                case "1":
                    $.ajax({
                        url: gdomain + "CompatiblePage.aspx?Type=ZT&jsName=js_skr&fav=" + _this._RCode + "" + _this._RMarket + "&Reference=xml",
                        dataType: "script",
                        success: function () {
                            var jnm = eval("js_skr");
                            if (jnm.favif != null && jnm.favif != "") {
                                var _MarketCode = _this._RMarket == "1" ? "sh" + _this._RCode : "sz" + _this._RCode; var temgl = jnm.favif[0].split(',');
                                for (var i = 0; i < temgl.length; i++) {
                                    _this.$("rstocka").innerHTML = "<a href=\"http://quote.eastmoney.com/" + _MarketCode + ".html\" target=\"_blank\">" + temgl[2].replace("A股", "").replace("a股", "").replace("Ａ股", "").replace("a", "").replace("A", "").replace("Ａ", "") + " B股行情</a>";
                                    _this.$("rstockb").innerHTML = temgl[3] + "&nbsp;&nbsp;" + temgl[4]; _this.$("rstockb").className = udcls(temgl[4]);
                                    break;
                                }
                            }
                        }
                    });
                    break;
                case "2":
                    $.getScript("http://hq2hk.eastmoney.com/EM_Quote2010NumericApplication/Index.aspx?reference=xml&Type=z&sortType=A&sortRule=1&jssort=1&jsname=gl_data&ids=" + _this._RCode + "5&math=" + formatm(), function () {
                        if (gl_data.quotation != null && gl_data.quotation != "") {
                            var dataRow = String(gl_data.quotation).split(",");
                            _this.$("rstocka").innerHTML = "<a href=\"http://quote.eastmoney.com/hk/" + dataRow[1] + ".html\" target=\"_blank\">" + dataRow[2].substr(0, 6) + " H股行情</a>";
                            _this.$("rstockb").innerHTML = dataRow[5] + "&nbsp;&nbsp;" + dataRow[10] + "&nbsp;&nbsp;" + dataRow[11]; _this.$("rstockb").className = udcls(dataRow[10]);
                        }
                    });
                    break;
                case "3":
                    $.getScript(gdomain + "CompatiblePage.aspx?Type=ZT&jsName=js_skr&fav=" + _this._RCode + "" + _this._RMarket + "&Reference=xml&rt=" + formatm(), function () {
                        var jnm = eval("js_skr");
                        if (jnm.favif != null && jnm.favif != "") {
                            var _MarketCode = _this._RMarket == "1" ? "sh" + _this._RCode : "sz" + _this._RCode;
                            var temgl = jnm.favif[0].split(',');
                            for (var i = 0; i < temgl.length; i++) {
                                _this.$("rstocka").innerHTML = "<a href=\"http://quote.eastmoney.com/" + _MarketCode + ".html\" target=\"_blank\">" + temgl[2].replace("B股", "").replace("b股", "").replace("Ｂ股", "").replace("b", "").replace("B", "").replace("Ｂ", "") + "B股行情</a>";
                                _this.$("rstockb").innerHTML = temgl[3] + "&nbsp;&nbsp;" + temgl[4]; _this.$("rstockb").style.color = udcls(temgl[4]);
                                break;
                            }
                        }
                    });
                    break;
            }
            if (typeof String.prototype.endsWith !== "function") {
                String.prototype.endsWith = function (str) {
                    var reg = new RegExp(str + "$");
                    return reg.test(this);
                }
            }
            jQuery.ajax({
                url: "//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?&type=CT&sty=GB20GFBTC&st=z&js=((x))&token=4f1862fc3b5e77c150a2b985b12db0fd",
                data: {
                    cmd: _this._Code + _this._Market
                },
                dataType: "jsonp",
                jsonp: 'cb',
                scriptCharset: "utf-8",
                success: function (json) {
                    if (!json || typeof json !== "string") return false;
                    var item = json.split(",");
                    if (!item[9] || item[9] === "-" || !item[3] || item[3] === "-") return false;
                    //item[10] = "2017-09-26";
                    //(0)市场 (1)代码 (2)名称 (3)发行日期 (4)上市日期 (5)最新价(现价) (6)涨跌额 (7)涨跌幅% (8)申购代码 (9)申购债券名称 (10)当前行情时间
                    var issue_date = new Date(item[3].replace(/-/g, "/")),
                        list_date = item[4] == "-" ? null : new Date(item[4].replace(/-/g, "/")),
                        quote_time = new Date(item[10].replace(/-/g, "/").split(" ")[0]),
                        delist_date = new Date(item[17].replace(/-/g, "/"));
                    if (delist_date && quote_time > delist_date) return;
                    var $line1, $line2, $line3;
                    if (quote_time < issue_date) {
                        if (item[11] && item[11] !== "-") {
                            $line1 = $("<div><a target=\"_blank\" href='http://data.eastmoney.com/kzz/detail/" + item[11] + ".html'>" + item[9] + "</a></div>");
                            $line3 = $("<div>").html($("<a target=\"_blank\" href='http://data.eastmoney.com/kzz/detail/" + item[11] + ".html'></a>").text("点击查看更多>>"));
                        }
                        else {
                            $line1 = $("<div><span>" + item[9] + "</span></div>");
                        }
                        $line2 = $("<div><span>申购日期：" + item[3] + "</span></div>");
                    }
                    else if (+quote_time == +issue_date) {
                        $line1 = $("<div class='red'><span>" + item[9] + "今日申购</span></div>");
                        $line2 = $("<div class='red'><span>申购代码：" + item[8] + "</span></div>");
                        if (item[11] && item[11] !== "-") {
                            $line3 = $("<div class='red'>").html($("<a target=\"_blank\" href='http://data.eastmoney.com/kzz/detail/" + item[11] + ".html'></a>").text("点击查看更多>>"));
                        }
                    }
                    else if (quote_time < list_date || !list_date) {
                        if (item[11] && item[11] !== "-") {
                            $line1 = $("<div>").html($("<a target=\"_blank\" href='http://data.eastmoney.com/kzz/detail/" + item[11] + ".html'></a>").text(item[9]));
                            $line3 = $("<div>").html($("<a target=\"_blank\" href='http://data.eastmoney.com/kzz/detail/" + item[11] + ".html'></a>").text("点击查看更多>>"));
                        }
                        else {
                            $line1 = $("<span></span>").text(item[9]).appendTo("<div>");
                        }
                        $line2 = !list_date ? $("<div><span>待上市</span></div>") : $("<div><span>上市日期：" + item[4] + "</span></div>");
                    }
                    else {
                        var _color = item[15] > 0 ? "red" : item[15] < 0 ? "green" : "";
                        $line1 = $("<div><a target=\"_blank\" href='//quote.eastmoney.com/bond/" + (item[12].endsWith("SH") ? "sh" : "sz") + item[11] + ".html'>" + item[13] + "行情" + "</a></div>");
                        $line2 = $("<div>").append($("<span></span>").addClass(_color).text(item[14]));
                        $line3 = $("<div>").append($("<span></span>").text(item[15]).addClass(_color)).append($("<span></span>").text(item[16] === "-" ? "-" : item[16] + "%").addClass(_color));
                    }
                    var $container = $("#relation-container").addClass("bond-right").removeClass("data-right quote_right").html("");
                    $container.append($line1).append($line2).append($line3);
                }
            });
        },


        // UpZjlx: function () {
        //     NewZJL(_this._Code);
        // },
        UpPic: function (refk, pq) {//更新图 (refk是否需要更新K图，是否为盘前图)
            var pqtit = _this.$("actTab4").getElementsByTagName("span");
            for (var i = 0; i < pqtit.length; i++) {
                pqtit[i].className = "";
            }
            if (pq) {
                pqtit[0].className = "cur";
                if (_this.Lstng == "0") {
                    _this.$("picr").src = "http://hqres.eastmoney.com/EMQuote_Lib/img/picrnotfund.gif";
                } else {
                    _this.$("picr").src = PicN.replace("{0}", _this._Code).replace("{1}", _this._Market).replace("{2}", "rc") + "&rt=" + formatm();
                }
            } else {
                pqtit[1].className = "cur";
                if (_this.Lstng == "0") {
                    _this.$("picr").src = "http://hqres.eastmoney.com/EMQuote_Lib/img/picrnotfund.gif";
                } else {
                    var pic_url = PicN;
                    if (Math.random() < 1) {
                        pic_url = "//webquotepic.eastmoney.com/GetPic.aspx?id={0}{1}&imageType={2}&token=44c9d251add88e27b65ed86506f6e5da";
                    }
                    if (_this.IsAGu == 1) {
                        _this.$("picr").src = pic_url.replace("{0}", _this._Code).replace("{1}", _this._Market).replace("{2}", "r") + "&rt=" + formatm();
                    } else {
                        _this.$("picr").src = PicN.replace("{0}", _this._Code).replace("{1}", _this._Market).replace("{2}", "rc") + "&rt=" + formatm();
                    }
                }
            }
            if (refk) {
                if (_this.Lstng == "0") {
                    _this.$("pick").src = "http://hqres.eastmoney.com/EMQuote_Lib/img/picknotfund.gif?1";
                } else {
                    if (_this.CekNSSs()) {
                        _this.$("pick").src = "http://hqres.eastmoney.com/EMQuote_Lib/img/picknotfund.gif?2";
                    } else {
                        _this.$("pick").src = PicN.replace("{0}", _this._Code).replace("{1}", _this._Market).replace("{2}", "KXL") + "&rt=" + formatm();
                    }
                }
            }
        },
        CekNSSs: function () {
            var res = false;
            var dt = new Date(window["bjTime"] * 1000);
            var ys = dt.getFullYear(); var ms = dt.getMonth() + 1; var ds = dt.getDate();
            var hs = dt.getHours(); var mms = dt.getMinutes();
            if (_this.Ssrq != "") {
                var _dt = new Date(_this.Ssrq);
                var _ys = _dt.getFullYear(); var _ms = _dt.getMonth() + 1; var _ds = _dt.getDate();
                if (ys == _ys && ms == _ms && ds == _ds) {
                    if (hs < 9 || (hs == 9 && mms < 28)) { res = true; }
                }
            } else {
                if (hs < 9 || (hs == 9 && mms < 28)) { res = true; }
            }
            return res;
        },
        DisTfpxx: function () {
            var __dt = new Date(window["bjTime"] * 1000);
            var __hs = __dt.getHours(); var __mms = __dt.getMinutes();
            if (__hs < 9 || (__hs <= 9 && __mms <= 14)) {
                _this.$("price9").innerHTML = "<span class=\"lstng\"><a href=\"http://data.eastmoney.com/tfpxx/\" target=\"_blank\" class=\"red tp\">停牌</a></span>";
                _this.$("arrow-find").className = "";
                _this.$("km1").innerHTML = ""; _this.$("km1").className = "xp3";
                _this.$("km2").innerHTML = ""; _this.$("km2").className = "xp4";
            }
        },
        hqcr: function (hq_cr_type, _hq_cr_time, hq_cr_cnt) {
            return false
        },
        CheckBeforeNine: function () {
            var res = false;
            var __dt = new Date(window["bjTime"] * 1000);
            var __hs = __dt.getHours(); var __mms = __dt.getMinutes();
            if (__hs < 8 && __hs < 9) {
                res = true;
            }
            return res;
        },
        formateDate: function (date, fmt) {
            fmt = fmt || "yyyy-MM-dd HH:mm:ss"
            if (typeof date === "string"){
                // console.info(date)
                if(date.length == 23){
                    date = date.substring(0,19)
                }
                
                date = new Date(date.replace(/-/g, '/').replace('T', ' ').split('+')[0]);
            }    
            var o = {
                "M+": date.getMonth() + 1, //月份         
                "d+": date.getDate(), //日         
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时         
                "H+": date.getHours(), //小时         
                "m+": date.getMinutes(), //分         
                "s+": date.getSeconds(), //秒         
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度         
                "S": date.getMilliseconds() //毫秒         
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        //个股研报和行业研报的字数截断，js控制
        YBCutstr: function () {
            var $ggybTr = $('#ggybTable tr');
            var tr1_td0 = $ggybTr.eq(1).find('td:eq(0) a');
            var tr1_td1 = $ggybTr.eq(1).find('td:eq(1) span');

            var tr2_td0 = $ggybTr.eq(2).find('td:eq(0) a');
            var tr2_td1 = $ggybTr.eq(2).find('td:eq(1) span');

            var tr3_td0 = $ggybTr.eq(3).find('td:eq(0) a');
            var tr3_td1 = $ggybTr.eq(3).find('td:eq(1) span');

            var tr4_td0 = $ggybTr.eq(4).find('td:eq(0) a');
            var tr4_td1 = $ggybTr.eq(4).find('td:eq(1) span');

            var tr5_td0 = $ggybTr.eq(5).find('td:eq(0) a');
            var tr5_td1 = $ggybTr.eq(5).find('td:eq(1) span');

            tr1_td0.attr("title", tr1_td0.html()).html(cutstr(tr1_td0.html(), 8, '..'));
            tr1_td1.attr("title", tr1_td1.html()).html(cutstr(tr1_td1.html(), 8, '..'));

            tr2_td0.attr("title", tr2_td0.html()).html(cutstr(tr2_td0.html(), 8, '..'));
            tr2_td1.attr("title", tr2_td1.html()).html(cutstr(tr2_td1.html(), 8, '..'));

            tr3_td0.attr("title", tr3_td0.html()).html(cutstr(tr3_td0.html(), 8, '..'));
            tr3_td1.attr("title", tr3_td1.html()).html(cutstr(tr3_td1.html(), 8, '..'));

            tr4_td0.attr("title", tr4_td0.html()).html(cutstr(tr4_td0.html(), 8, '..'));
            tr4_td1.attr("title", tr4_td1.html()).html(cutstr(tr4_td1.html(), 8, '..'));

            tr5_td0.attr("title", tr5_td0.html()).html(cutstr(tr5_td0.html(), 8, '..'));
            tr5_td1.attr("title", tr5_td1.html()).html(cutstr(tr5_td1.html(), 8, '..'));

            var $ggybTr = $('#hyybTable tr');
            var hyybTr1_td0 = $ggybTr.eq(1).find('td:eq(0) a');
            var hyybTr1_td1 = $ggybTr.eq(1).find('td:eq(1) span');

            var hyybTr2_td0 = $ggybTr.eq(2).find('td:eq(0) a');
            var hyybTr2_td1 = $ggybTr.eq(2).find('td:eq(1) span');

            var hyybTr3_td0 = $ggybTr.eq(3).find('td:eq(0) a');
            var hyybTr3_td1 = $ggybTr.eq(3).find('td:eq(1) span');

            var hyybTr4_td0 = $ggybTr.eq(4).find('td:eq(0) a');
            var hyybTr4_td1 = $ggybTr.eq(4).find('td:eq(1) span');

            var hyybTr5_td0 = $ggybTr.eq(5).find('td:eq(0) a');
            var hyybTr5_td1 = $ggybTr.eq(5).find('td:eq(1) span');

            hyybTr1_td0.attr('title', hyybTr1_td0.html()).html(cutstr(hyybTr1_td0.html(), 8, '..'));
            hyybTr1_td1.attr('title', hyybTr1_td1.html()).html(cutstr(hyybTr1_td1.html(), 8, '..'));

            hyybTr2_td0.attr('title', hyybTr2_td0.html()).html(cutstr(hyybTr2_td0.html(), 8, '..'));
            hyybTr2_td1.attr('title', hyybTr2_td1.html()).html(cutstr(hyybTr2_td1.html(), 8, '..'));

            hyybTr3_td0.attr('title', hyybTr3_td0.html()).html(cutstr(hyybTr3_td0.html(), 8, '..'));
            hyybTr3_td1.attr('title', hyybTr3_td1.html()).html(cutstr(hyybTr3_td1.html(), 8, '..'));

            hyybTr4_td0.attr('title', hyybTr4_td0.html()).html(cutstr(hyybTr4_td0.html(), 8, '..'));
            hyybTr4_td1.attr('title', hyybTr4_td1.html()).html(cutstr(hyybTr4_td1.html(), 8, '..'));

            hyybTr5_td0.attr('title', hyybTr5_td0.html()).html(cutstr(hyybTr5_td0.html(), 8, '..'));
            hyybTr5_td1.attr('title', hyybTr5_td1.html()).html(cutstr(hyybTr5_td1.html(), 8, '..'));

        },

        //四分位属性
        quartile: function () {
            //console.log(Def,'def')
            //注意域名
            $.ajax({
                // 'http://" + mathNum +".push2.eastmoney.com/api/qt/slist/get?secid=0.300059&spt=1&np=3&fltt=2&invt=2&fields=f137,f12,f13,f14,f20,f138,f37,f45,f49,f134,f135,f129,f1000,f2000&ut=bd1d9ddb04089700cf9c27f6f7426281
                url: "//push2.eastmoney.com/api/qt/slist/get?spt=1&np=3&fltt=2&invt=2&fields=f9,f12,f13,f14,f20,f23,f37,f45,f49,f134,f135,f129,f1000,f2000,f3000&ut=bd1d9ddb04089700cf9c27f6f7426281" + '&wbp2u=' + delayparams,
                data: { secid: Def._Market_10 + '.' + Def._Code },
                dataType: "jsonp",
                scriptCharset: "utf-8",
                jsonp: "cb",
                success: function (json) {
                    if (json && json.data) {
                        var items = json.data.diff;
                        if (items && items.length > 0) {
                            // 20总市值  135净资产  45净利润   9市盈率  23市净率  49毛利率  129净利率   37ROE                                                    
                            var models = [], obj = items[0], obj_1 = items[1], model = {}, model_1 = {}, model_2 = {}, model_2 = {};

                            //表格第一行数据
                            model = {
                                name: '<a href="http://data.eastmoney.com/stockdata/' + obj.f12 + '.html" target="_blank">' + obj.f14 + '</a>',
                                zsz: fmtdig(obj.f20, 1, 2, "", true),
                                jzc: fmtdig(obj.f135, 1, 2, "", true),
                                jlr: fmtdig(obj.f45, 1, 2, "", true),
                                syl: specialData(obj.f9),
                                sjl: specialData(obj.f23),
                                mll: addPercent(obj.f49),
                                jll: addPercent(obj.f129),
                                ROE: addPercent(obj.f37)
                            };
                            //行业平均数据
                            model_1 = {
                                name: '<a href="//quote.eastmoney.com/center/boardlist.html#boards2-90.'+obj_1.f12+'"  target="_blank">' + obj_1.f14 + '</a></br><b class="color979797">(行业平均)</b>',
                                zsz: fmtdig(obj_1.f2020, 1, 2, "", true),
                                jzc: fmtdig(obj_1.f2135, 1, 2, "", true),
                                jlr: fmtdig(obj_1.f2045, 1, 2, "", true),
                                syl: parseFloat(obj_1.f2009) ? obj_1.f2009.toFixed(2) : obj_1.f2009,
                                sjl: parseFloat(obj_1.f2023) ? obj_1.f2023.toFixed(2) : obj_1.f2023,
                                mll: addPercent(obj_1.f2049),
                                jll: addPercent(obj_1.f2129),
                                ROE: addPercent(obj_1.f2037)
                            };
                            // 行业排名
                            model_2 = {
                                name: "<b>行业排名</b>",
                                zsz: obj.f1020 + '|' + obj_1.f134,
                                jzc: obj.f1135 + '|' + obj_1.f134,
                                jlr: obj.f1045 + '|' + obj_1.f134,
                                syl: specialData(obj.f9, obj.f1009, true) + '|' + obj_1.f134,
                                sjl: specialData(obj.f23, obj.f1023, true) + '|' + obj_1.f134,
                                mll: obj.f1049 + '|' + obj_1.f134,
                                jll: obj.f1129 + '|' + obj_1.f134,
                                ROE: obj.f1037 + '|' + obj_1.f134
                            };
                            model_3 = CwzbHtml(obj)
                            models.push(model, model_1, model_2, model_3);
                            var $_html = "";
                            //console.log(models, '整理数据')
                            for (var i = 0; i < models.length; i++) {
                                var item = models[i];
                                $_html += '<tr>' +
                                    '<td> ' + item.name + '</td >' +
                                    '<td> ' + item.zsz + '</td >' +
                                    '<td> ' + item.jzc + '</td >' +
                                    '<td> ' + item.jlr + '</td >' +
                                    '<td> ' + item.syl + '</td >' +
                                    '<td> ' + item.sjl + '</td >' +
                                    '<td> ' + item.mll + '</td >' +
                                    '<td> ' + item.jll + '</td >' +
                                    '<td> ' + item.ROE + '</td >' +
                                    '</tr > '
                                '</tr > '
                            }
                            $('#cwzbDataBox').html($_html);
                            showRedTipsHover();
                        }
                    }
                }
            })
        },
        //个股研报
        stockReport: function () {
            var date = new Date();
            date = new Date(date.setFullYear(date.getFullYear() - 2));
            var _url = "//reportapi.eastmoney.com/report/list?beginTime=" + this.formateDate(date, "yyyy-MM-dd") + "&endTime=" + this.formateDate(new Date(), "yyyy-MM-dd") + "&fields=orgCode,orgSName,sRatingName,encodeUrl,title,publishDate,market&pageNo=1&pageSize=5&qType=0&code=" + this._Code;
            var that = this;
            var html = '<tr><td align="center">机构</td><td align="center">评级</td><td class="text-indent10">研报</td></tr>';
            getNewReportUrl(_url, function (data) {
                var market = data[0].market;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    html += '<tr><td align="center"><a target="_blank" href="http://data.eastmoney.com/report/orgpublish.jshtml?orgcode=' + item.orgCode + '" class="lightBlue" title="' + item.orgSName + '">' + cutstr(item.orgSName, 8, "..") + '</a></td>' +
                        '<td align="center"><span title="' + item.sRatingName + '">' + cutstr(item.sRatingName, 4, "..") + '</span></td>' +
                        '<td class="text-indent10"><span class="dt">' + that.formateDate(item.publishDate, "MM-dd") + '</span><a target="_blank" href="http://data.eastmoney.com/report/zw_stock.jshtml?encodeUrl=' + item.encodeUrl + '" title="' + item.title + '">' + cutstr(item.title, 26) + '</a></td></tr>'
                }
                $("#ggybTable tbody").html(html);
                if (that._Code) {
                    $('#stockReport').attr("href", "http://data.eastmoney.com/report/singlestock.jshtml?stockcode=" + that._Code + "&market=" + market)
                    $('#stockReportMore').attr("href", "http://data.eastmoney.com/report/singlestock.jshtml?stockcode=" + that._Code + "&market=" + market)
                } else {
                    $('#stockReport').attr("href", "http://data.eastmoney.com/report/")
                    $('#stockReportMore').attr("href", "http://data.eastmoney.com/report/")
                }
            }, function () {
                html += "<tr><td colspan=\"3\"><span class=\"nodatalist\">暂无数据</span></td></tr>";
                $("#ggybTable tbody").html(html);
                $('#stockReport').attr("href", "http://data.eastmoney.com/report/")
                $('#stockReportMore').attr("href", "http://data.eastmoney.com/report/")
            })
        },
        //行业研报
        hyReport: function () {
            var date = new Date();
            date = new Date(date.setFullYear(date.getFullYear() - 2));
            var _url = "//reportapi.eastmoney.com/report/list?beginTime=" + this.formateDate(date, "yyyy-MM-dd") + "&endTime=" + this.formateDate(new Date(), "yyyy-MM-dd") + "&fields=orgCode,orgSName,sRatingName,encodeUrl,title,publishDate&pageNo=1&pageSize=5&qType=1&industryCode=" + this._HyId;
            var that = this;
            var html = '<tr><td align="center">机构</td><td align="center">评级</td><td class="text-indent10">研报</td></tr>';
            getNewReportUrl(_url, function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    html += '<tr><td align="center"><a target="_blank" href="http://data.eastmoney.com/report/orgpublish.jshtml?orgcode=' + item.orgCode + '" class="lightBlue" title="' + item.orgSName + '">' + cutstr(item.orgSName, 8, "..") + '</a></td>' +
                        '<td align="center"><span title="' + item.sRatingName + '">' + cutstr(item.sRatingName, 4, "..") + '</span></td>' +
                        '<td class="text-indent10"><span class="dt">' + that.formateDate(item.publishDate, "MM-dd") + '</span><a target="_blank" href="http://data.eastmoney.com/report/zw_industry.jshtml?encodeUrl=' + item.encodeUrl + '" title="' + item.title + '">' + cutstr(item.title, 26) + '</a></td></tr>'
                }
                $("#hyybTable tbody").html(html)
            }, function () {
                html += "<tr><td colspan=\"3\"><span class=\"nodatalist\">暂无数据</span></td></tr>";
                $("#hyybTable tbody").html(html)
            })
        }

    };

    window.QaDefault = QaDefault;
})();


//市盈率特殊处理
function specialData(num, pm, status) {
    var syl = parseFloat(num), item = "";
    if (!status) {
        if (syl >= 0 || syl < 0) {
            syl >= 0 ? item = syl.toFixed(2) : item = "负值";
        } else {
            syl ? item = syl.toFixed(2) : item = "-";
        }
    } else {
        if (syl >= 0) {
            item = parseFloat(pm);
        } else {
            item = "-";
        }
    }

    return item;
}
//四分位的hover事件
function showRedTipsHover() {
    $(".showRedTips").mouseover(function () {
        $(".sfwsx_title").hide();
        if ($(this).find(".sfwsx_title").length != 0) {
            $(this).find(".sfwsx_title").show();
        } else {
            $(this).parent().find(".sfwsx_title").show();
        }

    });

    $(".showRedTips").mouseout(function () {
        $(".sfwsx_title").hide();
    });
}

//四分位数据逻辑
function CwzbHtml(obj) {
    var text = {
        td_0: '<div class="sfwsx_title" style = "display: none;">四分位属性是指根据每个指标的属性，进行数值大小排序，然后分为四等分，每个部分大约包含排名的四分之一。将属性分为高、较高、较低、低四类。<span class="red">注：鼠标移至四分位图标上时，会出现每个指标的说明和用途。</div>',
        td_1: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为公司总股本乘以市价。该指标侧面反映出一家公司的规模和行业地位。总市值越大，公司规模越大，相应的行业地位也越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span> </div>',
        td_2: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为资产总额减去负债后的净额。该指标由实收资本、资本公积、盈余公积和未分配利润等构成，反映企业所有者在企业中的财产价值。净资产越大，信用风险越低。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>',
        td_3: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为：净利润=利润总额-所得税费用。净利润是一个企业经营的最终成果，净利润多，企业的经营效益就好。<br><span class="red">注：四分位属性以行业排名为比较基准。</span>',
        td_4: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为公司股票价格除以每股利润。该指标主要是衡量公司的价值，高市盈率一般是由高成长支撑着。市盈率越低，股票越便宜，相对投资价值越大。<br><span class="red">注：四分位属性以行业排名为比较基准。</span> </div>',
        td_5: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为每股股价与每股净资产的比率。市净率越低，每股内含净资产值越高，投资价值越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>',
        td_6: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为毛利与销售收入的比率。毛利率越高，公司产品附加值越高，赚钱效率越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>',
        td_7: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为净利润与主营业务收入的比率。该指标表示企业每单位资产能获得净利润的数量，这一比率越高，说明企业全部资产的盈利能力越强。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>',
        td_8: '<div class="sfwsx_title" style = "display: none; margin-left:55px;margin-top:-40px;">公式为税后利润与净资产的比率。该指标反映股东权益的收益水平，用以衡量公司运用自有资本的效率。指标值越高，说明投资带来的收益越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    };

    model_3 = {
        name: '<b>四分位属性</b><b class="showRedTips hxsjccsyl" id="cwzb_sfwsxTit">' + text.td_0 + '</b>',
        zsz: rankFun(obj.f3020) + '<p> ' + getDesc(obj.f3020) + '</p>' + text.td_1,
        jzc: rankFun(obj.f3135) + '<p> ' + getDesc(obj.f3135) + '</p>' + text.td_2,
        jlr: rankFun(obj.f3045) + '<p> ' + getDesc(obj.f3045) + '</p>' + text.td_3,
        syl: rankFun(obj.f3009, obj.f9, "syl") + '<p> ' + getDesc(obj.f3009, obj.f9, "市盈率") + '</p>' + text.td_4,
        sjl: rankFun(obj.f3023, obj.f23, "sjl") + '<p> ' + getDesc(obj.f3023, obj.f23, "市净率") + '</p>' + text.td_5,
        mll: rankFun(obj.f3049) + '<p> ' + getDesc(obj.f3049) + '</p>' + text.td_6,
        jll: rankFun(obj.f3129) + '<p> ' + getDesc(obj.f3129) + '</p>' + text.td_7,
        ROE: rankFun(obj.f3037) + '<p> ' + getDesc(obj.f3037) + '</p>' + text.td_8
    }
    return model_3
}
function getDesc(rank, num, dir) { //市盈率市净率还要重新考虑
    var item = "";
    var $html = '- - <b title="' + dir + '为负值，不参与四分位排名" class="hxsjccsyl" style="margin - top: 5px;"></b>'
    if (dir) {
        //市盈率市净率四分位属性判断之前先判断市净率市盈率值的正负，正的话直接用rank判断，负值直接--加title
        var _num = parseFloat(num);
        if (_num >= 0) {
            if (parseInt(rank)) {
                if (0 < rank && rank < 5) {
                    var desc = ['高', '较高', '较低', '低'];
                    item = desc[rank - 1];
                } else {
                    item = '- -';
                }
            } else {
                item = $html;
            }
        } else if (_num < 0) {
            item = $html;
        } else {
            item = '- -';
        }
    } else {
        if (parseInt(rank)) {
            if (0 < rank && rank < 5) {
                var desc = ['高', '较高', '较低', '低'];
                item = desc[rank - 1];
            } else {
                item = '- -';
            }
        } else {
            item = $html;
        }
    }
    return item;
}

function rankFun(str, num, dir) {
    //市盈率市净率的展示是反的
    var _str = Number(str);
    var bgColor_1 = "", bgColor_2 = "", bgColor_3 = "", bgColor_4 = "";
    if (dir) {
        //市盈率市净率为负值时特殊处理
        var _num = parseFloat(num);
        if (_num >= 0) {
            _str = _str;
        } else {
            _str = 0;
        }
        if (_str >= 1) {
            bgColor_1 = "#deecff";
        }
        if (_str >= 2) {
            bgColor_2 = "#c4ddff";
        }
        if (_str >= 3) {
            bgColor_3 = "#a3cbff";
        }
        if (_str >= 4) {
            bgColor_4 = "#78b1ff";
        }

    } else {

        if (_str <= 1) {
            bgColor_1 = "#78b1ff";
        }
        if (_str <= 2) {
            bgColor_2 = "#a3cbff";
        }
        if (_str <= 3) {
            bgColor_3 = "#c4ddff";
        }
        if (_str <= 4) {
            bgColor_4 = "#deecff";
        }

    }
    if (dir) {
        var list = '<ul class="showRedTips">' +
            '<li style="background-color: ' + bgColor_4 + '"></li>' +
            '<li style="background-color: ' + bgColor_3 + '"></li>' +
            '<li style="background-color: ' + bgColor_2 + '"></li>' +
            '<li style="border-bottom:none;background-color: ' + bgColor_1 + '"></li>' +
            '</ul >';

    } else {
        var list = '<ul class="showRedTips">' +
            '<li style="background-color: ' + bgColor_1 + '"></li>' +
            '<li style="background-color: ' + bgColor_2 + '"></li>' +
            '<li style="background-color: ' + bgColor_3 + '"></li>' +
            '<li style="border-bottom:none;background-color: ' + bgColor_4 + '"></li>' +
            '</ul >';
    }


    return list;

}
// 行业个股排行数据
function phrankS() {
    var def = "C";
    var sed = $x("select2").getElementsByTagName("span")[0].getAttribute("value");
    // var hyid = $x("pylist").getAttribute("value");
    if (sed != null) {
        def = sed;
    }
    // phrank(def, hyid);
    phrankk();
    phrank(def)
    // phrank_sse(def)
}
//新版相关个股
function phrankk() {
    //var url = "http://push2.eastmoney.com/api/qt/slist/get?pi=0&pz=5&po=1&spt=4&fields=f2,f12,f13,f14,f15,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=f3";
    var url = commonApi + "api/qt/slist/get?pi=0&pz=5&po=1&spt=4&fields=f2,f12,f13,f14,f15,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=f3" + '&wbp2u=' + delayparams;
    $.ajax({
        url: url,
        dataType: "jsonp",
        scriptCharset: "utf-8",
        jsonp: "cb",
        success: function (json) {
            // console.log(json)
            if (!json.data) return;
            var count = json.data.total >= 5 ? 5 : json.data.total;
            var item = [];
            var html = '';
            var xggp = [];
            for (var i = 0; i < count; i++) {
                item = json.data.diff[i];
                var color = item.f3 > 0 ? "red" : "green";
                if (item.f3 == 0) {
                    color = ''
                }
                var market = item.f13 == "1" ? "sh" : "sz";
                xggp.push("<li><a href=\"http://quote.eastmoney.com/" + market + item.f12 + ".html\" target=\"_blank\" title=\"" + item.f14 + "\">" + cutstr(item.f14, 8) + "</a>(<span class=" + color + ">" + (item.f2 / 100).toFixed(2) + "</span> <span class=" + color + ">" + (item.f3 / 100).toFixed(2) + '%' + "</span>)</li>");
            }
            $x("xggp").innerHTML = xggp.toString().replace(/,/g, "");

        }
    });
}
//新版相关个股
function phrank(def) {
    var fids = { "C": 'f3', "D": 'f4', "E": 'f6', "F": 'f5', "G": 'f11', "H": 'f10' };
    var sytn = { "C": "涨跌幅", "D": "涨跌", "E": "成交额", "F": "成交量", "G": "涨跌幅", "H": "量比" };
    // console.log(fids[def])
    //var url = "http://push2.eastmoney.com/api/qt/slist/get?pi=0&pz=5&po=1&spt=4&fields=f2,f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=" + fids[def];
    var url = commonApi + "api/qt/slist/get?pi=0&pz=5&po=1&spt=4&fields=f2,f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=" + fids[def] + '&wbp2u=' + delayparams;
    $.ajax({
        url: url,
        dataType: "jsonp",
        scriptCharset: "utf-8",
        jsonp: "cb",
        success: function (json) {
            // console.log(json)
            if (!json.data) return;
            var count = json.data.total >= 5 ? 5 : json.data.total;
            var item = [];
            var html = '';
            $x("pytitnme").innerHTML = sytn[def];
            for (var i = 0; i < count; i++) {
                item = json.data.diff[i];
                var color = item.f3 >= 0 ? "red" : "green";
                var market = item.f13 == "1" ? "sh" : "sz";
                switch (def) {
                    case "C":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f3 / 100).toFixed(2) + '%' + '</td></tr>';
                        break;
                    case "D":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f4 / 100).toFixed(2) + '</td></tr>';
                        break;
                    case "E":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f6 / 100000000).toFixed(2) + '亿' + '</td></tr>';
                        break;
                    case "F":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f5 / 10000).toFixed(2) + '万' + '</td></tr>';
                        break;
                    case "G":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f11 / 100).toFixed(2) + '%' + '</td></tr>';
                        break;
                    case "H":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f10 / 100).toFixed(2) + '</td></tr>';
                        break;
                    default:
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + item.f2 / 100 + '%' + '</td>' +
                            '<td class="' + color + '">' + item.f3 / 100 + '%' + '</td></tr>';
                        break;
                }
            }
            $("#pylist").html(html);

        }
    });
}
//新版相关个股推送
function phrank_sse(def) {
    var fids = { "C": 'f3', "D": 'f4', "E": 'f6', "F": 'f5', "G": 'f11', "H": 'f10' };
    var sytn = { "C": "涨跌幅", "D": "涨跌", "E": "成交额", "F": "成交量", "G": "涨跌幅", "H": "量比" };
    // console.log(fids[def])
    //var url = "http://" + (Math.floor(Math.random() * 99) + 1) + ".push2.eastmoney.com/api/qt/slist/sse?pi=0&pz=5&po=1&spt=4&fields=f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=" + fids[def];
    var url = tsApi + "api/qt/slist/sse?pi=0&pz=5&po=1&spt=4&fields=f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=" + _this._Market_10 + "." + _this._Code + "&fid=" + fids[def];
    var evtSource = new EventSource(url);
    evtSource.onmessage = function (msg) {
        var json = msg.data;
        // console.log(json)
        if (json.data) {
            var item = [];
            var html = '';
            $x("pytitnme").innerHTML = sytn[def];
            for (var i = 0; i < 5; i++) {
                item = json.data.diff[i];
                var color = item.f3 >= 0 ? "red" : "green";
                var market = item.f13 == "1" ? "sh" : "sz";
                switch (def) {
                    case "C":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f3 / 100).toFixed(2) + '%' + '</td></tr>';
                        break;
                    case "D":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f4 / 100).toFixed(2) + '</td></tr>';
                        break;
                    case "E":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f6 / 100000000).toFixed(2) + '亿' + '</td></tr>';
                        break;
                    case "F":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f5 / 10000).toFixed(2) + '万' + '</td></tr>';
                        break;
                    case "G":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td class="' + color + '">' + (item.f11 / 100).toFixed(2) + '%' + '</td></tr>';
                        break;
                    case "H":
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + (item.f2 / 100).toFixed(2) + '</td>' +
                            '<td>' + (item.f10 / 100).toFixed(2) + '</td></tr>';
                        break;
                    default:
                        html += '<tr><td class="nm"><a href="http://quote.eastmoney.com/' + market + item.f12 + '.html" target="_blank" title="' + item.f12 + '">' + cutstr(item.f14, 8) + '</a></td>' +
                            '<td class="' + color + '">' + item.f2 / 100 + '%' + '</td>' +
                            '<td class="' + color + '">' + item.f3 / 100 + '%' + '</td></tr>';
                        break;
                }

            }

            $("#pylist").html(html);
        }

    }

}
//异步加载图片
function imgLoader(setting) {
    if (typeof (setting) !== "object" || !setting["url"]) return false;
    var fCallback = typeof (setting["success"]) === "function" ? setting["success"] : null;
    var _url = setting["url"];
    if (setting["data"]) {
        var _data = $.param(setting["data"]);
        _url = _url.indexOf("?") > 0 ? _url + "&" + _data : _url + "?" + _data;
    }
    if (!setting["cache"]) {
        _url += _url.indexOf("?") > 0 ? "&_=" + (+new Date()) : "?_=" + (+new Date());
    }
    var _image = document.createElement("img");
    if (typeof (setting["height"]) === "number" && setting["height"] > 0) {
        _image.setAttribute("height", setting["height"] + "px");
    }
    if (typeof (setting["width"]) === "number" && setting["width"] > 0) {
        _image.setAttribute("width", setting["width"] + "px");
    }
    _image.setAttribute('src', _url);
    if (typeof (setting["error"]) === "function")
        $(_image).error(function () {
            setting["error"](_image);
        });
    _image.onload = _image.onreadystatechange = function (evt) {
        if (!_image.readyState || /loaded|complete/.test(_image.readyState)) {
            // Handle memory leak in IE
            _image.onload = _image.onreadystatechange = null;
            // Callback if not abort
            if (fCallback) fCallback(_image);
        }
    };
    return _image;
}


//大盘
function GetDP() {
    window.dpzs = 1;
    this.dis = function () {
        if (window.GetTimeZoneInfo == true || window.dpzs == 1) {
            $.getScript(gdomain + "CompatiblePage.aspx?Type=C&jsName=js_dp&ino=0000011,3990012&Reference=xml&rt=" + Math.random(), function () {
                var jnm = eval("js_dp");
                if (jnm.dpif != null && jnm.dpif != "") {
                    var tem_shdp = jnm.dpif[0].split(','); var tem_szdp = jnm.dpif[1].split(',');
                    $("#qqgs1").html("<p><a href=\"http://quote.eastmoney.com/zs000001.html\" target=\"_blank\" class=\"blue\">上证</a>：<span style=\"" + udcolor(tem_shdp[4]) + "\"><b>" + tem_shdp[3] + "</b> " + udt(tem_shdp[4]) + "<b>" + tem_shdp[4] + "</b>  " + udt(tem_shdp[4]) + "<b>" + tem_shdp[5] + "  " + ForDight(tem_shdp[6] / 10000, 2) + "</b></span>亿元&nbsp;(涨:<a href=\"http://quote.eastmoney.com/center/list.html#10_0_0_u?sortType=C&sortRule=-1\" target=\"_blank\" class=\"red\"><b>" + tem_shdp[7] + "</b></a> 平:<b>" + tem_shdp[8] + "</b> 跌:<a href=\"http://quote.eastmoney.com/center/list.html#10_0_0_d?sortType=C&sortRule=1\" target=\"_blank\" class=\"green\"><b>" + tem_shdp[9] + "</b></a>)</p><p><a href=\"http://quote.eastmoney.com/zs399001.html\" target=\"_blank\" class=\"blue\">深证</a>：<span style=\"" + udcolor(tem_szdp[4]) + "\"><b>" + tem_szdp[3] + "</b> " + udt(tem_szdp[4]) + "<b>" + tem_szdp[4] + "</b>  " + udt(tem_szdp[4]) + "<b>" + tem_szdp[5] + "  " + ForDight(tem_szdp[6] / 10000, 2) + "</b></span>亿元&nbsp;(涨:<a href=\"http://quote.eastmoney.com/center/list.html#20_0_0_u?sortType=C&sortRule=-1\" target=\"_blank\" class=\"red\"><b>" + tem_szdp[7] + "</b></a> 平:<b>" + tem_szdp[8] + "</b> 跌:<a href=\"http://quote.eastmoney.com/center/list.html#20_0_0_d?sortType=C&sortRule=1\" target=\"_blank\" class=\"green\"><b>" + tem_szdp[9] + "</b></a>)</p>");
                }
                window.dpzs = 0;
            });
        }
    }
}

function showMore(tp, obj) {
    var over = $x("xh" + tp + obj).style.display = "block";
}
function hideall(tp, obj) {
    var over = $x("xh" + tp + obj).style.display = "none";
}
// function hotpersonafp(uid, oid, marketcode) {
//     var iscks = false;
//     if (GetCookie("pi")) {
//         var gcks = Getcks("pi");
//         if (gcks.split(';').length >= 3) {
//             var name = gcks.split(';')[2];
//             if (/^[\u4E00-\u9FA5][0-9a-zA-Z]{6}$/g.test(name)) { iscks = true; }
//             else {
//                 var url = "http://iguba.eastmoney.com/action.aspx?callback=&action=oaddfollowperson&uid2=" + uid;
//                 $.getScript(url + "&v=" + formatm(), function () {
//                     oid.className = "allow"; oid.innerHTML = ""; oid.onclick = null;
//                 });
//             }
//         }
//         else { iscks = true; }
//     }
//     else { iscks = true; }
//     if (iscks) {
//         location.href = "http://passport2.eastmoney.com/pub/login?backurl=http://quote.eastmoney.com/" + marketcode + ".html";
//     }
// }

function fmtdig(Data, Mat, F, Unit, AutoF) {
    var res = Data;
    if (Data != "" && Data != "--" && Data != "-") {
        var _temp = Math.abs(parseFloat(Data));
        var temp = parseFloat(Data);
        if (AutoF) {
            if (_temp > 1000000000000)//万亿
            {
                Mat = 100000000; Unit = "亿"; F = "0";
            }
            else if (_temp > 100000000000)//千亿
            {
                Mat = 100000000; Unit = "亿"; F = "0";
            }
            else if (_temp > 10000000000)//百亿
            {
                Mat = 100000000; Unit = "亿"; F = "1";
            }
            else if (_temp > 1000000000)//十亿
            {
                Mat = 100000000; Unit = "亿"; F = "2";
            }
            else if (_temp > 100000000)//亿
            {
                Mat = 100000000; Unit = "亿"; F = "2";
            }
            else if (_temp > 10000000)//千万
            {
                Mat = 10000; Unit = "万"; F = "0";
            }
            else if (_temp > 1000000)//百万
            {
                Mat = 10000; Unit = "万"; F = "1";
            }
            else if (_temp > 100000)//十万
            {
                Mat = 10000; Unit = "万"; F = "2";
            }
            else if (_temp > 10000) {
                Mat = 10000; Unit = "万"; F = "2";
            }
            else if (_temp > 1000) {
                Mat = 1; Unit = ""; F = "2";
            }
            else if (_temp > 100) {
                Mat = 1; Unit = ""; F = "2";
            }
            else if (_temp > 10) {
                Mat = 1; Unit = ""; F = "2";
            }
            else {
                Mat = 1; Unit = ""; F = "3";
            }
        }
        res = ForDight((temp / Mat), F);
    }
    return res + Unit;
}

//时间随机数
function formatm() {
    var now = new Date();
    return now.getTime();
}

//保留小数
function toFixed(data, num) {
    if (data === '' || data === undefined || data === null || data === '-' || isNaN(data)) {
        return '-';
    }
    num = isNaN(parseInt(num)) ? 2 : parseInt(num);
    return parseFloat(data).toFixed(num);
}

//随机数
function GetRandomNum(Min, Max) { var Range = Max - Min; var Rand = Math.random(); return (Min + Math.round(Rand * Range)); }

function showimg() {
    //$x("flash_box").style.display = "none";
    $x("image_box").style.display = "block";
    $x("js_box").style.display = "none";
    window.zxgIsFirst = true;
    window.quoteIsFirst = true;
    Def.DisQuote();
    $x("ov3").className = "emhqbov3 mb10";
    $x("flsrmt7").className = "title1 mt6";
    WriteCookie("em_hq_fls", "old", 99999);
    //_this.GetFavorList(_this._Code);
}
//小写数字转换大写
function SectionToChinese(section) {
    // console.log(section/10)
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];
    if (section / 10 < 2 && section / 10 > 1) {
        return ("十" + chnNumChar[section % 10])
    } else if (section / 10 == 1) {
        return ("十")
    } else {
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
            // console.log(section);
        }
        return chnStr;
    }
}

function showjs() {
    //$x("flash_box").style.display = "none";
    $x("image_box").style.display = "none";
    $x("js_box").style.display = "block";
    window.zxgIsFirst = true;
    window.quoteIsFirst = true;
    //Def.DisQuote();
    $x("ov3").className = "emhqbov3 mb10";
    $x("flsrmt7").className = "title1 mt6";
    WriteCookie("em_hq_fls", "js", 99999);
    //_this.GetFavorList(_this._Code);
}

function showfls() {
    //$x("flash_box").style.display = "block";
    $x("image_box").style.display = "none"; window.zxgIsFirst = true; window.quoteIsFirst = true; Def.DisQuote();
    $x("js_box").style.display = "none";
    $x("ov3").className = "emhqbov3 mb9";
    $x("flsrmt7").className = "title1 mt13";
    WriteCookie("em_hq_fls", "new", 99999);
    var picrtr = $x("actTab1").getElementsByTagName("span");
    var picrtk = $x("actTab2").getElementsByTagName("span");
    picrtr[1].click(); // 返回当天分时
    picrtk[0].click();
    //for (var j = 0; j < picrtk.length; j++) {
    //    if (picrtk[j].className == "cur") {
    //        setTimeout(function () { stock.kMT = false; stock.FlashObj.selectButton(j + 1, 10); }, 2000);
    //        break;
    //    }
    //}
    //_this.GetFavorList(_this._Code);
}

//老的投票
function smivckNew(code, znum, dnum) {
    var pi = "";
    var islow = $('input:radio[name="hqvote"]:checked').val();
    if (!islow) { alert("请先选择投票方向！"); return; };
    if (GetCookie("pi")) { pi = GetCookie("pi"); }
    var url = "http://hqstat.eastmoney.com/vote/QuoteGuBaLookUpOrDown.aspx?code=" + code + "&islow=" + islow + "&pi=" + pi + "&cb=var%20res=[{0}]&&num=1&rt=" + formatm();
    Mini.Loader.load(url, "gb2312", function () {
        alert(res[0].me);
        if (res[0].rc == 1) {
            switch (islow) { case "false": znum++; break; case "true": dnum++; break; }
            zdpc = znum + dnum;
            zhang = (znum / zdpc * 100).toFixed(1);
            die = (dnum / zdpc * 100).toFixed(1);
            $x("ivap").innerHTML = zhang + "%";
            $x("ivbp").innerHTML = die + "%";
            $x("ivra").style.width = (zhang / 110 * 100).toFixed(1) + "px";
            $x("ivrb").style.width = (die / 110 * 100).toFixed(1) + "px";
            //$x("kzps").innerHTML = znum;
            //$x("kdps").innerHTML = dnum;
            $x("ivbv").innerHTML = '<span style="color: #A1A1A1;background-color:#E4E4E4;display: inline-block;height: 20px;line-height: 20px;padding: 0 6px;border: 0 none;text-align: center;">已投票</span>';
        } else if (res[0].rc == 0) {
            $x("ivbv").innerHTML = '<span style="color: #A1A1A1;background-color:#E4E4E4;display: inline-block;height: 20px;line-height: 20px;padding: 0 6px;border: 0 none;text-align: center;">已投票</span>';
        }
    });
}


/*
 *
 *@Title: js
 *@params1: code(市场+code)，参数从页面获取
 *@description:获取初始投票数据
 *@return: 
 *@author: qiuhongyang
 *@date: 2020-03-24 08:44:54
 *
*/
function getWYVoteStatus() {
    try {
        var code = window.marketCode;
        $.ajax({
            method: 'GET',
            url: '/newapi/getstockvote',
            data: {
                code: code
            },
            dataType: 'json',
            success: function (json) {
                if (json) {
                    try {
                        var data = json.Data;
                        var kz = data.TapeZ
                        var kd = data.TapeD
                        if(kz == 0 && kd == 0){
                            kz = 0.5
                            kd = 0.5
                        }
                        var TapeZ = (kz * 100).toFixed(2) + "%";
                        var TapeD = (kd * 100).toFixed(2) + "%";
                        $x("ivap").innerHTML = TapeZ;
                        $x("ivbp").innerHTML = TapeD;
                        // $x("ivra").style.width = TapeZ;  
                        // $x("ivrb").style.width = TapeD;
                        var awid = kz * 75 > 2 ? kz * 75 : 2;
                        $x("ivra").style.width = awid + 'px';  //默认最大宽度75px
                        var bwid = kd * 75 > 2 ? kd * 75 : 2;
                        $x("ivrb").style.width = bwid + 'px';
                        if (data.Date) {
                            $x("votetime").innerHTML = data.Date;
                        }
                    } catch (error) {

                    }

                }
            }
        });
    } catch (error) { }
};
getWYVoteStatus()


/*
 *
 *@Title: jsf
 *@params1: MarketCode
 *@description:网友调查接口替换 smivckNew
 *@return: 
 *@author: qiuhongyang
 *@date: 2020-03-24 09:27:51
 *
*/
function smivckVoteNew(MarketCode) {

    var islow = $('input:radio[name="hqvote"]:checked').val();
    if (!islow) { alert("请先选择投票方向！"); return; };

    var direction = islow ? '1' : '-1',
        uid = GetCookie('uidal') || GetCookie('qgqp_b_id'),
        code = MarketCode;
    $.ajax({
        method: 'POST',
        url: '/newapi/votestock',
        data: {
            code: code,
            tapetype: direction,
            uid: uid
        },
        dataType: 'json',
        success: function (json) {
            if (json) {
                try {
                    var data = json.Data;
                    var kz = data.TapeZ
                    var kd = data.TapeD
                    if(kz == 0 && kd == 0){
                        kz = 0.5
                        kd = 0.5
                    }
                    var TapeZ = (kz * 100).toFixed(2) + "%";
                    var TapeD = (kd * 100).toFixed(2) + "%";
                    $x("ivap").innerHTML = TapeZ;
                    $x("ivbp").innerHTML = TapeD;
                    // $x("ivra").style.width = TapeZ;
                    // $x("ivrb").style.width = TapeD;
                    var awid = kz * 75 > 2 ? kz * 75 : 2;
                    $x("ivra").style.width = awid + 'px';  //默认最大宽度75px
                    var bwid = kd * 75 > 2 ? kd * 75 : 2;
                    $x("ivrb").style.width = bwid + 'px';
                    $x("ivbv").innerHTML = '<span style="color: #A1A1A1;background-color:#E4E4E4;display: inline-block;height: 20px;line-height: 20px;padding: 0 6px;border: 0 none;text-align: center;">已投票</span>';
                    if (data.Date) {
                        $x("votetime").innerHTML = data.Date;
                    }
                    var msg = json.Message ? json.Message : json.Status == 1 ? '投票成功' : '投票失败'
                    alert(msg);
                } catch (error) {

                }

            }
        }
    });
};



function smivck(code, islow, znum, dnum, el) {
    var pi = "";
    if (GetCookie("pi")) { pi = GetCookie("pi"); }
    var url = "http://hqstat.eastmoney.com/vote/QuoteGuBaLookUpOrDown.aspx?code=" + code + "&islow=" + islow + "&pi=" + pi + "&cb=var%20res=[{0}]&&num=1&rt=" + formatm();
    Mini.Loader.load(url, "gb2312", function () {
        alert(res[0].me);
        if (res[0].rc == 1) {
            switch (islow) { case "false": znum++; break; case "true": dnum++; break; }
            zdpc = znum + dnum;
            zhang = (znum / zdpc * 100).toFixed(1);
            die = (dnum / zdpc * 100).toFixed(1);
            $x("ivap").innerHTML = zhang + "%";
            $x("ivbp").innerHTML = die + "%";
            $x("ivra").style.width = (zhang / 110 * 100).toFixed(1) + "px";
            $x("ivrb").style.width = (die / 110 * 100).toFixed(1) + "px";
        }
    });
}

function getdomain(min, max) {
    var min = 1; var max = 10;
    var res = "nufm3.dfcfw.com"; var m2 = "nufm2.dfcfw.com";
    var rom = GetRandomNum(min, max);
    if (rom != "1" && rom != "2" && rom != "3") { res = m2; }//80% ->nufm2
    //if (rom == "1") { res = m2; }//10% ->nufm2
    return "nufm.dfcfw.com";//res;
}






//获取新版研报接口
function getNewReportUrl(url, sucess, fail) {
    $.ajax({
        url: url,
        dataType: "jsonp",
        scriptCharset: "utf-8",
        jsonp: "cb",
        jsonpCallback: 'callback' + Math.floor(Math.random() * 10000000 + 1)
    }).done(function (json) {
        try {
            if (json && json.data && json.data.length) {
                sucess && sucess(json.data)
            } else {
                fail && fail()
            }
        } catch (error) {
            console && console.log(error)
            fail && fail()
        }
    }).fail(function (error) {
        console && console.log(error)
        fail && fail()
    })
};


