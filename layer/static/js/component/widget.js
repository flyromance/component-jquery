define(['inherit', 'event'], function (inherit, createEvent) {

    function Widget() {

    }

    Widget.prototype = {
        constructor: Widget,
        initialize: function () {
            createEvent(this); // 创建自定义事件
            this.setConf.apply(this, arguments);
            this.render();
        },
        // 需要覆盖
        setConf: function(conf) {

        },
        render: function () {
            this.renderUI();

            // 解析绑定事件
            this.bindUI();

            this.trigger('beforeMount');
            this.mountUI();
            this.trigger('afterMount');
        },
        renderUI: function () {
            
        },
        bindUI: function () {

        },
        mountUI: function () {

        },
        unMountUI: function () {
            
        },
        destory: function () {
            this.trigger('beforeUnMount');
            this.unMountUI();
            this.trigger('afterUnMount');
        }
    }

    return Widget;
});