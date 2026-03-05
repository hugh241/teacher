<template>
  <div id="courseVideoPlayer" >
    <iframe
      width="1400px"
      height="400px"
      :src="videoUrl">
    </iframe>
<!--    <Modal  v-model="questionVisible" :mask-closable="false"  :closable="false">-->
<!--      <div class="ques-card">-->
<!--        <p>{{questionInfo.questionName}}</p>-->
<!--        <RadioGroup class="ques-options" v-model="questionCheckResult" id="question-radio">-->
<!--          <Radio :label="item.sort" v-for="(item,index) in questionInfo.questionOptions" :key="index">{{item.sort + '  ' + item.optionName}}</Radio>-->
<!--        </RadioGroup>-->
<!--      </div>-->
<!--      <div slot="footer" style="text-align: center;">-->
<!--        <Button type="primary" @click="submitQuestion(questionInfo.index)">提交</Button>-->
<!--      </div>-->
<!--    </Modal>-->


<!--    <Modal v-model="repeatStudyVisible" :mask-closable="false" :closable="false">-->
<!--      <div class="ques-card" style="text-align: center;">-->
<!--        <p>您已开始学习其他课程，点击按钮，继续学习</p>-->
<!--      </div>-->
<!--      <div slot="footer" style="text-align: center;">-->
<!--        <Button type="primary" @click="confirmRepeatStudy">继续学习</Button>-->
<!--      </div>-->
<!--    </Modal>-->



  </div>
</template>
<script>
import {refreshStudyProcess, recordStudyProcess, getQuestionDetail} from '@/api/learningCenter';
export default {
  name:'CourseVideoPlayer',
  props:{
    studySubsection: {
      type: [Object]
    },
  },
  data() {
    return {
      currentPlayerTime: -1,
      questionShowTimes: [],
      lastRecordTime: 0,
      videoUrl:'',
      questionCheckResult:'',
      repeatStudyVisible: false,
      recordProcessThreshold: 10,
      currentStudyState: '',
      videoStatus: '',
      questionInfo: {
        questionName: '',
        questionOptions: [],
        index: 0
      },
      answerQuestionsIndex:[],
      recordProcessStatus: 0,
      BASEURL : process.env.VUE_APP_VIEW_URL,
      video: {
        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        cover: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
        muted: false,
        loop: false,
        preload: 'auto',
        poster: '',
        volume: 1,
        autoplay: true
      },
    }
  },
  computed:{
    questionVisible(){
      let index = this.questionShowTimes.indexOf(this.currentPlayerTime);
      let answerQuestionsIndex = this.answerQuestionsIndex.indexOf(index);
      if(index != -1 && answerQuestionsIndex === -1){
        this.videoPause();
        this.questionInfo.index = index;
        this.questionInfo.questionName = this.studySubsection.studyAnswerQuestions[index].questionName;
        let questionId = this.studySubsection.studyAnswerQuestions[index].qustionId;
        let params = {
          id : questionId
        }
        getQuestionDetail(params).then(res => {
          if (res.returnCode == "200" && res.returnData) {
            const questionDetail = res.returnData;
            this.questionInfo.questionOptions = questionDetail.optionList;
            this.questionInfo.questionName = questionDetail.title;
          } else {
            this.$message.error(res.returnMessage);
          }
        });
        return true;
      }
      return false
    },

  },
  watch:{
    studySubsection(value){
      this.currentStudyState = '';
      this.setVideoSrc(value);
      this.handleRefreshProcess(value);
      setTimeout(()=> this.videoPlay(), 500);
      this.answerQuestionsIndex = [];
    },
  },
  mounted(){
    this.bindEventListener();
  },
  methods: {
    setVideoSrc(studySubsection){
      if (studySubsection.studyFiles){
        this.videoUrl =  this.BASEURL + studySubsection.studyFiles.filePath;
      }
      this.$nextTick(()=>{
        this.$refs.video.load();
      })
      if(studySubsection.studyAnswerQuestions){
        this.questionShowTimes = studySubsection.studyAnswerQuestions.map(item => item.showTimeSeconds);
      }
    },
    bindEventListener(){
      this.$refs.video.addEventListener('timeupdate', this.onPlayerTimeupdate);
      this.$refs.video.addEventListener('ended', this.onPlayerEnded);
      this.$refs.video.addEventListener('error', this.onPlayerError);
      this.$refs.video.addEventListener('play', this.onPlayerPlaying);
      this.$refs.video.addEventListener('pause', this.onPlayerPause);
      this.$refs.video.addEventListener('seeking', this.onPlayerSeeking);
    },
    submitQuestion(index){
      if (this.questionCheckResult){
        let trueAnswer = this.questionInfo.questionOptions.filter(item => {
          return item.isTrue == '0';
        });
        if (this.questionCheckResult == trueAnswer[0].sort){
          //回答正确
          this.handleVideoPlay();
          this.questionCheckResult = '';
          this.answerQuestionsIndex.push(index);
        }else{
          this.$message.warning('抱歉，回答错误');
        }
      }else {
        this.$message.warning('请选择答案后再提交');
      }
    },
    videoPlay(playTime){
      const video = this.$refs.video;
      if(playTime){
        video.currentTime = playTime;
      }
      video.play().catch((err)=>{
      });
      this.videoStatus = 'playing';
    },
    videoPause(){
      const video = this.$refs.video;
      video.pause();
      this.videoStatus = 'pausing';
      if(this.currentStudyState != '3'){
        this.manualRecordProcess();
      }
    },
    handleVideoPlay(){
      if(this.currentStudyState != '3'){
        this.handleRefreshProcess(this.studySubsection);
        return;
      }
      this.videoPlay();
    },
    handleRefreshProcess(currentStudySubsection){
      let refreshProcessParam = {
        courseId: currentStudySubsection.courseId,
        chapterId: currentStudySubsection.chapterId,
        subsectionId: currentStudySubsection.id,
        studyTime: 0
      }
      refreshStudyProcess(refreshProcessParam).then(res=>{
        if("200" != res.returnCode){
          this.videoPause();
          return;
        }
        const subsectionStudyUser = res.returnData;
        this.currentStudyState = subsectionStudyUser.state;
        if(subsectionStudyUser.state != '3'){
          this.lastRecordTime = subsectionStudyUser.studyTime;
          this.videoPlay(this.lastRecordTime);
        }else{
          this.videoPlay(0);
        }
      })
    },
    handlerRecordProcess(){
      const videoPlayTime = this.$refs.video.currentTime;
      const currentTime = parseInt(videoPlayTime);
      let recordProcessParam = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection.id,
        studyTime: currentTime
      }
      this.recordProcessStatus = 1;
      recordStudyProcess(recordProcessParam).then(res=>{
        this.recordProcessStatus = 0;
        if("200" == res.returnCode){
          this.lastRecordTime = currentTime;
          this.refreshShowProcess();
          return;
        }
        const recordState = res.returnData;
        if(recordState === 2){
          //手动修改课程进度
          this.videoPlay(this.lastRecordTime);
        }
        if(recordState === 3){
          //已有学习中的课程
          this.videoPause();
          this.repeatStudyVisible = true;
        }
      }).catch(e=>{
        setTimeout(()=>{
          this.recordProcessStatus = 0;
        },3000)
      })
    },
    confirmRepeatStudy(){
      this.repeatStudyVisible = false;
      this.handleVideoPlay();
    },
    manualRecordProcess(){
      const video = this.$refs.video;
      this.lastRecordTime = video.currentTime - this.recordProcessThreshold;
      const currentTime = parseInt(video.currentTime);
      let recordProcessParam = {
        courseId: this.studySubsection.courseId,
        chapterId: this.studySubsection.chapterId,
        subsectionId: this.studySubsection.id,
        studyTime: currentTime
      }
      recordStudyProcess(recordProcessParam).then(res=>{
        if("200" === res.returnCode){
          this.refreshShowProcess();
          return;
        }
        if(2 == res.returnData){
          video.currentTime = this.lastRecordTime;
        }
      });
    },
    refreshShowProcess(){
      setTimeout(()=>{
        this.$emit('updateStudySubsectionProcess', this.studySubsection.chapterId);
      }, 500);
    },
    onPlayerEnded($event) {
      this.videoStatus = 'ended';
      if(this.currentStudyState === '3'){
        return;
      }
      this.currentStudyState = '3';
      this.manualRecordProcess();
    },
    onPlayerPlaying(event) {

    },
    onPlayerPause(event){

    },
    onPlayerTimeupdate(event) {
      //已经完成学习，不在展示试题
      if(this.currentStudyState === '3'){
        return;
      }
      const video = this.$refs.video
      if(!video){
        return;
      }
      const currentTime = parseInt(video.currentTime);
      this.currentPlayerTime = currentTime;
      if(currentTime - this.lastRecordTime < this.recordProcessThreshold){
        //没到记录进度时间
        return;
      }
      if(currentTime - this.lastRecordTime > this.recordProcessThreshold){
        //向后拖拽视频进度
        video.currentTime = this.lastRecordTime;
        return;
      }
      if(this.recordProcessStatus === 0){
        this.handlerRecordProcess(currentTime);
      }
    },
    onPlayerSeeking(event){

    },
    onPlayerError($event){
      this.$message.error('视频播放错误')
    },

  }
}
</script>
<style lang="scss" scoped>
#courseVideoPlayer{
  flex: 1;
  position: relative;
  height:100%
}
.videoPlayer{
  height: 500px;
  width: 1400px;
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
  padding: .625rem;
  border-radius: .3125rem;
  background: #fff;
  margin-bottom: .625rem;
  p {
    font-size: .5625rem;
    color: #333333;
    margin-bottom: .8125rem;
  }
  .ques-options {
    ::deep .ivu-checkbox-group-item {
      display: block;
      margin-bottom: .5313rem;
    }
    ::deep .ivu-radio-wrapper {
      display: block;
      margin-bottom: .5313rem;
    }
  }
}
.iconContent{
  position: absolute;
  z-index: 3;
  height: 95%;
  width: 100%;
  display: none;
  .videoIcon{
    height: 2rem;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    border: .0625rem solid #000000;
    border-radius: 50%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000000;
    cursor: pointer;
    ::deep .ivu-icon{
      font-size: .9375rem;
      color: #ffffff;
      margin-top: -0.21rem;
    }
  }
  .videoExpand{
    height: 2rem;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    border: .0625rem solid #000000;
    border-radius: 50%;
    position: relative;
    top: 99%;
    left: 99%;
    transform: translate(-50%, -50%);
    background: #000000;
    cursor: pointer;
    ::deep .ivu-icon{
      font-size: .9375rem;
      color: #ffffff;
      margin-top: -0.21rem;
    }
  }
}
#question-radio > span .ivu-radio {
  margin-right: 10px;
}
</style>
