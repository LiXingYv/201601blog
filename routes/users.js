var express = require('express');
var userModel = require('../model/user');
//生成一个路由实例
var router = express.Router();

/*/!* GET users listing. 当用户访问/的时候执行此回调*!/
//这里的/是当前路由下的根目录，不包含一级目录
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/reg', function(req, res, next) {
  res.send('respond with a resource');
});*/

//用户注册  当用户通过get方法请求/users/reg的时候，执行此函数
router.get('/reg',function(req,res){
  res.render('user/reg');
});
//提交用户注册的表单
router.post('/reg',function(req,res){
  var user = req.body;
  userModel.create(user,function(err,doc){
    if(err){
      res.redirect('back');//返回到上一个页面
    }else{
      //把保存之后的用户放置到此用户会话的user属性上
      req.session.user = doc;
      res.redirect('/');
    }
  })

});

//用户登录  当用户通过get方法请求/users/reg的时候，执行此函数
router.get('/login',function(req,res){
  res.render('user/login');
});
//提交用户登录的表单
router.post('/login',function(req,res){
  res.send('login');
});

//退出登录
router.get('/logout',function(req,res){
  req.session.user = null;
  res.redirect('/');
});


module.exports = router;
