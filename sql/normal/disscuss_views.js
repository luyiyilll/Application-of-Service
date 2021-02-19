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

function findUserViews (openid) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      console.log(11)
      //conn.query("select DISTINCT a.id,a.postdate,a.title,a.content,b.views,c.islike from tb_discuss a,tb_views b,tb_likes c where a.id = b.otherid and a.id=c.otherid and a.publisher='" + did + "' and c.`user`='" + did + "' and b.type=0 and c.type=0", function (err, results) {
      conn.query("SELECT tb_discuss.*,tb_likes.islike,tb_user.avatar,tb_user.nick_name,(SELECT count(tb_views.otherid) FROM tb_views WHERE tb_discuss.id=tb_views.otherid AND tb_views.type=1) num from tb_discuss  LEFT JOIN tb_likes ON  tb_discuss.publisher=tb_likes.`user` AND tb_discuss.id=tb_likes.otherid LEFT JOIN tb_user ON tb_user.openid=tb_discuss.publisher WHERE tb_discuss.publisher='" + openid + "'"
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
      conn.end
    }
  })
}


module.exports = {

  findUserViews
}