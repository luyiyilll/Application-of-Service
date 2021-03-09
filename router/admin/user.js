const express = require('express');
const router = express.Router();
const {
  Login,
  getUncheck,
  handleUnCheck,
  getCheckedList,
  deleteUserById,
  viewUserById,
  deletePicByName
} = require('../../sql/admin/usersql')
const {
  uploadPetition,
  uploadFamily,
  uploadResume,
  uploadStatement,
  uploadExcellent,
  uploadCertifate,
  uploadNormal,
  uploadApplybook,
  uploadTonormal,
} = require('../../sql/normal/usersql');
const { secretOrPrivateKey } = require('../../utils/config')
const jwt = require('jsonwebtoken')
const { getIdentity, getApplyStatus, getApply, getPicArray } = require('../../utils/constant')

const fs = require('fs')
const { picPath } = require('../../utils/config')
let path = require('path')

/*图片处理*/
const multer = require('multer')
const upload = multer({ dest: "temp/" })

/*登录*/
router.post('/login', function (req, res) {
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
router.post('/uncheck', function (req, res) {
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
router.post('/handleuncheck', function (req, res) {
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
router.post('/checked', function (req, res) {
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

/*根据id删除用户信息*/
router.post('/delete', function (req, res) {
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

/*根据id查询用户信息*/

router.post('/userinfo', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      viewUserById(req.body.id).then(response => {
        response = response[0];
        let info = {
          id: response.id,
          nick_name: response.nick_name,
          avatar: response.avatar,
          realname: response.realname,
          IDcode: response.IDcode,
          tel: response.tel,
          birthday: response.birthday ? (new Date(response.birthday).getFullYear() + '-' + (new Date(response.birthday).getMonth() + 1) + '-' + new Date(response.birthday).getDate()) : response.birthday,
          apply_postdate: response.apply_postdate ? (new Date(response.apply_postdate).getFullYear() + '-' + (new Date(response.apply_postdate).getMonth() + 1) + '-' + new Date(response.apply_postdate).getDate()) : response.apply_postdate,
          active_postdate: response.active_postdate ? (new Date(response.active_postdate).getFullYear() + '-' + (new Date(response.active_postdate).getMonth() + 1) + '-' + new Date(response.active_postdate).getDate()) : response.active_postdate,
          dev_postdate: response.dev_postdate ? (new Date(response.dev_postdate).getFullYear() + '-' + (new Date(response.dev_postdate).getMonth() + 1) + '-' + new Date(response.dev_postdate).getDate()) : response.dev_postdate,
          pre_postdate: response.pre_postdate ? (new Date(response.pre_postdate).getFullYear() + '-' + (new Date(response.pre_postdate).getMonth() + 1) + '-' + new Date(response.pre_postdate).getDate()) : response.pre_postdate,
          tonormal_postdate: response.tonormal_postdate ? (new Date(response.tonormal_postdate).getFullYear() + '-' + (new Date(response.tonormal_postdate).getMonth() + 1) + '-' + new Date(response.tonormal_postdate).getDate()) : response.tonormal_postdate,
          gender: response.gender,
          grade: response.grade,
          academic: response.academic,
          major: response.major,
          department: response.department,
          identity: getIdentity(response.identity),
          petition_pic: getPicArray(response.petition_pic),
          family_pic: getPicArray(response.family_pic),
          resume_pic: getPicArray(response.resume_pic),
          statement_pic: getPicArray(response.statement_pic),
          excellent_pic: getPicArray(response.excellent_pic),
          certifate_pic: getPicArray(response.certifate_pic),
          normal_pic: getPicArray(response.normal_pic),
          applybook_pic: getPicArray(response.applybook_pic),
          tonormal_pic: getPicArray(response.tonormal_pic)
        }
        res.json({
          code: 20000,
          msg: '操作成功',
          data: info
        })
      })
    }
  })
})


/*入党申请 上传图片*/
router.post('/apppic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      let pics = [];

      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        pics.push(newName)
      }
      console.log('pics-----', pics)
      uploadPetition(req.headers['id'], pics)
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*家庭成员及主要社会关系材料 上传图片*/
router.post('/familypic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadFamily(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*个人履历材料 上传图片*/
router.post('/resumepic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadResume(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})


/*个人自传材料 上传图片*/
router.post('/statementpic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadStatement(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*团员推优及民主评议 上传图片*/
router.post('/excellentpic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadExcellent(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})


/*入党积极分子党课结业证书材料 上传图片*/
router.post('/certifatepic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadCertifate(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})


/*两位正式党员介绍人材料 上传图片*/
router.post('/normalpic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadNormal(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*上传入党志愿书材料照片 上传图片*/
router.post('/applybookpic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadApplybook(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*上传转正申请书材料照片 上传图片*/
router.post('/tonormalpic', multer(upload).array('file', 10), function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let files = req.files;
      for (var i in files) {
        var file = files[i];
        var tmp = file.path;//获取临时资源
        let ext = path.extname(file.originalname);//利用path模块获取 用户上传图片的 后缀名
        let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
        let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
        let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
        fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
        uploadTonormal(req.headers['id'], newName)
      }
      res.json({
        code: 20000,
        msg: '操作成功'
      })
    }
  })
})

/*根据照片名 和类型（0-9）删除图片*/
router.post('/deletepic', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {

      deletePicByName(req.body)
      res.json({
        code: 20000,
        msg: '删除成功'
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