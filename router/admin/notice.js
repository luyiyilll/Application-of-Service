const express = require('express')
const router = express()


const { secretOrPrivateKey } = require('../../utils/config')
const jwt = require('jsonwebtoken')


var fs = require("fs");
const multiparty = require('multiparty');// 引入导入模块

const { deleteById, addContent } = require('../../sql/admin/noticesql')
const { getFromatTime } = require('../../utils/constant')

/*根据类型获取列表*/
router.post('/list', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      getListByType(req.body.type).then(response => {
        res.json({
          code: 200,
          msg: '删除成功',
          data: response
        })
      })
    }
  })
})

/*根据id删除通知 会议 公式*/
router.post('/delete', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      deleteById(req.body.id).then(response => {
        res.json({
          code: 200,
          msg: '删除成功',
          data: response
        })
      })
    }
  })
})

/*添加*/
router.post('/add', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      console.log(req.body)
      addContent(req.body).then(response => {
        res.json({
          code: 200,
          msg: '删除成功',
          data: response
        })
      })
    }
  })
})

//上传文件
router.post('/announce/upload', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      let form = new multiparty.Form();
      form.encoding = 'utf-8';
      form.uploadDir = '../../public/file';//设置文件存储路劲
      form.keepExtensions = true//保留后缀名
      form.multiples = true//接收文件为一个数组
      // form.maxFilesSize = 1 * 1024 * 1024; //设置文件大小限制
      form.parse(req, function (err, fields, files) {
        try {
          console.log(req.body)
          console.log(fields)
          console.log('-----');
          console.log(files)
          // let inputFile = files.file[0];
          // let uploadedPath = inputFile.path;
          // let newPath = form.uploadDir + "/" + inputFile.originalFilename;
          // //同步重命名文件名 fs.renameSync(oldPath, newPath)
          // fs.renameSync(inputFile.path, newPath);
          res.json({
            code: 200,
            msg: '上传成功',
          })
          //读取数据后 删除文件
          // fs.unlink(newPath, function () {
          //   console.log("删除上传文件");
          // })
        } catch (err) {
          console.log(err);
          res.json({
            code: 200,
            msg: '上传失败',
          })
        };
      })


    }
  })
})

module.exports = router
