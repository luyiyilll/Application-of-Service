const express = require('express')
const router = express()

const { querySql } = require('../../sql/index')
const { addComment } = require('../../sql/normal/commentsql')

/*根据id和type添加评论*/
router.post('/comment', function (req, res) {
  let o = {
    openid: req.body.openid,
    id: req.body.id,
    type: req.body.type,
    content: req.body.content

  }
  addComment(o).then(response => {
    res.json({
      code: 200,
      msg: '评论成功'
    })
  })
})


module.exports = router