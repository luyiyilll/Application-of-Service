function getIdentity (id) {
  let identity;
  switch (id) {
    case 0:
      identity = "群众"
      break;
    case 1:
      identity = "入党申请人";
      break;
    case 2:
      identity = "积极分子";
      break;
    case 3:
      identity = "发展对象";
      break;
    case 4:
      identity = "预备党员";
      break;
    case 5:
      identity = "正式党员";
      break;
  }
  return identity;
}

function getIdentityId (identity) {
  let id;
  switch (identity) {
    case "群众":
      id = 0
      break;
    case "入党申请人":
      id = 1;
      break;
    case "积极分子":
      id = 2;
      break;
    case "发展对象":
      id = 3;
      break;
    case "预备党员":
      id = 4;
      break;
    case "正式党员":
      id = 5;
      break;
  }
  return id;
}

function getFromatTime (utcDate) {
  let year = utcDate.getUTCFullYear();
  let month = utcDate.getUTCMonth() + 1;
  let day = utcDate.getUTCDate();
  let hours = utcDate.getUTCHours() >= 10 ? utcDate.getUTCHours() : ("0" + utcDate.getUTCHours());
  let min = utcDate.getUTCMinutes() >= 10 ? utcDate.getUTCMinutes() : ("0" + utcDate.getUTCMinutes());
  let secends = utcDate.getUTCSeconds() >= 10 ? utcDate.getUTCSeconds() : ("0" + utcDate.getUTCSeconds());
  return (year + "-" + month + "-" + day + "  " + hours + ":" + min + ":" + secends)
}

function getFromatDate (date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return (year + "-" + month + "-" + day)
}
function getFroTime (date) {
  let hours = date.getHours() >= 10 ? date.getHours() : ("0" + date.getHours());
  let min = date.getMinutes() >= 10 ? date.getMinutes() : ("0" + date.getMinutes());
  let secends = date.getSeconds() >= 10 ? date.getSeconds() : ("0" + date.getSeconds());
  return (hours + ":" + min + ":" + secends)
}

function getApply (identity, is_apply) {
  if ((identity == 0 && is_apply == 0) || (identity == 1 && is_apply) || (identity == 2 && is_apply == 0) || (identity == 3 && is_apply == 0) || identity == 4 && is_apply == 0) {
    return '暂无申请';
  } else if (identity == 0 && is_apply == 1) {
    return '入党申请';
  } else if (identity == 1 && is_apply == 1) {
    return '积极分子申请'
  } else if (identity == 2 && is_apply == 1) {
    return '发展对象申请'
  } else if (identity == 3 && is_apply == 1) {
    return '预备党员申请'
  } else if (identity == 4 && is_apply == 1) {
    return '转正申请'
  }
}

function getApplyId (apply) {
  let o;
  if (apply == '暂无申请') {
    o = {
      status: 0,
      is_apply: 0,
    }
    return o;
  } else if (apply == '入党申请') {
    o = {
      status: 0,
      is_apply: 1,
    }
    return o;
  } else if (apply == '积极分子申请') {
    let o = {
      status: 1,
      is_apply: 1,
    }
    return o;
  } else if (apply == '发展对象申请') {
    let o = {
      status: 2,
      is_apply: 1,
    }
    return o;
  } else if (apply == '预备党员申请') {
    let o = {
      status: 3,
      is_apply: 1,
    }
    return o;
  } else if (apply == '转正申请') {
    let o = {
      status: 4,
      is_apply: 1,
    }
    return o;
  }
}


function getApplyStatus (identity, is_apply, is_check) {
  console.log(identity)
  console.log(is_apply)
  if ((identity == 0 && is_apply == 0) || (identity == 1 && is_apply == 0) || (identity == 2 && is_apply == 0) || (identity == 3 && is_apply == 0) || identity == 4 && is_apply == 0) {
    return -1;
  } else {
    return is_check;
  }
}

module.exports = {
  CODE_ERROR: -1,
  getIdentity,
  getFromatTime,
  getFromatDate,
  getFroTime,
  getApply,
  getApplyStatus,
  getApplyId,
  getIdentityId
}