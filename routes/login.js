var express = require('express');
var router = express.Router();
const myql = require('mysql');
var path = require("path");
var curruser ="";
var connection = myql.createConnection(
    {
        host     : 'localhost',     //本机地址
        user     : 'root',          //用户
        password : 'xzx-996Fb',        //密码
        port: '3306',               
        database: 'test'            
    }

);
// var config={
//     host     : 'localhost',     //本机地址
//     user     : 'root',          //用户
//     password : '123456',        //密码
//     port: '3306',               
//     database: 'test'            
// };


//测试数据库连接是否成功
// router.get('/testlog', (req, res)=>{
    
//     sqlConnect=function(sql,sqlArr,callBack){
//         var pool = myql.createPool(config);
//         pool.getConnection((err, conn)=>{
//             console.log('123456');
            
//             if(err){
//                 throw err;
//                 return;
//             }
//             conn.query(sql,sqlArr,callBack);
//             conn.release();
//         })
//     }
//     var sql = "select * from user";
//     var sqlArr = [];
//     var callBack = (err, data)=>{
//         if(err){
//             throw err;
//         }else{
//             res.send({
//                 'list':data
//             })
//         }
//     }
//     sqlConnect(sql,sqlArr,callBack)
// });

//管理身份登录
// router.post('/adlogi', function(req, res, next){
//     var currdata = req.body;
//     console.log(currdata);
//     if(currdata.username=="guan"&&currdata.password=="0818"){
//         var str = {"result":{"username":currdata.username,"password":currdata.password},"code":1};
//     }else{
//         var str = {"result":{},"code":0};
//     }
//     res.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
//     str = JSON.stringify(str);
//     console.log(str);
// })

//测试测试已提交作业
router.get('/tIndex',function(req,res){
    res.sendfile(path.join(__dirname,"../public/tIndex.html"))
})


//测试测试已提交作业
router.get('/updated',function(req,res){
    res.send(curruser);
})
 

connection.connect()
router.get('/',function(req,res){
    res.sendfile(path.join(__dirname,"../public/Alogin.html"))
    //_dirname:当前文件的路径，path.join():合并路径
})
/**
*管理员登录
*/
router.get('/login',function(req,res){
    var name = req.query.name
    var pwd = req.query.pwd
    curruser = name;
    var query1 = "select * from user where id='"+name+"' and psd='"+pwd+"'"
    connection.query(query1,function(err,result){
        if (err) throw err;
        console.log("!!!",result)
        if(result.length==0){
            res.send("用户名或密码错误")
        }else{
            setTimeout(function(){
                res.sendfile(path.join(__dirname,"../public/administratorAdd.html"))
            }, 10)
            }
    })
})


/**
*教师登录
*/
router.get('/tclogin',function(req,res){  
    var name = req.query.name
    var pwd = req.query.pwd
    curruser = name;
    var query1 = "select * from tuser where tid='"+name+"' and psd='"+pwd+"'"
    connection.query(query1,function(err,result){
        if (err) throw err;
        console.log("!!!",result)
        if(result.length==0){
            res.send("用户名或密码错误")
        }else{
            var config = {
                host     : 'localhost',     //本机地址
                user     : 'root',          //用户
                password : 'xzx-996Fb',        //密码
                port: '3306',               
                database: 'test'            
              };
            console.log("登录成功，欢迎 当前用户名称为:"+curruser);
            //res.send("登录成功，欢迎 当前用户名称为:"+curruser)
            sqlConnect=function(sql,sqlArr,callBack){
                var pool = myql.createPool(config);
                pool.getConnection((err, conn)=>{
                    console.log('123456');
                    
                    if(err){
                        res.send('连接数据出错！');
                        
                    }
                    setTimeout(function(){conn.query(sql,sqlArr,callBack)},10)
                    
                    conn.release();
                    })
                }
                var sqlb = "select * from tuser where tid='"+name+"' and psd='"+pwd+"'";
                var sqlArr = [];
                var callBack = (err, data)=>{
                    if(err){
                        res.send('连接数据出错！');
                    }
                    if(data.length==0){
                        res.send('不存在相关的数据');
                    }
                    else{
                      var sql = "select sid,cname,hid,date_format(deadline,'%Y-%m-%d %H:%i:%s') as deadline,class.grade as grade,name from class left join homework_updated on class.cid=homework_updated.cid  left join suser on class.sid=suser.stid where tid = '"+curruser+"'";
                        var sqlArr = [];
                        var name = data[0].tname;
                        console.log(name);
                        var callBack = (err, data)=>{
                            if(err){
                                res.send('连接数据出错！');
                            }
                            if(data.length==0){
                                res.send('不存在相关的数据');
                            }
                            else{
                              res.render('tIndex',{
                                  curruser:curruser,
                                  
                                  data:data
                                });
                            }
                        }
                        sqlConnect(sql,sqlArr,callBack) 
                    }
                }
//                 var sql = "select * from class where tid = '"+curruser+"'";
//                 var sql = "select sid,cname,hid,date_format(deadline,'%Y-%m-%d %H:%i:%s') as deadline,class.grade as grade,name from class left join homework_updated on class.cid=homework_updated.cid  left join suser on class.sid=suser.stid where tid = '"+curruser+"'";
//                 var sqlArr = [];
//                 var callBack = (err, data)=>{
//                     if(err){
//                         res.send('连接数据出错！');
//                     }
//                     if(data.length==0){
//                         res.send('不存在相关的数据');
//                     }
//                     else{
//                       res.render('tIndex',{
//                           curruser:curruser,
//                           data:data
//                         });
//                     }
//                 }
                sqlConnect(sqlb,sqlArr,callBack)      
//              res.sendfile(path.join(__dirname,"../public/tIndex.html"))
            
            //res.sendfile(path.join(__dirname,"../public/teacherd.html"))
        }
    })
})

/**
*学生登录
*/
router.get('/stulogin',function(req,res){
    var name = req.query.name
    var pwd = req.query.pwd
    curruser = name;
    var query1 = "select * from suser where stid='"+name+"' and psd='"+pwd+"'"
    connection.query(query1,function(err,result){
        if (err) res.send('连接用户数据出错！');
        console.log("!!!",result)
        if(result.length==0){
            res.send("用户名或密码错误")
        }else{
            var config = {
                host     : 'localhost',     //本机地址
                user     : 'root',          //用户
                password : 'xzx-996Fb',        //密码
                port: '3306',               
                database: 'test'            
              };
            console.log("登录成功，欢迎 当前用户名称为:"+curruser);
            //res.send("登录成功，欢迎 当前用户名称为:"+curruser)
            sqlConnect=function(sql,sqlArr,callBack){
                var pool = myql.createPool(config);
                pool.getConnection((err, conn)=>{
                    console.log('123456');
                    
                    if(err){
                        res.send('连接数据出错！');
                        
                    }
                    setTimeout(function(){conn.query(sql,sqlArr,callBack)},1000) 
                    
                    conn.release();
                    })
                }
                var sql = "select date_format(deadline,'%Y-%m-%d %H:%i:%s') as deadline, tid, cname, hid from class where sid = '"+curruser+"'";
                var sqlArr = [];
                var callBack = (err, data)=>{
                    if(err){
                        res.send('连接数据出错！');
                    }
                    if(data.length==0){
                        res.send('不存在相关的数据');
                    }
                    else{
                      res.render('index', { 
                          title: 'express&mysql测试',
                          data:data ,
                          user:curruser
                        });
                        
                    }
                }
                sqlConnect(sql,sqlArr,callBack)      
        }
    })
})


/***
 * 添加学生账号
 */
router.get('/register',function(req,res){
    var name = req.query.name
    var pwd = req.query.pwd
    var tnm = req.query.tnm
    var grd = req.query.grd
    var mjor = req.query.mjor
    var user = [name,pwd,tnm,grd,mjor];
    var query1 = 'insert into suser (stid,psd,name,grade,major) values(?,?,?,?,?)';
    connection.query(query1,user,function(err,result){
    if(err) throw err;
    console.log("***")
    res.sendfile(path.join(__dirname,"../public/administratorAdd.html"))
    })
})


/***
 * 添加教师账号
 */
router.get('/tcregister',function(req,res){
    var name = req.query.name
    var pwd = req.query.pwd
    var tnm = req.query.tnm
    var school = req.query.school
    var prot = req.query.prot
    var user = [name,pwd,tnm,grd,mjor];
    var query1 = 'insert into user (tid,psd,tname,school,proftitile) values(?,?,?,?,?)';
    connection.query(query1,user,function(err,result){
    if(err) throw err;
    console.log("***")
    res.sendfile(path.join(__dirname,"../public/administratorAdd.html"))
    })
})


/***
 * 删除学生账号
 */
router.get('/delete',function(req,res){
    var name = req.query.name
    console.log(name);
    var query1 = "delete from suser where stid='"+name+"'";
    connection.query(query1,function(err,result){
    if(err) throw err;
    console.log("***")
    res.sendfile(path.join(__dirname,"../public/administratorDelete.html"))
    })
})



/***
 * 查询学生密码
 */
router.get('/search',function(req,res){
    var name = req.query.name
    console.log(name);
    var query1 = "select psd from suser where stid='"+name+"'";
    connection.query(query1,function(err,result){
    if(err) throw err;
    console.log("***")
    console.log(result[0].psd);
    res.render('administratorSearch',{
        psd:result[0].psd
    })
    })
})

module.exports = router;
