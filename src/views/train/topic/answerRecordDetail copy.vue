<template>
  <div class="container">
    <div class="union_company">
      <div class="record_detail">

        <div style="position: absolute;top: 77px;right: 240px;">
          <span style="display: flex;">
            <el-button @click="backPaperList" type="info" icon="el-icon-back" style="display: flex;
              align-items: center;
              margin-left: 5px;
              border-top-width: 0px;
              margin-bottom: 10px;">返回</el-button>
          </span>
        </div>
      </div>

      <div>
        <Card>
          <p slot="title" style="font-size: 24px;height: 36px;line-height: 36px;text-align: center">{{ paperInfo.perName
          }}
          </p>
          <Form :model="paperInfo" :label-width="100" ref="addForm" id="fontsize">
            <Row type="flex" justify="start">
              <i-col span="6">
                <FormItem label="测试题类型：">
                  <div class="content-detail">
                    <span v-if="paperInfo.type == '1'">练习</span>
                    <span v-if="paperInfo.type == '2'">考试</span>
                    <span v-if="paperInfo.type == '4'">问卷</span>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="6" pull="2">
                <FormItem label="测试题层次：">
                  <div class="content-detail">
                    <span v-if="paperInfo.level == '1'">课程</span>
                    <span v-if="paperInfo.level == '2'">章节</span>
                    <span v-if="paperInfo.level == '4'">问卷</span>
                  </div>
                </FormItem>
              </i-col>
              <i-col span="6" pull="4">
                <FormItem label="所属课程：">
                  <div class="content-detail">{{ paperInfo.courseName }}</div>
                </FormItem>
              </i-col>
              <i-col span="6" pull="5">
                <FormItem label="所属章节：">
                  <div class="content-detail">{{ paperInfo.chapterName == null ? '--' : paperInfo.chapterName }}</div>
                </FormItem>
              </i-col>
              <i-col span="8">
                <FormItem label="试卷总分：">
                  <div class="content-detail">{{ oneChooseScore + moreChooseScore + judgeScore }}</div>
                </FormItem>
              </i-col>
              <i-col span="8" pull="4">
                <FormItem label="及格分数：">
                  <div class="content-detail">{{ parseInt((oneChooseScore + moreChooseScore + judgeScore) * 0.6) }}</div>
                </FormItem>
              </i-col>
              <i-col span="6" pull="8">
                <FormItem label="考试得分：">
                  <div class="content-detail">{{ paperTotalScore }} </div>
                </FormItem>
              </i-col>
            </Row>
          </Form>
        </Card>
      </div>
      <div class="test_questions">
        <!--单选题-->
        <div v-if="oneChooseQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第一部分：单选题</span>
            <span>（{{ '共' + oneChooseQuestionList.length + '题，总分' + oneChooseScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <Card v-for="(item, index) in oneChooseQuestionList">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div v-for="optionItem in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <Divider />
              <div>
                <Row>
                  <Col span="8">
                  <span>答题结果:</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </Col>
                  <Col span="8" pull="5">
                  <span>正确答案:</span>
                  <span style="color: #00c261;font-weight: bold" v-for="answerItem in item.trueAnswer">{{ answerItem.sort
                  }}</span>
                  </Col>
                  <Col span="8" pull="10">
                  <span>我的答案:</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                    item.paperUserDetail.userAnswer }}</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                    item.paperUserDetail.userAnswer }}</span>
                  </Col>
                </Row>
                <Row class="expand-row">
                  <Col span="2">
                  <span>题目解析:</span>
                  </Col>
                  <Col span="22">
                  <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                    item.titleAnalysis }}</span>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </div>

        <!--多选题-->
        <div v-if="moreChooseQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第二部分：多选题</span>
            <span>（{{ '共' + moreChooseQuestionList.length + '题，总分' + moreChooseScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <Card v-for="(item, index) in moreChooseQuestionList">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div class="question-type" v-for="optionItem in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <Divider />
              <div>
                <Row class="expand-row">
                  <Col span="8">
                  <span>答题结果:</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </Col>
                  <Col span="8" pull="5">
                  <span>正确答案:</span>
                  <span style="color: #00c261;font-weight: bold" v-for="answerItem in item.trueAnswer">{{ answerItem.sort
                  }}</span>
                  </Col>
                  <Col span="8" pull="10">
                  <span>我的答案:</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                    item.paperUserDetail.userAnswer }}</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                    item.paperUserDetail.userAnswer }}</span>
                  </Col>
                </Row>
                <Row class="expand-row">
                  <Col span="2">
                  <span>题目解析:</span>
                  </Col>
                  <Col span="22">
                  <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                    item.titleAnalysis }}</span>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </div>

        <!--判断题-->
        <div v-if="judgeQuestionList.length > 0">
          <div class="content-head">
            <span class="content-txt">第三部分：判断题</span>
            <span>（{{ '共' + judgeQuestionList.length + '题，总分' + judgeScore + '分' }}）</span>
          </div>
          <div class="question_info">
            <Card v-for="(item, index) in judgeQuestionList">
              <p class="question-title">
                {{ (index + 1) + '、' + item.title }}
                <span style="margin-right: 10px">（{{ item.score + '分' }}）</span>
              </p>
              <div class="question-box">
                <div class="question-type" v-for="optionItem in item.optionList"
                  :class="optionItem.isTrue == 0 ? 'question-type-true' : 'question-type'">
                  <span class="type-sort">{{ optionItem.sort + '、' }}</span>
                  <span>{{ optionItem.optionName }}</span>
                </div>
              </div>
              <Divider />
              <div>
                <Row class="expand-row">
                  <Col span="8">
                  <span>答题结果:</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">正确</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">错误</span>
                  </Col>
                  <Col span="8" pull="5">
                  <span>正确答案:</span>
                  <span style="color: #00c261;font-weight: bold" v-for="answerItem in item.trueAnswer">{{ answerItem.sort
                  }}</span>
                  </Col>
                  <Col span="8" pull="10">
                  <span>我的答案:</span>
                  <span style="color: #EA3F3F;font-weight: bold" v-if="item.paperUserDetail.isTrue == 1">{{
                    item.paperUserDetail.userAnswer }}</span>
                  <span style="color: #00c261;font-weight: bold" v-if="item.paperUserDetail.isTrue == 0">{{
                    item.paperUserDetail.userAnswer }}</span>
                  </Col>
                </Row>
                <Row class="expand-row">
                  <Col span="2">
                  <span>题目解析:</span>
                  </Col>
                  <Col span="22">
                  <span style="color: rgba(150, 156, 156, 1);">{{ item.titleAnalysis == "" ? '--' :
                    item.titleAnalysis }}</span>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </div>

        <Row
          v-if="oneChooseQuestionList.length == 0 && moreChooseQuestionList.length == 0 && judgeQuestionList.length == 0">
          <div class="tabContent nodata">
            <img src="../../../assets/images/learningCenter/wushuju.png" alt />
            <i-col class="nodatacon">
              <h3>暂无数据</h3>
            </i-col>
          </div>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { getAnswerRecordDetail } from '@/api/learningCenter';
export default {
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

    };
  },
  components: {

  },
  methods: {

    backPaperList() {
      this.$router.push({
        name: "answerRecordManage"
      });
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
        paperId: this.paperId,
        userId: this.userId,
        recordId: this.recordId
      }
      getAnswerRecordDetail(param).then(res => {
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
  mounted() {
    this.paperId = this.$route.params.paperId || "";
    this.userId = this.$route.params.userId || "";
    this.recordId = this.$route.params.recordId || "";
    this.getPaperInfo();

  },
};
</script>

<style scoped>
.container {
  margin-top: 70px;
  min-height: 900px;
  overflow: auto;
  background-color: #fff;
}

.union_company {
  width: 75%;
  margin: 0 auto;
}

.record_detail {
  font-size: 16px;
  margin-bottom: 5px;

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

#fontsize .ivu-form-item-label {
  font-size: 16px;
}

#fontsize .ivu-form-item {
  margin-bottom: 10px;
}

#fontsize .ivu-form-item-content {
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

.expand-row {
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
