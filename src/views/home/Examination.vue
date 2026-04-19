<template>
  <div>
    <BreadCrumb :type="1" />
    <div class="app-main">
      <div class="examContainer" @scroll="scrollEvent">
        <div class="examContent">
          <div class="examInfo">
            <p>{{ paperInfo.perName }}</p>
            <ul>
              <li>
                <span>测试题类型：</span>
                <span class="desc">{{ paperInfo.type === '1' ? '练习' : paperInfo.type === '2' ? '考试' : paperInfo.type === '4' ? '问卷' : '' }}</span>
              </li>
              <li>
                <span>测试题层次：</span>
                <span class="desc">{{
                  paperInfo.level === '1' ? '课程' : paperInfo.level === '2' ? '章节' : paperInfo.level === '3' ? '小节' : paperInfo.level === '4' ? '问卷' : ''
                }}</span>
              </li>
              <li>
                <span>所属课程：</span>
                <span class="desc">{{ paperInfo.courseName }}</span>
              </li>
            </ul>
            <ul>
              <li>
                <span>试卷总分：</span>
                <span class="desc">{{ paperInfo.totalScore }}</span>
              </li>
              <li>
                <span>及格分数：</span>
                <span class="desc">{{ paperInfo.passScore }}</span>
              </li>
              <li>
                <span>所属章节：</span>
                <span class="desc">{{ paperInfo.chapterName }}</span>
              </li>
            </ul>
          </div>
          <div class="examDetail" v-if="singleNumber > 0">
            <p class="title">第一部分：单选题（{{ paperInfo.singleScoreTotal }}分）</p>
            <div class="questionDetail" v-for="(item, index) in paperInfo.single" :key="index">
              <p class="questionTitle">{{ index + 1 + '、' + item.title + '(' + item.score + '分)' }}</p>
              <el-radio-group @change="selectAwser(item.id, 'radio')" :ref="item.id" v-model="formData[item.id]">
                <el-radio v-for="(option, optionIndex) in item.optionList" :key="optionIndex" :label="option.sort">
                  <span>{{ option.sort + '、' + option.optionName }}</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="examDetail" v-if="multipleNumber > 0">
            <p class="title">第二部分：多选题（{{ paperInfo.multipleScoreTotal }}分）</p>
            <div class="questionDetail" v-for="(item, index) in paperInfo.multiple" :key="index">
              <p class="questionTitle">{{ singleNumber + index + 1 + '、' + item.title }}</p>

              <el-checkbox-group @change="selectAwser(item.id, 'checkbox')" :ref="item.id" v-model="formData[item.id]">
                <el-checkbox v-for="(option, optionIndex) in item.optionList" :key="optionIndex" :label="option.sort">
                  <span>{{ option.sort + '、' + option.optionName }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="examDetail" v-if="judgeNumber > 0">
            <p class="title">第三部分：判断题（{{ paperInfo.judgeScoreTotal }}分）</p>
            <div class="questionDetail" v-for="(item, index) in paperInfo.judge" :key="index">
              <p class="questionTitle">{{ singleNumber + multipleNumber + index + 1 + '、' + item.title }}</p>
              <el-radio-group @change="selectAwser(item.id, 'radio')" :ref="item.id" v-model="formData[item.id]">
                <el-radio v-for="(option, optionIndex) in item.optionList" :key="optionIndex" :label="option.sort">
                  <span>{{ option.sort + '、' + option.optionName }}</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="examQuestion" v-if="isReloadData">
          <div class="examNotice">
            <img src="~@/assets/images/learningCenter/icon-xuzhi.svg" alt />
            <p>考试须知</p>
          </div>
          <div class="questionType" v-if="singleNumber > 0">
            <p class="questionTypeTitle">
              <!-- <Icon type="md-arrow-dropup" /> -->
              <span>单选题（共{{ paperInfo.singleScoreTotal }}分）</span>
            </p>
            <div class="questionList">
              <Button v-for="(item, index) in paperInfo.single" :key="index" :class="selectClasss(item.id, formData)" @click="jump(index + 1)">{{
                index + 1
              }}</Button>
            </div>
          </div>
          <div class="questionType" v-if="multipleNumber > 0">
            <p class="questionTypeTitle">
              <!-- <Icon type="md-arrow-dropdown" /> -->
              <span>多选题（共{{ paperInfo.multipleScoreTotal }}分）</span>
            </p>
            <div class="questionList">
              <Button
                v-for="(item, index) in paperInfo.multiple"
                :key="index"
                :class="selectClasss(item.id, formData)"
                @click="jump(singleNumber + index + 1)"
                >{{ singleNumber + index + 1 }}</Button
              >
            </div>
          </div>
          <div class="questionType" v-if="judgeNumber > 0">
            <p class="questionTypeTitle">
              <!-- <Icon type="md-arrow-dropup" /> -->
              <span>判断题（共{{ paperInfo.judgeScoreTotal }}分）</span>
            </p>
            <div class="questionList">
              <Button
                v-for="(item, index) in paperInfo.judge"
                :key="index"
                :class="selectClasss(item.id, formData)"
                @click="jump(singleNumber + multipleNumber + index + 1)"
                >{{ singleNumber + multipleNumber + index + 1 }}</Button
              >
            </div>
          </div>
          <div class="parerInfo">
            <p>本试卷共{{ singleNumber + multipleNumber + judgeNumber }}题，总分{{ paperInfo.totalScore }}分</p>
          </div>
          <div class="statistics">
            <div>
              <p class="question_ selectedQuestion">{{ Object.keys(this.formData).length }}</p>
              <span>已做</span>
            </div>
            <div>
              <p class="question_">{{ singleNumber + multipleNumber + judgeNumber - Object.keys(this.formData).length }}</p>
              <span>未做</span>
            </div>
          </div>
          <div class="submitContent">
            <el-button type="primary" @click="handleSubmitSave" v-if="singleNumber + multipleNumber + judgeNumber > 0">我要交卷</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getPaperInfoById, addUserRecord } from '@/api/learningCenter'
  import { getUserInfo } from '../../utils/auth'
  import BreadCrumb from '@/components/Breadcrumb/index.vue'
  export default {
    name: 'Examination',
    components: {
      BreadCrumb,
    },
    data() {
      return {
        asd: [],
        paperInfo: [],
        formData: {},
        singleNumber: 0,
        multipleNumber: 0,
        judgeNumber: 0,
        paperId: '',
        totalList: [],
        isReloadData: true,
        time: '',
        userInfo: getUserInfo(),
        headerStyle: 'blue-header',
      }
    },
    methods: {
      checkboxChange(val) {
        console.log(val, 2333)
      },
      handleBack() {
        this.$router.back()
      },

      selectAwser(questionId, type, sort) {
        console.log(this.formData[questionId])
        return
        if (type === 'checkbox') {
          this.$nextTick(() => {
            if (this.formData[questionId] && this.formData[questionId].length != 0) {
              let arr = this.formData[questionId][0].split('')
              let index = arr.findIndex(item => {
                return item == sort
              })
              if (index == -1) {
                arr.push(sort)
              } else {
                arr.splice(index, 1)
              }
              this.formData[questionId] = []
              let data = ''
              if (arr.length > 0) {
                arr.forEach(item => {
                  data += item
                })
                this.formData[questionId].push(data)
              }
            } else {
              this.formData[questionId] = []
              this.formData[questionId].push(sort)
            }
          })
        }
        if (type === 'radio') {
          const question = this.$refs[questionId][0]
          this.formData[questionId] = question.value
        }

        this.selectClasss(questionId, this.formData)
        this.isReloadData = false
        this.$nextTick(() => {
          this.isReloadData = true
        })
      },
      selectClasss(questionId, formData) {
        console.log(formData[questionId])
        if (Array.isArray(formData[questionId])) {
          console.log('触发了')
          if (formData[questionId].length > 0) {
            return 'question selectedQuestion'
          } else {
            return 'question'
          }
        } else if (formData[questionId] && formData[questionId] != undefined && formData[questionId][0] != '') {
          return 'question selectedQuestion'
        }
        return 'question'
        this.$delete(this.formData, questionId)
      },
      //格式化提交数据
      getformatContent(formData) {
        let that = this
        let tempList = []
        for (let key in formData) {
          tempList.push({
            questionId: key,
            options: formData[key],
          })
        }
        if (that.singleNumber > 0) {
          that.paperInfo.single.forEach(item => {
            if (!(item.id in formData)) {
              tempList.push({
                questionId: item.id,
                options: [],
              })
            }
          })
        }
        if (that.multipleNumber > 0) {
          that.paperInfo.multiple.forEach(item => {
            if (!(item.id in formData)) {
              tempList.push({
                questionId: item.id,
                options: [],
              })
            }
          })
        }
        if (that.judgeNumber > 0) {
          that.paperInfo.judge.forEach(item => {
            if (!(item.id in formData)) {
              tempList.push({
                questionId: item.id,
                options: [],
              })
            }
          })
        }
        return tempList
      },
      handleSubmitSave() {
        let that = this
        console.log(that.formData)
        let data = {}
        for (let key in that.formData) {
          if (typeof that.formData[key] == 'string') {
            data[key] = []
            data[key].push(that.formData[key])
          } else {
            data[key] = that.formData[key]
          }
        }

        let nowTime = parseInt(new Date().getTime() / 1000) + ''
        let params = {
          userId: that.userInfo.userId,
          perId: that.paperId,
          perType: that.paperInfo.type,
          useTime: nowTime - that.time,
          content: JSON.stringify(this.getformatContent(data)),
        }
        this.$confirm('确定要提交试卷吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            addUserRecord(params).then(res => {
              if (res.returnCode == '200' || res.code == '200') {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                })
                this.$router.go(-1)
              } else {
                this.$message({
                  message: res.returnMessage,
                  type: 'error',
                })
              }
            })
          })
          .catch(() => {
            this.$Message.info({
              background: true,
              content: '已取消!',
            })
          })
      },

      /* 监听滚动(结合前面的@scroll) */
      scrollEvent(e) {
        let scrollItems = document.querySelectorAll('.questionDetail')
        for (let i = scrollItems.length - 1; i >= 0; i--) {
          // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
          let judge = e.target.scrollTop >= scrollItems[i].offsetTop - scrollItems[0].offsetTop
          if (judge) {
            break
          }
        }
        // 滚动条触底了
        if (e.srcElement.scrollTop + e.srcElement.offsetHeight === e.srcElement.scrollHeight) {
        }
      },
      /* 目录点击定位效果：有兼容问题，借鉴了很多其他方法却一直不成功，无奈之后使用了scrollIntoView */
      jump(index) {
        let jump = document.querySelectorAll('.questionDetail')
        if (index < this.singleNumber + this.multipleNumber + this.judgeNumber) {
          jump[index].scrollIntoView({ block: 'center', behavior: 'smooth' })
        } else {
          jump[index - 1].scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
      },
    },
    mounted() {
      let that = this
      that.paperId = this.$route.query.examId
      that.time = parseInt(new Date().getTime() / 1000) + ''
      getPaperInfoById(that.paperId).then(res => {
        if (res.returnCode == '200' && Object.keys(res.returnData).length > 0) {
          that.paperInfo = res.returnData
          // 判断题
          that.paperInfo.judge.forEach(item => {
            this.$set(this.formData, item.id, '')
          })
          // 单选题
          that.paperInfo.single.forEach(item => {
            this.$set(this.formData, item.id, '')
          })
          // 多选题

          that.paperInfo.multiple.forEach(item => {
            this.$set(this.formData, item.id, [])
          })

          if (that.paperInfo.single.length > 0) {
            that.singleNumber = that.paperInfo.single.length
          }
          if (that.paperInfo.multiple.length > 0) {
            that.multipleNumber = that.paperInfo.multiple.length
          }
          if (that.paperInfo.judge.length > 0) {
            that.judgeNumber = that.paperInfo.judge.length
          }
          that.totalList = that.paperInfo.single.concat(that.paperInfo.multiple, that.paperInfo.single)
        } else {
          this.$Message.error('获取试卷详情失败')
        }
      })
    },
  }
</script>
<style lang="scss" scoped>
  .app-main {
    height: 100%;
    overflow: hidden;
    margin: 10px;
    background: #fff;
    min-height: calc(100vh - 148px);
    border-radius: 10px;
    padding: 0 228px;
  }

  // @contentPadding: 0 8.125rem;
  // 10px: 0.15625rem;

  .examContainer {
    display: flex;

    .examContent {
      width: 70%;
      background: #ffffff;
      margin-right: 0.53125rem;
      // border-radius: 10px;

      .examInfo {
        padding: 0 0.6875rem 0.5rem 0.6875rem;

        p {
          height: 4.9375rem;
          line-height: 4.9375rem;
          font-size: 1.8rem;
          text-align: center;
          font-weight: 500;
          color: #333333;
          border-bottom: 0.03125rem solid #e1e1e1;
        }

        ul {
          font-size: 1.5rem;
          font-weight: 400;
          color: #848484;
          margin-top: 24px;
          display: flex;

          li {
            flex: 1;
            list-style: none;
          }

          .desc {
            color: #333333;
          }
        }
      }

      .examDetail {
        border: 0.03125rem solid #dbdbdb;
        border-bottom: none;
        margin-top: 15px;

        .title {
          background: #f5f9fd;
          padding: 10px;
          font-size: 1.5625rem;
          font-weight: 500;
          color: #333333;
          border-bottom: 0.03125rem solid #dbdbdb;
        }

        .questionDetail {
          padding: 0.875rem;
          border-bottom: 0.03125rem solid #dbdbdb;

          .questionTitle {
            font-size: 1.5625rem;
            font-weight: 400;
            color: #333333;
            margin-bottom: 0.8125rem;
          }

          ::v-deep .ivu-el-checkbox-group-item {
            display: block;
            margin-bottom: 0.5313rem;

            span {
              margin-right: 0.09375rem;
              font-size: 1.5625rem;
            }
          }

          ::v-deep .ivu-radio-wrapper {
            display: block;
            margin-bottom: 0.5313rem;

            span {
              margin-right: 0.09375rem;
              font-size: 1.5625rem;
            }
          }
        }
      }
    }

    .examQuestion {
      width: 20%;
      max-height: 45.125rem;
      overflow: auto;
      background: #ffffff;
      border-radius: 10px;
      position: fixed;
      right: 64px;

      .examNotice {
        height: 4.9375rem;
        padding-left: 0.75rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #d8d8d8;

        img {
          height: 1.7875rem;
          width: 1.71875rem;
        }

        p {
          font-size: 1.8625rem;
          font-weight: 400;
          color: #517df0;
          margin-left: 0.3125rem;
        }
      }

      .questionType {
        padding: 0.83125rem 0.8125rem;

        .questionTypeTitle {
          font-size: 1.5625rem;
          font-weight: 400;
          color: #333333;
        }

        .questionList {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.6rem;
        }
      }

      .parerInfo {
        font-size: 1.5625rem;
        font-weight: 400;
        color: #a3a3a3;
        text-align: center;
        margin-top: 1rem;
        padding: 0 0.625rem;

        p {
          display: table;
          white-space: nowrap;
          border-spacing: 0.0625rem 0;
        }

        p:before,
        p:after {
          display: table-cell;
          content: '';
          width: 50%;
          background: linear-gradient(#d8d8d8, #d8d8d8) repeat-x left center;
          background-size: 0.0625rem 0.0625rem;
        }
      }

      .statistics {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.84375rem;

        div {
          display: flex;
          align-items: center;
          margin-left: 0.9375rem;

          span {
            margin-left: 0.28125rem;
            font-size: 1.5625rem;
            font-weight: 00;
            color: #4b4b4b;
          }
        }
      }

      .submitContent {
        text-align: center;
        margin: 1.875rem 0;

        ::v-deep .ivu-btn {
          font-size: 1.525rem;
          font-weight: 400;
          color: #ffffff;
          width: 8.0625rem;
          height: 3.3125rem;
          background: #5a87fa;
          border-radius: 0.65625rem;
        }
      }
    }
  }

  .question {
    display: flex;
    justify-content: center;
    font-size: 0.7625rem;
    font-weight: 400;
    // height: 2.925rem;
    width: 3.4rem;
    line-height: 2.025rem;
    text-align: center;
    border-radius: 50%;
    background: #ffffff;
    border: 0.03125rem solid #b4b4b4;
    margin-left: 0.625rem;
  }

  .question_ {
    display: flex;
    justify-content: center;
    font-size: 0.7625rem;
    font-weight: 400;
    height: 2.925rem;
    width: 2.925rem;
    line-height: 2.925rem;
    text-align: center;
    border-radius: 50%;
    background: #ffffff;
    border: 0.03125rem solid #b4b4b4;
    margin-left: 0.625rem;
  }

  .selectedQuestion {
    background: #6f97ff;
    border: 0.03125rem solid #6f97ff;
    color: #ffffff;
  }
</style>
