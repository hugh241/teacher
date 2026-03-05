<template>
  <div>
    <BreadCrumb :type="1" />

    <div class="container">
      <div class="container_icon">
        <!-- 播放 -->
        <div id="studyContent">
          <div class="name" style="margin-top: 50px;font-size: 18px;font-weight: bolder;">{{kcName}}</div>
          <div id="course">
            <CourseVideoPlayer v-if="currentStudySubsection" :studySubsection="currentStudySubsection" :fileType="fileType" :count="count" :currentStudySubsectionIds="currentStudySubsectionIds" :fatherStudySubsection="fatherStudySubsection"
             :chaindex="chaindex" :subindex="subindex"  @updateStudySubsectionProcess="updateStudySubsectionProcess" @resetupdate="resetupdate" />
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
                <div class="courseTitleContent" v-if="courseDetail.showNoteFlag == 0" @click="changeTab('note')" :class="{ selectTab: currentTab == 'note' }">
                  <img src="../../assets/images/learningCenter/icon-biji.png" class="tabTitleImg" />
                  <span>笔记</span>
                </div>
                <div class="courseTitleContent" v-if="courseDetail.showAnswerFlag == 0" @click="changeTab('question')"
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
                    <div class="subsectionNameContent"  v-for="(
                      studySubsection, studySubsectionIndex
                    ) in chapter.studySubsections" :key="studySubsectionIndex"
                      @click="changeStudySubsection(studySubsection,chapterIndex,studySubsectionIndex,studySubsection.type)">
                      <!-- 一级课程 -->
                      <div class="subsectionNameContent_fir" :class="{
                        studying: studySubsection.id == currentStudySubsection.id,
                      }">
                        <!-- <i :class="studySubsection.id == currentshow.id?'el-icon-caret-bottom':'el-icon-caret-right'" style="margin-right: 5px;font-size: 18px;" @click.stop="showlist(studySubsection)"></i> -->
                        <i class="el-icon-caret-right" style="margin-right: 5px;font-size: 18px;" @click.stop="showlist(studySubsection)"></i>
                        <el-tooltip effect="light" v-if="studySubsection.subsectionName.length > 7" :content="`${chapterIndex + 1}-${studySubsectionIndex + 1
                          } ${studySubsection.subsectionName}`" :popper-options="{ maxWidth: '240' }" placement="top">
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
  
                            <span v-show="studySubsection.studySchedule"> {{ studySubsection.studySchedule > 100 ?
                              '100':studySubsection.studySchedule }}%</span>
                          </p>
                        </div>  
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
                        <el-icon class="eye-icon" type="ios-eye-outline"
                          @click.native="handleNoteImgView(index)"></el-icon>
                        <el-icon class="trash-icon" type="ios-trash-outline"
                          @click.native="handleNoteImgRemove(index)"></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="question" class="tabContent" v-show="this.currentTab == 'question'" key="question">
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
        <!-- 右边 -->
        <div id="noteAndQuestionContent">
          <NoteAndQuestion ref="noteAndQuestion" id="noteAndQuestion" :sumbitOperate="sumbitOperate"
            :courseId="this.currentStudySubsection.courseId" :subsectionId="this.currentStudySubsection.id" 
            :showAnswerFlag="courseDetail.showAnswerFlag"
            :showNoteFlag="courseDetail.showNoteFlag">
          </NoteAndQuestion>
        </div>
      </div>
      <el-dialog v-model="visibleNoteImg" width="960" class="imgPreview">
        <img :src="showNoteImgSrc" style="width: 100%; height: 100%" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import CourseVideoPlayer from "./components/CourseVideoPlayer.vue";
import NoteAndQuestion from "./components/NoteAndQuestion.vue";
// import { UPLOAD_TYPE } from '@/utils/uploadConfig';
import {
  getCourseDetails,
  findCourseStudyDetail,
  addNote,
  addStudyProblemExchanges,
  uploadStudyFile,
  findChapterStudyDetail,
  getSubsectionDetail,
} from "@/api/learningCenter";
import axios from "axios";

export default {
  name: "LearningCourse",
  components: { BreadCrumb, CourseVideoPlayer, NoteAndQuestion },
  props:{
    subsectionName:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      isStudy:'',
      fatherStudySubsection:{},
      currentStudySubsectionIds:{},
      fileType:'',
      maxlength1: 2000,
      maxlength2: 200,
      headerStyle: "blue-header",
      currentStudySubsection: {},
      currentshow:{},
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
      count: 0,
      kcName:'',
      chaindex:'',
      subindex:''
    };
  },
  created() {
    if (this.$route.query.subsectionName) {
      this.kcName = this.$route.query.subsectionName

    }
    const subsectionId = this.$route.query.subsectionId;
    const chaindex = this.$route.query.chaindex
    const subindex = this.$route.query.subindex
    this.chaindex = this.$route.query.chaindex
    this.subindex = this.$route.query.subindex
    getSubsectionDetail({ id: subsectionId }).then((res) => {
      if (res.returnCode != "200") {
        return;
      }
      res.returnData.pace = (Number(res.returnData.schedule) / 100) * Number(res.returnData.videoTime)
      this.currentStudySubsection = res.returnData;
      this.currentshow = res.returnData
      this.count = 0
      axios
        .all([
          findCourseStudyDetail(this.currentStudySubsection.courseId),
          getCourseDetails(this.currentStudySubsection.courseId),
        ])
        .then(
          axios.spread((courseStudyDetailRes, courseDetailRes) => {
            if (courseStudyDetailRes.returnCode == "200") {
              this.courseStudyDetail = courseStudyDetailRes.returnData;
            }
            if (courseDetailRes.returnCode != "200") {
              this.$message.error("获取课程详情信息失败");
              return;
            }
            console.log('不点击数据',courseStudyDetailRes,courseDetailRes);
            
            courseDetailRes.returnData.chapters.map(val => {
              if (val.studySubsections?.length > 0) {
                val.studySubsections.map(v => {
                  v.pace = (Number(v.schedule) / 100) * Number(v.secondTime)
                })
              }

            })
            this.courseDetail = courseDetailRes.returnData;
            this.currentStudySubsection = courseDetailRes.returnData.chapters[chaindex].studySubsections[subindex];
            this.isStudy = courseDetailRes.returnData.isStudy
            console.log(this.courseDetail,'created');
            this.handleUserStudyProcess(this.courseStudyDetail);
          })
        );
    });
  },
  methods: {
    secondsToTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        // 计算剩余秒数
        seconds %= 3600;
        // 计算分钟数
        let minutes = Math.floor(seconds / 60);
        // 计算剩余秒数
        seconds %= 60;

        // 将小时、分钟、秒转换为字符串，并在小于10的数字前补零
        let formattedHours = hours.toString().padStart(2, '0');
        let formattedMinutes = minutes.toString().padStart(2, '0');
        let formattedSeconds = seconds.toString().padStart(2, '0');

        // 返回格式化的时间字符串
        return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
      },
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
    changeStudySubsection(studySubsection,chapterIndex,subindex, fileType) {
      // console.log(studySubsection,'studySubsection')
      // console.log(chapterIndex,'chapterIndex')
      // console.log(subindex,'subindex')
      // console.log(fileType,'fileType')
      // console.log(this.courseDetail,'状态');
      this.chaindex = chapterIndex
      this.subindex = subindex
      console.log(this.isStudy,studySubsection,'this.isStudy');

      console.log('sdadsad',this.courseDetail.chapters,chapterIndex,subindex,);
      
      if(this.isStudy == "1"){
        if(chapterIndex !=0){
          // if (this.courseDetail.chapters[chapterIndex-1].studyState == 3) {
            if (this.courseDetail.chapters[subindex-1<0?chapterIndex-1:chapterIndex].studySubsections[subindex-1<0?this.courseDetail.chapters[chapterIndex-1].studySubsections.length-1:subindex-1].studyState != 3) {
              this.$message({
                type:'warning',
                message: '请先完成前面的学习。',
                duration: 1000
              })
              return
            }
            
          // }
        }else{
          if (subindex != 0) {
            if (this.courseDetail.chapters[chapterIndex].studySubsections[subindex-1].studyState !=3) {
              this.$message({
                type:'warning',
                message: '请先完成前面的学习。',
                duration: 1000
              })
              return
            }
          }
        }
        
      }
      this.fileType =fileType
      this.currentStudySubsection = studySubsection;
      console.log('dianji',this.currentStudySubsection);
      
      this.count = 0
      // this.currentStudySubsectionIds =  currentStudySubsectionIds
      if (studySubsection) {
        this.kcName = studySubsection.subsectionName
      }
    },
    resetupdate(studySubsection,chaindex,subindex){
      console.log('emit',studySubsection,chaindex,subindex);  
      if (!studySubsection)  return
      getCourseDetails(studySubsection.courseId).then((res)=>{
        console.log('按钮重播',res);
        if (res?.returnCode == 200 && res) {
          res.returnData.chapters.map(val => {
              if (val.studySubsections?.length > 0) {
                val.studySubsections.map(v => {
                  v.pace = (Number(v.schedule) / 100) * Number(v.secondTime)
                })
              }
            })
            if (res.returnData.chapters[chaindex].studySubsections[subindex].studyFiles.state == "3") {
              this.courseDetail = res.returnData;
              this.currentStudySubsection = res.returnData.chapters[chaindex].studySubsections[subindex];
              this.isStudy = res.returnData.isStudy
            }
        }
      })
    },
    changeTab(operate) {
      this.currentTab = operate;
    },
    screenShot() {
      let player = document.getElementsByTagName("video")[0];
      player.setAttribute("crossOrigin", "Anonymous");

      let canvas = document.createElement("canvas");
      canvas.width = player.clientWidth;
      canvas.height = player.clientHeight;
      canvas
        .getContext("2d")
        .drawImage(player, 0, 0, canvas.width, canvas.height);

      let dataURL = canvas.toDataURL("image/png"); //将图片转成base64格式
      if (this.screenShotList.length < 6) {
        this.screenShotList.push(dataURL);
      } else {
        this.$message.info("截图数量不能大于6");
      }
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
      let params
      // if (this.fileType == 2) {
      //   params = {
      //     courseId: this.fatherStudySubsection.courseId,
      //     chapterId: this.fatherStudySubsection.chapterId,
      //     subsectionId: this.fatherStudySubsection.id,
      //     content: this.noteContent,
      //   }
      // }else{
        params =  {
          courseId: this.currentStudySubsection.courseId,
          chapterId: this.currentStudySubsection.chapterId,
          subsectionId: this.currentStudySubsection.id,
          content: this.noteContent,
        };
      // }
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
      let params
      // if (this.fileType == 2) {
      //   params={
      //     courseId: this.fatherStudySubsection.courseId,
      //     chapterId: this.fatherStudySubsection.chapterId,
      //     subsectionId: this.fatherStudySubsection.id,
      //     content: this.questionContent,
      //   };
      // }else{
        params={
          courseId: this.currentStudySubsection.courseId,
          chapterId: this.currentStudySubsection.chapterId,
          subsectionId: this.currentStudySubsection.id,
          content: this.questionContent,
        };
      // }
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
      console.log(this.courseStudyDetail,'this.courseStudyDetail');
      console.log(this.courseDetail,'this.courseDetail');
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
      });
    },
    showlist(studySubsection){
      if (JSON.stringify(this.currentshow) == JSON.stringify(studySubsection) ) {
        this.currentshow = {}
      }else{
        this.currentshow = studySubsection;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  min-height: 113vh;
  overflow: auto;
  margin: 10px;
  background: #fff;
  padding: 0 30px;
  border-radius: 10px;
}

#studyContent {
  width: 75%;
  height: 50rem;
  margin: auto;
  position: relative;
}

#course {
  width: 100%;
  height: 90%;
  background-color: #191919;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 10px;

  #courseInfo {
    width: 27%;
    height: 100%;
    background: #333;
    color: #ffffff;

    #courseTabTitle {
      display: flex;
      height: 4.5rem;
      align-items: center;
      padding: 1.5rem 2rem;

      .courseTitleContent {
        text-align: center;
        flex: 1;
        line-height: 4.5rem;
        font-size: 16px;
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
        height: 33rem;
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
  width: 89%;
  margin: auto;
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
  font-size: 14px;
  font-weight: 500;
  margin: 0.3rem 0;
}

.chapterName {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.subsectionNameContent {
  min-height: 4.5rem;
  /* font-size: 1.4rem;
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
  } */
  .subsectionNameContent_fir{
    height: 4.5rem;
    font-size: 14px;
    font-weight: 400;
    padding-left: 1.5rem;
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0.1rem;
  
    .subsectionName {
      width: 10rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .subsectionStudy {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      color: #ffcb62;
      font-size: 14px;
    }
  }
  .subsectionNameContent_secbox{
    .subsectionNameContent_sec{
      height: 4.5rem;
      font-size: 14px;
      font-weight: 400;
      padding-left: 2.4rem;
      padding-right: 0.5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: 0.1rem;
    
      .subsectionName {
        width: 10rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    
      .subsectionStudy {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        color: #ffcb62;
        font-size: 14px;
      }
    }
  }
}

.subsectionNameContent_fir:hover {
  background: #191919;
  color: #ffffff;
}
.subsectionNameContent_sec:hover {
  background: #191919;
  color: #ffffff;
}

.studying {
  font-size: 14px;
  font-weight: 400;
  color: #6288ff;
  background: #191919;
  min-height: 4.5rem;

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
  font-size: 20px;
  width: 0;

  span {
    margin-left: 0.5rem;
  }
}

.courseTabsToLeft {
  right: 0;
}

::ng-deep .ivu-tabs-nav .ivu-tabs-tab {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
}

::ng-deep .ivu-tabs-bar {
  background: #fff;
  height: 6rem;
  font-size: 18px;
  border-radius: 1rem;
  // line-height: 4.4rem;
  border-bottom: none;
}

::ng-deep .ivu-tabs-nav-container {
  line-height: 4.4rem;
  margin-left: 1.5rem;
}

.imgPreview {
  ::ng-deep .ivu-modal-content {
    border: none;
    border-radius: 0;
    background: none;
    background-clip: none;
    box-shadow: none;
  }

  ::ng-deep .ivu-modal-footer {
    display: none;
  }

  ::ng-deep .ivu-modal-body {
    padding: 0;
  }

  ::ng-deep .ivu-modal-close {
    background: #000000;
    border-radius: 50%;
  }

  ::ng-deep .ivu-icon {
    color: #ffffff;
  }
}
</style>
