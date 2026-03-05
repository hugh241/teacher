<template>
  <div class="dashboard-editor-container">
    <div class="home_page">
      <span>欢迎进入四川中小学智慧教育教师培训系统</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import getUrlKey from "../../getUrlKey";
export default {
  name: "Dashboard",
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  methods: {},
  created() {
    var jsonObject = getUrlKey("JsonInfo");
    var courseId = getUrlKey("courseId");
    if (courseId && jsonObject) {
      this.$store
        .dispatch("user/signLogin", { jsonObject: jsonObject })
        .then(() => {
          this.$store
            .dispatch("user/getInfo")
            .then(() => {
              this.$router.push({ path: `coursedatail?courseId=${courseId}` });
            })
            .catch(() => {
              this.$router.push({ path: "/home" });
            });
        });
    } else {
      if (jsonObject != null && jsonObject != "null") {
        this.$store
          .dispatch("user/signLogin", { jsonObject: jsonObject })
          .then((res) => {
            this.$store
              .dispatch("user/getInfo")
              .then((res1) => {
                this.$router.push({ path: "/home" });
              })
              .catch((err) => {
                this.$router.push({ path: "/" });
              });
            // console.log("登录成功跳转路由:" + this.redirect);
          })
          .catch(() => {});
      }
    }
  },
};
</script>
<style>
.stepsbar .el-step__head.is-success {
  color: #1890ff;
  border-color: #1890ff;
}

.stepsbar .el-step__title.is-success {
  color: #1890ff;
}
</style>

<style lang="scss" scoped>
.dashboard-editor-container {
  width: 73%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;

  .stepsbar {
    width: 24%;
    background: #fff;
    border-radius: 10px;
    height: 550px;
    padding: 25px 20px 90px 20px;

    .steptit {
      font-size: 20px;
      color: #000;
      margin-bottom: 30px;
    }
  }

  .stepscon {
    width: 75%;
    background: #fff;
    border-radius: 10px;
    min-height: 400px;
  }
}
</style>
