<!-- 培训心得管理 -->
<template>
  <div class="setExperience">
    <div class="setInfo_header">
      <span style="fontsize: 16px">设置测试题列表</span>
      <el-button type="primary" icon="el-icon-plus" size="mini">创建测试题</el-button>
    </div>
    <div class="set_main">
      <div class="set_tab">
        <div v-if="tableData.length > 0">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'background-color': '#F7F8FA' }">
            <el-table-column prop="index" label="序号" width="60" align="center"> </el-table-column>
            <el-table-column prop="userName" label="测试题名称" width="360" align="center"> </el-table-column>
            <el-table-column prop="cityName" label="测试题层次" align="center" width="100"> </el-table-column>
            <el-table-column prop="countryName" label="测试题类型" align="center" width="100"> </el-table-column>
            <el-table-column prop="schoolName" label="开始时间" align="center"> </el-table-column>
            <el-table-column prop="schoolName" label="结束时间" align="center"> </el-table-column>
            <el-table-column label="是否启用" align="center" width="100" >
              <template slot-scope="scope">
                <span class="box1" v-if="scope.row.noteId">已启用</span>
                <span class="box2" v-else>未启用</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="right" width="300">
              <template slot-scope="scope">
                <el-button type="text" @click="updateClick(scope.row)">修改</el-button>
                <el-button type="text" @click="viewClick(scope.row)">查看题目</el-button>
                <el-button type="text" @click="deleteClick(scope.row)" style="color: rgba(255, 47, 47, 1)">停用</el-button>
                <el-button type="text" @click="deleteListClick(scope.row)"
                  style="color: rgba(255, 47, 47, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="listParams.pageNo" :page-sizes="[5, 10, 20, 30, 100]" :page-size="listParams.pageSize"
              layout="total, prev, pager, next" :total="total"></el-pagination>
          </div>
        </div>
        <el-empty description="暂无数据" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotesWorkList, getStateNum, deleteQuestionV3 } from '@/api/admin.js'
export default {
  components: {},
  data() {
    return {
      total: 0,
      listParams: {
        pageNo: 1,
        pageSize: 8,
        state: '',
        type: '5',
        courseId: '1662008762088730624',
      },

      queryParams: {
        value: '',
      },
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  methods: {
    // tabs 切换
    handleTabsClick(val) {
      console.log(val)
      this.listParams.state = val
      this.getNotesWorkList()
    },
    // 查看
    viewClick(val) {
      console.log(val)
    },
    // 评分
    pingClick(val) {
      console.log(val)
    },
    // 重置
    resetClick() { },
    // 查询
    findClick(val) {
      console.log(val)
      this.getNotesWorkList(val)
    },
    updateClick(val) { },
    deleteClick(val) { },
    // 导出
    downClick() { },
    // 分页
    handleSizeChange(val) {
      this.listParams.pageSize = val
      this.getNotesWorkList()
    },

    handleCurrentChange(val) {
      this.listParams.pageNo = val
      this.getNotesWorkList()
    },
    deleteListClick(val) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteQuestionV3(val.id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 接口
    async getNotesWorkList(val) {
      const res = await getNotesWorkList({ ...this.listParams, ...val })
      if (res.returnCode == 200) {
        res.returnData.list.forEach((item, index) => {
          item.index = index + 1
        })
        this.tableData = res.returnData.list
        this.total = res.returnCount
      }
    },
    async getStateNum() {
      const res = await getStateNum({ type: '5' })
      if (res.returnCode == 200) {
        this.tabList[0].num = res.returnData[0].num
        this.tabList[1].num = res.returnData[1].num
        this.tabList[2].num = res.returnData[2].num
      }
    },
    // 删除
    async deleteQuestionV3(val) {
      const res = await deleteQuestionV3({ questionId: val })
      if (res.returnCode == 200) {
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getNotesWorkList()
      }
    },
  },
  created() {
    this.getStateNum()
    this.getNotesWorkList()
  },
  mounted() { },
}
</script>

<style scoped lang="scss">
.setExperience {
  .setInfo_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0px 0 20px;
  }

  .set_main {
    width: 100%;
    height: 200px;
    padding: 0px 20px 0 20px;

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
        color: rgba(255, 47, 47, 1);
        border: 1px solid rgba(255, 163, 158, 1);
        padding: 0px 5px;
      }

      .box3 {
        color: rgba(255, 163, 158, 1);
      }
    }

    .fenye {
      margin: 20px auto;
      text-align: center;
    }
  }
}
</style>
