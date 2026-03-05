import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: data
  })
}

// 单点登录方法
export function signLogin(jsonObject) {
  return request({
    url: '/user/signLogin',
    method: 'post',
    params: {
      jsonObject
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    data: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
// 获取验证码
export function captchaImage() {
  return request({
    url: '/getCaptcha',
    method: 'get'
  })
}

// 退出到中小学智慧教育平台
export function logoutUrl(data) {
  return request({
    url: '/sso/login/url',
    method: 'post',
    params: data
  })
}