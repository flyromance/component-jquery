/**
 * 门户首页
 *
 * */





// 底部信息流
(function() {

    // 频道导航滚动fix
    $('.j-fix-top').scrollToFixed({
        marginTop: $('.j-navbar').height(),
        zIndex: 290
    });

    // 预先加载信息流广告
    window.BTIME_ADVERT && window.BTIME_ADVERT.init({
        urlParam: {
            reqtimes: 1
        }
    });

    // 防抖：200ms内最多执行一次
    function debounce(fn) {
        var timer = null;
        return function() {
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(this, args);
            }, 200);
        }
    }

    function overTop(elem, threshold) {
        var scroll_top = $(window).scrollTop(),
            window_h = $(window).height(),
            offset_t = $(elem).offset().top;
        threshold = parseFloat(threshold) || 0;
        return scroll_top + window_h + threshold > offset_t;
    }

    // 模板
    var compiledTpl = (function () {
        // 裁剪图片
        template.helper('cutter', function (source, format) {
            var ret, _index, path, size, matches;
            if (!source) {
                return 'http://p8.qhimg.com/t01742f4d8eae91b502.png';
            }
            if (source.indexOf('qhimg.com') < 0 && source.indexOf('qhmsg.com') < 0) {
                return source;
            }

            if (format) {
                size = format.split('-')[0] + '_' + format.split('-')[1] + '_';
                matches = source.match(/^(http:\/\/.+?)(\/.+)*(\/.+)$/);
                if (matches && matches.length > 0) {
                    ret = [matches[1], '/', 'dmfd', '/', size, matches[3]].join('');
                }
            }

            return ret ? ret : source;
        });

        template.helper('strCount', function (str, setlen) {
            var str = $.trim(str);
            var count = 0,
                re = /[\u4e00-\u9fa5]/,
                uFF61 = parseInt("FF61", 16),
                uFF9F = parseInt("FF9F", 16),
                uFFE8 = parseInt("FFE8", 16),
                uFFEE = parseInt("FFEE", 16);

            for (var i = 0, len = str.length; i < len; i++) {
                if (re.test(str[i])) {
                    count += 1;
                } else {
                    var c = parseInt(str.charCodeAt(i));
                    if (c < 256) {
                        count += 0.5;
                    } else {
                        if ((uFF61 <= c) && (c <= uFF9F)) {
                            count += 0.5;
                        } else if ((uFFE8 <= c) && (c <= uFFEE)) {
                            count += 0.5;
                        } else {
                            count += 1;
                        }
                    }
                }
            }
            return count;
        });

        template.helper('ellipsis', function (text, len) {
            if (text.length > len) {
                text = text.slice(0, len - 3) + '...';
            }
            return text;
        });

        var tpl = {};

        var tpls = {
            feed_1: $('#j-tpl-feed1').html(),
            feed_2: $('#j-tpl-feed2').html(),
            feed_3: $('#j-tpl-feed3').html(),
            feed_4: $('#j-tpl-feed4').html(),
            feed_5: $('#j-tpl-feed5').html(),
            feed_6: $('#j-tpl-feed6').html()
        };

        for (var key in tpls) {
            if (!tpls[key]) continue;
            tpl[key] = template.compile(tpls[key]);
        }

        return tpl;
    })();

    // 用模板把数据转成字符串
    function dataToString(compiledTpl, data, prefix, hasDislike) {
        var news_array = null,
            _prefix = prefix || 'feed',
            has_dislike = hasDislike;

        function getHtml(data) {
            var lens = data.length,
                _html = '',
                item = {};

            // 遍历数据，生产html字符串
            for (var i = 0; i < lens; i++) {
                item = data[i];

                if (item.module >= 1 && item.module <= 5) {
                    item.has_dislike = has_dislike;
                    _html = _html + compiledTpl[_prefix + '_' + item.module](item);
                } else if (item.module == 7) {
                    item.has_dislike = has_dislike;
                    news_array = item.data && item.data.news || [];
                    item.content = getHtml(news_array);
                    _html = _html + compiledTpl[_prefix + '_' + item.module](item); // 新闻组模板用的是feed_6!!!
                }
            }

            return _html || '';
        }

        return getHtml(data) || '';
    }

    var config = {
        api: {
            feed: 'http://pc.api.btime.com/btimeweb/getInfoFlow'
        },
        loop: 3,
    };

    var feed_config = {
        preHandleData: function (obj) { // 预处理数据，请求成功并不等于数据正确，去重、添加字段等等
            var resData = obj.resData;

            if (!resData || resData.errno !== 0 || !resData.data || !resData.data.length) {
                obj.hasData = false;
            } else {
                obj.hasData = true;
                obj.data = resData.data;

                // 滚动5，禁用滚动功能，
                if (obj.page == scrollTimes) {
                    obj.module.lockScroll();
                }
            }
        },

        // 数据处理函数：data to string：传入数据，返回字符串
        transformData: function (obj) {
            obj.handledData = dataToString(compiledTpl, obj.data || [], 'feed', obj.hasDislike);
        },

        // 延迟加载 & 插入广告
        afterInsert: function (obj) {
            var pos = '';

            if (obj.page == 1) {
                pos = 'init';
            } else {
                pos = 'bottom';
            }

            // 插入广告
            window.BTIME_ADVERT && window.BTIME_ADVERT.insertAdvert({
                sub_channel: obj.channel,
                type: pos,
                container: obj.target.$container,
                up_num: -3
            });

            // 并显示按钮
            if (obj.page == scrollTimes) {
                var buttonHtml = '<div class="btn-more-feed j-more-feed" data-page="' + 1 + '">' +
                    '<a class="alerts-text" href="' + channelLinkMap[obj.channel] + '">' + 加载更多 + '</a></div>';
                $(buttonHtml).appendTo(obj.module.$container);
            }

            // 延迟加载
            obj.target.$container.find('img.lazy').lazyload();
        },

        uniqueTag: '', // 信息流唯一标识
        container: '', // 插入信息流的外层容器
        hasFirstPageData: false,
        baseLoad: {
            baseUrl: config.api.feed,
            pagingName: 'page', // 分页参数，默认是page
            // timestamp: 'timestamp',
            // countName: 'count',
            // countNum: 13,
            urlParam: { // 接口参数
                pid: 3, // 用于把大图模板转为左图右文模板
                request_pos: 'index' // 说明是首页请求的数据流，默认为空
            }
        },
        hasScrollLoad: true, // 滚动加载，默认打开
        scrollLoad: {
            urlParam: {
                refresh_type: 2
            }
        },
        thresholdTime: 100, // 100ms内连续滚动，加载事件被取消掉
        thresholdVal: 100, // 提前100px，开始加载数据

        hasRemindLoad: true, // 未读提醒加载，默认关闭
        remindLoad: {
            urlParam: {
                refresh_type: 1
            }
        },
        remindTime: 1 / 6, // 隔5分钟，推荐一次
        updateTime: 1, // 一分钟更新一次，推荐提醒，前几分钟看到这里
        alertUI: {
            result: '<div class="alerts j-alert-result"><span class="alerts-text j-alert-text"></span></div>',
            loading: '<div class="alerts j-alert-loading hide-text"><span class="loading j-alert-text">正在加载...</span></div>',
            unread: '<div class="alerts j-alert-unread">' +
            '<span class="alerts-text">您有未读新闻, 点击查看</span>' +
            '<span class="alerts-btn-close j-unread-close"><i>&times;</i></span></div>',
            refresh: '<div class="alerts alerts-inline j-alert-refresh" data-record-time="1">' +
            '<span class="alerts-text"><span class="j-refresh-time">1分钟</span>前看到这里, 点击刷新</span></div>'
        }
    };

    

    var oIndexFeed = null;
    // 初始化信息流时机：
    $(window).on('scroll.feed', debounce(function() {
        if (overTop($('#index-feed'), 100)) {
            $(window).off('scroll.feed');
            window.INFO_FLOW && (oIndexFeed = window.INFO_FLOW(feed_config));

            // 点击更多加载
            $('#index-feed').on('click', '.j-more-feed', function(e) {
                var $this = $(this);
                var 
            });
        }
    }));


})();



<div class="wrap index-feed">
    <div class="box-wrap clearfix">
        <div class="box-main">
            <div class="box-body">
                <div class="panel channel-list-group channel-figure">
                    <div class="panel-hd">
                        <h2 class="panel-hd-title">
                            <i class="bg"></i>
                            <a href="#">为您推荐</a>
                        </h2>
                    </div>
                    <div class="panel-bd">
                        <!-- 信息流 -->
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="box-left">
            <div class="panel j-fix-top">
                <div class="panel-hd">
                    <h2 class="panel-hd-title">
                        <i class="bg"></i>
                        <a href="#">快讯</a>
                    </h2>
                </div>
                <div class="panel-bd">
                    <div class="main-col">
                        <ul class="list-text">
                            <li>
                                <a href="#">是打发斯蒂芬是打发点</a>
                                <i></i>
                                <span>11分钟前</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-right">
            <!-- 广告 -->
            <div class="j-fix-top">

            </div>
        </div>
    </div>
</div>



/* 底部模块layout */
.index-feed {
    margin-top: 30px;
    border-top: 3px solid #e53e38;
    padding-top: 30px;
}

.box-main {
    width: 100%;
}

.box-main .box-body {
    margin-left: 230px;
    margin-right: 330px;
}

.box-main, .box-left, .box-right {
    float: left;
}

.box-left {
    width: 200px;
    margin-left: -1200px;
}

.box-right {
    width: 300px;
    margin-left: 300px;
}

/* 底部快讯 */
.list-text li {
    position: relative;
    line-height: 20px;
    padding-left: 14px;
}

.list-text li a {
    display: block;
    max-height:40px;
    overflow: hidden;
    font-size: 14px;
}

.list-text li i {
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #d9d9d9;
    left: 1px;
    top: 8px;
}

.list-text li span {
    display: block;
    color: #999999;
}