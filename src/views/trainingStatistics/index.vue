<!-- 培训统计 -->
<template>
  <div class="train">
    <!-- 面包屑 -->
    <BreadCrumb></BreadCrumb>
    <div class="home_wrap">
      <div class="home">
        <div class="header">
          <h1>四川智慧教育平台教师专题培训统计分析</h1>
          <p>全面展示四川省教师培训参与情况与学习进度</p>
        </div>

        <div class="kpi-cards">
          <div class="kpi-card">
            <div class="kpi-title">今日参加培训总人数</div>
            <div class="kpi-value">
              {{ kpiData.todayParticipants.toLocaleString() }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">今日学习总时长</div>
            <div class="kpi-value">
              {{ kpiData.todayStudyHours.toLocaleString() }} 小时
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">近七天参加培训总人数</div>
            <div class="kpi-value">
              {{ kpiData.weekParticipants.toLocaleString() }}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">近七天学习总时长</div>
            <div class="kpi-value">
              {{ kpiData.weekStudyHours.toLocaleString() }} 小时
            </div>
          </div>
        </div>

        <!-- <div class="filters">
          <div class="filter-group">
            <div class="filter-item">
              <label for="timeRange">时间范围：</label>
              <el-date-picker
                v-model="filters.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                :shortcuts="dateShortcuts"
                style="width: 240px"
              />
            </div>
            <div class="filter-item">
              <label for="trainingCategory">所有培训：</label>
              <el-select
                v-model="filters.trainingCategory"
                placeholder="请选择培训类型"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="item in trainingCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="filter-item">
              <label for="region">市州筛选：</label>
              <el-select
                v-model="filters.region"
                placeholder="请选择市州"
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="item in regionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="filter-item">
              <label for="stage">分类筛选：</label>
              <el-select
                v-model="filters.stage"
                placeholder="请选择学段"
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="item in stageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <el-button type="primary" @click="applyFilters">应用筛选</el-button>
        </div> -->

        <div class="training-detail">
          <div class="training-header">
            <div class="training-title">{{ currentTraining.name }}</div>
            <div class="filter-item">
              <label for="trainingSelect">选择培训：</label>
              <el-select
                  v-model="selectedTraining"
                  placeholder="请选择培训"
                  @change="updateTrainingDetail"
                  style="width: 280px"
                  clearable
              >
                <el-option
                    v-for="item in trainingOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="training-stats">
            <div class="training-stat">
              <div class="training-stat-value">
                {{ currentTraining.participants.toLocaleString() }}
              </div>
              <div class="training-stat-label">参训人数</div>
            </div>
            <div class="training-stat">
              <div class="training-stat-value">
                {{ currentTraining.certified.toLocaleString() }}
              </div>
              <div class="training-stat-label">完成学时认证人数</div>
            </div>
            <div class="training-stat">
              <div class="training-stat-value">
                {{ currentTraining.totalHours.toLocaleString() }}
              </div>
              <div class="training-stat-label">总课时</div>
            </div>
            <div class="training-stat">
              <div class="training-stat-value">
                {{ currentTraining.avgHours }}
              </div>
              <div class="training-stat-label">人均学时数</div>
            </div>
          </div>
        </div>

        <div class="dashboard">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">月度参与培训人数趋势</div>
            </div>
            <div class="chart-container">
              <canvas id="monthlyTrendChart" ref="monthlyTrendChart"></canvas>
            </div>
            <div class="stat-summary">
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.monthly.totalParticipants.toLocaleString() }}
                </div>
                <div class="stat-label">本月总人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.monthly.growthRate }}
                </div>
                <div class="stat-label">月增长率</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.monthly.dailyAvg.toLocaleString() }}
                </div>
                <div class="stat-label">日均人数</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">参与人按市州划分</div>
            </div>
            <div class="chart-container">
              <canvas id="regionChart" ref="regionChart"></canvas>
            </div>
            <div class="stat-summary">
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.region.totalParticipants.toLocaleString() }}
                </div>
                <div class="stat-label">总参与人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{
                    chartSummary.region.maxRegionParticipants.toLocaleString()
                  }}
                </div>
                <div class="stat-label">最多市州人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.region.avgParticipants.toLocaleString() }}
                </div>
                <div class="stat-label">市州平均人数</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">参与人按学段分类划分</div>
            </div>
            <div class="chart-container">
              <canvas id="stageChart" ref="stageChart"></canvas>
            </div>
            <div class="stat-summary">
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.stage.totalParticipants.toLocaleString() }}
                </div>
                <div class="stat-label">总参与人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.stage.basicEducationPercent }}
                </div>
                <div class="stat-label">基础教育占比</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.stage.stageCount }}
                </div>
                <div class="stat-label">学段数量</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">参与人完成培训比例</div>
            </div>
            <div class="chart-container">
              <canvas id="completionChart" ref="completionChart"></canvas>
            </div>
            <div class="stat-summary">
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.completion.overallRate }}
                </div>
                <div class="stat-label">总体完成率</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.completion.completedCount.toLocaleString() }}
                </div>
                <div class="stat-label">已完成人数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.completion.incompleteCount.toLocaleString() }}
                </div>
                <div class="stat-label">未完成人数</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">参与人学习时长占比</div>
            </div>
            <div class="chart-container">
              <canvas id="durationChart" ref="durationChart"></canvas>
            </div>
            <div class="stat-summary">
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.duration.avgHours }}
                </div>
                <div class="stat-label">平均学习时长</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.duration.totalHours.toLocaleString() }}h
                </div>
                <div class="stat-label">总学习时长</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ chartSummary.duration.maxHours }}
                </div>
                <div class="stat-label">最长学习时长</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-container">
              <LeaderBoard :topData="topData" :totalNum="totalNum" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/Breadcrumb/index.vue";
import { mapGetters } from "vuex";
import LeaderBoard from "@/views/home/components/LeaderBoard.vue";
import {
  chooseCourseList,
  trainingCountByCondition,
  trainingHoursCount,
  courseUserByMonth,
  courseUserFinish,
  courseUserByCity,
  courseStudyTime,
  courseUserByTuition,
} from "@/api/statistics.js";
import { getStudyTopList } from "@/api/getHome";

import Chart from "chart.js";
export default {
  components: {
    BreadCrumb,
    LeaderBoard,
  },
  data() {
    return {
      //top数据
      topData: [],
      totalNum: 0,
      kpiData: {
        todayParticipants: 0,
        todayStudyHours: 0,
        weekParticipants: 0,
        weekStudyHours: 0,
      },
      filters: {
        dateRange: [],
        trainingCategory: "",
        region: "",
        stage: "",
      },
      selectedTraining: "",
      currentTraining: {
        name: "请选择培训",
        participants: 0,
        certified: 0,
        totalHours: 0,
        avgHours: 0,
      },
      trainingDetails: {},
      chartSummary: {
        monthly: {
          totalParticipants: 0,
          growthRate: "0",
          dailyAvg: 0,
        },
        region: {
          totalParticipants: 0,
          maxRegionParticipants: 0,
          avgParticipants: 0,
        },
        stage: {
          totalParticipants: 0,
          basicEducationPercent: "0",
          stageCount: 0,
        },
        completion: {
          overallRate: "0",
          completedCount: 0,
          incompleteCount: 0,
        },
        duration: {
          avgHours: "0",
          totalHours: 0,
          maxHours: "0",
        },
      },
      charts: {},
      // Element UI 选项数据
      dateShortcuts: [
        {
          text: "最近一周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "最近一个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "最近三个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ],
      trainingCategoryOptions: [
        { value: "all", label: "全部培训" },
        { value: "new-teacher", label: "新教师培训" },
        { value: "subject", label: "学科教学能力提升" },
        { value: "management", label: "教育管理培训" },
        { value: "technology", label: "教育技术应用" },
        { value: "moral", label: "师德师风建设" },
      ],
      regionOptions: [
        { value: "all", label: "全部市州" },
        { value: "chengdu", label: "成都市" },
        { value: "mianyang", label: "绵阳市" },
        { value: "dazhou", label: "达州市" },
        { value: "nanchong", label: "南充市" },
        { value: "yibin", label: "宜宾市" },
      ],
      stageOptions: [
        { value: "all", label: "全部学段" },
        { value: "basic", label: "基础教育" },
        { value: "vocational", label: "职业教育" },
        { value: "higher", label: "高等教育" },
      ],
      trainingOptions: [], // 从接口获取的培训列表
      courseList: [], // 存储原始课程数据
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    userId() {
      return this.userInfo.userId;
    },
  },
  mounted() {
    this.initCharts();
    // 加载培训数据
    this.loadTrainingList();
    this.loadMonthlyData();
    this.loadCompletionData();
    this.loadRegionData();
    this.loadDurationData();
    this.loadStageData();
    this.loadKpiData();
  },
  methods: {
    getStudyTopListData() {
      let params = {
        courseId: this.selectedTraining,
      };
      getStudyTopList(params).then((res) => {
        if (res.returnCode == 200) {
          // console.log('xx',res);
          this.topData = res.returnData.studyTopList;
          this.topData.sort((a, b) => b.totalTime - a.totalTime);
          // console.log('排行',this.topData);
          this.totalNum = res.returnData.studyUserCount;
        } else {
          this.$message.error("获取排名信息失败");
          return;
        }
      });
    },
    initCharts() {
      // 月度趋势数据
      const monthlyTrendData = {
        labels: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        datasets: [
          {
            label: "参与人数",
            data: [],
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      // 四川省21个市州数据
      const regionData = {
        labels: [
          "成都市",
          "绵阳市",
          "自贡市",
          "攀枝花市",
          "泸州市",
          "德阳市",
          "广元市",
          "遂宁市",
          "内江市",
          "乐山市",
          "南充市",
          "眉山市",
          "宜宾市",
          "广安市",
          "达州市",
          "雅安市",
          "巴中市",
          "资阳市",
          "阿坝州",
          "甘孜州",
          "凉山州",
        ],
        datasets: [
          {
            label: "参与人数",
            data: [],
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(201, 203, 207, 0.7)",
              "rgba(255, 205, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(201, 203, 207, 0.7)",
              "rgba(255, 205, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(153, 102, 255, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(201, 203, 207, 0.7)",
              "rgba(255, 205, 86, 0.7)",
            ],
            borderColor: [
              "rgb(54, 162, 235)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
              "rgb(201, 203, 207)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
              "rgb(201, 203, 207)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(255, 159, 64)",
              "rgb(255, 99, 132)",
              "rgb(201, 203, 207)",
              "rgb(255, 205, 86)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // 学段数据
      const stageData = {
        labels: ["基础教育", "职业教育", "高等教育"],
        datasets: [
          {
            label: "参与人数",
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 205, 86, 0.7)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // 完成培训比例数据
      const completionData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 205, 86, 0.7)",
              "rgba(255, 99, 132, 0.7)",
            ],
            borderColor: [
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(255, 99, 132)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // 学习时长占比数据
      const durationData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 205, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // 初始化图表
      this.$nextTick(() => {
        // 月度趋势折线图
        this.charts.monthlyTrend = new Chart(this.$refs.monthlyTrendChart, {
          type: "line",
          data: monthlyTrendData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return `参与人数: ${tooltipItem.yLabel}人`;
                },
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "参与人数",
                  },
                },
              ],
            },
          },
        });

        // 区域划分柱状图
        this.charts.region = new Chart(this.$refs.regionChart, {
          type: "bar",
          data: regionData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return `参与人数: ${tooltipItem.yLabel}人`;
                },
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "参与人数",
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
              ],
            },
          },
        });

        // 学段划分柱状图
        this.charts.stage = new Chart(this.$refs.stageChart, {
          type: "bar",
          data: stageData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return `参与人数: ${tooltipItem.yLabel}人`;
                },
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "参与人数",
                  },
                },
              ],
            },
          },
        });

        // 完成培训比例饼状图
        this.charts.completion = new Chart(this.$refs.completionChart, {
          type: "pie",
          data: completionData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "right",
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const dataset = data.datasets[tooltipItem.datasetIndex];
                  const value = dataset.data[tooltipItem.index];
                  const label = data.labels[tooltipItem.index];
                  return `${label}: ${value}人`;
                },
              },
            },
          },
        });

        // 学习时长占比饼状图
        this.charts.duration = new Chart(this.$refs.durationChart, {
          type: "pie",
          data: durationData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "right",
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  const dataset = data.datasets[tooltipItem.datasetIndex];
                  const value = dataset.data[tooltipItem.index];
                  const label = data.labels[tooltipItem.index];
                  return `${label}: ${value}%`;
                },
              },
            },
          },
        });
      });
    },
    // 获取月度数据的方法
    async loadMonthlyData() {
      const response = await courseUserByMonth({
        // courseId: this.selectedTraining || null,
        // 可以根据需要添加其他筛选参数
      });

      if (response && response.returnCode === "200") {
        const data = response.returnData;

        // 更新图表数据
        this.updateMonthlyChart(data);

        // 更新统计摘要
        this.updateMonthlySummary(data);
      } else {
        this.$message.error(response?.returnMessage || "获取月度数据失败");
      }
    },

    // 更新月度趋势图表
    updateMonthlyChart(monthlyData) {
      if (!this.charts.monthlyTrend) return;

      const monthLabels = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ];

      // 从接口数据中提取各月份的用户数量
      const userCounts = Array(12).fill(0);
      monthlyData.courseUserByMonthInfoList.forEach((item) => {
        const monthIndex = parseInt(item.month) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          userCounts[monthIndex] = item.userCount || 0;
        }
      });

      // 更新图表数据
      this.charts.monthlyTrend.data.labels = monthLabels;
      this.charts.monthlyTrend.data.datasets[0].data = userCounts;

      // 更新图表
      this.charts.monthlyTrend.update();
    },

    // 更新月度统计摘要
    updateMonthlySummary(monthlyData) {
      this.chartSummary.monthly = {
        totalParticipants: monthlyData.userTotal || 0,
        growthRate: monthlyData.increaseRate
            ? `${monthlyData.increaseRate}%`
            : "0%",
        dailyAvg: monthlyData.userAverage || 0,
      };
    },

    // 参与人完成培训比例数据的方法
    async loadCompletionData() {
      const response = await courseUserFinish({
        // courseId: this.selectedTraining || null,
        // 可以根据需要添加其他筛选参数
      });

      if (response && response.returnCode === "200") {
        const data = response.returnData;

        // 更新图表数据
        this.updateCompletionChart(data);

        // 更新统计摘要
        this.updateCompletionSummary(data);
      } else {
        this.$message.error(response?.returnMessage || "获取完成率数据失败");
      }
    },

    // 更新完成培训比例图表
    updateCompletionChart(completionData) {
      if (!this.charts.completion) return;

      const finishRate = completionData.userFinishRate || 0;
      const unFinishRate = 1 - finishRate; // 计算未完成率

      // 更新图表数据 - 使用百分比
      this.charts.completion.data.labels = ["已完成", "未完成"];
      this.charts.completion.data.datasets[0].data = [
        finishRate * 100, // 转换为百分比
        unFinishRate * 100, // 转换为百分比
      ];

      // 更新图表颜色
      this.charts.completion.data.datasets[0].backgroundColor = [
        "rgba(75, 192, 192, 0.7)",
        "rgba(255, 205, 86, 0.7)",
      ];
      this.charts.completion.data.datasets[0].borderColor = [
        "rgb(75, 192, 192)",
        "rgb(255, 205, 86)",
      ];

      // 更新图表提示框，显示百分比格式
      this.charts.completion.options.tooltips.callbacks.label = function (
          tooltipItem,
          data
      ) {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const value = dataset.data[tooltipItem.index];
        const label = data.labels[tooltipItem.index];
        return `${label}: ${value.toFixed(1)}%`;
      };

      // 更新图表
      this.charts.completion.update();
    },

    // 更新完成率统计摘要
    updateCompletionSummary(completionData) {
      const finishRate = completionData.userFinishRate || 0;
      const completedCount = completionData.finishCount || 0;
      const inProgressCount = completionData.unFinishCount || 0;

      this.chartSummary.completion = {
        overallRate: `${(finishRate * 100).toFixed(1)}%`, // 转换为百分比格式
        completedCount: completedCount,
        incompleteCount: inProgressCount, // 这里实际上显示的是进行中人数
      };
    },

    // 获取市州数据的方法
    async loadRegionData() {
      const response = await courseUserByCity({
        // courseId: this.selectedTraining || null,
        // 可以根据需要添加其他筛选参数
      });

      if (response && response.returnCode === "200") {
        const data = response.returnData;

        // 更新图表数据
        this.updateRegionChart(data);

        // 更新统计摘要
        this.updateRegionSummary(data);
      } else {
        this.$message.error(response?.returnMessage || "获取市州数据失败");
      }
    },

    // 更新市州划分图表
    updateRegionChart(regionData) {
      if (!this.charts.region) return;

      const cityNames = [];
      const userCounts = [];

      regionData.courseCityUserInfoList.forEach((item) => {
        cityNames.push(item.cityName);
        userCounts.push(item.userCount || 0);
      });

      // 更新图表数据
      this.charts.region.data.labels = cityNames;
      this.charts.region.data.datasets[0].data = userCounts;

      // 动态生成颜色
      const backgroundColors = [];
      const borderColors = [];

      const colorPalette = [
        { bg: "rgba(54, 162, 235, 0.7)", border: "rgb(54, 162, 235)" },
        { bg: "rgba(75, 192, 192, 0.7)", border: "rgb(75, 192, 192)" },
        { bg: "rgba(153, 102, 255, 0.7)", border: "rgb(153, 102, 255)" },
        { bg: "rgba(255, 159, 64, 0.7)", border: "rgb(255, 159, 64)" },
        { bg: "rgba(255, 99, 132, 0.7)", border: "rgb(255, 99, 132)" },
        { bg: "rgba(201, 203, 207, 0.7)", border: "rgb(201, 203, 207)" },
        { bg: "rgba(255, 205, 86, 0.7)", border: "rgb(255, 205, 86)" },
      ];

      for (let i = 0; i < cityNames.length; i++) {
        const colorIndex = i % colorPalette.length;
        backgroundColors.push(colorPalette[colorIndex].bg);
        borderColors.push(colorPalette[colorIndex].border);
      }

      this.charts.region.data.datasets[0].backgroundColor = backgroundColors;
      this.charts.region.data.datasets[0].borderColor = borderColors;

      // 更新图表
      this.charts.region.update();
    },

    // 更新市州统计摘要
    updateRegionSummary(regionData) {
      this.chartSummary.region = {
        totalParticipants: regionData.userTotal || 0,
        maxRegionParticipants: regionData.maxCity || 0,
        avgParticipants: regionData.userAverage || 0,
      };
    },

    // 获取学习时长数据的方法
    async loadDurationData() {
      const response = await courseStudyTime({
        // courseId: this.selectedTraining || null,
        // 可以根据需要添加其他筛选参数
      });

      if (response && response.returnCode === "200") {
        const data = response.returnData;

        // 更新图表数据
        this.updateDurationChart(data);

        // 更新统计摘要
        this.updateDurationSummary(data);
      } else {
        this.$message.error(response?.returnMessage || "获取学习时长数据失败");
      }
    },

    // 更新学习时长占比图表
    updateDurationChart(durationData) {
      if (!this.charts.duration) return;

      const groupNames = [];
      const userCountRates = [];

      // 从接口数据中动态获取所有分组信息
      const allGroups = [];
      const groupDataMap = {};

      // 首先收集所有分组信息
      durationData.courseStudyTimeUserInfoList.forEach((item) => {
        allGroups.push({
          code: item.groupCode,
          name: item.groupName,
        });
        groupDataMap[item.groupCode] = {
          userCountRate: item.userCountRate || 0,
          groupName: item.groupName,
        };
      });

      // 如果没有数据，使用默认分组
      if (allGroups.length === 0) {
        const defaultGroups = [
          { code: "001", name: "0-20小时" },
          { code: "002", name: "20-40小时" },
          { code: "003", name: "40-60小时" },
          { code: "004", name: "60-80小时" },
          { code: "005", name: "80小时以上" },
        ];

        defaultGroups.forEach((group) => {
          allGroups.push(group);
          groupDataMap[group.code] = {
            userCountRate: 0,
            groupName: group.name,
          };
        });
      }

      // 按照分组代码排序，确保显示顺序一致
      allGroups.sort((a, b) => a.code.localeCompare(b.code));

      // 构建图表数据 - 将 userCountRate 转换为百分比
      allGroups.forEach((group) => {
        groupNames.push(group.name);
        const rate = groupDataMap[group.code]?.userCountRate || 0;
        // 将小数转换为百分比（如 1 -> 100, 0.5 -> 50）
        userCountRates.push(rate);
      });

      // 更新图表数据
      this.charts.duration.data.labels = groupNames;
      this.charts.duration.data.datasets[0].data = userCountRates;

      // 动态生成颜色
      const backgroundColors = [];
      const borderColors = [];

      const colorPalette = [
        { bg: "rgba(255, 99, 132, 0.7)", border: "rgb(255, 99, 132)" },
        { bg: "rgba(54, 162, 235, 0.7)", border: "rgb(54, 162, 235)" },
        { bg: "rgba(255, 205, 86, 0.7)", border: "rgb(255, 205, 86)" },
        { bg: "rgba(75, 192, 192, 0.7)", border: "rgb(75, 192, 192)" },
        { bg: "rgba(153, 102, 255, 0.7)", border: "rgb(153, 102, 255)" },
        { bg: "rgba(201, 203, 207, 0.7)", border: "rgb(201, 203, 207)" },
        { bg: "rgba(255, 159, 64, 0.7)", border: "rgb(255, 159, 64)" },
      ];

      for (let i = 0; i < groupNames.length; i++) {
        const colorIndex = i % colorPalette.length;
        backgroundColors.push(colorPalette[colorIndex].bg);
        borderColors.push(colorPalette[colorIndex].border);
      }

      this.charts.duration.data.datasets[0].backgroundColor = backgroundColors;
      this.charts.duration.data.datasets[0].borderColor = borderColors;

      // 更新图表提示框，显示百分比格式
      this.charts.duration.options.tooltips.callbacks.label = function (
          tooltipItem,
          data
      ) {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const value = dataset.data[tooltipItem.index];
        const label = data.labels[tooltipItem.index];
        return `${label}: ${value}%`;
      };

      // 更新图表
      this.charts.duration.update();
    },

    // 更新学习时长统计摘要
    updateDurationSummary(durationData) {
      this.chartSummary.duration = {
        avgHours: `${durationData.averageStudyTime || 0}h`,
        totalHours: durationData.totalStudyTime || 0,
        maxHours: `${durationData.maxStudyTime || 0}h`,
      };
    },

    // 获取学段数据的方法
    async loadStageData() {
      const response = await courseUserByTuition({
        // courseId: this.selectedTraining || null,
        // 可以根据需要添加其他筛选参数
      });

      if (response && response.returnCode === "200") {
        const data = response.returnData;

        // 更新图表数据
        this.updateStageChart(data);

        // 更新统计摘要
        this.updateStageSummary(data);
      } else {
        this.$message.error(response?.returnMessage || "获取学段数据失败");
      }
    },

    // 更新学段分类图表
    updateStageChart(stageData) {
      if (!this.charts.stage) return;

      const stageNames = [];
      const userCounts = [];

      // 遍历 courseTuitionUserInfoMap 对象
      if (stageData.courseTuitionUserInfoMap) {
        Object.entries(stageData.courseTuitionUserInfoMap).forEach(
            ([stageName, count]) => {
              stageNames.push(stageName);
              userCounts.push(count || 0);
            }
        );
      }

      // 如果没有数据，使用默认的学段分类
      if (stageNames.length === 0) {
        stageNames.push("基础教育", "职业教育", "高等教育");
        userCounts.push(0, 0, 0);
      }

      // 更新图表数据
      this.charts.stage.data.labels = stageNames;
      this.charts.stage.data.datasets[0].data = userCounts;

      // 动态生成颜色
      const backgroundColors = [];
      const borderColors = [];

      const colorPalette = [
        { bg: "rgba(255, 99, 132, 0.7)", border: "rgb(255, 99, 132)" },
        { bg: "rgba(54, 162, 235, 0.7)", border: "rgb(54, 162, 235)" },
        { bg: "rgba(255, 205, 86, 0.7)", border: "rgb(255, 205, 86)" },
        { bg: "rgba(75, 192, 192, 0.7)", border: "rgb(75, 192, 192)" },
        { bg: "rgba(153, 102, 255, 0.7)", border: "rgb(153, 102, 255)" },
        { bg: "rgba(201, 203, 207, 0.7)", border: "rgb(201, 203, 207)" },
      ];

      for (let i = 0; i < stageNames.length; i++) {
        const colorIndex = i % colorPalette.length;
        backgroundColors.push(colorPalette[colorIndex].bg);
        borderColors.push(colorPalette[colorIndex].border);
      }

      this.charts.stage.data.datasets[0].backgroundColor = backgroundColors;
      this.charts.stage.data.datasets[0].borderColor = borderColors;

      // 更新图表
      this.charts.stage.update();
    },

    // 更新学段统计摘要
    updateStageSummary(stageData) {
      // 计算基础教育占比（如果有基础教育数据）
      let basicEducationPercent = "0%";
      if (
          stageData.courseTuitionUserInfoMap &&
          stageData.courseTuitionUserInfoMap["基础教育"]
      ) {
        const basicEducationCount =
            stageData.courseTuitionUserInfoMap["基础教育"];
        const totalCount = stageData.userCount || 0;
        if (totalCount > 0) {
          basicEducationPercent = `${(
              (basicEducationCount / totalCount) *
              100
          ).toFixed(1)}%`;
        }
      } else if (stageData.rate) {
        // 如果接口直接提供了占比数据
        basicEducationPercent = `${(stageData.rate * 100).toFixed(1)}%`;
      }

      this.chartSummary.stage = {
        totalParticipants: stageData.userCount || 0,
        basicEducationPercent: basicEducationPercent,
        stageCount: stageData.categoryCount || 0,
      };
    },

    // 加载培训列表
    async loadTrainingList() {
      const response = await chooseCourseList({});
      if (response && response.returnCode == 200) {
        this.courseList = response.returnData || [];
        this.formatTrainingOptions();

        // 如果有数据，默认选择第一个
        if (this.trainingOptions.length > 0) {
          this.selectedTraining = this.trainingOptions[0].value;
          await this.updateTrainingDetail();
          // 确保 selectedTraining 设置完成后再调用排行榜数据
          // await this.getStudyTopListData();
        }
      } else {
        this.$message.error(response?.msg || "获取培训列表失败");
      }
    },

    // 格式化培训选项
    formatTrainingOptions() {
      this.trainingOptions = this.courseList.map((course) => ({
        value: course.id, // 使用培训id作为value
        label: course.courseName, // 使用培训名称作为label
      }));

      // 同时构建培训详情数据（用于显示培训名称）
      this.trainingDetails = {};
      this.courseList.forEach((course) => {
        this.trainingDetails[course.id] = {
          name: course.courseName,
          participants: 0,
          certified: 0,
          totalHours: 0,
          avgHours: 0,
        };
      });
    },

    async loadData() {
      try {
        // 在实际应用中，这里会调用API获取数据
        // const response = await service.getTrainingStatistics();
        // 这里使用模拟数据，实际使用时替换为API返回的数据
        console.log("加载培训统计数据");
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    },

    // 更新培训详情 - 调用接口获取真实数据
    async updateTrainingDetail() {
      if (!this.selectedTraining) {
        this.currentTraining = {
          name: "请选择培训",
          participants: 0,
          certified: 0,
          totalHours: 0,
          avgHours: 0,
        };
        return;
      }

      // 只调用 trainingCountByCondition 接口
      const trainingCountResponse = await trainingCountByCondition({
        courseId: this.selectedTraining,
      });

      if (trainingCountResponse && trainingCountResponse.returnCode === "200") {
        const data = trainingCountResponse.returnData;
        const trainingName =
            this.trainingDetails[this.selectedTraining]?.name || "未知培训";

        this.currentTraining = {
          name: trainingName,
          participants: data.studyUserCount || 0,
          certified: data.completeUserHours || 0,
          totalHours: data.totalHoursCount || 0,
          avgHours: data.perCapitaHours || "0.00",
        };
      } else {
        this.$message.error(
            trainingCountResponse?.returnMessage || "获取培训详情失败"
        );
      }
      await this.getStudyTopListData();
    },

    async loadKpiData() {
      const trainingHoursResponse = await trainingHoursCount({
        // 不传递 courseId 参数
      });

      // 处理今日和近七天数据
      if (trainingHoursResponse && trainingHoursResponse.returnCode === "200") {
        const hoursData = trainingHoursResponse.returnData;

        // 更新 KPI 数据
        this.kpiData = {
          todayParticipants: hoursData.todayUserCount || 0,
          todayStudyHours: parseFloat(hoursData.todayUserHours) || 0,
          weekParticipants: hoursData.sevenUserCount || 0,
          weekStudyHours: parseFloat(hoursData.sevenUserHours) || 0,
        };
      } else {
        this.$message.error(
            trainingHoursResponse?.returnMessage || "获取培训时长数据失败"
        );
      }
    },

    applyFilters() {
      // 在实际应用中，这里应该根据筛选条件重新获取数据并更新图表
      console.log("应用筛选条件:", this.filters);
      this.$message.success("筛选条件已更新，图表数据将根据新条件重新加载");

      // 模拟数据更新
      // this.loadData();
    },
  },

  created() {
    this.charts = {};
  },

  beforeDestroy() {
    // 销毁所有图表实例
    Object.values(this.charts).forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  min-height: calc(100vh - 148px);
  padding: 20px;
  border-radius: 10px;
}

// 从HTML中复制的样式，转换为SCSS
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.kpi-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.kpi-value {
  font-size: 28px;
  font-weight: bold;
  color: #1e88e5;
  margin-bottom: 5px;
}

.kpi-trend {
  font-size: 12px;
  color: #4caf50;
  display: flex;
  align-items: center;
}

.kpi-trend.down {
  color: #f44336;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  gap: 15px;
}

.filter-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: bold;
  color: #555;
  white-space: nowrap;
}

.training-detail {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.training-detail:hover {
  transform: translateY(-5px);
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.training-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.training-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.training-stat {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.training-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1e88e5;
  margin-bottom: 5px;
}

.training-stat-label {
  font-size: 14px;
  color: #666;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 25px;
}

.chart-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.stat-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #1e88e5;
}

.stat-label {
  font-size: 12px;
  color: #777;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }

  .chart-card {
    padding: 15px;
  }

  .chart-container {
    height: 250px;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .training-stats {
    grid-template-columns: 1fr;
  }

  .home {
    width: 100%;
    padding: 10px;
  }

  .filter-group {
    flex-direction: column;
    width: 100%;
  }

  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
