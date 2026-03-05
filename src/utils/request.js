import axios from 'axios'
import {
  Notification,
  MessageBox
} from 'element-ui'
import store from '@/store'
import {
  getToken, removeToken, removeUserInfo
} from '@/utils/auth'
import { logoutUrl } from '@/api/user' 


const redirectToLogin = async () => {
  try {
    const res = await logoutUrl();
    if (res.returnCode === "200" && res.returnData) {
      window.location.href = res.returnData;
    } else {
      // 如果接口返回失败，使用默认错误处理
      console.error('获取跳转地址失败:', res.returnMessage);
      // 可以跳转到错误页面或者保持当前页面
      // 这里选择跳转到无权限页面
      window.location.href = '/noPermission';
    }
  } catch (error) {
    console.error('调用跳转接口失败:', error);
    // 接口调用失败时跳转到无权限页面
    window.location.href = '/noPermission';
  }
};

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 120000 // 请求超时时间
})
// request 拦截器
service.interceptors.request.use(
  config => {
    // let formData = new FormData();
    // if (config.data) {
    //   Object.keys(config.data).map((key) => {
    //     formData.append(key, config.data[key]);
    //   });
    // }
    if (getToken()) {
      config.headers['X-Token'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // config.data = formData;
    return config
  },
  // config => {
  //   if (getToken()) {
  //     config.headers['X-Token'] = getToken()
  //   }
  //   config.headers['Content-Type'] = 'application/json'
  //   return config
  // },
  error => {
    // return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const code = response.data.returnCode

    if (code == 200 || code == 201 || code == 202 || code == 500 || code == 203 || code == 9999 || code == '0503') {
      return response.data
      // else {
      //   Notification.error({
      //     title: response.data.returnMessage || response.data.msg,
      //     duration: 4000
      //   })
      // }
    } else {
      if (code == 401) {


        // return response.data
        // MessageBox.confirm(
        //   '登录状态已过期，您可以继续留在该页面，或者重新登录',
        //   '系统提示', {
        //     confirmButtonText: '重新登录',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }
        // ).then(() => {

        //   window.location.href = process.env.VUE_APP_RETURN_URL;
        // })
        MessageBox.alert(
          '登录状态已过期，请您重新登录',
          '系统提示', {
            confirmButtonText: '重新登录',
            type: 'warning',
            showClose: false,  // 隐藏右上角的关闭按钮
            closeOnClickModal: false, // 添加：禁止点击蒙层关闭
            closeOnPressEscape: false // 添加：禁止按ESC关闭
          }
        ).then(() => {
          removeToken();
          removeUserInfo();
          store.dispatch("user/resetUserInfo");
          return redirectToLogin();
        })
      }

    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.returnCode
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        // Notification.error({
        //   title: '网络请求超时',
        //   duration: 5000
        // })
        // return Promise.reject(error)
      }
    }
    if (code) {
      if (code == 401) {
        store.commit('user/SET_loginTag', true);
        // MessageBox.confirm(
        //   '登录状态已过期，您可以继续留在该页面，或者重新登录',
        //   '系统提示',
        //   {
        //     confirmButtonText: '重新登录',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }
        // ).then(() => {
        //   store.dispatch('logout').then(() => {
        //     location.reload() // 为了重新实例化vue-router对象 避免bug
        //   })
        // })
      } else if (code == 403) {
        // router.push({ path: '/401' })
      } else {
        const errorMsg = error.response.data.returnMessage
        if (errorMsg !== undefined) {
          // Notification.error({
          //   title: errorMsg,
          //   duration: 5000
          // })
        }
      }
    } else {
      // Notification.error({
      //   title: '接口请求失败',
      //   duration: 5000
      // })
    }
    // return Promise.reject(error)
  }
)

export default service