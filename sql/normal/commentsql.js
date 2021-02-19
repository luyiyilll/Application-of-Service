const config = require('../sqlConfig')
const mysql = require('mysql');
const { getFromatTime } = require("../../utils/constant")

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function addComment (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let date = new Date();
      let postdate = getFromatTime(date)
      conn.query("insert into tb_comment set otherid='" + o.id + "',postdate='" + postdate + "',content='" + o.content + "',publisher='" + o.openid + "'", function (err, results) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      conn.end
    }
  })
}



module.exports = {
  addComment
}