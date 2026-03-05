import {
  getToken,
  setToken,
  removeToken,
  removeUserInfo,
  setUserInfo,
  getUserInfo,
  getUserAttr,
  getMenuList,
  setMenuList
} from '@/utils/auth'
import {
  login,
  logout,
  getInfo,
  signLogin
} from '@/api/user'
import router, {
  resetRouter,
  asyncRoutes,
  constantRoutes,
  filterAsyncRoutes
} from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    routes: [],
    addRoutes: [],
    userId: '',
    name: '',
  },
  mutations: {
    // 存入用户信息
    SET_USERINFO(state, payload) {
      for (let i in payload) {
        state[i] = payload[i];
      }
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    // 清除用户信息
    REMOVE_USERINFO: (state, data) => {
      state = data
    }
  },
  actions: {
    //单点登录
    signLogin({
      commit
    }, info) {
      const jsonObject = info.jsonObject;
      return new Promise((resolve, reject) => {
        signLogin(jsonObject).then(response => {
          const {
            returnData
          } = response


          console.log(returnData, 23333)

          setToken(returnData)



          resolve(returnData);

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(getToken()).then(res => {
          if (!res) {
            reject('')
            return false
          }
          /**获取存放用户信息 */
          commit('SET_USERINFO', res.returnData.userInfo);
          setUserInfo(res.returnData.userInfo);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 路由
    async generateRoutes({
      commit,
      state
    }) {
      return new Promise(resolve => {
        const accessedRoutes = filterAsyncRoutes(state.menuList)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    // 重置token
    resetToken() {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    },
    //重置用户信息
    resetUserInfo({
      commit
    }) {
      console.log('我触发了')
      let data = {
        token: '',
        routes: [],
        addRoutes: [],
      };
      removeToken()
      removeUserInfo()

    }
  }
}