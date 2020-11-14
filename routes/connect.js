var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const koaBody = require('koa-body');
const pdftk = require('node-pdftk');
var mammoth = require("mammoth");
var cp = require("child_process");




router.get('/',(req, res)=>{
    res.render('upload');
    
})

router.get('/test_count_doc',(req, res)=>{
//     var raws = mammoth.extractRawText({path:"/var/ftp/pub/测试.docx"}).value;
//     console.log(raws);
//     console.log(mammoth.extractRawText(file_ad).value.length);
//     res.render('upload');
   cp.exec("pdftotext /var/ftp/pub/5/181090901_赵强.pdf /var/ftp/pub/5/181090901_赵强.txt",function(err,stdout,stderr){
	    if(err){
		console.error(err);
	    }
	    console.log("stdout:",stdout)
	    console.log("stderr:",stderr);
   });
   cp.exec("echo |wc -w /var/ftp/pub/5/181090901_赵强.txt",function(err,stdout,stderr){
	    if(err){
		console.error(err);
	    }
	    console.log("stdout:",stdout)
	    console.log("stderr:",stderr);
   });	
	
})

//文件下载
router.get('/dload',(req, res)=>{
    var id = req.query.id;
    var stuid = req.query.stu;
    res.download('/var/ftp/pub/'+id+'/'+stuid+'.pdf','D:/下载/'+stuid+'_'+id+'_copy.pdf',function(err){
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
})
router.post('/file_upload', function (req, res) {
   console.log('进入了函数')
   console.log(req.files[0]);  // 上传的文件信息
   var tempfilename = req.files[0].originalname;
   var mysid = tempfilename.split("_")[0];
   var myid = tempfilename.split("_")[1];
   var myfile = tempfilename.split("_")[2];
   var myname = myfile.split(".")[0];
   var mylas = myfile.split(".")[1];
   
   console.log('学号:'+mysid);
   console.log('作业id号码:'+myid); 
   console.log('学生姓名:'+myname); 
   console.log('文件后缀:'+mylas);
   var des_file ="/var/ftp/pub/" +myid+"/"+mysid+"_"+myname+".pdf"; //文件名
   console.log('目标地址: '+des_file);
   fs.exists("/var/ftp/pub/"+myid,function(exists){
       if(exists)
       {
            fs.readFile( req.files[0].path, function (err, data) {  // 异步读取文件内容
                fs.writeFile(des_file, data, function (err) { // des_file是文件名，data，文件数据，异步写入到文件
                if( err ){
                    console.log( err );
                }else{
		    pdftk.input(des_file).stamp("/var/ftp/pub/watermark/w1.pdf").output(des_file).then(buffer => {return console.log('success');}).catch(err => {
			    console.error(err);
			    
			});	
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
       }else
       {
           fs.mkdir("/var/ftp/pub/" +myid, function(err){
               if(err){
                   throw err;
               }
               else{
                   console.log('创建成功');
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
               }
           });
       }
    })
})



module.exports=router;
