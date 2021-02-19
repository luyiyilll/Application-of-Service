const config = require('../sqlConfig')
const mysql = require('mysql');
const { getApplyId, getIdentityId } = require('../../utils/constant')

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function Login (username, password) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_admin where username = '" + username + "' and password='" + password + "'", function (err, results) {
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

function getUncheck (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let sql = "";
      let sWehere = ""
      if (o.academic != "") {
        sWehere = "academic='" + o.academic + "' and "
      }
      if (o.applytype != "") {
        let obj = getApplyId(o.applytype);
        sWehere += "is_apply=" + obj.is_apply + " and identity=" + obj.status + " and "
      }
      if (o.grade != "") {
        sWehere += "grade=" + o.grade + " and "
      }
      if (o.major != "") {
        sWehere += "major='" + o.major + "' and "
      }
      if (o.name != '') {
        sWehere += "realname like'%" + o.name + "%'"
      }
      if (sWehere != "" && (sWehere.slice(-4)).trim() == 'and') {
        sWehere = sWehere.slice(0, -4);
      }
      if (sWehere == "") {
        sql = "select * from tb_user where is_apply=1 and is_check=0"
      } else {
        sql = "select * from tb_user where is_check=0 and " + sWehere
      }
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

function handleUnCheck (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let type = o.type;
      let id = o.id;
      let identity = o.identity
      let sql;
      if (type == 0) {
        sql = "update tb_user set is_apply=0,is_check=2 where id=" + id;
      } else if (type = 1) {
        sql = "update tb_user set is_apply=0,is_check=0,identity='" + (identity + 1) + "' where id='" + id + "'";
      } else {
        sql = "delete from tb_user where id='" + id + "'"
      }
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

/*获取审核通过 审核未通过的用户列表*/
function getCheckedList (o) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let sql = "";
      let sWehere = ""
      if (o.type == 0) {
        if (o.grade != "") {
          sWehere += "grade=" + o.grade + " and "
        }
        if (o.academic != "") {
          sWehere = "academic='" + o.academic + "' and "
        }
        if (o.major != "") {
          sWehere += "major='" + o.major + "' and "
        }
        if (o.identity != "") {
          sWehere += "is_check=2 and identity=" + getIdentityId(o.identity) + " and "
        } else {
          if (o.applytype != "") {
            let obj = getApplyId(o.applytype);
            sWehere += "is_check=2 and identity>" + obj.status + " and "
          }
        }
        if (o.name != '') {
          sWehere += "realname like'%" + o.name + "%'"
        }
        if (sWehere != "" && (sWehere.slice(-4)).trim() == 'and') {
          sWehere = sWehere.slice(0, -4);
        }
        if (sWehere == "") {
          sql = "select * from tb_user where identity!=0 and is_check=2"
        } else {
          sql = "select * from tb_user where " + sWehere
        }
      } else {
        if (o.grade != "") {
          sWehere += "grade=" + o.grade + " and "
        }
        if (o.academic != "") {
          sWehere = "academic='" + o.academic + "' and "
        }
        if (o.major != "") {
          sWehere += "major='" + o.major + "' and "
        }
        if (o.identity != "") {
          sWehere += "is_check!=2 and identity=" + getIdentityId(o.identity) + " and "
        } else {
          if (o.applytype != "") {
            let obj = getApplyId(o.applytype);
            sWehere += "is_check!=2 and identity>" + obj.status + " and "
          }
        }
        if (o.name != '') {
          sWehere += "realname like'%" + o.name + "%'"
        }
        if (sWehere != "" && (sWehere.slice(-4)).trim() == 'and') {
          sWehere = sWehere.slice(0, -4);
        }
        if (sWehere == "") {
          sql = "select * from tb_user where identity!=0 and is_check!=2"
        } else {
          sql = "select * from tb_user where " + sWehere
        }
      }

      console.log(sql)
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

/*根据id删除用户*/
function deleteUserById (id) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("delete * from tb_user where id='" + id + "'", function (err, results) {
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
// function getUserList () {
//   const conn = connect();
//   return new Promise((resolve, reject) => {
//     try {
//       conn.query("select * from tb_user", function (err, results) {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(results)
//         }
//       })
//     } catch (e) {
//       reject(e)
//     } finally {
//       conn.end()
//     }
//   })
// }



module.exports = {
  Login,
  getUncheck,
  handleUnCheck,
  getCheckedList,
  deleteUserById
}