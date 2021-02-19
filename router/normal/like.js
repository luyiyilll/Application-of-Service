const express = require('express')
const router = express()

const { querySql } = require('../../sql/index')
const { likeAction } = require('../../sql/normal/likesql')

router.post('/like', function (req, res) {
  likeAction(req.body.id, req.body.openid).then(response => {
    res.json({
      code: 1,
      msg: '查询成功',
      data: response
    })
  })

})

module.exports = router
