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
var articles = require('./routes/articles');
var session =require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('connect-flash');
var app = express();

// view engine setup设置模板文件的存放路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'html');
//设置一下对于html格式的文件，渲染的时候委托ejs的渲染方式来进行渲染
app.engine('html',require('ejs').renderFile);
//使用了会话中间件之后，req.session出现
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/201601blog');
app.use(session({
    secret: '2016blog',
    resave: false,
    saveUninitialized:true,
    //指定保存的位置
    store: new MongoStore({ //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免重启服务器时会话丢失
        // db: '201601blog',
        // host: '127.0.0.1',
        // port: 27017
        mongooseConnection:mongoose.connection
    })
}));
app.use(flash());
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
//配置模板的中间件
app.use(function(req,res,next){
  //res.locals才是真正的渲染模板的对象
    res.locals.user = req.session.user;
    //flash取出来的是一个数组
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//路由配置
app.use('/', routes);
//这里的/才是一级路径，真正的根目录
app.use('/users', users);
app.use('/articles', articles);

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
