<!-- 培训人员管理 -->
<template>
  <div class="setExperience">
    <div class="set_main">
      <div class="set_top">
        <Tabs :tabList="tabList" @handleTabsClick="handleTabsClick"></Tabs>
      </div>
      <Find
        @zifindClick="findClick"
        @ziresetClick="resetClick"
        @zidownClick="zidownClick"
      ></Find>
      <div class="set_tab">
        <div v-if="tableData.length > 0">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{ 'background-color': '#F7F8FA' }"
            tooltip-effect="light myTooltips"
          >
            <el-table-column prop="index" label="序号" width="60" align="center">
            </el-table-column>
            <el-table-column prop="userName" label="姓名" width="120" align="center">
            </el-table-column>
            <el-table-column prop="cityName" label="市/州" align="center"> </el-table-column>
            <el-table-column prop="countryName" label="区县" align="center"> </el-table-column>
            <el-table-column prop="schoolName" label="学校" align="center">
            </el-table-column>
            <el-table-column label="学习时长" width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.studyTime | getTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="notes" label="心得" width="180" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="xdcontent" v-html="scope.row.notes"></div>
              </template>
            </el-table-column>
            <el-table-column label="是否完成" align="center" width="100">
              <template slot-scope="scope">
                <span class="box2" v-if="scope.row.state == '1'">未开始</span>
                <span class="box2" v-if="scope.row.state == '2'">进行中</span>
                <span class="box1" v-if="scope.row.state == '3'">已完成</span>
              </template>
            </el-table-column>
            <el-table-column label="是否领取证书" align="center" width="120">
              <template slot-scope="scope">
                <span class="box1" v-if="scope.row.certificateId">已领取</span>
                <span class="box2" v-else>未领取</span>
              </template>
            </el-table-column>
            <el-table-column label="学分" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="viewClick(scope.row)"
                  v-if="scope.row.certificateId"
                  >查看证书</el-button
                >
                <el-button disabled type="text" v-else>暂未获得证书</el-button>
                <el-button type="text" @click="goTrain(scope.row)"
                  >参训记录</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listParams.pageNo"
              :page-sizes="[5, 10, 20, 30, 100]"
              :page-size="listParams.pageSize"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
        <el-empty description="暂无数据" v-else></el-empty>
      </div>
      <Editpop
        :show="show"
        title="证书详情"
        :width="'43%'"
        @save="show = false"
        @close="show = false"
      >
        <div slot="body" class="flex_R_C">
          <el-image
            style="height: 500px; width: 705px"
            :src="honorlist.png_url"
            alt=""
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </Editpop>
    </div>
  </div>
</template>

<script>
import {
  getStudySubsectionUserList,
  getStudySubsectionUserListCount,
  getHonorList,
} from "@/api/admin.js";
import utils from "@/utils/downLoad.js";
export default {
  props: ["courseId", "seName"],
  components: {
    Tabs: () => import("./tabs/index.vue"),
    Find: () => import("./find/index.vue"),
    Editpop: () => import("@/components/Editpop/index.vue"),
  },
  data() {
    return {
      honorlist: {},
      honorData: {
        pageNo: 1,
        pageSize: 1,
        courseId: "",
        userId: "",
        courseName: "",
        level: "",
      },
      show: false,
      total: 0,
      listParams: {
        pageNo: 1,
        pageSize: 8,
        state: "",
        countryCode: "",
        schoolId: "",
      },
      activeName: "1",
      tabList: [
        {
          state: "",
          label: "全部",
          num: 0,
        },
        // {
        //   state: '1',
        //   label: '未开始',
        //   num: 0,
        // },
        {
          state: "2",
          label: "进行中",
          num: 0,
        },
        {
          state: "3",
          label: "已完成",
          num: 0,
        },
      ],

      queryParams: {
        value: "",
      },
      tableData: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    // tabs 切换
    handleTabsClick(val) {
      console.log(val);
      this.listParams.pageNo = 1;
      this.listParams.state = val;
      this.getStudySubsectionUserList();
    },
    // 查看
    viewClick(val) {
      this.honorData.courseId = this.courseId;
      this.honorData.courseName = this.$route.query.courseName;
      this.honorData.userId = val.userId;
      getHonorList(this.honorData).then((res) => {
        if (res.returnCode == "200") {
          this.honorlist = res.returnData ? res.returnData[0] : {};
          this.show = true;
        } else {
          this.$message({
            message: res.returnMessage,
            type: "error",
          });
        }
      });
    },
    // 培训汇总
    goTrain(val) {
      this.$router.push({
        name: "trainSum",
        params: {
          userId: val.userId,
          schoolName: val.schoolName,
          userName: val.userName,
          courseId: this.courseId,
          courseName: this.seName,
        },
      });
    },
    // 评分
    pingClick(val) {
      console.log(val);
    },
    // 重置
    resetClick() {
      this.listParams.pageNo = 1;
      this.listParams.countryCode = "";
      this.listParams.schoolId = "";
    },
    // 查询
    // findClick(val) {
    //   this.listParams.pageNo = 1;
    //   this.listParams.countryCode = val.countyCode;
    //   this.listParams.schoolId = val.schoolId;
    //   this.listParams = Object.assign(this.listParams, val);
    //   this.getStudySubsectionUserList();
    // },
    findClick(val) {
      this.listParams = {
        pageNo: 1,
        pageSize: 8,
        state: this.listParams.state,
        courseId: this.courseId,
        ...val // 使用展开运算符，空对象不会覆盖现有属性
      };
      this.getStudySubsectionUserList();
    },
    // 导出
    zidownClick(val) {
      let data = {
        // courseName: this.$route.query.courseName,
        courseName: "",
        chapterName: "",
        subsectionName: "",
        state: this.listParams.state,
        courseId: this.courseId,
        ...val,
      };
      utils.downloadEvent(
        "post",
        "培训人员列表",
        "/studySubsectionUser/exportStudySubsectionUserList",
        false,
        data
      );
    },
    // 分页
    handleSizeChange(val) {
      this.listParams.pageSize = val;
      this.getStudySubsectionUserList();
    },

    handleCurrentChange(val) {
      this.listParams.pageNo = val;
      this.getStudySubsectionUserList();
    },
    // 接口
    async getStudySubsectionUserList() {
      this.listParams.courseId = this.courseId;
      const res = await getStudySubsectionUserList({ ...this.listParams });
      if (res.returnCode == 200) {
        res.returnData.forEach((item, index) => {
          item.index = index + 1;
        });
        this.tableData = res.returnData;
        this.total = res.returnCount;
        console.log("我滴数据", this.tableData);
      }
    },
    async getStudySubsectionUserListCount() {
      const res = await getStudySubsectionUserListCount({
        courseId: this.courseId,
      });
      if (res.returnCode == 200) {
        this.tabList[0].num = res.returnData.allTotal;
        // this.tabList[1].num = res.returnData.notStarted
        this.tabList[1].num = res.returnData.inProgress;
        this.tabList[2].num = res.returnData.completed;
      }
    },
  },
  created() {
    this.getStudySubsectionUserListCount();
    this.getStudySubsectionUserList();
  },
  mounted() {},
  filters: {
    // getTime(time) {
    //   // 转换为式分秒
    //   let hours = time / 60;
    //   return hours.toFixed(2);
    // },
    getTime(time) {
      // 转换为式分秒
      let h = parseInt((time / 60 / 60) % 24);
      h = h < 10 ? "0" + h : h;
      let m = parseInt((time / 60) % 60);
      m = m < 10 ? "0" + m : m;
      let s = parseInt(time % 60);
      s = s < 10 ? "0" + s : s;
      // 作为返回值返回
      return h + ":" + m + ":" + s;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    margin: 0;
  }
}

.setExperience {
  .set_main {
    //width: 100%;
    // height: 200px;
    padding: 20px;

    .set_top {
      margin-top: 10px;

      .num {
        margin-left: 10px;
      }
    }

    .set_tab {
      margin-top: 30px;

      .box1 {
        color: rgba(82, 196, 26, 1);
        border: 1px solid #cedfbb;
        padding: 1px 5px;
      }

      .box2,
      .box-default {
        color: rgba(245, 34, 45, 1);
        border: 1px solid rgba(255, 163, 158, 1);
        padding: 1px 5px;
      }

      .box3 {
        color: rgba(245, 34, 45, 1);
      }
    }

    .fenye {
      margin: 20px auto;
      text-align: center;
    }
  }
}
.xdcontent{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
