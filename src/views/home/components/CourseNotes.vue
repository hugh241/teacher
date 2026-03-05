<template>
  <div class="CourseNotes">
    <div class="course-notes">
      <div v-if="noteTotal == 0" class="defaultContent">
        <img src="../../../assets/images/learningCenter/wushuju.png" alt="" />
        <p>暂无笔记</p>
      </div>
      <div class="" v-else>
        <el-card
          class="notes-card"
          v-for="(note, index) in noteList"
          :key="index"
          shadow="hover"
          style="border: none"
        >
          <div class="user-info">
            <img class="avatar" :src="note.userHeaderImg" alt="" />
            <div class="name">{{ note.userName }}</div>
            <div class="time">{{ note.createTime }}</div>
          </div>
          <div class="notes-content">
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

        <div class="notes-card pageInfo">
          <p v-if="noteList.length < noteTotal" @click="loadMore">加载更多</p>
          <p v-if="noteList.length == noteTotal">没有更多内容了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findNotes } from "@/api/learningCenter";
export default {
  name: "CourseNotes",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        courseId: this.courseDetail.id,
      },
      noteList: [],
      noteTotal: 0,
    };
  },
  mounted() {
    this.loadNote();
  },
  methods: {
    loadNote() {
      findNotes(this.pageInfo).then((res) => {
        if ("200" == res.returnCode) {
          this.noteTotal = res.returnCount == null ? 0 : res.returnCount;
          let notes = res.returnData == null ? null : res.returnData;
          if (notes != null && notes.length > 0) {
            notes.forEach((element) => {
              if (element.fileIds) {
                let fileList = element.fileIds.split(",");
                element.fileList = fileList.map((item) => this.BASEURL + item);
              }
              element.userHeaderImg = require("../../../assets/images/learningCenter/headPictrue.png");
            });
            this.noteList = [...this.noteList, ...notes];
          }
        }
      });
    },
    loadMore() {
      this.pageInfo.pageNo = this.pageInfo.pageNo + 1;
      this.loadNote();
    },
  },
};
</script>

<style lang='scss' scoped>
.CourseNotes {
  width: 984px;
  margin: 0 auto;
}
.course-notes {
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  margin-top: 10px;
  .notes-card {
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
    .notes-content {
      padding: 0 4.5rem;
      margin-top: 1rem;
      p {
        font-size: 16px;
        color: #292929;
      }
      img {
        width: 21.7rem;
        height: 12.7rem;
        margin: 1rem;
      }
    }
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