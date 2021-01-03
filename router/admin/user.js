const express = require('express');
const router = express.Router();
const { findUserByName } = require('../../sql/usersql')

const { secretOrPrivateKey } = require('../../utils/config')
const jwt = require('jsonwebtoken')

router.post('/user/login', function (req, res) {
  const { username, password } = req.body;
  console.log(req.body)
  findUserByName(username).then(response => {
    if (response.length == 0) {
      res.json({
        code: -1,
        msg: '该用户不存在'
      })
    } else {
      if (response[0].password == password) {
        console.log(response[0])
        let content = { username: username };
        let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 3600//1小时过期
        })
        res.json({
          token: token,
          code: 20000,
          msg: '登录成功'
        })
      }
    }
  })
})

router.get('/user/info', function (req, res) {
  console.log(req.body)
  let token = req.get("Authorization"); // 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      res.json({
        code: 20000,
        msg: '查询成功'
      })
    }
  })

})


//其他接口验证
//前端将token存储在loacalStorage中  
//请求接口时放在请求头Authorization中携带
//后端通过读取Authorization获取前端传过来的token进行验证,验证通过再进行数据库操作
// router.get('/find',(req,res)=>{
// let token = req.get("Authorization"); // 从Authorization中获取token
//   jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
//       if (err) {  //时间失效的时候 || 伪造的token
//           res.send({code:0,msg:'token已失效'});
//       } else {
// 		User.find({}, function(error, result){
// 		    error? res.json({code:0,msg:'查询失败'}) : res.json({code:1,data:result})
// 		})
//       }
//   })
// })

module.exports = router