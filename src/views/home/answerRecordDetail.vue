<template>
  <div class="container">
    <BreadCrumb :type="1" />
    <div class="union_company">
      <div>
        <el-card>
          <p slot="header" style="font-size: 24px;height: 36px;line-height: 36px;text-align: center">{{ paperInfo.perName
          }}
          </p>
          <el-form :model="paperInfo" label-width="100px" ref="addForm" id="fontsize">
            <el-row>
              <el-col :span="6">
                <el-form-item label="试卷类型：">
                  <div class="content-detail">
                    <span v-if="paperInfo.type == '1'">练习</span>
                    <span v-if="paperInfo.type == '2'">考试</span>
                    <span v-if="paperInfo.type == '4'">问卷</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属课程：">
                  <div class="content-detail">{{ paperInfo.courseName }}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="试卷总分：">
                  <div class="content-detail">{{ oneChooseScore + moreChooseScore + judgeScore }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="及格分数：">
                  <div class="content-detail">{{ parseInt((oneChooseScore + moreChooseScore + judgeScore) * 0.6) }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="考试得分：">
                  <div class="content-detail">{{ paperTotalScore }} </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <div class="test_questions">
        <!--单选题-->
        <div v-if="oneChooseQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第一部分：单选题</span>
            <span>（{{ '共' + oneChooseQuestionList.length + '题，总分' + oneChooseScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <el-card v-for="(item, index) in oneChooseQuestionList" :key="index">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div v-for="(optionItem, idx) in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'" :key="idx">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <el-divider />
              <div>
                <el-row>
                  <el-col :span="8">
                    <span>答题结果:</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </el-col>
                  <el-col :span="8">
                    <span>正确答案:</span>
                    <span style="color: #00c261;font-weight: bold" v-for="(answerItem, id1) in item.trueAnswer"
                      :key="id1">{{ answerItem.sort
                      }}</span>
                  </el-col>
                  <el-col :span="8">
                    <span>我的答案:</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                      item.paperUserDetail.userAnswer }}</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                      item.paperUserDetail.userAnswer }}</span>
                  </el-col>
                </el-row>
                <el-row class="expand-row">
                  <el-col :span="2">
                    <span>题目解析:</span>
                  </el-col>
                  <el-col :span="22">
                    <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                      item.titleAnalysis }}</span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>

        <!--多选题-->
        <div v-if="moreChooseQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第二部分：多选题</span>
            <span>（{{ '共' + moreChooseQuestionList.length + '题，总分' + moreChooseScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <el-card v-for="(item, index) in moreChooseQuestionList" :key="index">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div class="question-type" v-for="(optionItem, id2) in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'" :key="id2">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <el-divider />
              <div>
                <el-row class="expand-row">
                  <el-col :span="8">
                    <span>答题结果:</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </el-col>
                  <el-col :span="8">
                    <span>正确答案:</span>
                    <span style="color: #00c261;font-weight: bold" v-for="(answerItem, id3) in item.trueAnswer"
                      :key='id3'>{{ answerItem.sort
                      }}</span>
                  </el-col>
                  <el-col :span="8">
                    <span>我的答案:</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                      item.paperUserDetail.userAnswer }}</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                      item.paperUserDetail.userAnswer }}</span>
                  </el-col>
                </el-row>
                <el-row class="expand-row">
                  <el-col :span="2">
                    <span>题目解析:</span>
                  </el-col>
                  <el-col :span="22">
                    <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                      item.titleAnalysis }}</span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>

        <!--判断题-->
        <div v-if="judgeQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第三部分：判断题</span>
            <span>（{{ '共' + judgeQuestionList.length + '题，总分' + judgeScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <el-card v-for="(item, index) in judgeQuestionList" :key="index">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div class="question-type" v-for="(optionItem, id4) in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'" :key="id4">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <el-divider />
              <div>
                <el-row class="expand-row">
                  <el-col :span="8">
                    <span>答题结果:</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </el-col>
                  <el-col :span="8">
                    <span>正确答案:</span>
                    <span style="color: #00c261;font-weight: bold" v-for="(answerItem, id5) in item.trueAnswer"
                      :key="id5">{{ answerItem.sort
                      }}</span>
                  </el-col>
                  <el-col :span="8">
                    <span>我的答案:</span>
                    <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                      item.paperUserDetail.userAnswer }}</span>
                    <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                      item.paperUserDetail.userAnswer }}</span>
                  </el-col>
                </el-row>
                <el-row class="expand-row">
                  <el-col :span="2">
                    <span>题目解析:</span>
                  </el-col>
                  <el-col :span="22">
                    <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                      item.titleAnalysis }}</span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>

        <el-row
          v-if="oneChooseQuestionList.length == 0 && moreChooseQuestionList.length == 0 && judgeQuestionList.length == 0">
          <div class="tabContent nodata">
            <!-- <img src="../../../assets/images/learningCenter/wushuju.png" alt /> -->
            <el-col class="nodatacon">
              <h3>暂无数据</h3>
            </el-col>
          </div>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import { getAnswerRecordDetail2 } from '@/api/learningCenter';
export default {
  components: {
    BreadCrumb : () => import('@/components/Breadcrumb/index.vue'),
  },
  data() {
    return {
      paperId: '',
      userId: '',
      recordId: '',
      paperInfo: {},
      userRecord: {},
      paperTotalScore: 0,
      oneChooseQuestionList: [],
      oneChooseScore: 0,
      moreChooseQuestionList: [],
      moreChooseScore: 0,
      judgeQuestionList: [],
      judgeScore: 0,
      examId: ''

    };
  },
  created() {
    this.examId = this.$route.query.examId
  },
  mounted() {
    this.getPaperInfo();

  },
  methods: {

    backPaperList() {
      this.$emit('backList')
    },

    //选题
    chooseQuestion() {
      let params = {
        paperId: this.paperId,
      };
      this.$router.push({
        name: "chooseQuestion",
        params: params,
      });
    },

    //获取试卷详情
    getPaperInfo() {
      let param = {
        id: this.examId
      }
      getAnswerRecordDetail2(param).then(res => {
        if (res.returnCode == "200") {
          this.paperInfo = res.returnData.paperPer;
          this.userRecord = res.returnData.userRecord;
          this.handlerQuestionData(res.returnData.paperPer.paperQuestionsList);
        }
      });
    },


    //处理试题数据
    handlerQuestionData(data) {
      let oneChooseQuestionList = [];
      let moreChooseQuestionList = [];
      let judgeQuestionList = [];
      let oneChooseScore = 0;
      let moreChooseScore = 0;
      let judgeScore = 0;
      data.forEach(item => {
        let trueOptionArray = item.optionList.filter(optItem => {
          return optItem.isTrue == '0';
        });
        let score = item.paperUserDetail.isTrue == "0" ? item.score : 0;
        this.paperTotalScore = parseInt(this.paperTotalScore) + parseInt(score);
        item.trueAnswer = trueOptionArray;
        if (item.titleType == '1') {
          oneChooseScore += parseInt(item.score);
          oneChooseQuestionList.push(item);
        } else if (item.titleType == '2') {
          moreChooseScore += parseInt(item.score);
          moreChooseQuestionList.push(item);
        } else if (item.titleType == '3') {
          judgeScore += parseInt(item.score);
          judgeQuestionList.push(item);
        }
      })
      this.oneChooseQuestionList = oneChooseQuestionList;
      this.moreChooseQuestionList = moreChooseQuestionList;
      this.judgeQuestionList = judgeQuestionList;
      this.oneChooseScore = oneChooseScore;
      this.moreChooseScore = moreChooseScore;
      this.judgeScore = judgeScore;
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}

.container {
  margin-top: 20px;

}

.union_company {

  margin: 0 auto;
}

.record_detail {
  font-size: 16px;
  margin-bottom: 10px;
  justify-content: flex-end;
}

.test_questions {
  padding: 0 0 30px 0;
}

.ivu-breadcrumb {
  color: #999;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}

#fontsize .ivu-el-form-item-label {
  font-size: 16px;
}

#fontsize .ivu-el-form-item {
  margin-bottom: 0px !important;
}

#fontsize .ivu-el-form-item-content {
  margin-top: 2px;
}

.content-detail {
  font-size: 16px;
  color: rgba(150, 156, 156, 1);
}

.content-head {
  background-color: rgba(242, 246, 255, 1);
  height: 50px;
  border: 1px solid rgba(219, 219, 219, 1);
  margin-top: 30px;
}

.content-txt {
  color: rgba(51, 51, 51, 1);
  font-size: 18px;
  text-align: left;
  white-space: nowrap;
  line-height: 25px;
  display: inline-block;
  margin: 12px 5px 0 15px;
}

.question-title {
  font-size: 16px;
}

.question-box {
  margin-left: 22px;
}

.question-type {
  height: 22px;
  overflow-wrap: break-word;
  color: rgba(102, 102, 102, 1);
  font-size: 16px;
  text-align: left;
  white-space: nowrap;
  line-height: 22px;
  display: block;
  margin: 15px 0;
}

.type-sort {
  margin-right: 0px;
}

.question-type-true {
  height: 22px;
  overflow-wrap: break-word;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  line-height: 22px;
  display: block;
  margin: 15px 0;
  color: #00c261;
}

.expand-el-row {
  margin-top: 10px !important;
}

.nodata {
  height: 620px;
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
