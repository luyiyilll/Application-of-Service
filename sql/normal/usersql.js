const config = require('../sqlConfig')
const mysql = require('mysql');
const { querySql } = require('../index')
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
      conn.end()
    }
  })
}

/*上传入党申请书照片*/
function updatePetition (openid, img) {
  querySql("select petition_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].petition_pic) {
      result = res[0].petition_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    await querySql("update tb_user set petition_pic='" + imgs + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*上传家庭材料照片*/
function updateFamily (openid, img) {
  querySql("select family_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].family_pic) {
      result = res[0].family_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    await querySql("update tb_user set family_pic='" + imgs + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}
/*上传个人履历*/
function updateResume (openid, img) {
  querySql("select resume_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].resume_pic) {
      result = res[0].resume_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    await querySql("update tb_user set resume_pic='" + imgs + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}
/*上传自人自传材料*/
function updateStatement (openid, img) {
  querySql("select statement_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].statement_pic) {
      result = res[0].statement_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    await querySql("update tb_user set statement_pic='" + imgs + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}
/*团员推优及评议材料*/
function uploadExcellent (openid, img) {
  querySql("select excellent_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].excellent_pic) {
      result = res[0].excellent_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    let date = getFromatTime(new Date())
    await querySql("update tb_user set excellent_pic='" + imgs + "',active_postdate= '" + date + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*入党积极分子党课结业证书材料*/
function uploadCertifate (openid, img) {
  querySql("select certifate_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].certifate_pic) {
      result = res[0].certifate_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    let date = getFromatTime(new Date())
    await querySql("update tb_user set certifate_pic='" + imgs + "',dev_postdate='" + date + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*两位正式党员介绍人材料*/
function uploadNormal (openid, img) {
  querySql("select normal_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].normal_pic) {
      result = res[0].normal_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    await querySql("update tb_user set normal_pic='" + imgs + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*上传入党志愿书材料照片*/
function uploadApplybook (openid, img) {
  querySql("select applybook_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].applybook_pic) {
      result = res[0].applybook_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    let date = getFromatTime(new Date())
    await querySql("update tb_user set applybook_pic='" + imgs + "',pre_postdate='" + date + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*转正申请书材料*/
function uploadTonormal (openid, img) {
  querySql("select tonormal_pic from tb_user where openid='" + openid + "'").then(async res => {
    let result;
    if (!!res[0].tonormal_pic) {
      result = res[0].tonormal_pic.split(';');
    } else {
      result = [];
    }
    result.push(img);
    let imgs = result.join(";")
    let date = getFromatTime(new Date())
    await querySql("update tb_user set tonormal_pic='" + imgs + "',tonormal_postdate='" + date + "' where openid ='" + openid + "'").then(response => {
      return {
        code: 1,
        msg: '更新成功'
      }
    })
  })
}

/*根据openid获取用户申请*/
function getApplication (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query("select * from tb_user where openid='" + openid + "'", function (err, results) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      conn.end()
    }
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
  findUserByName,
  updatePetition,
  updateFamily,
  updateResume,
  updateStatement,
  uploadExcellent,
  uploadCertifate,
  uploadNormal,
  uploadApplybook,
  uploadTonormal,
  getApplication
}