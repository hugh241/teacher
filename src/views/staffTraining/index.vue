<template>
  <div class="staff-training">
    <BreadCrumb />

    <div class="content-card">
      <div class="status-tabs">
        <el-tabs v-model="activeStatus" @tab-click="handleStatusChange">
          <el-tab-pane label="全部" name=""></el-tab-pane>
          <el-tab-pane label="未开始" name="1"></el-tab-pane>
          <el-tab-pane label="进行中" name="2"></el-tab-pane>
          <el-tab-pane label="已结束" name="3"></el-tab-pane>
        </el-tabs>
      </div>

      <div class="filter-bar">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="培训名称">
            <el-input
              v-model="query.courseName"
              placeholder="请输入培训名称搜索"
              clearable
              @keyup.enter.native="handleSearch"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="加载中..."
      >
        <el-table-column type="index" width="60" label="#"></el-table-column>
        <el-table-column prop="courseName" label="培训名称" min-width="240" />
        <el-table-column label="培训状态" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTagType(row.stateName)">
              {{ row.stateName || '--' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="参与人数" width="120">
          <template slot-scope="{ row }">
            {{ row.allTotal || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="已完成人数" width="140">
          <template slot-scope="{ row }">
            {{ row.completed || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="进行中人数" width="140">
          <template slot-scope="{ row }">
            {{ row.inProgress || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="人员明细" width="140">
          <template slot-scope="{ row }">
            <el-button type="text" @click="openDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper, sizes"
          :current-page="query.pageNo"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog
      title="人员明细"
      :visible.sync="detailDialogVisible"
      width="1300px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <People
        v-if="detailDialogVisible && (detailCourse.id || detailCourse.courseId)"
        :courseId="detailCourse.id || detailCourse.courseId"
        :seName="detailCourse.courseName"
      />
    </el-dialog>

  </div>
</template>

<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import { getTrainListUser } from "@/api/train";
import People from "@/views/train/components/admin/components/people.vue";

export default {
  name: "StaffTraining",
  components: {
    BreadCrumb,
    People,
  },
  data() {
    const defaultQuery = {
      courseName: "",
      level: "",
      pageNo: 1,
      pageSize: 10,
      type: "",
      state: "0",
    };
    return {
      defaultQuery,
      activeStatus: "",
      query: { ...defaultQuery },
      tableLoading: false,
      tableData: [],
      total: 0,
      detailDialogVisible: false,
      detailCourse: {},
    };
  },
  created() {
    this.activeStatus = this.query.type || "";
    this.initPage();
  },
  activated () {
    console.log('activated->detailCourse',this.detailCourse);
    console.log('activated-->detailDialogVisible',this.detailDialogVisible);
   
  },
  methods: {
    async initPage() {
      this.fetchTableData();
    },
    toFormData(payload = {}) {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });
      return formData;
    },
    handleSearch() {
      this.query.pageNo = 1;
      this.fetchTableData();
    },
    handleReset() {
      Object.assign(this.query, this.defaultQuery);
      this.activeStatus = "";
      this.fetchTableData();
    },
    handleStatusChange(tab) {
      this.query.type = tab.name;
      this.query.pageNo = 1;
      this.fetchTableData();
    },
    async fetchTableData() {
      this.tableLoading = true;
      try {
        const params = {
          courseName: this.query.courseName || '',
          type: this.query.type || '',
          pageNo: this.query.pageNo,
          pageSize: this.query.pageSize,
        };
        const res = await getTrainListUser(this.toFormData(params));
        console.log('res-->',res);
        if (res.returnCode === '200') {
          this.total = Number(res.returnCount) || 0;
          this.tableData = res.returnData || [];
        } else {
          this.tableData = [];
          this.total = 0;
        }
      } catch (error) {
        console.error("加载培训列表失败", error);
        this.tableData = [];
        this.total = 0;
      } finally {
        this.tableLoading = false;
      }
    },
    getStatusTagType(stateName) {
      if (!stateName) return "info";
      const mapping = {
        "正常": "success",
        "进行中": "warning",
        "未开始": "info",
        "已结束": "info",
        "已完成": "success",
      };
      return mapping[stateName] || "info";
    },
    detailStatusTag(status) {
      const mapping = {
        "1": "info",
        "2": "warning",
        "3": "success",
      };
      return mapping[status] || "info";
    },
    formatStatus(status) {
      const mapping = {
        "1": "未开始",
        "2": "进行中",
        "3": "已完成",
      };
      return mapping[status] || "--";
    },
    openDetail(row) {
      this.detailCourse = row;
      this.detailDialogVisible = true;
    },
    handleDialogClose() {
      this.detailCourse = {};
    },
    handlePageChange(page) {
      this.query.pageNo = page;
      this.fetchTableData();
    },
    handlePageSizeChange(size) {
      this.query.pageSize = size;
      this.query.pageNo = 1;
      this.fetchTableData();
    },
    formatDuration(seconds) {
      if (seconds === null || seconds === undefined) return "--";
      const total = Number(seconds) || 0;
      const h = String(Math.floor(total / 3600)).padStart(2, "0");
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
      const s = String(Math.floor(total % 60)).padStart(2, "0");
      return `${h}:${m}:${s}`;
    },
    handleDetailSizeChange(size) {
      this.detailPagination.pageSize = size;
      this.detailPagination.pageNo = 1;
      this.fetchDetailList();
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-training {
  padding: 20px 0 40px;
  background: #f4f6fb;
  min-height: calc(100vh - 64px);
}

.content-card {
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(30, 136, 229, 0.05);
}

.status-tabs {
  margin-bottom: 20px;
}

.filter-bar {
  margin-bottom: 20px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .dialog-title {
    font-weight: 600;
    font-size: 16px;
  }

  .dialog-subtitle {
    color: #909399;
    font-size: 14px;
  }
}

.record-text {
  color: #409EFF;
}
</style>
