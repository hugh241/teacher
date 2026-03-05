<template>
  <div>
    <el-dialog title="新增小节中途答题" :visible.sync="addDisplay" width="60%" @close="visibleChange">
      <el-form :model="addForm" ref="addForm" label-position="right" label-width="100px">

        <el-row>
          <el-col :span="24">
            <el-form-item label="小节名称：" prop="subsectionName">
              <div class="content-detail">{{ addForm.subsectionName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="视频时长：">
              <div class="content-detail">{{ formatTime(addForm.videoTime) }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-button type="primary" class="button" @click="addAnswerNum" icon="el-icon-plus" long
              style="margin-bottom: 15px">增加答题</el-button>
          </el-col>
        </el-row>

        <el-row v-for="(item, index) in answerTimeList" :key="index">
          <p
            style="width: 94%;height: 30px;line-height: 20px;font-size: 14px;color: #ff9900; margin-left: 30px; margin-top: 15px">
            第{{ index + 1 }}次答题
            <el-button type="danger" @click="removeAnswerNum(item)" style="float: right;" size="small">删除</el-button>
          </p>
          <p style="width: 94%;margin-left: 30px;height: 10px;border-top: 1px solid #e3e8ee;"></p>
          <el-col :span="23">
            <el-form-item label="答题时间" prop="showTime">
              <el-input placeholder="请输入中途答题时间，如:00:05:30" v-model="item.showTime" :maxlength="maxlength"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问答题目" prop="qustionId">
              <CompileSingle :courseId="addForm.courseId" :chapterId="addForm.chapterId"
                :subsectionId="addForm.subsectionId" :questionId="item.qustionId" ref="compileSingleRef"
                @handlePush="handlePush($event, index, item)"></CompileSingle>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="button" @click="close">取消</el-button>
        <el-button type="primary" class="button" @click="addFormSubmit">确定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>

import { addAnswerQuestion, deleteQuestionV3 } from '@/api/learningCenter';
import CompileSingle from '@/views/train/components/publish/components/CompileSingle.vue'
export default {
  props: ['moduleTag', 'courseId'],
  components: { CompileSingle },
  data() {
    return {
      maxlength: 8,
      addDisplay: false,
      addDisplay1: false,
      addForm: {
        courseId: '',
        chapterId: '',
        subsectionId: '',
        subsectionName: '',
        videoTime: ''
      },
      answerTimeList: [
        {
          answerNum: '1',
          showTime: '',
          qustionId: ''
        }
      ],
      qustionList: [],

      arrList: []

    };
  },
  methods: {
    handlePush(params, index, item) {
      console.log(params, index, item)
      item.qustionId = params.questionId;
      this.submit();
    },

    show(row) {

      this.addForm.courseId = row.courseId;
      this.addForm.chapterId = row.chapterId;
      this.addForm.subsectionId = row.id;
      this.addForm.subsectionName = row.subsectionName;
      this.addForm.videoTime = row.videoTime;
      let answerList = row.studyAnswerQuestions;

      if (answerList != null && answerList.length > 0) {
        let answerArray = [];
        answerList.forEach((item, index) => {

          // this.$refs.compileSingleRef[index].selectTopicOptionInfo

          let answer = {
            answerNum: index + 1,
            showTime: item.showTime,
            qustionId: item.qustionId
          }
          answerArray.push(answer);
        })
        this.answerTimeList = answerArray;
      }
      this.addDisplay = true;
    },

    close() {
      console.log(this.$refs.addForm)

      this.$refs.addForm.resetFields();
      this.addDisplay = false;
      this.addForm = {};
      this.answerTimeList = [
        {
          answerNum: '1',
          showTime: '',
          qustionId: ''
        }
      ];
    },


    //新增中途答题次数
    addAnswerNum() {
      let answerNum = this.answerTimeList.length + 1;
      this.answerTimeList.push(
        {
          answerNum: answerNum,
          showTime: '',
          qustionId: ''
        }
      )
    },

    //删除答题次数
    removeAnswerNum(row) {
      deleteQuestionV3(row.qustionId).then(res => {
        let filter = this.answerTimeList.filter(item => item.answerNum != row.answerNum);
        this.answerTimeList = filter;
      })

    },


    //提交
    addFormSubmit() {
      this.$refs.compileSingleRef.filter(item => item.popup_clo());
      setTimeout(() => {

      }, 1000)

      console.log(this.answerTimeList)
    },
    submit() {
      if (this.answerTimeList.length == 0) {
        this.$message.warning('中途答题至少要有一次，请重新输入');
        return false;
      }
      let showTimeFlag = true;
      let qustionIdFlag = true;
      let videoTime = this.addForm.videoTime;
      this.answerTimeList.forEach(item => {
        if (item.showTime == null || item.showTime == '' || item.showTime == undefined) {
          // this.$message.warning('答题时间不能为空，请输入');
          showTimeFlag = false;
          return;
        }
        let showTime = this.timeFormat(item.showTime);
        if (showTime > videoTime) {
          this.$message.warning('答题时间不能大于视频时长，请重新输入');
          showTimeFlag = false;
          return;
        }
        if (item.qustionId == null || item.qustionId == '' || item.qustionId == undefined) {
          this.$message.warning('问答题目不能为空，请选择');
          qustionIdFlag = false;
          return;
        }
      })
      if (showTimeFlag && qustionIdFlag) {
        let param = {
          subsectionId: this.addForm.subsectionId,
          answerTimeList: JSON.stringify(this.answerTimeList)
        }
        addAnswerQuestion(param).then(res => {
          if (res.returnCode == "200") {
            this.$message.success('小节中途答题添加成功！');
            this.close();
          } else {
            this.$message.error(res.returnMessage);
          }
          this.addDisplay = false;
          this.$refs.addForm.resetFields();
          this.$emit('answerSubmitListener', true);
        });
      }
    },
    visibleChange() {
      console.log('关闭')
      this.$refs.addForm.resetFields();

    },

    //时间格式转换 时分秒 -> 秒
    timeFormat(e) {
      let time = e;
      let len = time.split(':')
      if (len.length == 3) {
        let hour = time.split(':')[0];
        let min = time.split(':')[1];
        let sec = time.split(':')[2];
        return Number(hour * 3600) + Number(min * 60) + Number(sec);
      }
      if (len.length == 2) {
        let min = time.split(':')[0];
        let sec = time.split(':')[1];
        return Number(min * 60) + Number(sec);
      }
      if (len.length == 1) {
        let sec = time.split(':')[0];
        return Number(sec);
      }
    },

    //视频时长格式转换 秒 -> 时分秒
    formatTime(value) {
      let secondTime = parseInt(value); // 秒
      let minuteTime = 0; // 分
      let hourTime = 0; // 小时
      if (secondTime >= 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime >= 60) {
          hourTime = parseInt(minuteTime / 60);
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = (hourTime < 10 ? ("0" + hourTime) : hourTime) + ":" + (minuteTime < 10 ? ("0" + minuteTime) : minuteTime) + ":" + (secondTime < 10 ? ("0" + secondTime) : secondTime);
      return result;
    }


  },

};
</script>

<style scoped>
.content-detail {
  font-size: 15px;
  margin-top: 2px;
  color: rgba(150, 156, 156, 1);
}
</style>
