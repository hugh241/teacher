import Vue from 'vue'
import App from './App.vue'
// element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
// 路由
import router from './router'
import './permission'
// 仓库
import store from './store'
// 动态权限
Vue.prototype.$process = process.env
// icon图标
import './icons'
Vue.config.productionTip = false
// 公共css样式
import '@/styles/index.css'
// 大文件上传
import uploader from 'vue-simple-uploader'
Vue.use(uploader)
// 播放控件
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})