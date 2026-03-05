<template>
  <div class="kcBtn">
    <div class="tit">
      <p v-if="courseDetail.assessState == null" style="font-size: 18px">
        您还未参加考试，请点击下方参加课程考练参加开始
      </p>
      <p v-else style="font-size: 18px">
        您已参加课程考练，最高分数为<span style="color: red; font-size: 20px">{{
          courseDetail.assessState
        }}</span
        >分
      </p>
    </div>
    <div class="btn" style="text-align: center">
      <el-button type="primary" @click="goToExan(courseDetail.id)" size="large"
        >
        <span v-if="courseDetail.assessState == null">参加课程考练</span>
        <span v-else>重新参加课程考练</span>
        </el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courseDetail: {
      type: Object,
    },
  },
  mounted() {
    console.log("考试", this.courseDetail);
  },
  methods: {
    goToExan(courseId) {
      this.$store.dispatch('type/saveTableData', 2)
      this.$router.push({
        path: "examinationCenter",
        query: {
          courseId: courseId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.kcBtn {
  position: relative;
  width: 982px;
  margin-top: 10px;
  border: 1px solid #f3f3f3;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  background: #f7f7f7;

  .btn {
    position: absolute;
    bottom: 15%;
    left: 45%;
  }

  .tit {
    padding: 10px 5px 10px 5px;
    background: #fff;
  }
}
</style>