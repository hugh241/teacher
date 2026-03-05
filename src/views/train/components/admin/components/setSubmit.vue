<!-- 基本信息管理 -->
<template>
  <div class="setInfo">
    <div v-if="!editTag">
      <div style="display:flex;justifyContent: flex-end;marginTop:30px">
        <el-button type="primary" icon="el-icon-edit" size="small" @click="editTag = true">修改</el-button>
      </div>
      <div v-if="detailInfo.isExperience == '1'">
        <div class="setInfo_header">
          <span>培训心得</span>

        </div>
        <div class="setInfo_body">
          <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
            <el-descriptions-item label="完成要求">{{ detailInfo.experienceNeed }}</el-descriptions-item>
            <el-descriptions-item label="学分">{{ detailInfo.experienceScore }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div v-if="detailInfo.isHomework == '1'">
        <div class="setInfo_header">
          <span>培训作业</span>
        </div>
        <div class="setInfo_body">
          <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
            <el-descriptions-item label="完成要求">{{ detailInfo.homeworkNeed }}</el-descriptions-item>
            <el-descriptions-item label="学分">{{ detailInfo.homeworkScore }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
    <setSubmit style="marginTop: 70px;" :isExperience="isExperience" :isHomework="isHomework" v-if="editTag"
      :editTag="editTag" :courseId="courseId" :detailInfo="detailInfo" @returnData="returnData" />
  </div>
</template>

<script>
import { getCourseDetails } from '@/api/admin.js'
export default {
  props: {
    courseId: {
      type: String,
      default: '',
    },
    isExperience: {
      type: String,
      default: '',
    },
    isHomework: {
      type: String,
      default: '',
    },
  },
  components: {
    setSubmit: () => import('@/views/train/components/publish/components/setSubmit.vue'),
  },
  data() {
    return {
      editTag: false,//修改开关
      detailInfo: {},
      CS: {
        'text-align': 'left', //文本居中
        'min-width': '250px', //最小宽度
        'word-break': 'break-all', //过长时自动换行
        'border-color': '#DFDFDF',
        color: '#000',
      },
      CSimg: {
        'text-align': 'left', //文本居中
        width: '250px', //最小宽度
      },
      LS: {
        color: '#000',
        'text-align': 'center',
        'font-weight': '600',
        width: '180px',
        'word-break': 'keep-all',
        'border-color': '#DFDFDF',
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId })
      if (res.returnCode == 200) {
        console.log(res)
        this.detailInfo = res.returnData
      }
    },
    returnData() {
      this.editTag = false;
      this.getCourseDetails()
    }
  },
  created() {
    this.getCourseDetails()
  },
  mounted() { },
}
</script>

<style scoped lang="scss">
.my-label {
  width: 145px;
}

.setInfo {
  width: 100%;

  .setInfo_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
  }

  .setInfo_body {
    padding: 20px;
  }
}
</style>
