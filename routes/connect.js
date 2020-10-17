var express = require('express');
var router = express.Router();
const ftp = require('ftp');//连接FTP
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const koaBody = require('koa-body');

var ftpTarget ={
    host: "localhost",
    port: "21",
    user:"ftp",
    password:""
};

//用于实现ftp服务器的链接

//用于实现ftp服务器的链接

router.get('/',(req, res)=>{
    res.render('upload');
    
})


router.get('/upload',(req, res)=>{
    var id = req.query.id;
    var curuser = req.query.user;
    const client = new ftp();
    //如果不存在该路径就创建相关文件夹
    if(!fs.existsSync('/var/ftp/pub/'+id)){
	    fs.mkdir('/var/ftp/pub/'+id);
    }
    //新宝岛上传
    fs.readFile('http://'+req.headers.host+'/D:/上传/' +curuser+'_'+id+'.txt', function (err, data) {
		fs.writeFile('/var/ftp/pub/'+id+'/'+curuser+'_'+id+'.remote-copy.txt', data, function (err) {
			console.log(data)
			if( err ){
				console.log( err );
				res.send('文件上传失败');
			}else{
				console.log('文件上传成功');
				console.log(new Date());
				fs.close(data, function(err){
					if(err){
						res.send('文件关闭失败');
					}
					console.log('文件链接已经关闭');
					console.log(new Date());
				})
			}
		});
	});
    

        
})
//文件下载
router.get('/dload',(req, res)=>{
    var id = req.query.id;
    var curuser = req.query.stu;
    res.download('/var/ftp/pub/'+id+'/'+curuser+'_'+id+'.remote-copy.txt','D:/下载/'+curuser+'_'+id+'_copy.txt',function(err){
	    if(err){
		    console.log('远程不存在或者本地文件丢失');
		    console.log(new Date());
		    res.send('远程不存在或者本地文件丢失');
	    }
	    else{
		    console.log('文件下载成功');
		    console.log(new Date());
	    }


    
})
router.post('/file_upload', function (req, res) {
 
   console.log(req.files[0]);  // 上传的文件信息
   var tempfilename = req.files[0].originalname;
   var mysid = tempfilename.split("_")[0];
   var myid = tempfilename.split("_")[1];
   var myid = myid.split(".")[0];
   var myla = myid.split(".")[1];
   console.log(mysid);
   console.log(myid);
   var des_file ="/var/ftp/pub/" +myid+"/"+mysid+".zip"; //文件名
   console.log(des_file);
   if(!fs.existsSync("/var/ftp/pub/" +myid)){
	    fs.mkdir("/var/ftp/pub/" +myid);
    }
   fs.readFile( req.files[0].path, function (err, data) {  // 异步读取文件内容
        fs.writeFile(des_file, data, function (err) { // des_file是文件名，data，文件数据，异步写入到文件
         if( err ){
              console.log( err );
         }else{
               // 文件上传成功，respones给客户端
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
   
})



module.exports=router;

