var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer  = require('multer');





var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var connectRouter = require('./routes/connect');


var app = express();
//改写默认路由
var http = require('http');
var server = http.createServer(app);

//修改模板引擎
var ejs = require('ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
 
app.engine('.html', ejs.__express) // 设置视图引擎后缀，为.html
 
app.set('view engine', 'html'); // 设置视图引擎为html

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('file'));

app.use('/',loginRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/connect',connectRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.post('/file_upload', function (req, res) {
 
   console.log(req.files[0]);  // 上传的文件信息
 
   var des_file = __dirname + "/" + req.files[0].originalname; //文件名
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

module.exports = app;
