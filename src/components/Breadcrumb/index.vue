<template>
  <div class='breadcrumb pad_LR_30 flex_R_B'>

    <el-breadcrumb>
      <!-- <el-breadcrumb-item :to="{ path: $router.path }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item class="breadcrumb1">{{ $route.meta.title }}</el-breadcrumb-item>
      <el-breadcrumb-item class="breadcrumb2">{{ title ? title : $route.meta.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="backbtn" type="text" v-if="type" @click="$router.back(0)"><img
        src="@/assets/images/header/backicon.png" /> <span style="marginLeft:5px">返回上一级</span> </div>

  </div>
</template>

<script>

export default {
  props: ['title', 'type'],
  data() {
    return {
    };
  },
  created() {
    console.log(this.$route)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .breadcrumb1 {
  .el-breadcrumb__inner {
    color: #979797;
  }
}

::v-deep .breadcrumb2 {
  .el-breadcrumb__inner {
    color: #000000;
  }
}

.backbtn {
  color: #1890FF;
  display: flex;
  align-items: center;

  // img {
  //   position: absolute;
  //   margin: -3px 0px 0px -30px
  // }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

.breadcrumb {
  width: 1200px;
  margin: 0 auto;
  height: 64px;
  // background-color: #fff;
  // border-bottom: 1px solid #dcdfe6;

  ::v-deep .el-breadcrumb {
    line-height: 50px;
  }
}
</style>
