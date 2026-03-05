<!-- 查看更多 -->
<template>
  <div class="home">
    <BreadCrumb :type="1" />
    <div class="more">
      <!-- 筛选按钮 -->
      <div class="selectBtn">
        <div class="button-left">
          <SelectBtn :buttonName="buttonName2" @handleBtn="handleBtnTwo"></SelectBtn>
        </div>
      </div>
      <!-- 课程列表 -->
      <CourseList :isYes="1" :listData="listData" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" />
     
      <div class="fenye" v-show="listData.length > 0">
        <pagination :total="total" :current="payload.pageNo" @handlePageChange="handlePageChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import BreadCrumb from '@/components/Breadcrumb/index.vue'
  import CourseList from '@/views/components/CourseList.vue'
  import pagination from '@/components/pagination/index.vue'
  import SelectBtn from '@/views/components/SelectBtn.vue'
  import * as service from '@/api/getHome'

  export default {
    components: {
      BreadCrumb,
      CourseList,
      pagination,
      SelectBtn,
    },
    data() {
      return {
        //筛选按钮
        buttonName2: [
          {
            title: '全部',
            type: 0,
          },
          {
            title: '未开始',
            type: 1,
          },
          {
            title: '进行中',
            type: 2,
          },
          {
            title: '已结束',
            type: 3,
          },
        ],
        loading: false,
        //课程列表
        listData: [],
        //数据集合
        payload: {
          //课程名称
          courseName: '',
          //课程级别（0：省级；1：市级；2：区县级；3：校级）
          level: '',
          //课程状态（1：未开始，2：进行中，3: 已结束）
          type: '',
          pageNo: '1',
          pageSize: '10',
        }, //分页
        total: 0,
      }
    },
    mounted() {},
    methods: {
      //筛选第二行
      handleBtnTwo(item) {
        this.btnTwoIndex = item.type
        if (item.type == 0) {
          this.payload.pageNo = 1
          this.payload.type = ''
          this.getTrainList()
        } else if (item.type == 1) {
          this.payload.pageNo = 1
          this.payload.type = 1
          this.getTrainList()
        } else if (item.type == 2) {
          this.payload.pageNo = 1
          this.payload.type = 2
          this.getTrainList()
        } else if (item.type == 3) {
          this.payload.pageNo = 1
          this.payload.type = 3
          this.getTrainList()
        }
      },
      //课程列表
      async getTrainList() {
        this.loading = true
        this.payload.state = 0
        var res = await service.getTrainList(this.payload)
        if (res.returnCode == 200) {
          this.loading = false
          this.listData = res.returnData
          this.total = res.returnCount
        } else {
          this.$message.error('获取课程列表失败')
          this.loading = false
        }
      },
      //分页
      handlePageChange: function (current, pageSize) {
        this.payload.pageNo = current
        this.payload.pageSize = pageSize
        this.getTrainList()
      },
    },
    created() {
      console.log(this.$route.query.level)
      this.payload.level = this.$route.query.level

      this.getTrainList()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .more {
    margin: 10px;
    background: #fff;
    min-height: calc(100vh - 384px);
    padding: 0 30px;
    border-radius: 10px;

    .selectBtn {
      overflow: hidden;
      width: 96%;
      height: 100%;
      margin: 0 auto;
      font-size: 14px;

      .button-left {
        float: left;
        margin-top: 30px;
        width: 430px;
        height: 95px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        li {
          float: left;
          width: 100px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-weight: 500;
          border-radius: 100px 100px 100px 100px;
          cursor: pointer;
        }

        .active {
          background: #bfd9ff;
          color: #165dff;
        }
      }
    }

    .fenye {
      .el-pagination {
        display: flex;
        padding: 40px 0;
        justify-content: center !important;
      }
    }
  }
</style>
