const config = require('./sqlConfig')
const mysql = require('mysql');
const { querySql } = require('./index')

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function findUserByOid (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_user where openid = '" + openid + "'", function (err, results) {
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

function updatePetition (openid, img) {
  querySql("select petition_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    console.log(!!res[0].petition_pic)
    if (!!res[0].petition_pic) {
      result = res[0].petition_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let str = result.join(";")
    await querySql("update tb_user set petition_pic='" + str + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*管理系统*/

function findUserByName (name) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_admin where name='" + name + "'", function (err, results) {
        if (err) {
          reject(e)
        } else {
          resolve(results)
        }
      })
    } catch (err) {
      reject(err)
    } finally {
      conn.end()
    }
  })
}
module.exports = {
  findUserByOid,
  updatePetition,
  findUserByName
}