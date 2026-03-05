<template>
  <div class="compile">
    <div class="compile_content">
      <div class="compile_content_title">单选题</div>
      <el-form ref="form" :rules="rules" :model="form" class="el_from_items" label-width="80px">
        <el-row>
          <el-col :span="24">
            <div>
              <el-form-item label="内容：" prop="title">
                <el-input type="textarea" v-model="form.title" placeholder="请输入题目内容"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!--        <el-row :gutter="50">-->
        <!--          <el-col :span="24">-->
        <!--            <div>-->
        <!--              <el-form-item label="分值：" prop="score">-->
        <!--                <el-input v-model="form.score" placeholder="请输入分值" :maxlength="2" @change="inputChange"></el-input>-->
        <!--              </el-form-item>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-col :span="2">
          <div>
            <el-form-item label="选项：" prop="question"></el-form-item>
          </div>
        </el-col>
        <div style="border: 1px solid #e6e6e6; width: 90%; margin-left: 10%; margin-bottom: 10px">
          <el-row class="headTxttop">
            <el-col :span="24">
              <div class="head_txt_top_cot">
                <div class="com_left">
                  <div class="compile_con">选项内容</div>
                </div>
                <div class="com_right">
                  <div class="compile_option_top">正确答案</div>
                  <div class="compile_option_com">上下移</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="headTxt" v-for="(item, index) in form.question" :key="index">
            <el-col :span="1">
              <div style="line-height: 30px">
                <span>{{ item.sort }}:</span>
              </div>
            </el-col>
            <el-col :span="14">
              <div>
                <el-input v-model="item.optionName" placeholder="请输入选项内容"></el-input>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="compile_option_one">
                <i class="el-icon-circle-plus" @click="add_num(item, index)"></i>
                <i class="el-icon-remove" style="margin-left: 10px" @click="delete_num(item, index)"></i>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="compile_option_two">
                <el-radio v-model="form.rightAnswer" :label="item.sort" @input="handleIsTrue">{{ '' }}</el-radio>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="compile_option_two" @click="top_num(item, index)">
                <i class="el-icon-top"></i>
                <span class>上移</span>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="compile_option_th" @click="bot_num(item, index)">
                <i class="el-icon-bottom"></i>
                <span class>下移</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div>-->
        <!--              <el-form-item label="解析：" prop="titleAnalysis" label-width="80px">-->
        <!--                <el-input type="textarea" v-model="form.titleAnalysis" placeholder="请输入题目解析"></el-input>-->
        <!--              </el-form-item>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row class="sub-row">
          <!--          <el-col :span="24">-->
          <!--            <el-form-item>-->
          <!--              <el-button @click="handleReset()">重置</el-button>-->
          <!--              <el-button type="primary" @click="popup_clo()">保存</el-button>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addVerifyQuestion, getPaperQuestionsById } from '@/api/learningCenter'
export default {
  props: ['subsectionId', 'chapterId', 'courseId', 'questionId'],
  data() {
    return {
      form: {
        isTrue: '0',
        radio: '0',
        questionId: this.questionId,
        title: '',
        score: '',
        titleType: '1',
        level: '5',
        rightAnswer: 'A',
        titleAnalysis: '',
        question: [
          {
            optionName: '',
            type: '1',
            com_top: '上移',
            com_bot: '下移',
            sort: 'A',
            optionId: '',
            isTrue: '',
          },
          {
            optionName: '',
            type: '1',
            com_top: '上移',
            com_bot: '下移',
            sort: 'B',
            optionId: '',
            isTrue: '',
          },
        ]
      },
      rules: {
        title: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
        score: [{ required: false, message: '请输入题目分值', trigger: 'blur' },
        { pattern: /^[0-9]*$/, message: '题目分值需为正整数', trigger: 'blur' }],
        question: [{ required: true, message: '请输入题目选项', trigger: 'change' }],
        titleAnalysis: [{ required: false, message: '请输入题目解析', trigger: 'change' }],
      },
      id: 'abc',
    }
  },
  watch: {
    questionId(nVal, oVal) {
      if (nVal) {
        this.selectTopicOptionInfo()
      } else {
        this.handleReset()
      }

    }
  },
  created() {
    if (this.questionId) {
      this.selectTopicOptionInfo()
    }
  },
  mounted() {

    if (this.questionId) {
      this.selectTopicOptionInfo()
    }
  },
  methods: {
    //编辑使用
    selectTopicOptionInfo() {
      if (this.questionId) {
        getPaperQuestionsById({ questionId: this.questionId }).then(response => {
          if (response.returnCode == '200' && response.returnData) {
            this.form.questionId = this.questionId;
            this.form.title = response.returnData.title;
            this.form.question = response.returnData.optionList;
            this.form.question.filter((item) => {
              if (item.isTrue == '0') {
                this.form.rightAnswer = item.sort;
                this.form.isTrue = item.sort;
              }
            })
          }
          else {
            this.form = {
              isTrue: '0',
              radio: '0',
              questionId: this.questionId,
              title: '',
              titleType: '1',
              level: '5',
              score: '',
              rightAnswer: 'A',
              titleAnalysis: '',
              question: [
                {
                  optionId: undefined,
                  optionName: '',
                  type: '1',
                  com_top: '上移',
                  com_bot: '下移',
                  sort: 'A',
                  isTrue: '',
                },
                {
                  optionId: undefined,
                  optionName: '',
                  type: '1',
                  com_top: '上移',
                  com_bot: '下移',
                  sort: 'B',
                  isTrue: '',
                },
              ]
            }
          }
        })
      }
    },
    // 增加
    add_num(item, index) {
      this.form.question.push({
        optionName: '',
        type: '1',
        com_top: '上移',
        com_bot: '下移',
        topicId: this.topicId,
        sort: parseInt(this.form.question.length) + 1,
      });
      this.form.question.map((res, num) => {
        res.type = num.toString();
        if (num == 0) {
          res.sort = 'A'
        }
        if (num == 1) {
          res.sort = 'B'
        }
        if (num == 2) {
          res.sort = 'C'
        }
        if (num == 3) {
          res.sort = 'D'
        }
        if (num == 4) {
          res.sort = 'E'
        }
      })
      this.$forceUpdate();
    },
    handleIsTrue() {
      this.$forceUpdate();
    },
    inputChange(val) {
      return this.form.score = this.form.score.replace(/[^0-9.]/g, '');
    },
    // 删除
    delete_num(item, index) {
      if (this.form.rightAnswer === index) {
        this.form.rightAnswer = null
      }
      if (this.form.question.length > 1) {
        this.form.question.splice(index, 1)
      }
      this.$forceUpdate();
    },
    //上移
    top_num(item, index) {
      let data = item;
      this.form.question.splice(index, 1);
      this.form.question.splice(index - 1, 0, data);
      this.$forceUpdate();
    },
    //下移
    bot_num(item, index) {
      let data = item;
      this.form.question.splice(index, 1);
      this.form.question.splice(index + 1, 0, data);
      this.$forceUpdate();
    },
    // 重置
    handleReset() {
      this.form = {
        isTrue: '0',
        radio: '0',
        questionId: this.questionId,
        title: '',
        score: '',
        rightAnswer: 'A',
        titleAnalysis: '',
        question: [
          {
            optionId: undefined,
            optionName: '',
            type: '1',
            com_top: '上移',
            com_bot: '下移',
            sort: 'A',
            isTrue: '',
          },
          {
            optionId: undefined,
            optionName: '',
            type: '1',
            com_top: '上移',
            com_bot: '下移',
            sort: 'B',
            isTrue: '',
          },
        ]
      }
      this.$forceUpdate();
    },
    //确定
    popup_clo() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.question != null) {
            for (const val of this.form.question) {
              if (!val.optionName) {
                return this.$message.warning('请添加试题选项！');
              }
              if (this.form.rightAnswer === val.sort) {
                val.isTrue = '0'
              } else {
                val.isTrue = '1'
              }
            }
          } else {
            return this.$message.warning('请添加试题选项！');
          }
          const param = {
            // id: this.form.id,
            id: this.questionId,
            courseId: this.courseId,
            chapterId: this.chapterId,
            subsectionId: this.subsectionId,
            title: this.form.title,
            titleType: this.form.titleType,
            level: this.form.level,
            score: this.form.score,
            titleAnalysis: this.form.titleAnalysis,
            saleContent: encodeURIComponent(JSON.stringify(this.form.question)),
            answerTime: "",
          }

          addVerifyQuestion(param).then(response => {
            if (response && response.returnCode == 200) {
              this.form.questionId = response.returnData.questionId;
              this.$emit('handlePush', this.form);
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.compile {

  background: #fff;

  border: 1px dashed #ccc;
  position: relative;

  .compile_content {
    padding-top: 20px;
    width: 80%;
    margin: 0 auto;

    .el_from_items {
      margin-top: 18px;
    }

    .compile_content_title {
      font-size: 18px;
      width: 96px;
      height: 40px;
      line-height: 40px;
      background: -webkit-linear-gradient(left, #7da9ff, #9fc3ff);
      border-radius: 0px 0px 28px 0px;
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
    }

    .headTxt {
      display: flex;
      justify-content: space-evenly;

      .compile_option_one {
        color: #c0cbe1;
        font-size: 18px;
        margin-top: 9px;
      }

      .compile_option_two,
      .compile_option_th {
        margin-top: 9px;
        color: #a2a9b9;
        font-size: 14px;

        &:hover {
          color: #5189f7;
          cursor: pointer;
        }
      }
    }

    .headTxttop {
      height: 36px;

      .head_txt_top_cot {
        background: #e6e6e6;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .compile_option_top,
        .compile_option_com,
        .compile_con {
          font-size: 12px;
          font-weight: 600;
          height: 36px;
          line-height: 36px;
        }

        .com_left {
          width: 64%;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }

        .com_right {
          width: 36%;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
        }

        .compile_option_top {
          margin-left: -12px;
        }
      }
    }
  }
}

.sub-row {
  margin-top: 30px;
  text-align: center;
}

.el-select {
  width: 100%;
}

::v-deep .el-form-item__label {
  font-weight: bold;
  text-align: right;
}

::v-deep .el-form-item {
  margin-bottom: 0;
}

::v-deep .el-row {
  margin-bottom: 15px;
}

::v-deep .el-form-item__content {
  margin-left: 80px;
}

::v-deep .el-form-item__content {
  margin-left: 80px !important;
}
</style>
