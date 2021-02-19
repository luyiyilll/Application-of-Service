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

/*收藏*/
function addCollect (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let date = new Date();
      let collect_time = getFromatTime(date)
      conn.query("insert into tb_collect(collector,otherid,time) values('" + o.openid + "','" + o.id + "','" + collect_time + "')", function (err, results) {
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

/*取消收藏*/
function deleteCollect (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("delete from tb_collect where collector='" + o.openid + "' and otherid='" + o.id + "'", function (err, results) {
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

/*根据id取消收藏*/
function deleteCollectById (id) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("delete from tb_collect where id='" + id + "'", function (err, results) {
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

/*根据openid获得收藏列表*/
function getListByOpenid (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT u.avatar,m.title,c.time,c.otherid,m.type from tb_collect c,tb_user u,tb_meetting_notice m WHERE c.collector='" + openid + "' AND u.openid='" + openid + "' AND m.id=c.otherid", function (err, results) {
        if (err) {
          reject(err)
        } else {
          let r = []
          results.forEach(item => {
            let o = {
              otherid: item.otherid,
              type: item.type,
              avatar: item.avatar,
              time: getFromatTime(item.time),
              title: item.title
            }
            r.push(o)
          })
          resolve(r)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      conn.end()
    }
  })
}

/*根据id和openid查看是否收藏*/
function getIsCollect (id, openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_collect where otherid='" + id + "' and collector='" + openid + "'", function (err, results) {
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

/*根据搜索关键字获取搜索列表*/
function getSearchWordList (keyword, openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT u.avatar,c.otherid,c.time,m.title,m.type from tb_collect c INNER JOIN tb_user u ON c.collector=u.openid INNER  JOIN tb_meetting_notice m ON c.collector='" + openid + "' and c.otherid=m.id AND m.title LIKE '%" + keyword + "%'", function (err, results) {
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

/*根据type和openid获取收藏列表*/
function getListByType (type, openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("SELECT u.avatar,c.otherid,c.time,m.title,m.type from tb_collect c INNER JOIN tb_user u ON c.collector=u.openid INNER  JOIN tb_meetting_notice m ON c.collector='" + openid + "' and c.otherid=m.id AND m.type='" + type + "'", function (err, results) {
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
  addCollect,
  deleteCollect,
  deleteCollectById,
  getListByOpenid,
  getIsCollect,
  getSearchWordList,
  getListByType
}