var express = require('express');
var articleModel = require('../model/article');
var markdown = require('markdown').markdown;
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
    //先配置参数，然后再执行查询
    //我们查出来的user是id，需要通过populate转成对象
    articleModel.find().populate('user').exec(function(err,articles){
        if(err){
            req.flash('error',error);
            return res.redirect('/');
        }
        // console.log(articles);
        articles.forEach(function (article) {
            article.content = markdown.toHTML(article.content);
        });
        res.render('index',{articles:articles});
    });
    // res.redirect('/articles/list/1/2');
});

module.exports = router;
