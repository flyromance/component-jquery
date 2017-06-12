var eventUtil = {
    getEvent: function (e) {
        return e ? e : window.event;
    },
    getTarget: function (e) {
        e = this.getEvent(e);
        return e.target ? e.target : e.srcElement;
    },
    preventDefault: function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    },
    stopPropagation: function (e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    },
    addEvent: function (elem, type, handler, isCapture) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, isCapture === true ? true : false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        } else {
            elem['on' + type] = handler;
        }
    },
    removeEvent: function (elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handler);
        } else {
            elem['on' + type] = null;
        }
    }
}

Array.prototype.reducer = function(handler, initVal) {
    var arr = this;
    var lens = arr.length, 
        i, item, ret;

    if (typeof initVal === 'undefined') {
        i = 1; 
        ret = arr[0];
    } else {
        i = 0;
        ret = initVal;
    }

    for (; i < lens; i++) {
        ret = handler.call(arr, ret, arr[i]);
        if (ret === false) {
            break;
        }
    }

    return ret;
}

const flatten = arr => arr.reduce((pre, val) => pre.concat(Array.isArray(val) ? flatten(val) : val), []);

const ff = function (arr) {
    return arr.reduce(function(pre, val) {
        return pre.concat(Array.isArray(val) ? ff(val) : val);
    }, []);
}