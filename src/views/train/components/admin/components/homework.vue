<!-- 培训心得管理 -->
<template>
  <div class="setExperience">
    <div class="set_main">
      <div class="set_top">
        <Tabs :tabList="tabList" @handleTabsClick="handleTabsClick"></Tabs>
      </div>
      <Find @zifindClick="findClick" @ziresetClick="resetClick" @zidownClick="downClick"></Find>
      <div class="set_tab">
        <div v-if="tableData.length > 0">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'background-color': '#F7F8FA' }">
            <el-table-column prop="index" label="序号" width="60" align="center"> </el-table-column>
            <el-table-column prop="userName" label="姓名" width="180" align="center"> </el-table-column>
            <el-table-column prop="cityName" label="市/州" align="center"> </el-table-column>
            <el-table-column prop="countryName" label="区县" align="center"> </el-table-column>
            <el-table-column prop="schoolName" label="学校" align="center"> </el-table-column>
            <el-table-column label="是否提交" align="center" width="100">
              <template slot-scope="scope">
                <span class="box1" v-if="scope.row.noteId">已提交</span>
                <span class="box2" v-else>未提交</span>
              </template>
            </el-table-column>
            <el-table-column label="评分" align="center" width="100">
              <template slot-scope="scope">
                <span style="color: #52c41a;" v-if="scope.row.score">{{ scope.row.score }}</span>
                <span v-else class="box3">未评分</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="viewClick(scope.row)" v-if="scope.row.noteId">查看</el-button>
                <el-button type="text" @click="addClick(scope.row)" v-if="scope.row.noteId">打分</el-button>
                <el-button type="text" v-else>暂未提交</el-button>
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
    <workDetail v-if="show" :show="show" @close="handelClose" @save="handelSave" :width="addwidth" :editData="editData"
      :title="title"></workDetail>
    <Add v-if="showadd" :show="showadd" @close="handelCloseadd" @save="handelSaveadd" :width="addwidth1"
      :editData="editDataadd" :title="titleadd" :txtName='txtName'></Add>
  </div>
</template>

<script>
import { getNotesWorkList, getStateNum, findNotesList, addScore, updateScore } from '@/api/admin.js'
import utils from '@/utils/downLoad.js'
export default {
  components: {
    Tabs: () => import('./tabs/index.vue'),
    Find: () => import('./find/index.vue'),
    workDetail: () => import('@/views/train/components/admin/components/detail/workDetail.vue'),
    Add: () => import('@/views/train/components/admin/components/add/exper.vue'),
  },
  props: {
    courseId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      txtName:'培训作业',
      addwidth: '70%',
      show: false,
      addwidth1: '40%',
      title: '详情',
      showadd: false,
      titleadd: '',
      editDataadd: {},
      total: 0,
      editData: {},
      listParams: {
        pageNo: 1,
        pageSize: 8,
        state: '',
        type: '5',
        courseId: '',
      },
      activeName: '1',
      tabList: [
        {
          state: '',
          label: '全部',
          num: '',
        },
        {
          state: '0',
          label: '未提交',
          num: '',
        },
        {
          state: '1',
          label: '已提交',
          num: '',
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
    // tabs 切换
    handleTabsClick(val) {
      console.log(val)
      this.listParams.state = val
      this.getNotesWorkList()
    },
    // 查看
    viewClick(val) {
      this.findNotesList(val.userId)
    },
    addClick(val) {
      this.showadd = true
      this.titleadd = '打分'
      this.editDataadd = val
    },
    // 评分
    pingClick(val) {
      console.log(val)
    },
    // 重置
    resetClick(val) { 
      console.log(val)
      this.getNotesWorkList(val)
     },
    // 查询
    findClick(val) {
      console.log(val)
      this.getNotesWorkList(val)
    },
    handelCloseadd() {
      this.showadd = false
    },
    handelSaveadd(val) {
      if (val.scoreId) {
        this.updateScore(val)
      } else {
        this.addScore(val)
      }
    },
    // 导出

    downClick(val) {
      let data = {
        type: '5',
        state: this.listParams.state,
        courseId: this.courseId,
        ...val,
      }
      utils.downloadEvent('post', '培训作业列表', '/studyNotes/exportNotesWorkList', false, data)
      // console.log(downloadEvent,2333)
    },
    // 分页
    handleSizeChange(val) {
      this.listParams.pageSize = val
      this.getNotesWorkList()
    },
    handelClose() {
      this.show = false
    },
    handelSave() {
      this.show = false
    },
    handleCurrentChange(val) {
      this.listParams.pageNo = val
      this.getNotesWorkList()
    },
    // 接口
    // 打分
    async addScore(val) {
      const res = await addScore({ ...val })
      if (res.returnCode == 200) {
        console.log(res)
        this.showadd = false
        this.getNotesWorkList()
        this.$message({
          type: 'success',
          message: '打分成功',
        })
      }
    },
    // 修改
    async updateScore(val) {
      const res = await updateScore({ ...val })
      if (res.returnCode == 200) {
        console.log(res)
        this.showadd = false
        this.getNotesWorkList()
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }
    },
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
      const res = await getStateNum({ type: '5', courseId: this.courseId })
      if (res.returnCode == 200) {
        this.tabList[0].num = res.returnData[0].num
        this.tabList[1].num = res.returnData[1].num
        this.tabList[2].num = res.returnData[2].num
      }
    },
    async findNotesList(val) {
      const res = await findNotesList({ state: '5', userId: val, pageNo: 1, pageSize: 10 })
      if (res.returnCode == 200) {
        this.show = true
        res.returnData.studyFiles.forEach(item => {
          item.fileSize = (item.fileSize / 1024).toFixed(2)
        })
        this.editData = res.returnData
      }
    },
  },
  created() {
    this.listParams.courseId = this.courseId
    this.getStateNum()
    this.getNotesWorkList()
  },
  mounted() { },
}
</script>

<style scoped lang="scss">
.setExperience {
  .set_main {
    width: 100%;
    height: 200px;

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
