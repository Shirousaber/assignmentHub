var express = require('express');
var router = express.Router();
const myql = require('mysql');

var config = {
  host     : 'localhost',     //本机地址
  user     : 'root',          //用户
  password : '123456',        //密码
  port: '3306',               
  database: 'test'            
};

/* GET home page. */
router.get('/', function(req, res, next) {
    sqlConnect=function(sql,sqlArr,callBack){
    var pool = myql.createPool(config);
    pool.getConnection((err, conn)=>{
        console.log('123456');
        
        if(err){
            throw err;
            return;
        }
        conn.query(sql,sqlArr,callBack);
        conn.release();
        })
    }
    var sql = "select * from class";
    var sqlArr = [];
    var callBack = (err, data)=>{
        if(err){
            throw err;
        }else{
          res.render('index', { 
	          title: 'express&mysql测试',
	          data:data 
            });  
        }
    }
    sqlConnect(sql,sqlArr,callBack)
});



module.exports = router;
