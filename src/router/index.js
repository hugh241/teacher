import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export const constantRoutes = [{
    path: '/index',
    component: () => import('@/views/dashboard/index'),
    hidden: true,
  },
  //下线登录页
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  // 无权限
  {
    path: '/noPermission',
    hidden: true,
    component: () => import('@/views/noPermission/index.vue'),
    name: 'noPermission',
    meta: {
      title: '无权限',
      name: '无权限',
      path: "/noPermission"
    },
  },
  {
    // 首页 - 未登录或已登录都可见
    path: '/home',
    hidden: true,
    component: () => import('@/views/home/index.vue'),
    name: 'home',
    meta: {
      title: '首页',
      path: "/home"
    },

  },
  {
    path: '/',
    component: () => import('@/views/index.vue'),
    hidden: true,
    name: 'home',
    redirect: "/home",
    children: [
      {
        // 首页更多
        path: 'more',
        hidden: true,
        component: () => import('@/views/home/components/more.vue'),
        name: 'more',
        meta: {
          title: '首页',
          name: '更多列表',
          path: "/home"
        },
      },
      {
        // 首页课程详情
        path: '/coursedatail',
        hidden: true,
        component: () => import('@/views/home/courseDatail.vue'),
        name: 'coursedatail',
        meta: {
          title: '首页',
          name: '培训列表',
          path: "/home"
        },
      },
      {
        // 课程播放
        path: '/learningCourse',
        hidden: true,
        component: () => import('@/views/home/LearningCourse.vue'),
        name: 'learningCourse',
        meta: {
          title: '首页',
          name: '课程播放',
          path: "/home"
        },
      },
      {
        path: '/learningCourseOffice',
        component: () => import('@/views/home/LearningCourseOffice'),
        name: 'learningCourseOffice',
        hidden: true,
        meta: {
          title: '首页',
          name: '文件播放',
          path: "/home"
        },
      },
      {
        path: '/examinationCenter',
        component: () => import('@/views/home/ExaminationCenter'),
        name: 'examinationCenter',
        hidden: true,
        meta: {
          title: '首页',
          name: '考练中心',
          path: "/home"
        },
      },
      {
        path: '/topicList',
        component: () => import('@/views/home/topicList'),
        name: 'topicList',
        hidden: true,
        meta: {
          title: '首页',
          name: '试卷列表',
          path: "/home"
        },
      },
      {
        path: '/answerRecordDetail',
        component: () => import('@/views/home/answerRecordDetail'),
        name: 'answerRecordDetail',
        hidden: true,
        meta: {
          title: '首页',
          name: '错题集',
          path: "/home"
        },
      },
      {
        path: '/examination',
        component: () => import('@/views/home/Examination'),
        name: 'examination',
        hidden: true,
        meta: {
          title: '首页',
          name: '考试',
          path: "/home"
        },
      },
      {
        // 测试管理
        path: '/train',
        hidden: true,
        component: () => import('@/views/train/index.vue'),
        name: 'train',
        redirect: "/list",
        meta: {
          title: '测试管理',
          name: '培训任务列表',
          path: "/train"
        },
        children: [{
            // 培训任务列表
            path: '/list',
            hidden: true,
            component: () => import('@/views/train/components/list/index.vue'),
            name: 'list',
            meta: {
              title: '测试管理',
              name: '培训任务列表',
              path: "/train"
            },
          },
          {
            // 测试管理详情
            path: '/admin',
            hidden: true,
            component: () => import('@/views/train/components/admin/index.vue'),
            name: 'admin',
            meta: {
              title: '测试管理',
              name: '测试管理详情',
              path: "/train"
            },
          },
          {
            // 发布任务
            path: '/publish',
            hidden: true,
            component: () => import('@/views/train/components/publish/index.vue'),
            meta: {
              title: '测试管理',
              name: '发布任务',
              path: "/train"
            },
          },
          {
            // 培训汇总
            path: '/trainSum/:userId?/:userName?/:schoolName?/:courseId?/:courseName?',
            hidden: true,
            name:'trainSum',
            component: () => import('@/views/train/components/trainSum/index.vue'),
            meta: {
              title: '测试管理',
              name: '参训记录',
              path: "/train"
            },
          },
        ]
      },
      {
        // 证书模板管理
        path: '/credential',
        hidden: true,
        component: () => import('@/views/credential/index.vue'),
        name: '证书模板管理',
        meta: {
          title: '证书模板管理',
          path: "/credential"
        },
      },
      {
        // 我的培训
        path: '/myTrain',
        hidden: true,
        component: () => import('@/views/myTrain/index.vue'),
        name: 'myTrain',
        meta: {
          title: '我的培训',
          name: '我的培训',
          path: "/myTrain"
        },
      },

      {
        // 培训统计
        path: '/trainingStatistics',
        hidden: true,
        component: () => import('@/views/trainingStatistics/index.vue'),
        name: 'trainingStatistics',
        meta: {
          title: '培训统计',
          name: '培训统计',
          path: "/trainingStatistics"
        },
      },
      {
        // 学校人员培训情况
        path: '/staffTraining',
        hidden: true,
        component: () => import('@/views/staffTraining/index.vue'),
        name: 'staffTraining',
        meta: {
          title: '学校人员培训情况',
          name: '学校人员培训情况',
          path: "/staffTraining",
        },
      },

    ]
  },
]

export let asyncRoutes = [
  // { path: '*', redirect: '/404', hidden: true }
]

export function filterAsyncRoutes(menuList) {
  asyncRoutes = []
  for (let i = 0; i < menuList.length; i++) {
    const l = menuList[i]
    if (l.menuParentId == '' || l.menuParentId == null) {
      const nr = {
        path: l.menuLinkAddress || '',
        component: Layout,
        meta: {
          title: l.menuName,
          icon: l.menuImage
        },
      }

      const childs = []
      // 提取子集
      for (let c = 0; c < menuList.length; c++) {
        const m = menuList[c]
        if (m.menuParentId == l.menuInfoId) {
          childs.push({
            path: m.menuLinkAddress || '',
            name: m.menuLinkAddress,
            component: resolve => {
              require(['@/views/' + m.menuLinkAddress], resolve)
            },
            meta: {
              title: m.menuName
            },
          })
        }
      }
      if (childs.length === 0) {
        childs.push({
          path: l.menuLinkAddress || '',
          name: l.menuLinkAddress,
          component: resolve => {
            require(['@/views/' + l.menuLinkAddress], resolve)
          },
          meta: {
            title: l.menuName,
            icon: l.menuImage
          },
        })
      }
      nr.children = childs
      asyncRoutes.push(nr)
    }
  }
  //动态添加404
  asyncRoutes.push({
    path: '*',
    redirect: '/404',
    hidde: true
  })
  return asyncRoutes
}

const createRouter = () =>
  new Router({
    mode: 'history',
    base: process.env.VUE_APP_IS_PROD == '0' ? '/' : '/hd/teacherTraining/',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes,
  })
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
