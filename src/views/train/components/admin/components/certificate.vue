<!-- 基本信息管理 -->
<template>
  <div>
    <div class="setInfo">
      <div v-if="!editTag">
        <div class="setInfo_header">
          <span>证书信息</span>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editTag = true"
            >修改</el-button
          >
        </div>
        <div class="setInfo_body">
          <el-descriptions
            direction="horizontal"
            :column="3"
            border
            :contentStyle="CS"
            :label-style="LS"
          >
            <el-descriptions-item label="是否颁发证书">{{
              detailInfo.isCertificate == "0" ? "否" : "是"
            }}</el-descriptions-item>
            <el-descriptions-item label="获得证书最低学分">{{
              detailInfo.certificateScore
            }}</el-descriptions-item>
            <el-descriptions-item label="总分">{{
              detailInfo.totalScore
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <setCertificate
        style="padding-top: 70px"
        v-if="editTag"
        :editTag="editTag"
        :courseId="courseId"
        :detailInfo="detailInfo"
        @returnData="returnData"
      />
    </div>
    <div class="zhen" v-if="!editTag && $process.VUE_APP_IS_TEMPLATE == '1'">
      <div class="head">
        <div class="left">证书模板</div>
        <div class="right">
          <el-button type="primary" @click="handleCreat">新建模板</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column
          prop="template_name"
          label="模板名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="diy_type" label="模板类别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.diy_type == '1'">部分字段</span>
            <span v-else>全部字段</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.id == certificateId"
              >启用中</el-tag
            >
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_name"
          label="创建者名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color: #67c23a"
              @click="updateStudyCourse(scope.row)"
              >启用</el-button
            >
            <el-button type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="deleteCertificateTemplate(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          layout="prev, pager, next"
          :current-page="1"
          :total="total"
          @current-change="handleCurrenChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="模板名称:" prop="templateName">
              <el-input
                v-model="formData.templateName"
                placeholder="请输入模板名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="模板类别:" prop="diyType">
              <el-radio-group v-model="formData.diyType">
                <el-radio label="1">部分字段</el-radio>
                <el-radio label="2">全部内容</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="22" v-if="formData.diyType == '2'">
            <el-form-item label="全部内容:" prop="templateDesc">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                :rows="5"
                v-model="formData.templateDesc"
                maxlength="150"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="formData.diyType == '1'">
            <el-form-item label="开始日期:" prop="beginTime">
              <el-date-picker
                v-model="formData.beginTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="formData.diyType == '1'">
            <el-form-item label="结束日期:" prop="endTime">
              <el-date-picker
                v-model="formData.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22" v-if="formData.diyType == '1'">
            <el-form-item label="颁发单位名称:" prop="issueOrgan">
              <el-input
                placeholder="请输入颁发单位名称"
                v-model="formData.issueOrgan"
                maxlength="30"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="formData.diyType == '1'">
            <el-form-item label="学分:" prop="score">
              <el-input
                v-model="formData.score"
                placeholder="学分"
                maxlength="3"
                v-number-only
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="formData.diyType == '1'">
            <el-form-item label="颁发时间:" prop="issueTime">
              <el-date-picker
                v-model="formData.issueTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="颁发时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleEnter"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateStudyCourse } from "@/api/train";
import {
  getCourseDetails,
  getCertificateTemplateList,
  addOrUpdateCertificateTemplate,
  getCertificateTemplate,
  deleteCertificateTemplate,
} from "@/api/admin.js";
import numberOnly from "@/utils/numberOnly";
export default {
  directives: {
    numberOnly,
  },
  props: {
    courseId: {
      type: String,
      default: "",
    },
  },
  components: {
    setCertificate: () =>
      import("@/views/train/components/publish/components/setCertificate.vue"),
  },
  data() {
    return {
      btnLoading: false,
      dialogVisible: false,
      title: "新建模板",
      editTag: false, //修改开关
      detailInfo: {},
      CS: {
        "text-align": "left", //文本居中
        "min-width": "250px", //最小宽度
        "word-break": "break-all", //过长时自动换行
        "border-color": "#DFDFDF",
        color: "#000",
      },
      CSimg: {
        "text-align": "left", //文本居中
        width: "250px", //最小宽度
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        width: "180px",
        "word-break": "keep-all",
        "border-color": "#DFDFDF",
      },
      tableData: [{}],
      formData: {
        courseId: "",
        courseName: "",
        templateName: "",
        diyType: "1",
        templateDesc: "",
        beginTime: "",
        endTime: "",
        score: "",
        issueOrgan: "",
        issueTime: "",
      },
      params: {
        templateName: "",
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      certificateId: "",
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blue" },
        ],
        diyType: [
          { required: true, message: "请选择模板类别", trigger: "change" },
        ],
        templateDesc: [
          { required: true, message: "请输入模板内容", trigger: "blue" },
        ],
        beginTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        score: [{ required: true, message: "请输入分值", trigger: "blue" }],
        issueOrgan: [
          { required: true, message: "请输入颁发单位", trigger: "blue" },
        ],
        issueTime: [
          { required: true, message: "请选择颁发时间", trigger: "change" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId });
      if (res.returnCode == 200) {
        this.detailInfo = res.returnData;
        (this.certificateId = res.returnData.certificateId
          ? res.returnData.certificateId
          : ""),
          (this.formData.courseId = res.returnData.id);
        this.formData.courseName = res.returnData.courseName;
      }
    },
    returnData() {
      this.editTag = false;
      this.getCourseDetails();
    },
    handleClose(done) {
      done();
    },
    handleCreat() {
      this.title = "新建模板";
      this.formData = {
        courseId: this.formData.courseId,
        courseName: this.formData.courseName,
        templateName: "",
        diyType: "1",
        templateDesc: "",
        beginTime: "",
        endTime: "",
        score: "",
        issueOrgan: "",
        issueTime: "",
      };
      this.dialogVisible = true;
    },
    //确认
    handleEnter() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          this.addOrUpdateCertificateTemplate();
        }
      });
    },
    //编辑
    handleEdit(val) {
      this.getCertificateTemplate(val.id);
      this.title = "修改模板";
      this.dialogVisible = true;
    },
    //模板列表接口
    async getCertificateTemplateList() {
      let params = {
        courseId: this.formData.courseId,
        courseName: this.formData.courseName,
        templateName: this.params.templateName,
        pageNo: this.params.pageNo,
        pageSize: this.params.pageSize,
      };
      var res = await getCertificateTemplateList(params);
      if (res.returnCode == 200) {
        this.total = res.returnCount;
        this.tableData = res.returnData.list;
      }
    },
    //新增修改接口
    async addOrUpdateCertificateTemplate() {
      var res = await addOrUpdateCertificateTemplate(this.formData);
      if (res.returnCode == 200) {
        this.$message.success("成功！");
        this.dialogVisible = false;
        this.getCertificateTemplateList();
        this.btnLoading = false;
      }
    },
    //详情
    async getCertificateTemplate(val) {
      let params = {
        id: val,
      };
      var res = await getCertificateTemplate(params);
      if (res.returnCode == 200) {
        Object.keys(res.returnData).map((val) => {
          this.formData[val] = res.returnData[val];
        });
      }
    },
    //启用
    async updateStudyCourse(val) {
      let formData = new FormData();
      formData.append("courseId", this.formData.courseId);
      formData.append("certificateId", val.id);
      var res = await updateStudyCourse(formData);
      if (res.returnCode == 200) {
        this.$message.success("启用成功！");
        this.getCertificateTemplateList();
      }
    },
    //删除
    async deleteCertificateTemplate(val) {
      let params = {
        templateIds: val.id,
      };
      var res = await deleteCertificateTemplate(params);
      if (res.returnCode == 200) {
        this.$message.success("删除成功！");
        this.getCertificateTemplateList();
      }
    },
    //分页
    handleCurrenChange(val) {
      this.parmas.pageNo = val;
      this.getCertificateTemplateList();
    },
  },
  created() {
    this.getCourseDetails().then(() => {
      this.getCertificateTemplateList();
    });
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.my-label {
  width: 145px;
}

.setInfo {
  width: 100%;

  .setInfo_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
  }

  .setInfo_body {
    padding: 20px;
  }
}
.zhen {
  padding: 20px 20px 0 20px;
  .head {
    border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
