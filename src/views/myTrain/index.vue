<!-- 我的培训 -->
<template>
  <div class="train">
    <!-- 面包屑 -->
    <BreadCrumb></BreadCrumb>
    <div class="home_wrap">
      <div class="home">
        <div class="center">
          <!-- 用户卡片 -->
          <div class="card-box">
            <div class="left">
              <!-- 头像 -->
              <div class="head">
                <div class="block">
                  <el-avatar :size="60" :src="imgHead"></el-avatar>
                </div>
              </div>
              <div class="introduce">
                <p class="name">{{ userInfo.name }}</p>
                <p class="school">{{ userInfo.schoolName }}</p>
              </div>
            </div>
            <div class="right">
              <div class="card">
                <!-- <p class="num">{{ Math.floor(cardData.completedHour * 100) / 100 || 0 }}</p>
                <p class="title">学习时长(小时)</p> -->
                <!-- <p class="num">{{ Math.floor(hoursAndScore.finishedHours * 100) / 100 || 0 }}</p> -->
                <p class="num">{{ hoursAndScore.finishedHours || '0/0' }}</p>

                <p class="title">已完成/总学时</p>
              </div>
              <div class="card">
                <p class="num">{{ parseInt(hoursAndScore.totalStudyScore) || 0 }}</p>
                <p class="title">学分</p>
              </div>
              <div class="card">
                <p class="num">{{ cardData.getCertificate || 0 }}</p>
                <p class="title">获得证书</p>
              </div>
              <div class="card">
                <p class="num">{{ cardData.joinTrain || 0 }}</p>
                <p class="title">参与培训</p>
              </div>
              <div class="card">
                <p class="num">{{ cardData.completedTrain || 0 }}</p>
                <p class="title">完成培训</p>
              </div>
              <div class="card">
                <p class="num">{{ cardData.notCompletedTrain || 0 }}</p>
                <p class="title">未完成培训</p>
              </div>
            </div>
          </div>
          <!-- tabs标签按钮 -->
          <div class="tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="我参与的培训" name="first"></el-tab-pane>
              <el-tab-pane label="我的证书" name="second" @tab-click="handleClick"></el-tab-pane>
            </el-tabs>
          </div>

          <!-- 按钮对应内容区域 -->
          <div class="classList" v-show="btnIndex == 0">
            <div class="tabTwo">
              <SelectBtn :buttonName="buttonName2" @handleBtn="handleBtnTwo"></SelectBtn>
            </div>
            <!-- 课程对应的内容 -->
            <MyCourseList :listData="listData" :userInfo="userInfo" v-loading="loading" @getHonorList="getHonorList" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading" />
          </div>

          <div class="credList" v-show="btnIndex == 1">
            <!-- 证书对应的内容 -->
            <div class="tabTwo">
              <SelectBtn :buttonName="buttonName1" @handleBtn="handleBtnOne"></SelectBtn>
            </div>
            <CredList v-if="isShow" :honorList="honorList"  @getHonorSelf="getHonorSelf"/>
          </div>

          <div class="fenye" v-show="listData.length > 0">
            <pagination :total="total" @handlePageChange="handlePageChangeTwo"></pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import SelectBtn from "@/views/components/SelectBtn.vue";
import MyCourseList from "@/views/components/MyCourseList.vue";
import CredList from "@/views/myTrain/components/CredList.vue";
import pagination from "@/components/pagination/index.vue";
import * as service from "@/api/myTrain";
import { mapGetters } from "vuex";
import { getHonorList,getHonorSelf, getCourseFinishedHour } from "@/api/myTrain";
import myTrainList from '@/assets/json/myTrain.json';

export default {
  components: {
    BreadCrumb,
    SelectBtn,
    MyCourseList,
    CredList,
    pagination,
    myTrainList,
  },
  data() {
    return {
      isShow:true,
      role: null,
      loading: false,
      //头像
      imgHead: require("@/assets/images/learningCenter/tx.png"),
      //人名
      // myName: "王龙",
      // mySchool: "迭部县大学校",
      cardData: {},
      hoursAndScore: {},
      //按钮1
      activeName: "first",
      btnIndex: 0,
      buttonName1: [
        {
          title: "全部",
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
      btnTwoIndex: 0,
      //课程列表
      listData: [],
      //分页总数
      payload: {
        pageNo: "1",
        pageSize: "6",
        state: "",
      },
      total: 10,
      //我的证书
      honor: {
        pageNo: 1,
        pageSize: 5,
        courseId: "",
        courseName: "",
        level: "",
        userId: "",
      },
      //证书数据
      honorList: [],
      totalH: 5,
      //区分分页数据
      num: 0,
      newCourseId: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    userId() {
      return this.userInfo.userId;
    },
  },
  watch: {
    userInfo: {
      immediate: true,
      handler(newVal) {
        this.honor.userId = newVal.userId;
      },
    },
  },
  mounted() {
    // this.pageResize()
    // window.onresize = () => {
    //   this.pageResize()
    // }
    this.role = this.userInfo.roleList[0].roleCode;
    this.setMenu()
  },
  methods: {
    async getHonorSelf(val){
      console.log(val,'c');
      let params = {
        courseId: val.course_id,
        courseName:val.course_name,
        userId:val.user_id,
        userName:val.user_name
      }
      const res = await getHonorSelf(params)
      console.log(res,'sx');
      if (res.returnCode == 200) {
        this.honorList = []
        this.isShow = false
        this.getHonorList().then(res=>{
          this.isShow = true
        })

      }else{
        this.$message.error(res.returnMessage)
      }

    },
    async getCourseFinishedHour(){
      let params = {
        courseIds: this.newCourseId, // 直接传递数组
      }
      const res = await getCourseFinishedHour(params)
      if (res.returnCode == 200) {
        this.hoursAndScore = res.returnData;
        return res.returnData
      } else {
        this.$message.error(res.returnMessage)
      }
    },
    setMenu() {
      let role = this.role;
      let sheng = {
        title: "省级",
        type: 1,
      }
      let shi = {
        title: "市级",
        type: 2,
      }
      let xian = {
        title: "县级",
        type: 3,
      }
      let xiao = {
        title: "校级",
        type: 4,
      }
      // if (this.$process.VUE_APP_ALL_PROVINCE == '1') {
      //   this.buttonName1.push(sheng)
      // }
      // if (role == '3' || role == '4' || role == '5' || role == '6') {
      //   this.buttonName1.push(shi)
      // }
      // if (role == '4' || role == '5' || role == '6') {
      //   this.buttonName1.push(xian)
      // }
      // if (role == '5' || role == '6') {
      //   this.buttonName1.push(xiao)
      // }
      // 市/州单独处理
      // let index1 = this.buttonName1.findIndex(item => {
      //   return item.type == '2'
      // })
      // if (this.$process.VUE_APP_ALL_CITY == '1' && index1 != -1) {
      //   this.buttonName1[index1].title = '州级'
      // }
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    pageResize() {
      let windowWidth = document.documentElement.clientWidth
      if (windowWidth != 1920) {
        let scaleNum = Number.parseFloat((windowWidth / 1920).toFixed(3))
        if (windowWidth <= 1366) {
          scaleNum += 0.008
        }
        document.documentElement.style.zoom = scaleNum + 0.008
      } else {
        document.documentElement.style.zoom = 1
      }
    },
    //tabs按钮
    handleClick(tab) {
      // console.log(tab.index,'11111');
      if (tab.index == 1) {
        this.$message.warning('该培训证书正在设计中，培训结束后统一自动生成，请各位老师知悉！')
      }
      this.btnIndex = tab.index;
      console.log(tab, this.btnIndex);
      if (this.btnIndex == '1') {
        this.total = this.totalH;
      }
      else {
        this.total = this.num;
      }
    },
    //我的培训筛选第二行
    handleBtnTwo(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.payload.state = "";
        this.getMyTrainList();
      } else if (item.type == 1) {
        this.payload.state = 1;
        this.getMyTrainList();
      } else if (item.type == 2) {
        this.payload.state = 2;
        this.getMyTrainList();
      } else if (item.type == 3) {
        this.payload.state = 3;
        this.getMyTrainList();
      }
    },
    //我的培训分页
    handlePageChange(current, pageSize) {
      this.payload.pageNo = current;
      this.payload.pageSize = pageSize;
      this.getMyTrainList();
    },
    //获得我的培训列表
    async getMyTrainList() {
      this.loading = true;
      var res = await service.getMyTrainList(this.payload);
      // 2025-11-17 临时本地缓存数据，待加接口缓存后回退
      // let res = myTrainList
      if (res.returnCode == 200) {
        console.log(res);
        this.loading = false;
        this.listData = res.returnData.reverse();
        this.total = res.returnCount;
        this.num = this.total;

        // 获取当前页所有列表项的 id 作为数组
        this.newCourseId = this.listData.map(item => item.id);

        console.log('当前页课程ID:', this.newCourseId);

        // 获取课程完成时长
        if (this.newCourseId.length > 0) {
          this.getCourseFinishedHour();
        }
      } else {
        this.loading = false;
        this.$message.error("获取课程列表失败");
      }
    },
    //获得我的培训统计
    async getMyTrainCount() {
      this.loading = true;
      var res = await service.getMyTrainCount();
      if (res.returnCode == 200) {
        this.loading = false;
        console.log(res);
        this.cardData = res.returnData;
      } else {
        this.loading = false;
        this.$message.error("获取培训统计信息失败");
      }
    },

    //我的证书统计信息
    // async getHonorCount(){
    //   var res = await service.getHonorCount();
    //   if(res.returnCode == 200){
    //     console.log('我的证书统计',res);
    //   }
    // },

    //获得我的证书数据
    async getHonorList() {
      this.payload.userId = this.userId;
      var res = await getHonorList(this.honor);
      if (res.returnCode == 200) {
        this.honorList = res.returnData.reverse();
        this.totalH = res.returnCount;
        console.log("我的证书", res);
        if (res.returnData.length == 0) {
          this.$message.warning('暂无证书！');
        }
      }
      else {
        this.$message.error("获取我的证书信息失败");
      }
    },
    handlePageChangeTwo(current, pageSize) {
      this.honor.pageNo = current;
      this.honor.pageSize = pageSize;
      this.getHonorList();
    },
    //我的培训筛选第二行
    handleBtnOne(item) {
      this.btnTwoIndex = item.type;
      if (item.type == 0) {
        this.honor.level = '';
        this.getHonorList();
      } else if (item.type == 1) {
        this.honor.level = 0;
        this.getHonorList();
      } else if (item.type == 2) {
        this.honor.level = 1;
        this.getHonorList();
      } else if (item.type == 3) {
        this.honor.level = 2;
        this.getHonorList();
      }
      else if (item.type == 4) {
        this.honor.level = 3;
        this.getHonorList();
      }
    },
  },

  created() {
    this.getMyTrainList();
    this.getMyTrainCount();
    // this.getHonorList();
    // this.getHonorCount();
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  min-height: calc(100vh - 148px);
  padding: 0 20px;
  border-radius: 10px;
}

.center {
  width: 100%;
  max-width: 1800px; /* 添加最大宽度限制 */
}

.card-box {
  width: 100%; /* 改为100%宽度 */
  max-width: 1200px; /* 保留最大宽度 */
  min-height: 160px; /* 改为min-height防止内容溢出 */
  border-radius: 6px;
  background: #f3f8ff;
  margin: 50px auto 0; /* 改为auto居中 */
  padding: 20px 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    min-width: 200px; /* 设置最小宽度 */
    margin-right: 20px;

    .head {
      width: 64px;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0; /* 防止头像被压缩 */
    }

    .introduce {
      padding-left: 14px;
      flex: 1;
      min-width: 150px; /* 设置最小宽度 */

      .name {
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin-bottom: 5px;
        word-break: break-all; /* 长文本换行 */
      }

      .school {
        font-size: 14px;
        font-weight: 400;
        color: #979797;
        word-break: break-all; /* 长文本换行 */
      }
    }
  }

  .right {
    flex: 1;
    min-width: 600px; /* 设置最小宽度 */
    display: flex;
    // flex-wrap: wrap;
    justify-content: space-between;
    gap: 15px; /* 使用gap替代margin */

    .card {
      text-align: center;
      flex: 1;
      min-width: 100px; /* 设置卡片最小宽度 */
      max-width: 150px; /* 设置卡片最大宽度 */
      height: 100px;
      background: linear-gradient(180deg,
          #e5ecff 0%,
          rgba(255, 255, 255, 0.5) 100%);
      box-shadow: 0px 5px 4px 0px rgba(47, 97, 255, 0.05);
      border-radius: 10px;
      border: 1px solid;
      border-image: linear-gradient(180deg,
          rgba(255, 255, 255, 1),
          rgba(255, 255, 255, 0)) 1 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      .num {
        font-size: 24px;
        font-weight: bold;
        color: #2f61ff;
        margin-bottom: 8px;
        line-height: 1;
      }

      .title {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        line-height: 1.2;
      }
    }
  }
}

/* 响应式设计 */
@media screen and (max-width: 1600px) {
  .card-box {
    .right {
      .card {
        min-width: 140px;
        height: 90px;

        .num {
          font-size: 22px;
        }

        .title {
          font-size: 14px;
        }
      }
    }
  }
}

@media screen and (max-width: 1366px) {
  .card-box {
    padding: 15px 20px;

    .left {
      min-width: 250px;

      .head {
        width: 56px;
        height: 56px;
      }

      .introduce {
        .name {
          font-size: 20px;
        }

        .school {
          font-size: 13px;
        }
      }
    }

    .right {
      min-width: 500px;

      .card {
        min-width: 120px;
        height: 80px;

        .num {
          font-size: 20px;
          margin-bottom: 6px;
        }

        .title {
          font-size: 13px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .card-box {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;

    .left {
      margin-right: 0;
      justify-content: center;
      text-align: center;
    }

    .right {
      min-width: 100%;
      justify-content: center;
    }
  }
}

@media screen and (max-width: 768px) {
  .home {
    padding: 0 15px;
  }

  .center {
    width: 100%;
  }

  .card-box {
    margin-top: 30px;
    padding: 15px;

    .left {
      flex-direction: column;
      text-align: center;

      .introduce {
        padding-left: 0;
        margin-top: 10px;
      }
    }

    .right {
      min-width: 100%;

      .card {
        min-width: calc(50% - 10px); /* 两列布局 */
        max-width: calc(50% - 10px);
        height: 70px;

        .num {
          font-size: 18px;
        }

        .title {
          font-size: 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .card-box {
    .right {
      .card {
        min-width: 100%; /* 单列布局 */
        max-width: 100%;
        height: 60px;

        .num {
          font-size: 16px;
        }

        .title {
          font-size: 11px;
        }
      }
    }
  }
}

.tabs {
  width: 100%;
  height: 32px;
  line-height: 32px;
  margin: 17px 25px;
  font-size: 14px;
}

.tabTwo {
  width: 100%;
  height: 32px;
  display: flex;
  line-height: 32px;
  padding: 17px 0;
  font-size: 14px;
}

.classList,
.credList {
  padding: 0 25px;
}

.fenye {
  .el-pagination {
    display: flex;
    padding: 40px 0;
    justify-content: center !important;
  }
}
</style>
