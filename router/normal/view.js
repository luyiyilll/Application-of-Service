const express = require('express')
const router = express()

const { querySql } = require('../../sql/index')
const { addViewById, getViewListByOpenid } = require('../../sql/normal/viewsql')

/*添加浏览记录*/
router.post('/view', function (req, res) {
  let id = req.body.id;
  let type = req.body.type
  let openid = req.body.openid;
  addViewById(id, type, openid).then(response => {
    res.json({
      code: 1,
      msg: '浏览成功',
    })
  })
})

/*根据openid获取浏览列表*/
router.post('/list', function (req, res) {
  let openid = req.body.openid;
  getViewListByOpenid(openid).then(response => {
    res.json({
      code: 1,
      msg: '浏览成功',
      data: response
    })
  })
})

module.exports = router
