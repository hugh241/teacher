<!--  -->
<template>
  <div style="padding: 30px 0">
    <div
      class="bas"
      style="display: flex; align-items: center; margin-bottom: 10px"
    >
      <!-- <span>级别：</span>
      <SelectBtn
        v-if="role != 2"
        :buttonName="buttonName"
        @handleBtn="handleBtn"
      ></SelectBtn> -->
    </div>  
    <div class="asd" style="display: flex; align-items: center">
      <span>状态：</span>
      <SelectBtn
        :buttonName="buttonName2"
        @handleBtn="handleBtnTwo"
      ></SelectBtn>
    </div>
    <div class="flex_R_B">
      <p class="trainList_title">培训任务</p>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push('/publish')"
        >发布培训任务</el-button
      >
    </div>

    <Tabble :tabbleList="tabbleList" :tableData="tableData">
      <template #status="scope">
        <span class="stateStyle" v-if="scope.row.state == 0">已发布</span>
        <span class="stateStyle1" v-if="scope.row.state == 2">未发布</span>
      </template>
      <template #edit="scope">
        <!-- <el-button style="color: #e58341" @click="changeState(scope.row.id, '2')"
          v-if="scope.row.state == 0 && (role == 1 || Number(role) - 2 == scope.row.level)" type="text">下线</el-button> -->
        <el-button
          style="color: #e58341"
          @click="changeState(scope.row.id, '2')"
          v-if="scope.row.state == 0"
          type="text"
          >下线</el-button
        >
        <el-button
          @click="changeState(scope.row.id, '0')"
          style="color: #e58341"
          v-if="scope.row.state == 2"
          type="text"
          >发布</el-button
        >
        <el-button type="text" @click="goAdmin(scope.row)">管理</el-button>
        <el-button
          @click="changeState(scope.row.id, '1')"
          v-if="scope.row.state == 2"
          style="color: #f56c6c"
          type="text"
          >删除</el-button
        >
        <!-- <el-button
          @click="changeState(scope.row.id, '1')"
          v-if="role == 1 || Number(role) - 2 == scope.row.level"
          style="color: #f56c6c"
          type="text"
          >删除</el-button
        > -->
      </template>
    </Tabble>

    <div style="text-align: center; margin: 20px 0">
      <Pagination
        :total="total"
        @handlePageChange="handlePageChange"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import { getTrainList, updateState } from "@/api/train";
import { mapGetters } from "vuex";
export default {
  components: {
    Pagination: () => import("@/components/pagination/index.vue"),
    Tabble: () => import("@/components/tabble/index.vue"),
    SelectBtn: () => import("@/views/components/SelectBtn.vue"),
  },
  data() {
    return {
      role: null,
      total: 0,
      query: {
        courseName: "",
        level: "",
        pageNo: 1,
        pageSize: 10,
        type: "",
      },
      tableData: [],
      buttonName: [
        {
          title: "全部",
          type: 0,
          level: "",
        },
        // {
        //   title: "省级",
        //   type: 1,
        //   level: "0",
        // },
        // {
        //   title: "市级",
        //   type: 2,
        //   level: "1",
        // },
        // {
        //   title: "区县级",
        //   type: 3,
        //   level: "2",
        // },
        // {
        //   title: "校级",
        //   type: 4,
        //   level: "3",
        // },
      ],
      buttonName2: [
        {
          title: "全部",
          type: "",
        },
        {
          title: "未开始",
          type: "1",
        },
        {
          title: "进行中",
          type: "2",
        },
        {
          title: "已结束",
          type: "3",
        },
      ],
      tabbleList: [
        {
          type: "index",
          props: "",
          label: "序号",
          width: "60",
        },

        {
          props: "courseName",
          label: "课程名称",
          width: "360",
        },
        {
          props: "startDate",
          label: "开始时间",
        },
        {
          props: "endDate",
          label: "结束时间",
        },
        {
          type: "custom",
          label: "发布状态",
          custom: "status",
          width: "120",
        },
        {
          type: "custom",
          label: "操作",
          custom: "edit",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {},
  methods: {
    changeState(courseId, state) {
      let text = state == 0 ? "发布" : state == 1 ? "删除" : "下线";
      this.$confirm(`此操作将进行${text}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          courseId,
          state,
        };
        updateState(data).then((res) => {
          if (res.returnCode == 200) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.getTrainList();
          } else {
            this.$message({
              message: res.returnMessage,
              type: "error",
            });
          }
        });
      });
    },
    handleBtn(item) {
      this.query.level = item.level;
      this.query.pageNo = 1;
      this.query.pageSize = 10;
      this.getTrainList();
    },
    //筛选第二行
    handleBtnTwo(item) {
      this.query.type = item.type;
      this.query.pageNo = 1;
      this.query.pageSize = 10;
      this.getTrainList();
    },
    //分页
    handlePageChange(current, pageSize) {
      this.query.pageNo = current;
      this.query.pageSize = pageSize;
      this.getTrainList();
    },
    goAdmin(row) {
      this.$router.push({
        path: "/admin",
        query: { id: row.id, courseName: row.courseName },
      });
    },
    // 获取培训列表
    getTrainList() {
      let formData = new FormData();
      Object.keys(this.query).map((key) => {
        formData.append(key, this.query[key]);
      });

      getTrainList(formData).then((res) => {
        if (res.returnCode == 200) {
          this.total = res.returnCount;
          this.tableData = res.returnData;
        }
      });
    },
    // buttonName按钮判断
    setMenu() {
      switch (this.role) {
        case "4":
          this.buttonName = [
            {
              title: "全部",
              type: 0,
              level: "",
            },
            {
              title: "省级",
              type: 1,
              level: "0",
            },
            {
              title: "市级",
              type: 2,
              level: "1",
            },
            {
              title: "县级",
              type: 3,
              level: "2",
            },
          ];
          break;
        case "3":
          this.buttonName = [
            {
              title: "全部",
              type: 0,
              level: "",
            },
            {
              title: "省级",
              type: 1,
              level: "0",
            },
            {
              title: "市级",
              type: 2,
              level: "1",
            },
          ];
          break;
        case "2":
          this.buttonName = [
            // {
            //     title: '全部',
            //     type: 0,
            //     level: '',
            // },
            {
              title: "省级",
              type: 1,
              level: "0",
            },
          ];
          break;
      }
      // 省级单独处理
      let index = this.buttonName.findIndex((item) => {
        return item.level == "0";
      });
      if (this.$process.VUE_APP_ALL_PROVINCE == "0" && index != -1) {
        this.buttonName.splice(index, 1);
      }
      // 市级单独处理
      let index1 = this.buttonName.findIndex((item) => {
        return item.level == "1";
      });
      if (this.$process.VUE_APP_ALL_CITY == "1" && index1 != -1) {
        this.buttonName[index1].title = "州级";
      }
      //this.getTrainList();
    },
  },
  created() {},
  mounted() {
    this.role = this.userInfo.roleLis ? this.userInfo.roleList[0].roleCode : '';
    this.setMenu();
    this.getTrainList();
  },
};
</script>

<style lang="scss" scoped>
.trainList_title {
  font-size: 16px;
  padding: 20px 0;
  font-weight: bold;
}

.stateStyle {
  border: 1px solid #b7eb8f;
  height: 30px;
  padding: 2px 8px;
  background: #f6ffed;
  border-radius: 2px 2px 2px 2px;
  color: #52c41a;
}

.stateStyle1 {
  border: 1px solid #ffa39e;
  height: 30px;
  padding: 2px 8px;

  background: #fff1f0;
  border-radius: 2px 2px 2px 2px;
  color: #f5222d;
}
</style>
