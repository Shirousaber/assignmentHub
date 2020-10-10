var express = require('express');
var router = express.Router();
const ftp = require('ftp');//连接FTP
const path = require('path');
const client = new ftp();
const fs = require('fs');

var ftpTarget ={
    host: "localhost",
    port: "21",
    user:"ftp",
    password:""
};

//用于实现ftp服务器的链接

router.get('/',(req, res)=>{
    res.send('This is the page for uploading and downloading files!');
    
})
// function ftplog(){
//     client.on('ready',()=>{
//     console.log(new Date());
//     console.log('ftp client is ready');
//     });
//     client.on('close',()=>{
//     console.log('ftp client has close')
//     });
//     client.on('end',()=>{
//     console.log('ftp client has end')
//     });
//     client.on('error',(err)=>{
//     console.log('ftp client has an error : '+ JSON.stringify(err))
//     });
// }

router.get('/upload',(req, res)=>{
    var id = req.query.id;
    var curuser = req.query.user;
    //console.log(id);
    //console.log(target);
    //日志输出
    // //切换目录
    // function cwd(dirpath){
    //     return new Promise((resolve,reject)=>{
    //     client.cwd(dirpath,(err,dir)=>{
    //     resolve({err : err,dir : dir});
    //     })
    //     });
    // }

    // //将文件上传到ftp目标地址
    // async function put(currentFile,targetFilePath){
    //     const dirpath = path.dirname(targetFilePath);
    //     const fileName = path.basename(targetFilePath);
    //     const rs = fs.createReadStream(currentFile);
    //     let {err : ea,dir} = await cwd(dirpath);//此处应对err做处理
    //     if(ea){
    //     return Promise.resolve({err : ea});
    //     }
    //     return new Promise((resolve,reject)=>{
    //     client.put(rs,fileName,(err)=>{
    //     resolve({err : err});
    //     })
    //     });
    // }
    
        client.on('ready', function(){
            client.put('D:/上传/'+curuser+'_'+id+'.zip','/pub/'+id+'/'+ curuser+'.zip',function(err){
                if(err){
                    res.send('ftp异常！');
                }else{
                    console.log('文件上传成功')
                    console.log(new Date());
                    client.end();
                } 
            });
            })
        //文件上传
        client.connect(ftpTarget);
        
})
//文件下载
router.get('/dload',(req, res)=>{
    var id = req.query.id;
    var curuser = req.query.stu;
    client.on('ready',function(err){
        client.get('/pub/'+id+'/'+ curuser+'.zip',function(err, stream){
            if(err) {res.send('没有这样的文件');}else{
                stream.once('close', function() {  client.end(); });
                router.get("/xxx", function(req, res){
                    res.download('D:/下载/'+curuser+'_'+id+'.zip');
                });
            }
            
        });
    })
    client.connect(ftpTarget);
//     var id = req.query.id;
//     console.log(id)
//     //日志输出
//     client.on('ready',()=>{
//     console.log(new Date());
//     console.log('ftp client is ready');
//     });
//     client.on('close',()=>{
//     console.log('ftp client has close')
//     });
//     client.on('end',()=>{
//     console.log('ftp client has end')
//     });
//     client.on('error',(err)=>{
//     console.log('ftp client has an error : '+ JSON.stringify(err))
//     });



//     client.connect(ftpTarget);


    
})

module.exports=router;
