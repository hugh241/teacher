<template>
  <div class="ques-feedback">
    <p v-if="submitState" class="promptInfo">问卷已提交，感谢反馈！</p>
    <el-form ref="paperForm" :rules="formValidate" :disabled="submitState">
      <el-card class="ques-card" v-for="(question, questionIndex) in questionPaper.paperQuestionsList"
        :key="questionIndex" :bordered="false" dis-hover>
        <p>{{ questionIndex + 1 }}、{{ question.title }}</p>
        <div class="questionContent" v-if="question.titleType === '1' || question.titleType === '3'">
          <el-form-item :prop="question.id">
            <el-radio-group class="ques-options" @change="selectAnswer(question.id, 'radio')" :ref="question.id"
              v-model="formData[question.id]">
              <el-radio :label="option.sort" v-for="(option, optionIndex) in question.optionList" :key="optionIndex"
                :disabled="submitState">
                <span>{{ option.optionName }}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="questionContent" v-if="question.titleType === '2'">
          <el-form-item :prop="question.id">
            <el-checkbox-group v-model="formData[question.id]" class="ques-options"
              @change="selectAnswer(question.id, 'checkbox')" :ref="question.id">
              <el-checkbox :label="option.sort" v-for="(option, optionIndex) in question.optionList" :key="optionIndex"
                :disabled="submitState">{{
                  option.optionName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-card>
    </el-form>
    <div style="text-align: center" v-if="hasQuestionPaper">
      <el-button v-if="!submitState" type="primary" @click="submitData" size="large">提交</el-button>
    </div>

    <div class="defaultContent" v-if="!hasQuestionPaper">
      <img src="../../../assets/images/learningCenter/wushuju.png" alt="" />
      <p>暂无问卷反馈</p>
    </div>
  </div>
</template>

<script>
import {
  getQuestionPaper,
  saveQuestionPaper,
  getPaperUserRecord,
} from "@/api/learningCenter";
export default {
  name: "QuesFeedback",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      questionPaper: {},
      formData: {},
      formValidate: {},
      submitState: false,
      hasQuestionPaper: false,
    };
  },
  mounted() {
    this.loadQuestionPaper();
  },
  methods: {
    loadQuestionPaper() {
      getQuestionPaper(this.courseDetail.id).then((res) => {
        if (res.returnCode == "200" && res.returnData) {
          this.questionPaper = res.returnData;
          if (this.questionPaper.paperQuestionsList.length > 0) {
            this.hasQuestionPaper = true;
          } else {
            this.hasQuestionPaper = false;
          }
          this.loadPaperUserRecord();
          const validateRequire = (rule, value, callback) => {
            const question = this.$refs[rule.field][0];
            const val = question.currentValue;
            if ("string" === typeof val && !val) {
              return callback(new Error("请选择"));
            }
            if ("object" === typeof val && val.length === 0) {
              return callback(new Error("请选择"));
            }
            callback();
          };
          this.questionPaper.paperQuestionsList.forEach((item) => {
            if (item.isOption) {
              if (item.titleType == '2') {
                this.formData[item.id] = [];
                let arr = item.isOption.split("");
                arr.forEach(itm => {
                  this.formData[item.id].push(itm)
                })
              } else {
                this.formData[item.id] = item.isOption
              }
            } else {
              if (item.titleType == '2') {
                this.$set(this.formData, item.id, [])
              } else {
                this.$set(this.formData, item.id, '')
              }
            }

            this.formValidate[item.id] = [
              { validator: validateRequire, trigger: "blur", required: true },
            ];
          });
        } else {
          this.hasQuestionPaper = false;
        }
      });
    },
    selectAnswer(questionId, type, sort) {
      console.log(this.formData[questionId]);
      return
      if (type === 'checkbox') {
        this.$nextTick(() => {
          if (this.formData[questionId] && this.formData[questionId].length != 0) {
            let arr = this.formData[questionId][0].split("");
            let index = arr.findIndex(item => {
              return item == sort
            })
            if (index == -1) {
              arr.push(sort)
            } else {
              arr.splice(index, 1)
            }
            this.formData[questionId] = [];
            let data = ''
            if (arr.length > 0) {
              arr.forEach(item => {
                data += item
              })
              this.formData[questionId].push(data)
            }
          } else {
            this.formData[questionId] = [];
            this.formData[questionId].push(sort)
          }
        })

      }
      if (type === 'radio') {
        const question = this.$refs[questionId][0];
        this.formData[questionId] = question.value;
      }
    },
    submitData() {
      // this.$refs.paperForm.validate((valid) => {
      // if (valid) {
      let content = [];
      for (const [key, value] of Object.entries(this.formData)) {
        if ("string" === typeof value) {
          content.push({ questionId: key, userAnswer: value });
        } else {
          let realValue = value.join("");
          content.push({ questionId: key, userAnswer: realValue });
        }
      }
      let param = {
        perId: this.questionPaper.id,
        content: JSON.stringify(content),
      };
      saveQuestionPaper(param).then((res) => {
        if (res.returnCode == "200") {
          this.$message.success("提交成功!");
          this.loadPaperUserRecord();
        } else {
          this.$message.error(res.returnMessage);
        }
      });
      // }
      // });
    },
    loadPaperUserRecord() {
      getPaperUserRecord(this.questionPaper.id).then((res) => {
        if (res.returnCode == "200" && res.returnData) {
          this.submitState = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ques-feedback {
  width: 982px;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  margin-top: 10px;

  .ques-card {
    border-radius: 1rem;
    background: #fff;
    margin-bottom: 1rem;
    padding: 0.1rem 1rem;

    p {
      font-size: 1.8rem;
      color: #333333;
      margin-bottom: 1rem;
    }

    .questionContent {
      font-size: 1.6rem;
      font-weight: 400;
      color: #666666;

      .ques-options {
        ::ng-deep .ivu-checkbox-group-item {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.6rem !important;

          span {
            font-size: 1.6rem;
          }
        }

        ::ng-deep .ivu-radio-wrapper {
          display: block;
          margin-bottom: 0.5rem;

          span {
            font-size: 1.6rem;
          }
        }
      }
    }
  }
}

.promptInfo {
  text-align: left;
  padding: 6px 0px 6px 31px;
  font-size: 18px;
  color: #ff5050;
  background: #e5f0ff;
  border-radius: 2px;
  margin-bottom: 10px;
  border-radius: 2px;
  font-weight: 500;
}

.pageInfo {
  font-size: 16px;
  font-weight: 500;
  color: #292929;
  text-align: center;

  p {
    cursor: pointer;
  }
}

.defaultContent {
  height: 400px;
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
