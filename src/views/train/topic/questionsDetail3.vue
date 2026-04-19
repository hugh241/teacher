<!--查看题目-->
<template>
  <div class="teacher">
    <div class="tea_header">
      <div class="title_bot">
        <el-button type="primary" @click="backList" class="but">返回到测试列表</el-button>
      </div>
    </div>
    <div class="tea_con">
      <div class="tea_left">
        <div class="question_main">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="score"
              label="分数"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="order"
              label="排名"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPaperTotalScore, getPaperPerInfo3 } from '@/api/learningCenter'
export default {
  props: ['courseId', 'paperId'],
  data() {
    return {
      tableData: []
    }
  },
  created() { },
  mounted() { 
    this.getList();
  },

  methods: {
    backList() {
      this.$emit('backList')
    },
    async getList() {
      let data = {
        paperId: this.paperId,
        topicType: '',
      }
      let res = await getPaperPerInfo3(data)
      if (res.returnCode == 200) {
        this.tableData = res.returnData;
      }
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
