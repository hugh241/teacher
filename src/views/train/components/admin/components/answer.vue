<!-- 答题记录管理 -->
<template>
  <div class="setExperience">
    <div class="set_main" v-if="!detailTag">
      <div v-if="tableData.length > 0">
        <div class="set_tab">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'background-color': '#F7F8FA' }">
            <el-table-column prop="index" label="序号" width="60" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="完成时间" align="center"> </el-table-column>
            <el-table-column prop="userAccount" label="用户账号" align="center"> </el-table-column>
            <el-table-column prop="userName" label="用户姓名" align="center" width="180"> </el-table-column>
            <el-table-column prop="perName" label="试卷名称" align="center"> </el-table-column>
            <el-table-column prop="score" label="得分" align="center" width="120"></el-table-column>
            <el-table-column label="试卷类型" align="center">
              <template slot-scope="scope">
                <span>{{
                  scope.row.perType == '1' ? '练习' : scope.row.perType == '2' ? '考试' : scope.row.perType == '3' ?
                    '视频学习（小节）' : '问卷'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="useTime" label="考试用时" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="viewClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="listParams.pageNo" :page-sizes="[5, 10, 20, 30, 100]" :page-size="listParams.pageSize"
            layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
      </div>
      <el-empty description="暂无数据" v-else></el-empty>
    </div>
    <answerRecordDetail v-else :detailInfo="detailInfo" @backList="backList" />
  </div>
</template>

<script>
import { getRecordList } from '@/api/admin.js'
export default {
  props: ['courseId'],
  components: {
    answerRecordDetail: () => import('@/views/train/topic/answerRecordDetail.vue'),
  },
  data() {
    return {
      detailInfo: {},
      detailTag: false,
      total: 0,
      listParams: {
        pageNo: 1,
        pageSize: 8,
      },
      activeName: '1',
      tabList: [
        {
          id: '1',
          label: '全部',
          num: '22',
        },
        {
          id: '2',
          label: '已完成',
          num: '22',
        },
        {
          id: '3',
          label: '未完成',
          num: '22',
        },
      ],

      queryParams: {
        value: '',
      },
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  methods: {
    backList() {
      this.detailTag = false
    },
    // tabs 切换
    handleTabsClick(val) {
      console.log(val)
    },
    // 查看
    viewClick(val) {
      this.detailInfo = Object.assign(this.detailInfo, val)
      this.detailTag = true;
      console.log(val)
    },
    // 评分
    pingClick(val) {
      console.log(val)
    },
    // 导出
    downClick() { },
    // 分页
    handleSizeChange(val) {
      this.listParams.pageSize = val
      this.getRecordList()
    },

    handleCurrentChange(val) {
      this.listParams.pageNo = val
      this.getRecordList()
    },
    // 接口
    async getRecordList(val) {
      this.listParams.courseId = this.courseId
      const res = await getRecordList({ ...this.listParams })
      if (res.returnCode == 200) {
        console.log(res)
        res.returnData.forEach((item, index) => {
          item.index = index + 1
        })
        this.tableData = res.returnData
        this.total = res.returnCount
      }
    },
  },
  created() {
    this.getRecordList()
  },
  mounted() { },
}
</script>

<style scoped lang="scss">
.setExperience {
  .set_main {
    width: 100%;
    height: 200px;
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
        padding: 0px 5px;
      }

      .box2 {
        color: rgba(245, 34, 45, 1);
        border: 1px solid rgba(255, 163, 158, 1);
        padding: 0px 5px;
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
</style>
