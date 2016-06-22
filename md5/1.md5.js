/**
 * 散列算法 摘要算法
 * 把任意一个长度的字节数组（字节数组==>字符串）转成固定长度的字符串
 * 1.不同的输入一定会产生不同的输出
 * 2.相同的输入一定会产生相同的输出
 * 3.输出的结果不能反推出输入的内容
 */
var crypto = require('crypto');
console.log(crypto.getHashes());
var s = crypto.createHash('md5').update('hello').update('world').digest('hex');//hex表示十六进制

console.log(s);


