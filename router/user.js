const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
const r=express.Router();
//1.用户注册(post /reg)
r.post('/reg',(req,res,next)=>{
  //1.1获取流传递的数据
  let obj=req.body;
  console.log(obj);
  //1.2验证各项数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname不能为空'});
	//阻止往后执行
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd不能为空'});
	return;
  }
  if(!obj.email){
    res.send({code:403,msg:'email不能为空'});
	return;
  }
  if(!obj.phone){
    res.send({code:404,msg:'phone不能为空'});
	return;
  }
  //1.3执行SQL命令
  pool.query('insert into xz_user set ?',[obj],(err,result)=>{
    if(err){
	  //把错误交给下一个中间件
      next(err);
	  //阻止往后执行
	  return;
	}
	console.log(result);
	//执行成功
    res.send({code:200,msg:'注册成功'});
  });
});
//2.用户登录(post /login)
r.post('/login',(req,res,next)=>{
  //2.1获取流传递的数据
  let obj=req.body;
  console.log(obj);
  //2.2验证各项数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname不能为空'});
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd不能为空'});
	return;
  }
  //2.3执行SQL命令
  pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
    if(err){
	  //交给下一个中间件处理
	  next(err);
	  return;
	}
	console.log(result);
	//查询的结果是数组，如果是空数组说明登录失败，否则登录成功
	//空数组的长度值为0
	if(result.length===0){
	  res.send({code:201,msg:'登录失败'});
	}else{
	  res.send({code:200,msg:'登录成功'});
	}
	
  });
});
//3.修改用户(put /)
r.put('/',(req,res,next)=>{
  //3.1获取流传递的数据
  let obj=req.body;
  console.log(obj);
  //3.2验证各项数据是否为空
  //循环获取每个属性
  let n=400;//用于记录状态码
  for(let k in obj){
	n++;//每次遍历一个属性，状态码加1
	//k属性名  obj[k] 属性值
    //console.log(k,obj[k]);
	//判断，如果属性值为空，则提示属性名不能为空
	if(!obj[k]){
	  res.send({code:n,msg:k+'不能为空'});
	  //阻止往后执行
	  return;
	}
  }
  //3.3执行SQL命令
  pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
    if(err){
	  next(err);
	  return;
	}
	console.log(result);
	//结果是对象，判断对象下的affectedRows属性，如果是0说明修改失败，否则修改成功
	if(result.affectedRows===0){
	  res.send({code:201,msg:'修改失败'});
	}else{
	  res.send({code:200,msg:'修改成功'});
	}
  });
});


//导出路由器对象
module.exports=r;