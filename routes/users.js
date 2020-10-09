var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*test ger request*/ 
router.get("/hi",(req, res)=>{
  res.send('hi too!');
});

router.post("/",(req, res)=>{
  console.log("收到请求: ", req.body);
  res.status(201).send();
});



module.exports = router;
