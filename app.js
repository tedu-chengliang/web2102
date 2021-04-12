const express=require('express');
//引入body-parser
const bodyParser=require('body-parser');
//引入用户路由器
const userRouter=require('./router/user.js');
//console.log(userRouter);
const app=express();
app.listen(8080);

//应用body-parser中间件将流请求的数据解析为对象
app.use( bodyParser.urlencoded({
  extended:false
}) );
//应用路由器，添加前缀/v1/users
// /v1/users/reg
app.use( '/v1/users',userRouter );
//错误处理中间件
//要拦截所有产生错误
app.use( (err,req,res,next)=>{
  //err 接收的错误
  console.log(err);
  res.send({code:500,msg:'服务器端错误'});
} );