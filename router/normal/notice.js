const express = require('express')
const router = express()

const { getList, getContentById } = require('../../sql/normal/noticesql')
const { getFromatTime } = require('../../utils/constant')

/*根据type获取通知 会议 公式列表*/
router.post('/list', function (req, res) {
  getList(req.body.type).then(response => {
    let result = []
    response.forEach(item => {
      let o = {
        id: item.id,
        desc: item.desc,
        place: item.place,
        postdate: getFromatTime(item.postdate),
        time: item.time,
        title: item.title,
      }
      result.push(o)
    })
    res.json({
      code: 20000,
      msg: '查询成功',
      data: result
    })
  })
})

/*根据id获取具体通知 会议 公式*/
router.post('/id', function (req, res) {
  getContentById(req.body.id).then(response => {
    res.json({
      code: 20000,
      msg: '查询成功',
      data: response[0]
    })
  })
})

module.exports = router
