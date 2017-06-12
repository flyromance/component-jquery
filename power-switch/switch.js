/**
 * Created by Administrator on 2015/12/19.
 */
;(function(window, $, undefined){
    var isAnimation = typeof window.history.pushState() == 'function';

    $.powerSwitch = function(selector, options){
        $(selector).powerSwitch(options);
    };

    $.extend($.powerSwitch, {
        getRelative:function(trigger, params){

        },
        transition:function(){

        },
        translate:function(){

        },
        animation:function(){

        }
    });

    $.fn.powerSwitch = function(options){
        var defaults = {
            derection:'horizontal',
            eventType:'click',
            classAdd:'',
            classRemove:'',
            classPrefix:'',
            attribute:'data-rel',
            animation:'auto',
            duration:250,
            hoverDelay:200,
            container:'none',
            autoTime:'auto',
            num:'',
            toggle:'false',
            onSwitch: $.noop
        };
        var params = $.extend({},defaults,options || {});

        var self = $(this);
        if(self.length == 0){
            if(params.autoTime == 0 || params.container == null) return self;
        }

        var eleRelatives = $.powerSwitch.getRelative(self, params);
        if(eleRelatives.length == 0) return;

        $.each(['disabled','pre','next','pause','play'],function(index, item){

        });

        // confirm the current selected item;
        var indexSeleted = params.indexSelected || -1;
        self.each(function(index, item){
            var temp = $(this);
        });

        //


    }
})(window, jQuery);