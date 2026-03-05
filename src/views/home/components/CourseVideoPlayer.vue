<template>
  <div id="courseVideoPlayer">
    <video
      v-show="videoVisable"
      :autoplay="false"
      :src="videoUrl"
      id="video"
      ref="video"
      class="videoPlayer"
      preload="auto"
      controls
      controlslist="nodownload noremoteplayback"
      disablePictureInPicture="true"
      disableRemotePlayback="true"
      x5-video-player-type="h5"
    ></video>
    <!-- office文件及pdf预览 -->
    <iframe
      style="width: 1007px; height: 510px"
      id="ifr_con"
      v-if="officeVisable"
      :src="videoUrl"
      frameborder="1"
    ></iframe>
    <!-- 图片文件预览 -->
    <el-image
      style="width: 1007px; height: 510px"
      v-if="imageVisable"
      :src="videoUrl"
    ></el-image>
    <!--  中途答题-->
    <el-dialog
      v-model="questionVisible"
      :title="questionInfo.questionName"
      :visible.sync="questionVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="ques-card">
        <!-- <p >{{ questionInfo.questionName }}</p> -->
        <el-radio-group
          class="ques-options"
          v-model="questionCheckResult"
          id="question-radio"
        >
          <el-radio
            :label="item.sort"
            v-for="(item, index) in questionInfo.questionOptions"
            :key="index"
            >{{ item.optionName }}</el-radio
          >
        </el-radio-group>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="submitQuestion(questionInfo.index)"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      v-model="repeatStudyVisible"
      :visible.sync="repeatStudyVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="ques-card" style="text-align: center">
        <p>您已开始学习其他课程，点击按钮，继续学习</p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="confirmRepeatStudy"
          >继续学习</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  refreshStudyProcess,
  recordStudyProcess,
  getQuestionDetail,
  recordStudyProcessV1,
} from "@/api/learningCenter";
import { UPLOAD_TYPE } from "@/utils/uploadConfig";
export default {
  name: "CourseVideoPlayer",
  props: {
    studySubsection: {
      type: [Object],
    },
    count: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: "",
    },
    currentStudySubsectionIds: {
      type: [Object],
    },
    fatherStudySubsection: {
      type: [Object],
    },
    subindex: {
      type: String,
      default: "",
    },
    chaindex: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isPlay: false,
      isTime: "",
      statType: 0,
      lastTime: 0,
      lastUpdateTime: Date.now(),
      isSpeedNum: 0,
      officeVisable: false,
      imageVisable: false,
      videoVisable: true,
      currentPlayerTime: -1,
      questionShowTimes: [],
      lastRecordTime: 0,
      videoUrl: "",
      questionCheckResult: "",
      repeatStudyVisible: false,
      recordProcessThreshold: 10,
      currentStudyState: "",
      videoStatus: "",
      questionInfo: {
        questionName: "",
        questionOptions: [],
        index: 0,
      },
      answerQuestionsIndex: [],
      recordProcessStatus: 0,
      BASEURL: process.env.VUE_APP_VIEW_URL,
      video: {
        url: "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
        cover: "https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png",
        muted: false,
        loop: false,
        preload: "auto",
        poster: "",
        volume: 1,
        autoplay: true,
      },
      counts: this.count,
    };
  },
  computed: {
    questionVisible() {
      let index = this.questionShowTimes.indexOf(this.currentPlayerTime);
      let answerQuestionsIndex = this.answerQuestionsIndex.indexOf(index);
      console.log(index, "dt");
      console.log(this.studySubsection, "dt11");
      if (index != -1 && answerQuestionsIndex === -1) {
        // if (this.fileType == 2) {
        //   this.videoPause();
        //   this.questionInfo.index = index;
        //   this.questionInfo.questionName =
        //     this.fatherStudySubsection.studyAnswerQuestions[index].questionName;
        //   let questionId =
        //     this.fatherStudySubsection.studyAnswerQuestions[index].qustionId;
        //   let params = {
        //     id: questionId,
        //   };
        //   getQuestionDetail(params).then((res) => {
        //     if (res.returnCode == "200" && res.returnData) {
        //       const questionDetail = res.returnData;
        //       this.questionInfo.questionOptions = questionDetail.optionList;
        //       this.questionInfo.questionName = questionDetail.title;
        //     } else {
        //       this.$message.error(res.returnMessage);
        //     }
        //   });
        //   return true;
        // }
        // else {
        this.videoPause();
        this.questionInfo.index = index;
        this.questionInfo.questionName =
          this.studySubsection.studyAnswerQuestions[index].questionName;
        let questionId =
          this.studySubsection.studyAnswerQuestions[index].qustionId;
        let params = {
          id: questionId,
        };
        getQuestionDetail(params).then((res) => {
          if (res.returnCode == "200" && res.returnData) {
            const questionDetail = res.returnData;
            this.questionInfo.questionOptions = questionDetail.optionList;
            this.questionInfo.questionName = questionDetail.title;
          } else {
            this.$message.error(res.returnMessage);
          }
        });
        return true;
        // }
      }
      return false;
    },
  },
  watch: {
    studySubsection(value, old) {
      console.log(value,'value------------------');
      console.log(value.dragTag == '1','value.dragTag------------------');
      
      // 使用switch-case重构多个条件判断
      if (value.studyFiles.state && value.studyFiles.state != "3") {
        const videoElement = document.getElementById("video");
        
        switch(true) {
          case value.dragTag === '0' && value.speedTag === '0':
            console.log('情况1: dragTag=0, speedTag=0');
            videoElement.classList.add("hide-timeline");
            // 设置controlslist属性，禁止播放速度控制
            videoElement.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
            break;
            
          case value.dragTag === '0' && value.speedTag === '1':
            console.log('情况2: dragTag=0, speedTag=1');
            videoElement.classList.add("hide-timeline");
            // 移除播放速度控制限制
            videoElement.setAttribute('controlslist', 'nodownload noremoteplayback');
            break;
            
          case value.dragTag === '1' && value.speedTag === '0':
            console.log('情况3: dragTag=1, speedTag=0');
            videoElement.classList.remove("hide-timeline");
            // 设置controlslist属性，禁止播放速度控制
            videoElement.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
            break;
            
          case value.dragTag === '1' && value.speedTag === '1':
            console.log('情况4: dragTag=1, speedTag=1');
            videoElement.classList.remove("hide-timeline");
            // 移除播放速度控制限制
            videoElement.setAttribute('controlslist', 'nodownload noremoteplayback');
            break;
            
          default:
            console.log('未知的状态组合:', {
              dragTag: value.dragTag,
              speedTag: value.speedTag
            });
            break;
        }
      }

      // console.log(old, "old");
      // console.log(value, "新数据");
      if (old.studyFiles) {
        this.recordStudyProcessV1(old);
      }
      this.counts = 0;
      this.counts = this.counts + 1;

      this.currentStudyState = "";
      this.setVideoSrc(value);
      this.handleRefreshProcess(value);
      this.answerQuestionsIndex = [];
    },
  },
  mounted() {
    this.bindEventListener();

    this.$nextTick(() => {
      const videoElement = this.$refs.video;
      // videoElement.play(); // 开始播放
      videoElement.pause(); // 立即暂停
    });

    // 添加监听器
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeDestroy() {
    // 移除监听器
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
  },
  methods: {
    handleVisibilityChange() {
      const videoElement = this.$refs.video;
      if (document.hidden) {
        // 页面不可见，暂停视频
        if (videoElement) {
          videoElement.pause();
        }
      }
    },
    // 文件记录
    recordStudyProcessV1(old) {
      // console.log(UPLOAD_TYPE.getVideo().includes(old.studyFiles.fileType), '文件记录判断');
      // return
      if (!UPLOAD_TYPE.getVideo().includes(old.studyFiles?.fileType)) {
        let recordProcessParam = {
          courseId: old.courseId,
          chapterId: old.subsection,
          subsectionId: old.id,
          studyTime: 0,
        };
        recordStudyProcessV1(recordProcessParam).then((res) => {});
      }
      // else {
      //   this.handlerRecordProcess(old);
      // }
    },
    //视频地址
    setVideoSrc(studySubsection) {
      this.videoVisable = true;
      this.officeVisable = false;
      this.imageVisable = false;
      // this.$refs.video.pause();
      switch (studySubsection.studyFiles.fileType) {
        case "doc":
        case "DOC":
        case "docx":
        case "DOCX":
        case "pdf":
        case "PDF":
        case "ppt":
        case "PPT":
        case "pptx":
        case "PPTX":
        case "xls":
        case "XLS":
        case "xlsx":
        case "XLSX":
        case "pptx":
        case "PPTX":
          this.officeVisable = true;
          this.imageVisable = false;
          this.videoVisable = false;
          this.videoUrl = studySubsection.studyFiles.viewUrl;
          break;
        case "jpg":
        case "JPG":
        case "png":
        case "PNG":
        case "jpeg":
        case "JPEG":
        case "bmp":
        case "BMP":
        case "webp":
        case "WEBP":
          this.officeVisable = false;
          this.imageVisable = true;
          this.videoVisable = false;

          this.videoUrl = studySubsection.studyFiles.viewUrl;
          this.$nextTick(() => {
            // this.$refs.video.play();
          });

          break;
        case "mp4":
        case "MP4":
        case "mp3":
        case "MP3":
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = true;
          this.videoUrl = studySubsection.studyFiles.filePath;
          this.$nextTick(() => {
            this.$refs.video.load();
          });
          break;

        default:
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = false;
      }
      if (studySubsection.studyAnswerQuestions) {
        this.questionShowTimes = studySubsection?.studyAnswerQuestions.map(
          (item) => item.showTimeSeconds
        );
      }
    },
    //视频事件
    bindEventListener() {
      this.$refs.video.addEventListener("play", this.onPlayerPlaying);
      this.$refs.video.addEventListener("timeupdate", this.onPlayerTimeupdate);
      this.$refs.video.addEventListener("ended", this.onPlayerEnded);
      this.$refs.video.addEventListener("error", this.onPlayerError);
      this.$refs.video.addEventListener("pause", this.onPlayerPause);
      this.$refs.video.addEventListener("seeking", this.onPlayerSeeking);
    },
    onPlayerEnded() {
      console.log("视频播放结束!!!!!");
      this.statType = 1;
      // let currentTime
      // if (this.studySubsection && this.studySubsection.studyFiles.state == 3) {
      //   currentTime = Number(this.studySubsection.studyFiles.videoTime) + Number(this.studySubsection.studyFiles.studyTime)
      // }else{
      //   currentTime = Number(this.studySubsection.studyFiles.videoTime)
      // }
      // let params = {
      //   courseId:
      //     this.studySubsection.courseId,
      //   chapterId:
      //     this.studySubsection.chapterId,
      //   subsectionId: this.studySubsection?.id,
      //   studyTime: currentTime,
      //   state: this.studySubsection.studyFiles.state
      // };
      // recordStudyProcess(params)
      // .then((res) => {
      //   if ("200" == res.returnCode) {
      //     this.refreshShowProcess();
      //   }
      // })

      this.$emit(
        "resetupdate",
        this.studySubsection,
        this.chaindex,
        this.subindex
      );
    },

    //继续播放
    onPlayerPlaying() {
      this.isPlay = true;
      this.statType = 0;
      // console.log("播放",this.studySubsection);
      // this.counts = this.counts + 1
      this.isSpeedNum = this.isSpeedNum + 1;
      // this.$emit('resetupdate',this.studySubsection,this.chaindex,this.subindex)
    },
    //检查倍速插件
    setBeiSu() {
      const video = this.$refs.video;
      const currentTimes = video.currentTime;
      const currentUpdateTime = Date.now();

      if (this.lastTime !== undefined) {
        const timeDiff = currentTimes - this.lastTime;
        const realTimeDiff = (currentUpdateTime - this.lastUpdateTime) / 1000; // 转换为秒
        if (realTimeDiff > 0) {
          const playbackRate = timeDiff / realTimeDiff;
          // console.log("视频播放速度正常11111", playbackRate);
          if (playbackRate >= 2.4 && playbackRate <= 16) {
            // 判断是否存在1秒播放8秒
            // 暂停视频
            video.pause();
            this.$alert(
              "系统检测到使用插件进行倍速播放，已自动暂停学习，关闭插件后可继续学习。",
              "警告",
              {
                confirmButtonText: "确定",
                callback: () => {
                  this.$message({
                    type: "info",
                    message: `关闭插件后，继续学习`,
                  });
                },
              }
            );
          }
        }
      }

      this.lastTime = currentTimes;
      this.lastUpdateTime = currentUpdateTime;
    },
    //更新时间
    onPlayerTimeupdate(e) {
      console.log(e.target.currentTime, "e");
      const video = this.$refs.video;
      let zhTime =
        parseInt(e.target.currentTime) %
        Number(this.studySubsection.studyFiles.videoTime);
      // if (this.isPlay == true && this.studySubsection.studyFiles.state != "3") {
      //   this.setBeiSu();
      // }
      if (this.counts == 1) {
        if (this.studySubsection.studyFiles.state == 3) {
          e.target.currentTime =
            parseInt(this.studySubsection.studyFiles.studyTime) %
            Number(this.studySubsection.studyFiles.videoTime);
        } else {
          e.target.currentTime = this.studySubsection.studyFiles.studyTime;
        }

        // this.lastRecordTime = parseInt(this.studySubsection.pace);
      } else {
        if (this.studySubsection.studyState == 3) {
          this.lastRecordTime =
            parseInt(this.lastRecordTime) %
            Number(this.studySubsection.secondTime);
        }
        const currentTime = parseInt(video.currentTime);
        this.currentPlayerTime = currentTime;
        let recordTime = currentTime - this.lastRecordTime;

        console.log("vodeo___^", zhTime,parseInt(e.target.currentTime), Number(this.studySubsection.studyFiles.videoTime));
        // if (recordTime < this.recordProcessThreshold) {
        //   //没到记录进度时间
        //   // return;
        // }
        // if (recordTime > this.recordProcessThreshold) {
        //   //向后拖拽视频进度
        //   video.currentTime = this.lastRecordTime;
        //   return;
        // }
        if (this.recordProcessStatus === 0) {
          if (zhTime % 10 == 0 && !(zhTime == this.isTime)) {
            console.log("$$$$$$￥￥￥￥");
            this.isTime = zhTime;
            this.handlerRecordProcess(currentTime);
          }
        }
      }
      this.counts++;
    },
    //停止播放
    onPlayerPause(e) {
      console.log("暂停播发");
      this.isPlay = false;

      let currentTime;
      if (this.studySubsection && this.studySubsection.studyFiles.state == 3) {
        currentTime =
          parseInt(e.target.currentTime) +
          Number(this.studySubsection.studyFiles.studyTime);
      } else {
        currentTime = parseInt(e.target.currentTime);
      }
      let params = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection?.id,
        studyTime: currentTime,
        state: this.studySubsection.studyFiles.state,
      };
      recordStudyProcess(params).then((res) => {
        if ("200" == res.returnCode) {
          this.refreshShowProcess();
        }
      });
    },
    //
    onPlayerSeeking() {
      // console.log('这是啥啊啥-----')
    },

    //答题
    submitQuestion(index) {
      if (this.questionCheckResult) {
        let trueAnswer = this.questionInfo.questionOptions.filter((item) => {
          return item.isTrue == "0";
        });
        if (this.questionCheckResult == trueAnswer[0].sort) {
          //回答正确
          // this.handleVideoPlay()
          this.$nextTick(() => {
            this.$refs.video.play();
          });
          this.questionCheckResult = "";
          this.answerQuestionsIndex.push(index);
          this.handlerRecordProcess();
          this.manualRecordProcess();
        } else {
          this.$message.warning("抱歉，回答错误");
        }
      } else {
        this.$message.warning("请选择答案后再提交");
      }
    },
    //继续学习
    videoPlay(playTime) {
      const video = this.$refs.video;
      if (playTime) {
        video.currentTime = playTime;
      }
      // video.play().catch(err => { })
      this.videoStatus = "playing";
    },
    //暂停学习
    videoPause() {
      const video = this.$refs.video;
      video.pause();
      console.log("我暂停了");
      this.videoStatus = "pausing";
      if (this.currentStudyState != "3") {
        this.manualRecordProcess();
      }
    },
    //继续学习
    handleVideoPlay() {
      if (this.currentStudyState != "3") {
        this.handleRefreshProcess(this.studySubsection);
        return;
      }
      this.videoPlay();
    },
    //刷新课程学习进度
    handleRefreshProcess(currentStudySubsection) {
      console.log("刷新课程学习进度", currentStudySubsection);
      let refreshProcessParam = {
        courseId: currentStudySubsection.courseId
          ? currentStudySubsection.courseId
          : this.currentStudySubsectionIds.courseId,
        chapterId: currentStudySubsection.chapterId
          ? currentStudySubsection.chapterId
          : this.currentStudySubsectionIds.chapterId,
        subsectionId: currentStudySubsection.id,
        studyTime: 0,
      };
      console.log(refreshProcessParam, "进度传参");
      refreshStudyProcess(refreshProcessParam).then((res) => {
        if ("200" != res.returnCode) {
          this.videoPause();
          return;
        }
        const subsectionStudyUser = res.returnData;
        this.currentStudyState = subsectionStudyUser.state;
        if (subsectionStudyUser.state != "3") {
          this.lastRecordTime = subsectionStudyUser.studyTime;
          this.videoPlay();
        } else {
          this.videoPlay(0);
        }
      });
    },
    //记录学习进度
    handlerRecordProcess(old, stustate) {
      const videoPlayTime = this.$refs.video.currentTime;
      let currentTime = parseInt(videoPlayTime);
      console.log("视频数据", this.studySubsection);
      if (this.studySubsection && this.studySubsection.studyFiles.state == 3) {
        if (this.statType == 1) {
          currentTime = 0;
        }
        currentTime =
          Number(currentTime) +
          Number(this.studySubsection.studyFiles.studyTime);
      }
      console.log(currentTime, "8***8currenttime");

      // console.log("视频数据时长zs", currentTime);
      // else if (
      //   this.fileType == 2 &&
      //   this.fatherStudySubsection &&
      //   this.fatherStudySubsection.studyState == 3
      // )
      // {
      //   currentTime =
      //     Number(currentTime) + Number(this.fatherStudySubsection.studyTime);
      // }
      // console.log(old, "记录学习进度old");
      // console.log(
      //   this.studySubsection,
      //   "记录学习进度currentStudySubsectionIds"
      // );
      // console.log(this.fatherStudySubsection, "记录学习进度_studyState3");
      // courseId: old.courseId,
      //     chapterId: old.subsection,
      //     subsectionId: old.id,
      //     studyTime: 0,
      let recordProcessParam = {
        courseId: old.courseId
          ? old.courseId
          : this.studySubsection.courseId
          ? this.studySubsection.courseId
          : this.currentStudySubsectionIds.courseId
          ? this.currentStudySubsectionIds.courseId
          : "",
        chapterId: old.chapterId
          ? old.chapterId
          : this.studySubsection.chapterId
          ? this.studySubsection.chapterId
          : this.currentStudySubsectionIds.chapterId
          ? this.currentStudySubsectionIds.chapterId
          : "",
        // subsectionId: old.id ? old.id : this.studySubsection.id,
        subsectionId: old?.id
          ? old.id
          : this.currentStudySubsectionIds?.id
          ? this.currentStudySubsectionIds.id
          : this.studySubsection?.id
          ? this.studySubsection.id
          : "",
        studyTime: currentTime,
        state: this.studySubsection.studyFiles.state
          ? this.studySubsection.studyFiles.state
          : this.studySubsection.studyState,

        // state:this.studySubsection.studyFiles.state
      };
      // console.log(
      //   this.studySubsection,
      //   "进度参数记录_11",
      // );
      // console.log("recordProcess", recordProcessParam);

      // if (this.fileType == 2) {
      // alert(this.fatherStudySubsection.studyState)
      // recordProcessParam.state = this.fatherStudySubsection.studyState;
      // recordProcessParam.state = '3'
      // recordProcessParam.studyTime = '937'
      // }
      this.recordProcessStatus = 1;

      recordStudyProcess(recordProcessParam)
        .then((res) => {
          this.recordProcessStatus = 0;
          if ("200" == res.returnCode) {
            this.lastRecordTime = currentTime;
            if (this.studySubsection && this.studySubsection.studyState == 3) {
              this.lastRecordTime =
                this.lastRecordTime - this.studySubsection.studyTime;
            }
            this.refreshShowProcess();
            return;
          }
          const recordState = res.returnData;
          if (recordState === 2 || recordState === 4) {
            //手动修改课程进度
            this.videoPlay(this.lastRecordTime);
          }
          if (recordState === 3) {
            //已有学习中的课程
            this.videoPause();
            this.repeatStudyVisible = true;
          }
        })
        .catch((e) => {
          setTimeout(() => {
            this.recordProcessStatus = 0;
          }, 100);
        });
    },
    //继续学习
    confirmRepeatStudy() {
      this.repeatStudyVisible = false;
      this.handleVideoPlay();
    },
    //记录学习进度
    manualRecordProcess() {
      const video = this.$refs.video;
      this.lastRecordTime = video.currentTime - this.recordProcessThreshold;
      const currentTime = parseInt(video.currentTime);
      let recordProcessParam = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection.id,
        studyTime: currentTime,
      };

      recordStudyProcess(recordProcessParam).then((res) => {
        if ("200" === res.returnCode) {
          if (2 == res.returnData) {
            video.currentTime = this.lastRecordTime;
          }
          this.refreshShowProcess();
          return;
        }
      });
    },
    refreshShowProcess() {
      setTimeout(() => {
        this.$emit(
          "updateStudySubsectionProcess",
          this.studySubsection.chapterId
            ? this.studySubsection.chapterId
            : this.currentStudySubsectionIds.chapterId
            ? this.currentStudySubsectionIds.chapterId
            : ""
        );
      }, 100);
    },
  },
  beforeDestroy() {
    this.recordStudyProcessV1(this.studySubsection);
  },
};
</script>
<style lang="scss" scoped>
#courseVideoPlayer {
  flex: 1;
  position: relative;
  height: 100%;
}

.videoPlayer {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 0;
}

//video::-webkit-media-controls-fullscreen-button {
//  display: none;
//}
//video::-webkit-media-controls-play-button {
//  display: none;
//}
.ques-card {
  padding: 0.625rem;
  border-radius: 0.3125rem;
  background: #fff;
  margin-bottom: 0.625rem;

  p {
    font-size: 0.5625rem;
    color: #333333;
    margin-bottom: 0.8125rem;
  }

  .ques-options {
    ::ng-deep .ivu-checkbox-group-item {
      display: block;
      margin-bottom: 0.5313rem;
    }

    ::ng-deep .ivu-radio-wrapper {
      display: block;
      margin-bottom: 0.5313rem;
    }
  }
}

.iconContent {
  position: absolute;
  z-index: 3;
  height: 95%;
  width: 100%;
  display: none;

  .videoIcon {
    height: 2rem;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    border: 0.0625rem solid #000000;
    border-radius: 50%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000000;
    cursor: pointer;

    ::ng-deep .ivu-icon {
      font-size: 0.9375rem;
      color: #ffffff;
      margin-top: -0.21rem;
    }
  }

  .videoExpand {
    height: 2rem;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    border: 0.0625rem solid #000000;
    border-radius: 50%;
    position: relative;
    top: 99%;
    left: 99%;
    transform: translate(-50%, -50%);
    background: #000000;
    cursor: pointer;

    ::ng-deep .ivu-icon {
      font-size: 0.9375rem;
      color: #ffffff;
      margin-top: -0.21rem;
    }
  }
}

#question-radio > span .ivu-radio {
  margin-right: 10px;
}
.hide-timeline::-webkit-media-controls-timeline {
  display: none;
}
</style>
