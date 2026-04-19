<!-- 填写基本信息 -->
<template>
  <div class="setInfo">
    <el-form
      :model="ruleForm"
      style="width: 1000px"
      :rules="rules"
      ref="ruleForm"
      label-position="right"
      label-width="205px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="测试名称：" prop="courseName">
            <el-input
              v-model="ruleForm.courseName"
              autocomplete="off"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="学时/学分：" prop="creditRatio">
            <el-input
              type="number"
              min="0"
              :max="100"
              v-model="ruleForm.creditRatio"
              placeholder="请输入学时/学分兑换比例"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="培训简介：" prop="courseIntroduce">
            <!-- <el-input v-model="ruleForm.courseIntroduce" type="textarea" :rows="2" autocomplete="off"
              style="width: 100%"></el-input> -->
            <editor
              :minHeight="150"
              class="editContent"
              v-model="ruleForm.courseIntroduce"
            />
            <!-- <div style="color:#C0C4CC" v-html="ruleForm.courseIntroduce"></div> -->
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="省" prop="province">
            <el-select
              v-model="ruleForm.provinceCode"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                key="510000"
                value="510000"
                label="四川省"
                >四川省</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="市州：" prop="province">
            <el-select
              v-model="ruleForm.cityName"
              placeholder="请选择市州"
              style="width: 100%"
              clearable
              @change="handleProvinceChange"
            >
              <el-option
                v-for="item in provinceOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区县：" prop="district">
            <el-select
              v-model="ruleForm.countryName"
              placeholder="请先选择区县"
              style="width: 100%"
              clearable
              @change="handleDistrictChange"
              @clear="handleDistrictClear"
            >
              <el-option
                v-for="item in districtOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="学段：" prop="tuition">
            <el-select
              v-model="ruleForm.tuition"
              placeholder="请选择学段"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in stageOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类:">
            <el-cascader
              v-model="categoryValue"
              :options="classificationOptions"
              :props="cascaderProps"
              placeholder="请选择分类"
              style="width: 100%"
              clearable
              @change="handleClassificationChange"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间：" prop="startDate">
            <el-date-picker
              clearable
              size="small"
              @change="changeStartDate"
              v-model="ruleForm.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间"
              style="width: 100%"
              :picker-options="{
                disabledDate: (time) => {
                  return dataTime.startTimeData(time);
                },
              }"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col style="paddingleft: 10px" :span="12">
          <el-form-item label="结束时间：" prop="endDate">
            <el-date-picker
              clearable
              size="small"
              v-model="ruleForm.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间"
              style="width: 100%"
              :picker-options="{
                disabledDate: (time) => {
                  return dataTime.endTimeData(time);
                },
              }"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="24" class="bj_img">
          <el-form-item label="培训封面：" prop="fileId" style="display: flex">
            <p class="tishi">标准比例为16:9，推荐尺寸为310*174（像素）</p>
            <div class="flex_R_C">
              <div class="imgUrl_wrap">
                <img v-if="ruleForm.fileId" :src="ruleForm.showUrl" alt="" />
              </div>
              <el-upload
                class="avatar-uploader"
                :multiple="false"
                :auto-upload="false"
                action=""
                :on-change="(file) => beforeUploadImg(file, '0')"
                accept=".jpg, .png"
                v-bind:show-file-list="false"
              >
                <el-button type="primary">上传图片</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="ruleForm.isCover == '1'">
        <el-col :span="24">
          <el-form-item label="是否上传首页宣传图：" prop="isCover">
            <el-radio-group v-model="ruleForm.isCover" @input="changeIsCover">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="是否按顺序进行视频学习:" prop="isStudy">
            <el-radio-group v-model="ruleForm.isStudy">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课程级别:" prop="level">
            <el-select
              v-model="ruleForm.level"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                key="0"
                value="0"
                label="省级"
                >省级</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item
            label="首页宣传图："
            prop="coverId"
            v-if="ruleForm.isCover == '1'"
          >
            <el-upload
              class="avatar-uploader"
              :multiple="false"
              :auto-upload="false"
              action=""
              :on-change="(file) => beforeUploadImg(file, '1')"
              accept=".jpg, .png"
              v-bind:show-file-list="false"
            >
              <p class="tishi">标准比例为16:9，推荐尺寸为1920*300（像素）</p>
              <div class="imgUrl_wrap1">
                <img v-if="ruleForm.coverId" :src="ruleForm.showUrl1" alt="" />
                <div v-else class="flex_C_C">
                  <p style="fontsize: 20px">+</p>
                  <p>点击上传</p>
                  <p>首页宣传图</p>
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="是否需要提交培训心得:" prop="isExperience">
            <el-radio-group
              v-model="ruleForm.isExperience"
              @input="changeIsHomework"
            >
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否需要提交培训作业：" prop="isHomework">
            <el-radio-group
              v-model="ruleForm.isHomework"
              @input="changeIsHomework"
            >
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否展示问答：" prop="showAnswerFlag">
            <el-radio-group v-model="ruleForm.showAnswerFlag">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否展示笔记：" prop="showNoteFlag">
            <el-radio-group v-model="ruleForm.showNoteFlag">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>

    <div class="flex_R_C" style="padding: 30px 0">
      <el-button v-if="courseId" type="primary" @click="nextFun()">保存</el-button>
      <!-- <el-button v-if="!editTag" type="primary" @click="nextFun()">下一步</el-button> -->
       <el-button v-if="!courseId" type="primary" @click="nextFun()">下一步</el-button>
      <el-button v-if="courseId" @click="$emit('returnData')">返回</el-button>
    </div>
  </div>
</template>

<script>
import {
  uploadFile,
  addStudyCourse,
  updateStudyCourse,
  getAreaListBycondition,
  getTuition,
  getTuitionCategory,
} from "@/api/train";
import editor from "@/views/train/components/publish/components/editor.vue";
import { getCourseDetails } from "@/api/admin.js";
export default {
  // props: ["editTag", "courseId", "detailInfo"],
  props: ["courseId", "detailInfo"],
  components: { editor },
  data() {
    return {
      editTag: true,
      ruleForm: {
        courseName: "",
        creditRatio: 1,
        courseIntroduce: "",
        startDate: "",
        endDate: "",
        fileId: "",
        showUrl: "",
        isCover: "0",
        // isStudy: "1",
        coverId: "",
        showUrl1: "",
        isExperience: "1",
        isHomework: "1",
        level: "0",
        // tuition: "", // 添加学段字段
        countryName: "", // 添加国家/地区名称
        countryCode: "", // 添加国家/地区代码
        provinceCode: "510000", // 省份
        provinceName: "四川省", // 省份名称
        cityCode: "", // 市
        cityName: "", // 市名称
        areaCode: "510000", // 区
        areaName: "四川省", // 区名称
        showAnswerFlag: "0",
        showNoteFlag: "0", // 0展示，1不展示
      },
      categoryValue: [], // 级联选择器绑定值
      classificationOptions: [], // 分类选项
      cascaderProps: {
        value: "tuitionId",
        label: "tuitionName",
        children: "children",
        checkStrictly: true, // 严格模式，可以只选父级
        emitPath: true, // 选中节点改变时，会返回一个由各级值组成的数组
      },
      province: "",
      district: "",
      provinceOptions: [], // 省份选项
      districtOptions: [], // 区县选项
      stageOptions: [], // 学段选项
      levelOptions: [
        // { value: "0", label: "省级" },
        // { value: "1", label: "市级" },
        // { value: "2", label: "区县级" },
        // { value: "3", label: "校级" },
      ],
      dataTime: {
        // 起始时间设置
        startTimeData: (time) => {
          return time.getTime() <= Date.now() - 8.64e7;
        },
        // 结束时间设置
        endTimeData: (time) => {
          if (!this.ruleForm.startDate) {
            return time.getTime() <= Date.now() - 8.64e7;
          }
          const startDate = new Date(this.ruleForm.startDate);
          const startTime = startDate.getTime();
          // 只能选择开始时间后一天的日期（大于开始时间）
          return time.getTime() <= startTime;
        },
      },
      rules: {
        courseName: [
          { required: true, message: "请填写测试课程名称", trigger: "change" },
          { max: 60, message: "最长不能超过60字", trigger: "change" },
        ],
        creditRatio: [
          {
            required: true,
            message: "请输入学时/学分兑换比例,必须为数字类型",
            trigger: "blur",
            pattern: /^-?\d+(\.\d+)?$/,
          },
        ],
        courseIntroduce: [
          { required: true, message: "请填写培训描述：", trigger: "change" },
        ],
        startDate: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        fileId: [
          { required: true, message: "请选择培训封面：", trigger: "blur" },
        ],
        level: [
          { required: true, message: "请选择课程级别：", trigger: "blur" },
        ],
        isCover: [
          { required: true, message: "是否上传首页宣传图", trigger: "change" },
        ],
        // isStudy: [
        //   {
        //     required: true,
        //     message: "是否按顺序进行视频学习",
        //     trigger: "change",
        //   },
        // ],
        coverId: [
          { required: true, message: "请上传首页宣传图", trigger: "change" },
        ],

        isExperience: [
          {
            required: true,
            message: "请选择是否需要提交培训心得",
            trigger: "blur",
          },
        ],
        isHomework: [
          {
            required: true,
            message: "请选择是否需要提交培训作业",
            trigger: "blur",
          },
        ],
        showAnswerFlag: [
          {
            required: true,
            message: "请选择是否展示问答",
            trigger: "blur",
          },
        ],
        showNoteFlag: [
          {
            required: true,
            message: "请选择是否展示笔记",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    "ruleForm.creditRatio"(newValue) {
      if (newValue < 0) {
        this.ruleForm.creditRatio = 0; // 将负数修正为0
      } else if (newValue > 100) {
        this.ruleForm.creditRatio = 100; // 将大于100的值修正为100
      }
    },
  },
  methods: {
    // 获取分类列表
    async getClassificationList() {
      try {
        const res = await getTuitionCategory();
        if (res.returnCode == 200) {
          // 处理重复ID问题，为重复的子级ID添加前缀
          this.classificationOptions = this.processClassificationData(
            res.returnData
          );
          console.log("分类数据:", this.classificationOptions);
          return Promise.resolve(); // 返回成功的Promise
        }
      } catch (error) {
        console.error("获取分类列表失败:", error);
        return Promise.reject(error);
      }
    },
    // 处理分类数据，解决ID重复问题
    processClassificationData(data) {
      return data.map((category) => ({
        ...category,
        children: category.children
          ? category.children.map((child) => ({
              ...child,
              // 为子级ID添加父级前缀，确保唯一性
              tuitionId: `${category.tuitionId}-${child.tuitionId}`,
            }))
          : null,
      }));
    },
    // 分类选择变化处理
    handleClassificationChange(value) {
      console.log("分类选择变化:", value);

      if (value && value.length > 0) {
        if (value.length === 1) {
          // 只选择了第一级（父级）
          const parentId = value[0];
          this.ruleForm.category = parentId; // 父级ID赋值给category
          this.ruleForm.tuition = ""; // 清空子级学段ID
          console.log("选择了父级:", parentId);
        } else if (value.length === 2) {
          // 选择了第二级（子级）
          const parentId = value[0];
          const childIdWithPrefix = value[1];
          // 从带前缀的ID中提取原始子级ID
          const childId = childIdWithPrefix.split("-")[1];

          this.ruleForm.category = parentId; // 子级ID赋值给category
          this.ruleForm.tuition = childId; // 子级ID也赋值给tuition
          console.log("选择了子级:", { parentId, childId, fullPath: value });
        }
      } else {
        // 清空选择
        this.ruleForm.category = "";
        this.ruleForm.tuition = "";
      }

      console.log("最终赋值:", {
        category: this.ruleForm.category,
        tuition: this.ruleForm.tuition,
      });
    },
    // 编辑时设置分类值
    setClassificationValue() {
      console.log("设置分类回显值:", {
        category: this.ruleForm.category,
        tuition: this.ruleForm.tuition,
      });

      // 清空当前值
      this.categoryValue = [];

      if (this.ruleForm.tuition && this.ruleForm.category) {
        // 如果有子级学段ID和父级分类ID，说明选择了第二级
        console.log("检测到第二级选择，查找对应路径");

        // 直接使用已有的category作为父级ID，tuition作为子级ID
        const parentId = this.ruleForm.category;
        const childId = this.ruleForm.tuition;

        // 构建带前缀的子级ID
        const childIdWithPrefix = `${parentId}-${childId}`;

        // 验证这个路径是否存在于选项中
        const parentExists = this.classificationOptions.some(
          (item) => item.tuitionId === parentId
        );
        if (parentExists) {
          this.categoryValue = [parentId, childIdWithPrefix];
          console.log("设置第二级回显值:", this.categoryValue);
        } else {
          console.warn("父级ID在选项中不存在:", parentId);
          this.categoryValue = [];
        }
      } else if (this.ruleForm.category && !this.ruleForm.tuition) {
        // 只有父级分类ID，说明只选择了第一级
        console.log("设置第一级回显值:", [this.ruleForm.category]);
        this.categoryValue = [this.ruleForm.category];
      } else {
        console.log("无分类数据，清空回显值");
        this.categoryValue = [];
      }
    },
    // 根据子级ID查找父级ID
    findParentIdByChildId(childId) {
      for (const category of this.classificationOptions) {
        if (category.children) {
          const foundChild = category.children.find((child) =>
            child.tuitionId.endsWith(`-${childId}`)
          );
          if (foundChild) {
            return category.tuitionId;
          }
        }
      }
      return null;
    },
    // 区县清空处理 - 同时清空市州
    handleDistrictClear() {
      console.log("区县被清空，同时清空市州");

      // 清空区县相关数据
      this.ruleForm.countryName = "";
      this.ruleForm.countryCode = "";
      this.ruleForm.areaName = "四川省";
      this.ruleForm.areaCode = "510000";

      // 同时清空市州相关数据
      this.ruleForm.cityName = "";
      this.ruleForm.cityCode = "";

      console.log("清空后数据:", {
        cityName: this.ruleForm.cityName,
        cityCode: this.ruleForm.cityCode,
        countryName: this.ruleForm.countryName,
        countryCode: this.ruleForm.countryCode,
      });
    },
    // 获取学段列表
    async getStageList() {
      try {
        const res = await getTuition(); // 获取学段列表
        if (res.returnCode == 200) {
          this.stageOptions = res.returnData.map((item) => ({
            value: item.tuitionId, // 根据实际接口返回字段调整
            label: item.tuitionName, // 根据实际接口返回字段调整
          }));
        }
      } catch (error) {
        console.error("获取学段列表失败:", error);
      }
    },
    // 获取省份列表
    async getProvinceList() {
      try {
        let formData = new FormData();
        formData.append("areaPId", 510000); // 使用 form-data 方式传参

        const res = await getAreaListBycondition(formData); // 获取顶级地区（省份）
        if (res.returnCode == 200) {
          // 在列表开头添加"全部"选项
          this.provinceOptions = [
            { value: "all", label: "全部" },
            ...res.returnData.map((item) => ({
              value: item.areaId,
              label: item.areaName,
            })),
          ];
          // 清空已选的区县
          this.ruleForm.district = "";
        }
      } catch (error) {
        console.error("获取省份列表失败:", error);
      }
    },
    // 根据省份获取区县列表
    async getDistrictList(provinceId) {
      try {
        let formData = new FormData();
        formData.append("areaPId", provinceId); // 使用 form-data 方式传参

        const res = await getAreaListBycondition(formData);
        if (res.returnCode == 200) {
          // 在列表开头添加"全部"选项
          this.districtOptions = [
            { value: "all", label: "全部" },
            ...res.returnData.map((item) => ({
              value: item.areaId,
              label: item.areaName,
            })),
          ];
          // 清空已选的区县
          this.ruleForm.district = "";
        }
      } catch (error) {
        console.error("获取区县列表失败:", error);
        this.districtOptions = [];
        this.ruleForm.district = "";
      }
    },
    // 省份选择变化处理
    handleProvinceChange(provinceId) {
      if (provinceId) {
        if (provinceId === "all") {
          // 选择了"全部"
          console.log("选择了市州全部");
          this.ruleForm.cityName = "全部" ? "四川省" : "四川省";
          this.ruleForm.cityCode = "510000";
          this.ruleForm.areaName = "四川省";
          this.ruleForm.areaCode = "510000";
          // 清空区县相关数据
          this.ruleForm.countryName = "";
          this.ruleForm.countryCode = "";
          this.districtOptions = [];
        } else {
          // 选择了具体的市州
          this.getDistrictList(provinceId);
          const selectedProvince = this.provinceOptions.find(
            (item) => item.value === provinceId
          );
          if (selectedProvince) {
            this.ruleForm.cityName = selectedProvince.label;
            this.ruleForm.cityCode = provinceId;
            this.ruleForm.areaName = selectedProvince.label;
            this.ruleForm.areaCode = provinceId;
            // 清空区县选择
            this.ruleForm.countryName = "";
            this.ruleForm.countryCode = "";
            console.log(
              this.ruleForm.cityName,
              this.ruleForm.cityCode,
              "------------------1111111"
            );
          }
        }
      }
    },
    // 区县选择变化处理
    handleDistrictChange(districtId) {
      if (districtId) {
        if (districtId === "all") {
          // 选择了区县"全部"
          console.log("选择了区县全部");
          // 使用当前市州的信息
          const selectedCity = this.provinceOptions.find(
            (item) => item.value === this.ruleForm.cityCode
          );
          if (selectedCity) {
            this.ruleForm.countryName = "全部";
            this.ruleForm.countryCode = "all";
            this.ruleForm.areaName = selectedCity.label;
            this.ruleForm.areaCode = this.ruleForm.cityCode;
            console.log(
              "区县选择全部，使用市州信息:",
              this.ruleForm.areaName,
              this.ruleForm.areaCode
            );
          }
        } else {
          // 选择了具体的区县
          const selectedDistrict = this.districtOptions.find(
            (item) => item.value === districtId
          );
          if (selectedDistrict) {
            this.ruleForm.countryName = selectedDistrict.label;
            this.ruleForm.countryCode = districtId;
            this.ruleForm.areaName = selectedDistrict.label;
            this.ruleForm.areaCode = districtId;
            console.log(
              this.ruleForm.areaName,
              this.ruleForm.areaCode,
              "------------------2222222"
            );
          }
        }
      }
    },
    async getCourseDetails() {
      const res = await getCourseDetails({ courseId: this.courseId });
      if (res.returnCode == 200) {
        this.ruleForm = Object.assign(this.ruleForm, res.returnData);
        if (this.ruleForm.studyFiles) {
          this.ruleForm.showUrl = this.ruleForm.studyFiles.filePath;
        }
        this.ruleForm.showUrl1 = this.ruleForm.coverPath;

        this.$emit(
          "changeStepList",
          this.ruleForm.isExperience,
          this.ruleForm.isHomework
        );
        this.$forceUpdate();
      }
    },
    changeIsHomework(e) {
      this.$emit(
        "changeStepList",
        this.ruleForm.isExperience,
        this.ruleForm.isHomework
      );
    },
    changeIsCover(e) {
      this.rules.coverId[0].required = e == "1" ? true : false;
    },
    nextFun() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          this.StudyCourse();
        } else {
          let errList = Object.values(obj)[0];
          this.$message({
            message: errList[0].message,
            type: "error",
          });
        }
      });
    },
    // 保存/修改
    async StudyCourse() {
      let formData = new FormData();
      Object.keys(this.ruleForm).map((key) => {
        // 确保category和tuition字段正确传递
        if (key === "category" || key === "tuition") {
          formData.append(key, this.ruleForm[key] || "");
        } else {
          formData.append(key, this.ruleForm[key]);
        }
      });

      console.log(formData, "formData--------------");

      // 调试信息，确认数据是否正确
      console.log("保存的数据:", {
        category: this.ruleForm.category,
        tuition: this.ruleForm.tuition,
        categoryValue: this.categoryValue,
      });
      // let res =
      //   this.editTag || this.courseId
      //     ? await updateStudyCourse(formData)
      //     : await addStudyCourse(formData);
      let res =
        this.courseId
          ? await updateStudyCourse(formData)
          : await addStudyCourse(formData);
      console.log(res, 2333);
      if (res.returnCode == 200) {
        if (this.editTag) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          // this.$emit("returnData");
          this.$emit("nextFun", res.returnData.id);
        } else {
          // this.$emit("nextFun", res.returnData.id);
          this.$emit("returnData");
        }
      }
    },
    changeStartDate() {
      this.ruleForm.endDate = "";
    },
    // 培训封面上传
    beforeUploadImg(file, type) {
      if (
        file.raw.type != "image/png" &&
        file.raw.type != "image/jpeg" &&
        file.raw.type != "image/jpg"
      ) {
        this.$message({
          message: "仅支持上传png/jpg格式",
          type: "error",
        });
        return false;
      }
      let formData = new FormData();
      formData.append("fileData", file.raw);
      uploadFile(formData).then((res) => {
        if (res.returnCode == "200") {
          if (type == "0") {
            this.ruleForm.fileId = res.returnData[0].fileId;
            this.ruleForm.showUrl = URL.createObjectURL(file.raw);
          } else {
            this.ruleForm.coverId = res.returnData[0].fileId;
            this.ruleForm.showUrl1 = URL.createObjectURL(file.raw);
          }
        }
      });
    },
  },
  mounted() {
    this.getProvinceList();
    this.getStageList(); // 初始化时获取学段列表
    // 先获取分类数据，数据加载完成后再设置回显值
    this.getClassificationList().then(() => {
      if (this.editTag) {
        this.ruleForm.courseId = this.courseId;
        this.ruleForm = Object.assign(this.ruleForm, this.detailInfo);
        if (this.detailInfo.studyFiles) {
          this.ruleForm.showUrl = this.detailInfo.studyFiles.filePath;
        }
        this.ruleForm.showUrl1 = this.detailInfo.coverPath;
        // 设置分类值
        this.setClassificationValue();
      } else if (this.courseId) {
        this.ruleForm.courseId = this.courseId;
        this.getCourseDetails();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.setInfo {
  display: flex;
  flex-direction: column;
  align-items: center;

  ::v-deep .el-input {
    .el-input__inner {
      height: 36px;
    }
  }

  .bj_img {
    .tishi {
      color: red;
      font-size: 12px;
      text-align: left;
      opacity: 0.5;
    }

    .imgUrl_wrap {
      width: 200px;
      height: 100px;
      border: 1px dashed #999;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .imgUrl_wrap1 {
      width: 776px;
      height: 107px;
      border: 1px dashed #999;

      img {
        width: 100%;
        height: 100%;
      }

      p {
        height: 30px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
</style>
