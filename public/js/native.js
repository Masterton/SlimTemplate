/**
 * 原生js封装的一些通用、常用方法、函数
 */
var events = {
    bind: function(element, event, handler) {
        if (window.addEventListener) {
            element.addEventListener(event, handler, false);
        }
        else {
            element.attachEvent('on' + event, handler);
        }
    },
    unbind: function(element, event, handler) {
        if(window.removeEventListener) {
            element.removeEventListener(event, handler, false);
        }
        else {
            element.detachEvent('on' + event, handler);
        }
    },
    trigger: function(element, event) {
        if(window.dispatchEvent) {
            element.dispatchEvent(event);
        }
        else if(window.fireEvent) {
            element.fireEvent('on' + event);
        }
    }
};

function json2parameters(data) {
    var tmp='';
    for(var item in data) {
        var _val;
        if(!data[item]) {
            _val = '';
        }
        else {
            _val= data[item].toString();
        }
        tmp=[tmp,item,'=',_val,'&'].join('');
    }
    if(tmp.length>0) {
        tmp=tmp.substr(0,tmp.length-1);
    }
    return tmp;
}

function _ajax(type, url, data, callBack) {
    var xhr = undefined;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } 
    else {
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } 
        catch (e) {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callBack(xhr.responseText);
            } 
            else {
                if (xhr.status == 404) {
                    console.log('404');
                }
                console.log(xhr.statusText);
            }
        }
    };
    /*防止浏览器强加www子域，导致请求跨域*/
    if (location.href.indexOf('www', 0) != - 1 && url.indexOf('www', 0) == - 1) {
        url = url.replace('://', '://www.');
    }
    var tmp = json2parameters(data);
    if (type.toLowerCase() == 'post') {
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(tmp);
    } 
    else {
        if (tmp != null) {
            if (url.indexOf('?', 0) != - 1) {
                url = url + '&' + tmp;
            } 
            else {
                url = url + '?' + tmp;
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
    }
}

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
}
function htmlUnescape(str){
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#x2F;/g, '\/');
}

function inArray(item,arr) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i] == item) {
            return true;
        }
    }
    return false;
}

function getSort() {
    /**
     * from: http://stackoverflow.com/questions/11379361/how-to-sort-an-array-of-objects-with-multiple-field-values-in-javascript
     * Base function returning -1,1,0 for custom sorting
     * example:
     * [
     *     {type: 25, name: 'abc'},
     *     {type: 25, name: 'aca'},
     *     {type: 06, name: 'abc'}
     * ].sort(getSort('type asc', 'name asc'));
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