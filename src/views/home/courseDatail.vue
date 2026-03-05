<template>
  <div class="course">
    <BreadCrumb :type="1" />
    <div class="home">
      <div class="center">
        <!-- 课程简介 -->
        <div class="intro">
          <div class="courseBg" v-if="courseDetail.studyFiles">
            <img :src="courseDetail.studyFiles.filePath" alt="" />
          </div>
          <div class="courseTxt">
            <h3 class="courseTitle">{{ courseDetail.courseName }}</h3>
            <div class="courseIntro">
              <div class="box-1">课程简介：</div>
              <div class="box-2" v-html="formatChapterIntroduce(courseDetail.courseIntroduce)"></div>
            </div>
            <p class="iconCont">
              <i class="el-icon-time"></i>课程时长：<span>{{
                courseDetail.studyTime
              }}</span
              >分钟
              <i class="el-icon-user" style="margin-left: 53px"></i
              >观看人数：<span>{{
                courseDetail.studyUserCount == null
                  ? "0"
                  : courseDetail.studyUserCount
              }}</span
              >人
              <i class="el-icon-pie-chart" style="margin-left: 53px"></i
              >已完成/总学时：<span>{{
                hoursAndScore.finishedHours || "0/0"
              }}</span>
              <i class="el-icon-s-opportunity" style="margin-left: 53px"></i
              >学分：<span>{{
                parseInt(hoursAndScore.totalStudyScore) || 0
              }}</span
              >学分
            </p>
          </div>
        </div>
        <!-- tabs按钮 -->
        <div class="tabs">
          <SelectBtn :buttonName="buttonName1" @handleBtn="handleBtnOne" />
        </div>
        <!-- 表格内容区域 -->

        <!-- 课程小节 -->
        <div class="courseTab">
          <CourseChapters v-if="btnIndex == 0" :courseDetail="courseDetail" />
          <CourseNotes v-if="btnIndex == 1" :courseDetail="courseDetail" />
          <QAndA v-if="btnIndex == 2" :courseDetail="courseDetail" />
          <QuesFeedback v-if="btnIndex == 3" :courseDetail="courseDetail" />
          <CourseFeel
            v-if="btnIndex == 4"
            :courseDetail="courseDetail"
            @refreshFun="refreshFun"
          />
          <CourseWork
            v-if="btnIndex == 5"
            :courseDetail="courseDetail"
            @refreshFun="refreshFun"
          />
          <TrainingHonor v-if="btnIndex == 6" :courseDetail="courseDetail" />
          <Ke v-if="btnIndex == 7" :courseDetail="courseDetail" />
          <!-- <LeaderBoard :topData="topData" :totalNum="totalNum" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import SelectBtn from "@/views/components/SelectBtn.vue";
import CourseNotes from "./components/CourseNotes.vue";
import LeaderBoard from "./components/LeaderBoard.vue";
import QAndA from "./components/QAndA.vue";
import QuesFeedback from "./components/QuesFeedback.vue";
import CourseChapters from "./components/CourseChapters.vue";
import CourseFeel from "./components/CourseFeel.vue";
import CourseWork from "./components/CourseWork.vue";
import TrainingHonor from "./components/trainingHonor.vue";
import Ke from "./components/kechengBtn.vue";
import { getCourseDetails, getStudyTopList } from "@/api/getHome";
import { getCourseFinishedHour } from "@/api/myTrain";
import { mapState } from "vuex";
import courseDatail from "@/assets/json/getCourseDetails_1983723370145034240.json";


export default {
  components: {
    BreadCrumb,
    SelectBtn,
    LeaderBoard, //排行榜
    CourseChapters, //课程
    CourseNotes, // 笔记
    QAndA, // 问答
    QuesFeedback, // 问卷反馈
    CourseFeel, //心得
    CourseWork, //作业
    TrainingHonor, // 培训证书
    Ke, //课程考练
    courseDatail,
  },
  data() {
    return {
      //按钮
      btnIndex: 0,
      buttonName1: [
        {
          title: "章节",
          type: 0,
        },
        {
          title: "笔记",
          type: 1,
        },
        // {
        //   title: "问答",
        //   type: 2,
        // },
        // {
        //   title: '课程考练',
        //   type: 7,
        //   count:1
        // },

        // {
        //   title: '培训心得',
        //   type: 4,
        // },
        // {
        //   title: '培训作业',
        //   type: 5,
        // },
        // {
        //   title: "培训证书",
        //   type: 6,
        // },
        // {
        //   title: "问卷反馈",
        //   type: 3,
        // },
      ],
      //内容信息
      courseDetail: {},
      //章节数据
      chapters: [],
      //top数据
      topData: [],
      totalNum: 0,
      // 控制按钮的显示状态
      showDownload: {},
      // 学时和学分数据
      hoursAndScore: {},
    };
  },
  computed: {
    ...mapState({
      type: (state) => state.type.type,
    }),
  },
  watch: {
    // console.log('2222',this.$store.state.type)
    type(newVal, oldVal) {
      // 处理type变化的逻辑
      console.log("type值发生变化，新值为：", newVal);
      if (newVal == 1) {
        this.getData();
      } else if (newVal == 2) {
        this.getData();
      }
    },
  },
  created() {},
  mounted() {
    this.getData();
    const courseId = this.$route.query.courseId;
    // getStudyTopList({ courseId: courseId }).then((res) => {
    //   if (res.returnCode == 200) {
    //     // console.log('xx',res);
    //     this.topData = res.returnData.studyTopList;
    //     this.topData.sort((a, b) => b.totalTime - a.totalTime);
    //     // console.log('排行',this.topData);
    //     this.totalNum = res.returnData.studyUserCount;
    //   } else {
    //     this.$message.error("获取排名信息失败");
    //     return;
    //   }
    // });
  },
  methods: {
    formatChapterIntroduce(content) {
      if (!content) return "";
      // 使用正则匹配图片标签，并添加样式
      return content.replace(
        /<img([^>]*)>/g,
        '<img $1 style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">'
      );
    },
    refreshFun() {
      this.getData();
    },
    loadBorderList() {},
    //tabs按钮
    handleBtnOne(item) {
      // console.log(item,'tabs');
      // if (item.type == 6) {
      //   this.$message.warning('该培训证书正在设计中，培训结束后统一下放，之前自动生成的证书不正确，不能使用！请各位老师知悉！')
      // }
      this.btnIndex = item.type;
    },
    //获得数据
    getData() {
      const courseId = this.$route.query.courseId;
      // 全员普及培训高并发临时本地存数据
      if ( courseId == 1983723370145034240 ) {
          let res = courseDatail
          this.courseDetail = res.returnData;
          this.chapters = res.returnData.chapters;
          // 获取课程完成时长和学分
          this.getCourseFinishedHour();
          let data = { title: "培训心得", type: 4 };
          let data1 = { title: "培训作业", type: 5 };
          let data2 = { title: "课程考练", type: 7 };

          if (res.returnData.hasPutNotes == 0) {
            data.count = 1;
          } else {
            data.count = 0;
          }
          if (res.returnData.hasPutHomeworks == 0) {
            data1.count = 1;
          } else {
            data1.count = 0;
          }
          // 在插入之前，首先清空 buttonName1 数组或检查重复值
          this.buttonName1 = this.buttonName1.filter(
              (item) => item.type !== 4 && item.type !== 5 && item.type !== 7
          );

          let index = this.buttonName1.length;
          const toInsert = [];

          if (res.returnData.isExperience == "1") {
            toInsert.push(data);
          }

          if (res.returnData.isHomework == "1") {
            toInsert.push(data1);
          }

          if (res.returnData.assessState != "-1") {
            if (res.returnData.assessState == null) {
              data2.count = 1;
            } else {
              data2.count = 0;
            }
            toInsert.push(data2);
          }

          this.buttonName1.push(...toInsert);
          // 新增过滤逻辑：如果课程未开始，只保留章节按钮
          this.filterButtonsByCourseStatus();
      }else {
        getCourseDetails(courseId).then((res) => {
          if (res.returnCode == "200") {
            this.courseDetail = res.returnData;
            this.chapters = res.returnData.chapters;
            // 获取课程完成时长和学分
            this.getCourseFinishedHour();
            let data = { title: "培训心得", type: 4 };
            let data1 = { title: "培训作业", type: 5 };
            let data2 = { title: "课程考练", type: 7 };

            if (res.returnData.hasPutNotes == 0) {
              data.count = 1;
            } else {
              data.count = 0;
            }
            if (res.returnData.hasPutHomeworks == 0) {
              data1.count = 1;
            } else {
              data1.count = 0;
            }
            // 在插入之前，首先清空 buttonName1 数组或检查重复值
            this.buttonName1 = this.buttonName1.filter(
                (item) => item.type !== 4 && item.type !== 5 && item.type !== 7
            );

            let index = this.buttonName1.length;
            const toInsert = [];

            if (res.returnData.isExperience == "1") {
              toInsert.push(data);
            }

            if (res.returnData.isHomework == "1") {
              toInsert.push(data1);
            }

            if (res.returnData.assessState != "-1") {
              if (res.returnData.assessState == null) {
                data2.count = 1;
              } else {
                data2.count = 0;
              }
              toInsert.push(data2);
            }

            this.buttonName1.push(...toInsert);
            // 新增过滤逻辑：如果课程未开始，只保留章节按钮
            this.filterButtonsByCourseStatus();
          } else {
            this.$message.error("获取课程详情信息失败");
          }
        });

      }
    },
    // 根据课程状态过滤按钮
    filterButtonsByCourseStatus() {
      if (this.courseDetail.startDate) {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // 格式化为 yyyy-mm-dd
        const startDate = this.courseDetail.startDate;

        // 如果课程开始时间大于今天（课程未开始），只保留章节按钮
        if (startDate > todayStr) {
          this.buttonName1 = this.buttonName1.filter((item) => item.type === 0);
        }
      }
    },
    // 获取课程完成时长和学分
    async getCourseFinishedHour() {
      if ( this.courseDetail.id == null ) {
        return;
      }
      let params = {
        courseIds: [this.courseDetail.id], // 使用 courseDetail 的 id 字段
      };
      const res = await getCourseFinishedHour(params);
      if (res.returnCode == 200) {
        this.hoursAndScore = res.returnData;
        return res.returnData;
      } else {
        this.$message.error(res.returnMessage);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  min-height: calc(100vh - 148px);
  padding: 0 20px;
  border-radius: 10px;
  font-size: 16px;

  .center {
    padding: 37px 0 103px 0;
    margin: 0 auto;
    // width: 1400px;
    height: 100%;

    .intro {
      display: flex;

      .courseBg {
        width: 326px;
        height: 159px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .courseTxt {
        flex: 1;
        padding-left: 29px;

        .courseTitle {
          font-size: 20px;
          font-weight: 500;
          color: #000000;
        }

        .courseIntro {
          min-height: 90px;
          padding: 15px 0 5px 0;
          font-size: 14px;
          font-weight: 500;
          color: #979797;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          display: flex;
          justify-content: space-between;
          .box-1 {
            width: 10%;
          }
          .box-2 {
            width: 90%;
          }
        }

        .iconCont {
          display: flex;
          align-items: center;

          i {
            color: #2f61ff;
            font-size: 24px;
            margin-right: 12px;
          }

          span {
            color: #2f61ff;
          }
        }
      }
    }

    .tabs {
      margin: 30px 0;
    }

    .courseTab {
      display: flex;
      width: 1200px;
    }
  }
}
</style>
