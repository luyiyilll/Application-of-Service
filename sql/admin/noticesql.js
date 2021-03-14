
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

function deleteById (id) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("delete from tb_meetting_notice where id = '" + id + "'", function (err, results) {
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

function addContent (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let sql;
      sql = "insert into tb_meetting_notice(title,place,time,content,postdate,type,tips,publisher) values('" + o.title + "','" + o.place + "','" + o.time + "','" + o.desc + "','" + o.postdate + "','" + o.type + "','" + o.tips + "','" + o.publisher + "')"
      conn.query(sql, function (err, results) {
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


function getListByType (type) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let sql;
      sql = "select * from tb_meetting_notice where type='" + type + "' order by time desc)"
      conn.query(sql, function (err, results) {
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
  deleteById,
  addContent,
  getListByType
}