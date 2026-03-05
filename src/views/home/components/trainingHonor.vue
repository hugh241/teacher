<template>
  <div class="ques-feedback">
    <el-card class="box-card">
      <div style="width:100%; min-height:640px; display:flex;justify-content: center;align-items: center;" v-if="pdfUrl == ''">
        <el-empty description="暂无数据！" :image-size="200"></el-empty>
        <!-- <el-empty description="该培训证书正在设计中，培训结束后统一下放，之前自动生成的证书不正确，不能使用！请各位老师知悉！" :image-size="200"></el-empty> -->
      </div>
      <div class="pdf-view" v-else>
        <img :src="pdfUrl" style="width: 940px; height: 598px">
      </div>
    </el-card>
  </div>
</template>

<script>
import { getHonor,getHonorList } from "@/api/learningCenter";
import { mapGetters } from "vuex";

export default {
  name: "trainingHonor",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      pdfUrl: "",
    };
  },
    computed: {
    ...mapGetters(["userInfo"]),
    userId() {
      return this.userInfo.userId;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      // console.log(this.$$store);
      getHonorList({
        pageNo: 1,
        pageSize: 5,
        courseId: this.courseDetail.id,
        courseName: '',
        level: "",
        userId:this.userId,
      }).then((res) => {
        if (res.returnCode == "200" && res.returnData) {
          if (res.returnData.length > 0) {
            this.pdfUrl = res.returnData[0].png_url;
          } 
        } else {
          this.$message.warning({
            message: res.returnMessage,
            duration: 4000, // 设置显示时间为5秒（5000毫秒）
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ques-feedback {
  height: 650px;
  width: 984px;
  margin-top: 10px;
  .box-card {
    border-radius: 16px;
    min-height: 640px;
    width: 100%;
    font-size: 16px;
    .pdf-view {
      height: 450px;
      width: 800px;
    }
  }
  .clearfix {
    font-size: 16px;
  }
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
