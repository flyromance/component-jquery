var express = require('express');
var path = require('path');
var ejs = require('ejs'); // express的默认引擎
var app = express();
var PORT = process.env.PORT || 999;

// 指定模板文件目录
app.set('views', './views');

// 指定模板引擎
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// 指定静态资源目录
app.use(express.static(path.resolve('./static')));

// 配置route
app.get('/', function(req, res) {
    res.render('demo.html');
});

app.listen(PORT);

console.log('started on port ' + PORT);