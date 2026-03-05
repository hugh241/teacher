import router from './router'
import store from './store'
import request from '@/utils/request'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken,
  removeToken,
  removeUserInfo,
  getUserInfo,
  setToken
} from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { logoutUrl } from '@/api/user'  // 导入 logoutUrl 接口

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/index', '/noPermission', '/home']

// 新增：统一的跳转方法
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

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    // let userInfo = getUserInfo()
    // const hasRoles = userInfo.userId
    const hasRoles = store.getters.userInfo.userId
    if (to.path == '/login') {
      if (hasRoles) {
        next({
          path: '/'
        })
      } else {
        if (process.env.VUE_APP_IS_PROD == '1') {
          await redirectToLogin();
          return false
        }
        next()
      }
      NProgress.done()
    } else {
      if (hasRoles) {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo');
          next({
            ...to,
            replace: true
          })
        } catch (error) {

          store.dispatch('user/resetUserInfo');
          if (process.env.VUE_APP_IS_PROD == '1') {

            await redirectToLogin();

          } else {
            // next(`/login?redirect=${to.path}`)
          }

          NProgress.done()
        }
      }
    }
  } else {

    if (to.path !== '/login') {
      const ticket = to.query.ticket
      if (ticket) {
        try {
          removeToken()
          const res = await request.post(`/sso/oauth/token?ticket=${ticket}`)
          if (res && (res.returnCode === 200 || res.returnCode === '200')) {
            setToken(res.returnData)
            // 必须先获取用户信息，否则 next() 后页面会因无 userInfo 报错
            await store.dispatch('user/getInfo')
            const redirect = to.query.redirect || '/'
            next(redirect === '/login' ? '/' : redirect) // 防止回到 login
            NProgress.done()
            return
          } else {
            // token 获取失败，跳转登录
            next(`/noPermission`)
            // alert('您不是教师用户，无法进入该系统！')
            // // 跳转到指定URL
            // window.location.href = 'https://www.scedu.com.cn/ThirdPortalService/html/indexNew/index.html#/home?active=2&type'
            NProgress.done()
            return
          }
        } catch (error) {
          console.error('SSO ticket exchange failed:', error)
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
          return
        }
      }
    }

    // 在白名单检查中
    if (whiteList.indexOf(to.path) !== -1 || to.fullPath.indexOf('jsonObject=') != -1) {
      next()  // 直接放行，不会重定向
    } else {
      // 只有不在白名单的路径才会重定向
      await redirectToLogin();
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})