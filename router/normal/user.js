const express = require('express');
const config = require('./config.json');
const axios = require('axios');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const { getIdentity, getFromatTime, getFromatDate, getFroTime } = require('../../utils/constant')
const { querySql } = require('../../sql/index')
const { picPath } = require('../../utils/config')

/*图片处理*/
const multer = require('multer')
const upload = multer({ dest: "temp/" })

const {
  findUserByOid,
  uploadPetition,
  uploadFamily,
  uploadResume,
  uploadStatement,
  uploadExcellent,
  uploadCertifate,
  uploadNormal,
  uploadApplybook,
  uploadTonormal,
  getApplication
} = require('../../sql/normal/usersql');

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
        let result = r[0];
        result.petition_pic = r[0].petition_pic ? r[0].petition_pic.split(";") : r[0].petition_pic;
        result.family_pic = r[0].family_pic ? r[0].family_pic.split(";") : r[0].family_pic;
        result.resume_pic = r[0].resume_pic ? r[0].resume_pic.split(";") : r[0].resume_pic;
        result.statement_pic = r[0].statement_pic ? r[0].statement_pic.split(";") : r[0].statement_pic;
        result.excellent_pic = r[0].excellent_pic ? r[0].excellent_pic.split(";") : r[0].excellent_pic;
        result.certifate_pic = r[0].certifate_pic ? r[0].certifate_pic.split(";") : r[0].certifate_pic;
        result.normal_pic = r[0].normal_pic ? r[0].normal_pic.split(";") : r[0].normal_pic;
        result.applybook_pic = r[0].applybook_pic ? r[0].applybook_pic.split(";") : r[0].applybook_pic;
        result.tonormal_pic = r[0].tonormal_pic ? r[0].tonormal_pic.split(";") : r[0].tonormal_pic;
        let info = {
          openid: openid,
          nick_name: result.nick_name,
          avatar: result.avatar,
          realname: result.realname,
          IDcode: result.IDcode,
          tel: result.tel,
          birthday: result.birthday ? (new Date(result.birthday).getFullYear() + '-' + (new Date(result.birthday).getMonth() + 1) + '-' + new Date(result.birthday).getDate()) : result.birthday,
          apply_postdate: result.apply_postdate ? (new Date(result.apply_postdate).getFullYear() + '-' + (new Date(result.apply_postdate).getMonth() + 1) + '-' + new Date(result.apply_postdate).getDate()) : result.apply_postdate,
          active_postdate: result.active_postdate ? (new Date(result.active_postdate).getFullYear() + '-' + (new Date(result.active_postdate).getMonth() + 1) + '-' + new Date(result.active_postdate).getDate()) : result.active_postdate,
          dev_postdate: result.dev_postdate ? (new Date(result.dev_postdate).getFullYear() + '-' + (new Date(result.dev_postdate).getMonth() + 1) + '-' + new Date(result.dev_postdate).getDate()) : result.dev_postdate,
          pre_postdate: result.pre_postdate ? (new Date(result.pre_postdate).getFullYear() + '-' + (new Date(result.pre_postdate).getMonth() + 1) + '-' + new Date(result.pre_postdate).getDate()) : result.pre_postdate,
          tonormal_postdate: result.tonormal_postdate ? (new Date(result.tonormal_postdate).getFullYear() + '-' + (new Date(result.tonormal_postdate).getMonth() + 1) + '-' + new Date(result.tonormal_postdate).getDate()) : result.tonormal_postdate,
          gender: result.gender,
          grade: result.grade,
          academic: result.academic,
          major: result.major,
          department: result.department,
          is_agreen: result.is_agreen,
          identity: result.identity,
          is_check: result.is_check,
          is_pass: result.is_pass,
          is_apply: result.is_apply,
          petition_pic: result.petition_pic,
          family_pic: result.family_pic,
          resume_pic: result.resume_pic,
          statement_pic: result.statement_pic,
          excellent_pic: result.excellent_pic,
          certifate_pic: result.certifate_pic,
          normal_pic: result.normal_pic,
          applybook_pic: result.applybook_pic,
          tonormal_pic: result.tonormal_pic
        }
        res.json({
          info: info,
          code: 200,
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
  querySql(sql).then(response => {
    res.json({
      code: 200,
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
    code: 200,
    msg: '查询年级成功'
  })
})

/*上传用户信息*/
router.post('/info', function (req, res) {
  let user = req.body.user;
  let date = getFromatTime(new Date());
  let sql = "update tb_user set realname='" + user.realname + "',gender='" + user.gender + "',birthday='" + user.birthday + "',IDcode='" + user.IDcode + "',tel='" + user.tel + "',grade='" + user.grade + "',academic='" + user.academic + "',major='" + user.major + "',department='" + user.department + "',apply_postdate='" + date + "',is_apply=1 where openid='" + req.body.user.openid + "'";
  querySql(sql).then(response => {
    res.json({
      code: 200,
      msg: '更新用户信息成功'
    })
  })
})

/*根据openid获取用户信息*/
router.post('/user/id', function (req, res) {
  let openid = req.body.openid;
  findUserByOid(openid).then(response => {
    let user = response[0];
    user.petition_pic = response[0].petition_pic ? response[0].petition_pic.split(";") : response[0].petition_pic;
    user.family_pic = response[0].family_pic ? response[0].family_pic.split(";") : response[0].family_pic;
    user.resume_pic = response[0].resume_pic ? response[0].resume_pic.split(";") : response[0].resume_pic;
    user.statement_pic = response[0].statement_pic ? response[0].statement_pic.split(";") : response[0].statement_pic;
    user.excellent_pic = response[0].excellent_pic ? response[0].excellent_pic.split(";") : response[0].excellent_pic;
    user.certifate_pic = response[0].certifate_pic ? response[0].certifate_pic.split(";") : response[0].certifate_pic;
    user.normal_pic = response[0].normal_pic ? response[0].normal_pic.split(";") : response[0].normal_pic;
    user.applybook_pic = response[0].applybook_pic ? response[0].applybook_pic.split(";") : response[0].applybook_pic;
    user.tonormal_pic = response[0].tonormal_pic ? response[0].tonormal_pic.split(";") : response[0].tonormal_pic;
    res.json({
      user: user,
      code: 200,
      msg: '更新用户信息成功'
    })
  }).catch(e => {
    res.json({
      code: -1,
      msg: e
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
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  uploadPetition(req.headers['authori-zation'], newName)
  res.json({
    code: 200,
    msg: '上传成功'
  });
})

/*上传家庭成员及主要社会关系照片*/
router.post('/familypic', upload.single("file"), function (req, res) {
  let imgFile = req.file;//获取图片上传的资源
  var tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  uploadFamily(req.headers['authori-zation'], newName)
  res.json({
    code: 200,
    msg: '上传成功'
  });
})

/*上传履历材料*/
router.post('/resumepic', upload.single("file"), function (req, res) {
  let imgFile = req.file;//获取图片上传的资源
  var tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  uploadResume(req.headers['authori-zation'], newName)
  res.json({
    code: 200,
    msg: '上传成功'
  });
})

/*上传自传材料*/
router.post('/statementpic', upload.single("file"), function (req, res) {
  let imgFile = req.file;//获取图片上传的资源
  var tmp = imgFile.path;//获取临时资源
  let ext = path.extname(imgFile.originalname);//利用path模块获取 用户上传图片的 后缀名
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;  //给用户上传的图片重新命名 防止重名
  let newPath = picPath + newName; //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
  let fileData = fs.readFileSync(tmp);//将上传到服务器上的临时资源 读取到 一个变量里面
  fs.writeFileSync(path.join(__dirname, newPath), fileData);//重新书写图片文件  写入到指定的文件夹下
  uploadStatement(req.headers['authori-zation'], newName)
  res.json({
    code: 200,
    msg: '上传成功'
  });
})

/*团员推优及民主评议*/
router.post('/excellentpic', upload.single("file"), function (req, res) {
  let imgFile = req.file;
  let tmp = imgFile.path;
  let ext = path.extname(imgFile.originalname);
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
  let newPath = picPath + newName;
  let fileData = fs.readFileSync(tmp);
  fs.writeFileSync(path.join(__dirname, newPath), fileData);
  uploadExcellent(req.headers['authori-zation'], newName)
  res.json({
    code: 200,
    msg: "上传成功"
  })
})

/*入党积极分子党课结业证书材料*/
router.post('/certifatepic', upload.single('file'), function (req, res) {
  let imgFile = req.file;
  let tmp = imgFile.path;
  let ext = path.extname(imgFile.originalname);
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
  let newPath = picPath + newName;
  let fileData = fs.readFileSync(tmp);
  fs.writeFileSync(path.join(__dirname, newPath), fileData);
  uploadCertifate(req.headers['authori-zation'], newName);
  res.json({
    code: 200,
    msg: "上传成功"
  })
})

/*两位正式党员介绍人材料*/
router.post('/normalpic', upload.single('file'), function (req, res) {
  let imgFile = req.file;
  let tmp = imgFile.path;
  let ext = path.extname(imgFile.originalname);
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
  let newPath = picPath + newName;
  let fileData = fs.readFileSync(tmp);
  fs.writeFileSync(path.join(__dirname, newPath), fileData);
  uploadNormal(req.headers['authori-zation'], newName);
  res.json({
    code: 200,
    msg: "上传成功"
  })
})

/*上传入党志愿书材料照片*/
router.post('/applybookpic', upload.single('file'), function (req, res) {
  let imgFile = req.file;
  let tmp = imgFile.path;
  let ext = path.extname(imgFile.originalname);
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
  let newPath = picPath + newName;
  let fileData = fs.readFileSync(tmp);
  fs.writeFileSync(path.join(__dirname, newPath), fileData);
  uploadApplybook(req.headers['authori-zation'], newName);
  res.json({
    code: 200,
    msg: "上传成功"
  })
})

/*上传转正申请书材料照片*/
router.post('/tonormalpic', upload.single('file'), function (req, res) {
  let imgFile = req.file;
  let tmp = imgFile.path;
  let ext = path.extname(imgFile.originalname);
  let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
  let newPath = picPath + newName;
  let fileData = fs.readFileSync(tmp);
  fs.writeFileSync(path.join(__dirname, newPath), fileData);
  uploadTonormal(req.headers['authori-zation'], newName);
  res.json({
    code: 200,
    msg: "上传成功"
  })
})


/*根据openid获取用户申请*/
router.post('/application', function (req, res) {
  let result;
  getApplication(req.body.openid).then(response => {
    if (response.identity == 0 && response.is_apply == 0) {
      result = [];
    } else {
      let apply_postdate = response.apply_postdate ? getFromatDate(response.apply_postdate) : response.apply_postdate;
      let apply_time = response.apply_postdate ? getFroTime(response.apply_postdate) : response.apply_postdate;
      let active_postdate = response.active_postdate ? getFromatDate(response.active_postdate) : response.active_postdate;
      let active_time = response.active_postdate ? getFroTime(response.active_postdate) : response.active_postdate;
      let dev_postdate = response.dev_postdate ? getFromatDate(response.dev_postdate) : response.dev_postdate;
      let dev_time = response.dev_postdate ? getFroTime(response.dev_postdate) : response.dev_postdate;
      let pre_postdate = response.pre_postdate ? getFromatDate(response.pre_postdate) : response.pre_postdate;
      let pre_time = response.pre_postdate ? getFroTime(response.pre_postdate) : response.pre_postdate;
      let tonormal_postdate = response.tonormal_postdate ? getFromatDate(response.tonormal_postdate) : response.tonormal_postdate;
      let tonormal_time = response.tonormal_postdate ? getFroTime(response.tonormal_postdate) : response.tonormal_postdate;
      switch (response.identity) {
        case 0:
          if (response.is_apply == 0) {
            result = []
          } else {
            if (response.is_check == 0) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "已提交" },
              ]
            } else if (response.is_check == 1) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
              ]
            } else {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核未通过" },
              ]
            }
          }
          break;
        case 1:
          if (response.is_apply == 0) {
            result = [
              { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核未通过" },
            ]
          } else {
            if (response.is_check == 0) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "已提交" },
              ]
            } else if (response.is_check == 1) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
              ]
            } else {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核未通过" },
              ]
            }
          }
          break;
        case 2:
          if (response.is_apply == 0) {
            result = [
              { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
              { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
            ]
          } else {
            if (response.is_check == 0) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "已提交" },
              ]
            } else if (response.is_check == 1) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
              ]
            } else {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核未通过" },
              ]
            }
          }
          break;
        case 3:
          if (response.is_apply == 0) {
            result = [
              { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
              { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
              { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核未通过" },
            ]
          } else {
            if (response.is_check == 0) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "已提交" },
              ]
            } else if (response.is_check == 1) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
              ]
            } else {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核未通过" },
              ]
            }
          }
          break;
        case 4:
          if (response.is_apply == 0) {
            result = [
              { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
              { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
              { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
              { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
            ]
          } else {
            if (response.is_check == 0) {
              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
                { date: tonormal_postdate, time: tonormal_time, title: '转正申请', status: "已提交" },
              ]
            } else if (response.is_check == 1) {

              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
                { date: tonormal_postdate, time: tonormal_time, title: '转正申请', status: "审核已通过" },
              ]
            } else {

              result = [
                { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
                { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
                { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
                { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
                { date: tonormal_postdate, time: tonormal_time, title: '转正申请', status: "审核未通过" },
              ]
            }
          }
          break;
        case 5:
          result = [
            { date: apply_postdate, time: apply_time, title: '入党申请', status: "审核已通过" },
            { date: active_postdate, time: active_time, title: '积极分子申请', status: "审核已通过" },
            { date: dev_postdate, time: dev_time, title: '发展对象申请', status: "审核已通过" },
            { date: pre_postdate, time: pre_time, title: '预备党员申请', status: "审核已通过" },
            { date: tonormal_postdate, time: tonormal_time, title: '转正申请', status: "审核已通过" },
          ]
          break;
      }
    }

    res.json({
      data: result,
      code: 200,
      msg: "查询成功"
    })
  }).catch(e => {
    res.json({
      code: -1,
      msg: "查询失败"
    })
  })

})

module.exports = router