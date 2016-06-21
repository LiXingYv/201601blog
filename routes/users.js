var express = require('express');
var userModel = require('../model/user');
var validate = require('../middle/index.js');
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
router.get('/reg',validate.checkNotLogin,function(req,res){
  res.render('user/reg');
});
//提交用户注册的表单
router.post('/reg',validate.checkNotLogin,function(req,res){
  var user = req.body;
  userModel.create(user,function(err,doc){
      if(err){
          req.flash('error',err);
      res.redirect('back');//返回到上一个页面
      }else{
          //把保存之后的用户放置到此用户会话的user属性上
          req.session.user = doc;
          //增加一个成功的提示
          req.flash('success','注册成功');
          // req.session.success = '注册成功';
          res.redirect('/');
      }
  })

});

//用户登录  当用户通过get方法请求/users/reg的时候，执行此函数
router.get('/login',validate.checkNotLogin,function(req,res){
  res.render('user/login');
});
//提交用户登录的表单
router.post('/login',validate.checkNotLogin,function(req,res){
  res.send('login');
});

//退出登录
router.get('/logout',validate.checkLogin,function(req,res){
  req.session.user = null;
  //增加一个成功的提示

  res.redirect('/');
});


module.exports = router;
