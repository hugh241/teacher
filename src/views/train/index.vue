<!-- 培训管理 -->
<template>
  <div class="train">
    <BreadCrumb :type="$route.path != '/list' ? true : false" />
    <div class="trainList">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      BreadCrumb: () => import('@/components/Breadcrumb/index.vue'),
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
    created() {},
    mounted() {},
  }
</script>

<style lang="scss" scoped>
  .train {
    .trainList {
      width: 1200px;
      overflow: auto;
      background: #fff;
      min-height: calc(100vh - 148px);
      border-radius: 10px;
      padding: 0 20px;
      margin: 0 auto;
    }
  }
</style>
