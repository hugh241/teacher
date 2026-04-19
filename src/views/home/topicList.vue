<!--设置答题  -->
<template>
  <div class="container">
    <BreadCrumb :type="1" />
    <questionsDetail v-if="questionsTag" :courseId="topic.courseId" :paperId="topic.paperId" @backList="backList" />
    <createQuestion v-else-if="createTag" :courseId="topic.courseId" :paperId="topic.paperId" @backList="backList" />

    <div v-else class="container_box" style="width: 1200px;margin: 0 auto;">
      <div class="con_center">

        <Tabble :handList="handList" :tabbleList="tableList" :tableData="tableData">
          <template #edit="scope">
            <el-button @click="cuotiJi(scope.row)" type="primary" size="large">错题集</el-button>
            <el-button @click="reexamine(scope.row)" type="primary" size="large">参加考试</el-button>
          </template>
        </Tabble>
        <div class="pagination flex_R_C">
          <Pagination :total="total" @handlePageChange="handlePageChange"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getPaperPerList2,
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
  props: ['editTag'],
  components: {
    Tabble: () => import('@/components/tabble/index.vue'),
    Pagination: () => import('@/components/pagination/index.vue'),
    questionsDetail: () => import('@/views/train/topic/questionsDetail.vue'), //查看题目
    createQuestion: () => import('@/views/train/topic/createQuestion.vue'), //设置题目
    BreadCrumb : () => import('@/components/Breadcrumb/index.vue'),
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
          label: '测试题名称',
          filters: '',
          sortable: false,
          fixed: false,
          width: '360',
        },
        {
          type: '',
          props: 'type',
          label: '测试题类型',
          filters: '',
          sortable: false,
          fixed: false,
          width:'100'
        },
        {
          type: '',
          props: 'paperScore',
          label: '最高分数',
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
  created() {
    this.courseId = this.$route.query.courseId
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
    this.topic.courseId = this.courseId;

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
      let res = await getPaperPerList2(data)
      if (res.returnCode == 200) {
        for (let item of res.returnData) {
          item.state = item.state == '0' ? '停用' : item.state == '1' ? '无效 ' : item.state == '2' ? '启用' : '停用'
          // 层次类型 【1：课程 2：章节 3：小节 4：问卷】
          item.level = item.level == '1' ? '课程' : item.level == '2' ? '章节 ' : item.level == '3' ? '小节' : item.level == '4' ? '问卷' : ''
          // 测试题类型 1：练习 2：考试 4：问卷
          item.type = item.type == '1' ? '练习' : item.type == '2' ? '考试 ' : item.type == '4' ? '问卷' : ''
        }
        this.tableData = res.returnData
        this.total = res.returnCount
        this.settingId = res.returnData.settingId
      }
    },
    // 新增
    addClick() {
      this.$refs.paperAddRef.title = '创建测试题'
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
    reexamine(item) {
      this.$router.push({
        path: 'examination',
        query: {
          examId: item.id,
        },
      })
    },
    cuotiJi(item) {
      this.$router.push({
        path: 'answerRecordDetail',
        query: {
          examId: item.id,
        },
      })
    }
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
