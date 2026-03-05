<template>
  <div class="q-and-a">
    <div class="defaultContent" v-if="questionTotal === 0">
      <img src="../../../assets/images/learningCenter/wushuju.png" alt="" />
      <p>暂无问答</p>
    </div>
    <div v-else>
      <div
        v-for="(question, questionIndex) in questionList"
        :key="questionIndex"
      >
        <div>
          <el-card class="content-card" :bordered="false" shadow="never">
            <div class="user-info">
              <img class="avatar" :src="question.userHeaderImg" alt="" />
              <div class="name">{{ question.userName }}</div>
              <div class="time">{{ question.createTime }}</div>
            </div>
            <div class="qa-detail">
              <div class="qa-title">
                <p>{{ question.content }}</p>
                <div
                  class="reply"
                  @click="showReplyElement(question.id)"
                  v-if="question.userId != userInfo.userId"
                >
                  <img
                    src="../../../assets/images/learningCenter/icon-huifu.svg"
                    alt=""
                  />
                  <span>回复</span>
                </div>
              </div>
              <div class="replyContent" v-if="currentReplyId === question.id">
                <el-input
                  v-model="replyText"
                  :maxlength="200"
                  type="textarea"
                  :rows="3"
                  :placeholder="`回复${question.userName}`"
                ></el-input>
                <el-button
                  type="primary"
                  @click="submitReply(questionIndex, question)"
                  :loading="replyLoading"
                  >发送</el-button
                >
              </div>
              <div v-if="question.replyList != null">
                <div
                  class="qa-item"
                  v-for="(reply, replyIndex) in question.replyList"
                  :key="replyIndex"
                >
                  <span>{{ reply.userName }}</span> 回复
                  <span>{{ reply.replyUserName }}</span
                  >: {{ reply.content }}
                  <div
                    class="timeAndReply"
                    v-if="reply.userId != userInfo.userId"
                  >
                    <div class="time">{{ reply.createTime }}</div>
                    <div class="reply" @click="showReplyElement(reply.id)">
                      <img
                        src="../../../assets/images/learningCenter/icon-huifu.svg"
                        alt=""
                      /><span>回复</span>
                    </div>
                  </div>
                  <div class="replyContent" v-if="currentReplyId === reply.id">
                    <el-input
                      v-model="replyContent"
                      :maxlength="200"
                      type="textarea"
                      :rows="3"
                      :placeholder="`回复${reply.userName}`"
                    ></el-input>
                    <el-button
                      type="primary"
                      @click="HandleSubmitReply(questionIndex, reply)"
                      :loading="replyLoading"
                      >发送</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="content-card pageInfo">
        <p v-if="questionList.length < questionTotal" @click="loadMore">
          加载更多
        </p>
        <p v-if="questionList.length === questionTotal">没有更多内容了</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  findStudyProblemExchanges,
  addStudyProblemExchanges,
  findReplies,
} from "@/api/learningCenter";
import { getUserInfo } from "../../../utils/auth";
export default {
  name: "QAndA",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      pageParam: {
        pageNo: 1,
        pageSize: 10,
        courseId: this.courseDetail.id,
      },
      questionList: [],
      questionTotal: 0,
      replyContent: "",
      replyText: "",
      currentReplyId: "",
      replyLoading: false,
      userInfo: {},
    };
  },
  mounted() {
    this.loadQuestion();
    this.userInfo = getUserInfo();
  },
  methods: {
    loadQuestion() {
      findStudyProblemExchanges(this.pageParam).then((res) => {
        if ("200" == res.returnCode) {
          this.questionTotal = res.returnCount == null ? 0 : res.returnCount;
          let questions = res.returnData == null ? null : res.returnData;
          if (questions != null && questions.length > 0) {
            questions.filter((item) => {
              item.userHeaderImg = require("../../../assets/images/learningCenter/headPictrue.png");
              item.userName = item.userName == null ? "管理员" : item.userName;
            });
          }
          this.questionList = [...this.questionList, ...questions];
        }
      });
    },
    loadMore() {
      this.pageParam.pageNo = this.pageParam.pageNo + 1;
      this.loadQuestion();
    },
    showReplyElement(id) {
      this.replyContent = "";
      if (this.currentReplyId === id) {
        this.currentReplyId = "";
        return;
      }
      this.currentReplyId = id;
    },
    submitReply(questionIndex, question) {
      let params = {
        courseId: question.courseId,
        chapterId: question.chapterId,
        subsectionId: question.subsectionId,
        replyId: question.id,
        content: this.replyText,
        groupId: question.groupId,
      };
      this.replyLoading = true;
      addStudyProblemExchanges(params).then((res) => {
        this.replyLoading = false;
        if (res.returnCode != "200") {
          this.$message.error("回复失败");
          return;
        }
        findReplies(question.groupId).then((res) => {
          if ("200" === res.returnCode) {
            this.questionList[questionIndex].replyList = res.returnData;
          }
        });
        this.$message.success("回复成功");
        this.replyText = "";
        this.currentReplyId = "";
      });
    },
    HandleSubmitReply(questionIndex, question) {
      let params = {
        courseId: question.courseId,
        chapterId: question.chapterId,
        subsectionId: question.subsectionId,
        replyId: question.id,
        content: this.replyContent,
        groupId: question.groupId,
      };
      this.replyLoading = true;
      addStudyProblemExchanges(params).then((res) => {
        this.replyLoading = false;
        if (res.returnCode != "200") {
          this.$message.error("回复失败");
          return;
        }
        findReplies(question.groupId).then((res) => {
          if ("200" === res.returnCode) {
            this.questionList[questionIndex].replyList = res.returnData;
          }
        });
        this.$message.success("回复成功");
        this.replyContent = "";
        this.currentReplyId = "";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.q-and-a {
  width: 982px;
  margin-top: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .content-card {
    border-radius: 1rem;
    background: #fff;
    margin-bottom: 1rem;
    padding: 0.1rem 1rem;
    .user-info {
      display: flex;
      align-items: center;
      .avatar {
        display: block;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        margin-right: 0.5rem;
      }
      .name {
        color: #005ce8;
        font-size: 14px;
        margin-right: 1.5rem;
      }
      .time {
        font-size: 14px;
        color: #999999;
      }
    }
    .qa-detail {
      padding: 0 4.5rem;
      .qa-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        p {
          font-size: 16px;
          color: #292929;
          margin-right: 1.5rem;
          max-width: 91%;
        }
        .reply {
          color: #005ce8;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            margin-right: 0.5rem;
          }
        }
      }
      .qa-item {
        font-size: 1.6rem;
        margin-top: 1.5rem;
        span {
          color: #005ce8;
        }
      }
    }
  }
}
.timeAndReply {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  .time {
    font-size: 1.4rem;
    color: #999999;
    margin-right: 0.5rem;
  }
  .reply {
    cursor: pointer;
    color: #999999;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    border-left: 0.1rem solid #c7c7c7;
    padding-left: 0.5rem;
    color: #6e9aee;
    span {
      margin-left: 0.5rem;
    }
  }
}
.replyContent {
  position: relative;
  height: 12rem;
  button {
    position: absolute;
    bottom: 1rem;
    right: 0rem;
  }
}
.pageInfo {
  font-size: 1.4rem;
  font-weight: 500;
  color: #292929;
  text-align: center;
  padding: 0.2rem 0 !important;
  height: 50px;
  line-height: 50px;
  p {
    cursor: pointer;
    height: 20px;
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
