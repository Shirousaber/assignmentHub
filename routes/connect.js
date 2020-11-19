var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const koaBody = require('koa-body');
const pdftk = require('node-pdftk');
var mammoth = require("mammoth");
var cp = require("child_process");
const myql = require('mysql');
const util = require('util');
var exec = util.promisify(require('child_process').exec);

var connection = myql.createConnection(
  {
    host: 'localhost',     //本机地址
    user: 'root',          //用户
    password: 'xzx-996Fb',        //密码
    port: '3306',
    database: 'test'
  }

);

function SQLupdate(cid, cnt) {
  var my_cid = cid;
  var rid = 55;
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var Hours = date.getHours();
  var Minutes = date.getMinutes();
  var Seconds = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var s_createtime = year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;
  var paras = [my_cid, s_createtime, cnt]
  var query1 = 'insert into homework_updated (cid,updatetime,cnt) values(?,?,?)';
  connection.query(query1, paras, function (err, result) {
    if (err) throw err;
    console.log("***");

  })

}

router.get('/', (req, res) => {
  res.render('upload');

})

//发布作业
router.get('/publish', (req, res) => {
  res.send('发布触发成功');
})

//字数统计api测试
router.get('/test_count_doc', (req, res) => {
  //     var raws = mammoth.extractRawText({path:"/var/ftp/pub/测试.docx"}).value;
  //     console.log(raws);
  //     console.log(mammoth.extractRawText(file_ad).value.length);
  //     res.render('upload');
  cp.exec("pdftotext /var/ftp/pub/5/181090901_赵强.pdf /var/ftp/pub/5/181090901_赵强.txt", function (err, stdout, stderr) {
    if (err) {
      console.error(err);
    }
  });
  cp.exec("echo |wc -m /var/ftp/pub/5/181090901_赵强.txt", function (err, stdout, stderr) {
    if (err) {
      console.error(err);
    }
    var cnt = stdout.trim().split(" ")[0];
    console.log(cnt);
    res.send('共计' + cnt + '字');
  });

})

//文件下载
router.get('/dload', (req, res) => {
  var id = req.query.id;
  var stuid = req.query.stu;
  //     var name = req.query.stu_name;
  var name = '熊子洵';
  console.log('/var/ftp/pub/' + id + '/' + stuid + '_' + name + '.pdf');
  res.download('/var/ftp/pub/1/181090918_熊子洵.pdf', 'D:/' + stuid + '_' + id + '_' + name + '_copy.pdf', function (err) {
    if (err) {
      console.log('远程不存在或者本地文件丢失');
      console.log(new Date());
      res.send('远程不存在或者本地文件丢失');
    }
    else {
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

  console.log('学号:' + mysid);
  console.log('作业id号码:' + myid);
  console.log('学生姓名:' + myname);
  console.log('文件后缀:' + mylas);
  var des_file = "/var/ftp/pub/" + myid + "/" + mysid + "_" + myname + ".docx"; //文件名
  var des_2 = "/var/ftp/pub/" + myid ;
  console.log('目标地址: ' + des_file);
  console.log('pdf地址:'+des_2);
  fs.exists("/var/ftp/pub/" + myid, function (exists) {
    var my_cnt = "0";
    if (exists) {

      fs.readFile(req.files[0].path, function (err, data) { // 异步读取文件内容

        fs.writeFile(des_file, data, function (err) { // des_file是文件名，data，文件数据，异步写入到文件
          if (err) {
            console.log(err);
          } else {
            console.log('libreoffice --headless --convert-to pdf '+des_file+' --outdir '+des_2)
            cp.exec('libreoffice --headless --convert-to pdf '+des_file+' --outdir '+des_2,function(err,stdout,stderr){
              if(err){
                  console.error(err);
              }
              pdftk.input("/var/ftp/pub/" + myid + "/" + mysid + "_" + myname + ".pdf").stamp("/var/ftp/pub/watermark/w1.pdf").output("/var/ftp/pub/" + myid + "/" + mysid + "_" + myname + ".pdf").then(buffer => { return console.log('success'); }).catch(err => {
                console.error(err);
              });
              response = {
                message: 'File uploaded successfully',
                filename: req.files[0].originalname,
                count: my_cnt
              };
              cp.exec("pdftotext " + "/var/ftp/pub/" + myid + "/" + mysid + "_" + myname + ".pdf" + " /var/ftp/pub/temp.txt", function (err, stdout, stderr) {
                if (err) {
                  console.error(err);
                }
              });
              fs.readFile('/var/ftp/pub/temp.txt','utf-8',function(err,data){
                  if(err){
                      console.error(err);
                  }
                  else{
                      data=data.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""); 
                      fs.writeFile('/var/ftp/pub/temp.txt', data, function (err){
                        cp.exec("echo |wc -c /var/ftp/pub/temp.txt", function (err, stdout, stderr) {
                          if (err) {
                            console.error(err);
                          }
                          my_cnt = stdout.trim().split(" ")[0];
          //                 var temp_cnt = parseInt(my_cnt);
          //                 my_cnt = ""+temp_cnt;
                          console.log('共计:' + my_cnt);
                          response = {
                            message: 'File uploaded successfully',
                            filename: req.files[0].originalname,
                            count: my_cnt
                          };
                          SQLupdate(1, my_cnt);
                          console.log(response);
                          res.end(JSON.stringify(response));
                        });
                      })
                  }
              });
              
  
          });
            
            // 文件上传成功，respones给客户端

          }

          //                 console.log( response );
          //                 res.end( JSON.stringify( response ) );
        });
      });
    } else {
      fs.mkdir("/var/ftp/pub/" + myid, function (err) {
        if (err) {
          throw err;
        }
        else {
          console.log('创建成功');
          fs.readFile(req.files[0].path, function (err, data) {  // 异步读取文件内容
            fs.writeFile(des_file, data, function (err) { // des_file是文件名，data，文件数据，异步写入到文件
              if (err) {
                console.log(err);
              } else {
                // 文件上传成功，respones给客户端
                pdftk.input(des_file).stamp("/var/ftp/pub/watermark/w1.pdf").output(des_file).then(buffer => { return console.log('success'); }).catch(err => {
                  console.error(err);
                });
                response = {
                  message: 'File uploaded successfully',
                  filename: req.files[0].originalname,
                  count: my_cnt
                };

                cp.exec("pdftotext " + des_file + " /var/ftp/pub/temp.txt", function (err, stdout, stderr) {
                  if (err) {
                    console.error(err);
                  }
                });

                cp.exec("echo |wc -m /var/ftp/pub/temp.txt", function (err, stdout, stderr) {
                  if (err) {
                    console.error(err);
                  }
                  my_cnt = stdout.trim().split(" ")[0];
                  console.log('共计:' + my_cnt);
                  response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname,
                    count: my_cnt
                  };
                  console.log(response);
                  res.end(JSON.stringify(response));
                });
              }

            })
          });
          //                     console.log( response );
          //                     res.end( JSON.stringify( response ) );

        };

      });
    }
  })
})



module.exports = router;
