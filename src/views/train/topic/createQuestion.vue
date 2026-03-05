 <!-- 创建题目 -->
<template>
  <div class="sys_stepcon">
    <el-container>
      <el-aside width="200px">
        <h4>题目类型</h4>
        <div @click="closeAllTags(1)" class="single_choice">
          <svg-icon icon-class="danxuan" class="qusType"></svg-icon>
          <span>单选题</span>
        </div>
        <div @click="closeAllTags(2)" class="multiple_choice">
          <svg-icon icon-class="duoxuan" class="qusType"></svg-icon>
          <span>多选题</span>
        </div>
        <div @click="closeAllTags(3)" class="estimate_choice">
          <svg-icon icon-class="panduan" class="qusType"></svg-icon>
          <span>判断题</span>
        </div>
      </el-aside>
      <el-container>
        <el-header style="height: 100px">
          <div class="header_top">
            <div class="header_tittle">{{ PaperInfo.perName }}</div>
            <div class="header_bot">
              <div class="header_bot-left">
                <span>培训课程：{{ PaperInfo.courseName }}</span>
              </div>
              <div class="header_bot_right">
                <span>起始日期：{{ PaperInfo.startTime }}至{{ PaperInfo.endTime }}</span>
              </div>
            </div>
          </div>
        </el-header>
        <el-main>
          <div v-for="(item, index) in arrList" :key="index" class="question_main" :class="'question_main' + index">
            <!--           @mouseover="mouseMoveFun(index)"
                @mouseleave="mouseLeaveFun(index)"-->
            <div class="avatar_wrapper">
              <span>{{ index + 1 }}.</span>
              <span class="question_type">【{{ item.name }}】</span>
              <span class="question_tittle">{{ item.title + '（' + item.isTrue + '）' + '（' + item.score + '分）' }}</span>
            </div>
            <div class="answer_wrapper" v-if="item.type != '4'">
              <!-- 单选、多选、判断-->
              <div class="sing_wraper" v-if="item.is_bool">
                <div class="sele">
                  <!-- <span class="letter" v-for="(letter, ids) in item.question" :key="ids">{{ getOptionLabel(ids) }}.</span> -->
                </div>

                <el-checkbox-group v-model="item.radio" class="answer_check_wrapper">
                  <el-checkbox v-for="(item1, index1) in item.question" :key="index1"> {{
                    item1.optionName }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="answer_option" v-if="item.is_bool">
              <div class="answer_option_all">
                <div class="answer_option_top">
                  <div class="answer_option_left"></div>
                  <div class="answer_option_right" @click="analysisQues(index, item)">
                    <span>展开解析</span>
                    <svg-icon icon-class="zhankai" class="comType"></svg-icon>
                  </div>
                </div>
                <div class="answer_option_bottom" v-show="isAnalysis && index == activeQuestion">
                  <div class="title_pop">题目解析：</div>
                  <div>{{ item.titleAnalysis }}</div>
                </div>
              </div>
              <div class="answer_option_ope">
                <div class="answer_option_list" @click="compileFun(item, index)">
                  <svg-icon icon-class="bianji" class="comType"></svg-icon>
                  <span>修改</span>
                </div>
                <div class="answer_option_list" @click="compileTopFun(item, index)">
                  <svg-icon icon-class="totop" class="comType"></svg-icon>
                  <span>上移</span>
                </div>
                <div class="answer_option_list" @click="compileBotFun(item, index)">
                  <svg-icon icon-class="tobottom" class="comType"></svg-icon>
                  <span>下移</span>
                </div>
                <div class="answer_option_list" @click="compileToTopFun(item, index)">
                  <svg-icon icon-class="top" class="comType"></svg-icon>
                  <span>最前</span>
                </div>
                <div class="answer_option_list" @click="compileToBotFun(item, index)">
                  <svg-icon icon-class="bottom" class="comType"></svg-icon>
                  <span>最后</span>
                </div>
                <div class="answer_option_list" @click="deleteFun(item, index)">
                  <svg-icon icon-class="delete" class="comType"></svg-icon>
                  <span style="color: red">删除</span>
                </div>
              </div>
            </div>
            <!--单选题 -->
            <CompileSingle v-if="item.type == 1 && item.bool" @popup_clo="popup_close(item, index)"
              :questionId="item.questionId" :perId="item.paperId" :courseId="item.courseId" ref="compileSingleRef"
              @handlePush="handlePush($event, index)" @handleSave="handleSave"></CompileSingle>
            <!-- 多选-->
            <CompileMul v-if="item.type == 2 && item.bool" @popup_clo="popup_close(item, index)"
              :questionId="item.questionId" :perId="item.paperId" :courseId="item.courseId" ref="compileMulRef"
              @handlePush="handlePush($event, index)" @handleSave="handleSave"></CompileMul>
            <!-- 判断 -->
            <CompileJudge v-if="item.type == 3 && item.bool" @popup_clo="popup_close(item, index)"
              :questionId="item.questionId" :perId="item.paperId" :courseId="item.courseId" ref="compileJudgeRef"
              @handlePush="handlePush($event, index)" @handleSave="handleSave"></CompileJudge>
          </div>
          <div style="margin-top: 30px">
            <el-button type="primary" @click="back">返回</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CompileSingle from './components/CompileSingle.vue'
import CompileMul from './components/CompileMul.vue'
import CompileJudge from './components/CompileJudge.vue'
import { addPaperRel_v2, getPaperInfo, deleteQuestionV2, getCourseDetails } from '@/api/learningCenter'
export default {
  props: ['courseId', 'paperId'],
  components: { CompileSingle, CompileMul, CompileJudge },
  data() {
    return {
      courseInfo: {},
      PaperInfo: {},
      is_answer_option: false,
      activeQuestion: -1,
      arrList: [],
      paramList: [],
      ruleForm: {
        taskName: '',
        taskDesc: '',
        startTime: '',
        endTime: '',
        courseName: '',
        allotName: [],
      },
      // 解析题目的显示隐藏
      isAnalysis: false,
      pop: {
        showCompileSingle: false,
        showCompileMul: false,
        showCompileJudge: false,
        showCompileRes: false,
      },
      questList: [],
      isEdit: false,
    }
  },
  activated() {
    this.questList = [];
    this.$nextTick(() => {

      if (this.paperId) {
        this.getTopicList();
      }
      if (this.courseId) {
        getCourseDetails(this.courseId).then(res => {
          if (res.returnCode == '200') {
            this.courseInfo = res.returnData;
          }
        })
      }
    })
  },
  watch: {
    arrList: {
      handler(val) {

      },
      deep: true
    }
  },
  created() {
    this.questList = [];
    this.getTopicList()
  },
  computed: {
    getOptionLabel() {
      return function (index) {

        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; // 标识数组，可以根据需要扩展
        return labels[index] || '';
      };
    },
  },

  methods: {
    /** 获取已创建题目列表*/
    getTopicList() {
      getPaperInfo({ paperId: this.paperId }).then(response => {
        this.PaperInfo = response.returnData;
        const topicList = response.returnData.paperQuestionsList;
        this.isEdit = topicList.length > 0 ? true : false;
        this.arrList = [];
        for (let i = 0; i < topicList.length; i++) {
          let topic = topicList[i];
          const topicOne = {
            is_bool: true,
            title: '',
            isTrue: '',
            radio: '',
            bool: false,
            type: topic.titleType,
            score: topic.score,
            name: topic.titleType == "1" ? '单选题' : topic.titleType == "2" ? '多选题' : topic.titleType == "3" ? '判断题' : '解答题',
            titleAnalysis: topic.titleAnalysis,
            question: [],
            index: i,
            questionId: topic.id,
            paperId: this.paperId,
            courseId: this.PaperInfo.courseId,
            level: this.PaperInfo.level,
          }
          let isTrue = '';
          let radioArr = [];
          if (topic.optionList != undefined && topic.optionList.length > 0) {
            for (let j = 0; j < topic.optionList.length; j++) {
              if (topic.titleType === "2") {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue += topic.optionList[j].sort + ','
                  radioArr.push(j + 1 + '')
                }
              } else if (topic.titleType === "3") {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue = topic.optionList[j].optionName
                  radioArr.push(j + 1 + '')
                }
              } else {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue = topic.optionList[j].sort
                  radioArr.push(j + 1 + '')
                }
              }
              topicOne.question[j] = {
                sort: topic.optionList[j].sort,
                optionName: topic.optionList[j].optionName,
              }
            }
          }
          isTrue.endsWith(",") ? isTrue = isTrue.substring(0, isTrue.length - 1) : isTrue;
          // topicOne.title =  topic.title + '（ '+ isTrue +  '）' + '（' + topic.score + '分）';
          topicOne.title = topic.title;
          topicOne.isTrue = isTrue;
          topicOne.radio = radioArr;
          this.arrList.push(topicOne);
        }
      })
    },
    handleSave() {
      getPaperInfo({ paperId: this.paperId }).then(response => {
        this.PaperInfo = response.returnData;
        const topicList = response.returnData.paperQuestionsList;
        this.isEdit = topicList.length > 0 ? true : false;
        this.arrList = [];
        for (let i = 0; i < topicList.length; i++) {
          let topic = topicList[i];
          const topicOne = {
            is_bool: true,
            title: '',
            isTrue: '',
            radio: '',
            bool: false,
            type: topic.titleType,
            score: topic.score,
            name: topic.titleType == "1" ? '单选题' : topic.titleType == "2" ? '多选题' : topic.titleType == "3" ? '判断题' : '解答题',
            titleAnalysis: topic.titleAnalysis,
            question: [],
            index: i,
            questionId: topic.id,
            paperId: this.paperId,
            courseId: this.PaperInfo.courseId,
            level: this.PaperInfo.level,
          }
          let isTrue = '';
          let radioArr = [];
          if (topic.optionList != undefined && topic.optionList.length > 0) {
            for (let j = 0; j < topic.optionList.length; j++) {
              if (topic.titleType === "2") {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue += topic.optionList[j].sort + ','
                  radioArr.push(j + 1 + '')
                }
              } else if (topic.titleType === "3") {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue = topic.optionList[j].optionName
                  radioArr.push(j + 1 + '')
                }
              } else {
                if (topic.optionList[j].isTrue == '0') {
                  isTrue = topic.optionList[j].sort
                  radioArr.push(j + 1 + '')
                }
              }
              topicOne.question[j] = {
                sort: topic.optionList[j].sort,
                optionName: topic.optionList[j].optionName,
              }
            }
          }
          isTrue.endsWith(",") ? isTrue = isTrue.substring(0, isTrue.length - 1) : isTrue;
          // topicOne.title =  topic.title + '（ '+ isTrue +  '）' + '（' + topic.score + '分）';
          topicOne.title = topic.title;
          topicOne.isTrue = isTrue;
          topicOne.radio = radioArr;
          this.arrList.push(topicOne);
        }
      })
    },

    // 鼠标离开题目影藏编辑按钮
    mouseLeaveFun(index) {
      this.arrList[index].is_bool = false
    },
    // 鼠标滑过题目展示编辑按钮
    mouseMoveFun(index) {
      this.arrList[index].is_bool = true
    },
    //关闭弹窗
    popup_close(item, index) {
      this.getTopicList()
      setTimeout(() => {
        this.arrList[index].bool = false
      }, 1000)
    },
    compileTopFun(item, index) {
      let data = item
      this.arrList.splice(index, 1)
      this.arrList.splice(index - 1, 0, data)
    },
    compileBotFun(item, index) {
      let data = item
      this.arrList.splice(index, 1)
      this.arrList.splice(index + 1, 0, data)
    },
    // 删除试题
    deleteFun(item, index) {
      let row = item
      this.$confirm('确定要删除该试题吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.questionId) {
          deleteQuestionV2(row.questionId).then(res => {
            if (res.returnCode == '200') {
              this.$message.success('删除题目成功')
              this.$delete(this.arrList, index)
            } else {
              this.$message.error(res.returnMessage)
            }
            this.getTopicList();
          })
        } else {
          this.$delete(this.arrList, index)
        }
      }).catch(() => {
        this.$message.info('已取消!')
      })
    },

    // 最前
    compileToTopFun(item, index) {
      let data = item
      this.arrList.splice(index, 1)
      this.arrList.unshift(data)
    },
    compileToBotFun(item, index) {
      let data = item
      this.arrList.splice(index, 1)
      this.arrList.push(data)
    },
    // 编辑内容的展示
    compileFun(item, index) {
      this.activeQuestion = index;
      this.arrList[index].bool = true;
    },
    checkCom(type) {
      let keys = Object.keys(this.pop)
      for (let i = 0; i < keys.length; i++) {
        if (type == i + 1) {
          this.$set(this.pop, keys[i], true)
        } else {
          this.$set(this.pop, keys[i], false)
        }
      }
    },
    analysisQues(index, item) {
      this.activeQuestion = index
      this.isAnalysis = !this.isAnalysis
    },

    handlePush(params, index) {
      let str = "";
      params.question.filter((item) => {
        if (params.titleType == "2") {
          if (item.isTrue) {
            str += item.sort;
          }
        } else if (params.titleType == "1") {
          if (params.rightAnswer === item.sort) {
            str = item.sort;
          }
        } else if (params.titleType == "3") {
          if (params.isTrue === item.sort) {
            str = item.sort;
          }
        }
      })
      this.arrList[index].isTrue = str;
      this.arrList[index].questionId = params.questionId;
      this.arrList[index].question = params.question;
      this.arrList[index].title = params.title;
      this.arrList[index].score = params.score;
      this.arrList[index].titleAnalysis = params.titleAnalysis;
    },
    handlePushV1(params, index) {
      if (params.title) {
        if (this.questList.length > 0) {
          this.questList.filter((item) => {
            if (item.title !== params.title) {
              this.questList.push(params);
            }
          })
        } else {
          if (this.questList.indexOf(params) == -1) {
            this.questList.push(params);
          }
        }
      }
    },
    back() {
      this.$emit('backList');
    },
    submit() {
      if (this.arrList.length > 0) {
        let questionLength = 0;
        this.arrList.filter(item => {
          if (!item.questionId) {
            return this.$message.warning({
              message: "试题 " + item.title + "没保存，请点击确定保存后再提交！",
              duration: 5000
            })
          } else {
            ++questionLength;
          }
        })
        if (this.arrList.length === questionLength) {
          let param = {
            addQuestionIds: JSON.stringify(this.arrList),
            paperId: this.paperId,
          }
          addPaperRel_v2(param).then(res => {
            if (res.returnCode == '200') {
              if (this.isEdit) {
                this.$message.success('试题编辑成功！');
              } else {
                this.$message.success('试题添加成功！');
              }
              this.$emit('backList');
            }
          })
        }
        // else{
        //   return this.$message.warning({
        //     message: "试卷中有试题没保存，请点击确定保存后再提交！",
        //     duration: 500
        //   })
        // }
      } else {
        this.$confirm('还没有添加试题，确定要返回试卷列表吗？',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            return this.$emit('backList');
          }).catch(() => {
            this.$message.info('已取消!');
          });
      }
    },
    closeAllTags(type) {
      let optionInfoList = [];
      let isTrue = "";
      let name = "";
      if (type === 1) {
        name = '单选题';
        isTrue = "A";
        optionInfoList = [
          {
            optionName: '',
            type: '0',
            com_top: '上移',
            com_bot: '下移',
            sort: 'A',
            optionId: undefined,
            isTrue: '',
          },
          {
            optionName: '',
            type: '0',
            com_top: '上移',
            com_bot: '下移',
            sort: 'B',
            optionId: undefined,
            isTrue: '',
          },
        ]
      } else if (type === 2) {
        name = '多选题';
        isTrue = "A,B";
        optionInfoList = [{
          questionId: this.questionId,
          title: '',
          score: '',
          isTrue: 'A',
          titleAnalysis: '',
          question: [
            {
              optionId: undefined,
              optionName: '',
              type: '1',
              com_top: '上移',
              com_bot: '下移',
              sort: 'A',
              isTrue: true,
            },
            {
              optionId: undefined,
              optionName: '',
              type: '1',
              com_top: '上移',
              com_bot: '下移',
              sort: 'B',
              isTrue: true,
            },
          ],
        }]
      } else if (type === 3) {
        name = '判断题';
        isTrue = "A";
        optionInfoList = [{
          questionId: this.questionId,
          title: '',
          score: '',
          isTrue: 'A',
          titleAnalysis: '',
          question: [
            {
              optionId: undefined,
              optionName: '对',
              type: '2',
              isTrue: '0',
              sort: 'A',
            },
            {
              optionId: undefined,
              optionName: '错',
              type: '2',
              isTrue: '1',
              sort: 'B',
            },
          ],
        }]
      }

      const topicOne = {
        is_bool: true,
        questionId: undefined,
        paperId: this.paperId,
        courseId: this.courseInfo.id,
        level: this.PaperInfo.level,
        courseName: this.courseInfo.courseName,
        radio: '',
        bool: true,
        type: type,
        name: name,
        title: name,
        isTrue: isTrue,
        score: '0',
        titleAnalysis: '',
        question: optionInfoList,
      }
      this.arrList.push(topicOne);
    },
  },
}
</script>

<style scoped lang="scss">
//背景颜色
$bg-color: #fff;
//字体颜色
$ft-color: #fff;
//字体大小
$ft-size: 16px;

.sys_stepcon {
  .el-container {
    .el-header {
      background-color: $bg-color;
      color: #333;
      width: 85%;
      margin: 0 auto;

      .header_top {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;

        .header_tittle {
          font-size: $ft-size;
          text-align: center;

          margin-top: 15px;
        }

        .header_bot {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #a8a8a8;

          &-left span {
            margin-right: 30px;
          }
        }
      }
    }
  }
}

.el-aside {
  background-color: $bg-color;
  color: #333;
  text-align: center;
  height: 100vh;
  margin-right: 10px;
  text-align: left;
  font-size: $ft-size;
  font-weight: 600;
  color: $ft-color;

  .qusType {
    color: $ft-color;
    font-size: $ft-size;
  }

  h4 {
    color: #000;
    font-size: 20px;
  }

  .single_choice {
    background: -webkit-linear-gradient(left, #7da9ff, #9fc3ff);
  }

  .multiple_choice {
    background: -webkit-linear-gradient(left, #5cc5ff, #98dcff);
  }

  .estimate_choice {
    background: -webkit-linear-gradient(left, #3dc988, #7fed96);
  }

  .answer-choice {
    background: -webkit-linear-gradient(left, #f3ab29, #ffca71);
  }

  .single_choice,
  .multiple_choice,
  .estimate_choice,
  .answer-choice {
    cursor: pointer;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-top: 10px;
    border-radius: 2px 2px 28px 2px;

    span {
      font-size: $ft-size;
      font-weight: normal;
      margin-left: 10px;
    }

    .qusType {
      font-size: 18px;
    }
  }
}

.el-main {
  background-color: $bg-color;
  color: #333;
  text-align: center;
  height: 90vh;

  .question_main {
    width: 85%;
    margin: 0 auto;
    padding: 15px 0 15px 0;
    border: 1px solid #e6e6e6;
    border-left: 0;
    border-right: 0;

    .avatar_wrapper {
      font-size: $ft-size;
      font-weight: 600;
      text-align: left;

      .question_type {
        color: #da4d4d;
      }

      .question_tittle {
        font-size: $ft-size;
      }
    }

    .answer_wrapper {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;

      .sing_wraper {
        display: flex;
        justify-content: flex-start;
        margin-left: 30px;

        .sele {
          display: flex;
          flex-flow: wrap;
          width: 20px;
          margin-top: 18px;

          .letter {
            width: 80%;
            height: 22px;
            font-size: 14px;
            margin-bottom: 5px;
            padding-right: 10px;
          }
        }
      }

      .answer_check_wrapper {
        text-align: left;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        margin-top: 10px;


        span {
          margin-top: 20px;
          margin-left: 20px;
          font-size: 14px;
        }

        .el-checkbox {
          margin-top: 8px;

          .el-checkbox__label {
            float: left;
            padding: 0 10px 0 0;
          }
        }
      }
    }

    .answer_option {
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .answer_option_all {
        padding: 10px;
        width: 60%;
        background: #f1f5fc;
        font-size: 14px;

        .title_pop {
          color: #000;
        }

        .answer_option_top {
          display: flex;
          justify-content: space-between;
        }

        .answer_option_bottom {
          display: flex;
          justify-content: flex-start;
          margin-top: 20px;
        }

        .answer_option_left {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .answer_wright {
            margin-right: 100px;

            .question_tittle_check {
              color: #3e7cf6;
            }
          }

          .answer_degree {
            .question_type {
              color: #da4d4d;
            }
          }
        }

        .answer_option_right {
          color: #3e7cf6;

          &:hover {
            cursor: pointer;
          }

          span {
            margin-right: 10px;
          }
        }
      }

      .answer_option_ope {
        box-sizing: border-box;
        background: $bg-color;
        width: 40%;
        display: flex;
        justify-content: space-evenly;
        margin-top: 10px;

        .answer_option_list {
          color: #3e7cf6;
          font-size: 14px;

          &:hover {
            cursor: pointer;
          }

          i {
            margin-right: 3px;
          }
        }
      }
    }
  }
}

.el-container.is-vertical {
  background: #fff;
}
</style>
