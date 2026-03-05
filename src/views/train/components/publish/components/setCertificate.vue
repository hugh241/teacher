<!-- 证书颁发设置 -->
<template>
  <div class="setCertificate">
    <el-form :model="ruleForm" style="width: 800px" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
      <!-- <el-row>
                <el-col :span="24" class="bj_img">
                    <el-form-item label="证书模版" prop="fileId" style="display: flex">
                        <el-upload class="avatar-uploader" :multiple="false" :auto-upload="false" action=""
                            :on-change="file => beforeUploadImg(file, '0')" accept=".jpg, .png"
                            v-bind:show-file-list="false">
                            <el-button type="primary" icon="el-icon-setting">设置模板</el-button>
                        </el-upload>

                        <div class="flex_R_C" style=" alignItems: flex-end">
                            <div class="imgUrl_wrap">
                                <img v-if="ruleForm.fileId" :src="ruleForm.showUrl" alt="" />
                            </div>
                            <el-button v-if="ruleForm.fileId" type="text" style="color:#f56c6c;marginLeft:10px"
                                @click="deleteFile">删除</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row> -->
      <el-row>
        <el-col :span="10">
          <el-form-item label="是否颁发证书" prop="isCertificate">
            <el-radio-group v-model="ruleForm.isCertificate" @change="changeRadio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="ruleForm.isCertificate == '1'">
          <el-form-item label="获取证书最低学分" prop="certificateScore">
            <el-input type="number" min="0" v-model="ruleForm.certificateScore" autocomplete="off" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="总分：">
            <span style="color: red">{{ detailInfos }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex_R_C" style="padding: 30px 0">
      <el-button v-if="!editTag" type="primary" @click="prevFun()">上一步</el-button>
      <el-button type="primary" @click="nextFun()"> {{ editTag ? '保存' : '发布' }}</el-button>
    </div>
  </div>
</template>

<script>
  import { uploadFile, updateCertificate } from '@/api/train'
  import { getCourseDetails } from '@/api/admin.js'
  export default {
    props: ['courseId', 'editTag', 'detailInfo'],
    components: {},
    data() {
      return {
        detailInfos: '',
        ruleForm: {
          // fileId: '',
          isCertificate: '1',
          certificateScore: 0,
          courseId: '',
        },
        rules: {
          // fileId: [{ required: true, message: '请上传证书模版：', trigger: 'blur' }],
          isCertificate: [{ required: true, message: '请选择是否颁发证书', trigger: 'blur' }],
          certificateScore: [{ required: true, message: '请获取证书最低学分', trigger: 'change' }],
        },
      }
    },
    computed: {},
    watch: {
      'ruleForm.certificateScore'(newValue) {
        if (newValue < 0) {
          this.ruleForm.certificateScore = 0 // 将负数修正为0
        }
        if (newValue > this.detailInfos) {
          this.ruleForm.certificateScore = 0
        }
      },
    },
    methods: {
      changeRadio(e) {
        if (e == '0') {
          this.ruleForm.certificateScore = 0
        }
        console.log(e)
      },
      // 证书模版上传
      beforeUploadImg(file) {
        if (file.raw.type != 'image/png' && file.raw.type != 'image/jpeg' && file.raw.type != 'image/jpg') {
          this.$message({
            message: '仅支持上传png/jpg格式',
            type: 'error',
          })
          return false
        }
        let formData = new FormData()
        formData.append('fileData', file.raw)
        uploadFile(formData).then(res => {
          if (res.returnCode == '200') {
            this.ruleForm.fileId = res.returnData[0].fileId
            this.ruleForm.showUrl = URL.createObjectURL(file.raw)
          }
        })
      },
      deleteFile() {
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.ruleForm.fileId = ''
          this.ruleForm.showUrl = ''
        })
      },

      nextFun() {
        this.$refs.ruleForm.validate((valid, obj) => {
          if (valid) {
            this.publish()
          } else {
            let errList = Object.values(obj)[0]
            this.$message({
              message: errList[0].message,
              type: 'error',
            })
          }
        })
      },
      // 发布活动
      publish() {
        this.ruleForm.courseId = this.courseId
        let formData = new FormData()
        Object.keys(this.ruleForm).map(key => {
          formData.append(key, this.ruleForm[key])
        })
        updateCertificate(formData).then(res => {
          if (res.returnCode == '200') {
            if (this.editTag) {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.$emit('returnData')
              return false
            }
            this.$message({
              message: '发布成功',
              type: 'success',
            })
            this.$router.push('/list')
          }
        })
      },
      prevFun() {
        this.$emit('prevFun')
      },
      async getCourseDetails() {
        const res = await getCourseDetails({ courseId: this.courseId })
        if (res.returnCode == 200) {
          console.log(res)
          this.detailInfos = res.returnData.totalScore
        }
      },
    },

    created() {},
    mounted() {
      if (this.editTag) {
        this.ruleForm = Object.assign(this.ruleForm, this.detailInfo)
      }
      this.getCourseDetails()
    },
  }
</script>

<style lang="scss" scoped>
  .setCertificate {
    display: flex;
    flex-direction: column;
    align-items: center;

    .bj_img {
      .imgUrl_wrap {
        width: 200px;
        height: 100px;
        border: 1px dashed #999;
        margin-top: 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      ::v-deep .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
</style>
