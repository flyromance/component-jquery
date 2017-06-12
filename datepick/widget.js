function getData(year, month) {
    var ret = [];

    var date = new Date();

    var firstDate = new Date(year, month - 1, 1); // 获取指定月份第一天日期对象
    var firstDate_day = firstDate.getDay(); // 获取第一天是星期几
    firstDate_day = firstDate_day === 0 ? 7 : firstDate_day; // 有可能是星期日(0)，要转为7

    var _lastDate = new Date(year, month - 1, 0); // 获取指定月份上个月的最后一天日期对象
    var _lastDate_date = _lastDate.getDate(); // 上个月最后一天是几号：31 30 28 27等

    var lastDate = new Date(year, month, 0); // 获取指定月份最后一天日期对象
    var lastDate_date = lastDate.getDate(); // 本月有多少天

    // 循环42次(6周)，从1开始
    for (var i = 1, lens = 6 * 7 + 1; i < lens; i++) {
        var _date,
            _month = month,
            _year = year;
        var item = null;

        if (i <= firstDate_day) { // 上一个月: 注意上一年
            _date = i - firstDate_day + _lastDate_date;
            _month = month - 1;
            if (_month == 0) {
                _month = 12;
                _year = year - 1;
            }
        } else if (firstDate_day < i && i <= firstDate_day + lastDate_date) { // 本月
            _date = i - firstDate_day;
            _month = month;
        } else { // 下一个月：注意下一年 
            _date = i - firstDate_day - lastDate_date;
            _month = month + 1;
            if (_month > 12) {
                _month = 1;
                _year = year + 1;
            }
        }

        ret.push({
            year: _year,
            // thisYear: year,
            month: _month,
            thisMonth: month, // 面板上的月份
            date: _date,
            day: (i - 1) % 7 === 0 ? 7 : (i - 1) % 7
        });
    }

    ret.year = year;
    ret.month = month;

    return ret;
}

function getHtml(arr) {
    var html = '<table><thead><tr>' +
        '<th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>' +
        '</tr></thead><tbody>';
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];

        if (i % 7 == 0) {
            html += '<tr>';
        }

        if (item.month != item.thisMonth) {
            html += '<td class="gray">';
        } else {
            html += '<td>';
        }

        html += item.date + '</td>';

        if (i % 7 == 6) {
            html += '</tr>';
        }
    }
    html += '</tbody></table>';
    return html;
}

var cache = {};

function init(selector, year, month) {
    year = year || date.getFullYear();
    month = month || (date.getMonth() + 1);
    var container = document.querySelector(selector);

    if (!cache[year + '' + month]) {
        var data = getData(year, month);
        var html = getHtml(data);
        container.innerHTML = html;
        cache[year + '' + month] = html;
    } else {
        container.innerHTML = cache[year + '' + month];
    }

    document.querySelector('.ui-datepick-title').innerHTML = year + '-' + month;
}

document.addEventListener('click', function (e) {
    var target = e.target;
    var leftBtn, rightBtn;
    if (e.target === (leftBtn = document.querySelector('.ui-datepick-btn-left')) ||
        target === (rightBtn = document.querySelector('.ui-datepick-btn-right'))) {
        var year = +document.querySelector('.ui-datepick-title').innerHTML.split('-')[0];
        var month = +document.querySelector('.ui-datepick-title').innerHTML.split('-')[1];

        if (target == leftBtn) {
            month--;
        } else {
            month++;
        }

        if (month == 0) {
            year--;
            month = 12;
        }

        if (month > 12) {
            month = 1;
            year++;
        }

        init('.ui-datepick-body', year, month);
    }
});


init('.ui-datepick-body', 2017, 1);
