<template>
  <div id="courseVideoPlayer">
    <video v-show="videoVisable" :autoplay="true" id="video" ref="video" class="videoPlayer" preload="auto" controls
      controlslist="nodownload noremoteplayback" disablePictureInPicture x5-video-player-type="h5">
      <source :src="videoUrl" type="video/mp4" />
      您的浏览器不支持 video 标签。
    </video>
    <!-- office文件及pdf预览 -->
    <iframe style="width:1007px;height:510px" id="ifr_con" v-if="officeVisable" :src="videoUrl" frameborder="1"></iframe>
    <!-- 图片文件预览 -->
    <el-image style="width:1007px;height:510px" v-if="imageVisable" :src="videoUrl"></el-image>
    <!--  中途答题-->
    <el-dialog v-model="questionVisible" :visible.sync="questionVisible" :close-on-click-modal="false"
      :show-close="false">
      <div class="ques-card">
        <p>{{ questionInfo.questionName }}</p>
        <el-radio-group class="ques-options" v-model="questionCheckResult" id="question-radio">
          <el-radio :label="item.sort" v-for="(item, index) in questionInfo.questionOptions" :key="index">{{ item.sort + '
          ' + item.optionName }}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="submitQuestion(questionInfo.index)">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="repeatStudyVisible" :visible.sync="repeatStudyVisible" :close-on-click-modal="false"
      :show-close="false">
      <div class="ques-card" style="text-align: center">
        <p>您已开始学习其他课程，点击按钮，继续学习</p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="confirmRepeatStudy">继续学习</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { refreshStudyProcess, recordStudyProcess, getQuestionDetail } from '@/api/learningCenter'
export default {
  name: 'CourseVideoPlayer',
  props: {
    studySubsection: {
      type: [Object],
    },
  },
  data() {
    return {
      officeVisable: false,
      imageVisable: false,
      videoVisable: true,
      currentPlayerTime: -1,
      questionShowTimes: [],
      lastRecordTime: 0,
      videoUrl: '',
      questionCheckResult: '',
      repeatStudyVisible: false,
      recordProcessThreshold: 10,
      currentStudyState: '',
      videoStatus: '',
      questionInfo: {
        questionName: '',
        questionOptions: [],
        index: 0,
      },
      answerQuestionsIndex: [],
      recordProcessStatus: 0,
      BASEURL: process.env.VUE_APP_VIEW_URL,
      video: {
        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        cover: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
        muted: false,
        loop: false,
        preload: 'auto',
        poster: '',
        volume: 1,
        autoplay: true,
      },
    }
  },
  computed: {
    questionVisible() {
      let index = this.questionShowTimes.indexOf(this.currentPlayerTime)
      let answerQuestionsIndex = this.answerQuestionsIndex.indexOf(index)
      if (index != -1 && answerQuestionsIndex === -1) {
        this.videoPause()
        this.questionInfo.index = index
        this.questionInfo.questionName = this.studySubsection.studyAnswerQuestions[index].questionName
        let questionId = this.studySubsection.studyAnswerQuestions[index].qustionId
        let params = {
          id: questionId,
        }
        getQuestionDetail(params).then(res => {
          if (res.returnCode == '200' && res.returnData) {
            const questionDetail = res.returnData
            this.questionInfo.questionOptions = questionDetail.optionList
            this.questionInfo.questionName = questionDetail.title
          } else {
            this.$message.error(res.returnMessage)
          }
        })
        return true
      }
      return false
    },
  },
  watch: {
    studySubsection(value, old) {
      console.log(this.currentPlayerTime, old.studyFiles.fileName, '旧数据')
      this.currentStudyState = ''
      this.setVideoSrc(value)
      this.handleRefreshProcess(value)
      this.answerQuestionsIndex = [];


    },
  },
  mounted() {
    this.bindEventListener()
  },
  methods: {
    //视频地址
    setVideoSrc(studySubsection) {
      this.videoVisable = true;
      this.officeVisable = false;
      this.imageVisable = false;
      this.$refs.video.pause();


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
          // console.log(this.yunViewUrlStr)
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
            this.$refs.video.play();
          })

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
            this.$refs.video.load()
          })
          break;

        default:
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = false;
      }
      if (studySubsection.studyAnswerQuestions) {
        this.questionShowTimes = studySubsection.studyAnswerQuestions.map(item => item.showTimeSeconds)
      }




    },
    //视频事件
    bindEventListener() {

      this.$refs.video.addEventListener('timeupdate', this.onPlayerTimeupdate)
      this.$refs.video.addEventListener('ended', this.onPlayerEnded)
      this.$refs.video.addEventListener('error', this.onPlayerError)
      this.$refs.video.addEventListener('play', this.onPlayerPlaying)
      this.$refs.video.addEventListener('pause', this.onPlayerPause)
      this.$refs.video.addEventListener('seeking', this.onPlayerSeeking)


    },
    //更新时间
    onPlayerTimeupdate(e, a) {

      // //已经完成学习，不在展示试题
      // if (this.currentStudyState === '3') {
      //   return
      // }
      const video = this.$refs.video
      // if (!video) {
      //   return
      // }
      const currentTime = parseInt(video.currentTime)
      this.currentPlayerTime = currentTime
      // console.log(currentTime, 23333)
      let recordTime = currentTime - this.lastRecordTime
      if (recordTime < this.recordProcessThreshold) {
        //没到记录进度时间
        return
      }
      if (recordTime > this.recordProcessThreshold) {
        //向后拖拽视频进度
        video.currentTime = this.lastRecordTime
        return
      }

      // if (this.recordProcessStatus === 0) {
      //   this.handlerRecordProcess(currentTime)
      // }
    },

    //截至
    onPlayerEnded() {
      console.log('停止播放')
      this.videoStatus = 'ended'
      if (this.currentStudyState === '3') {
        return
      }
      this.currentStudyState = '3'
      this.manualRecordProcess()
    },
    //视频播放错误
    onPlayerError() {
      this.$message.error('视频播放错误')
    },
    //继续播放
    onPlayerPlaying() {

    },
    //停止播放
    onPlayerPause() {

    },
    //
    onPlayerSeeking() { },

    //答题
    submitQuestion(index) {
      if (this.questionCheckResult) {
        let trueAnswer = this.questionInfo.questionOptions.filter(item => {
          return item.isTrue == '0'
        })
        if (this.questionCheckResult == trueAnswer[0].sort) {
          //回答正确
          this.handleVideoPlay()
          this.questionCheckResult = ''
          this.answerQuestionsIndex.push(index)
          this.handlerRecordProcess()
          this.manualRecordProcess()
        } else {
          this.$message.warning('抱歉，回答错误')
        }
      } else {
        this.$message.warning('请选择答案后再提交')
      }
    },
    //继续学习
    videoPlay(playTime) {
      const video = this.$refs.video
      if (playTime) {
        video.currentTime = playTime
      }
      // video.play().catch(err => { })
      this.videoStatus = 'playing'
    },
    //暂停学习
    videoPause() {
      const video = this.$refs.video
      video.pause()
      console.log('我暂停了')
      this.videoStatus = 'pausing'
      if (this.currentStudyState != '3') {
        this.manualRecordProcess()
      }
    },
    //继续学习
    handleVideoPlay() {
      if (this.currentStudyState != '3') {
        this.handleRefreshProcess(this.studySubsection)
        return
      }
      this.videoPlay()
    },
    //刷新课程学习进度
    handleRefreshProcess(currentStudySubsection) {
      let refreshProcessParam = {
        courseId: currentStudySubsection.courseId,
        chapterId: currentStudySubsection.chapterId,
        subsectionId: currentStudySubsection.id,
        studyTime: 0,
      }
      refreshStudyProcess(refreshProcessParam).then(res => {
        if ('200' != res.returnCode) {
          this.videoPause()
          return
        }
        const subsectionStudyUser = res.returnData
        this.currentStudyState = subsectionStudyUser.state
        if (subsectionStudyUser.state != '3') {
          this.lastRecordTime = subsectionStudyUser.studyTime
          this.videoPlay()
        } else {
          this.videoPlay(0)
        }
      })
    },
    //记录学习进度
    handlerRecordProcess() {
      const videoPlayTime = this.$refs.video.currentTime
      const currentTime = parseInt(videoPlayTime)
      let recordProcessParam = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection.id,
        studyTime: currentTime,
      }
      this.recordProcessStatus = 1
      recordStudyProcess(recordProcessParam)
        .then(res => {
          this.recordProcessStatus = 0
          if ('200' == res.returnCode) {
            this.lastRecordTime = currentTime
            this.refreshShowProcess()
            return
          }
          const recordState = res.returnData
          if (recordState === 2) {
            //手动修改课程进度
            this.videoPlay(this.lastRecordTime)
          }
          if (recordState === 3) {
            //已有学习中的课程
            this.videoPause()
            this.repeatStudyVisible = true
          }
        })
        .catch(e => {
          setTimeout(() => {
            this.recordProcessStatus = 0
          }, 100)
        })
    },
    //继续学习
    confirmRepeatStudy() {
      this.repeatStudyVisible = false
      this.handleVideoPlay()
    },
    //记录学习进度
    manualRecordProcess() {
      const video = this.$refs.video
      this.lastRecordTime = video.currentTime - this.recordProcessThreshold
      const currentTime = parseInt(video.currentTime)
      let recordProcessParam = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection.id,
        studyTime: currentTime,
      }

      recordStudyProcess(recordProcessParam).then(res => {
        if ('200' === res.returnCode) {
          if (2 == res.returnData) {
            video.currentTime = this.lastRecordTime
          }
          this.refreshShowProcess()
          return
        }
      })
    },
    refreshShowProcess() {
      setTimeout(() => {
        this.$emit('updateStudySubsectionProcess', this.studySubsection.chapterId)
      }, 100)
    },
  },
}
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

#question-radio>span .ivu-radio {
  margin-right: 10px;
}
</style>
