<template>
  <div class="right">
    <div class="tabOne">
      <h3>学员榜TOP10</h3>
      <span>共{{ totalNum }}人</span>
    </div>
    <div v-if="!topData || topData.length == 0">
      <el-empty :image-size="200"></el-empty>
    </div>
    <div class="tabTwo" v-for="(item, index) in topData" :key="index">
      <p class="name">
        <span>
          <img
            v-if="index === 0"
            src="@/assets/images/learningCenter/one.png"
            alt=""
          />
          <img
            v-else-if="index === 1"
            src="@/assets/images/learningCenter/two.png"
            alt=""
          />
          <img
            v-else-if="index === 2"
            src="@/assets/images/learningCenter/three.png"
            alt=""
          />
          <span class="yuan" v-else>{{ index + 1 }}</span>
        </span>
        <span>{{ item.userName }}</span>
      </p>
      <p class="school">{{ item.schoolName }}</p>
      <p class="learnTime">{{ item.totalTime }}分钟</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topData: {
      type: [Array],
    },
    totalNum: {
      type: [Number],
    },
  },
};
</script>

<style  lang='scss' scoped>
.right {
  flex: 1;
  // padding-left: 94px;
  // margin-left: 40px;
  max-height: 420px; // 或者你想要的固定高度
  overflow-y: auto; // 垂直方向超出时显示滚动条

  .tabOne {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-bottom: 22px;
    padding-bottom: 10px;
    // margin-bottom: 15px;
    h3 {
      // font-size: 24px;
      font-size: 18px;
    }
    span {
      font-size: 14px;
      font-weight: 500;
      color: #8f8f8f;
    }
  }

  .tabTwo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid #f0f0f0;

    .name {
      display: flex;
      align-items: center;
      width: 80px;

      .yuan {
        display: inline-block;
        width: 17px;
        height: 17px;
        background: #638eff;
        text-align: center;
        line-height: 17px;
        border-radius: 50%;
        margin: 0 4px 0 4px;
      }
    }
    .school {
      color: #8f8f8f;
      width: auto;
      padding-left: 10px;
    }
    .learnTime {
      width: 100px;
      color: #8f8f8f;
      text-align: right;
    }
  }
}
</style>