const express = require('express');
const config = require('./config.json');
const axios = require('axios');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const { getIdentity } = require('../../utils/constant')
const { querySql } = require('../../sql/index')
const { picPath } = require('../../utils/config')

/*图片处理*/
const formidable = require('formidable');

const multer = require('multer')
const upload = multer({ dest: "temp/" })

const { updatePetition, findUserByOid } = require('../../sql/usersql');

/*如果用户存在，返回用户信息，不存在，返回openid*/
router.post('/openid', async function (req, res, next) {
  let openid;
  await axios.get('http://api.weixin.qq.com/sns/jscode2session?appid=' + config.appId + '&secret=' + config.appScrect + '&js_code=' + req.body.code + '&grant_type=authorization_code').then(response => {
    openid = response.data.openid
    querySql("select * from tb_user where openid='" + openid + "'").then(r => {
      if (r.length == 0) {
        res.json({
          openid: openid,
          code: 1,
          msg: '获取openid成功'
        })
      } else {
        r[0].identity = getIdentity(r[0].identity);
        let info = {
          openid: openid,
          nick_name: r[0].nick_name,
          avatar: r[0].avatar,
          realname: r[0].realname,
          IDcode: r[0].IDcode,
          tel: r[0].tel,
          birthday: new Date(r[0].birthday).getFullYear() + '-' + (new Date(r[0].birthday).getMonth() + 1) + '-' + new Date(r[0].birthday).getDate(),
          gender: r[0].gender,
          grade: r[0].grade,
          academic: r[0].academic,
          major: r[0].major,
          department: r[0].department,
          is_agreen: r[0].is_agreen,
          identity: r[0].identity,
          is_check: r[0].is_check,
          is_pass: r[0].is_pass,
          is_apply: r[0].is_apply,
          petition_pic: r[0].petition_pic,
          faimly_pic: r[0].faimly_pic,
          resume_pic: r[0].resume_pic,
          statement_pic: r[0].statement_pic,
          excellent_pic: r[0].excellent_pic,
          certifate_pic: r[0].certifate_pic,
          normal_pic: r[0].normal_pic,
          applybook_pic: r[0].applybook_pic,
          tonormal_pic: r[0].tonormal_pic
        }
        res.json({
          info: info,
          code: 1,
          msg: '登录成功'
        })
      }
    })
  }).catch(e => {
    res.json({
      code: -1,
      msg: '登录失败'
    })
  })
})

/*注册用户*/
router.post('/adduser', function (req, res) {
  let sql = "insert into tb_user(openid,nick_name,avatar,gender,identity,is_apply,is_check,is_pass) values('" + req.body.openid + "','" + req.body.nick_name + "','" + req.body.avatarurl + "','" + req.body.gender + "', 0,0,0,0)"
  console.log(req.body)
  querySql(sql).then(response => {
    res.json({
      code: 1,
      msg: '添加成功'
    })
  }).catch(e => {
    res.json({
      code: -2,
      msg: '添加失败'
    })
  })
})

/*获取年级*/
router.get('/grade', function (req, res) {
  let now = new Date()
  let nowyear = now.getUTCFullYear()
  let grade = [nowyear]
  for (let i = 0; i < 3; i++) {
    nowyear--;
    grade.push(nowyear)
  }
  res.json({
    data: grade,
    code: 1,
    msg: '更新用户信息成功'
  })
})

/*上传用户信息*/
router.post('/info', function (req, res) {
  let user = req.body.user;
  let sql = "update tb_user set realname='" + user.realname + "',gender='" + user.gender + "',birthday='" + user.birthday + "',IDcode='" + user.IDcode + "',tel='" + user.tel + "',grade='" + user.grade + "',academic='" + user.academic + "',major='" + user.major + "',department='" + user.department + "',identity=1, is_apply=1 where openid='" + req.body.user + "'";
  querySql(sql).then(response => {
    res.json({
      code: 1,
      msg: '更新用户信息成功'
    })
  })
})

/*根据openid获取用户信息*/
router.post('/user/id', function (req, res) {
  let openid = req.body.openid;
  findUserByOid(openid).then(response => {
    response[0].identity = getIdentity(response[0].identity);
    // response[0].birthday = response[0].birthday.getFullYear() + '-' + (response[0].birthday.getMonth() + 1) + '-' + response[0].birthday.getDate()
    res.json({
      user: response[0],
      code: 1,
      msg: '更新用户信息成功'
    })
  })
})

/*上传用户入党申请书*/
router.post('/petitionpic', upload.single("file"), function (req, res) {
  let imgFile = req.file;//获取图片上传的资源
  var tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  console.log("--------------", newName)
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  updatePetition(req.headers['authori-zation'], newName)
  res.json({
    code: 1,
    msg: '上传成功'
  });
})
/*上传用户入党申请书*/
router.post('/familypic', upload.single("file"), function (req, res) {
  let imgFile = req.file;//获取图片上传的资源
  var tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  let result = updatePetition(req.headers['authori-zation'], newName)
  res.json({
    code: 1,
    msg: '上传成功'
  });
})
module.exports = router