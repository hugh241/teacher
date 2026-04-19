<!-- 基本信息管理 -->
<template>
  <div class="setInfo">
    <div class="setInfo_header" v-if="!editTag">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="editTag = true">修改</el-button>
    </div>
    <div class="setInfo_body" v-if="!editTag">
      <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="测试名称">{{ detailInfo.courseName }}</el-descriptions-item>
      </el-descriptions>
      <!-- <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="学时/学分">{{ detailInfo.creditRatio }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="horizontal" :column="2" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="培训开始时间">{{ detailInfo.startDate }}</el-descriptions-item>
        <el-descriptions-item label="培训结束时间">{{ detailInfo.endDate }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="horizontal" :column="2" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="学段">{{ formatTuition(detailInfo.tuition) }}</el-descriptions-item>
        <el-descriptions-item label="省市区县">{{ detailInfo.areaName }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="培训封面" v-if="detailInfo.studyFiles">
          <img :src="detailInfo.studyFiles.filePath || ''" alt="" style="width: 400px; height: 140px" />
        </el-descriptions-item>
      </el-descriptions> -->
      <!-- <el-descriptions direction="horizontal" :column="2" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="培训完成是否需要答题">{{ detailInfo.isHomework == '1' ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="是否需要提交培训心得">{{ detailInfo.isExperience == '1' ? '是' : '否' }}</el-descriptions-item>
      </el-descriptions> -->
      <!-- <el-descriptions direction="horizontal" v-if="detailInfo.isCover == '1'" :column="1" border :contentStyle="CS"
        :label-style="LS">
        <el-descriptions-item label="轮播图">
          <img :src="detailInfo.coverPath || ''" alt="" style="width: 800px; height: 140px" />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="horizontal" :column="2" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="是否需要提交培训心得">
          <span :class="detailInfo.isExperience == '1' ? 'span_info box1' : 'span_info box2'">{{ detailInfo.isExperience
            ==
            '1'
            ? '是' : '否' }}</span>

        </el-descriptions-item>
        <el-descriptions-item label="是否需要提交培训作业">
          <span :class="detailInfo.isHomework == '1' ? 'span_info box1' : 'span_info box2'">{{ detailInfo.isHomework ==
            '1'
            ? '是' : '否' }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions direction="horizontal" :column="2" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="是否展示问答">
          <span :class="detailInfo.showAnswerFlag == '0' ? 'span_info box1' : 'span_info box2'">{{ detailInfo.showAnswerFlag
            ==
            '0'
            ? '是' : '否' }}</span>

        </el-descriptions-item>
        <el-descriptions-item label="是否展示笔记">
          <span :class="detailInfo.showNoteFlag == '0' ? 'span_info box1' : 'span_info box2'">{{ detailInfo.showNoteFlag ==
            '0'
            ? '是' : '否' }}</span>
        </el-descriptions-item>
      </el-descriptions> -->
      <el-descriptions direction="horizontal" :column="1" border :contentStyle="CS" :label-style="LS">
        <el-descriptions-item label="测试结束">
          <div v-html="formatCourseIntroduce(detailInfo.courseIntroduce)"></div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <setInfo style="marginTop: 70px" v-if="editTag" :editTag="editTag" :courseId="courseId" :detailInfo="detailInfo"
      @returnData="returnData" v-on="$listeners" />
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
  },
  components: {
    setInfo: () => import('@/views/train/components/publish/components/setInfo.vue'),
  },
  data() {
    return {
      editTag: false, //修改开关
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
    // 格式化测试结束，处理图片尺寸
    formatCourseIntroduce(content) {
      if (!content) return '';
      
      // 使用正则匹配图片标签，并添加样式
      return content.replace(
        /<img([^>]*)>/g,
        '<img $1 style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; margin: 10px 0;">'
      );
    },
    formatTuition(tuitionCode) {
      const tuitionMap = {
        '2': '小学',
        '3': '初中', 
        '4': '高中',
        '5': '中职',
        '6': '电教',
        '7': '教研',
        '9': '高职',
        '10': '学前',
        '11': '大学',
        '12': '其他'
      };
      return tuitionMap[tuitionCode] || tuitionCode || '--';
    },
    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId })
      // const res = await getCourseDetails({ courseId: '1663024250335985664' })
      if (res.returnCode == 200) {

        this.detailInfo = res.returnData;
        // this.detailInfo = res.returnData;

      }
    },
    returnData() {
      this.editTag = false
      this.getCourseDetails()
    },
  },
  mounted() {

    this.getCourseDetails()
  },

}
</script>

<style scoped lang="scss">
.my-label {
  width: 145px;
}

.span_info {
  color: black;
  font-weight: 500;
}

.box1 {
  color: rgba(82, 196, 26, 1);
  border: 1px solid #cedfbb;
  padding: 1px 5px;
}

.box2 {
  color: rgba(245, 34, 45, 1);
  border: 1px solid rgba(255, 163, 158, 1);
  padding: 1px 5px;
}

.setInfo {
  width: 100%;

  .setInfo_header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20px 20px 0 20px;
  }

  .setInfo_body {
    padding: 20px;
  }
}
</style>
