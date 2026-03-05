<!--提交任务要求设置 -->
<template>
  <div class="setSubmit flex_C_C">
    <el-form :model="ruleForm" style="width: 1000px" :rules="rules" ref="ruleForm" label-position="right"
      label-width="200px">
      <el-row v-if="ruleForm.isExperience == '1'">
        <div class="setSubmit_title">
          <div class="title_img"></div>
          <p class="title_text">培训心得</p>
        </div>

        <el-col :span="24">
          <el-form-item label="完成要求" prop="experienceNeed">
            <el-input v-model="ruleForm.experienceNeed" type="textarea" maxlength="200" :rows="4" autocomplete="off" placeholder="请输入完成要求"
              style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isExperience == '1'" style="marginbottom: 40px">
        <el-col :span="12">
          <el-form-item label="设置学分" prop="experienceScore">
            <el-input type="number" min="0" :max="100" v-model="ruleForm.experienceScore" placeholder="请输入学分"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isHomework == '1'">
        <div class="setSubmit_title">
          <div class="title_img"></div>
          <p class="title_text">培训作业：</p>
        </div>

        <el-col :span="24">
          <el-form-item label="完成要求" prop="homeworkNeed">
            <el-input v-model="ruleForm.homeworkNeed" type="textarea" :rows="4" maxlength="200" autocomplete="off" placeholder="请输入完成要求"
              style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="isHomework == '1'">
          <el-form-item label="设置学分" prop="homeworkScore">
            <el-input type="number" min="0" :max="100" v-model="ruleForm.homeworkScore" placeholder="请输入学分"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex_R_C" style="padding: 30px 0" v-if="!editTag">
      <el-button type="primary" @click="prevFun()">上一步</el-button>
      <el-button type="primary" @click="nextFun()">下一步</el-button>
    </div>
    <div class="flex_R_C" style="padding: 30px 0" v-if="editTag">
      <el-button v-if="editTag" @click="$emit('returnData')">返回</el-button>
      <el-button v-if="editTag" type="primary" @click="nextFun()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { updateRequire } from '@/api/train'
import { getCourseDetails } from '@/api/admin.js'
export default {
  props: ['editTag', 'courseId', 'detailInfo', 'isExperience', 'isHomework'],
  components: {},
  data() {
    return {
      ruleForm: {
        experienceNeed: '',
        experienceScore: '0',
        homeworkNeed: '',
        homeworkScore: '0',
      },
      rules: {
        experienceNeed: [{ required: true, message: '请填写培训心得完成要求：', trigger: 'blur' },
        { max: 200, message: '最长不能超过200字', trigger: 'change' },
        ],

        experienceScore: [
          { 
            required: true, 
            message: '请输入分数,必须为数字类型',
            trigger: 'blur', 
            pattern: /^-?\d+(\.\d+)?$/
          }
        ],
        
        homeworkNeed: [{ required: true, message: '请填写培训作业完成要求：', trigger: 'blur' },
        { max: 200, message: '最长不能超过200字', trigger: 'change' },
        ],
        isHomeworkScore: [{ required: true, message: '请选择是否设置分数', trigger: 'blur' }],
        homeworkScore: [
          { 
            required: true, 
            message: '请输入分数,必须为数字类型',
            trigger: 'blur', 
            pattern: /^-?\d+(\.\d+)?$/
          }
        ],
      },
    }
  },
  computed: {},
  watch: {
    'ruleForm.experienceScore'(newValue) {
      if (newValue < 0 ) {
        this.ruleForm.experienceScore = 0; // 将负数修正为0
      }
      else if (newValue > 100) {
        this.ruleForm.experienceScore = 100; // 将大于100的值修正为100
      }
    },
    'ruleForm.homeworkScore'(newValue) {
      if (newValue < 0 ) {
        this.ruleForm.homeworkScore = 0; // 将负数修正为0
      }
      else if (newValue > 100) {
        this.ruleForm.homeworkScore = 100; // 将大于100的值修正为100
      }
    },
  },
  methods: {
    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId })
      if (res.returnCode == 200) {
        this.ruleForm.experienceNeed = res.returnData.experienceNeed;
        this.ruleForm.experienceNeed = res.returnData.experienceNeed;
        this.ruleForm.experienceNeed = res.returnData.experienceNeed;
        this.ruleForm.experienceNeed = res.returnData.experienceNeed;

        this.ruleForm = Object.assign(this.ruleForm, res.returnData)
        console.log(this.ruleForm, 66666);

      }
    },
    changeIsHomework(e, type) {
      if (type == '0') {
        this.rules.experienceScore[0].required = e == '1' ? true : false
      } else {
        this.rules.homeworkScore[0].required = e == '1' ? true : false
      }
    },
    nextFun() {

      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          this.ruleForm.courseId = this.courseId
          let formData = new FormData()
          Object.keys(this.ruleForm).map(key => {
            formData.append(key, this.ruleForm[key])
          })
          updateRequire(formData).then(res => {
            if (this.editTag) {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.$emit('returnData')
            } else {
              this.$emit('nextFun')
            }

          })
        } else {
          let errList = Object.values(obj)[0]
          this.$message({
            message: errList[0].message,
            type: 'error',
          })
        }
      })
    },
    prevFun() {
      this.$emit('prevFun')
    },
  },
  mounted() {
    if (this.editTag) {
      this.ruleForm = Object.assign(this.ruleForm, this.detailInfo)
    } else if (this.courseId) {
      this.getCourseDetails()
    }
  },

}
</script>

<style lang="scss" scoped>
.setSubmit {
  display: flex;
  flex-direction: column;
  align-items: center;

  &_title {
    display: flex;
    align-items: center;
    padding-left: 84px;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 24px;
    margin-bottom: 20px;

    .title_img {
      width: 3px;
      height: 15px;
      background: #2f61ff;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      margin-right: 10px;
    }
  }
}
</style>
