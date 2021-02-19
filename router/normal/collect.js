const express = require('express')
const router = express()

const { querySql } = require('../../sql/index')
const {
  addCollect,
  deleteCollect,
  deleteCollectById,
  getListByOpenid,
  getIsCollect,
  getSearchWordList,
  getListByType
} = require('../../sql/normal/collectsql')

/*收藏*/
router.post('/collect', function (req, res) {
  let o = {
    id: req.body.id,
    openid: req.body.openid
  }
  addCollect(o).then(response => {
    res.json({
      code: 1,
      msg: '收藏成功',
    })
  })
})

/*取消收藏*/
router.post('/deletecollect', function (req, res) {
  let o = {
    id: req.body.id,
    openid: req.body.openid
  }
  deleteCollect(o).then(response => {
    res.json({
      code: 1,
      msg: '已经取消收藏',
    })
  })
})

/*根据id取消收藏*/
router.post('/cancel', function (req, res) {
  let id = req.body.id;
  deleteCollectById(id).then(response => {
    res.json({
      code: 1,
      msg: '取消收藏成功',
    })
  })
})

/*获取收藏列表*/
router.post('/list', function (req, res) {
  getListByOpenid(req.body.openid).then(response => {
    res.json({
      code: 1,
      msg: '查询成功',
      data: response
    })
  })
})

/*根据id和openid查看是否收藏*/
router.post('/iscollect', function (req, res) {
  getIsCollect(req.body.keyword, req.body.openid).then(response => {
    if (response.length != 0) {
      res.json({
        code: 1,
        msg: '已收藏',
        data: response
      })
    } else {
      res.json({
        code: -1,
        msg: '没有收藏',
        data: response
      })
    }
  })
})

/*根据搜索关键字获取收藏列表*/
router.post('/searchlist', function (req, res) {
  getSearchWordList(req.body.keyword, req.body.openid).then(response => {
    res.json({
      code: 1,
      msg: '查询成功',
      data: response
    })
  })
})

/*根据类型和openid获取收藏列表*/
router.post('/typelist', function (req, res) {
  getListByType(req.body.type, req.body.openid).then(response => {
    res.json({
      code: 1,
      msg: '查询成功',
      data: response
    })
  })
})
module.exports = router
