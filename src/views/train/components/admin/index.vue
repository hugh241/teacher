<!--培训任务列表  -->
<template>
  <div class="adminLits">
    <SelectBtn style="marginBottom: 70px; justifyContent: center" :buttonName="stepList" @handleBtn="handleBtn">
    </SelectBtn>
    <component v-bind:is="activeName" :key="activeName" @changeStepList="changeStepList" :courseId="courseId" :seName="courseName"
      :editTag="true" :isHomework="isHomework" :isExperience="isExperience"></component>
  </div>
</template>

<script>
import { getCourseDetails } from "@/api/admin.js";
import { mapGetters } from "vuex";
export default {
  components: {
    SelectBtn: () => import("@/views/components/SelectBtn.vue"),
    setInfo: () => import("./components/setInfo.vue"),
    setSubmit: () => import("./components/setSubmit.vue"),
    setChapter: () => import("./components/setChapter.vue"),
    // setTopic: () => import('./components/setTopic.vue'),
    setTopic: () =>
      import("@/views/train/components/publish/components/setTopic.vue"),
    setExperience: () => import("./components/setExperience.vue"),
    homework: () => import("./components/homework.vue"),
    answer: () => import("./components/answer.vue"),
    people: () => import("./components/people.vue"),
    certificate: () => import("./components/certificate.vue"),
  },
  data() {
    return {
      role: null,
      courseDetail: {},
      courseId: "",
      courseName:'',
      activeName: "setInfo",
      isExperience: "",
      isHomework: "",
      stepList: [
        {
          title: "基本信息管理",
          activeName: "setInfo",
        },
        {
          title: "提交任务要求管理",
          activeName: "setSubmit",
        },
        {
          title: "章节管理",
          activeName: "setChapter",
        },
        {
          title: "试卷管理",
          activeName: "setTopic",
        },
        {
          title: "心得管理",
          activeName: "setExperience",
        },
        {
          title: "培训作业管理",
          activeName: "homework",
        },
        {
          title: "答题记录管理",
          activeName: "answer",
        },
        {
          title: "人员信息",
          activeName: "people",
        },
        {
          title: "证书设置",
          activeName: "certificate",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    stepList(a, b) {
      console.log('菜单修改', this.userType)
    }
  },
  methods: {
    // 菜单渲染
    changeStepList(isExperience, isHomework) {

      this.isExperience = isExperience;
      this.isHomework = isHomework;

      // if (Number(this.role) - 2 == this.courseDetail.level) {
      if (this.courseDetail.level) {

        this.stepList = [
          {
            title: "基本信息管理",
            activeName: "setInfo",
          },
          {
            title: "提交任务要求管理",
            activeName: "setSubmit",
          },
          {
            title: "章节管理",
            activeName: "setChapter",
          },
          {
            title: "试卷管理",
            activeName: "setTopic",
          },
          {
            title: "心得管理",
            activeName: "setExperience",
          },
          {
            title: "培训作业管理",
            activeName: "homework",
          },
          {
            title: "答题记录管理",
            activeName: "answer",
          },
          {
            title: "人员信息",
            activeName: "people",
          },
          {
            title: "证书设置",
            activeName: "certificate",
          },
        ];
        if (this.isExperience == "1" && this.isHomework == "0") {
          this.stepList = [
            {
              title: "基本信息管理",
              activeName: "setInfo",
            },
            {
              title: "提交任务要求管理",
              activeName: "setSubmit",
            },
            {
              title: "章节管理",
              activeName: "setChapter",
            },
            {
              title: "试卷管理",
              activeName: "setTopic",
            },
            {
              title: "心得管理",
              activeName: "setExperience",
            },
            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },
            {
              title: "证书设置",
              activeName: "certificate",
            },
          ];
        }
        else if (this.isExperience == "0" && this.isHomework == "1") {
          this.stepList = [
            {
              title: "基本信息管理",
              activeName: "setInfo",
            },
            {
              title: "提交任务要求管理",
              activeName: "setSubmit",
            },
            {
              title: "章节管理",
              activeName: "setChapter",
            },
            {
              title: "试卷管理",
              activeName: "setTopic",
            },
            {
              title: "培训作业管理",
              activeName: "homework",
            },
            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },
            {
              title: "证书设置",
              activeName: "certificate",
            },
          ];
        }
        else if (this.isExperience == "0" && this.isHomework == "0") {
          console.log('触发了', this.isExperience, this.isHomework)
          this.stepList = [
            {
              title: "基本信息管理",
              activeName: "setInfo",
            },
            {
              title: "章节管理",
              activeName: "setChapter",
            },
            {
              title: "试卷管理",
              activeName: "setTopic",
            },
            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },
            {
              title: "证书设置",
              activeName: "certificate",
            },
          ];
        }

      } else {
        this.stepList = [

          {
            title: "心得管理",
            activeName: "setExperience",
          },
          {
            title: "培训作业管理",
            activeName: "homework",
          },
          {
            title: "答题记录管理",
            activeName: "answer",
          },
          {
            title: "人员信息",
            activeName: "people",
          },

        ];
        this.activeName = "setExperience";
        if (this.isExperience == "1" && this.isHomework == "0") {
          this.stepList = [

            {
              title: "心得管理",
              activeName: "setExperience",
            },
            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },

          ];
          this.activeName = "setExperience";
        }
        else if (this.isExperience == "0" && this.isHomework == "1") {
          this.stepList = [

            {
              title: "培训作业管理",
              activeName: "homework",
            },
            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },

          ];
          this.activeName = "homework";
        }
        else if (this.isExperience == "0" && this.isHomework == "0") {
          this.stepList = [


            {
              title: "答题记录管理",
              activeName: "answer",
            },
            {
              title: "人员信息",
              activeName: "people",
            },

          ];
          this.activeName = "answer";
        }

      }


    },

    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId });
      if (res.returnCode == 200) {
        this.courseDetail = res.returnData;
        this.isExperience = res.returnData.isExperience;
        this.isHomework = res.returnData.isHomework;
        this.changeStepList(this.isExperience, this.isHomework)

      }
    },
    handleBtn(item) {
      this.activeName = item.activeName;
    },
  },
  created() {
    this.courseId = this.$route.query.id;
    this.courseName = this.$route.query.courseName
    console.log('courseName',this.courseName);
    // this.getCourseDetails();
  },
  mounted() {
    this.role = this.userInfo.roleList[0].roleCode
  },
};
</script>

<style lang="scss" scoped>
.adminLits {
  padding: 30px 0;
}
</style>
