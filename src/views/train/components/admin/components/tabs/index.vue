<!--
 * @Date: 2022-11-28 00:25:12
 * @LastEditTime: 2022-11-28 00:29:27
 * @FilePath: /campus-security-vue/src/views/components/Header/index2.vue
 * @Description:这是新创建的页面
-->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.id">
        <div slot="label">
          <span> {{ item.label }} </span>
          <span class="num"> ( {{ item.num }} )</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    props: {
      tabList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        activeName: '',
      }
    },
    created() {
      this.activeName = this.tabList[0].state == '1' ? this.tabList[0].state - 1 : ''
    },
    mounted() {},
    methods: {
      /**
       * @event:
       * @return {*}
       * @description: 交互
       */
      handleClick(tab, event) {
        this.$emit('handleTabsClick', this.tabList[tab.index].state)
      },
      /**
       * @event:
       * @return {*}
       * @description: 请求
       */
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
  }
</style>
