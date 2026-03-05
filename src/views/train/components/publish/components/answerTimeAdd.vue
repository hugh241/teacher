<template>
  <div>
    <el-dialog
      title="添加小节中途答题"
      :visible.sync="addDisplay"
      :show-close="false"
      width="60%"
    >
      <el-form
        :model="answer"
        ref="answer"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="小节名称：" prop="subsectionName">
              <div class="content-detail">{{ answer.subsectionName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="视频时长：">
              <div class="content-detail">
                {{ formatTime(answer.videoTime) }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              class="button"
              @click="addAnswerNum"
              icon="el-icon-plus"
              long
              style="margin-bottom: 15px"
              >增加答题</el-button
            >
          </el-col>
        </el-row>

        <el-row
          v-for="(item, index) in answer.studyAnswerQuestions"
          :key="index"
        >
          <p
            style="
              width: 94%;
              height: 30px;
              line-height: 20px;
              font-size: 14px;
              color: #ff9900;
              margin-left: 30px;
              margin-top: 15px;
            "
          >
            第{{ index + 1 }}次答题
            <el-button
              type="danger"
              @click="removeAnswerNum(index)"
              style="float: right"
              size="small"
              >删除</el-button
            >
          </p>
          <p
            style="
              width: 94%;
              marginleft: 30px;
              height: 10px;
              bordertop: 1px solid #e3e8ee;
            "
          ></p>
          <el-col :span="23" style="marginbottom: 20px">
            <el-form-item label="答题时间" prop="answerTime">
              <!-- <el-time-picker @blur="changePicker" value-format="HH:mm:ss" v-model="item.answerTime"
                placeholder="请选择中途答题时间" :picker-options="{
                  selectableRange: '00:00:00 - ' + formatTime(answer.videoTime)
                }
                  ">
              </el-time-picker> -->
              <el-input
                @input="filterInput($event, item)"
                placeholder="请输入中途答题时间，如:00:05:30或者输入秒数"
                v-model="item.answerTime"
                :maxlength="8"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问答题目" prop="qustionId">
              <div class="compile">
                <div class="compile_content">
                  <div class="compile_content_title">单选题</div>
                  <el-form
                    :model="item"
                    class="el_from_items"
                    label-width="80px"
                    :rules="rebox"
                  >
                    <el-row>
                      <el-col :span="24">
                        <div>
                          <el-form-item label="内容：" prop="title">
                            <el-input
                              @input="$forceUpdate()"
                              type="textarea"
                              v-model="item.title"
                              placeholder="请输入题目内容"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>

                    <el-col :span="2">
                      <div>
                        <el-form-item
                          label="选项："
                          prop="title2"
                        ></el-form-item>
                      </div>
                    </el-col>

                    <div
                      style="
                        border: 1px solid #e6e6e6;
                        width: 90%;
                        margin-left: 10%;
                        margin-bottom: 10px;
                      "
                    >
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
                      <el-row
                        class="headTxt"
                        v-for="(ite, idx) in item.saleContentData"
                        :key="idx"
                      >
                        <el-col :span="1">
                          <div style="line-height: 30px">
                            <!-- <span>{{ ite.sort }}:</span> -->
                          </div>
                        </el-col>
                        <el-col :span="14">
                          <div>
                            <el-input
                              v-model="ite.optionName"
                              prop="question"
                              placeholder="请输入选项内容"
                            ></el-input>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="compile_option_one">
                            <i
                              class="el-icon-circle-plus"
                              @click="add_num(ite, idx, index)"
                            ></i>
                            <i
                              class="el-icon-remove"
                              style="margin-left: 10px"
                              @click="delete_num(ite, idx, index)"
                            ></i>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div class="compile_option_two">
                            <el-radio
                              v-model="item.rightAnswer"
                              prop="rightAnswer"
                              :label="ite.sort"
                              @input="handleIsTrue"
                              >{{ "" }}</el-radio
                            >
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div
                            class="compile_option_two"
                            @click="top_num(ite, idx, index)"
                          >
                            <i class="el-icon-top"></i>
                            <span class>上移</span>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <div
                            class="compile_option_th"
                            @click="bot_num(ite, idx, index)"
                          >
                            <i class="el-icon-bottom"></i>
                            <span class>下移</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="button" @click="$emit('close')">取消</el-button>
        <el-button
          type="primary"
          class="button"
          :loading="loading"
          @click="addFormSubmit"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAnswerQuestion, deleteQuestionV3 } from "@/api/learningCenter";
import { addVerifyQuestion, getPaperQuestionsById } from "@/api/learningCenter";
export default {
  props: {
    courseId: {
      type: String,
      default: "",
    },

    addDisplay: {
      type: Boolean,
      default: false,
    },
    answerList: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      rules: {
        question: [
          { required: true, message: "请输入题目选项", trigger: "change" },
        ],
        rightAnswer: [
          { required: true, message: "请选择正确答案", trigger: "change" },
        ],
      },
      rebox: {
        title: [{ required: true, message: " ", trigger: "change" }],
        title2: [{ required: true, message: " ", trigger: "change" }],
      },
      answer: {},
    };
  },
  methods: {
    filterInput(value, item) {
      // 直接处理输入值
      const filteredValue = value.replace(/[^0-9:]/g, "");
      item.answerTime = filteredValue;
      this.$forceUpdate();
    },
    changePicker(e) {
      this.$forceUpdate();
      console.log(e.value, 2333);
    },
    removeAnswerNum(index) {
      this.answer.studyAnswerQuestions.splice(index, 1);
      this.$forceUpdate();
    },
    addFormSubmit() {
      if (this.answer.studyAnswerQuestions.length == 0) {
        this.$message({
          message: "中途答题至少要有一次，请重新输入",
          type: "error",
        });

        return false;
      }
      let showTimeFlag = true;
      let qustionIdFlag = true;
      let optionNameTag = true;
      let rightAnswerTag = true;

      let videoTime = this.answer.videoTime;
      this.answer.studyAnswerQuestions.forEach((item) => {
        if (
          item.answerTime == null ||
          item.answerTime == "" ||
          item.answerTime == undefined
        ) {
          this.$message({
            message: "答题时间不能为空，请输入",
            type: "error",
          });
          showTimeFlag = false;
          return;
        }
        let answerTime = this.timeFormat(item.answerTime);
        if (answerTime > videoTime) {
          this.$message({
            message: "答题时间不能大于视频时长，请重新输入",
            type: "error",
          });
          showTimeFlag = false;
          return;
        }
        if (item.title == null || item.title == "" || item.title == undefined) {
          this.$message({
            message: "问答题目不能为空，请选择",
            type: "error",
          });
          qustionIdFlag = false;
          return;
        }
        if (!item.rightAnswer) {
          rightAnswerTag = false;
        }
        console.log(item.rightAnswer, 2333);
        item.saleContentData.forEach((ite) => {
          if (!ite.optionName) {
            optionNameTag = false;
          }
        });

        item.saleContent = encodeURIComponent(
          JSON.stringify(item.saleContentData)
        );
      });
      if (!optionNameTag) {
        this.$message({
          message: "选项内容不能为空，请选择",
          type: "error",
        });
        return false;
      }
      if (!rightAnswerTag) {
        this.$message({
          message: "正确答案不能为空，请选择",
          type: "error",
        });
        return false;
      }
      if (showTimeFlag && qustionIdFlag && optionNameTag && rightAnswerTag) {
        this.loading = true;
        addVerifyQuestion({
          paperQuestions: this.answer.studyAnswerQuestions,
        }).then((res) => {
          if (res.returnCode == "200") {
            this.loading = false;

            this.$emit("close");
            this.$message({
              message: "添加成功",
              type: "success",
            });
          }
        });
      }

      console.log(this.answer);
    },
    // 增加
    add_num(item, idx, index) {
      // this.answer.studyAnswerQuestions[index].saleContentData.push('')
      console.log(this.answer);
      // return
      this.answer.studyAnswerQuestions[index].saleContentData.push({
        optionName: "",
        type: "1",
        com_top: "上移",
        com_bot: "下移",
        topicId: this.topicId,
        sort: parseInt(this.answer.studyAnswerQuestions.length) + 1,
      });
      this.answer.studyAnswerQuestions[index].saleContentData.map(
        (res, num) => {
          res.type = num.toString();
          const labels = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z ",
          ]; // 标识数组，可以根据需要扩展
          res.sort = labels[num];
        }
      );
      this.$forceUpdate();
    },
    // 删除
    delete_num(item, idx, index) {
      // if (this.answer.studyAnswerQuestions[index] === index) {
      //   this.answer.studyAnswerQuestions[index] = null
      // }
      if (this.answer.studyAnswerQuestions[index].saleContentData.length > 1) {
        this.answer.studyAnswerQuestions[index].saleContentData.splice(idx, 1);
      }
      this.$forceUpdate();
    },
    handleIsTrue() {
      this.$forceUpdate();
    },
    //上移
    top_num(item, idx, index) {
      if (idx == 0) {
        return false;
      }

      let data = item;
      this.answer.studyAnswerQuestions[index].saleContentData.splice(idx, 1);
      this.answer.studyAnswerQuestions[index].saleContentData.splice(
        idx - 1,
        0,
        data
      );
      this.$forceUpdate();
    },
    //下移
    bot_num(item, idx, index) {
      let length =
        this.answer.studyAnswerQuestions[index].saleContentData.length - 1;
      if (idx == length) {
        return false;
      }
      let data = item;
      this.answer.studyAnswerQuestions[index].saleContentData.splice(idx, 1);
      this.answer.studyAnswerQuestions[index].saleContentData.splice(
        idx + 1,
        0,
        data
      );
      this.$forceUpdate();
    },
    //新增中途答题次数
    addAnswerNum() {
      this.answer.studyAnswerQuestions.push({
        id: "",
        rightAnswer: "A",
        chapterId: this.answer.chapterId, //章节Id
        courseId: this.courseId, //课程id
        level: "5", //层次类型 【1：课程 2：章节 3：小节 4：问卷 5：中途答题】
        saleContentData: [
          {
            optionId: undefined,
            optionName: "",
            type: "1",
            com_top: "上移",
            com_bot: "下移",
            sort: "A",
            isTrue: "",
          },
          {
            optionId: undefined,
            optionName: "",
            type: "1",
            com_top: "上移",
            com_bot: "下移",
            sort: "B",
            isTrue: "",
          },
        ],
        score: "",
        subsectionId: this.answer.id, //小节Id
        title: "", //题目
        titleAnalysis: "", //题目解析
        titleType: "1", //题目类型 1：单选 2：多选 3：判断题
        answerTime: "", //断点时间
      });
      this.$forceUpdate();
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
      let result =
        (hourTime < 10 ? "0" + hourTime : hourTime) +
        ":" +
        (minuteTime < 10 ? "0" + minuteTime : minuteTime) +
        ":" +
        (secondTime < 10 ? "0" + secondTime : secondTime);
      return result;
    },
    //时间格式转换 时分秒 -> 秒
    timeFormat(e) {
      let time = e;
      let len = time.split(":");
      if (len.length == 3) {
        let hour = time.split(":")[0];
        let min = time.split(":")[1];
        let sec = time.split(":")[2];
        return Number(hour * 3600) + Number(min * 60) + Number(sec);
      }
      if (len.length == 2) {
        let min = time.split(":")[0];
        let sec = time.split(":")[1];
        return Number(min * 60) + Number(sec);
      }
      if (len.length == 1) {
        let sec = time.split(":")[0];
        return Number(sec);
      }
    },
  },
  created() {
    console.log(this.answerList, 899);
    this.answer = Object.assign(this.answer, this.answerList);
    if (this.answer.studyAnswerQuestions.length == 0) {
      this.addAnswerNum();
    } else {
      this.$nextTick(() => {
        this.answer.studyAnswerQuestions.forEach((item) => {
          item.id = item.qustionId;
          item.answerTime = item.showTime;
          item.title = item.questionName;
          item.saleContentData = item.optionList;
        });
        this.$forceUpdate();
      });
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
</style>
