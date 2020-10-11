var express = require('express');
var router = express.Router();
const ftp = require('ftp');//连接FTP
const path = require('path');
//const client = new ftp();
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
    const client = new ftp();
//     multer({
//         dest:'/var/ftp/pub/'+id+'/'
//     }).single('D:/下载/'+curuser+'_'+id+'.doc'),(req,res)=>{
//         console.log('OKK');
//         res.send(req.file);
//     }
//     if (!fs.existsSync('/var/ftp/pub/'+id+'/')) {
//      fs.mkdirSync('/var/ftp/pub/'+id+'/');
//     }
//     var stream = fs.createWriteStream('/var/ftp/pub/'+id+'/'+ curuser+'.doc');
//     request('D:/下载/'+curuser+'_'+id+'.doc').pipe(stream).on('close', function(err){
//         if(err){
//             throw err;
//         }else{
//         }
//     });
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
    //新宝岛上传
    fs.readFile('http://'+req.headers.host+'/D:/上传/' +curuser+'_'+id+'.txt', function (err, data) {
		fs.writeFile('/var/ftp/pub/'+id+'/'+curuser+'_'+id+'.remote-copy.txt', data, function (err) {
			console.log(data)
			if( err ){
				console.log( err );
			}else{
			}
		});
	});
    
//         client.on('ready', function(){
//             client.put('D:/上传/'+curuser+'_'+id+'.txt','pub/'+id+'/'+curuser+'_'+id+'.remote-copy.txt',function(err){
//                 if(err){
//                     res.send('ftp异常！');
//                 }else{
//                     console.log('文件上传成功')
//                     console.log(new Date());
//                     client.end();
//                 } 
//             });
//             })
//         //文件上传
//         client.connect(ftpTarget);
        
})
//文件下载
router.get('/dload',(req, res)=>{
    var id = req.query.id;
    var curuser = req.query.stu;
    res.download('/var/ftp/pub/'+id+'/'+ curuser+'.txt','D:/下载/'+curuser+'_'+id+'_copy.txt',function(err){
//         if(err)
//         {
//             throw err;
//         }else{
//         }
    })
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
router.post('/file_upload', function (req, res) {
 
   console.log(req.files[0]);  // 上传的文件信息
   var tempfilename = req.files[0].originalname;
   var des_file ="/var/ftp/pub/" + req.files[0].originalname; //文件名
   console.log(des_file);
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

