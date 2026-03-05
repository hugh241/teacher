<!--设置答题  -->
<template>
  <div class="container">
    <questionsDetail v-if="questionsTag" :courseId="topic.courseId" :paperId="topic.paperId" @backList="backList" />
    <createQuestion v-else-if="createTag" :courseId="topic.courseId" :paperId="topic.paperId" @backList="backList" />

    <div v-else class="container_box">
      <div class="con_center">
        <div class="soat">
          <div class="jspx_titbar">
            <span style="fontsize: 16px; fontweight: 500">设置试卷列表</span>
          </div>
          <div class="soat_right">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addClick()">创建试卷</el-button>
          </div>
        </div>

        <Tabble :handList="handList" :tabbleList="tableList" :tableData="tableData">
          <template #edit="scope">
            <el-button type="text" @click="updateClick(scope.row)">修改</el-button>
            <el-button type="text" @click="infoClick(scope.row)">查看题目</el-button>
            <el-button type="text" @click="setClick(scope.row)" v-if="scope.row.state == '停用'">设置题目</el-button>
            <el-button type="text" @click="scope.row.state == '停用' ? startPaper(scope.row) : stopPaper(scope.row)"
              :class="scope.row.state == '停用' ? 'color2' : 'color1'">{{ scope.row.state == '停用' ? '启用' : '停用'
              }}</el-button>
            <el-button type="text" @click="deleteListClick(scope.row)" style="color: #e47471">删除</el-button>
          </template>
          <!-- <template slot="Pagination">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="listParams.pageNum" :page-sizes="[5, 10, 20, 30]"
                            :page-size="listParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                            :total="total"></el-pagination>
                    </template> -->
        </Tabble>
        <div class="pagination flex_R_C">
          <Pagination :total="total" @handlePageChange="handlePageChange"></Pagination>
        </div>
        <div class="btn_caozuo" v-if="!editTag">
          <el-button type="primary" @click="prevFun">上一步</el-button>
          <el-button type="primary" @click="nextFun()">下一步</el-button>
        </div>
        <paperAdd ref="paperAddRef" :courseId="courseId" v-on:addSubmitListener="getList" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  getPaperPerList,
  deletePaperPer,
  getStudyCourseList,
  getChapterList,
  getPaperAnswerRecord,
  getPaperTotalScore,
  getPaperRelCount,
  getCourseDetails,
} from '@/api/learningCenter'
import { deleteQuestionV3 } from '@/api/admin.js'
export default {
  props: ['courseId', 'editTag'],
  components: {
    paperAdd: () => import('./paperAdd.vue'),
    Tabble: () => import('@/components/tabble/index.vue'),
    Pagination: () => import('@/components/pagination/index.vue'),
    questionsDetail: () => import('@/views/train/topic/questionsDetail.vue'), //查看题目
    createQuestion: () => import('@/views/train/topic/createQuestion.vue'), //设置题目
  },
  data() {
    return {
      topic: {
        courseId: '',
        paperId: '',
      },
      questionsTag: false,
      createTag: false,
      settingId: '',
      addwidth: '65%',
      showQuestion: false,
      total: 0,
      show: false,
      title: '',
      // 编辑的回显数据
      editData: {},
      listParams: {
        pageNum: 1,
        pageSize: 10,
      },
      handList: [],
      tableList: [
        {
          type: 'index',
          props: '',
          label: '序号',
          width: '60',
        },
        {
          type: '',
          props: 'perName',
          label: '试卷名称',
          filters: '',
          sortable: false,
          fixed: false,
          width: '360',
        },
        {
          type: '',
          props: 'level',
          label: '试卷层次',
          filters: '',
          sortable: false,
          fixed: false,
          width:'100'
        },
        {
          type: '',
          props: 'type',
          label: '试卷类型',
          filters: '',
          sortable: false,
          fixed: false,
          width:'100'
        },
        {
          type: '',
          props: 'startTime',
          label: '开始时间',
          filters: '',
          sortable: true,
          fixed: false,
        },
        {
          type: '',
          props: 'endTime',
          label: '结束时间',
          filters: '',
          sortable: true,
          fixed: false,
        },
        {
          type: '',
          props: 'state',
          label: '状态',
          filters: '',
          sortable: false,
          fixed: false,
          width:'100'
        },
        {
          type: 'custom',
          label: '操作',
          custom: 'edit',
          width: '250',
        },
      ],
      tableData: [],
      courseInfo: {},
      chapterInfo: {},
    }
  },

  mounted() {
    this.$nextTick(() => {
      console.log('this.courseId')
      console.log(this.courseId)
    })

    getCourseDetails(this.courseId).then(res => {
      if (res.returnCode == '200') {
        this.courseInfo = res.returnData
      }
    })

    this.getList()
  },
  methods: {
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
    // 删除
    async deleteQuestionV3(val) {
      const res = await deleteQuestionV3({ id: val, state: '1', courseId: this.courseId })
      if (res.returnCode == 200) {
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getList()
      } else {
        this.$message({
          type: 'error',
          message: res.returnMessage,
        })
        this.getList()
      }
    },
    // 获取列表
    async getList() {
      if (!this.courseInfo) {
        this.courseInfo = this.$parent.$children[2].ruleForm
      }
      console.log('this.courseId')
      console.log(this.courseId)
      let data = {
        courseId: this.courseId,
        pageNo: this.listParams.pageNum,
        pageSize: this.listParams.pageSize,
      }
      let res = await getPaperPerList(data)
      if (res.returnCode == 200) {
        for (let item of res.returnData) {
          item.state = item.state == '0' ? '停用' : item.state == '1' ? '无效 ' : item.state == '2' ? '启用' : '停用'
          // 层次类型 【1：课程 2：章节 3：小节 4：问卷】
          item.level = item.level == '1' ? '课程' : item.level == '2' ? '章节 ' : item.level == '3' ? '小节' : item.level == '4' ? '问卷' : ''
          // 试卷类型 1：练习 2：考试 4：问卷
          item.type = item.type == '1' ? '练习' : item.type == '2' ? '考试 ' : item.type == '4' ? '问卷' : ''
        }
        this.tableData = res.returnData
        this.total = res.returnCount
        this.settingId = res.returnData.settingId
      }
    },
    // 新增
    addClick() {
      this.$refs.paperAddRef.title = '创建试卷'
      this.$refs.paperAddRef.addForm.courseId = this.courseInfo.id
      this.$refs.paperAddRef.getCourseDetails()
      this.$refs.paperAddRef.show()
    },
    // 修改
    updateClick(row) {

      this.$refs.paperAddRef.show()
      this.$refs.paperAddRef.title = '修改试卷'
      let level1 = row.level.trim() == '课程' ? '1' : row.level.trim() == '章节' ? '2' : '4'
      let type1 = row.type.trim() == '练习' ? '1' : row.type.trim() == '考试' ? '2' : '4'
      this.$refs.paperAddRef.getCourseDetails().then(res => {
        if (res.returnCode == 200) {
          this.$refs.paperAddRef.choseLevel(level1)
          this.$refs.paperAddRef.choseType(type1)
          this.$refs.paperAddRef.choseLevel(level1)
          this.$refs.paperAddRef.addForm = {
            id: row.id,
            perName: row.perName,
            courseId: row.courseId,
            chapterId: row.chapterId,
            level: level1,
            totalScore: row.totalScore,
            passScore: row.passScore,
            type: type1,
            startTime: row.startTime,
            endTime: row.endTime,
            state: row.state == '停用' ? '0' : '2'
          }
        }
      })



      // setTimeout(() => {
      //   this.$refs.paperAddRef.choseLevel(level1)
      // }, 500)

    },

    // 查看题目
    infoClick(row) {
      this.topic.paperId = row.id
      this.topic.courseId = row.courseId
      this.questionsTag = true
    },
    // 设置题目
    setClick(row) {
      this.topic.paperId = row.id
      this.topic.courseId = row.courseId
      this.createTag = true
    },
    // 题目返回
    backList() {
      this.topic.paperId = ''
      this.topic.courseId = ''
      this.createTag = false
      this.questionsTag = false
    },
    //启用试卷
    startPaper(row) {
      this.$confirm('确定要启用该试卷吗？启用试卷后，将不能再进行编辑和组卷！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.type == '4') {
          //问卷
          //查询试卷试题数量
          let paperId = row.id
          getPaperRelCount(paperId).then(res => {
            if (res.returnCode == '200') {
              if (parseInt(res.returnData) == 0) {
                this.$message.warning('该试卷尚未完成组卷，不能启用')
              } else {
                //启用试卷
                let param = {
                  id: row.id,
                  state: '2',
                  courseId: row.courseId,
                }
                deletePaperPer(param).then(res => {
                  if (res.returnCode == '200') {
                    this.$message.success('试卷启用成功')
                  } else {
                    this.$message.error(res.returnMessage)
                  }
                  this.getList()
                })
              }
            } else {
              this.$message.error(res.returnMessage)
            }
          })
        } else {
          //考试和练习
          let totalScore = row.totalScore
          //查询试卷总分
          let params = {
            paperId: row.id,
          }
          getPaperTotalScore(params).then(res => {
            if (res.returnCode == '200') {
              if (totalScore != res.returnData) {
                this.$message.warning('该试卷尚未完成组卷，不能启用')
              } else {
                //启用试卷
                let param = {
                  id: row.id,
                  state: '2',
                  courseId: row.courseId,
                }
                deletePaperPer(param).then(res => {
                  if (res.returnCode == '200') {
                    this.$message.success('试卷启用成功')
                  } else {
                    this.$message.error(res.returnMessage)
                  }
                  this.getList()
                })
              }
            } else {
              this.$message.error(res.returnMessage)
            }
          })
        }
      })
    },
    //停用试卷
    stopPaper(row) {
      this.$confirm('确定要停用该试卷吗？停用试卷后，该试卷将不再使用！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        //停用试卷
        let param = {
          id: row.id,
          state: '0',
          courseId: row.courseId,
        }
        deletePaperPer(param).then(res => {
          if (res.returnCode === '200') {
            this.$message.success('试卷停用成功')
          } else {
            this.$message.error(res.returnMessage)
          }
          this.getList()
        })
      })
    },
    // 重置
    reset() {
      this.handList.forEach(res => {
        res.value = ''
      })
    },
    // 分页
    handlePageChange(current, pageSize) {
      this.listParams.pageNum = current
      this.listParams.pageSize = pageSize
      this.getList()
    },

    prevFun() {
      this.$emit('prevFun')
    },
    nextFun() {
      this.$emit('nextFun')
    },
  },
}
</script>

<style scoped lang="scss">
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color1 {
  color: #e47471;
}

.color2 {
  color: #7ec050;
}

.pagination {
  margin-top: 15px;
}

.container {
  width: 100%;
  height: 100%;
  background-color: #f1f2f5;
  margin-top: 20px;
}

.container_box {
  width: 100%;
  min-height: 750px;
  margin: 0 auto;
  background-color: #fff;

  .con_center {
    .btn_caozuo {
      text-align: center;
      margin-top: 20px;
      padding-bottom: 20px;
    }
  }
}

.soat {
  width: 100%;
  @include between();
  background-color: #fff;
  margin-bottom: 15px;
}

.soat_left {
  font-weight: 500;
  width: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .chaxun {
    margin-left: 20px;
  }
}

.soat_right {
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
