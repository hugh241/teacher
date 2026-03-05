<template>
  <div>

    <!-- <Modal v-model="addDisplay" :title="title" @on-visible-change="visibleChange" :mask-closable="false" width="60%">
      <Form :model="addForm" :rules="formRules" :label-width="100" ref="addForm">
        <Row>
          <i-col span="24">
            <FormItem label="试卷名称" prop="perName">
              <Input placeholder="请输入试卷名称" v-model="addForm.perName" :maxlength="100" size="large" show-word-limit
                type="textarea"></Input>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="试卷类型" prop="type">
              <Select v-model="addForm.type" placeholder="请选择试卷类型" @on-change="choseType" size="large">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="试卷层次" prop="level">
              <Select v-model="addForm.level" placeholder="请选择试卷层次" @on-change="choseLevel" size="large">
                <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="所属课程" prop="courseId">
              <Select v-model="addForm.courseId" disabled placeholder="请选择所属课程" size="large">
                <Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="所属章节" prop="chapterId">
              <Select v-model="addForm.chapterId" placeholder="请选择所属章节" size="large">
                <Option v-for="item in chapterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="date" placeholder="请选择开始时间" v-model="addForm.startTime" @on-change="startTimeChange"
                :options="optionsStartTime" format="yyyy-MM-dd" size="large" style="width: 100%"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="date" placeholder="请选择结束时间" v-model="addForm.endTime" @on-change="endTimeChange"
                :options="optionsEndTime" format="yyyy-MM-dd" size="large" style="width: 100%"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="试卷总分" prop="totalScore">
              <InputNumber placeholder="请输入试卷总分" v-model="addForm.totalScore" size="large" style="width: 100%">
              </InputNumber>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="及格分数" prop="passScore">
              <InputNumber placeholder="请输入及格分数" v-model="addForm.passScore" size="large" style="width: 100%">
              </InputNumber>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button class="button" @click="close">取消</Button>
        <Button type="primary" class="button" @click="addFormSubmit">确定</Button>
      </div>
    </Modal> -->
  </div>
</template>

<script>

import { addPaperPer, getCourseDetails, editPaperPer } from '@/api/learningCenter';
import dayjs from "dayjs";
export default {
  data() {
    return {
      title: '',
      addDisplay: false,
      courseInfo: {},
      courseList: [],
      chapterList: [],
      levelList: [],
      typeList: [
        {
          value: '1',
          label: '练习'
        },
        {
          value: '2',
          label: '考试'
        },
        {
          value: '4',
          label: '问卷'
        }
      ],
      addForm: {
        perName: '',
        courseId: '',
        chapterId: '',
        level: '',
        totalScore: 100,
        passScore: 60,
        type: '',
        startTime: '',
        endTime: '',
      },
      formRules: {
        perName: [
          { required: true, message: '请输入试卷名称' },
        ],
        courseId: [
          { required: true, message: '请选择所属课程' },
        ],
        level: [
          { required: true, message: '请选择试卷层次' },
        ],
        type: [
          { required: true, message: '请选择试卷类型' },
        ],
        startTime: [
          { required: true, message: '请选择开始时间' },
        ],
        endTime: [
          { required: true, message: '请选择结束时间' },
        ],
        totalScore: [
          { required: true, message: '请填写试卷总分' },
        ],
        passScore: [
          { required: true, message: '请填写及格分数' },
        ],
      },
      optionsStartTime: {
        // 开始时间不能大于结束时间
        disabledDate: (date) => {
          let data = '';
          if (this.addForm.endTime) {
            let format = 'YYYY-MM-DD';
            date = dayjs(date).format(format)
            data = this.addForm.endTime
            return date > data;
          } else {
            return date > Date.now();
          }
        }
      },
      optionsEndTime: {
        // 结束时间不能小于开始时间
        disabledDate: (date) => {
          let data = '';
          if (this.addForm.startTime) {
            let format = 'YYYY-MM-DD';
            date = dayjs(date).format(format)
            data = this.addForm.startTime
            return date < data;
          } else {
            return date < Date.now();
          }
        }
      }
    };
  },
  methods: {
    //获取章节列表
    getCourseDetails() {
      getCourseDetails(this.addForm.courseId).then(res => {
        this.courseList = [];
        this.chapterList = [];
        if (res.returnCode == "200" && res.returnData != null) {
          this.courseInfo = res.returnData;
          this.courseList.push({
            value: this.courseInfo.id,
            label: this.courseInfo.courseName
          })
        }
      });
    },

    //选择试卷类型
    choseType(type) {
      if (type == '1' || type == '2') {
        this.levelList = [
          { value: '1', label: '课程' },
          { value: '2', label: '章节' }
        ]
      } else if (type == '4') {
        this.levelList = [
          { value: '4', label: '问卷' }
        ]
      }
    },
    choseLevel(level) {
      this.chapterList = [];
      if (level == '2') {
        if (this.courseInfo.chapters) {
          this.courseInfo.chapters.filter(item => {
            this.chapterList.push({
              value: item.id,
              label: item.chapterName
            })
          })
        }
      }
    },
    show() {
      this.addDisplay = true;
    },

    close() {
      this.addDisplay = false;
      this.levelList = [];
      this.addForm = {
        perName: '',
        courseId: '',
        chapterId: '',
        level: '',
        totalScore: 100,
        passScore: 60,
        type: '',
        startTime: '',
        endTime: '',
      };
    },

    startTimeChange(e) {
      this.addForm.startTime = e;
    },

    endTimeChange(e) {
      if (e < this.addForm.startTime) {
        this.addForm.endTime = '';
        return this.$message.info('选择时间有误，请重新选择！')
      } else {
        this.addForm.endTime = e;
      }
    },

    addFormSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let scoreTest = true;
          let passScoreTest = true;
          let chapterTest = true;
          //试卷层次是课程，总分和及格分数必填
          if (this.addForm.level == '1') {
            scoreTest = this.scoreTest(this.addForm.totalScore, '试卷总分');
            if (scoreTest) {
              passScoreTest = this.scoreTest(this.addForm.passScore, '及格分数');
            }
            if (scoreTest && passScoreTest) {
              if (parseInt(this.addForm.passScore) > parseInt(this.addForm.totalScore)) {
                this.$message.warning('及格分数不能大于试卷总分');
                passScoreTest = false;
              }
            }
          }
          //试卷层次是章节，章节必选，总分和及格分数必填
          if (this.addForm.level == '2') {
            if (this.isEmpty(this.addForm.chapterId)) {
              this.$message.warning('请选择章节');
              chapterTest = false;
            }
            if (chapterTest) {
              scoreTest = this.scoreTest(this.addForm.totalScore, '试卷总分');
            }
            if (chapterTest && scoreTest) {
              passScoreTest = this.scoreTest(this.addForm.passScore, '及格分数');
            }
            if (chapterTest && scoreTest && passScoreTest) {
              if (parseInt(this.addForm.passScore) > parseInt(this.addForm.totalScore)) {
                this.$message.warning('及格分数不能大于试卷总分');
                passScoreTest = false;
              }
            }
          }
          //试卷层次是问卷，总分和及格分数默认给0
          if (this.addForm.level == '4') {
            this.addForm.totalScore = '0';
            this.addForm.passScore = '0';
          }
          if (scoreTest && passScoreTest && chapterTest) {
            this.addForm.startTime = dayjs(this.addForm.startTime).format('YYYY-MM-DD');
            this.addForm.endTime = dayjs(this.addForm.endTime).format('YYYY-MM-DD');
            if (this.addForm.id) {
              editPaperPer(this.addForm).then(res => {
                if (res.returnCode == "200") {
                  this.$parent.getList()
                  this.$message.success('试卷编辑成功');
                } else {
                  this.$message.error(res.returnMessage);
                }
                this.addDisplay = false;
                this.addForm = {};
                this.$emit('addSubmitListener', true);
              });
            } else {
              addPaperPer(this.addForm).then(res => {
                if (res.returnCode == "200") {
                  this.$parent.getList()
                  this.$message.success('试卷添加成功');
                } else {
                  this.$message.error(res.returnMessage);
                }
                this.addDisplay = false;
                this.addForm = {};
                this.$emit('addSubmitListener', true);
              });
            }
          }
        }
      })
    },

    //分数校验
    scoreTest(value, msg) {
      if (this.isEmpty(value)) {
        this.$message.warning(msg + '不能为空');
        return false;
      }
      if (!/^[0-9]+$/.test(value)) {
        this.$message.warning(msg + '格式错误');
        return false;
      }
      return true;
    },

    visibleChange(state) {
      // 监听dialog 开闭状态
      if (!state) {
        this.addForm = {
          perName: '',
          courseId: '',
          chapterId: '',
          level: '',
          totalScore: 100,
          passScore: 60,
          type: '',
          startTime: '',
          endTime: '',
        };
      }
    },

    //判断字符是否为空的方法
    isEmpty(obj) {
      if (typeof obj == undefined || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    }
  },
};
</script>

<style scoped></style>
