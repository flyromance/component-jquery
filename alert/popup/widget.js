// 注意：依赖项外面不要忘了加中括号[]！！！
define(['jquery'], function($) {
    function Widget() {
        this.popupBox = null;
    }
    Widget.prototype = {
        on: function(type, fn) {
            if (typeof this.handlers[type] == 'undefined') {
                this.handlers[type] = [];
            }
            //this.handlers[type] = this.handlers[type] || [];
            this.handlers[type].push(fn);
        },
        fire: function(type, data) {
            var handlers = this.handlers[type];
            var lens, i;
            if (handlers instanceof Array && (lens = handlers.length)) {
                for (i = 0; i < lens; i++) {
                    handlers[i](data);
                }
            }
        },
        renderUI: function() {}, // 创建dom节点
        bindUI: function() {}, // 给dom节点绑定事件
        syncUI: function() {}, // 初始化组件特性
        render: function(container) { // 渲染组件
            this.renderUI();
            this.handlers = {};
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.popupBox);
        },

        // 删除模态dom节点
        destructor: function() {
            this.mask && this.mask.remove();
        },

        // 销毁前的处理函数
        destory: function() { // 销毁组件
            this.destructor();
            this.popupBox.off(); // 删除绑定的事件
            this.popupBox.remove(); // 删除弹窗dom节点
        }
    }

    return Widget;
})
