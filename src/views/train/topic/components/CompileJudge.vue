<template>
  <div class="compile">
    <div class="compile_content">
      <div class="compile_content_title">判断题</div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="el_from_items">
        <el-row>
          <el-col :span="24"></el-col>
          <div>
            <el-form-item label="内容：" prop="title">
              <el-input type="textarea" v-model="form.title" placeholder="请输入题目内容"></el-input>
            </el-form-item>
          </div>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="24">
            <div>
              <el-form-item label="分值：" prop="score">
                <el-input v-model="form.score" placeholder="请输入分值" :maxlength="2" @change="inputChange"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <el-form-item label="答案：" style="text-align: left">
                <span v-for="(item, index) in form.question" :key="index">
                  <el-radio style="margin-left: 20px" v-model="form.isTrue" :label="item.sort" @input="handleIsTrue">{{
                    item.optionName }}</el-radio>
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div>
              <el-form-item label="解析：" prop="titleAnalysis">
                <el-input type="textarea" v-model="form.titleAnalysis" placeholder="请输入题目解析"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="sub-row">
          <el-col :span="24">
            <el-form-item>
              <el-button @click="handleReset()">重置</el-button>
              <el-button type="primary" @click="popup_clo()">确定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addQuestion, getPaperQuestionsById,addPaperRel_v2 } from '@/api/learningCenter';
export default {
  props: ['questionId', 'perId', 'courseId'],
  data() {
    return {
      form: {
        questionId: this.questionId,
        title: '',
        titleType: '3',
        level: '1',
        score: '',
        isTrue: 'A',
        titleAnalysis: '',
        question: [
          {
            optionId: '',
            optionName: '对',
            type: '3',
            isTrue: '0',
            sort: 'A',
          },
          {
            optionId: '',
            optionName: '错',
            type: '3',
            isTrue: '1',
            sort: 'B',
          },
        ],
      },
      rules: {
        title: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
        score: [{ required: true, message: '请输入题目分数', trigger: 'change' },
        { pattern: /^[0-9]*$/, message: '题目分值需为正整数', trigger: 'blur' }],
        titleAnalysis: [{ required: true, message: '请输入题目解析', trigger: 'change' }],
      },
    }
  },
  created() {
    if (this.questionId !== null && this.questionId !== undefined) {
      this.selectTopicOptionInfo()
    }
  },
  watch: {
    form: {
      handler(val) {
        this.$emit('handlePush', this.form);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectTopicOptionInfo() {
      if (this.questionId != null || this.questionId != undefined) {
        getPaperQuestionsById({ questionId: this.questionId }).then(response => {
          if (response.returnCode == '200' && response.returnData) {
            this.form = response.returnData;
            this.form.questionId = this.questionId;
            this.form.question = response.returnData.optionList;
            this.form.question.filter((item) => {
              if (item.isTrue == '0') {
                this.form.isTrue = item.sort;
              }
            })
          } else {
            this.form = {
              questionId: this.questionId,
              title: '',
              titleType: '3',
              level: '1',
              score: '',
              isTrue: 'A',
              titleAnalysis: '',
              question: [
                {
                  optionId: undefined,
                  optionName: '对',
                  type: '3',
                  isTrue: '0',
                  sort: 'A',
                },
                {
                  optionId: undefined,
                  optionName: '错',
                  type: '3',
                  isTrue: '1',
                  sort: 'B',
                },
              ],
            }
          }
        })
      }
    },
    handleIsTrue() {
      this.$emit('handlePush', this.form);
      this.$forceUpdate();
    },
    inputChange(val) {
      return this.form.score = this.form.score.replace(/[^0-9.]/g, '');
    },
    // 重置
    handleReset() {
      this.form = {
        questionId: this.questionId,
        title: '',
        score: '',
        isTrue: 'A',
        titleAnalysis: '',
        question: [
          {
            optionName: '对',
            type: '3',
            isTrue: '0',
            sort: 'A',
          },
          {
            optionName: '错',
            type: '3',
            isTrue: '1',
            sort: 'B',
          },
        ],
      }
    },

    popup_clo() {
      this.$refs['form'].validate(valid => {
        if (this.form.question != null) {
          this.form.question.forEach(val => {
            if (this.form.isTrue === val.sort) {
              val.isTrue = '0'
            } else {
              val.isTrue = '1'
            }
          })
        } else {
          return this.$message.warning('请添加试题选项！');
        }
        if (valid) {
          const param = {
            id: this.form.id,
            courseId: this.courseId,
            perId: this.perId,
            title: this.form.title,
            titleType: this.form.titleType,
            level: this.form.level,
            score: this.form.score,
            titleAnalysis: this.form.titleAnalysis,
            saleContent: encodeURIComponent(JSON.stringify(this.form.question)),
          }
          addQuestion(param).then(response => {
            if (response.returnCode == 200) {
              this.form.questionId = response.returnData.questionId;
              for (let i = 0; i < this.form.question.length; i++) {
                this.form.question[i].optionId = response.returnData.optionId[i];
                if (this.form.question[i].isTrue == "0") {
                  this.form.isTrue = this.form.question[i].sort;
                }
              }
              this.$message.success('判断题提交成功！');
              this.$emit('handlePush', this.form);
              this.save()
            }else if ( response.returnCode == 202) {
              this.$message.warning(response.returnMessage)
            }
          })
        }
      })
    },
    save(){
      let param = {
            addQuestionIds: '['+JSON.stringify(this.form)+']',
            paperId: this.perId,
          }
          console.log(param,'canshu');
          
          addPaperRel_v2(param).then(res => {
            if (res.returnCode == '200') {
              this.$emit('handleSave')
            }
          })
    }
  },
}
</script>

<style lang="scss" scoped>
.compile {
  width: 85%;
  background: #fff;
  margin: 20px auto;
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
      background: -webkit-linear-gradient(left, #3dc988, #7fed96);
      border-radius: 0px 0px 28px 0px;
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
    }

    .headTxt {
      .compile_optionone {
        color: #c0cbe1;
        font-size: 18px;
        margin-top: 9px;
      }

      .compile_optiontwo,
      .compile_optionth {
        margin-top: 9px;
        color: #a2a9b9;
        font-size: 14px;

        &:hover {
          color: #5189f7;
        }
      }
    }
  }
}

.el-select {
  width: 100%;
}

::v-deep .el-form-item__label {
  font-weight: bold;
  text-align: right;
}

::v-deep .el-form-item__content {
  margin-left: 80px;
}
</style>
