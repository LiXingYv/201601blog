var express = require('express');
var path = require('path');
//处理收藏夹图标的
var favicon = require('serve-favicon');
//写日志的
var logger = require('morgan');
//解释cookie的 req.cookie方法用来设置cookie req.cookies 把请求中的cookie封装成对象
var cookieParser = require('cookie-parser');
//解析请求体的
var bodyParser = require('body-parser');
//加载路由 根据请求的路径不同，进行不同的处理
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup设置模板文件的存放路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//需要你把收藏夹的图标文件放在public下面
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//使用日志中间件
app.use(logger('dev'));
//解析JSON类型的请求体，通过请求体中的Content-Type {}
app.use(bodyParser.json());
//解析urlencoded类型的请求体，通过请求中的Content-Type name=zfpx
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//静态文件服务中间件 指定静态文件根目录
app.use(express.static(path.join(__dirname, 'public')));
//路由配置
app.use('/', routes);
//这里的/才是一级路径，真正的根目录
app.use('/users', users);

// catch 404 and forward to error handler
//捕获404的错误并且转发到错误处理中间件里面去
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers 错误处理

// development error handler开发环境的错误处理，将打印出错误的调用堆栈
// will print stacktrace
if (app.get('env') === 'development') {
  //错误处理中间件函数 多了一个err参数
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
//生产环境中的错误处理
//不把堆栈信息暴露给客户
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
