const express = require('express');
const router = express.Router();
const { Login, getUncheck, handleUnCheck, getCheckedList, deleteUserById } = require('../../sql/admin/usersql')

const { secretOrPrivateKey } = require('../../utils/config')
const jwt = require('jsonwebtoken')

const { getIdentity, getApplyStatus, getApply } = require('../../utils/constant')

/*登录*/
router.post('/user/login', function (req, res) {
  const { username, password } = req.body;
  Login(username, password).then(response => {
    if (response.length == 0) {
      res.json({
        code: -1,
        msg: '该用户不存在'
      })
    } else {
      let user = {
        username: response[0].username,
        avatar: response[0].avatar,
        roles: response[0].roles
      }
      let content = { username: username };
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 3600//1小时过期
      })
      res.json({
        token: token,
        user,
        code: 20000,
        msg: '登录成功'
      })
    }
  })
})

// router.get('/user/list', function (req, res) {
//   // let token = req.get("Authorization"); // 从Authorization中获取token
//   // jwt.verify(token, secretOrPrivateKey, (err, decode) => {
//   //   if (err) {  //时间失效的时候 || 伪造的token
//   //     res.send({ code: 0, msg: 'token已失效' });
//   //   } else {
//   getUserList().then(response => {
//     let r = []
//     response.forEach(item => {
//       let o = {
//         id: item.id,
//         grade: item.grade ? item.grade : '暂无',
//         name: item.realname ? item.realname : '暂无',
//         identity: getIdentity(item.identity),
//         academic: item.academic ? item.academic : '暂无',
//         major: item.major ? item.major : '暂无',
//         apply: getApply(item.identity, item.is_apply),
//         status: getApplyStatus(item.identity, item.is_apply, item.is_check)
//       }
//       r.push(o)
//     })
//     res.json({
//       code: 20000,
//       msg: '查询成功',
//       data: r
//     })
//   })

//   //   }
//   // })

// })

/*获取未审核的用户列表*/
router.post('/user/uncheck', function (req, res) {
  let token = req.headers['x-token']; // 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      getUncheck(req.body).then(response => {
        let r = []
        response.forEach(item => {
          let o = {
            id: item.id,
            nick_name: item.nick_name,
            grade: item.grade,
            name: item.realname,
            identity: item.identity,
            academic: item.academic,
            major: item.major,
            applytype: getApply(item.identity, item.is_apply),
            check: getApplyStatus(item.identity, item.is_apply, item.is_check)
          }
          r.push(o)
        })
        res.json({
          data: r,
          code: 20000,
          msg: '查询成功'
        })
      })

    }
  })

})


/*根据type处理未审核的用户列表*/
router.post('/user/handleuncheck', function (req, res) {
  let token = req.headers['x-token']; // 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      handleUnCheck(req.body).then(response => {
        res.json({
          code: 20000,
          msg: '操作成功'
        })
      })
    }
  })
})

/*获取审核通过 审核未通过的用户列表*/
router.post('/user/checked', function (req, res) {
  let token = req.headers['x-token']; // 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      getCheckedList(req.body).then(response => {
        let r = []
        response.forEach(item => {
          let o = {
            id: item.id,
            grade: item.grade,
            name: item.realname,
            identity: getIdentity(item.identity),
            academic: item.academic,
            major: item.major,
          }
          r.push(o)
        })
        res.json({
          data: r,
          code: 20000,
          msg: '查询成功'
        })
      })
    }
  })
})

router.post('/user/delete', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      deleteUserById(req.body.id).then(response => {
        res.json({
          code: 20000,
          msg: '操作成功'
        })
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