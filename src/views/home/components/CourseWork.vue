<template>
  <div class="ques-feedback">
    <el-card class="box-card" v-if="editinfo">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="作业要求：">
          <span style="color: red">{{
            courseDetail.homeworkNeed ? courseDetail.homeworkNeed : "暂未设置"
          }}</span>
        </el-form-item>
        <el-form-item label="附件：">
          <div style="color: red">只能上传pdf, jpg, png文件, 且不超过 50M</div>
          <el-upload
            class="upload-demo"
            ref="upload"
            name="fileData"
            :data="submitData"
            :action="uploadUrl"
            :headers="upHeaders"
            :show-file-list="false"
            :on-progress="handleProgress"
            :before-upload="handleChange"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :limit="3"
            :accept="accept"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <!-- <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">开始上传</el-button> -->
          </el-upload>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="文件名称" prop="fileName">
            </el-table-column>
            <el-table-column label="文件大小(KB)" width="120" prop="fileSize">
            </el-table-column>
            <el-table-column width="180" label="上传进度" prop="progress">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="scope.row.progress"
                  status="success"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDownLoad(scope.row)"
                  >下载</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="handleRemove(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card" v-if="!editinfo">
      <div class="topmain">
        <el-button type="primary" size="mini" @click="editFun()"
          >修改</el-button
        >
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="作业要求：">
          <span style="color: red">{{
            courseDetail.homeworkNeed ? courseDetail.homeworkNeed : "暂未设置"
          }}</span>
        </el-form-item>
        <el-form-item label="附件：">
          <div style="color: red"></div>
          <!-- <el-upload
            class="upload-demo"
            ref="upload"
            name="fileData"
            :data="submitData"
            :action="uploadUrl"
            :headers="upHeaders"
            :auto-upload="false"
            :show-file-list="false"
            :on-progress="handleProgress"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :limit="3"
            :accept="accept"
            :on-exceed="handleExceed"
          >
          </el-upload> -->
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="文件名称" prop="fileName">
            </el-table-column>
            <el-table-column label="文件大小(KB)" width="120" prop="fileSize">
            </el-table-column>
            <el-table-column width="180" label="上传进度" prop="progress">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="scope.row.progress"
                  status="success"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDownLoad(scope.row)"
                  >下载</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="handleRemove(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addStudyNotesWork, findNotesList } from "@/api/learningCenter";
import editor from "./editor.vue";
import { getToken } from "../../../utils/auth";

export default {
  components: { editor },
  name: "trainingWork",
  props: {
    courseDetail: {
      type: Object,
    },
  },
  data() {
    return {
      editinfo: true,
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/img/upload",
      upHeaders: {
        "X-Token": getToken(),
      },
      accept: ".pdf,.jpg,.png,.PDF,.JPG,.PNG",
      submitData: {
        businessType: "5",
      },
      ruleForm: {
        courseId: this.courseDetail.id,
        fileIds: "",
        state: "5",
      },
      formRules: {
        courseId: [{ required: true, message: "请选择所属课程" }],
        fileIds: [{ required: true, message: "请上传附件" }],
      },
      tableData: [],
      fileList: [],
      fileIds: [],
    };
  },
  mounted() {
    console.log(this.courseDetail.id);
    // this.ruleForm.courseId = this.courseDetail.id
    this.getList();
  },
  methods: {
    editFun() {
      this.editinfo = true;
    },
    handleDownLoad(row) {
      this.$confirm("确认下载该附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const a = document.createElement("a");
        a.setAttribute("download", row.fileName);
        a.setAttribute("target", "_blank");
        a.setAttribute(
          "href",
          process.env.VUE_APP_BASE_API +
            "/file/downloadFile?fileUrl=" +
            row.filePath +
            "&fileName=" +
            row.fileName
        );
        a.click();
      });
    },
    handleRemove(row) {
      let fileId = row.id;
      this.fileList = this.fileList.filter(
        (item) => item.name !== row.fileName
      );
      this.tableData = this.tableData.filter((item) => item != row);
      this.fileIds = this.fileIds.filter((item) => item != fileId);
    },
    handleProgress(event, file, fileList) {},
    handleChange(file, fileList) {
      let fileSize = parseInt(file.size / 1024);
      let fileName = file.name;
      let type = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      ); //截取文件后缀名
      if (
        !(
          type === "pdf" ||
          type === "jpg" ||
          type === "png" ||
          type === "PDF" ||
          type === "JPG" ||
          type === "PNG"
        )
      ) {
        this.$message.error("格式错误，仅支持[ pdf,jpg,png]格式");
        return false;
      }
      if (fileSize > 50 * 1024) {
        this.$message.error("文件大小超过50MB，请重新上传");
        return false;
      }
      let addFlag = this.fileList.includes(file);
      if (!addFlag) {
        this.tableData.push({
          id: file.uid,
          fileName: fileName,
          fileSize: fileSize,
          progress: 0,
        });
      }
      return true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件`
      );
    },

    handleError(err, file, fileList) {
      return this.$message.error(err);
    },
    handleSuccess(res, file) {
      if (res.returnCode == "200") {
        this.fileList.push(file);
        this.fileIds.push(res.returnData[0].fileId);
        this.$message.success("上传成功！");
        this.tableData.filter((item) => {
          res.returnData.filter((elemet) => {
            if (item.id == file.uid && elemet.fileName == item.fileName) {
              item.progress = 100;
              item.filePath = elemet.filePath;
              item.id = elemet.fileId;
            }
          });
        });
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.fileIds = this.fileIds.join(",");
          addStudyNotesWork(this.ruleForm).then((res) => {
            if (res.returnCode == 200) {
              this.editinfo = false;
              this.$emit("refreshFun");
              return this.$message.success("提交成功");
            }
          });
        }
      });
    },
    getList() {
      findNotesList({
        pageNo: 1,
        pageSize: 10,
        courseId: this.ruleForm.courseId,
        state: "5",
      }).then((res) => {
        if (res.returnCode == "200" && res.returnData) {
          this.ruleForm = res.returnData;
          this.fileList = res.returnData.studyFiles.map((item) => ({
            url: item.filePath,
            name: item.fileName,
          }));
          this.tableData = res.returnData.studyFiles.map((item) => ({
            id: item.id,
            fileName: item.fileName,
            fileSize: parseInt(item.fileSize / 1024),
            progress: 100,
            filePath: item.filePath,
          }));
          this.fileIds = res.returnData.studyFiles.map((item) => item.id);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ques-feedback {
  height: 650px;
  // width: 984px;
  width: 70%;
  margin-top: 10px;

  .box-card {
    border-radius: 16px;
    min-height: 640px;
    width: 100%;
    font-size: 16px;
  }

  .clearfix {
    font-size: 16px;
  }
}

.demo-table-expand {
  font-size: 0;
}

.topmain {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
