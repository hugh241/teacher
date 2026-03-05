<!-- 培训心得管理 -->
<template>
  <!-- <setChapter :courseId="courseId" /> -->
  <div class="setExperience">
    <div class="setInfo_header">
      <span>章节列表</span>
      <el-button type="primary" icon="el-icon-plus" size="mini">添加章节</el-button>
    </div>
    <div class="set_main">
      <div class="set_tab">
        <div v-if="tableData.length > 0">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ 'background-color': '#F7F8FA' }">
            <el-table-column prop="index" label="序号" width="80"> </el-table-column>
            <el-table-column prop="courseName" label="培训名称" width="280"> </el-table-column>
            <el-table-column prop="chapterName" label="章节名称" width="280"> </el-table-column>
            <el-table-column prop="chapterIntroduce" label="章节简介"> </el-table-column>

            <el-table-column label="操作" align="right" width="260">
              <template slot-scope="scope">
                <el-button type="text" @click="viewClick(scope.row)">小节管理</el-button>
                <el-button type="text" @click="updateClick(scope.row)">修改</el-button>
                <el-button type="text" @click="deleteClick(scope.row)">删除</el-button>
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
import { getStudyChapterList } from '@/api/admin.js'
export default {
  props: {
    courseId: {
      type: String,
      default: '',
    },
  },
  components: {

    setChapter: () => import('@/views/train/components/publish/components/setChapter.vue'),
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  created() {

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
        padding: 1px 5px;
      }

      .box2 {
        color: rgba(255, 47, 47, 1);
        border: 1px solid rgba(255, 163, 158, 1);
        padding: 1px 5px;
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
