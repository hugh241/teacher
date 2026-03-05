<!-- 首页 -->
<template>
  <div class="home_wrap">
    <Header></Header>
    <div class="carousel">
      <!-- 轮播图 -->
      <el-carousel autoplay v-model="currentIndex" loop>
        <el-carousel-item>
          <div class="demo-carousel">
            <img src="@/assets/images/learningCenter/ban.png" alt="" />
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="demo-carousel">
            <img src="@/assets/images/learningCenter/banner1.png" alt="" />
          </div>
        </el-carousel-item>
        <!-- <el-carousel-item v-for="(item, index) in bannerList" :key="index">
          <div class="demo-carousel">
            <img style="width: 100%; height: 100%" :src="item" alt="" />
          </div>
        </el-carousel-item> -->
      </el-carousel>
    </div>
    <!-- <div class="home" v-if="$process.VUE_APP_ALL_PROVINCE == '1'"> -->
    <div class="home">
      <!-- 1 -->
      <!-- 省级培训： -->
      <!-- <div class="selectBtn" v-if="$process.VUE_APP_ALL_PROVINCE == '1'"> -->
      <div class="selectBtn">
        <div class="button-left">
          <!-- <div class="danyi">省级培训：</div> -->
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo1"
          ></SelectBtn>
        </div>
<!--        <div class="button-right" @click="goMore1">-->
<!--          <li class="more">查看更多</li>-->
<!--        </div>-->
      </div>
      <!-- 课程列表 -->
      <!-- <CourseList
        v-if="$process.VUE_APP_ALL_PROVINCE == '1'"
        :listData="listData0"
        :isYes="$process.VUE_APP_ALL_PROVINCE"
        v-loading="loading1"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      /> -->
      <CourseList
        :listData="listData0"
        :isYes="$process.VUE_APP_ALL_PROVINCE"
        v-loading="loading1"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @course-click="handleCourseClick"
      />
      <!-- 2 -->
      <!-- 市级培训： -->
      <!-- <div
        class="selectBtn"
        v-if="role == '3' || role == '4' || role == '5' || role == '6'"
      >
        <div class="button-left">
          <div class="danyi">
            {{ $process.VUE_APP_ALL_CITY == "1" ? "州" : "市" }}级培训：
          </div>
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo2"
          ></SelectBtn>
        </div>
        <div class="button-right" @click="goMore2">
          <li class="more">查看更多</li>
        </div>
      </div> -->
      <!-- 课程列表 -->
      <!-- <CourseList
        v-if="role == '3' || role == '4' || role == '5' || role == '6'"
        :listData="listData1"
        :isYes="1"
        v-loading="loading2"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      /> -->
      <!-- 3 -->
      <!-- 县级培训： -->
      <!-- <div class="selectBtn" v-if="role == '4' || role == '5' || role == '6'">
        <div class="button-left">
          <div class="danyi">县级培训：</div>
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo3"
          ></SelectBtn>
        </div>
        <div class="button-right" @click="goMore3">
          <li class="more">查看更多</li>
        </div>
      </div> -->
      <!-- 课程列表 -->
      <!-- <CourseList
        v-if="role == '4' || role == '5' || role == '6'"
        :listData="listData2"
        :isYes="1"
        v-loading="loading3"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      /> -->
      <!-- 4 -->
      <!-- 校级培训： -->
      <!-- <div class="selectBtn" v-if="role == '5' || role == '6'">
        <div class="button-left">
          <div class="danyi">校级培训：</div>
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo4"
          ></SelectBtn>
        </div>
        <div class="button-right" @click="goMore4">
          <li class="more">查看更多</li>
        </div>
      </div> -->
      <!-- 课程列表 -->
      <!-- <CourseList
        v-if="role == '5' || role == '6'"
        :listData="listData3"
        :isYes="1"
        v-loading="loading4"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      /> -->
    </div>
    <!-- <div
      class="home"
      v-if="
        $process.VUE_APP_ALL_PROVINCE != '1' &&
        $process.VUE_APP_IS_MBID == 'qingshui'
      "
    >
      <div class="selectBtn">
        <div class="button-left">
          <div class="danyi">县级培训：</div>
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo3"
          ></SelectBtn>
        </div>
        <div class="button-right" @click="goMore3">
          <li class="more">查看更多</li>
        </div>
      </div>
      <CourseList
        :listData="listData2"
        :isYes="1"
        v-loading="loading3"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      />
    </div> -->
    <!-- <div
      class="home"
      v-if="
        $process.VUE_APP_ALL_PROVINCE != '1' &&
        $process.VUE_APP_IS_MBID == 'plsz'
      "
    >
     <div class="selectBtn">
        <div class="button-left">
          <div class="danyi">校级培训：</div>
          <SelectBtn
            :buttonName="buttonName2"
            @handleBtn="handleBtnTwo4"
          ></SelectBtn>
        </div>
        <div class="button-right" @click="goMore4">
          <li class="more">查看更多</li>
        </div>
      </div>
      <CourseList
        :listData="listData3"
        :isYes="1"
        v-loading="loading4"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      />
    </div> -->
    <div class="tip" @click="openBook">
      <img src="@/assets/img/base/icon_cz.png">
      <p>注册账号</p>
    </div>
  </div>
</template>

<script>
import CourseList from "@/views/components/CourseList.vue";
// import pagination from "@/components/pagination/index.vue";
import SelectBtn from "@/views/components/SelectBtn.vue";
import * as service from "@/api/getHome";
import { mapGetters } from "vuex";
import Header from "@/components/header/index";
import { logoutUrl } from "@/api/user";
import homeList from "@/assets/json/homeLis.json";

export default {
  components: {
    CourseList,
    // pagination,
    SelectBtn,
    Header,
    homeList,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      role: null,
      isYes: 0,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      currentIndex: 0,
      bannerList: [],
      //筛选按钮
      buttonName1: [
        {
          title: "省",
          type: 0,
        },
      ],
      buttonName2: [
        {
          title: "全部",
          type: 0,
        },
        {
          title: "未开始",
          type: 1,
        },
        {
          title: "进行中",
          type: 2,
        },
        {
          title: "已结束",
          type: 3,
        },
      ],
      btnOneIndex: 0,
      btnTwoIndex: 0,
      //课程列表
      listData0: [],
      listData1: [],
      listData2: [],
      listData3: [],
      //数据集合
      payload0: {
        //课程名称
        courseName: "",
        //课程级别（0：省级；1：市级；2：区县级；3：校级）
        level: "0",
        //课程状态（1：未开始，2：进行中，3: 已结束）
        type: "",
        pageNo: "1",
        pageSize: "6",
      },
      payload1: {
        //课程名称
        courseName: "",
        //课程级别（0：省级；1：市级；2：区县级；3：校级）
        level: "1",
        //课程状态（1：未开始，2：进行中，3: 已结束）
        type: "",
        pageNo: "1",
        pageSize: "5",
      },
      payload2: {
        //课程名称
        courseName: "",
        //课程级别（0：省级；1：市级；2：区县级；3：校级）
        level: "2",
        //课程状态（1：未开始，2：进行中，3: 已结束）
        type: "",
        pageNo: "1",
        pageSize: "5",
      },
      payload3: {
        //课程名称
        courseName: "",
        //课程级别（0：省级；1：市级；2：区县级；3：校级）
        level: "3",
        //课程状态（1：未开始，2：进行中，3: 已结束）
        type: "",
        pageNo: "1",
        pageSize: "5",
      },
      //分页
      total: 0,
    };
  },
  created() {},
  mounted() {
    // this.pageResize()
    // window.onresize = () => {
    //   this.pageResize()
    // }

    this.bannerList = [];
    this.getTrainList0();
    // this.getTrainList1();
    // this.getTrainList2();
    // this.getTrainList3();
    // this.getCarouselList();

    this.role = this.userInfo.roleList ? this.userInfo.roleList[0].roleCode : '';
  },
  methods: {
    // 新增：处理课程点击事件
    async handleCourseClick(course) {
      // 检查用户是否登录
      const isLoggedIn = this.userInfo.userId;

      if (!isLoggedIn) {
        // 未登录，弹出确认对话框
        this.$confirm("您还未登录，无法查看详情，是否登录？", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
        })
          .then(async () => {
            try {
              // 调用接口获取登录URL
              const res = await logoutUrl();
              if (res.returnCode === "200" && res.returnData) {
                // 跳转到登录页面
                window.location.href = res.returnData;
              } else {
                this.$message.error(res.returnMessage || "获取登录地址失败");
              }
            } catch (error) {
              console.error("获取登录地址失败:", error);
              this.$message.error("获取登录地址失败，请重试");
            }
          })
          .catch(() => {
            // 用户点击"否"，不做任何操作
            console.log("用户取消登录");
          });
      } else {
        // 已登录用户，执行跳转到课程详情
        this.$router.push({ path: `coursedatail?courseId=${course.id}` });
      }
    },
    pageResize() {
      let windowWidth = document.documentElement.clientWidth;
      if (windowWidth != 1920) {
        let scaleNum = Number.parseFloat((windowWidth / 1920).toFixed(3));
        if (windowWidth <= 1366) {
          scaleNum += 0.008;
        }
        document.documentElement.style.zoom = scaleNum + 0.008;
      } else {
        document.documentElement.style.zoom = 1;
      }
    },
    //筛选第一行
    handleBtnOne(item) {
      this.btnOneIndex = item.type;
    },
    //筛选第二行
    handleBtnTwo1(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.payload0.type = "";
        this.getTrainList0();
      } else if (item.type == 1) {
        this.payload0.type = 1;
        this.getTrainList0();
      } else if (item.type == 2) {
        this.payload0.type = 2;
        this.getTrainList0();
      } else if (item.type == 3) {
        this.payload0.type = 3;
        this.getTrainList0();
      }
    },
    handleBtnTwo2(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.payload1.type = "";
        this.getTrainList1();
      } else if (item.type == 1) {
        this.payload1.type = 1;
        this.getTrainList1();
      } else if (item.type == 2) {
        this.payload1.type = 2;
        this.getTrainList1();
      } else if (item.type == 3) {
        this.payload1.type = 3;
        this.getTrainList1();
      }
    },
    handleBtnTwo3(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.payload2.type = "";
        this.getTrainList2();
      } else if (item.type == 1) {
        this.payload2.type = 1;
        this.getTrainList2();
      } else if (item.type == 2) {
        this.payload2.type = 2;
        this.getTrainList2();
      } else if (item.type == 3) {
        this.payload2.type = 3;
        this.getTrainList2();
      }
    },
    handleBtnTwo4(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.payload3.type = "";
        this.getTrainList3();
      } else if (item.type == 1) {
        this.payload3.type = 1;
        this.getTrainList3();
      } else if (item.type == 2) {
        this.payload3.type = 2;
        this.getTrainList3();
      } else if (item.type == 3) {
        this.payload3.type = 3;
        this.getTrainList3();
      }
    },
    // //分页
    // handlePageChange: function (current, pageSize) {
    //   this.payload.pageNo = current;
    //   this.payload.pageSize = pageSize;
    //   this.getTrainList();
    // },
    //跳转更多
    goMore1() {
      this.$router.push({ path: "more", query: { level: 0 } });
    },
    goMore2() {
      this.$router.push({ path: "more", query: { level: 1 } });
    },
    goMore3() {
      this.$router.push({ path: "more", query: { level: 2 } });
    },
    goMore4() {
      this.$router.push({ path: "more", query: { level: 3 } });
    },
    //课程列表
    async getTrainList0() {
      this.loading1 = true;
      this.payload0.state = 0;
      //初始化加载本地json
      let res = homeList
      //var res = await service.getTrainList(this.payload0);
      if (res.returnCode == 200) {
        this.loading1 = false;
        this.listData0 = res.returnData;
        this.total = res.returnCount;
        if (res.returnData && res.returnData.length > 0) {
          res.returnData.forEach((item) => {
            if (item.coverPath) {
              this.bannerList.push(item.coverPath);
            }
          });
        }
      } else {
        this.$message.error("获取课程列表失败");
        this.loading1 = false;
      }
      //判断session 动态改变学习人数
      if ( sessionStorage.getItem('homeList') ){
        let list = sessionStorage.getItem('homeList').split(',')
        this.listData0[0].studyUserCount = list[0];
        this.listData0[1].studyUserCount = list[1];
      }else {
        let ress = await service.getTrainList(this.payload0);
        if (ress.returnCode == 200) {
          this.loading1 = false;
          this.listData0[0].studyUserCount = ress.returnData[0].studyUserCount;
          this.listData0[1].studyUserCount = ress.returnData[1].studyUserCount;
        }else {
          return
        }
        sessionStorage.setItem('homeList', [this.listData0[0].studyUserCount, this.listData0[1].studyUserCount])
        //sessionStorage.setItem('homeList', JSON.stringify())
      }
      //homeList.returnData[0].studyUserCount += (new Date().getHours()-12) * 2000
    },
    //课程列表
    async getTrainList1() {
      this.loading2 = true;
      this.payload1.state = 0;
      var res = await service.getTrainList(this.payload1);
      if (res.returnCode == 200) {
        this.loading2 = false;
        this.listData1 = res.returnData;
        this.total = res.returnCount;
        if (res.returnData && res.returnData.length > 0) {
          res.returnData.forEach((item) => {
            if (item.coverPath) {
              this.bannerList.push(item.coverPath);
            }
          });
        }
      } else {
        this.$message.error("获取课程列表失败");
        this.loading2 = false;
      }
    },
    //课程列表
    async getTrainList2() {
      this.loading3 = true;
      this.payload2.state = 0;
      var res = await service.getTrainList(this.payload2);
      if (res.returnCode == 200) {
        this.loading3 = false;
        this.listData2 = res.returnData;
        this.total = res.returnCount;
        if (res.returnData && res.returnData.length > 0) {
          res.returnData.forEach((item) => {
            if (item.coverPath) {
              this.bannerList.push(item.coverPath);
            }
          });
        }
      } else {
        this.$message.error("获取课程列表失败");
        this.loading3 = false;
      }
    },
    //课程列表
    async getTrainList3() {
      this.loading4 = true;
      this.payload3.state = 0;
      var res = await service.getTrainList(this.payload3);
      if (res.returnCode == 200) {
        this.loading4 = false;
        this.listData3 = res.returnData;
        this.total = res.returnCount;
        if (res.returnData && res.returnData.length > 0) {
          res.returnData.forEach((item) => {
            if (item.coverPath) {
              this.bannerList.push(item.coverPath);
            }
          });
        }
      } else {
        this.$message.error("获取课程列表失败");
        this.loading4 = false;
      }
    },
    openBook () {
      window.open('https://cdnbasic.scbdc.edu.cn/平台资源/培训视频资源/实名认证操作手册2025年.pdf', '_blank');
    }
    //首页轮播图
    // async getCarouselList() {
    //   var res = await service.getCarouselList()
    //   if (res.returnCode == 200) {
    //     console.log(res.returnData)
    //     this.bannerList = res.returnData
    //   } else {
    //     this.$message.error('获取轮播图失败')
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.home_wrap {
  display: block;
  position: relative;
  z-index: 9;
  .home_title {
    display: flex;
    justify-content: space-between;
    background-color: #fff;

    p {
      font-size: 20px;
      font-weight: 600;
      padding: 5px 0px 20px 30px;
    }

    .backbtn {
      padding-right: 30px;
      color: #1890ff;
      line-height: 40px;

      img {
        position: absolute;
        margin: 8px 0px 0px -30px;
      }

      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }

  .carousel {
    width: 100%;
    height: 300px;

    .demo-carousel {
      height: 300px;

      img {
        width: 100%;
        height: 100%;
        // object-fit: cover;
      }
    }
  }

  .home {
    width: 1200px;
    margin: 0 auto;
    background: #fff;
    min-height: calc(100vh - 384px);
    padding: 0 20px;
    border-radius: 10px;
    padding-bottom: 50px;
  }

  .selectBtn {
    overflow: hidden;
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    font-size: 14px;
    margin-bottom: 30px;
  }

  .button-left {
    float: left;
    margin-top: 30px;
    width: 430px;
    // height: 95px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;

    .danyi {
      margin-top: 30px;
      float: left;
      height: 30px;
      font-size: 16px;
      font-weight: 900;
      margin-left: 15px;
      color: #165dff;
    }

    li {
      float: left;
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-weight: 500;
      border-radius: 100px 100px 100px 100px;
      cursor: pointer;
    }

    .active {
      background: #bfd9ff;
      color: #165dff;
    }
  }

  .button-right {
    float: right;
    margin-top: 30px;
    padding-right: 20px;

    .more {
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #165dff;
      border: 1px solid #165dff;
      font-weight: 400;
      cursor: pointer;
    }
  }

  .fenye {
    .el-pagination {
      display: flex;
      padding: 40px 0;
      justify-content: center !important;
    }
  }
  .tip{
    display: block;
    position: absolute;
    right: 20px;
    bottom: 30%;
    z-index: 999;
    background: #1d62ec;
    color: white;
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    img{
      display: block;
      width: 40px;
      text-align: center;
      margin: 0 auto;
    }
    p{
      margin-top: 5px;
    }
  }
}
</style>
