<!--
 * @Date: 2022-11-28 00:25:12
 * @LastEditTime: 2022-12-08 23:00:39
 * @FilePath: /campus-security-vue/src/views/potential/components/add.vue
 * @Description:这是新创建的页面
-->
<template>
  <Editpop :show="show" :title="title" @close="handelClose" :width="width" @save="handelSave">
    <div slot="body">
      <el-form ref="form" :model="form" label-width="140px" :rules="rules">
        <el-row>
          <el-col :span="22">
            <el-form-item label="分数：">
              <span class="box1" v-html="editData.score ? editData.score : '暂未打分'"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="心得：">
              <span v-html="editData.content"></span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="文件列表：">
              <el-table :data="editData.studyFiles" border style="width: 100%" :header-cell-style="{ 'background-color': '#F7F8FA' }">
                <el-table-column prop="fileName" label="文件名称"> </el-table-column>
                <el-table-column prop="fileType" label="文件类型"> </el-table-column>
                <el-table-column prop="fileSize" label="文件大小(KB)"> </el-table-column>
                <el-table-column prop="address" label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewClick(scope.row)">预览</el-button>
                    <el-button type="text" @click="downClick(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </Editpop>
</template>

<script>
  import Editpop from '@/components/Editpop/index.vue'
  import utils from '@/utils/downLoad.js'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
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
      return {
        form: {},
        rules: {},
      }
    },
    created() {},
    mounted() {},
    methods: {
      /**
       * @event:
       * @return {*}
       * @description: 交互
       */
      // downClick(val) {
      //   window.open(val.filePath)
      // },
      viewClick(val) {
        window.open(val.viewUrl)
      },
      handelClose() {
        this.$emit('close')
      },
      handelSave() {
        this.$emit('save')
        // this.$refs.form.validate(valid => {
        //   if (valid) {
        //     if (this.title == '新增') {
        //       this.$emit('save', this.params)
        //     }
        //     if (this.title == '编辑') {
        //       this.$emit('save', this.params)
        //     }
        //   }
        // })
      },
      downClick(row) {
        let query = {
          url: row.filePath,
        }
        axios({
          url: process.env.VUE_APP_BASE_API + '/file/download',
          method: 'get',
          params: query,
          headers: {
            'X-Token': getToken(),
          },
          onDownloadProgress: pro => {},
          responseType: 'blob', // important
        }).then(res => {
          const filename = decodeURIComponent(row.fileName)
          let blob = new Blob([res.data])
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = filename
          document.body.appendChild(downloadElement)
          downloadElement.click()
          window.URL.revokeObjectURL(href)
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
  .box1 {
    color: rgba(82, 196, 26, 1);
    border: 1px solid #cedfbb;
    padding: 1px 5px;
  }
</style>
