var app = [];

app.push(function(req,res,next){
    console.log(1);
    next('error');
});
app.push(function (req,res,next) {
    console.log(2);
    next();
});

app.push(function (err,req,res,next) {
    console.log(3);
});

var i=0;
var req,res;
function next(err){
    var fn = app[i++];//取出每个中间件函数
    if(err){
        if(fn.length == 4){
            fn(req,res,next);
        }else{
            next(err);
        }
    }else{
        fn(req,res,next);
    }
}

next();