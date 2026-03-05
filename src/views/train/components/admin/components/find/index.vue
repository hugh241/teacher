<!--
 * @Date: 2022-11-28 00:25:12
 * @LastEditTime: 2022-11-28 00:29:27
 * @FilePath: /campus-security-vue/src/views/components/Header/index2.vue
 * @Description:这是新创建的页面
-->
<!--
 * @Date: 2022-11-28 00:25:12
 * @LastEditTime: 2022-11-28 00:29:27
 * @FilePath: /campus-security-vue/src/views/components/Header/index2.vue
 * @Description:这是新创建的页面
-->
<template>
  <div>
    <div class="set_bot">
      <div class="set_bot_left">
        <span style="width: 50px;display: inline-block;">市州：</span>
        <el-select
          v-model="queryParams.cityCode"
          placeholder="请选择市州"
          size="mini"
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

        <span class="schol" style="width: 50px;display: inline-block;">区县：</span>
        <el-select
          v-model="queryParams.countryCode"
          placeholder="请先选择区县"
          clearable
          size="mini"
          @change="handleCountryChange"
        >
          <el-option
            v-for="item in districtOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <!-- <el-select v-model="queryParams.countryCode" placeholder="请选择" size="mini" @change="changeArea">
          <el-option v-for="item in countyList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>  -->
        <span class="schol" style="width: 50px;display: inline-block;">学校：</span>
        <el-select
          v-model="queryParams.schoolId"
          placeholder="请先选择学校"
          clearable
          size="mini"
          @change="handleSchoolChange"
        >
          <el-option
            v-for="item in schoolOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <span class="schol" style="width: 50px;display: inline-block;">分类：</span>
        <el-cascader
          v-model="categoryValue"
          :options="classificationOptions"
          :props="cascaderProps"
          placeholder="请选择分类"
          clearable
          size="mini"
          @change="handleClassificationChange"
        ></el-cascader>
        <!-- <el-select v-model="queryParams.schoolId" placeholder="请选择" size="mini">
          <el-option v-for="item in schoolList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select> -->
        <el-button size="mini" class="bt" @click="resetClick()">重置</el-button>
        <el-button type="primary" size="mini" @click="findClick()">查询</el-button>
<!--        <el-button type="primary" icon="el-icon-upload2" size="mini" @click="downClick()">导出</el-button>-->
      </div>
      <div class="set_bot_right">
        <!-- <el-button type="primary" icon="el-icon-upload2" size="mini" @click="downClick()">导出</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getCountyList, getSchoolInfo } from '@/api/admin.js'
import {
  getAreaListBycondition,
  getTuitionCategory,
  getSchoolList
} from "@/api/train";
export default {
  data() {
    return {
      queryParams: {
        countryCode: '',
        schoolId: '',
        cityCode: '',
        category: '',
        tuition: '',
      },
      countyList: [],
      schoolList: [],
      provinceOptions: [], // 省份选项
      districtOptions: [], // 区县选项
      schoolOptions: [], // 学校选项
      categoryValue: [], // 级联选择器绑定值
      classificationOptions: [], // 分类选项
      cascaderProps: {
        value: "tuitionId",
        label: "tuitionName",
        children: "children",
        checkStrictly: true, // 严格模式，可以只选父级
        emitPath: true, // 选中节点改变时，会返回一个由各级值组成的数组
      },
    }
  },
  created() {
    // this.getCountyList()
    this.getProvinceList()
    this.getClassificationList()
  },
  mounted() { },
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
          this.queryParams.category = parentId; // 父级ID赋值给category
          this.queryParams.tuition = ""; // 清空子级学段ID
          console.log("选择了父级:", parentId);
        } else if (value.length === 2) {
          // 选择了第二级（子级）
          const parentId = value[0];
          const childIdWithPrefix = value[1];
          // 从带前缀的ID中提取原始子级ID
          const childId = childIdWithPrefix.split("-")[1];

          this.queryParams.category = parentId; // 子级ID赋值给category
          this.queryParams.tuition = childId; // 子级ID也赋值给tuition
          console.log("选择了子级:", { parentId, childId, fullPath: value });
        }
      } else {
        // 清空选择
        this.queryParams.category = "";
        this.queryParams.tuition = "";
      }

      console.log("最终赋值:", {
        category: this.queryParams.category,
        tuition: this.queryParams.tuition,
      });
    },

    handleSchoolChange(value) {
      // 这里可以处理学校选择变化的逻辑
      console.log("选择的学校ID:", value);
      if (value) {
        if (value === "all") {
          const selectedSchool = this.districtOptions.find(
            (item) => item.value === this.queryParams.countryCode
          );
          if (selectedSchool) {
            this.queryParams.schoolId = "all";
            this.queryParams.countryCode = this.queryParams.countryCode;
          }
        } else {
          const selectedDistrict = this.schoolOptions.find(
            (item) => item.value === value
          );
          if (selectedDistrict) {
            this.queryParams.schoolId = value;
          }
        }
      }
    },

    handleCountryChange(value) {
      if (value) {
        if (value === "all") {
          // 选择了区县"全部"
          console.log("选择了区县全部");
          // 使用当前市州的信息
          const selectedCity = this.provinceOptions.find(
            (item) => item.value === this.queryParams.cityCode
          );
          if (selectedCity) {
            this.queryParams.countryCode = "all";
            this.queryParams.cityCode = this.queryParams.cityCode;
          }
        } else {
          this.getSchoolListData(value);
          // 选择了具体的区县
          const selectedDistrict = this.districtOptions.find(
            (item) => item.value === value
          );
          if (selectedDistrict) {
            this.queryParams.countryCode = value;
          }
        }
      }
    },

    handleProvinceChange(value) {
      this.queryParams.countryCode = ''
      this.queryParams.schoolId = ''
      this.categoryValue = [] // 同时清空级联选择器的值
      this.queryParams.category = ''
      this.queryParams.tuition = ''
      if (value) {
        if (value === "all") {
          // 选择了"全部"
          console.log("选择了市州全部");
          this.queryParams.cityCode = "all";
          // 清空区县相关数据
          this.queryParams.countryCode = ''
          this.districtOptions = [];
        } else {
          // 选择了具体的市州
          this.getDistrictList(value);

        }
      }
    },

    // 根据区县获取学校列表
    async getSchoolListData(countryId) {
      try {
        let formData = new FormData();
        formData.append("areaPId", countryId); // 使用 form-data 方式传参

        const res = await getSchoolList(formData);
        if (res.returnCode == 200) {
          // 在列表开头添加"全部"选项
          this.schoolOptions = [
            { value: "all", label: "全部" },
            ...res.returnData.map((item) => ({
              value: item.schoolId,
              label: item.schoolName,
            })),
          ];
        }
      } catch (error) {
        console.error("获取学校列表失败:", error);
        this.schoolOptions = [];
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
        }
      } catch (error) {
        console.error("获取区县列表失败:", error);
        this.districtOptions = [];
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
        }
      } catch (error) {
        console.error("获取省份列表失败:", error);
      }
    },
    /**
     * @event:
     * @return {*}
     * @description: 交互
     */
    changeArea(val) {
      console.log(val)
      this.getSchoolInfo(val)
    },
    //   重置
    resetClick() {
      this.queryParams.countryCode = ''
      this.queryParams.schoolId = ''
      this.queryParams.cityCode = ''
      this.queryParams.category = ''
      this.queryParams.tuition = ''
      this.categoryValue = [] // 同时清空级联选择器的值

      // 过滤掉空值参数
      const filteredParams = this.filterEmptyParams(this.queryParams);
      this.$emit('ziresetClick', filteredParams)
    },
    //   查询
    findClick() {
      // 创建参数副本
      const params = { ...this.queryParams };

      console.log(params,'before params');


      // 如果cityCode为'all'，则删除这个属性
      if (params.cityCode === 'all') {
        delete params.cityCode;
      }
      console.log(params,'params');


      // 过滤掉空值参数
      const filteredParams = this.filterEmptyParams(params);
      console.log(filteredParams,'filteredParams');

      this.$emit('zifindClick', filteredParams)
    },
    downClick() {
      // 过滤掉空值参数
      const filteredParams = this.filterEmptyParams(this.queryParams);
      this.$emit('zidownClick', filteredParams)
    },
    // 过滤空值参数的方法
    filterEmptyParams(params) {
      const filtered = {};
      Object.keys(params).forEach(key => {
        const value = params[key];

        // 特殊处理：如果 cityCode 为 'all'，则置空不传递
        if (key === 'cityCode' && value === 'all') {
          return; // 跳过这个参数，不添加到 filtered 中
        }

        // 特殊处理：如果 countryCode 为 'all'，则置空不传递
        if (key === 'countryCode' && value === 'all') {
          return; // 跳过这个参数，不添加到 filtered 中
        }

        // 特殊处理：如果 schoolId 为 'all'，则置空不传递
        if (key === 'schoolId' && value === 'all') {
          return; // 跳过这个参数，不添加到 filtered 中
        }

        // 只保留有值的参数（空字符串、null、undefined 都过滤掉）
        if (value !== '' && value !== null && value !== undefined) {
          filtered[key] = value;
        }
      });
      return filtered;
    },
    async getCountyList() {
      const res = await getCountyList()
      if (res.returnCode == 200) {
        this.countyList = []
        res.returnData.forEach(element => {
          this.countyList.push({
            value: element.areaCode,
            label: element.areaName,
          })
        })
      }
    },
    async getSchoolInfo(val) {
      const res = await getSchoolInfo({ countyCode: val })
      if (res.returnCode == 200) {
        console.log(res)
        this.schoolList = []
        res.returnData.forEach(item => {
          this.schoolList.push({
            value: item.schoolId,
            label: item.schoolName,
          })
        })
      }
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
.set_bot {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .set_bot_left {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      font-weight: normal;
      font-size: 14px;
    }

    .schol {
      margin-left: 20px;
    }

    .bt {
      margin-left: 10px;
    }
  }
}
</style>
