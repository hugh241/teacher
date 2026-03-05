<template>
  <el-pagination background layout="total,prev, pager, next,sizes" v-if="total" :total="total" :page-size="pageSize"
    :page-sizes="pageArr" :current-page.sync="current" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageArr: {
      type: Array,
      default: () => [10],
    },


  },
  data() {
    return {
      current: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.current = val;
      this.$emit('handlePageChange', this.current, this.pageSize)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('handlePageChange', this.current, this.pageSize)
    },
  },
  watch: {
    total() {
      this.current = 1;
      this.pageSize = 10;
    }
  }

};
</script>
<style scoped lang="scss">
::v-deep.el-pagination.is-background .btn-prev,
::v-deep.el-pagination.is-background .btn-next,
::v-deep.el-pagination.is-background .el-pager li {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #606266;
  min-width: 32px !important;
  border-radius: 6px;
  height: 32px;
  line-height: 32px;
}

::v-deep.el-pagination .el-select .el-input .el-input__inner {
  padding-right: 25px;
  border-radius: 6px;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
