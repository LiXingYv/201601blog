/**
 * md5的加盐算法
 */
var crypto = require('crypto');

var s = crypto.createHmac('md5','sal').update('hello').digest('hex');

console.log(s);

