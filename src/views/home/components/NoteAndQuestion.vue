<template>
  <el-tabs v-model="currentTab" @tab-click="changeTab">
    <el-tab-pane v-if="showNoteFlag == 0" label="笔记" name="notes">
      <div class="defaultContent" v-if="noteTotal === 0">
        <img src="../../../assets/images/learningCenter/wushuju.png" alt />
        <p>暂无笔记</p>
      </div>
      <div v-else>
        <el-card
          class="notecard"
          v-for="(note, index) in noteList"
          :key="index"
          shadow="false"
          dis-hover
        >
          <div class="userInfo">
            <img class="headPhoto" :src="note.userHeaderImg" alt="头像" />
            <span class="userInfoFont">{{ note.userName }}</span>
            <span class="replyTime">{{ note.createTime }}</span>
          </div>
          <div class="noteContent">
            <p>{{ note.content }}</p>
            <viewer :images="note.fileList">
              <img
                style="cursor: pointer"
                v-for="(src, index) in note.fileList"
                :src="src"
                :key="index"
              />
            </viewer>
          </div>
        </el-card>
        <div class="pageContent" dis-hover>
          <p
            v-if="noteList != null && noteList.length < noteTotal"
            @click="loadMoreNote"
          >
            加载更多
          </p>
          <p v-if="noteList != null && noteList.length === noteTotal">
            没有更多内容了
          </p>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="showAnswerFlag == 0"  label="问答" name="question">
      <div class="defaultContent" v-if="questionTotal === 0">
        <img src="../../../assets/images/learningCenter/wushuju.png" alt />
        <p>暂无问答</p>
      </div>
      <div v-else>
        <el-card
          class="quescard"
          v-for="(question, questionIndex) in questionList"
          :key="questionIndex"
          shadow="false"
          dis-hover
        >
          <div class="userInfo">
            <img class="headPhoto" :src="question.userHeaderImg" alt="头像" />
            <span class="userInfoFont">{{ question.userName }}</span>
            <span class="replyTime">{{ question.createTime }}</span>
          </div>
          <div class="quesdetil">
            <div class="questionCont">
              <p class="question">{{ question.content }}</p>
              <div
                class="reply"
                @click="showReplyElement(question.id)"
                v-if="question.userId != userInfo.userId"
              >
                <img
                  src="../../../assets/images/learningCenter/icon-huifu.svg"
                  alt
                />
                <span>回复</span>
              </div>
            </div>
            <div
              class="replyContent"
              v-if="
                currentReplyId === question.id && question.replyList == null
              "
            >
              <el-input
                v-model="replyText"
                :maxlength="200"
                type="textarea"
                :rows="3"
                :placeholder="`回复 ${question.userName}`"
              ></el-input>
              <el-button
                type="primary"
                @click="submitReply(questionIndex, question)"
                :loading="replyLoading"
                >发送</el-button
              >
            </div>

            <div
              class="replyInfo"
              v-for="(reply, replyIndex) in question.replyList"
              :key="replyIndex"
            >
              <span>{{ reply.userName }}</span> 回复<span>
                {{ reply.replyUserName }}</span
              >
              : {{ reply.content }}
              <div class="timeAndReply">
                <div class="time">{{ reply.createTime }}</div>
                <div
                  class="reply"
                  @click="showReplyElement(reply.id)"
                  v-if="question.userId != userInfo.userId"
                >
                  <img
                    src="../../../assets/images/learningCenter/icon-huifu.svg"
                    alt
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
                  @click="handleSubmitReply(questionIndex, reply)"
                  :loading="replyLoading"
                  >发送</el-button
                >
              </div>
            </div>
          </div>
        </el-card>
        <div class="pageContent">
          <p
            v-if="questionList != null && questionList.length < questionTotal"
            @click="loadMoreQuestion"
          >
            加载更多
          </p>
          <p
            v-if="questionList != null && questionList.length === questionTotal"
          >
            没有更多内容了
          </p>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="学习资料" name="material" v-if="$process.VUE_APP_IS_OUTSIDE">
      <div class="defaultContent" v-if="materialList?.length == 0">
        <img src="../../../assets/images/learningCenter/wushuju.png" alt />
        <p>暂无学习资料</p>
      </div>
      <div class="material" v-else>
        <div class="list" v-for="(item, index) in materialList" :key="index">
          <div class="name">{{ index + 1 }}、{{ item.fileName }}.{{ item.fileType }}----{{ item.fileSize }}</div>
          <div class="btn">
            <el-button
              type="text"
              @click="handleDown(item.fileName, item.filePath)"
              >下载</el-button
            >
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  findNotes,
  findStudyProblemExchanges,
  addStudyProblemExchanges,
  findReplies,
  getSstudyFiles,
} from "@/api/learningCenter";
import { getUserInfo } from "@/utils/auth";
export default {
  name: "NoteAndQuestion",
  props: {
    sumbitOperate: {
      type: [String],
    },
    courseId: {
      type: [String],
    },
    subsectionId: {
      type: [String],
    },
      showAnswerFlag: {
      type: [String, Number],
      default: "0"
    },
    showNoteFlag: {
      type: [String, Number],
      default: "0"
    }
  },
  data() {
    return {
      currentTab: "notes",
      BASEURL: process.env.VUE_APP_VIEW_URL,
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/img/upload",
      noteList: [],
      questionList: [],
      currentReplyId: "",
      replyContent: "",
      replyText: "",
      notesPageInfo: {
        pageNo: 1,
        pageSize: 10,
        courseId: this.courseId,
        subsectionId: this.subsectionId,
      },
      questionPageInfo: {
        pageNo: 1,
        pageSize: 10,
        courseId: this.courseId,
        subsectionId: this.subsectionId,
      },
      noteTotal: 0,
      questionTotal: 0,
      replyLoading: false,
      userInfo: {},
      materialList: [],
    };
  },
  watch: {
    courseId(val) {
      if (val) {
        this.notesPageInfo.courseId = val;
        this.questionPageInfo.courseId = val;
        this.loadNotes(true);
        this.loadQuestion(true);
      }
    },
    subsectionId(val) {
      if (val) {
        this.notesPageInfo.subsectionId = val;
        this.questionPageInfo.subsectionId = val;
        this.loadNotes(true);
        this.loadQuestion(true);
        this.getSstudyFiles();
      }
    },
    sumbitOperate(val) {
      if (!val) {
        return;
      }
      if (val.includes("submitNote")) {
        this.currentTab = "notes";
        this.loadNotes(true);
      }
      if (val.includes("submitQuestion")) {
        this.currentTab = "question";
        this.loadQuestion(true);
      }
    },
    deep: true,
  },
  mounted() {
    this.loadNotes(true);
    this.userInfo = getUserInfo();
  },
  methods: {
    // 学习资料功能
    async getSstudyFiles() {
      var res = await getSstudyFiles(this.subsectionId);
      if (res.returnCode == 200) {
        this.materialList = res.returnData;
      }
    },
    //点击下载
    handleDown(name, url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    changeTab(name) {
      if (
        name == "notes" &&
        this.noteList != null &&
        this.noteList.length == 0
      ) {
        this.loadNotes();
      }
      if (
        name == "question" &&
        this.questionList != null &&
        this.questionList.length == 0
      ) {
        this.loadQuestion();
      }
    },
    loadNotes(reload) {
      if (reload === true) {
        this.notesPageInfo.pageNo = 1;
      }
      findNotes(this.notesPageInfo).then((res) => {
        if ("200" == res.returnCode) {
          this.noteTotal = res.returnCount == null ? 0 : res.returnCount;
          let notes = res.returnData == null ? null : res.returnData;
          if (notes != null && notes.length > 0) {
            notes.filter((element) => {
              if (element.fileIds) {
                let fileList = element.fileIds.split(",");
                // element.fileList = fileList.map((item) => this.BASEURL + item);
                element.fileList = fileList.map((item) => this.BASEURL + item);
              }
              element.userHeaderImg = require("../../../assets/images/learningCenter/headPictrue.png");
            });
          }
          if (reload === true) {
            this.noteList = notes;
          } else {
            this.noteList = [...this.noteList, ...notes];
          }
        }
      });
    },
    loadMoreNote() {
      this.notesPageInfo.pageNo = this.notesPageInfo.pageNo + 1;
      this.loadNotes();
    },
    loadQuestion(reload) {
      if (reload === true) {
        this.questionPageInfo.pageNo = 1;
        // this.notesPageInfo.courseId = "686c57bf38a342cb94a972cbc0642ead";
        // this.notesPageInfo.subsectionId = "343fb3bce1204f4699d6baeb05b766b5";
      }
      findStudyProblemExchanges(this.questionPageInfo).then((res) => {
        if ("200" == res.returnCode) {
          this.questionTotal = res.returnCount != null ? res.returnCount : 0;
          let questions = res.returnData;
          if (questions != null) {
            questions.forEach((item) => {
              item.userHeaderImg = require("../../../assets/images/learningCenter/headPictrue.png");
            });
          }
          if (reload === true) {
            this.questionList = questions;
          } else {
            this.questionList = [...this.questionList, ...questions];
          }
        }
      });
    },
    loadMoreQuestion() {
      this.questionPageInfo.pageNo = this.questionPageInfo.pageNo + 1;
      this.loadQuestion();
    },
    showReplyElement(replyId) {
      this.replyContent = "";
      if (this.currentReplyId === replyId) {
        this.currentReplyId = "";
        return;
      }
      this.currentReplyId = replyId;
    },
    submitReply(questionIndex, question) {
      let params = {
        courseId: question.courseId,
        chapterId: question.chapterId,
        subsectionId: question.id,
        replyId: question.id,
        content: this.replyText,
        groupId: question.groupId,
      };
      this.replyLoading = true;
      addStudyProblemExchanges(params).then((res) => {
        this.replyLoading = false;
        if (res.returnCode != "200") {
          return;
        }
        this.$message.success("回复成功");
        this.currentReplyId = "";
        this.replyText = "";
        findReplies(question.groupId).then((res) => {
          if ("200" == res.returnCode) {
            this.questionList[questionIndex].replyList = res.returnData;
          }
        });
      });
    },
    handleSubmitReply(questionIndex, question) {
      let params = {
        courseId: question.courseId,
        chapterId: question.chapterId,
        subsectionId: question.id,
        replyId: question.id,
        content: this.replyContent,
        groupId: question.groupId,
      };
      this.replyLoading = true;
      addStudyProblemExchanges(params).then((res) => {
        this.replyLoading = false;
        if (res.returnCode != "200") {
          return;
        }
        this.$message.success("回复成功");
        this.currentReplyId = "";
        this.replyContent = "";
        findReplies(question.groupId).then((res) => {
          if ("200" == res.returnCode) {
            this.questionList[questionIndex].replyList = res.returnData;
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.notecard,
.quescard {
  padding: 10px;
  margin-bottom: 16px;
}

.material {
  padding: 30px 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;

    .name {
      width: 50%;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 隐藏超出内容 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
    }
    .con {
      width: 20%;
    }
    .btn {
      width: 30%;
      text-align: center;
    }
  }
}

.userInfo {
  display: flex;
  align-items: center;

  .headPhoto {
    width: 61px;
    height: 61px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.userInfoFont {
  font-size: 16px;
  font-weight: 400;
  color: #005ce8;
  margin-left: 8px;
}

.noteContent {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #292929;
  padding: 8px;

  img {
    margin: 8px 8px 0 0;
    width: 96px;
    height: 64px;
  }
}

.quesdetil {
  padding: 0 32px;
}

.questionCont {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #292929;
  display: flex;

  .question {
    margin-right: 20px;
    max-width: 91%;
  }

  .reply {
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;

    img {
      margin-right: 8px;
    }
  }
}

.replyTime {
  font-size: 16px;
  font-weight: 400;
  color: #999999;
  margin-left: 16px;
}

.replyOperate {
  height: 10px;
  line-height: 10px;
  font-size: 16px;
  font-weight: 400;
  color: #999999;
  cursor: pointer;
}

.timeAndReply {
  display: flex;
  align-items: center;
  margin-top: 8px;

  .time {
    font-size: 16px;
    color: #999999;
    margin-right: 8px;
  }

  .reply {
    cursor: pointer;
    color: #999999;
    font-size: 16px;
    display: flex;
    align-items: center;
    border-left: 1px solid #c7c7c7;
    padding-left: 10px;

    span {
      margin-left: 8px;
      color: #999999;
    }
  }
}

.replyInfo {
  font-size: 1.6rem;
  margin-top: 1.5rem;

  span {
    color: #005ce8;
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

.pageContent {
  height: 4.5rem;
  line-height: 4.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: #292929;
  text-align: center;
  background: #fff;
  border-radius: 1rem;

  p {
    cursor: pointer;
  }
}

.defaultContent {
  height: 40rem;
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
