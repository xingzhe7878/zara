/**
 * Created by xingzhe on 18/1/15.
 */
;(function( global, factory) {
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "Zara requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        global.zara = global.Zara = factory( global );
    }

})(typeof window !== "undefined" ? window : this, function(window) {

    function Zara() {};

    Zara.fn = Zara.prototype = {
        constructor: Zara
    };

    /**
     * 时间格式化
     * @param time
     * @param fmt
     */
    function format(time, fmt) {
        var now = _tojsdate(time);

        var k, o;

        var fill = function (val) {
            return (val < 10 ? '0' : '') + val;
        }

        o = {
            'Y+': now.getFullYear(),
            'M+': fill(now.getMonth()+1),
            'D+': fill(now.getDate()),
            'h+': fill(now.getHours()),
            'm+': fill(now.getMinutes()),
            's+': fill(now.getSeconds())
        };

        if(!fmt || fmt === null) {
            fmt = "YYYY-MM-DD hh:mm:ss";
        }

        for(k in o) {
            if(new RegExp("("+ k +")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (o[k]) + '');
            }
        }

        return fmt;

    }

    /**
     * 转化成为js 的时间
     * @param time
     */
    function _tojsdate(time) {
        var _date_reg_year_month = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])$/;
        //不为时间返回当前时间
        if(!_isDate(time)) {
            return new Date();
        }
        //兼容IE即移动端YYYY-MM-DD不兼容问题
        if(typeof time === "string") {
            //如果为时间戳字符串
            if(/^\d{11,}$/.test(time)) {
                return new Date(+time);
            }
            time = time.replace(/-/g, '\/');
            //当传入时间为2018/10时,补全
            if(_date_reg_year_month.test(time)) {
                time += '/01';
            }
        }
        return new Date(time);
    };

    /**
     * 是否为Date
     * @param time
     * @private
     */
    function _isDate(time) {
        var _time;
        var _date_reg_all = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9])$/,
            _date_reg_year_month = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])$/,
            _date_reg_year_month_date = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1])$/,
            _date_reg_year_month_date_hour = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3])$/,
            _date_reg_year_month_date_hour_minute = /^[12][0-9]{3}(-|\/)(0?[0-9]|1[0-2])(-|\/)(0?[1-9]|[1-2][0-9]|3[0-1]).(0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9])$/;
        if(!time || time === null) {
            return false;
        }
        if(typeof time === 'string') {
            if(/^\d{11,}$/.test(time)) {
                _time = new Date(+time);
                return _time != 'Invalid Date'
            }
            return _date_reg_all.test(time) ||
                _date_reg_year_month.test(time) ||
                _date_reg_year_month_date.test(time) ||
                _date_reg_year_month_date_hour.test(time) ||
                _date_reg_year_month_date_hour_minute.test(time);
        }
        _time = new Date(time);
        return _time != 'Invalid Date';
    };

    /**
     * 深度复制
     * @param data
     */
    function deepClone(data) {
        var _data;
        switch (typeof data) {
            case 'string':
                _data = date +'';
                break;
            case 'number':
                _data = + data;
                break;
            case 'boolean':
                _data = !!data;
                break;
            default:
            case 'object':
                _data = _clone(data);
                break;
        }
        return _data;
    }
    
    function _clone(data) {
        var isArray = data instanceof Array;
        var o, i, it, itType;
        if(isArray) {
            o = [];
            for(i=0; i<data.length; i++) {
                it = data[i];
                itType = typeof it;
                o.push(itType === 'object' ? _clone(it) : it)
            }
        } else if(data === null) {
            o = null;
        } else {
            o = {};
            for(i in data) {
                it = data[i];
                itType = typeof it;
                o[i] = itType === 'object' ? _clone(it) : it;
            }
        }
        return o;
    }

    /**
     * 数组去重
     * @param arr
     */
    function arrayUnique(arr) {
        var res = [], obj = {}, i;
        for(i=0; i<arr.length; i++){
            if(!obj[arr[i]]) {
                res.push(arr[i]);
                obj[arr[i]] = 1;
            }
        }
        return res;
    }

    /**
     * 阻止冒泡
     * @param e
     */
    function stopPropagation(e) {
        e = e || window.event;
        //W3C阻止冒泡方法
        if(e.stopPropagation) {
            e.stopPropagation();
        } else {
            //IE阻止冒泡
            e.cancelBubble = true;
        }
    }

    /**
     * 阻止默认行为
     * @param e
     */
    function preventDefault(e) {
        e = e || window.event;
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            // ie 阻止默认行为
            e.returnValue = false;
        }
    }

    /**
     * 字符串截取
     * @param str
     * @param length
     * @param endStr
     * @returns {*}
     */
    function subString(str, length, endStr) {
        var o;
        try {
           o = str.substring(0, length) + (endStr || "");
        } catch(err) {
            throw new Error('subString参数类型错误!');
        }
        return o;
    }

    /**
     * 替换字符串指定内容
     * @param str
     * @param s1
     * @param s2
     */
    function replaceAll(str, s1, s2) {
        return str.replace(new RegExp(s1, "gm"), s2);
    }

    /**
     * 获取地址栏参数
     * @param paraName
     */
    function getUrlPara(paraName){
        var sUrl = location.href;
        var sReg = "(?:\\?|&){1}"+paraName+"=([^&]*)";
        var re=new RegExp(sReg,"gi");
        re.exec(sUrl);
        return RegExp.$1==="click" ? "" : RegExp.$1;
    }

    /**
     * 平台及设备判断
     * @returns {*}
     */
    function isPCByPlat() {
        var platForm = navigator.platform.toLowerCase();
        var isWin = (platForm=="win32")||(platForm=="win64")||(platForm=="windows")||(platForm.indexOf("win") > -1);
        if(isWin)
            return "windows";
        var isMac = (platForm=="mac68k")||(platForm=="macppc")||(platForm=="macintosh")||(platForm=="macintel");
        if(isMac)
            return "mac";
        return false;
    }

    /**
     * 动态插入JS
     * @param src
     * @param callback
     */
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
        //IE
        if(script.readyState) {
            script.onreadystatechange = function() {
                if(script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback && callback();
                }
            };
        } else {
            script.onload = function() {
                callback && callback();
            };
        }
    }

    /**
     * 返回顶部
     * @param btnId
     */
    function backTop(btnId) {
        var btn = document.getElementById(btnId);
        var d = document.documentElement;
        var b = document.body;
        btn.style.display = "none";
        window.onscroll = set;
        btn.onclick = function() {
            btn.style.display = "none";
            window.onscroll = null;
            this.timer = setInterval(function() {
                d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                if ((d.scrollTop + b.scrollTop) == 0) {
                    clearInterval(btn.timer, window.onscroll = set)
                };
            }, 10);
        };

        function set() {
            btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block': "none"
        }


    }

    


    Zara.fn.format              = format;
    Zara.fn.deepClone           = deepClone;
    Zara.fn.arrayUnique         = arrayUnique;
    Zara.fn.stopPropagation     = stopPropagation;
    Zara.fn.preventDefault      = preventDefault;
    Zara.fn.subString           = subString;
    Zara.fn.replaceAll          = replaceAll;
    Zara.fn.getUrlPara          = getUrlPara;
    Zara.fn.isPCByPlat          = isPCByPlat;
    Zara.fn.loadScript          = loadScript;
    Zara.fn.backTop             = backTop;


    return new Zara();
});