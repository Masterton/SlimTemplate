define(['jquery'], function($) {
    'use strict';
    /**
     * 可支持传入多个排序规则
     * @example
     *     sort('id asc', 'index asc');
     *     还可以传入更多参数
     */
    function sort() {
        /**
         * from: http://stackoverflow.com/questions/11379361/how-to-sort-an-array-of-objects-with-multiple-field-values-in-javascript
         * Base function returning -1,1,0 for custom sorting
         */
        var props = [];
        /*Let's separate property name from ascendant or descendant keyword*/
        for (var i = 0; i < arguments.length; i++) {
            var splittedArg = arguments[i].split(/ +/);
            props[props.length] = [splittedArg[0], (splittedArg[1] ? splittedArg[1].toUpperCase() : "ASC")];
        }

        function dynamicSort(property, isAscDesc) {
            return function(obj1, obj2) {
                if (isAscDesc === "DESC") {
                    return ((obj1[property] > obj2[property]) ? (-1) : ((obj1[property] < obj2[property]) ? (1) : (0)));
                }
                /*else, if isAscDesc==="ASC"*/
                return ((obj1[property] > obj2[property]) ? (1) : ((obj1[property] < obj2[property]) ? (-1) : (0)));
            }
        }
        return function(obj1, obj2) {
            var i = 0,
                result = 0,
                numberOfProperties = props.length;
            /*Cycle on values until find a difference!*/
            while (result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i][0], props[i][1])(obj1, obj2);
                i++;
            }
            return result;
        };
    }

    /**
     * 将多个路径合并成为一个合法路径
     */
    function mergeUrl() {
        if (!arguments.length) {
            console.error(new Error('必须填写要合并的两个参数'));
            return false;
        }
        var path = arguments[0].toString().indexOf('/') === 0 ? '/' : '';
        for (var i = 0, length = arguments.length; i < length; i++) {
            path += arguments[i].toString().replace(/^\/+/, '').replace(/\/+$/, '');
            if (i < length - 1) {
                path += '/';
            }
        }
        var last = arguments[length - 1].toString();
        if (last.charAt(last.toString().length - 1) === '/') {
            path += '/';
        }
        return path.replace(/\/\//g, '/').replace(/\/\//g, '/');
    }

    /**
     * 时间戳转字符串时间(YYYY-MM-dd HH:mm:ss)
     * @param timestamp 时间戳(单位秒)
     */
    function ts2str(timestamp) {
        var padLeftZero = function(num) {
            return [(num <= 9) ? '0' : '', num].join('');
        };
        timestamp = Number(timestamp) * 1000;
        var dt = new Date(timestamp);
        return [
            dt.getFullYear(),
            padLeftZero(dt.getMonth() + 1),
            padLeftZero(dt.getDate())
        ].join('-') + '&nbsp;' +
        [
            padLeftZero(dt.getHours()),
            padLeftZero(dt.getMinutes()),
            padLeftZero(dt.getSeconds())
        ].join(':');
    }

    /**
     * 格式化文件大小
     * @param _size 化文件大小(单位: 字节)
     */
    function formatFileSize(_size) {
        _size = Number(_size);
        var _type= 'Byte'
        if(_size < 1024) {
            _type = '字节';
        }
        else if(_size < 1024 * 1024) {
            _size = (_size / 1024);
            _type = 'KB';
        }
        else if(_size < 1024 * 1024 * 1024) {
            _size = (_size / 1024 / 1024);
            _type = 'MB';
        }
        else if(_size < 1024 * 1024 * 1024 * 1024) {
            _size = (_size / 1024 / 1024 / 1024);
            _type = 'GB';
        }
        _size = _size.toFixed(3).toString().replace(/[\.]?0+$/, '')
        return _size + _type;
    }

    /**
     * 获取最近的符合条件的父级元素
     */
    function latestParent($obj, selector) {
        var $p = $obj.parent();
        while(!$p.is(selector)) {
            $p = $p.parent();
            if($p.length < 1 || $p.is('body,html') || $p.parents().length < 1) {
                return {
                    length: 0
                };
            }
        }
        return $p;
    }

    /**
     * email正则规则
     */
    function emailRegex() {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    }

    /**
     * 判断子符串是否符合密码规则
     */
    function isPassword(str_pwd, conditions) {
        var _default = {
            min: 6,
            max: 18,
            number: true,
            big: false,
            small: true,
            special: false
        };
        if(!conditions) {
            conditions = {};
        }
        conditions = $.extend(true, _default, conditions);
        var min_len = conditions.min,
            max_len = conditions.max;
        var has_number = false,
            has_big = false,
            has_small = false,
            has_special = false;
        var len = str_pwd.length;
        // 长度 限制
        if(len >= min_len && len <= max_len) {
            for(var i=0; i < len; i++) { 
                var ascii = str_pwd[i].charCodeAt();
                if(ascii < 32 || ascii > 126) {
                    return false;
                }
                else {
                    // 数字
                    if(ascii >= 48 && ascii <= 57) {
                        if(!has_number) {
                            has_number = true;
                        }
                    }
                    else if(ascii >= 65 && ascii <= 90) {
                        // 大写字母
                        if(!has_big) {
                            has_big = true;
                        }
                    }
                    else if(ascii >= 97 && ascii <= 122) {
                        // 小写字母
                        if(!has_small) {
                            has_small = true;
                        }
                    }
                    else {
                        // 特殊字符
                        if(!has_special) {
                            has_special = true;
                        }
                    }
                }
            }
            var is_ok = true;
            if(conditions.number) {
                is_ok = is_ok && has_number;
            }
            if(is_ok && conditions.big) {
                is_ok = is_ok && has_big;
            }
            if(is_ok && conditions.small) {
                is_ok = is_ok && has_small;
            }
            if(is_ok && conditions.special) {
                is_ok = is_ok && has_special;
            }
            return is_ok;
        }
        return false;
    }

    function windowOrigin(win) {
        if(!win) {
            win = window;
        }
        var loca = win.location;
        if(loca.origin) {
            return loca.origin;
        }
        return loca.protocol + '//' + loca.host;
    }

    /**
     * 获取地址栏参数值
     * @param param_key 地址栏参数键名
     */
    function getUrlParam(param_key) {
        var arr = window.location.search.replace(/^[\?]/, '').split('&');
        for (var i = 0; i < arr.length; i++) {
            var value = arr[i].replace(/^[^\=]+[\=]/, '');
            if (arr[i].replace(value, '') == param_key + '=') {
                return value;
            }
        }
        return null;
    }

    return {
        sort: sort,
        mergeUrl: mergeUrl,
        ts2str: ts2str,
        formatFileSize: formatFileSize,
        latestParent: latestParent,
        regex: {
            emailRegex: emailRegex(),
            isEmail: function(str) {
                return emailRegex().test(str);
            }
        },
        isPassword: isPassword,
        origin: windowOrigin,
        getUrlParam: getUrlParam
    };
});
