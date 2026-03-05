<template>
  <div>
    <div class="uploader_wrap" style="marginbottom: 10px">
      <div class="fileVideo">
        <div class="fileVideo_left_content">
          <!-- office文件及pdf预览 -->
          <iframe
            id="ifr_con"
            v-if="officeVisable"
            :style="'width:' + ifrWidth + ';height:' + ifrHeight"
            :src="yunViewUrlStr"
            frameborder="1"
          ></iframe>
          <!-- 图片文件预览 -->
          <el-image
            v-if="imageVisable"
            :src="yunViewUrlStr"
            :style="'width:' + ifrWidth + ';height:' + ifrHeight"
          ></el-image>
          <!-- 视频文件预览 -->
          <video
            class="video-player vjs-custom-skin"
            style="width: 320px; height: 180px"
            ref="videoPlayer"
            v-if="videoVisable"
            :src="playerOptions.sources[0].src"
            :autoplay="false"
            preload="auto"
            controls
            controlslist="nodownload noremoteplayback"
            disableRemotePlayback="true"
            x5-video-player-type="h5"
          ></video>
          <div
            class="nodata flex_R_C"
            :style="'width:' + ifrWidth + ';height:' + ifrHeight"
            v-show="otherVisable"
          >
            <p class="bg_text">请开始上传文件</p>
          </div>
        </div>
      </div>

      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :headers="headers"
        :data="uploadData"
        :on-change="handleFileChange"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :on-progress="handleFileProgress"
        :before-upload="beforeUpload"
        :show-file-list="false"
        :auto-upload="true"
      >
        <el-button
          style="marginleft: 10px"
          size="small"
          type="primary"
        >上传培训资料</el-button>
      </el-upload>
    </div>

    <!-- 上传列表 -->
    <div v-if="uploadList.length > 0" class="upload-list">
      <el-table
        size="mini"
        :data="uploadList"
        header-cell-class-name="tabble_header"
      >
        <el-table-column
          prop="name"
          align="center"
          label="文件名"
        ></el-table-column>
        <el-table-column lang="center" align="center" label="文件大小">
          <template slot-scope="scope">
            <span>{{ scope.row.size | computeSize }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="进度">
          <template slot-scope="scope">
            <el-progress
              :percentage="scope.row.percentage"
            ></el-progress>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'error'" style="color: #f56c6c"
              >上传失败</span
            >
            <span v-else-if="scope.row.status === 'success'" style="color: #67c23a"
              >上传成功</span
            >
            <span v-else style="color: #409eff">上传中</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import fileVideo from "@/components/fileVideo/index.vue";
import { ACCEPT_CONFIG, UPLOAD_TYPE } from "@/utils/uploadConfig";
import { mergeFile, getFileByFileId } from "@/api/train";
import { getToken } from "@/utils/auth";

export default {
  props: ["fileId"],
  watch: {
    fileId(a, b) {
      console.log(a, 2333);
      if (a) {
        getFileByFileId(this.fileId).then((res) => {
          if (res.returnCode == 200) {
            this.fileType = res.returnData.fileType;
            this.fileUrl = res.returnData.filePath;
            this.showVideo();
          }
        });
      } else {
        this.fileType = "";
        this.fileUrl = "";
        (this.yunViewUrlStr = ""),
          (this.officeVisable = false),
          (this.imageVisable = false),
          (this.videoVisable = false),
          (this.otherVisable = false),
          this.showVideo();
      }
    },
  },
  components: { fileVideo },
  filters: {
    computeSize(size) {
      let sizeLable = "";
      if (size > 1024 * 1024 * 1024) {
        sizeLable = (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
      } else if (size > 1024 * 1024) {
        sizeLable = (size / 1024 / 1024).toFixed(2) + "MB";
      } else {
        sizeLable = (size / 1024).toFixed(2) + "KB";
      }
      return sizeLable;
    }
  },
  data() {
    return {
      fileData: {},
      ifrWidth: "320px",
      ifrHeight: "180px",
      uploadUrl: this.$process.VUE_APP_BASE_API + "/uploader/mergeFile", // 普通上传接口
      headers: {
        "x-token": getToken(),
      },
      uploadData: {
        refProjectId: ""
      },
      uploadList: [],
      fileType: "",
      yunViewUrlStr: "",
      officeVisable: false,
      imageVisable: false,
      videoVisable: false,
      otherVisable: false,
      playerOptions: {
        playbackRates: [],
        autoplay: false,
        muted: false,
        loop: false,
        preload: "auto",
        language: "zh-CN",
        aspectRatio: "16:9",
        fluid: false,
        sources: [
          {
            type: "video/mp4",
            src: "",
          },
        ],
        poster: "",
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
        },
      },
    };
  },

  methods: {
    // 文件选择
    handleFileChange(file, fileList) {
      console.log("文件选择:", file);
      
      let type = file.name.split(".").pop();
      if (!UPLOAD_TYPE.getAll().includes(type)) {
        this.$message({
          message: "文件类型不支持",
          type: "error",
        });
        this.$refs.upload.clearFiles();
        return false;
      }

      // 添加到上传列表
      this.uploadList = [{
        name: file.name,
        size: file.size,
        percentage: 0,
        status: 'uploading'
      }];
    },

    // 上传进度
    handleFileProgress(event, file, fileList) {
      console.log("上传进度:", event.percent);
      if (this.uploadList.length > 0) {
        this.uploadList[0].percentage = Math.floor(event.percent);
      }
    },

    // 上传成功
    handleFileSuccess(response, file, fileList) {
      console.log("上传成功:", response);
      
      if (response.returnCode == 200) {
        this.uploadList[0].status = 'success';
        this.uploadList[0].percentage = 100;
        
        this.$emit("sendVideo", response.returnData);
        this.fileType = response.returnData.fileName.split(".").pop();
        this.fileUrl = response.returnData.fileViewPath;
        this.showVideo();
        
        // 2秒后清空上传列表
        setTimeout(() => {
          this.uploadList = [];
        }, 2000);
      } else {
        this.uploadList[0].status = 'error';
        this.$message({
          message: "上传失败",
          type: "error",
        });
      }
    },

    // 上传失败
    handleFileError(err, file, fileList) {
      console.log("上传失败:", err);
      this.uploadList[0].status = 'error';
      this.$message({
        message: "上传失败",
        type: "error",
      });
    },

    // 上传前校验
    beforeUpload(file) {
      console.log("上传前校验:", file);
      
      // 文件大小限制2G
      const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
      if (!isLt2G) {
        this.$message({
          message: "文件大小不能超过2G",
          type: "error",
        });
        return false;
      }

      // 文件类型校验
      let type = file.name.split(".").pop();
      if (!UPLOAD_TYPE.getAll().includes(type)) {
        this.$message({
          message: "文件类型不支持",
          type: "error",
        });
        return false;
      }

      return true;
    },

    // 显示预览
    showVideo() {
      switch (this.fileType) {
        case "doc":
        case "DOC":
        case "docx":
        case "DOCX":
        case "pdf":
        case "PDF":
        case "ppt":
        case "PPT":
        case "pptx":
        case "PPTX":
        case "xls":
        case "XLS":
        case "xlsx":
        case "XLSX":
        case "pptx":
        case "PPTX":
          this.ifrWidth = "90%";
          this.ifrHeight = "90%";
          this.officeVisable = true;
          this.imageVisable = false;
          this.videoVisable = false;
          this.otherVisable = false;
          this.fileUrl = this.fileData.viewUrl;
          this.yunViewUrlStr = this.fileUrl;
          break;
        case "jpg":
        case "JPG":
        case "png":
        case "PNG":
        case "jpeg":
        case "JPEG":
        case "bmp":
        case "BMP":
        case "webp":
        case "WEBP":
          this.yunViewUrlStr = this.fileUrl;
          this.officeVisable = false;
          this.imageVisable = true;
          this.videoVisable = false;
          this.otherVisable = false;
          break;
        case "mp4":
        case "MP4":
        case "mp3":
        case "MP3":
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = true;
          this.otherVisable = false;
          this.playerOptions.sources[0].src = this.fileUrl;
          this.yunViewUrlStr = this.fileUrl;
          break;
        default:
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = false;
          this.otherVisable = true;
      }
    },
  },
  mounted() {
    if (this.fileId) {
      getFileByFileId(this.fileId).then((res) => {
        if (res.returnCode == 200) {
          this.fileData = res.returnData;
          this.fileType = res.returnData.fileType;
          this.fileUrl = res.returnData.filePath;
          this.showVideo();
        }
      });
    } else {
      this.fileType = "";
      this.fileUrl = "";
      (this.yunViewUrlStr = ""),
        (this.officeVisable = false),
        (this.imageVisable = false),
        (this.videoVisable = false),
        (this.otherVisable = false),
        this.showVideo();
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .tabble_header {
  text-align: center;
  color: #121111;
  background-color: #f5f5f5;
}

::v-deep .el-table {
  .tabble_header {
    line-height: 0;
  }
}

.uploader_wrap {
  display: flex;
  align-items: flex-end;

  .fileVideo {
    .nodata {
      font-size: 24px;
      background-color: #eef0f7;
      color: #ccc;
    }
  }
}

.upload-list {
  margin-top: 10px;
}
</style>