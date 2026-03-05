<template>
  <div id="app">
    <!-- <router-view /> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  mounted() {
    // this.pageResize();
    // window.onresize = () => {
    //   this.pageResize();
    // };
    // console.log("我刷新了");
  },
  watch: {
    $route(to) {
      console.log(to.meta.title);
      let location = window.location
      let url = location.href.replace('#/', '')
      window._paq.push(['setCustomUrl', url])
      window._paq.push(['setDocumentTitle', to.meta.title])
      window._paq.push(['trackPageView'])
      console.log(to.path,'url');
    }
  },
  methods: {
    pageResize() {
      const windowWidth = document.documentElement.clientWidth;
    let scaleNum = 1; // 默认比例为1，即不缩放

    if (windowWidth !== 1920) {
      scaleNum = windowWidth / 1920;
      if (windowWidth <= 1366) {
        scaleNum += 0.008; // 微调比例
      }
    }

    // 设置 transform: scale() 代替 zoom
    document.documentElement.style.transform = `scale(${scaleNum})`;
    document.documentElement.style.transformOrigin = '0 0'; // 确保缩放从左上角开始
    document.documentElement.style.width = `${100 / scaleNum}%`; // 调整宽度以防止滚动条出现
    },
  },
};
</script>

<style lang="scss">
* {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
.myTooltips {
  max-width: 50% !important;
}
</style>
