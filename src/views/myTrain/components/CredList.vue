<template>
  <!-- 证书列表 -->
  <div>
    <!-- <div v-if="!honorList || honorList.length == 0">
      <el-empty :image-size="200"></el-empty>
    </div> -->
    <div class="credList">
      <!-- <div
        class="list-item"
        v-for="(item, index) in honorList"
        :key="index"
        @mouseover.stop="showDownloadButton(index)"
        @mouseleave.stop="hideDownloadButton(index)"
      > -->
      <div
        class="list-item"
      >
<!--        <div class="credBg">-->
<!--          &lt;!&ndash; 课程图 &ndash;&gt;-->
<!--          <img src="@/assets/img/base/zhengshu.png" alt="" />-->

<!--          &lt;!&ndash; 半透明遮罩层和下载按钮 &ndash;&gt;-->
<!--          <div class="overlay" v-if="showDownload[index] == true">-->
<!--            &lt;!&ndash; <el-button type="primary" size="medium" @click="getHonorSelf(item)">重新生成证书</el-button> &ndash;&gt;-->
<!--            <button class="download-btn" @click="downloadCred(item.pdf_url)">-->
<!--              下载证书-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["honorList"],
  data() {
    return {
      // 控制下载按钮的显示状态
      showDownload: {},
    };
  },
  created() {},
  methods: {
    //鼠标移入移出显示隐藏
    showDownloadButton(index) {
      this.showDownload = { ...this.showDownload, [index]: true };
    },
    hideDownloadButton(index) {
      this.showDownload = { ...this.showDownload, [index]: false };
    },
    //证书下载
    downloadCred(url) {
      // 创建一个隐藏的<a>标签
        window.open(url, '_blank');
      // const link = document.createElement("a");
      // link.style.display = "none";
      // link.href = url;
      // link.download = "证书.pdf";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // this.$message({
      //   message: '证书下载成功',
      //   type: 'success'
      // })
    },
    getHonorSelf(item){
      // console.log('刷新证书',item);
      this.$emit('getHonorSelf',item)
    }
  },
};
</script>

<style lang="scss" scoped>
.credList {
  margin: 0 auto;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;

  .list-item:hover {
    cursor: pointer;
  }
  .list-item:nth-child(4n) {
    margin-right: 0;
  }

  .list-item {
    position: relative;
    background: linear-gradient(180deg, #eff5ff 0%, #ffffff 100%);
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border: 1px solid rgba(191, 217, 255, 0.25);
    width: 306px;
    height: 215px;
    margin-bottom: 21px;
    margin-right: 10px;
    .credBg {
      width: 100%;
      height: 215px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .download-btn {
    width: 129px;
    height: 42px;
    background: rgba(255, 255, 255, 0);
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid #ffffff;
    cursor: pointer;
    color: #ffffff;
    transition: opacity 0.3s;
    margin-top: 20px;
  }
}
</style>
