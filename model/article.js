//引入此模块
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/201601blog');
//定义模型，确定数据库里表结构
var articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    img:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},//类型是主键类型，引用的模型是user
    //发表日期类型是Date，默认值是now，当前时间
    createAt:{type:Date,default:Date.now},
    //添加评论的字段
    comments:[{user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},content:String,createAt:{type:Date,default:Date.now}}],
    //浏览量
    pv:{type:Number,default:0}
});
//再定义model
var articleModel = mongoose.model('article',articleSchema);

module.exports = articleModel;
