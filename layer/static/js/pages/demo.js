/** baseUrl：来源
 * 1、data-main的路径值，如果没有往下
 * 2、config配置中baseUrl，如果没有往下
 * 3、使用当前页面的路径
 */

/** 以下三种情况，会被认为是绝对路径，忽略baseUrl配置
 * 1、url有.js后缀
 * 2、以/开头
 * 3、以http(s)开头
 */

require.config({
    baseUrl: '/js',
    paths: {
        'event': 'module/event',
        'inherit': 'module/inherit',
        'widget': 'component/widget',
        'layer': 'component/layer',
        'template': 'lib/artTemplate'
    }
});

require(['layer'], function (Layer) {
    var layer = null;
    $('#btn').click(function (e) {
        if (layer) {
            layer.show();
        } else {
            layer = new Layer({
                template: '#j-tpl-layer_2',
                data: {
                    title: '这是弹窗',
                    content: '你好，这是弹窗!!!',
                },
                events: {
                    '.j-btn-close click': function (e) {
                        layer.hide();
                    },
                    '.j-btn-yes click': function (e) {
                        layer.hide();
                        // 执行业务逻辑
                        console.log('yes: code here');
                    },
                    '.j-btn-no click': function (e) {
                        layer.hide();
                        console.log('no: code here');
                    },
                }
            }).show();

            layer.on('afterHide', function(val) {
                console.log(val);
            });
        }
    });
})
