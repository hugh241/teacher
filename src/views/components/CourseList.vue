<template>
  <!-- 课程列表 -->
  <div>
    <div v-if="isYes=='1' && (!listData || listData.length == 0)">
      <el-empty description="暂未培训" :image-size="200"></el-empty>
    </div>
    <Tabble :tabbleList="tabbleList" :tableData="tableData">
      <template #status="scope">
        <span class="stateStyle" v-if="scope.row.state == 0">已发布</span>
        <span class="stateStyle1" v-if="scope.row.state == 2">未发布</span>
      </template>
      <template #edit="scope">
        <!-- <el-button style="color: #e58341" @click="changeState(scope.row.id, '2')"
          v-if="scope.row.state == 0 && (role == 1 || Number(role) - 2 == scope.row.level)" type="text">下线</el-button> -->
        <!-- <el-button
          style="color: #e58341"
          @click="changeState(scope.row.id, '2')"
          v-if="scope.row.state == 0"
          type="text"
          >下线</el-button
        > -->
        <!-- <el-button
          @click="changeState(scope.row.id, '0')"
          style="color: #e58341"
          v-if="scope.row.state == 2"
          type="text"
          >发布</el-button
        > -->
        <el-button v-if="userInfo.dbManagerRole.roleCode == '1001'" type="text" @click="goAdmin(scope.row)">管理</el-button>
        <el-button v-if="userInfo.dbManagerRole.roleCode == '1002'" type="text" @click="goKaoshi(scope.row)">考试</el-button>
        <!-- <el-button
          @click="changeState(scope.row.id, '1')"
          v-if="scope.row.state == 2"
          style="color: #f56c6c"
          type="text"
          >删除</el-button
        > -->
        <!-- <el-button
          @click="changeState(scope.row.id, '1')"
          v-if="role == 1 || Number(role) - 2 == scope.row.level"
          style="color: #f56c6c"
          type="text"
          >删除</el-button
        > -->
      </template>
    </Tabble>
    <div style="text-align: center; margin: 20px 0">
      <Pagination
        :total="total"
        @handlePageChange="handlePageChange"
      ></Pagination>
    </div>
    <!-- <div class="courseList">
      <div class="list-item" v-for="(item, index) in listData" :key="index"> -->
        <!-- 课程列表区域上半部分bg -->
        <!-- <div class="classBg" v-if="item.studyFiles"> -->
          <!-- 课程图 -->
          <!-- <img :src="item.studyFiles.filePath" alt="" /> -->
          <!-- 州县校 -->
          <!-- <div class="selectTag">
            <img v-if="item.level == 0" src="@/assets/images/learningCenter/shen.png" alt="" />
            <img v-if="item.level == 1" src="@/assets/images/learningCenter/zhou.png" alt="" />
            <img v-if="item.level == 2" src="@/assets/images/learningCenter/xian.png" alt="" />
            <img v-if="item.level == 3" src="@/assets/images/learningCenter/xiao.png" alt="" />
          </div>
        </div> -->
        <!-- 课程阶段 -->
        <!-- <div class="classStage" @click="handleCourseClick(item)">
          <p class="left" style="text-decoration: underline;">{{ item.courseName }}</p> -->
          <!-- <p class="right">
            <el-tag
              v-if="isInProgress(item)"
              type="success"
              size="small"
              >进行中</el-tag
            >
            <el-tag v-if="isNotStarted(item)" type="warning" size="small">未开始</el-tag>
            <el-tag v-if="isEnded(item)" type="info" size="small">已结束</el-tag>
          </p> -->
        <!-- </div> -->
        <!-- 课程时间 -->
        <!-- <div class="classTime">
          <p>{{ item.startDate }} 至 {{ item.endDate }}</p>
        </div> -->
        <!-- 课程学习人数 -->
        <!-- <div class="classStudy">
          <div class="left">
            <img src="@/assets/images/learningCenter/xuexirenshu.png" alt="" />
            <span>{{ item.studyUserCount }}人已学习</span>
          </div>
          <div class="right">
            <p>共{{ item.subsectionCount }}节</p>
          </div>
        </div> -->
      <!-- </div>
    </div> -->
  </div>
</template>

<script>
import { getTrainList } from "@/api/train";
import { getUserInfo } from '../../utils/auth'
  export default {
    components: {
      Tabble: () => import("@/components/tabble/index.vue"),
      Pagination: () => import("@/components/pagination/index.vue"),
    },
    props: ['listData', 'isYes'],
    created() {},
    mounted() {
    },
    data() {
      return {
        currentTimestamp: Date.now(),
        tableData: [],
        userInfo: getUserInfo(),
        tabbleList: [
          {
            type: "index",
            props: "",
            label: "序号",
            width: "60",
          },

          {
            props: "courseName",
            label: "课程名称",
            width: "560",
          },
          // {
          //   props: "startDate",
          //   label: "开始时间",
          // },
          // {
          //   props: "endDate",
          //   label: "结束时间",
          // },
          // {
          //   type: "custom",
          //   label: "发布状态",
          //   custom: "status",
          //   width: "120",
          // },
          {
            type: "custom",
            label: "操作",
            custom: "edit",
          },
        ],
        query: {
          courseName: "",
          level: "",
          pageNo: 1,
          pageSize: 10,
          type: "",
        },
      }
    },
    mounted() {
      this.getTrainList();
    },
    methods: {
      // 格式化日期为 yyyy-mm-dd
      formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      // 判断课程是否进行中
      isInProgress(item) {
        const today = new Date();
        const todayStr = this.formatDate(today); // 格式化为 yyyy-mm-dd
        
        const startDate = item.startDate; // 已经是 yyyy-mm-dd 格式
        const endDate = item.endDate; // 已经是 yyyy-mm-dd 格式
        
        // 直接比较字符串（因为都是 yyyy-mm-dd 格式）
        return startDate <= todayStr && endDate >= todayStr;
      },
      
      // 判断课程是否未开始
      isNotStarted(item) {
        const today = new Date();
        const todayStr = this.formatDate(today); // 格式化为 yyyy-mm-dd
        
        const startDate = item.startDate; // 已经是 yyyy-mm-dd 格式
        
        // 直接比较字符串
        return startDate > todayStr;
      },
      
      // 判断课程是否已结束
      isEnded(item) {
        const today = new Date();
        const todayStr = this.formatDate(today); // 格式化为 yyyy-mm-dd
        
        const endDate = item.endDate; // 已经是 yyyy-mm-dd 格式
        
        // 直接比较字符串
        return endDate < todayStr;
      },
      handleCourseClick(item) {
        // 触发自定义事件，将课程数据传递给父组件
        this.$emit('course-click', item);
        
        // 同时保留原有的跳转逻辑，确保不影响其他地方的使用
        // 如果父组件没有处理 course-click 事件，仍然会执行原有的跳转
        // this.goCourse(item.id);
      },
      //跳转培训列表
      goCourse(courseId) {
        this.$router.push({ path: `coursedatail?courseId=${courseId}` })
      },
      goAdmin(row) {
        this.$router.push({
          path: "/admin",
          query: { id: row.id, courseName: row.courseName },
        });
      },
      goKaoshi(row) {
        console.log('=====================row kaos', row);
        this.$router.push({
          path: "/topicList",
          query: { id: row.id, courseId: row.id, chapterId: row.chapterId },
        });
      },
      handlePageChange(current, pageSize) {
        this.query.pageNo = current;
        this.query.pageSize = pageSize;
        this.getTrainList();
      },
      // 获取培训列表
      getTrainList() {
        let formData = new FormData();
        Object.keys(this.query).map((key) => {
          formData.append(key, this.query[key]);
        });

        getTrainList(formData).then((res) => {
          if (res.returnCode == 200) {
            this.total = res.returnCount;
            this.tableData = res.returnData;
          }
        });
      }
    },
    
  }
</script>

<style lang="scss" scoped>
  .courseList {
    margin: 0 auto;
    display: flex;
    align-content: space-between;
    flex-wrap: wrap;
    // width: 1640px;
    img {
      width: 100%;
    }

    .list-item:hover {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    // .list-item:nth-child(5n) {
    //   margin-right: 0;
    // }

    .list-item {
      padding: 0 0 10px 0;
      background: linear-gradient(180deg, #eff5ff 0%, #ffffff 100%);
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
      border: 1px solid#D3EAFF;
      width: 306px;
      // height: 282px;
      margin-bottom: 21px;
      margin-right: 22px;

      .classBg {
        width: 100%;
        height: 174px;
        position: relative;

        img {
          width: 100%;
          height: 100%;
        }

        .selectTag {
          position: absolute;
          top: 0;
          left: 0;
          width: 65px;
          height: 28px;
        }
      }

      .classStage {
        overflow: hidden;
        margin: 10px 0px 10px 15px;

        .left {
          width: 228px;
          float: left;
          font-size: 16px;
          font-weight: 500;
          color: #000000;
          line-height: 24px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .right {
          float: right;
          padding-right: 8px;
        }
      }

      .classTime {
        padding: 0 15px;
        font-size: 14px;
        font-weight: 400;
        color: #979797;
        line-height: 21px;
      }

      .classStudy {
        width: 100%;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        margin-top: 20px;

        .left {
          padding: 0 15px;
          float: left;

          img {
            width: 20px;
            height: 20px;
            float: left;
          }

          span {
            padding-left: 10px;
            font-weight: 400;
            color: #000000;
            line-height: 22px;
          }
        }

        .right {
          float: right;
          padding-right: 8px;
          font-weight: 400;
          color: #000000;
          line-height: 22px;
        }
      }
    }
  }
</style>
