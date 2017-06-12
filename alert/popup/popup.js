define(['widget','jquery','jqueryUI'],function(Widget, $, $UI){


    function Popup(){
        this.config = {
            content:'dafault',
            width: 400,
            height: 200,
            alertCallback:function(){
                alert('default alert callback')
            },
            closeCallback:function(){
                alert('default close callback');
            },
            confirmCallback:function(){
                alert('default confirm callback');
            },
            cancelCallback: function(){
                alert('default cancel callback');
            },
            hasCloseButton: false,
            skinClassName: null,
            alertBtnText: '确定',
            confirmBtnText:'是',
            cancelBtnText:'否',
            hasMask:true,
            isDraggalbe: false,
            dragHandler: null
        };
        // 注意：大坑！！！这里必须重新声明属性，覆盖原型上的对应的属性，因为原型上的对象是全局的，如果不刷新页面的话！！！
        // this.handlers = {};
    }

    Popup.prototype = $.extend({}, new Widget(), {
        initAlert: function(options){
            $.extend(this.config,options,{popupType:'alert'});
            this.render();
        },
        initConfirm: function(options){
            var dd = $.extend(this.config,options,{popupType:'confirm'});
            console.log(dd);
            this.render();
        },
        initPrompt: function(options){
            $.extend(this.config,options,{popupType:'prompt'});
            this.render();
        },
        renderUI: function(){
            var that = this;
            var options = this.config;

            var btnHtml ;
            switch (options.popupType){
                case 'alert':
                    btnHtml = '<button class="popup-alertBtn">' + options.alertBtnText + '</button>';
                    break;
                case 'confirm':
                    btnHtml = '<button class="popup-confirmBtn">' + options.confirmBtnText + '</button>' +
                        '<button class="popup-cancelBtn">' + options.cancelBtnText + '</button>';
                    break;
            }

            that.popupBox = $('<div class="popup-box">' +
                '<div class="popup-header">' + options.title + '</div>' +
                '<div class="popup-body">' + options.content + '</div> ' +
                '<div class="popup-footer">'+ btnHtml + '</div>' +
                '</div>');

            if(options.hasMask){
                that.mask = $('<div class="popup-mask"></div>');
                that.mask.appendTo('body');
            }

            if(that.config.hasCloseButton) {
                that.closeBtn = $('<span class="popup-closeBtn">X</span>');
                that.closeBtn.appendTo(that.popupBox);
            }
        },
        bindUI: function(){
            var that = this;
            var options = this.config;

            // 创建确认按钮
            that.popupBox.on('click','.popup-alertBtn',function(e){
                that.fire('alert'); // 触发自定义确认回调事件
                that.destory();
            });
            that.popupBox.on('click','.popup-confirmBtn',function(e){
                that.fire('confirm'); // 触发自定义确认回调事件
                that.destory();
            });
            that.popupBox.on('click','.popup-cancelBtn',function(e){
                that.fire('cancel'); // 触发自定义确认回调事件
                that.destory();
            });

            // 自定义关闭按钮
            if(that.closeBtn){
                that.popupBox.on('click','.popup-closeBtn',function(e){
                    that.fire('close'); // 触发自定义确认回调事件
                    that.destory();
                });
            }

            if(options.alertCallback){
                that.on('alert',options.alertCallback);
            }
            if(options.confirmCallback){
                that.on('confirm',options.confirmCallback);
            }
            if(options.cancelCallback){
                that.on('cancel',options.cancelCallback);
            }
            if(options.closeCallback){
                that.on('close',options.closeCallback);
            }
        },
        syncUI: function(){
            var that = this;
            var options = this.config;

            // 自定义弹框的尺寸和位置
            that.popupBox.css({
                width: options.width,
                height: options.height,
                left: options.x || (window.innerWidth - options.width)/2,
                top: options.y || (window.innerHeight - options.height)/2
            });

            // 自定义皮肤
            if(options.skinClassName){
                that.popupBox.addClass(options.skinClassName);
            }

            // 自定义拖拽
            if(options.isDraggalbe){
                if(options.dragHandler){
                    console.log(123);
                    that.popupBox.draggable({
                        handle:options.dragHandler
                    });
                }else{
                    that.popupBox.draggable();
                }
            }
        }
    });

    return Popup;
})
