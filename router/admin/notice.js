const express = require('express')
const router = express()

const { getList, getContentById } = require('../../sql/normal/noticesql')
const { getFromatTime } = require('../../utils/constant')

/*根据id删除通知 会议 公式*/
router.post('/delete', function (req, res) {
  let token = req.headers['x-token'];// 从Authorization中获取token
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {  //时间失效的时候 || 伪造的token
      res.send({ code: 0, msg: 'token已失效' });
    } else {
      deleteById(req.body.id).then(response => {
        res.json({
          code: 2000,
          msg: '删除成功',
          data: response
        })
      })

    }
  })
})

module.exports = router
