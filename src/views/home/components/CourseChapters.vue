<template>
  <div class="course-chapters">
    <div class="defaultContent" v-if="!chapters || chapters.length === 0">
      <img src="../../../assets/images/learningCenter/wushuju.png" alt="" />
      <p>暂无章节</p>
    </div>
    <div v-else-if="isCourseExpired" class="chapters-card">
      <el-card
        class="course-item"
        :bordered="false"
        v-for="(chapter, chapterIndex) in chapters"
        :key="chapterIndex"
      >
        <h3>{{ chapter.chapterName }}</h3>
        <p class="introduce" v-html="chapter.chapterIntroduce"></p>
        <div class="course-list">
          <div
            class="course-list-cell"
            v-for="(subsection, subsectionIndex) in chapter.studySubsections"
            :key="subsectionIndex"
            @mouseover="currentSubsectionId = subsection.id"
            @mouseleave="currentSubsectionId = ''"
          >
            <div class="title">
              <img
                src="../../../assets/images/learningCenter/keChengLog.png"
                alt=""
              />
              <p
                class="cont"
                :title="subsection.subsectionName + subsection.videoTime"
              >
                {{ chapterIndex + 1 }}-{{ subsectionIndex + 1 }}
                {{ subsection.subsectionName }}（{{ subsection.videoTime }}）
              </p>
            </div>
            <div class="myStudyTime">
              我的学习时长：{{
                secondsToTime(subsection?.studyFiles?.studyTime)
              }}
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '1'"
              :style="{ color: '#FF4B4B' }"
            >
              <b :style="{ background: '#FF4B4B' }"></b>未开始
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '2'"
              :style="{ color: '#37C864' }"
            >
              <b :style="{ background: '#37C864' }"></b>学习中
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '3'"
              :style="{ color: '#4D94FF' }"
            >
              <b :style="{ background: '#4D94FF' }"></b>已学习
            </div>
            <div class="playImg">
              <img
                class="continue"
                v-if="
                  currentSubsectionId === subsection.id &&
                  subsection.studyState !== '3'
                "
                src="../../../assets/images/learningCenter/bo.png"
                alt=""
              />
              <img
                class="continue"
                v-else-if="
                  currentSubsectionId === subsection.id &&
                  subsection.studyState === '3'
                "
                src="../../../assets/images/learningCenter/bo.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="chapters-status">
          <img
            v-if="chapter.studyStateImg"
            :src="chapter.studyStateImg"
            alt=""
          />
        </div>
        <!-- <div
          style="text-align: center; margin-top: 20px"
          v-if="chapter.studyState === '3'"
        >
          <el-button
            type="primary"
            @click="goExan(chapter.id, chapter.courseId)"
            size="large"
            >参加章节考练</el-button
          >
        </div> -->
      </el-card>
    </div>
    <div v-else class="chapters-card">
      <el-card
        class="course-item"
        :bordered="false"
        v-for="(chapter, chapterIndex) in chapters"
        :key="chapterIndex"
      >
        <h3>{{ chapter.chapterName }}</h3>
        <p
          class="introduce"
          v-html="formatChapterIntroduce(chapter.chapterIntroduce)"
        ></p>
        <div class="course-list">
          <div
            class="course-list-cell"
            v-for="(subsection, subsectionIndex) in chapter.studySubsections"
            :key="subsectionIndex"
            @mouseover="currentSubsectionId = subsection.id"
            @mouseleave="currentSubsectionId = ''"
            @click="studySubsection(subsection, subsectionIndex, chapterIndex)"
          >
            <div class="title">
              <img
                src="../../../assets/images/learningCenter/keChengLog.png"
                alt=""
              />
              <p
                class="cont"
                :title="subsection.subsectionName + subsection.videoTime"
              >
                {{ chapterIndex + 1 }}-{{ subsectionIndex + 1 }}
                {{ subsection.subsectionName }}（{{ subsection.videoTime }}）
              </p>
            </div>
            <div class="myStudyTime">
              我的学习时长：{{
                secondsToTime(subsection?.studyFiles?.studyTime)
              }}
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '1'"
              :style="{ color: '#FF4B4B' }"
            >
              <b :style="{ background: '#FF4B4B' }"></b>未开始
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '2'"
              :style="{ color: '#37C864' }"
            >
              <b :style="{ background: '#37C864' }"></b>学习中
            </div>
            <div
              class="status"
              v-if="subsection.studyState === '3'"
              :style="{ color: '#4D94FF' }"
            >
              <b :style="{ background: '#4D94FF' }"></b>已学习
            </div>
            <div class="playImg">
              <img
                class="continue"
                v-if="
                  currentSubsectionId === subsection.id &&
                  subsection.studyState !== '3'
                "
                src="../../../assets/images/learningCenter/bo.png"
                alt=""
              />
              <img
                class="continue"
                v-else-if="
                  currentSubsectionId === subsection.id &&
                  subsection.studyState === '3'
                "
                src="../../../assets/images/learningCenter/bo.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="chapters-status">
          <img
            v-if="chapter.studyStateImg"
            :src="chapter.studyStateImg"
            alt=""
          />
        </div>
        <!-- <div
          style="text-align: center; margin-top: 20px"
          v-if="chapter.studyState === '3'"
        >
          <el-button
            type="primary"
            @click="goExan(chapter.id, chapter.courseId)"
            size="large"
            >参加章节考练</el-button
          >
        </div> -->
      </el-card>
      <!-- <el-card class="course-item" v-if="courseStudyDetail.state === '3'">
        <div style="text-align: center">
          <el-button type="primary" @click="goToExan(courseDetail.id)" size="large">参加课程考练</el-button>
        </div>
      </el-card> -->
    </div>
  </div>
</template>

<script>
import {
  findCourseStudyDetail,
  recordStudyProcessV1,
} from "@/api/learningCenter";
export default {
  name: "CourseChapters",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      isStudy: "",
      chapters: [],
      courseStudyDetail: {},
      chapterStudyMap: new Map(),
      subsectionStudyMap: new Map(),
      currentSubsectionId: "",
    };
  },
  computed: {
    isCourseExpired() {
      if (!this.courseDetail || !this.courseDetail.startDate) return false;

      // 格式化今天为 yyyy-mm-dd
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;

      // 课程开始日期（已经是 yyyy-mm-dd 格式）
      const startDate = this.courseDetail.startDate;

      // 如果开始日期大于今天，返回true（课程未开始，禁用）
      return startDate > todayStr;
    },
  },
  watch: {
    courseDetail(val) {
      if (!val) {
        return;
      }
      this.loadData(val);
    },
  },
  mounted() {
    this.loadData(this.courseDetail);
  },
  methods: {
    formatChapterIntroduce(content) {
      if (!content) return "";
      // 使用正则匹配图片标签，并添加样式让图片铺满一行
      return content.replace(
        /<img([^>]*)>/g,
        '<img $1 style="width: 100%; max-width: 100%; height: auto; display: block; margin: 10px 0;">'
      );
    },
    secondsToTime(seconds) {
      let hours = Math.floor(seconds / 3600);
      // 计算剩余秒数
      seconds %= 3600;
      // 计算分钟数
      let minutes = Math.floor(seconds / 60);
      // 计算剩余秒数
      seconds %= 60;

      // 将小时、分钟、秒转换为字符串，并在小于10的数字前补零
      let formattedHours = hours.toString().padStart(2, "0");
      let formattedMinutes = minutes.toString().padStart(2, "0");
      let formattedSeconds = seconds.toString().padStart(2, "0");

      // 返回格式化的时间字符串
      return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    },
    loadData(courseDetail) {
      this.isStudy = this.courseDetail.isStudy;
      this.chapters = courseDetail.chapters;
      if (courseDetail == undefined) {
        return;
      }
      findCourseStudyDetail(courseDetail.id).then((res) => {
        if (res.returnCode != "200") {
          return;
        }
        this.courseStudyDetail = res.returnData;
        if (!this.courseStudyDetail.studyChapterUsers) {
          return;
        }
        this.courseStudyDetail.studyChapterUsers.forEach((studyChapterUser) => {
          this.chapterStudyMap.set(
            studyChapterUser.chapterId,
            studyChapterUser
          );
          if (!studyChapterUser.studySubsectionUsers) {
            return;
          }
          studyChapterUser.studySubsectionUsers.forEach(
            (studySubsectionUser) => {
              this.subsectionStudyMap.set(
                studySubsectionUser.subsectionId,
                studySubsectionUser
              );
            }
          );
        });
        let chapters = this.chapters;
        if (chapters != null) {
          chapters.forEach((chapter) => {
            const chapterStudyState = this.getChapterStudyState(chapter.id);
            chapter.studyStateImg = chapterStudyState.studyStateImg;
            chapter.studyState = chapterStudyState.studyState;
            if (chapter.studySubsections != null) {
              chapter.studySubsections.forEach((subsection) => {
                const studySubsection = this.subsectionStudyMap.get(
                  subsection.id
                );
                if (!studySubsection) {
                  subsection.studyState = "1";
                  return;
                }
                subsection.studyState = studySubsection.state;
              });
            }
          });
        }
        console.log("let chapters", chapters);
        this.chapters = [...chapters];
      });
    },
    getChapterStudyState(chapterId) {
      let study = this.chapterStudyMap.get(chapterId);
      let imgName = "";
      if (!study || study.state === "1") {
        return { state: "1" };
      }
      imgName = study.state === "2" ? "xuexizhong.png" : "yiwancheng.png";
      return {
        studyState: study.state,
        studyStateImg: require(`../../../assets/images/learningCenter/${imgName}`),
      };
    },
    studySubsection(subsection, subindex, chaindex) {
      console.log(subsection, subindex, chaindex, "sy");

      if (this.isStudy == "1") {
        if (chaindex != 0) {
          if (this.chapters[chaindex - 1].studyState == 3) {
            if (subindex != 0) {
              if (
                this.chapters[chaindex].studySubsections[subindex - 1]
                  .studyState != 3
              ) {
                this.$message({
                  type: "warning",
                  message: "请先完成前面的学习。",
                  duration: 1000,
                });
                return;
              }
            }
          } else {
            this.$message({
              type: "warning",
              message: "请先完成前面的学习。",
              duration: 1000,
            });
            return;
          }
        } else {
          if (subindex != 0) {
            if (
              this.chapters[chaindex].studySubsections[subindex - 1]
                .studyState != 3
            ) {
              this.$message({
                type: "warning",
                message: "请先完成前面的学习。",
                duration: 1000,
              });
              return;
            }
          }
        }
      }

      // this.$router.push({
      //   path: `/learningCourse?subsectionId=${subsection.id}&subsectionName=${subsection.subsectionName}`,
      // });
      if (
        subsection &&
        subsection.studyFiles &&
        subsection.studyFiles.fileType == "mp4"
      ) {
        this.$router.push({
          path: `/learningCourse?subsectionId=${subsection.id}&subsectionName=${subsection.subsectionName}&subindex=${subindex}&chaindex=${chaindex}`,
        });
      } else {
        let recordProcessParam = {
          courseId: subsection.courseId,
          chapterId: subsection.subsection,
          subsectionId: subsection.id,
          studyTime: 100,
        };
        recordStudyProcessV1(recordProcessParam).then((res) => {});
        this.$router.push({
          path: `/learningCourse?subsectionId=${subsection.id}&subsectionName=${subsection.subsectionName}`,
          // path: `/LearningCourseOffice?subsectionId=${subsection.id}`,
        });
      }
    },
    goExan(chapterId, courseId) {
      this.$router.push({
        path: "examinationCenter",
        query: {
          chapterId: chapterId,
          courseId: courseId,
        },
      });
    },

    goToExan(courseId) {
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
.course-chapters {
  width: 80%;
  margin-top: 10px;
  margin: 0 auto;

  .chapters-card {
    border-radius: 1rem;

    ::v-deep .el-card {
      position: relative;
    }

    h3 {
      font-size: 20px;
      color: #005ce8;
    }

    .introduce {
      font-size: 16px;
      color: #807f7f;
      margin: 1rem 0;
      line-height: 2.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .course-list {
      margin-top: 0.5rem;

      &-cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4.4rem;

        .title {
          display: flex;
          align-items: center;

          img {
            width: 2.3rem;
            height: 2.6rem;
            margin-right: 0.5rem;
          }

          .cont {
            font-size: 16px;
            color: #333333;
            width: 320px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .myStudyTime {
          margin-right: 1.4rem;
          font-size: 16px;
        }

        .status {
          font-size: 16px;
          display: flex;
          align-items: center;

          b {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            margin-right: 5px;
          }
        }

        .playImg {
          width: 2.1rem;
          height: 2.1rem;
          margin-right: 3rem;

          .continue {
            width: 100%;
            height: 100%;
          }
        }

        &:hover {
          cursor: pointer;
          background: #f4f4f4;
          border-radius: 4px;
        }
      }
    }
  }

  .chapters-status {
    width: 8rem;
    height: 6.5rem;
    position: absolute;
    top: 0.25rem;
    right: 0.6875rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.defaultContent {
  height: 40rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #accaf4;
  background: #fff;
  border-radius: 1rem;
}

.course-item {
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.1rem 1rem;
}
</style>
