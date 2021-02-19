const config = require('../sqlConfig')
const mysql = require('mysql');
const { getFromatTime } = require('../../utils/constant')

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

/*添加浏览记录*/
function addViewById (id, type, openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let date = new Date();
      let viewtime = getFromatTime(date)
      conn.query("insert into tb_views(otherid,type,viewer,viewtime) values('" + id + "','" + type + "','" + openid + "','" + viewtime + "')", function (err, results) {
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

/*根据openid获取最近浏览列表*/
function getViewListByOpenid (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT DISTINCT v.otherid,v.type,v.viewtime,m.title title1,d.title title2,u.nick_name,u.avatar from tb_views v LEFT JOIN tb_meetting_notice m ON m.id=v.otherid AND v.type=0 LEFT JOIN tb_discuss d ON v.otherid=d.id AND v.type=1 LEFT JOIN tb_user u ON m.publisher=u.openid OR d.publisher=u.openid WHERE viewer='" + openid + "' GROUP BY v.otherid,v.type ORDER BY v.viewtime desc"
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
  addViewById,
  getViewListByOpenid
}