var express = require('express');
//这是一个路由的实例
var router = express.Router();
router.use(function(req,res,next){
  console.log();
  next();
});
/* GET home page.当用户访问/的时候，执行此回调 */
router.get('/', function(req, res, next) {
  //用数据渲染模板 从session中获取用户信息
  //第二个参数对象最后会合并到res.locals对象上，并渲染模板

  res.render('index',{});
});

module.exports = router;
