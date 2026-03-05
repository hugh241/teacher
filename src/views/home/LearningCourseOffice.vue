<template>
  <div>
    <BreadCrumb :type="1" />
    <div style="height: 100%;">
      <div>
        <div id="studyContent">
          <div id="course">
            <iframe :src="videoUrl" @updateStudySubsectionProcess="updateStudySubsectionProcess" style="width: 1400px" />
            <div ref="courseTabs" class="courseTabs" @click="changeVisibleCourseInfo">
              <span>{{ visibleCourseInfoTag }}</span>
            </div>
            <div id="courseInfo" v-show="visibleCourseInfo">
              <div id="courseTabTitle">
                <div class="courseTitleContent" @click="changeTab('chapter')"
                  :class="{ selectTab: currentTab == 'chapter' }">
                  <img src="../../assets/images/learningCenter/icon-zhangjie.png" class="tabTitleImg" />
                  <span>章节</span>
                </div>
                <div class="courseTitleContent" @click="changeTab('note')" :class="{ selectTab: currentTab == 'note' }">
                  <img src="../../assets/images/learningCenter/icon-biji.png" class="tabTitleImg" />
                  <span>笔记</span>
                </div>
                <div class="courseTitleContent" @click="changeTab('question')"
                  :class="{ selectTab: currentTab == 'question' }">
                  <img src="../../assets/images/learningCenter/icon-wenda.png" class="tabTitleImg" />
                  <span>问答</span>
                </div>
              </div>
              <div id="courseTabContent">
                <div id="chapter" v-show="this.currentTab == 'chapter'" key="chapter">
                  <div class="chaptercell" v-for="(chapter, chapterIndex) in courseDetail.chapters" :key="chapterIndex">
                    <p class="chapterName" :style="{
                      color:
                        currentStudySubsection.chapterId === chapter.id
                          ? '#FFFFFF'
                          : '#D4D4D4',
                    }">
                      {{ chapter.chapterName }}
                    </p>
                    <div class="subsectionNameContent" :class="{
                      studying: studySubsection.id == currentStudySubsection.id,
                    }" v-for="(
                      studySubsection, studySubsectionIndex
                    ) in chapter.studySubsections" :key="studySubsectionIndex"
                      @click="changeStudySubsection(studySubsection)">
                      <el-tooltip effect="light" v-if="studySubsection.subsectionName.length > 7" :content="`${chapterIndex + 1}-${studySubsectionIndex + 1
                        } ${studySubsection.subsectionName}`" popper-class="my-tooltip" placement="top">
                        <p class="subsectionName">
                          {{ chapterIndex + 1 }}-{{ studySubsectionIndex + 1 }}
                          {{ studySubsection.subsectionName }}
                        </p>
                      </el-tooltip>

                      <p class="subsectionName" v-else>
                        {{ chapterIndex + 1 }}-{{ studySubsectionIndex + 1 }}
                        {{ studySubsection.subsectionName }}
                      </p>
                      <p v-show="studySubsection.videoTime">
                        ({{ studySubsection.videoTime }})
                      </p>
                      <div class="subsectionStudy">
                        <p v-if="studySubsection.id != currentStudySubsection.id">
                          <span v-if="studySubsection.studyState == '3'">重新学习</span>
                          <span v-else-if="studySubsection.studyState == '2'">继续学习</span>
                          <span v-else>开始学习</span>
                        </p>
                        <p v-else>
                          <span v-show="studySubsection.studySchedule">{{ studySubsection.studySchedule }}%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="note" class="tabContent" v-show="this.currentTab == 'note'" key="note">
                  <el-input v-model="noteContent" type="textarea" :rows="12" placeholder="请输入笔记内容"
                    :maxlength="maxlength1"></el-input>
                  <div class="operateContent">
                    <!-- <el-button type="primary" @click="screenShot">截图</el-button> -->
                    <el-button type="primary" @click="submitNote" :loading="submitNoteLoading">提交</el-button>
                  </div>

                  <div id="noteImgContent">
                    <div class="imgContent" v-for="(item, index) in screenShotList" :key="index"
                      :class="{ noteImg: index % 3 === 1 }">
                      <img :src="item" alt="截图不能显示" />
                      <div class="img-list-cover">
                        <el-icon class="view-icon" name="el-icon-view" @click.native="handleNoteImgView(index)"></el-icon>
                        <el-icon class="delete-icon" name="el-icon-delete"
                          @click.native="handleNoteImgRemove(index)"></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="question" class="tabContent" v-show="currentTab === 'question'" key="question">
                  <el-input v-model="questionContent" type="textarea" :rows="12" placeholder="请输入提问内容"
                    :maxlength="maxlength2"></el-input>
                  <div class="operateContent">
                    <el-button type="primary" @click="submitQuestion" :loading="submitQuestionLoading">提交</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="noteAndQuestionContent">
          <NoteAndQuestion ref="noteAndQuestion" id="noteAndQuestion" :sumbitOperate="sumbitOperate"
            :courseId="this.currentStudySubsection.courseId" :subsectionId="this.currentStudySubsection.id">
          </NoteAndQuestion>
        </div>
      </div>
      <el-dialog v-model="visibleNoteImg" :width="960" class="imgPreview">
        <img :src="showNoteImgSrc" style="width: 100%; height: 100%" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import iframe from "./components/iframe.vue";
import NoteAndQuestion from "./components/NoteAndQuestion.vue";
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import {
  addNote,
  addStudyProblemExchanges,
  uploadStudyFile,
  findChapterStudyDetail,
  getSubsectionDetail,
} from "@/api/learningCenter";
import axios from "axios";
export default {
  name: "LearningCourse",
  components: { iframe, NoteAndQuestion, BreadCrumb },
  data() {
    return {
      maxlength1: 2000,
      maxlength2: 200,
      headerStyle: "blue-header",
      currentStudySubsection: {},
      BASEURL: process.env.VUE_APP_VIEW_URL,
      videoUrl: "",
      courseDetail: {},
      courseStudyDetail: {},
      currentTab: "chapter",
      noteContent: "",
      screenShotList: [],
      questionContent: "",
      visibleNoteImg: false,
      showNoteImgSrc: "",
      visibleCourseInfo: true,
      visibleCourseInfoTag: ">",
      submitNoteLoading: false,
      submitQuestionLoading: false,
      sumbitOperate: "",
    };
  },
  created() {
    const subsectionId = this.$route.query.subsectionId;
    getSubsectionDetail({ id: subsectionId }).then((res) => {
      if (res.returnCode != "200") {
        return;
      }
      this.currentStudySubsection = res.returnData;
      this.videoUrl =
        "http://60.164.243.164:8088/preview/onlinePreview?url=" +
        this.BASEURL +
        this.currentStudySubsection.studyFiles.filePath;
    });
  },
  methods: {
    changeVisibleCourseInfo() {
      if (this.visibleCourseInfo === true) {
        this.visibleCourseInfo = false;
        this.visibleCourseInfoTag = "<";
        this.$refs.courseTabs.setAttribute(
          "class",
          "courseTabs courseTabsToLeft"
        );
        return;
      }
      this.visibleCourseInfo = true;
      this.visibleCourseInfoTag = ">";
      this.$refs.courseTabs.setAttribute(
        "class",
        "courseTabs courseTabsToRight"
      );
    },
    changeStudySubsection(studySubsection) {
      this.currentStudySubsection = studySubsection;
    },
    changeTab(operate) {
      this.currentTab = operate;
    },

    base64ToFile(urlData) {
      let arr = urlData.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = atob(arr[1]);
      let n = bytes.length;
      let ia = new Uint8Array(n);
      while (n--) {
        ia[n] = bytes.charCodeAt(n);
      }
      return new File([ia], "screenShot.png", { type: mime });
    },
    handleNoteImgView(index) {
      this.visibleNoteImg = true;
      this.showNoteImgSrc = this.screenShotList[index];
    },
    handleNoteImgRemove(index) {
      this.screenShotList.splice(index, 1);
    },
    submitNote() {
      let noteReg =
        /^[\u4e00-\u9fa5a-zA-Z0-9\\?\\？\\!\\！\\%\\，\\。\\,\\.\\”\\“\\"\\"\\’\\‘\\'\\'\\《\\》\\（\\）\\(\\)\\、\\ ]+$/;
      if (
        this.noteContent == "" ||
        this.noteContent == null ||
        this.noteContent == undefined
      ) {
        this.$message.warning("笔记内容不能为空");
        return false;
      }
      if (!noteReg.test(this.noteContent)) {
        this.$message.warning("笔记内容不能输入特殊字符");
        return false;
      }
      if (this.screenShotList.length > 0) {
        let uploadParams = new FormData();
        this.screenShotList.forEach((item) => {
          uploadParams.append("fileData", this.base64ToFile(item));
        });
        uploadParams.append("businessType", 2);
        uploadStudyFile(uploadParams).then((res) => {
          if (res.returnCode != "200") {
            this.$message.error("上传笔记截图失败");
            return;
          }
          this.$message.success("上传笔记截图成功！");
          let fileIds = res.returnData.map((item) => item.fileId);
          this.submitNoteContent(fileIds.join(","));
        });
      } else {
        this.submitNoteContent();
      }
    },
    submitNoteContent(fileIds) {
      let params = {
        courseId: this.currentStudySubsection.courseId,
        chapterId: this.currentStudySubsection.chapterId,
        subsectionId: this.currentStudySubsection.id,
        content: this.noteContent,
      };
      if (fileIds) {
        params.fileIds = fileIds;
      }
      this.submitNoteLoading = true;
      addNote(params).then((res) => {
        this.submitNoteLoading = false;
        if ("200" != res.returnCode) {
          this.$message.error("笔记提交失败");
          return;
        }
        this.$message.success("笔记提交成功");
        this.noteContent = "";
        this.screenShotList = [];
        this.sumbitOperate = `submitNote${new Date().getTime()}`;
      });
    },
    submitQuestion() {
      let noteReg =
        /^[\u4e00-\u9fa5a-zA-Z0-9\\?\\？\\!\\！\\%\\，\\。\\,\\.\\”\\“\\"\\"\\’\\‘\\'\\'\\《\\》\\（\\）\\(\\)\\、\\ ]+$/;
      if (
        this.questionContent == "" ||
        this.questionContent == null ||
        this.questionContent == undefined
      ) {
        this.$message.warning("提问内容不能为空");
        return false;
      }
      if (!noteReg.test(this.questionContent)) {
        this.$message.warning("提问内容不能输入特殊字符");
        return false;
      }
      let params = {
        courseId: this.currentStudySubsection.courseId,
        chapterId: this.currentStudySubsection.chapterId,
        subsectionId: this.currentStudySubsection.id,
        content: this.questionContent,
      };
      this.submitQuestionLoading = true;
      addStudyProblemExchanges(params).then((res) => {
        this.submitQuestionLoading = false;
        if ("200" != res.returnCode) {
          this.$message.error("提问提交失败");
          return;
        }
        this.$message.success("提问提交成功");
        this.questionContent = "";
        this.sumbitOperate = `submitQuestion${new Date().getTime()}`;
      });
    },
    handleUserStudyProcess(courseStudyProcess) {
      if (!courseStudyProcess.studyChapterUsers) {
        return;
      }
      const studySubsectionUserMap = new Map();
      courseStudyProcess.studyChapterUsers.forEach((chapter) => {
        if (!chapter.studySubsectionUsers) {
          return;
        }
        chapter.studySubsectionUsers.forEach((subsection) => {
          studySubsectionUserMap.set(subsection.subsectionId, subsection);
        });
      });
      this.courseDetail.chapters.forEach((chapter) => {
        chapter.studySubsections.forEach((subsection) => {
          subsection.studyState = "1";
          subsection.studySchedule = "0";
          const studySubsectionUser = studySubsectionUserMap.get(subsection.id);
          if (studySubsectionUser != undefined) {
            subsection.studyState = studySubsectionUser.state;
            subsection.studySchedule = studySubsectionUser.schedule;
            subsection.studyTime = studySubsectionUser.studyTime;
          } else if (subsection.id === this.currentStudySubsection.id) {
            subsection.studyState = "2";
          }
        });
      });
    },
    updateStudySubsectionProcess(chapterId) {
      findChapterStudyDetail(chapterId).then((res) => {
        if (res.returnCode == "200") {
          if (!res.returnData.studySubsectionUsers) {
            return;
          }
          const map = new Map();
          res.returnData.studySubsectionUsers.forEach((item) =>
            map.set(item.subsectionId, item)
          );
          if (this.courseDetail.chapters) {
            this.courseDetail.chapters.forEach((chapter) => {
              if (chapterId != chapter.id) {
                return;
              }
              const list = chapter.studySubsections.map((item) => {
                const studySubsectionUser = map.get(item.id);
                if (studySubsectionUser) {
                  item.studyState = studySubsectionUser.state;
                  item.studySchedule = studySubsectionUser.schedule;
                }
                return item;
              });
              chapter.studySubsections = list;
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#studyContent {
  width: 100%;
  height: 50rem;
  background: #191919;
  position: relative;
  margin-bottom: 1rem;
}

#course {
  width: 75%;
  height: 85%;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 66px;

  #courseInfo {
    width: 27%;
    height: 100%;
    background: #333;
    color: #ffffff;

    #courseTabTitle {
      display: flex;
      height: 4.5rem;
      align-items: center;
      padding: 2rem 2rem;
      margin-top: 1rem;

      .courseTitleContent {
        text-align: center;
        flex: 1;
        line-height: 4.5rem;
        font-size: 1.6rem;
        font-weight: 400;
        cursor: pointer;

        .tabTitleImg {
          width: 1.6rem;
          height: 1.6rem;
          margin-right: 0.5rem;
        }
      }
    }

    #courseTabContent {
      border-top: 0.03125rem solid #3c3c3c;
      color: #d4d4d4;

      #chapter {
        height: 42rem;
        width: 100%;
        overflow: auto;
        overflow-x: hidden;
        margin-top: 2rem;

        .chaptercell {
          margin-bottom: 2rem;
        }
      }

      #chapter::-webkit-scrollbar {
        width: 4px;
        height: 10px;
        cursor: pointer;
        background: #ffffff;
      }

      #chapter::-webkit-scrollbar-thumb {
        border-radius: 5px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #d8d8d8;
        cursor: pointer;
      }

      #chapter::-webkit-scrollbar-track {
        border-radius: 0;
        background: #ffffff;
        cursor: pointer;
      }

      .tabContent {
        padding: 1rem 1rem;

        .operateContent {
          margin: 0.5rem 0;
          text-align: right;

          button {
            margin-left: 0.5rem;
          }
        }

        #noteImgContent {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;

          .imgContent {
            width: 4rem;
            height: 2rem;
            line-height: 2rem;
            margin-bottom: 0.5rem;
            text-align: center;
            position: relative;
          }

          img {
            width: 100%;
            height: 100%;
          }

          .noteImg {
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }

          .img-list-cover {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: #3c3c3c;
            display: none;
          }

          .imgContent:hover .img-list-cover {
            display: block;
            opacity: 0.8;
          }
        }
      }
    }
  }
}

.selectTab {
  border-bottom: 0.2em solid #6288ff;
}

#noteAndQuestionContent {
  width: 100%;
  position: relative;

  #noteAndQuestion {
    width: 85%;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}

.operateTitle {
  font-size: 0.5rem;
  font-weight: 500;
  margin: 0.3rem 0;
}

.chapterName {
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.subsectionNameContent {
  height: 4.5rem;
  font-size: 1.4rem;
  font-weight: 400;
  padding-left: 1.5rem;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.1rem;

  .subsectionName {
    width: 15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subsectionStudy {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    color: #ffcb62;
    font-size: 1.2rem;
  }
}

.subsectionNameContent:hover {
  background: #191919;
  color: #ffffff;
}

.studying {
  font-size: 1.4rem;
  font-weight: 400;
  color: #6288ff;
  background: #191919;
  height: 4.5rem;

  &:hover {
    color: #6288ff;
  }
}

.courseTabs {
  line-height: 8rem;
  border-top: 0.5rem solid transparent;
  border-right: 2.2rem solid #000;
  border-bottom: 0.5rem solid transparent;
  color: #ffffff;
  text-align: center;
  position: absolute;
  top: 50%;
  margin-top: -3.5rem;
  right: 27%;
  z-index: 10;
  cursor: pointer;
  font-size: 2rem;
  width: 0;

  span {
    margin-left: 0.5rem;
  }
}

.courseTabsToLeft {
  right: 0;
}

::deep .ivu-tabs-nav .ivu-tabs-tab {
  font-size: 1.8rem;
  font-weight: 500;
  color: #000000;
}

::deep .ivu-tabs-bar {
  background: #fff;
  height: 6rem;
  font-size: 1.8rem;
  border-radius: 1rem;
  // line-height: 4.4rem;
  border-bottom: none;
}

::deep .ivu-tabs-nav-container {
  line-height: 4.4rem;
  margin-left: 1.5rem;
}

.imgPreview {
  ::deep .ivu-modal-content {
    border: none;
    border-radius: 0;
    background: none;
    background-clip: none;
    box-shadow: none;
  }

  ::deep .ivu-modal-footer {
    display: none;
  }

  ::deep .ivu-modal-body {
    padding: 0;
  }

  ::deep .ivu-modal-close {
    background: #000000;
    border-radius: 50%;
  }

  ::deep .ivu-icon {
    color: #ffffff;
  }
}
</style>
