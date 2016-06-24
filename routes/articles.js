var express = require('express');
var articleModel = require('../model/article');
var userModel = require('../model/user');
var middleware = require('../middle/index');
var markdown = require('markdown').markdown;
var multer = require('multer');
//生成一个路由实例
var router = express.Router();
//指定文件元素的存储方式
var storage = multer.diskStorage({
    //保存的目标地址
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    //指定保存的文件名
    filename: function (req, file, cb) {
        console.error(file);
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1));
    }
});

var upload = multer({ storage: storage });
//请求一个空白发表文章页面
router.get('/add',function(req,res){
  res.render('article/add',{article:{},keyword:req.session.keyword});
});
//提交文章数据 里面放置的是文件域的名字
router.post('/add',upload.single('img'),function(req,res){
    var article = req.body;
    console.log(article);
    var _id = article._id;

    if(_id){//如果有值表示修改
        //set要更新字段
        var set = {title:article.title,content:article.content};
        if(req.file){//如果新上传了文件，那么更新img字段
            set.img = '/images/'+req.file.filename;
        };
        articleModel.update({_id:_id},{$set:set},function(err,article){
            if(err){
                req.flash('error','更新文章失败');
                return res.redirect('back');
            }else{
                req.flash('success','更新文章成功');
                return res.redirect('/');
            }
        })
    }else{
        if(req.file){
            article.img = '/images/'+req.file.filename;
        };
        var user = req.session.user;
        article.user = user;//user是个对象，但保存进数据库里的是个ID字符串
        console.log(article);
        articleModel.create(article,function(err,doc){
            if(err){
                console.error(err);
                req.flash('error','发表文章失败');
                return res.redirect('back');
            }else{
                req.flash('success','发表文章成功');
                return res.redirect('/');
            }
        })
    }

});
//增加文章的详情页
router.get('/detail/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        article.content = markdown.toHTML(article.content);
        
        article.comments.forEach(function(comment){
            userModel.findById(comment.user).populate('user').exec(function(err,user){

                comment.user = {};
                comment.user = user;
                console.log(article);

            });
        });

        res.render('article/detail',{article:article,keyword:req.session.keyword});
    });

});
//删除文章
router.get('/delete/:_id',function(req,res){
    console.log(req.params._id);
    articleModel.remove({_id:req.params._id},function(err,result){
        if(err){
            req.flash('error','删除失败');
            res.redirect('back');
        }else{
            req.flash('success','删除成功');
            res.redirect('/');
        }
    });
});
//修改文章
router.get('/update/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/add',{article:article,keyword:req.session.keyword});
    });
});
//分页
router.get('/list/:pageNum/:pageSize',function(req, res, next) {
    //确定第几页
    var pageNum = req.params.pageNum&&req.params.pageNum>0?parseInt(req.params.pageNum):1;
    //确定本页有几篇文章
    var pageSize =req.params.pageSize&&req.params.pageSize>0?parseInt(req.params.pageSize):2;
    var query = {};
    var searchBtn = req.query.searchBtn;
    var keyword = req.query.keyword;
    if(searchBtn){//如果通过搜索访问，则把解析出的关键字赋值给会话关键字
        req.session.keyword = keyword;
    }
    if(req.session.keyword){//如果会话关键字存在，则设置query对象的title属性为以关键字为模式的对大小写不敏感的正则表达式
        query['title'] = new RegExp(req.session.keyword,"i");
    }

    articleModel.count(query,function(err,count){//计算文章标题中包含关键字的文章
        //查询出标题包含关键字的文章，以时间顺序排序，跳过小于当前页码减一乘以每页数量的文章数，输出每页指定数量的文章，并以用户为对象名转成对象，完成后执行回调
        articleModel.find(query).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
            articles.forEach(function (article) {
                //将查询出的文章内容，如果包含markdown写法则将其转换成html
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:req.session.keyword,
                totalPage:Math.ceil(count/pageSize),
                articles:articles
            });
        });
    });
});
//添加评论
router.post('/comment',middleware.checkLogin, function (req, res) {
    var user = req.session.user;
    articleModel.update({_id:req.body._id},{$push:{comments:{user:user,content:req.body.content}}},function(err,result){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
    });

});
module.exports = router;
