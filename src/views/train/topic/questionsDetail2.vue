<!--查看题目-->
<template>
  <div class="teacher">
    <div class="tea_header">
      <div class="title_info">{{ PaperInfo.perName }}</div>
      <div class="title_bot">
        <span>培训课程：{{ PaperInfo.courseName }}</span>
        <span>起始日期：{{ PaperInfo.startTime }}至{{ PaperInfo.endTime }}</span>
        <el-button type="primary" @click="backList" class="but">返回到试卷列表</el-button>
      </div>
    </div>
    <div class="tea_con">
      <div class="tea_left">
        <div class="question_main">
          <div v-for="(item, index) in tableData" :key="index">
            <!-- 单选题 -->
            <div class="single_box" v-if="activeName == '1' && tableData.length > 0">
              <div class="sing_title">
                <span>{{ index + 1 }}.</span>
                <div class="qus_type">【单选题】</div>
                <div>{{ item.title }}</div>
                <div>（ {{ item.rightAnswerNew }} ）</div>
                <div>({{ item.score }}分)</div>
              </div>
              <div class="sing_wraper">
                <el-checkbox-group v-model="radio[index]" class="answer_check_wrapper_con">
                  <el-checkbox :label="index1 + 1 + ''" v-for="(item1, index1) in item.optionList" :key="index1"
                    :disabled="true">{{ item1.optionName }} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;错题率:{{ item1.saleContent }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!--  多选题-->
            <div class="single_box" v-if="activeName == '2' && tableData.length > 0">
              <div class="sing_title">
                <span>{{ index + 1 }}.</span>
                <div class="qus_type">【多选题】</div>
                <div>{{ item.title }}</div>
                <div>（ {{ item.rightAnswerNew }} ）</div>
                <div>({{ item.score }}分)</div>
              </div>
              <div class="sing_wraper">
                <el-checkbox-group v-model="radio[index]" class="answer_check_wrapper_con">
                  <el-checkbox :label="index1 + 1 + ''" v-for="(item1, index1) in item.optionList" :key="index1"
                    :disabled="true">{{ item1.optionName }} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;错题率:{{ item1.saleContent }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 判断题 -->
            <div class="single_box" v-if="activeName == '3' && tableData.length > 0">
              <div class="sing_title">
                <span>{{ index + 1 }}.</span>
                <div class="qus_type">【判断题】</div>
                <div>{{ item.title }}</div>
                <div>（ {{ item.rightAnswerNew }} ）</div>
                <div>({{ item.score }}分)</div>
              </div>
              <div class="sing_wraper">
                <el-checkbox-group v-model="radio[index]" class="answer_check_wrapper_con">
                  <el-checkbox :label="index1 + 1 + ''" v-for="(item1, index1) in item.optionList" :key="index1"
                    :disabled="true">{{ item1.optionName }} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;错题率:{{ item1.saleContent }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPaperTotalScore, getAnswerRecordDetail3 } from '@/api/learningCenter'
export default {
  props: ['courseId', 'paperId'],
  data() {
    return {
      PaperInfo: {},
      // 题目类型切换
      activeName: '1',
      tableData: [],
      radio: [],
      value: '',
      answerCardInfo: {
        //题目总数
        topicTotal: 10,
        //各种题型分值
        topicScore1: 10,
        topicScore2: 10,
        topicScore3: 10,
        //总分值
        topicScoreTotal: 10,
      },
      topicList1: [],
      topicList2: [],
      topicList3: [],
    }
  },
  created() { },
  mounted() { 
    this.getList();
  },

  methods: {
    // 题目类型切换
    handleClick(tab, event) {
      this.activeName = tab.name
      this.getList()
    },
    backList() {
      this.$emit('backList')
    },

    /* 接口 */
    // 获取列表
    async getList() {
      let data = {
        paperId: this.paperId,
        topicType: '',
      }
      let res = await getAnswerRecordDetail3(data)
      if (res.returnCode == 200) {
        this.PaperInfo = res.returnData.paperPer;
        this.radio = []
        this.tableData = []
        let index = 0
        // debugger
        for (let i = 0; i < res.returnData.paperPer.paperQuestionsList.length; i++) {
          //题目
          let element = res.returnData.paperPer.paperQuestionsList[i]
          // if (element.titleType == this.activeName) {
            let str = ''
            let tmp = element.optionList
            let arr = []
            for (let j = 0; j < tmp.length; j++) {
              if (tmp[j].isTrue == '0') {
                str += tmp[j].sort + ','
                arr.push(j + 1 + '')
              }
            }
            this.radio[index] = arr
            if (str.length > 0) {
              str = str.substr(0, str.length - 1)
            }
            element.rightAnswerNew = str
            this.tableData.push(element)
            index++
          // }
        }
      }
      console.log('sadaa',this.tableData);
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.teacher {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tea_header {
    height: 100px;
    background-color: #fff;
    width: 98%;
    margin: 0 auto;
    @include center();
    flex-direction: column;
    position: relative;

    .title_info {
      font-size: 20px;
      font-weight: 500;
    }

    .title_bot {
      padding-top: 20px;
      display: flex;

      span {
        font-size: 14px;
        color: #999999;
        display: block;
        margin: 0 20px;
      }

      .but {
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
  }

  .tea_con {
    flex: 1;
    width: 98%;
    margin: 10px auto;
    display: flex;

    .tea_left {
      background: #fff;
      width: 100%;

      .question_con {
        height: 60px;
        margin-left: 40px;
        margin-right: 20px;

        ::v-deep .el-tabs__nav-wrap {
          margin-bottom: -14px;
        }
      }

      .question_main {
        width: 100%;
        height: 80vh;
        overflow: auto;

        .single_box {
          width: 98%;
          height: auto;
          border-bottom: 1px solid #ccc;
          margin-left: 20px;

          .sing_title {
            display: flex;
            font-size: 18px;
            font-weight: 500;
            margin: 20px 20px;

            .qus_type {
              color: red;
            }
          }

          .sing_wraper {
            padding-left: 20px;
            margin-bottom: 20px;

            .answer_check_wrapper_con {
              display: flex;
              justify-content: flex-start;
              flex-direction: column;

              .el-checkbox {
                margin-left: 10px;
              }

              .el-radio__label {
                .checkbox {
                  margin-right: 20px;
                }
              }

              .checkbox {
                margin-left: 0px;
              }

              .el-radio {
                margin: 10px;
              }
            }

            .answer_check_wrapper_con {
              display: flex;
              justify-content: flex-start;
              flex-direction: column;

              .el-checkbox {
                margin-left: 10px;
              }

              .el-radio__label {
                .checkbox {
                  margin-right: 20px;
                }
              }

              .checkbox {
                margin-left: 0px;
              }

              .el-checkbox {
                margin: 10px;
              }
            }
          }
        }
      }
    }

    .tea_right {
      width: 30%;
      background-color: #fff;
      margin-left: 10px;

      .tea_con {
        display: flex;
        flex-direction: column;

        .question_main {
          height: 44px;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          justify-content: space-between;

          span:first-child {
            font-size: 16px;
          }

          span:last-child {
            font-size: 14px;
            color: #999999;
          }
        }

        .question_single {
          margin-top: 10px;

          .singleall {
            font-size: 16px;
            position: relative;

            span {
              color: #999999;
            }

            ::before {
              content: '';
              position: absolute;
              left: -10px;
              top: 0;
              width: 3px;
              height: 17px;
              background: #3e7cf6;
            }
          }

          .question_single_con {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

            .answerbtn {
              margin: 10px 10px;

              .el-button {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #7aa7ff;
                color: #fff;
              }
            }

            .noanswerbtn {
              margin: 10px 10px;

              .el-button {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #fff;
                color: #333;
              }
            }
          }
        }

        .question_size {
          color: #999999;
          text-align: center;
          margin-top: 20px;
        }

        .question_sum {
          display: flex;
          justify-content: center;
          align-items: center;

          .sum_one,
          .sum_two {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px;
          }

          .sum_one {
            .el-button {
              background: #7aa7ff;
              color: #fff;
            }
          }

          .sum_two {
            .el-button {
              background: #fff;
              color: #999999;
            }
          }

          .el-button {
            margin-right: 10px;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .question_com {
          margin-top: 40px;
          display: flex;
          justify-content: space-evenly;

          .question_com_eft {
            .el-button {
              color: #333333;
              border: 1px solid #cfcfcf;
              border-radius: 4px;
            }
          }

          .question_com_right {
            .el-button {
              color: #ffffff;
              background: #417ef6;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
