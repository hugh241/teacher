<template>
  <div class="course">
    <BreadCrumb />
    <div class="home">
      <div class="center">
        <!-- 课程简介 -->
        <div class="intro">
          <div class="courseBg">
            <img :src="courseDetail.studyFiles.filePath" alt="" />
          </div>
          <div class="courseTxt">
            <h3 class="courseTitle">{{ courseDetail.courseName }}</h3>
            <p class="courseIntro">
              <span>课程简介：</span>{{ courseDetail.courseIntroduce }}
            </p>
            <p class="iconCont">
              <i class="el-icon-time"></i>课程时长：<span>{{
                courseDetail.studyTime
              }}</span>分钟
              <i class="el-icon-user" style="margin-left: 53px"></i>观看人数：<span>{{
                courseDetail.studyUserCount == null
                ? "0"
                : courseDetail.studyUserCount
              }}</span>人
            </p>
          </div>
        </div>
        <!-- tabs按钮 -->
        <div class="tabs">
          <SelectBtn :buttonName="buttonName1" @handleBtn="handleBtnOne" />
        </div>
        <!-- 表格内容区域 -->
        <div class="courseTab">
          <div class="biao">
            <div class="wu" v-if="!chapters || chapters.length === 0">
              <img src="@/assets/images/learningCenter/wushuju.png" alt="" />
            </div>
            <div class="left" v-for="(chapter, chapterIndex) in chapters" :key="chapterIndex">
              <h4>{{ chapter.chapterName }}</h4>
              <p class="contIntro">{{ chapter.chapterIntroduce }}</p>
              <div class="stuBg">
                <img v-if="chapter.state == 0" src="@/assets/images/learningCenter/xuexi.png" alt="" />
                <img v-if="chapter.state == 1" src="@/assets/images/learningCenter/wanchen.png" alt="" />
              </div>

              <!-- 小节课程 -->
              <div class="bar">
                <div class="bg" v-for="(
                    subsection, subsectionIndex
                  ) in chapter.studySubsections" :key="subsectionIndex"
                  @mouseover="currentSubsectionId = subsection.id" @mouseleave="currentSubsectionId = ''">
                  <img src="@/assets/images/learningCenter/book.png" alt="" />
                  <p class="subjuct">
                    {{ chapterIndex + 1 }}-{{ subsectionIndex + 1 }}
                    {{ subsection.subsectionName }}（{{
                      subsection.videoTime
                    }}）
                  </p>
                  <p v-if="subsection.state === '2'" class="type" style="color: #4d94ff">
                    •已学习
                  </p>
                  <p v-if="subsection.state === '1'" class="type" style="color: #37c864">
                    •学习中
                  </p>
                  <p v-if="subsection.state === '0'" class="type" style="color: #ff4b4b">
                    •未学习
                  </p>
                  <span class="bo" v-if="currentSubsectionId == subsection.id &&
                    subsection.state != '2'
                    " @click="goPlay()"><img src="@/assets/images/learningCenter/bo.png" alt="" /></span>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="tabOne">
              <h3>学员榜TOP10</h3>
              <span>共{{ totalNum }}人</span>
            </div>
            <div class="tabTwo" v-for="(item, index) in topData" :key="index">
              <p class="name">
                <span>
                  <img v-if="index === 0" src="@/assets/images/learningCenter/one.png" alt="" />
                  <img v-else-if="index === 1" src="@/assets/images/learningCenter/two.png" alt="" />
                  <img v-else-if="index === 2" src="@/assets/images/learningCenter/three.png" alt="" />
                  <span class="yuan" v-else>{{ index + 1 }}</span>
                </span>
                <span>{{ item.userName }}</span>
              </p>
              <p class="school">{{ item.schoolName }}</p>
              <p class="learnTime">{{ item.totalTime }}分钟</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import SelectBtn from "@/views/components/SelectBtn.vue";
import { getCourseDetails, getStudyTopList } from "@/api/getHome";

export default {
  components: {
    BreadCrumb,
    SelectBtn,
  },
  data() {
    return {
      currentSubsectionId: "",
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
        {
          title: "问答",
          type: 2,
        },
        {
          title: "问卷反馈",
          type: 3,
        },
        {
          title: "培训心得",
          type: 4,
        },
        {
          title: "培训作业",
          type: 5,
        },
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
    };
  },
  created() { },
  mounted() {
    const courseId = this.$route.query.courseId;
    getCourseDetails(courseId).then((res) => {
      if (res.returnCode == "200") {
        // console.log(res);
        this.courseDetail = res.returnData;
        this.chapters = res.returnData.chapters;
        // console.log(this.chapters, "sss");
      } else {
        this.$message.error("获取课程详情信息失败");
        return;
      }
    });
    getStudyTopList({ courseId: courseId }).then((res) => {
      if (res.returnCode == 200) {
        // console.log('xx',res);
        this.topData = res.returnData.studyTopList;
        this.totalNum = res.returnData.studyUserCount;
      } else {
        this.$message.error("获取排名信息失败");
        return;
      }
    });
  },
  methods: {
    loadBorderList() { },
    //tabs按钮
    handleBtnOne(item) {
      this.btnIndex = item.type;
    },
    //点击播放视频
    goPlay() { },
  },
};
</script>

<style lang='scss' scoped>
.home {
  overflow: hidden;
  margin: 10px;
  background: #fff;
  min-height: calc(100vh - 148px);
  padding: 0 30px;
  border-radius: 10px;

  .center {
    padding: 37px 0 103px 0;
    margin: 0 auto;
    width: 1400px;
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
          height: 60px;
          padding: 20px 0;
          font-size: 14px;
          font-weight: 500;
          color: #979797;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;

          span {
            color: #000000;
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
      margin: 62px 0 31px 0;
    }

    .courseTab {
      display: flex;

      .biao {
        width: 984px;
        display: flex;
        flex-direction: column;

        .wu {
          width: 984px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .left {
          padding-bottom: 40px;
          width: 984px;
          position: relative;

          h4 {
            font-size: 20px;
            font-weight: 500;
            color: #005ce8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .contIntro {
            width: 886px;
            padding: 12px 0px 19px 0px;
            font-size: 14px;
            font-weight: 400;
            color: #807f7f;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .stuBg {
            position: absolute;
            right: 0;
            top: 0;
            width: 78px;
            height: 63px;
            border: 1px dashed #c2c2c2;
          }

          .bar {
            .bg {
              display: flex;
              align-items: center;
              width: 984px;
              height: 44px;

              img {
                width: 22px;
                height: 25px;
              }

              .subjuct {
                width: 500px;
                padding-left: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .type {
                padding-left: 175px;
              }

              .bo {
                padding-left: 157px;
                width: 20px;
                height: 20px;

                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }

            .bg:hover {
              background: #f4f4f4;
              cursor: pointer;
            }
          }
        }
      }

      .right {
        flex: 1;
        padding-left: 94px;

        .tabOne {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 22px;

          h3 {
            font-size: 24px;
          }

          span {
            font-size: 14px;
            font-weight: 500;
            color: #8f8f8f;
          }
        }

        .tabTwo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-top: 1px solid #f0f0f0;

          .name {
            display: flex;
            align-items: center;
            width: 80px;

            .yuan {
              display: inline-block;
              width: 17px;
              height: 17px;
              background: #638eff;
              text-align: center;
              line-height: 17px;
              border-radius: 50%;
              margin: 0 4px 0 4px;
            }
          }

          .school {
            color: #8f8f8f;
            width: 120px;
            padding-left: 10px;
          }

          .learnTime {
            width: 100px;
            color: #8f8f8f;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>