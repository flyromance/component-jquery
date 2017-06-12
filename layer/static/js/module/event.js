define(function () {

    // 命名空间解析
    function pareseName(name) {
        var firstDotPos = name.indexOf('.');
        var ret = [];
        if (firstDotPos < 0) {
            ret.push(name);
        } else {
            ret.push(name.slice(0, firstDotPos));
            ret.push(name.slice(firstDotPos));
        }
        return ret;
    }

    function createEvent(context) {
        var _events = {};

        $.extend(context, {
            on: function (name, handler) {
                if (typeof name !== 'string' || !name) return;
                var nameArr = pareseName(name);
                _events[nameArr[0]] = _events[nameArr[0]] || [];
                _events[nameArr[0]].push({
                    nameSpace: nameArr[1] || '.',
                    handler: handler
                });

                return this;
            },
            trigger: function (name, param) {
                var args = [].slice.call(arguments).slice(1);
                if (!name) {
                    this.triggerAll.apply(this, args);
                    return;
                }
                var nameArr = pareseName(name);
                var handlerArr = _events[nameArr[0]] || [];

                for (var i = 0; i < handlerArr.length; i++) {
                    if (handlerArr[i].nameSpace.indexOf(nameArr[1] || '.') > -1) {
                        handlerArr[i].handler.apply(null, args);
                    }
                }

                return this;
            },
            triggerAll: function (param) {
                var args = [].slice.call(arguments);
                for (var key in _events) {
                    var subList = _events[key];
                    for (var i = 0; i < subList.length; i++) {
                        subList[i].handler.apply(null, args);
                    }
                }

                return this;
            },
            off: function (name, handler) {
                if (!name) {
                    _events = {};
                    return;
                }

                var nameArr = pareseName(name);
                var subList = _events[nameArr[0]];
                var index;

                for (var i = 0; i < subList.length; i++) {

                    // 删除的索引就是i
                    if (subList[i].nameSpace.indexOf(nameArr[1] || '.') > -1) {
                        // 没有handler or handler存在，并且相等的情况下
                        if (!handler || (typeof handler === 'function' && handler === subList[i].handler)) {
                            // 注意
                            // 改变数组的长度！！！
                            subList.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        });
    }

    return createEvent;
});
