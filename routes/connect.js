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


router.post('/file_upload', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = "上传成功！";
});

module.exports=router;

