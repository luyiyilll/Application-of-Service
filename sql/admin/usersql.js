const config = require('../sqlConfig')
const mysql = require('mysql');
const { getApplyId, getIdentityId } = require('../../utils/constant')
const { querySql } = require('../index')
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
        if (identity == 4) {
          sql = "update tb_user set is_apply=0,is_check=1,identity='" + (identity + 1) + "' where id='" + id + "'";
        } else {
          sql = "update tb_user set is_apply=0,is_check=0,identity='" + (identity + 1) + "' where id='" + id + "'";
        }
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

/*根据id查询用户信息*/
function viewUserById (id) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_user where id='" + id + "'", function (err, results) {
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

/*入党申请 上传图片*/
function uploadAppPic (id) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_user where id='" + id + "'", function (err, results) {
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

/*根据图片名 和类型（0-9）删除图片*/


function deletePicByName (o) {
  querySql("select * from tb_user where id='" + o.id + "'").then(async results => {
    let petition = results[0].petition_pic.split(';');
    let family = results[0].family_pic.split(';');
    let resume = results[0].resume_pic.split(';');
    let statement = results[0].statement_pic.split(';');
    let excellent = results[0].excellent_pic.split(';');
    let certifate = results[0].certifate_pic.split(';');
    let normal = results[0].normal_pic.split(';');
    let applybook = results[0].applybook_pic.split(';');
    let tonormal = results[0].tonormal_pic.split(';');
    let sql, pic, newPic = [];
    switch (o.type) {
      case 0:
        petition.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set petition_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 1:
        family.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set family_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 2:
        resume.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set resume_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 3:
        statement.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set statement_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 4:
        excellent.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set excellent_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 5:
        certifate.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set certifate_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 6:
        normal.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set normal_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 7:
        applybook.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set applybook_pic='" + pic + "' where id='" + o.id + "'"
        break;
      case 8:
        tonormal.forEach(item => {
          if (item != o.pic) {
            newPic.push(item)
          }
        })
        pic = newPic.join(';')
        sql = "update tb_user set tonormal_pic='" + pic + "' where id='" + o.id + "'"
        break;
    }
    console.log(pic)
    console.log(sql)
    await querySql(sql).then(r => {
      return {
        code: 20000,
        msg: '删除成功'
      }
    })

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
  deleteUserById,
  viewUserById,
  uploadAppPic,
  deletePicByName
}