//引入此模块
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/201601blog');
//定义模型，确定数据库里表结构
var userSchema = new mongoose.Schema({
    username:String,
    password:String
});
//再定义model
var userModel = mongoose.model('user',userSchema);

module.exports = userModel;
