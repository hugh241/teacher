<template>
  <el-dialog :title="title" :visible.sync="show" :width="width" append-to-body :before-close="handleClose" :close-on-click-modal="false">
    <slot name="body"></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
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
    },
    data() {
      return {}
    },
    methods: {
      handleClose() {
        this.$emit('close')
      },
      handleSave() {
        this.$emit('save')
      },
    },
  }
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog__header {
    background-color: #fff;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
  }

  ::v-deep .el-dialog__headerbtn {
    color: #cccccc;
  }

  ::v-deep .el-dialog__title {
    color: #000000;
  }

  ::v-deep .el-dialog__footer {
    text-align: right;
    margin-right: 40px;
    margin-top: 30px;
  }

  ::v-deep .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
</style>
