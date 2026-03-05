<template>
  <div class="biao">
    <div v-if="!chapters || chapters.length == 0">
      <el-empty :image-size="200"></el-empty>
    </div>
    <div
      class="left"
      v-for="(chapter, chapterIndex) in chapters"
      :key="chapterIndex"
    >
      <h4>{{ chapter.chapterName }}</h4>
      <p class="contIntro">{{ chapter.chapterIntroduce }}</p>
      <div class="stuBg">
        <img
          v-if="chapter.state == 0"
          src="@/assets/images/learningCenter/xuexizhong.png"
          alt=""
        />
        <img
          v-if="chapter.state == 1"
          src="@/assets/images/learningCenter/wanchen.png"
          alt=""
        />
      </div>

      <!-- 小节课程 -->
      <div class="bar">
        <div
          class="bg"
          v-for="(subsection, subsectionIndex) in chapter.studySubsections"
          :key="subsectionIndex"
          @mouseover="currentSubsectionId = subsection.id"
          @mouseleave="currentSubsectionId = ''"
          @click="studySubsection(subsection)"
        >
          <img src="@/assets/images/learningCenter/book.png" alt="" />
          <p class="subjuct">
            {{ chapterIndex + 1 }}-{{ subsectionIndex + 1 }}
            {{ subsection.subsectionName }}（{{ subsection.videoTime }}）
          </p>
          <p
            v-if="subsection.state === '2'"
            class="type"
            style="color: #4d94ff"
          >
            •已学习
          </p>
          <p
            v-if="subsection.state === '1'"
            class="type"
            style="color: #37c864"
          >
            •学习中
          </p>
          <p
            v-if="subsection.state === '0'"
            class="type"
            style="color: #ff4b4b"
          >
            •未学习
          </p>
          <span
            class="bo"
            v-if="
              currentSubsectionId == subsection.id && subsection.state != '2'
            "
            ><img src="@/assets/images/learningCenter/bo.png" alt=""
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapters:{
      type: [Array]
    }
  },
  data() {
    return {
      currentSubsectionId: "",
    };
  },
  methods: {
    //点击播放视频
    studySubsection(subsection) {
      if (subsection && subsection.studyFiles && subsection.studyFiles.fileType == 'mp4'){
        this.$router.push({
          path: `/learningCourse?subsectionId=${subsection.id}`
        })
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.biao {
  width: 984px;
  display: flex;
  flex-direction: column;
  .wu {
    width: 984px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .left {
    padding-bottom: 40px;
    width: 984px;
    position: relative;
    h4 {
      font-size: 20px;
      font-weight: 500;
      color: #005ce8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .contIntro {
      width: 886px;
      padding: 12px 0px 19px 0px;
      font-size: 14px;
      font-weight: 400;
      color: #807f7f;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .stuBg {
      position: absolute;
      right: 0;
      top: 0;
      width: 78px;
      height: 63px;
      border: 1px dashed #c2c2c2;

      img {
        width: 100%;
      }
    }
    .bar {
      .bg {
        display: flex;
        align-items: center;
        width: 984px;
        height: 44px;
        img {
          width: 22px;
          height: 25px;
        }
        .subjuct {
          width: 500px;
          padding-left: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .type {
          padding-left: 175px;
        }
        .bo {
          padding-left: 157px;
          width: 20px;
          height: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .bg:hover {
        background: #f4f4f4;
        cursor: pointer;
      }
    }
  }
}
</style>