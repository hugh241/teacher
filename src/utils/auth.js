import Cookies from 'js-cookie'
const TokenKey = 'Teaching_Autonomic_Learning_Token'
const user_info = 'train_user_info'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 设置用户信息缓存
export function setUserInfo(userInfo) {
  console.log('我触发了')
  return Cookies.set(user_info, JSON.stringify(userInfo))
}

// 获取用户信息缓存
export function getUserInfo() {
  return JSON.parse(Cookies.get(user_info) || '{}')
}

export function removeUserInfo() {
  return Cookies.remove(user_info)
}

// 获取用户信息中的字段
export function getUserAttr(key) {
  const params = getUserInfo(user_info) || {}
  return (typeof params[key] === 'undefined') ? '' : params[key]
}
