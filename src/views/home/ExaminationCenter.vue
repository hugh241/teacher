<template>
  <div>
    <BreadCrumb :type="1" />

    <div class="app-main">
      <div class="contentHeader">
        <div class="cont_main">
          <p class="title_name">考练中心</p>
          <div class="course_introduc">
            <div class="img_con">
              <img :src="courseDetail.filePath" alt="" />
            </div>
            <div class="introduce_content">
              <p class="courseName">{{ courseDetail.courseName }}</p>
              <p class="chapter_name">{{ courseDetail.chapterName }}</p>
              <p class="chapter_introduce" v-html="courseDetail.chapterIntroduce"></p>
            </div>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeTab" @tab-click="getPanes">
        <el-tab-pane label="练习" name="exercises">
          <div class="tab_content nodata" v-if="chapterList.length === 0">
            <img src="../../assets/images/learningCenter/wushuju.png" alt="" />
            <p>暂无练习</p>
          </div>
          <div class="tab_content" v-else>
            <div class="exam_info" v-for="(item, index) in chapterList" :key="index">
              <img src="../../assets/images/learningCenter/icon-kaoshi.png" alt="" />
              <el-row class="examCon">
                <el-col :span="8">
                  <div class="exam_name">{{ item.perName }}</div>
                  <div class="exam_time">考试时间 {{ item.startTime }}~{{ item.endTime }}</div>
                </el-col>
                <el-col :span="6">
                  <p class="exam_result">成绩: {{ item.score }}</p>
                  <p class="exam_score">
                    <span>总分: {{ item.totalScore }}</span
                    ><span style="padding-left: 25px">及格分: {{ item.passScore }}</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <p v-if="item.learnState == 2" class="exam_tag complete_tag">已结束</p>
                  <p v-if="item.learnState == 1" class="exam_tag processing_tag">进行中</p>
                  <p v-if="item.learnState == 0" class="exam_tag not_begin_tag">未开始</p>
                </el-col>
                <el-col :span="4"> </el-col>
                <el-col :span="2" v-if="item.learnState == 1 && item.isLearn == 1">
                  <el-button @click="reexamine(item)" type="primary" size="large">重新考试</el-button>
                </el-col>
                <el-col :span="2" v-if="item.learnState == 1 && item.isLearn == 0">
                  <el-button @click="reexamine(item)" type="primary" size="large">参加考试</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="考试" name="examination">
          <div class="tab_content nodata" v-if="chapterList.length === 0">
            <img src="../../assets/images/learningCenter/wushuju.png" alt="" />
            <p>暂无考试</p>
          </div>
          <div class="tab_content" v-else>
            <div class="exam_info" v-for="(item, index) in chapterList" :key="index">
              <img src="../../assets/images/learningCenter/icon-kaoshi.svg" alt="" />
              <el-row align="middle" class="examCon">
                <el-col :span="8">
                  <div class="exam_name">{{ item.perName }}</div>
                  <div class="exam_time">考试时间 {{ item.startTime }}~{{ item.endTime }}</div>
                </el-col>
                <el-col :span="6">
                  <p class="exam_result">成绩: {{ item.score }}</p>
                  <p class="exam_score">
                    <span>总分: {{ item.totalScore }}</span
                    ><span style="padding-left: 25px">及格分: {{ item.passScore }}</span>
                  </p>
                </el-col>
                <el-col :span="4">
                  <p v-if="item.learnState == 2" class="exam_tag complete_tag">已结束</p>
                  <p v-if="item.learnState == 1" class="exam_tag processing_tag">进行中</p>
                  <p v-if="item.learnState == 0" class="exam_tag not_begin_tag">未开始</p>
                </el-col>
                <el-col :span="2" v-if="item.learnState == 1 && item.isLearn == 1">
                  <el-button @click="reexamine(item)" type="primary" size="large">重新考试</el-button>
                </el-col>
                <el-col :span="2" v-if="item.learnState == 1 && item.isLearn == 0">
                  <el-button @click="reexamine(item)" type="primary" size="large">参加考试</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import { getUserPaperList, getChapterDetail, getCourseDetails } from '../../api/learningCenter'
  import { getUserInfo } from '../../utils/auth'
  import BreadCrumb from '@/components/Breadcrumb/index.vue'
  export default {
    name: 'examinationCenter',
    components: { BreadCrumb },
    data() {
      return {
        activeTab: 'exercises',
        courseDetail: [],
        chapterList: [],
        exam_type: '1',
        courseId: '', //课程ID
        chapterId: '', // 章节ID
        userId: '', // 用户ID
        userInfo: getUserInfo(),
        BASEURL: process.env.VUE_APP_VIEW_URL,
        headerStyle: 'blue-header',
      }
    },
    created() {
      this.chapterId = this.$route.query.chapterId
      this.courseId = this.$route.query.courseId
      this.userId = this.userInfo.id

      this.getHandlerUserPaperList()
      this.getHandlerChapterDetail()
    },
    methods: {
      handleBack() {
        this.$router.back()
      },
      getHandlerChapterDetail() {
        if (this.chapterId) {
          getChapterDetail(this.chapterId).then(res => {
            if (res.returnCode != '200') {
              this.$Message.error('获取课程章节详情失败')
              return
            }
            this.courseDetail = res.returnData[0]
          })
        } else {
          getCourseDetails(this.courseId).then(res => {
            if (res.returnCode != '200') {
              this.$Message.error('获取课程详情失败')
              return
            }
            let path = res.returnData.studyFiles.filePath.replace(this.BASEURL, '')
            this.courseDetail = res.returnData
            this.courseDetail.filePath = path
          })
        }
      },
      getHandlerUserPaperList() {
        let that = this
        let params = {}
        if (this.chapterId) {
          params = {
            type: that.exam_type, //类型 1：练习 2：考试 4：问卷
            level: '2', //层次类型 【1：课程 2：章节 3：小节 4：问卷】
            courseId: that.courseId, //课程ID
            chapterId: that.chapterId, // 章节ID
            creator: that.userInfo.userId, // 用户ID
          }
        } else {
          params = {
            type: that.exam_type, //类型 1：练习 2：考试 4：问卷
            level: '1', //层次类型 【1：课程 2：章节 3：小节 4：问卷】
            courseId: that.courseId, //课程ID
            creator: that.userInfo.userId, // 用户ID
          }
        }
        getUserPaperList(params).then(res => {
          this.chapterList = []
          if (res.returnCode == '200' && res.returnData.length > 0) {
            that.chapterList = res.returnData
          } else {
            that.chapterList = []
          }
        })
      },
      getPanes(tab, event) {
        let e = tab.name
        let that = this
        if (e === 'exercises') {
          that.exam_type = '1'
        } else {
          that.exam_type = '2'
        }
        this.getHandlerUserPaperList()
      },
      reexamine(item) {
        this.$router.push({
          path: 'examination',
          query: {
            examId: item.id,
          },
        })
      },
    },

    mounted() {},
  }
</script>
<style lang="scss" scoped>
  .app-main {
    overflow: hidden;
    margin: 10px;
    background: #fff;
    min-height: calc(100vh - 148px);
    border-radius: 10px;
    padding: 0 228px;
  }

  .contentHeader {
    background: #ffffff;
    padding: 10px 0;

    .cont_main {
    }

    .title_name {
      font-size: 24px;
      color: #333333;
    }

    .course_introduc {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      .img_con {
        width: 326px;
        height: 160px;
        margin-right: 30px;
        border-radius: 5px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .introduce_content {
        color: #333333;
        flex: 1;
        // display: flex;
        // flex-direction: column;
        // // align-items: center;
        // justify-content: center;

        border-radius: 5px;

        .courseName {
          font-size: 20px;
          margin-bottom: 20px;
        }

        .chapter_name {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .chapter_introduce {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  ::v-deep .el-tabs {
    .el-tabs__header {
      margin: 0;

      .el-tabs__item {
        font-size: 18px;
      }
    }

    .el-tabs__content {
    }
  }

  .tab_content {
    border-radius: 10px;
    background: #fff;
    margin: 10px 0;

    .exam_info {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
      align-items: center;

      .examCon {
        flex: 1;
        display: flex;
        align-items: center;
      }

      img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        margin-right: 18px;
      }

      .exam_name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        color: #005ce8;
      }

      .exam_time {
        font-size: 14px;
        font-weight: 400;
        color: #898989;
        margin-top: 10px;
      }

      .exam_result {
        font-size: 18px;
        font-weight: 400;
        color: #292929;
      }

      .exam_score {
        span {
          font-size: 14px;
          font-weight: 400;
          color: #999999;
        }
      }

      .exam_tag {
        width: 80px;
        line-height: 30px;
        border-radius: 40px;
        text-align: center;

        font-weight: 400;
      }

      .complete_tag {
        color: #1890ff;
        background: #e6f7ff;
        border: 1px solid #91d5ff;
      }

      .processing_tag {
        color: #52c41a;
        background: #f6ffed;
        border: 1px solid #b7eb8f;
      }

      .not_begin_tag {
        color: #ff4d4f;
        background: #fff1f0;
        border: 1px solid #ffa39e;
      }

      .exam_result_tag {
        width: 8.1rem;
        height: 7.1rem;
      }

      .ivu-row {
        flex: 1;
        margin-left: 0.5rem !important;
      }
    }
  }

  ::deep .ivu-btn-primary {
    background-color: #638eff;
    border-color: #638eff;
    margin-top: 2.2rem;

    &:hover {
      opacity: 0.9;
    }
  }

  ::deep .ivu-tabs-nav-wrap {
    background: #ffffff;
    font-weight: 500;
    color: #303030;
  }

  ::deep .ivu-tabs-nav-scroll {
    width: 85%;
    margin: 0 auto;
  }

  ::deep .ivu-tabs-bar {
    margin-bottom: 0;
    border-bottom: 0;

    .ivu-tabs-tab {
      font-size: 1.6rem;
      color: #666666;
    }

    .ivu-tabs-tab-active {
      font-size: 1.6rem;
      color: #333333;
    }
  }

  .nodata {
    height: 40rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: #accaf4;
    background: #fff;
    border-radius: 1rem;
  }
</style>
