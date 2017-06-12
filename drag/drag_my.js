// elem position: static left: auto 其他的css属性float: none 
// elem position: relative left: 0px






;(function() {

    // 获取浏览器正真支持的css名
    function getCssName(name) {
        var style = document.createElement('div').style;
        var prefixs = ['webkit', 'ms', 'O', 'Moz'];
        if (name in style) {
            return name;
        }
        var _name;
        for (var i = 0, lens = prefixs.length; i < lens; i++) {
            _name = prefixs[i] + name.charAt(0).toUpperCase() + name.slice(1);
            if (_name in style) {
                return _name;
            }
        }
        return '';
    }

    var transformName = getCssName('transform');

    // 获取样式
    function getStyle(elem, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(elem, false)[prop];
        } else {
            return elem.currentStyle[prop];
        }
    }

    // 禁止选中文本
    function disableSelect() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else {
            document.selection.empty();
        }
    }

    // 函数节流: 在min内无法执行，max内必须执行一次
    function threshold(fn, min, max) {
        var startTime = 0;
        var timer = null;
        return function() {
            var args = arguments;
            var nowTime = +new Date();
            if (!startTime) {
                startTime = nowTime;
            }

            if (startTime - nowTime >= max) {
                fn.apply();
                startTime = 0;
                return;
            }

            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(null, args);
            }, min);
        }
    }

    function Drag(elem, conf) {
        if (!(this instanceof Drag)) {
            return new Drag(elem, conf);
        } 
        this.elem = typeof elem == 'string' ? document.getElementById(elem) : elem;
        this.init(conf || {});
    }

    Drag.prototype = {
        constructor: Drag,
        init: function (conf) {
            var that = this;
            this.pos = {
                elem: {
                    x: 0,
                    y: 0
                },
                mouse: {
                    x: 0,
                    y: 0
                },
                diff: {
                    x: 0,
                    y: 0
                },
                
            };
            that.setDrag();
        },
        setDrag: function() {
            var that = this;

            // 绑定mousedown事件
            eventUtil.addEvent(this.elem, 'mousedown', start);

            function start(e) {

                // 获取鼠标的位置
                that.pos.mouse.x = e.pageX;
                that.pos.mouse.y = e.pageY;

                // elem初始位置
                var pos = that.getPos();
                that.pos.elem.x = pos.x; 
                that.pos.elem.y = pos.y; 

                // 绑定事件
                eventUtil.addEvent(document, 'mousemove', move);
                eventUtil.addEvent(document, 'mouseup', up);
            }

            function move(e) {
                disableSelect(); // 禁止选中文本

                var offsetX = e.pageX - that.pos.mouse.x,
                    offsetY = e.pageY - that.pos.mouse.y;

                that.setPos({
                    x: that.pos.elem.x + offsetX,
                    y: that.pos.elem.y + offsetY
                });
            }

            function up() {

                // 解绑
                eventUtil.removeEvent(document, 'mousemove', move);
                eventUtil.removeEvent(document, 'mouseup', up);

                // 其他的task
            }
        },
        getPos: function() {
            var that = this;
            var prop = '', left, top;

            // 获取elem的初始位置
            if (transformName) {
                prop = getStyle(that.elem, transformName);
                if (prop === 'none') {
                    left = 0;
                    top = 0;
                } else {

                    // getComputedStyle(elem)[transform] 获取到的是 'matrix(1, 0, 0, 1, xxx, xxx)' 啃爹啊
                    var match = prop.match(/\d+/g); 
                    left = +match[4];
                    top = +match[5];
                }
            } else {
                if (getStyle(that.elem, 'position') == 'static') {
                    that.elem.style.position = 'relative';
                }
                left = getStyle(that.elem, 'left');
                top = getStyle(that.elem, 'top');
                left = left ? parseInt(left) : 0;
                top = top ? parseInt(top) : 0;
            }

            return {
                x: left,
                y: top
            }
        },
        setPos: function(opt) {
            var that = this;

            if (transformName) {
                that.elem.style[transformName] = 'translate(' + opt.x + 'px, ' + opt.y +'px)'
            } else {
                that.elem.style['left'] = opt.x + 'px';
                that.elem.style['top'] = opt.y + 'px';
            }
        },
    }

    window.Drag = Drag;
})();