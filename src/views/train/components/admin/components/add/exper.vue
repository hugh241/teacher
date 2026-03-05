<!--
 * @Date: 2022-11-28 00:25:12
 * @LastEditTime: 2022-12-08 23:00:39
 * @FilePath: /campus-security-vue/src/views/potential/components/add.vue
 * @Description:这是新创建的页面
-->
<template>
  <Editpop :show="show" :title="title" @close="handelClose" :width="width" @save="handelSave">
    <div slot="body">
      <p class="good"><span style="color:red">
        *</span>{{txtName}}最高分：
        <span v-if="txtName == '培训心得'" style="color:red; font-weight: 900; font-size:14px">{{experienceScore}}</span>
        <span v-else style="color:red; font-weight: 900; font-size:14px">{{homeworkScore}}</span>
      </p>
      <el-form v-if="txtName == '培训心得'" ref="form" :model="form" label-width="140px" :rules="rules1">
        <el-row>
          <el-col :span="22">
            <el-form-item label="学分" prop="score">
              <el-input v-model="form.score" placeholder="请输入分数" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-else ref="form" :model="form" label-width="140px" :rules="rules2">
        <el-row>
          <el-col :span="22">
            <el-form-item label="学分" prop="score">
              <el-input v-model="form.score" placeholder="请输入分数" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </Editpop>
</template>

<script>
  import Editpop from '@/components/Editpop/index.vue'
  export default {
    components: { Editpop },
    props: {
      width: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
      txtName: {
        type: String,
        default: '',
      },
      show: {
        type: Boolean,
        default: false,
      },
      editData: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      const validateNumberRange1 = (rule, value, callback) => {
        const number = Number(value)
        if (number >= 0 && number <= this.editData.experienceScore && /^\d+(\.\d{1,2})?$/.test(value)) {
          callback()
        } else {
          callback(new Error('请您输入0到最高(包含最高)分数之间的数，最多可以保留两位小数(未设置分数则为0)'))
        }
      }
      const validateNumberRange2 = (rule, value, callback) => {
        const number = Number(value)
        if (number >= 0 && number <= this.editData.homeworkScore && /^\d+(\.\d{1,2})?$/.test(value)) {
          callback()
        } else {
          callback(new Error('请您输入0到最高(包含最高)分数之间的数，最多可以保留两位小数(未设置分数则为0)'))
        }
      }
      return {
        experienceScore:'',
        homeworkScore:'',
        form: {
          score: '',
          relationId: '',
          scoreId: '',
        },
        rules1: {
          score: [
            { required: true, message: '请进行输入填写', trigger: 'blur' },
            // { type: 'number', message: '请输入数字类型', trigger: 'blur' },
            { validator: validateNumberRange1, trigger: 'blur' },
          ],
        },
        rules2: {
          score: [
            { required: true, message: '请进行输入填写', trigger: 'blur' },
            // { type: 'number', message: '请输入数字类型', trigger: 'blur' },
            { validator: validateNumberRange2, trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      this.form.relationId = this.editData.noteId
      this.form.score = this.editData.score ? this.editData.score : ''
      this.form.scoreId = this.editData.scoreId ? this.editData.scoreId : ''
      console.log('1',this.title,'2',this.editData);
    },
    mounted() {
      if(this.editData.experienceScore == '0' || !this.editData.experienceScore){
         this.experienceScore == '未设置';
      }
      else{
        this.experienceScore = this.editData.experienceScore;
      }
      if(this.editData.homeworkScore == '0' || !this.editData.homeworkScore){
         this.homeworkScore = '未设置';
      }
      else{
        this.homeworkScore = this.editData.homeworkScore;
      }
    },
    methods: {
      /**
       * @event:
       * @return {*}
       * @description: 交互
       */
      downClick(val) {
        window.open(val.filePath)
      },
      handelClose() {
        this.$emit('close')
      },
      handelSave() {
        console.log(this.form)
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('save', this.form)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /**
       * @event:
       * @return {*}
       * @description: 请求
       */
    },
  }
</script>

<style lang="scss" scoped>
.good{
  padding: 0 0 15px 90px;
  font-size: 15px;
}
</style>
