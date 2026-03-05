<!-- 设置章节 -->
<template>
  <div class="setChapter">
    <!-- 章节 -->
    <div class="chapter" v-if="!isSubsection">
      <div class="setChapterTop">
        <div class="setChapterTopLeft">章节列表</div>
        <div class="setChapterTopRight">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addChapter"
            >添加章节</el-button
          >
        </div>
      </div>
      <div>
        <el-table
          size="small"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#FAFAFA', color: '#000' }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="courseName"
            label="培训名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column label="小节数量" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.subsectionCount == 0" style="color: #f56c6c"
                >未设置</span
              >
              <span v-else>{{ scope.row.subsectionCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="chapterName"
            label="章节名称"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chapterIntroduce"
            label="章节简介"
            align="center"
          >
            <template slot-scope="scope">
              <div
                class="ellipsis-text"
                :title="stripHtmlTags(scope.row.chapterIntroduce)"
              >
                <!-- <div
                  v-html="formatChapterIntroduce(scope.row.chapterIntroduce)"
                ></div> -->
                <!-- 统一显示查看简介按钮 -->
                <el-button
                  type="text"
                  size="mini"
                  @click="showContentPreview(scope.row.chapterIntroduce)"
                  style="margin-top: 5px"
                >
                  查看简介
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                "
              >
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleSubsection(scope.row)"
                  >小节管理</el-link
                >
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleEdit(scope.row)"
                  >修改</el-link
                >
                <el-link
                  type="danger"
                  :underline="false"
                  @click="handleDelete(scope.row)"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <Pagination
          :total="total"
          @handlePageChange="handlePageChange"
        ></Pagination>
      </div>
    </div>
    <!-- 小节 -->
    <Subsection
      v-if="isSubsection"
      @backChapter="handleBackChapter"
      :info="ruleForm"
    ></Subsection>
    <!-- footer -->
    <div
      class="flex_R_C"
      style="padding: 30px 0"
      v-if="!isSubsection && !editTag"
    >
      <el-button type="primary" @click="prevFun()">上一步</el-button>
      <el-button type="primary" @click="nextFun()">下一步</el-button>
    </div>
    <Editpop
      v-if="show"
      :show="show"
      :title="ruleForm.id ? '章节编辑' : '章节新增'"
      :width="'40%'"
      @save="handleSave"
      @close="handleClose"
    >
      <div slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="章节名称" prop="chapterName">
            <el-input v-model="ruleForm.chapterName" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="章节简介" prop="chapterIntroduce">
            <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" maxlength="10" show-word-limit
                            placeholder="请输入内容" v-model="ruleForm.chapterIntroduce">
                        </el-input> -->
            <editor
              :minHeight="150"
              class="editContent"
              v-model="ruleForm.chapterIntroduce"
            ></editor>
          </el-form-item>
          <el-form-item label="章节排序" prop="sort">
            <el-input-number
              style="width: 100%"
              size="small"
              v-model="ruleForm.sort"
              :min="minValue"
              :max="999"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Editpop>
    <!-- 内容预览弹窗 -->
    <el-dialog
      title="章节简介预览"
      :visible.sync="contentPreviewVisible"
      width="60%"
      center
      :before-close="handleContentPreviewClose"
    >
      <div class="content-preview">
        <div v-if="!previewContent" class="no-content">暂无简介内容</div>
        <div
          v-else
          class="preview-content"
          v-html="formatPreviewContent(previewContent)"
        ></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentPreviewVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Editpop from "@/components/Editpop/index";
import Subsection from "@/views/train/components/publish/components/Subsection";
import Pagination from "@/components/pagination/index.vue";
import {
  addStudyChapter,
  getStudyChapterList,
  editChapter,
  deleteChapter,
} from "@/api/train";
import editor from "@/views/train/components/publish/components/editor.vue";

export default {
  props: ["courseId", "editTag"],
  components: {
    Editpop,
    Subsection,
    Pagination,
    editor,
  },
  data() {
    return {
      throttle: true,
      total: 0,
      show: false,
      tableData: [{}],
      ruleForm: {},
      query: {
        pageNo: 1,
        pageSize: 10,
        courseId: "",
      },
      rules: {
        chapterName: [
          { required: true, message: "请输入章节名称", trigger: "change" },
        ],
        chapterIntroduce: [
          { required: true, message: "请输入章节简介", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请输入章节排序", trigger: "change" },
        ],
      },
      isSubsection: false,
      minValue: 0,
      // 内容预览相关
      contentPreviewVisible: false,
      previewContent: "",
    };
  },
  computed: {
    // minValue() {
    //     return this.tableData.length + 1;
    // },
  },
  watch: {},
  methods: {
    // 格式化章节简介，处理图片尺寸
    formatChapterIntroduce(content) {
      if (!content) return "";

      // 使用正则匹配图片标签，并添加样式
      return content.replace(
        /<img([^>]*)>/g,
        '<img $1 style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">'
      );
    },
    // 格式化预览内容
    formatPreviewContent(content) {
      if (!content) return "";

      // 为预览内容中的图片添加样式
      return content.replace(
        /<img([^>]*)>/g,
        '<img $1 style="max-width: 100%; max-height: 400px; width: auto; height: auto; object-fit: contain; display: block; margin: 10px auto;">'
      );
    },

    // 显示内容预览
    showContentPreview(content) {
      this.previewContent = content;
      this.contentPreviewVisible = true;
    },

    // 关闭内容预览
    handleContentPreviewClose() {
      this.contentPreviewVisible = false;
      this.previewContent = "";
    },
    stripHtmlTags(html) {
      return html ? html.replace(/<[^>]*>?/gm, "") : "";
    },
    handleInput(content) {
      // 去除<p>标签
      const withoutPTags = content.replace(/<p>/gi, "").replace(/<\/p>/gi, "");
      this.ruleForm.chapterIntroduce = withoutPTags;
    },
    // 分页
    handlePageChange(current, pageSize) {
      this.query.pageNo = current;
      this.query.pageSize = pageSize;
      this.getChapterList();
    },
    // 获取章节列表
    getChapterList() {
      this.query.courseId = this.courseId;
      getStudyChapterList(this.query).then((res) => {
        if (res.returnCode == 200) {
          this.total = res.returnCount;
          this.tableData = res.returnData;
        }
      });
    },
    /**
     * @description: 新增弹框确定
     * @param {*} val
     * @return {*}
     */
    handleSave(val) {
      if (this.throttle) {
        this.throttle = false;
        this.$refs.ruleForm.validate((valid, obj) => {
          if (valid) {
            if (this.ruleForm.id) {
              editChapter(this.ruleForm).then((res) => {
                if (res.returnCode == 200) {
                  this.throttle = true;
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.show = false;
                  this.getChapterList();
                }
              });
              return false;
            }
            // 调取新增接口 刷新列表
            this.ruleForm.courseId = this.courseId;
            addStudyChapter(this.ruleForm).then((res) => {
              if (res.returnCode == 200) {
                this.throttle = true;
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.show = false;
                this.getChapterList();
              }
            });
          } else {
            let errList = Object.values(obj)[0];
            this.throttle = true;
            this.$message({
              message: errList[0].message,
              type: "error",
            });
          }
        });
      }
    },
    /**
     * @description: 新增弹框关闭
     * @param {*} val
     * @return {*}
     */
    handleClose(val) {
      this.show = false;
    },
    /**
     * @description: 打开新增弹框
     * @return {*}
     */
    addChapter() {
      this.minValue = this.tableData.length + 1;
      (this.ruleForm = {
        chapterName: "",
        chapterIntroduce: "",
        courseId: "",
        sort: "",
      }),
        (this.show = true);
    },
    /**
     * @description: 小节管理
     * @param {*} row
     * @return {*}
     */
    handleSubsection(row) {
      this.ruleForm = Object.assign(this.ruleForm, row);
      this.isSubsection = true;
    },
    /**
     * @description: 章节修改
     * @param {*} row
     * @return {*}
     */
    handleEdit(row) {
      this.minValue = 0;
      // this.ruleForm = Object.assign(this.ruleForm, row);
      this.ruleForm = row;
      this.show = true;
    },
    /**
     * @description: 章节删除
     * @param {*} row
     * @return {*}
     */
    handleDelete(row) {
      console.log(row);
      this.$confirm(
        `此操作将永久删除章节 ${row.chapterName}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        deleteChapter({ courseId: this.courseId, id: row.id }).then((res) => {
          if (res.returnCode == 200) {
            this.getChapterList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: res.returnMessage,
            });
          }
        });
      });
    },
    /**
     * @description: 每页多少条
     * @param {*} val
     * @return {*}
     */
    handleSizeChange(val) {
      console.log(val);
    },
    /**
     * @description: 当前第几页
     * @param {*} val
     * @return {*}
     */
    handleCurrentChange(val) {
      console.log(val);
    },
    /**
     * @description: 返回章节列表方法
     * @param {*} val
     * @return {*}
     */
    handleBackChapter(val) {
      this.getChapterList();
      console.log(val);
      this.isSubsection = false;
    },
    /**
     * @description: 下一步
     * @return {*}
     */
    nextFun() {
      this.$emit("nextFun");
    },
    /**
     * @description: 上一步
     * @return {*}
     */
    prevFun() {
      this.$emit("prevFun");
    },
    /**
     * @description: 接口
     * @return {*}
     */
  },
  created() {},
  mounted() {
    this.getChapterList();
  },
};
</script>

<style lang="scss" scoped>
@mixin Flex($d: row, $j: normal, $a: normal, $w: nowrap) {
  display: flex;
  flex-direction: $d;
  justify-content: $j;
  align-items: $a;
  flex-wrap: $w;
}

@mixin Font($s: 12px, $c: #000, $w: 500, $f: "Roboto-Medium, Roboto") {
  font-size: $s;
  color: $c;
  font-weight: $w;
  font-family: $f;
}

.setChapterTop {
  @include Flex(row, space-between, center, wrap);
  width: 100%;
  margin-bottom: 15px;

  .setChapterTopLeft {
    @include Font(16px, rgba(0, 0, 0, 0.85), 500);
  }
}

.pagination {
  margin-top: 15px;
  @include Flex(row, center, center, warp);
}

::v-deep .el-dialog {
  .el-dialog__footer {
    margin-top: 0;
  }
}
.ellipsis-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 内容预览样式
.content-preview {
  max-height: 60vh;
  overflow-y: auto;

  .no-content {
    text-align: center;
    color: #999;
    padding: 40px 0;
  }

  .preview-content {
    line-height: 1.6;

    // 为预览内容中的图片添加样式
    img {
      max-width: 100%;
      max-height: 400px;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      margin: 10px auto;
      border: 1px solid #eaeaea;
      border-radius: 4px;
    }
  }
}
</style>
