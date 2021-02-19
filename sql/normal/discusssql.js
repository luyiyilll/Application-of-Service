const config = require('../sqlConfig')
const mysql = require('mysql');

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function findDiscussByOid (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT u.avatar,u.nick_name,d.id,d.title,d.postdate,d.content from tb_discuss d INNER JOIN tb_user u ON d.publisher=u.openid and d.publisher='" + openid + "'", function (err, results) {
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

function getAllDiscussList () {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT tb_discuss.*,(SELECT count(tb_views.otherid) FROM tb_views WHERE tb_discuss.id=tb_views.otherid AND tb_views.type=1) views,tb_user.avatar,tb_user.nick_name FROM tb_discuss LEFT JOIN tb_user ON tb_discuss.publisher=tb_user.openid ORDER BY postdate desc"
        , function (err, results) {
          if (err) {
            reject(err)
          } else {
            resolve(results)
          }
        })
    } catch (e) {
      reject(e)
    } finally {
      conn.end()
    }
  })
}

module.exports = {
  findDiscussByOid,
  getAllDiscussList
}