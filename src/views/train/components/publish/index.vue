<!-- 发布活动 -->
<template>
  <div class="publish">
    <el-steps style="padding: 40px 0 80px" :active="activeIndex" finish-status="success" simple>
      <el-step v-for="(step, index) in stepList" :title="step.name" :key="index"></el-step>
    </el-steps>
    <component v-bind:is="activeName" :key="activeName" @prevFun="prevFun" @nextFun="nextFun"
      @changeStepList="changeStepList" :courseId="courseId" :isHomework="isHomework" :isExperience="isExperience">
    </component>
  </div>
</template>

<script>
export default {
  components: {
    setInfo: () => import('./components/setInfo.vue'),
    setSubmit: () => import('./components/setSubmit.vue'),
    setChapter: () => import('./components/setChapter.vue'),
    setTopic: () => import('./components/setTopic.vue'),
    setCertificate: () => import('./components/setCertificate.vue'),
  },
  data() {
    return {
      isExperience: '1',
      isHomework: '1',
      courseId: '',
      activeIndex: 0,
      activeName: 'setInfo',
      stepList: [
        {
          id: 'setInfo',
          name: '第一步:填写基本信息',
        },
        {
          id: 'setSubmit',
          name: '第二步:提交任务要求设置',
        },
        {
          id: 'setChapter',
          name: '第三步:设置章节',
        },
        {
          id: 'setTopic',
          name: '第四步:设置答题',
        },
        {
          id: 'setCertificate',
          name: '证书颁发设置',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 上一步
    prevFun() {
      if (this.activeIndex != 0) {
        this.activeName = this.stepList[this.activeIndex - 1].id
        this.activeIndex--
      }
    },
    // 下一步
    nextFun(id) {
      if (id) {
        this.courseId = id
      }

      if (this.activeIndex < this.stepList.length - 1) {
        this.activeName = this.stepList[this.activeIndex + 1].id
        this.activeIndex++
      }
    },
    // 菜单渲染
    changeStepList(isExperience, isHomework) {
      console.log(isExperience, isHomework)
      this.isExperience = isExperience;
      this.isHomework = isHomework;
      if (isExperience == '1' || isHomework == '1') {
        this.stepList = [
          {
            id: 'setInfo',
            name: '第一步:填写基本信息',
          },
          {
            id: 'setSubmit',
            name: '第二步:提交任务要求设置',
          },
          {
            id: 'setChapter',
            name: '第三步:设置章节',
          },
          {
            id: 'setTopic',
            name: '第四步:设置答题',
          },
          {
            id: 'setCertificate',
            name: '第五步:证书颁发设置',
          },
        ]
      } else {
        this.stepList = [
          {
            id: 'setInfo',
            name: '第一步:填写基本信息',
          },
          {
            id: 'setChapter',
            name: '第二步:设置章节',
          },
          {
            id: 'setTopic',
            name: '第三步:设置答题',
          },
          {
            id: 'setCertificate',
            name: '第四步:证书颁发设置',
          },
        ]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.publish {
  ::v-deep .el-steps {
    background-color: #fff;
    padding: 14px 30px;
    flex: 0 0 1;

    .el-step__title {
      font-size: 14px;
      max-width: 100% !important;
    }

    .is-success {
      color: #3e7bf7;
      border-color: #3e7bf7;
    }
  }
}
</style>
