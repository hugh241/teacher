<!-- 顶部 -->
<template>
  <div>
    <!-- <div class="header flex_R_B">
      <div class="header_left flex_R">
        <img src="@/assets/images/header/icon_doing.png" alt="" />
        <p class="header_left_name">{{ $process.VUE_APP_ALL_TITLE }}</p>
      </div>
      <el-menu
        id="eventsyshead"
        style="border: none"
        :default-active="$route.meta.path"
        mode="horizontal"
        :collapse="collapsed"
        collapse-transition
        router
        unique-opened
        class="el-menu-vertical-demo"
        background-color="#1890FF"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item
          v-for="(menu, index) in allmenu"
          :key="index"
          :index="menu.url"
        >
          <p class="header_menuname">
            <img :src="menu.icon" class="header_menuname_icon" />{{
              menu.menuname
            }}
          </p>
        </el-menu-item>
      </el-menu>

      <div class="header_right flex_R">
        <p>欢迎你</p>
        <p>{{ userInfo.name }}</p>
        <p>|</p>
        <p
          class="backbtn"
          v-if="$process.VUE_APP_IS_PROD == '0'"
          @click="goOut"
        >
          退出
        </p>
        <p class="backbtn" v-else @click="goOut1">返回空间</p>
      </div>
    </div> -->
    <div class="headers-page">
      <div class="in-header">
        <div class="header-title" @click="$router.push('/')">
          {{ $process.VUE_APP_ALL_TITLE }}
        </div>
        <div class="header-menu-list-container">
          <div
            v-for="(item, i) of menuList"
            :key="i"
            @click="changeMenu(item, i)"
          >
            {{ item.name }}
          </div>
        </div>
        <div style="display: flex; align-items: center">
          <el-button v-if="!userInfo.userId" size="mini" round @click="login"
            >登录</el-button
          >
          <el-popover
            placement="bottom"
            v-if="userInfo.userId"
            popper-class="drops"
            width="180"
            trigger="hover"
          >
            <div class="drop-list">
              <div class="base-user-info">
                <div class="avatar">
                  <el-image
                    @click="handleCommand(0)"
                    v-if="userInfo.headUrl"
                    :src="userInfo.headUrl"
                    style="
                      width: 34px;
                      height: 34px;
                      border-radius: 17px;
                      margin-right: 6px;
                    "
                  >
                    <div slot="error" class="image-slot">
                      <img
                        src="@/assets/img/base/avtar-default.png"
                        style="width: 34px; height: 34px"
                      />
                    </div>
                  </el-image>
                  <img
                    v-else
                    @click="handleCommand(0)"
                    src="@/assets/img/base/avtar-default.png"
                    style="width: 34px; height: 34px"
                  />

                  <div>{{ userInfo.name }}</div>
                </div>
<!--                因大部分教师未获取手机号码，临时屏蔽-->
<!--                <div class="info" :title="userInfo.mobile">-->
<!--                  电话：{{ userInfo.mobile ? userInfo.mobile : "未完善" }}-->
<!--                </div>-->
                <div class="info" :title="userInfo.schoolName">
                  学校：{{
                    userInfo.schoolName ? userInfo.schoolName : "未完善"
                  }}
                </div>
              </div>
              <div class="menu-list">
                <!-- <div @click="goTrainManage">
                  <img
                    src="@/assets/images/header/head_train_new.png"
                    alt=""
                    style="width: 20px; height: 20px; margin-right: 3px"
                  />
                  测试管理
                </div>
                <div @click="goMyTrain">
                  <img
                    src="@/assets/images/header/head_myTrain_new.png"
                    alt=""
                    style="width: 20px; height: 20px; margin-right: 3px"
                  />
                  我的培训
                </div> -->
                <!-- <div @click="goOut"> -->
                <div @click="newGoOut">
                  <img
                    src="@/assets/images/header/logout_new.png"
                    alt=""
                    style="width: 20px; height: 20px; margin-right: 3px"
                  />
                  退出登录
                </div>
              </div>
            </div>

            <div slot="reference" class="el-dropdown-link" id="link">
              <el-image
                v-if="userInfo.headUrl"
                :src="userInfo.headUrl"
                style="
                  width: 34px;
                  height: 34px;
                  border-radius: 17px;
                  margin-right: 6px;
                "
              >
                <div slot="error" class="image-slot">
                  <img
                    src="@/assets/img/base/avtar-default.png"
                    style="width: 34px; height: 34px"
                  />
                </div>
              </el-image>
              <img
                v-else
                src="@/assets/img/base/avtar-default.png"
                style="width: 34px; height: 34px"
              />

              <div>{{ userInfo.name }}</div>
              <i class="el-icon-arrow-down el-icon--right mr20"></i>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { removeToken, removeUserInfo } from "@/utils/auth";
import { logoutUrl } from "@/api/user";

export default {
  components: {},
  data() {
    return {
      goSpaceUrl: process.env.VUE_APP_RETURN_URL,
      collapsed: false,
      allmenu: [
        {
          icon: require("@/assets/images/header/head_index.png"),
          menuname: "首页",
          url: "/home",
        },
        {
          icon: require("@/assets/images/header/head_train.png"),
          menuname: "测试管理",
          url: "/train",
        },
        // {
        //   icon: require('@/assets/images/header/head_credential.png'),
        //   menuname: '证书模板管理',
        //   url: '/credential',
        // },
        {
          icon: require("@/assets/images/header/head_myTrain.png"),
          menuname: "我的培训",
          url: "/myTrain",
        },
      ],
      fullMenuList: [
        { name: "首页", link: "/home", roleCodes: ['1001','1002','1003'] },
        { name: "测试管理", link: "/train", roleCodes: ['1001'] },
        { name: "我的培训", link: "/myTrain", roleCodes: ['1001','1002','1003'] },
        { name: "培训统计", link: "/trainingStatistics", roleCodes: ['1001'] },
        { name: "学校人员培训情况", link: "/staffTraining", roleCodes: ['1002'] },
      ],
      fullMenuListNO: [
        { name: "首页", link: "/home" },
        { name: "测试管理", link: "/train" },
        { name: "我的培训", link: "/myTrain" },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    menuList() {
      // 如果用户未登录，只显示首页
      if (!this.userInfo.userId) {
        return [{ name: "首页", link: "/home" }];
      }

      // 获取用户角色代码
      let roleCode = '';
      if (this.userInfo.dbManagerRole && this.userInfo.dbManagerRole.roleCode) {
        roleCode = this.userInfo.dbManagerRole.roleCode;
      }

      // 根据角色代码返回对应菜单
      // 1001 区域管理员   1002 学校管理员， 1003 普通教师
      switch (roleCode) {
        case '1001': // 区域管理员：首页、我的培训、测试管理、培训统计
          return [
            { name: "首页", link: "/home" },
            // { name: "我的培训", link: "/myTrain" },
            // { name: "测试管理", link: "/train" },
            // { name: "培训统计", link: "/trainingStatistics" }
          ];
        case '1002': // 学校管理员：首页、我的培训、培训人员情况
          return [
            { name: "首页", link: "/home" },
            // { name: "我的培训", link: "/myTrain" },
            //   { name: "测试管理", link: "/train" },
            // { name: "学校人员培训情况", link: "/staffTraining" },
            // { name: "考练中心", link: "/examinationCenter" }
          ];
        case '1003': // 普通教师：首页、我的培训
          return [
            { name: "首页", link: "/home" },
            // { name: "我的培训", link: "/myTrain" }
          ];
        default:
          // 默认只显示首页
          return [{ name: "首页", link: "/home" }];
      }
    },
  },
  watch: {},
  methods: {
    async login() {
      //生产上临时写死跳转地址
      // window.location.href = 'https://basic.sc.smartedu.cn/ThirdPortalService/user/otherlogin!login.ac?appkey=C56DA16ECBC56FBEEC908DA09E45C72C917A80118F057FA1F0B5BAE41CC9CC9DECD5BDB7133FE17C328C5D37B37CA8E7&pkey=5D79CA42E45C5273DF8532D09E1F158B15E25919CDB958940F84D5E63F5F53A1ECD5BDB7133FE17C328C5D37B37CA8E7&params=718F83A5347CBFDB7D1A9065FA090FE949D92330BB9A3351FE0715C5B8A3E86F37916C1004E835C7C7F964E3F301477F7D37F04485FA8707845DAAA23356236ED1D326CF5A5E3C263470516EE9B4A2ED';
      //测试环境需动态获取
      try {
        // 调用接口获取登录URL
        // const res = await logoutUrl();
        // if (res.returnCode === "200" && res.returnData) {
        //   // 跳转到登录页面
        //   window.location.href = res.returnData;
        // } else {
        //   this.$message.error(res.returnMessage || "获取登录地址失败");
        // }
        // window.location.href = res.returnData;
        this.$router.push({ path: "/login" });
      } catch (error) {
        console.error("获取登录地址失败:", error);
        this.$message.error("获取登录地址失败，请重试");
      }
    },
    // 新的退出方法 - 调用接口获取跳转地址
    async newGoOut() {
      try {
        this.$confirm("是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            removeToken();
            removeUserInfo();
            this.$store.dispatch("user/resetUserInfo");

            // 直接使用 window.location 跳转，这会完全刷新页面
            // window.location = this.$process.VUE_APP_RETURN_URL;
            this.$router.push({ path: "/login" });
          })
          .catch(() => {
            console.log("用户取消退出");
          });
      } catch (error) {
        console.error("退出登录失败:", error);
        this.$message.error("退出登录失败，请重试");
      }
    },
    goOut() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removeToken();
        removeUserInfo();
        this.$store.dispatch("user/resetUserInfo");
        location.reload();
      });
    },
    goOut1() {
      this.$confirm("是否返回空间?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.location = this.$process.VUE_APP_RETURN_URL;
      });
    },

    // 返回空间方法
    goSpace() {
      window.location = this.goSpaceUrl;
      removeToken();
      removeUserInfo();
    },
    changeMenu(item, i) {
      console.log(item, "菜单--------------");
      if (item.link) {
        this.$router.push(item.link);
      } else {
        // 兼容旧代码
        if (item.name == "首页") {
          this.$router.push("/home");
        } else if (item.name == "测试管理") {
          this.$router.push("/list");
        } else if (item.name == "我的培训") {
          this.$router.push("/myTrain");
        } else if (item.name == "培训统计") {
          this.$router.push("/trainingStatistics");
        } else if (item.name == '培训人员情况' || item.name == '学校人员培训情况') {
          this.$router.push("/staffTraining");
        }
      }
    },
    goTrainManage() {
      this.$router.push("/list");
    },
    goMyTrain() {
      this.$router.push("/myTrain");
    },
  },
  created() {},
  mounted() {
    console.log(this.userInfo, "userInfo");

    if (this.userInfo.roleList && this.userInfo.roleList[0].roleCode == "6") {
      this.allmenu = [
        {
          icon: require("@/assets/images/header/head_index.png"),
          menuname: "首页",
          url: "/home",
        },

        {
          icon: require("@/assets/images/header/head_myTrain.png"),
          menuname: "我的培训",
          url: "/myTrain",
        },
      ];
    }
  },
};
</script>

<style lang="scss">
// el-menu菜单选中、悬浮效果优化
#eventsyshead.el-menu--horizontal > .el-menu-item.is-active {
  background-color: rgba(191, 217, 255, 0.25) !important;
  border-bottom: none !important;
  color: #fff !important;
}

#eventsyshead .el-menu-item {
  height: 64px;
  line-height: 64px;
  border-bottom: none !important;
}

#eventsyshead .el-menu-item:hover,
#eventsyshead .el-menu-item:active {
  background-color: rgba(191, 217, 255, 0.089) !important;
}
</style>
<style lang="scss" scoped>
// ::v-deep .el-menu{
//   .el-menu-item{
//     .is-active{
//       background-color: rgba(230,247,255,0.25) !important;
//       height: 60px;

//     }
//   }
// }

.header {
  background-color: #1890ff;
  height: 64px;
  padding: 0 30px;
  color: #fff;
  display: flex;
  align-items: center;

  .header_left {
    font-size: 22px;
    font-weight: 400;

    &_name {
      font-size: 28px;
    }

    img {
      margin-right: 20px;
      width: 50px;
      height: 35px;
    }
  }

  &_menuname {
    font-size: 16px;

    &_icon {
      margin-right: 5px;
      margin-top: -4px;
    }
  }

  .header_right {
    p {
      margin: 0 5px;
    }

    .backbtn {
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss" scoped>
// 定义更多 SCSS 变量
$bg-top-image: url("@/assets/img/base/bg-top.png");
$active-bg-color: #1571d1;
$hover-bg-color: #1571d1;
$text-color: #fff;

.headers-page {
  width: 100%;
  background: $bg-top-image no-repeat;
  background-size: 100% 100%;
  height: 70px;
  color: $text-color;

  .in-header {
    width: 1200px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-button {
      background: transparent;
      color: $text-color;
      border-color: $text-color;
    }

    .header-title {
      margin-right: 4%;
      font-weight: bold;
      font-size: 20px;
      display: flex;
      align-items: center;
    }

    .header-menu-list-container {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;

      div {
        margin-right: 10px;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 22px;
        cursor: pointer;
        color: $text-color;
        font-weight: bold;

        &:hover {
          color: $text-color;
          background: $hover-bg-color;
          position: relative;
        }

        &.active {
          color: $text-color;
          background: $active-bg-color;
          position: relative;
        }
      }
    }

    .test {
      position: absolute;
      right: 30px;
      top: 55px;
      width: 120px;
      height: 30px;
      background: red;
    }

    .el-dropdown-link {
      min-width: 120px;
      height: 55px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;

      img {
        margin-right: 6px;
      }
    }
  }
}

.message-list {
  width: 100%;
  max-height: 280px;
  overflow-y: auto;

  .more {
    width: 100%;
    text-align: center;
    padding: 10px 0 20px;
  }

  .list-infine {
    width: calc(100% - 30px);
    padding: 15px;
    cursor: pointer;

    .list-item {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e5e5;

      .left-icon {
        width: 30px;
        height: 30px;
        font-size: 20px;
        color: #444;
        border: 1px solid #e5e5e5;
        border-radius: 15px;
        display: flex;
        background: #e5e5e5;
        justify-content: center;
        align-items: center;
        position: relative;

        .point {
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background: #ff0000;
        }
      }

      .right-list {
        width: calc(100% - 46px);

        .type {
          font-size: 15px;
          font-weight: bold;
        }

        .msg-error {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 30px;
          line-height: 30px;
          color: #ff0000;
        }

        .msg {
          width: 100%;
          margin-top: 4px;
          line-height: 30px;
        }

        .time {
          font-size: 12px;
          color: #888;
        }
      }
    }
  }
}

.drop-list {
  width: 100%;
  max-height: 280px;
  text-align: left;
  border-radius: 2px;
  // 添加负 margin 来抵消 popover 的默认 padding
  margin: -12px;
  width: calc(100% + 24px);

  .base-user-info {
    width: 100%;
    height: 110px;
    border-radius: 2px;
    padding: 15px;
    background: url("@/assets/img/base/bg-person.png") no-repeat;
    background-size: 100% 100%;

    .avatar {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      color: $text-color;
      font-size: 16px;

      img {
        margin-right: 10px;
        margin-left: 10px;
      }
    }

    .info {
      color: $text-color;
      margin-left: 10px;
      width: 100%;
      padding: 2px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .menu-list {
    box-sizing: border-box;
    width: 100%;
    border-radius: 2px;
    padding: 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
      height: 25%;
      padding: 5px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #2c2e33;

      &:hover {
        color: #407ef9;
      }
    }
  }
}

.manage-btn {
  /*color: #00A0FF;*/
  /*margin-right: 90px;*/
}
</style>
