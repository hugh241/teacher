<template>
  <div class="Subsection">
    <div class="SubsectionTop">
      <div class="SubsectionTopLeft">
        {{ info.chapterName }}
        <span style="color: #747474; font-size: 16px">>>小节管理</span>
      </div>
      <div class="SubsectionTopRight">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addSubsection"
          >添加小节</el-button
        >
        <el-button
          type="primary"
          plain
          size="small"
          icon="el-icon-refresh-left"
          @click="backChapter"
          >返回章节列表</el-button
        >
      </div>
    </div>
    <div class="SubsectionCenter">
      <el-table
        size="small"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA', color: '#000' }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="subsectionName"
          label="小节名称"
          show-overflow-tooltip
          width="360"
          align="center"
        >
        </el-table-column>
        <el-table-column label="视频时长" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.videoTime | getTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="state" label="答题次数" show-overflow-tooltip> -->
        <!-- </el-table-column> -->
        <el-table-column
          prop="score"
          label="分数"
          show-overflow-tooltip
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createName"
          label="创建人"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column prop="address" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div
              style="
                display: flex;
                justify-content: space-between;
                font-size: 14px;
              "
            >
              <el-link
                type="primary"
                :underline="false"
                @click="handleDetails(scope.row)"
                >详情</el-link
              >
              <el-link
                type="primary"
                :underline="false"
                @click="handleEdit(scope.row)"
                >修改</el-link
              >
              <el-link
                type="primary"
                :underline="false"
                @click="handleAnswer(scope.row)"
                >答题</el-link
              >
              <el-link
                type="danger"
                :underline="false"
                @click="handleDelete(scope.row)"
                >删除</el-link
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="SubsectionFooter">
      <Pagination
        :total="total"
        @handlePageChange="handlePageChange"
      ></Pagination>
    </div>
    <Editpop
      v-if="show"
      :show="show"
      :title="ruleForm.id ? '小节编辑' : '小节新增'"
      :width="'60%'"
      @save="handleSave"
      @close="handleClose"
    >
      <div slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="小节名称" prop="subsectionName">
            <el-input
              v-model="ruleForm.subsectionName"
              style="width: 60%"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="小节排序" prop="sort">
            <el-input-number
              style="width: 60%"
              size="small"
              v-model="ruleForm.sort"
              :min="minValue"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="小节学时" prop="score">
            <el-input-number
              style="width: 60%"
              size="small"
              v-model="ruleForm.score"
              :min="0"
              :max="999"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="是否允许倍速播放" prop="speedTag">
            <el-select
              v-model="ruleForm.speedTag"
              placeholder="请选择是否允许倍速播放"
              style="width: 60%;"
              >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否允许进度拖拽" prop="dragTag">
            <el-select
              v-model="ruleForm.dragTag"
              placeholder="请选择是否允许进度拖拽"
              style="width: 60%;"
              >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="上传类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="1">自定义上传</el-radio>
              <el-radio label="3">手动上传</el-radio>
              <el-radio label="2" v-if="$process.VUE_APP_IS_OUTSIDE == '1'"
                >资源列表选择</el-radio
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="小节内容"
            prop="fileId"
            v-if="ruleForm.type == '1'"
          >
            <upLoader :fileId="fileId" @sendVideo="sendVideo"></upLoader>
          </el-form-item>

          <el-form-item
            label="视频名称"
            prop="studyFiles.fileName"
            v-if="ruleForm.type == '3'"
          >
            <el-input
              v-model="ruleForm.studyFiles.fileName"
              placeholder="请输入视频名称"
              maxlength="100"
              style="width: 60%"
            />
          </el-form-item>

          <el-form-item
            label="视频地址"
            prop="studyFiles.filePath"
            v-if="ruleForm.type == '3'"
          >
            <el-input
              v-model="ruleForm.studyFiles.filePath"
              placeholder="请输入视频播放地址"
              type="textarea"
              :rows="3"
              maxlength="100"
              show-word-limit
              style="width: 60%"
            />
          </el-form-item>

          <el-form-item
            label="视频类型"
            prop="studyFiles.fileType"
            v-if="ruleForm.type == '3'"
          >
            <el-input
              v-model="ruleForm.studyFiles.fileType"
              placeholder="例如 mp4"
              maxlength="20"
              style="width: 60%"
            />
          </el-form-item>

          <el-form-item
            label="视频时长（秒）"
            prop="studyFiles.videoTime"
            v-if="ruleForm.type == '3'"
          >
            <el-input-number
              v-model="ruleForm.studyFiles.videoTime"
              :min="0"
              :precision="0"
              style="width: 60%"
              maxlength="30"
            />
          </el-form-item>

          <el-form-item
            label="资源目录"
            prop=""
            v-if="ruleForm.type == '2'"
            class="load-ox"
            style="position: relative"
          >
            <!-- <span
              class="xo-l"
              style="
                position: absolute;
                left: -79px;
                color: #f56c6c;
                font-size: 14px;
              "
              >*</span
            > -->
            <el-select
              v-model="resTypeData.resourceTypeSub"
              filterable
              placeholder="请选择资源目录"
              style="width: 60%"
              @change="handleResType"
            >
              <el-option
                v-for="item in optionsRes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源小节" prop="" v-if="ruleForm.type == '2'">
            <el-select
              v-model="resTypeData.resourceType"
              filterable
              clearable
              placeholder="请选择资源小节"
              style="width: 60%"
              @change="handleResTypeSub"
              @clear="handleResTypeSubClear"
            >
              <el-option
                v-for="item in optionsResSub"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="视频列表"
            prop=""
            v-if="ruleForm.type == 2"
            class="load-ox"
            style="position: relative"
          >
            <span
              class="xo-l"
              style="
                position: absolute;
                left: -79px;
                color: #f56c6c;
                font-size: 14px;
              "
              >*</span
            >
            <div class="new-box" v-if="resTypeData.resourceTypeSub">
              <div class="ele">
                <el-input
                  placeholder="请输入视频资源名称"
                  v-model="inputName"
                  class="input-with-select"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleEle"
                  ></el-button>
                </el-input>
              </div>
              <div class="look-box" v-if="resDataList.length != 0">
                <!-- <el-checkbox-group v-model="checkedCities" class="look" :max="1">
                  <div
                    class="box"
                    v-for="(item, index) in resDataList"
                    :key="index"
                  >
                    <el-checkbox
                      :label="item.ResName"
                      class="box-sl"
                      @change="handleSelect(item)"
                    ></el-checkbox>
                    <div class="view">
                      <el-image
                        style="width: 100%; height: 100%"
                        :src="item.IconUrl"
                      ></el-image>
                      <div class="bg" @click="handleViewUrl(item)">
                        <img src="@/assets/images/vie.png" alt="" />
                      </div>
                    </div>
                    <div class="type">资源类型：{{ item.ExtName }}</div>
                    <div class="tiem">创建时间：{{ item.CreateTime }}</div>
                  </div>
                </el-checkbox-group> -->

                <el-table
                  :data="resDataList"
                  highlight-current-row
                  style="width: 100%"
                  border
                >
                  <el-table-column width="50" align="center">
                    <template slot-scope="scope">
                      <el-radio
                        v-model="radio"
                        :label="scope.row.ResName"
                        @input="handleCurrentChange"
                      >
                        <span style="display: none">--</span>
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    property="ResName"
                    label="视频资源名称"
                    align="center"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    property="ExtName"
                    label="资源类型"
                    align="center"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column
                    property="ResSize"
                    label="资源大小"
                    align="center"
                    width="100"
                  >
                  </el-table-column>
                </el-table>
              </div>
              <div class="em" v-else>
                <el-empty description="暂无数据列表"></el-empty>
              </div>
              <div class="block" v-if="this.resTotal > 9">
                <el-pagination
                  layout="prev, pager, next"
                  :total="resTotal"
                  @current-change="handleCurrentChangeRes"
                >
                </el-pagination>
              </div>
            </div>
            <div class="look-no" v-else>
              <div class="ts">以下为已上传的资源，可选择重新上传资源</div>
              <!-- <div
                class="box"
                v-for="(item, index) in fileListData"
                :key="index"
              >
                <div class="view">
                  <el-image
                    style="width: 100%; height: 100%"
                    :src="item.iconUrl"
                  ></el-image>
                  <div class="bg" @click="handleViewUrls(item)">
                    <img src="@/assets/images/vie.png" alt="" />
                  </div>
                </div>
                <div class="type">资源类型：{{ item.fileType }}</div>
                <div class="tiem">资源名称：{{ item.fileName }}</div>
              </div> -->

              <el-table :data="fileListData" style="width: 100%" border>
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column
                  property="fileName"
                  label="资源名称"
                  align="center"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  property="fileType"
                  label="资源类型"
                  align="center"
                  width="90"
                >
                </el-table-column>
                <el-table-column
                  property="createTime"
                  label="创建时间"
                  align="center"
                  width="170"
                >
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item
            label="学习资料"
            prop=""
            v-if="ruleForm.type == 2 && resTypeData.resourceTypeSub"
          >
            <div class="new-box">
              <div class="ele">
                <el-input
                  placeholder="请输入学习资源名称"
                  v-model="inputNameTo"
                  class="input-with-select"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleEleTo"
                  ></el-button>
                </el-input>
              </div>
              <div class="look-box" v-if="resDataListTo.length != 0">
                <!-- <el-checkbox-group v-model="checkedCitiesTo" class="look">
                  <div
                    class="box"
                    v-for="(item, index) in resDataListTo"
                    :key="index"
                  >
                    <el-checkbox
                      :label="item.ResName"
                      class="box-sl"
                      @change="handleSelectTo(item)"
                    ></el-checkbox>
                    <div class="view">
                      <el-image
                        style="width: 100%; height: 100%"
                        :src="item.IconUrl"
                      ></el-image>
                      <div class="bg" @click="handleViewUrl(item)">
                        <img src="@/assets/images/vie.png" alt="" />
                      </div>
                    </div>
                    <div class="type">资源类型：{{ item.ExtName }}</div>
                    <div class="tiem">创建时间：{{ item.CreateTime }}</div>
                  </div>
                </el-checkbox-group> -->

                <el-table
                  :data="resDataListTo"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChangeTo"
                  border
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column
                    property="ResName"
                    label="学习资料名称"
                    align="center"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    property="ExtName"
                    label="资料类型"
                    align="center"
                    width="100"
                  >
                  </el-table-column>
                  <el-table-column
                    property="ResSize"
                    label="资料大小"
                    align="center"
                    width="100"
                  >
                  </el-table-column>
                </el-table>
              </div>
              <div class="em" v-else>
                <el-empty description="暂无数据列表"></el-empty>
              </div>
              <div class="block" v-if="this.resTotalTo > 9">
                <el-pagination
                  layout="prev, pager, next"
                  :total="resTotalTo"
                  @current-change="handleCurrentChangeResTo"
                >
                </el-pagination>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </Editpop>
    <Editpop
      :show="detailShow"
      title="课程小节详情"
      :width="'40%'"
      @save="detailShow = false"
      @close="detailShow = false"
    >
      <div slot="body">
        <el-descriptions :column="2">
          <el-descriptions-item label="小节名称">{{
            detailData.subsectionName
          }}</el-descriptions-item>
          <el-descriptions-item label="所属课程">{{
            detailData.courseName
          }}</el-descriptions-item>
          <el-descriptions-item label="所属章节">{{
            detailData.chapterName
          }}</el-descriptions-item>
          <el-descriptions-item label="小节排序">{{
            detailData.sort
          }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{
            detailData.createName
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            detailData.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="视频时长">{{
            timeFormat(detailData.videoTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="资源名称" v-if="detailData.type == 2">{{
            detailData.studyFiles.fileName
          }}</el-descriptions-item>
          <el-descriptions-item label="小节视频" v-if="detailData.studyFiles">
            <!-- <video
              v-if="videoVisable"
              :src="detailData.studyFiles.filePath"
              :autoplay="false"
              style="
                display: inline-block;
                width: auto;
                height: 58px;
                margin-right: 5px;
              "
            ></video> -->
            <!-- <iframe
              id="ifr_con"
              v-show="officeVisable"
              :src="detailData.studyFiles.filePath"
              frameborder="1"
              style="width: 204px; height: 100px; cursor: pointer"
            ></iframe> -->

            <el-image
              style="width: 204px; height: 100px; cursor: pointer"
              v-show="imageVisable"
              :src="detailData.studyFiles.filePath"
            ></el-image>
            <el-button style="margin-left: 10px; padding: 0;" @click="videoView" type="text"
              >查看</el-button
            >
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </Editpop>
    <!-- <Editpop
      :show="videoShow"
      :width="'800px'"
      @save="videoShow = false"
      @close="videoShow = false"
    >
      <div slot="body">
        <video-player
          v-if="videoVisable"
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          preload
          muted
          autoplay
          :options="playerOptions"
          @ended="onPlayerEnded($event)"
          @timeupdate="onPlayerTimeupdate($event)"
        >
        </video-player>
        <iframe
          id="ifr_con"
          style="width: 769px; height: 430px"
          v-if="officeVisable"
          :src="detailData.studyFiles.filePath"
          frameborder="1"
        ></iframe>
        <el-image
          style="width: 769px; height: 430px"
          v-if="imageVisable"
          :src="detailData.studyFiles.filePath"
        ></el-image>
      </div>
    </Editpop> -->
    <!-- <el-dialog
      v-if="videoShow"
      title="查看视频"
      :visible.sync="videoShow"
      width="40%"
      :before-close="handleNewClose"
    >
      <div>
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          preload
          muted
          autoplay
          :options="playerOptions"
          @ended="onPlayerEnded($event)"
          @timeupdate="onPlayerTimeupdate($event)"
        >
        </video-player>
        <iframe
          id="ifr_con"
          style="width: 769px; height: 430px"
          v-if="officeVisable"
          :src="detailData.studyFiles.filePath"
          frameborder="1"
        ></iframe>
        <el-image
          style="width: 769px; height: 430px"
          v-if="imageVisable"
          :src="detailData.studyFiles.filePath"
        ></el-image>
      </div>
    </el-dialog> -->
    <answerTimeAdd
      v-if="addDisplay"
      :answerList="answerList"
      :addDisplay="addDisplay"
      v-on:answerSubmitListener="getSubsectionList()"
      :courseId="info.courseId"
      @close="addDisplay = false"
    />
  </div>
</template>

<script>
import Editpop from "@/components/Editpop/index";
import upLoader from "@/components/upLoader/index.vue";
import Pagination from "@/components/pagination/index.vue";
import answerTimeAdd from "@/views/train/components/publish/components/answerTimeAdd.vue";
import {
  addStudySubsection,
  addStudySubsectionNew,
  editSubsection,
  getStudySubsectionList,
  deleteSubsection,
  getSubsectionDetail,
  getResTypeListData,
  getResList,
  getResFileList,
} from "@/api/train";
export default {
  props: ["info"],
  name: "TeacherTrainingSystemVueSubsection",
  components: {
    Pagination,
    Editpop,
    upLoader,
    answerTimeAdd,
  },
  data() {
    return {
      radio: null,
      checkedCities: [],
      checkedCitiesTo: [],
      optionsRes: [],
      optionsResSub: [],
      inputName: "",
      inputNameTo: "",
      resTypeData: {
        resourceType: "",
        resourceTypeSub: "",
        resName: "",
        pageIndex: "1",
        pageSize: "9",
      },
      resDataList: [],
      resTotal: 0,
      resDataListTo: [],
      resTotalTo: 0,
      fileListData: [],

      viewList: [],
      wordList: [],

      officeVisable: false,
      imageVisable: false,
      videoVisable: false,
      minValue: 0,
      addDisplay: false,
      answerList: {},
      fileId: "", //用于文件回显/编辑，有值则调接口
      detailShow: false,
      videoShow: false,
      detailData: {},
      upHeaders: {},
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/img/upload",
      show: false,
      total: 0,
      tableData: [],
      ruleForm: {
        courseId: "",
        chapterId: "",
        fileId: "",
        score: "",
        speedTag: "1",
        dragTag: "1",
        sort: "",
        subsectionName: "",
        videoTime: "",
        type: "1",
        fileList: [],
        studyFiles: {
          fileName: '',
          filePath: '',
          fileType: '',
          videoTime: '',
        }
      },
      query: {
        pageNo: 1,
        pageSize: 10,
        courseId: "",
        chapterId: "",
      },
      rules: {
        subsectionName: [
          { required: true, message: "请输入小节名称", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
        score: [{ required: true, message: "请输入学分", trigger: "change" }],
        speedTag: [
          { required: true, message: "请选择是否允许加倍", trigger: "change" },
        ],
        dragTag: [
          { required: true, message: "请选择是否允许拖拽", trigger: "change" },
        ],
        fileId: [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.type == '1' && !value) {
                callback(new Error('请上传视频'));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        type: [
          { required: true, message: "请选择上传类型", trigger: "change" },
        ],
        "studyFiles.fileName": [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.type == '3' && !value) {
                callback(new Error('请输入视频名称'));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        "studyFiles.filePath": [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.type == '3' && !value) {
                callback(new Error('请输入视频地址'));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        "studyFiles.videoTime": [
          {
            validator: (rule, value, callback) => {
              if (this.ruleForm.type == '3' && (value === null || value === undefined || value === '')) {
                callback(new Error('请输入视频时长'));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
      },
      playerOptions: {
        playbackRates: [], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  filters: {
    getTime(time) {
      // 转换为式分秒
      let h = parseInt((time / 60 / 60) % 24);
      h = h < 10 ? "0" + h : h;
      let m = parseInt((time / 60) % 60);
      m = m < 10 ? "0" + m : m;
      let s = parseInt(time % 60);
      s = s < 10 ? "0" + s : s;
      // 作为返回值返回
      return h + ":" + m + ":" + s;
    },
  },
  mounted() {
    this.getSubsectionList();
    this.getResourceType();
  },
  computed: {
    // minValue() {
    //   if (this.tableData && this.tableData.length) {
    //     return this.tableData.length + 1;
    //   } else {
    //     return 1;
    //   }
    // },
  },
  methods: {
    //6.20新需求
    //获得资源分类
    async getResourceType() {
      this.optionsRes = [];
      var res = await getResTypeListData({ firmAppId: "secondRes" });
      // console.log('getResTypeListData',res);
      if (res.returnCode == 200) {
        this.getResourceTypeSub(res.returnData[0].id);
        res.returnData.map((item) => {
          this.optionsRes.push({ label: item.type_name, value: item.id });
          this.resTypeData.resourceTypeSub = this.optionsRes[0].value;
        });
      }
    },
    //获得资源小节
    async getResourceTypeSub(subId) {
      this.optionsRes = [];
      var res = await getResTypeListData({ firmAppId: subId });
      if (res.returnCode == 200) {
        // console.log("小节", res);
        res.returnData.map((item) => {
          this.optionsResSub.push({ label: item.type_name, value: item.id });
          this.resTypeData.resourceType = this.optionsResSub[0].value;
        });
        this.getResList();
        this.getResFileList();
      }
    },
    async getResList() {
      let obj = {
        resourceCatalog: this.resTypeData.resourceTypeSub,
        resourceType: this.resTypeData.resourceType,
        resName: this.inputName,
        pageIndex: this.resTypeData.pageIndex,
        pageSize: this.resTypeData.pageSize,
        extName: "mp4",
      };
      var res = await getResList(obj);
      if (res && res.returnCode == 200) {
        this.resDataList = res.returnData;
        this.resTotal = res.returnCount;
      } else {
        this.resDataList = [];
        this.resTotal = 0;
      }
    },
    async getResFileList() {
      let obj = {
        resourceCatalog: this.resTypeData.resourceTypeSub,
        resourceType: this.resTypeData.resourceType,
        resName: this.inputNameTo,
        pageIndex: this.resTypeData.pageIndex,
        pageSize: this.resTypeData.pageSize,
      };
      var res = await getResFileList(obj);
      if (res && res.returnCode == 200) {
        this.resDataListTo = res.returnData;
        this.resTotalTo = res.returnCount;
        // console.log(this.resTotalTo,'this.resTotalTo');
      } else {
        this.resDataListTo = [];
        this.resTotalTo = 0;
      }
    },
    handleResType(val) {
      this.fileListData = [];
      this.ruleForm.fileList = [];
      this.checkedCities = [];
      this.resTypeData.resourceType = "";
      this.inputName = "";
      this.inputNameTo = "";
      this.getResList();
      this.getResFileList();
    },
    handleResTypeSub(val) {
      this.inputName = "";
      this.inputNameTo = "";
      this.getResList();
      this.getResFileList();
    },
    handleResTypeSubClear() {
      this.resTypeData.resourceType = "";
      this.inputName = "";
      this.inputNameTo = "";
      this.getResList();
      this.getResFileList();
    },

    //分页
    handleCurrentChangeRes(val) {
      this.resTypeData.pageIndex = val;
      this.getResList();
    },
    handleCurrentChangeResTo(val) {
      this.resTypeData.pageIndex = val;
      this.getResFileList();
    },
    //预览
    handleViewUrl(item) {
      window.open(item.FilePath);
    },
    handleViewUrls(item) {
      window.open(item.filePath);
    },
    //选择
    handleSelect(item) {
      this.viewList = [];
      if (this.checkedCities.length > 0 && this.resDataList.length > 0) {
        let fileList = this.resDataList.filter((obj1) => {
          return this.checkedCities.some((obj2) => obj2 == obj1.ResName);
        });
        fileList.forEach((item) => {
          if (item.ExtName == "mp4" || item.ExtName == "MP4") {
            this.ruleForm.videoTime = item.Duration;
          }
          this.viewList.push({
            fileName: item.ResName,
            fileType: item.ExtName,
            fileSize: item.ResSize,
            filePath: item.FilePath,
            videoTime: item.Duration,
            iconUrl: item.IconUrl,
            businessType: "",
          });
        });
      }
      console.log("this.ruleForm.fileList", this.viewList);
    },
    handleSelectTo(item) {
      this.wordList = [];
      if (this.checkedCitiesTo.length > 0 && this.resDataListTo.length > 0) {
        let fileList = this.resDataListTo.filter((obj1) => {
          return this.checkedCitiesTo.some((obj2) => obj2 == obj1.ResName);
        });
        fileList.forEach((item) => {
          this.wordList.push({
            fileName: item.ResName,
            fileType: item.ExtName,
            fileSize: item.ResSize,
            filePath: item.FilePath,
            videoTime: item.Duration,
            iconUrl: item.IconUrl,
            businessType: "",
          });
        });
      }

      console.log("this.ruleForm.fileList", this.wordList);
    },
    //table类型选择资源
    handleCurrentChange(item) {
      this.viewList = [];
      let fileList = this.resDataList.filter((obj1) => {
        return item == obj1.ResName;
      });
      fileList.forEach((item) => {
        if (item.ExtName == "mp4" || item.ExtName == "MP4") {
          this.ruleForm.videoTime = item.Duration;
        }
        this.viewList.push({
          fileName: item.ResName,
          fileType: item.ExtName,
          fileSize: item.ResSize,
          filePath: item.FilePath,
          videoTime: item.Duration,
          iconUrl: item.IconUrl,
          businessType: "",
        });
      });

      // console.log("this.ruleForm.fileList",  this.viewList);

      // this.viewList = [];
      // this.viewList.push({
      //   fileName: item.ResName,
      //   fileType: item.ExtName,
      //   fileSize: item.ResSize,
      //   filePath: item.FilePath,
      //   videoTime: item.Duration,
      //   iconUrl: item.IconUrl,
      //   businessType: "",
      // });
    },
    handleSelectionChangeTo(val) {
      this.wordList = [];
      let fileList = val;
      fileList.forEach((item) => {
        this.wordList.push({
          fileName: item.ResName,
          fileType: item.ExtName,
          fileSize: item.ResSize,
          filePath: item.FilePath,
          videoTime: item.Duration,
          iconUrl: item.IconUrl,
          businessType: "",
        });
      });
    },
    handleEle() {
      this.getResList();
    },
    handleEleTo() {
      this.getResFileList();
    },
    //-----------
    handleNewClose() {
      this.videoShow = false;
    },
    // 视频播放
    videoView() {
      console.log("播放完成");
      this.playerOptions.sources[0].src = this.detailData.studyFiles.filePath;
      this.videoShow = true;
      window.open(this.playerOptions.sources[0].src);
    },
    // 播放完回调
    onPlayerEnded() {
      console.log("播放完成");
    },
    //  监听播放进度
    onPlayerTimeupdate(e) {
      console.log(e, 2333);
    },
    //视频时长格式转换
    timeFormat(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime >= 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime >= 60) {
          hourTime = parseInt(minuteTime / 60);
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result =
        (hourTime < 10 ? "0" + hourTime : hourTime) +
        ":" +
        (minuteTime < 10 ? "0" + minuteTime : minuteTime) +
        ":" +
        (secondTime < 10 ? "0" + secondTime : secondTime);
      return result;
    },
    sendVideo(item) {
      this.ruleForm.fileId = item.fileId;
      this.ruleForm.videoTime = item.videoTime;
    },
    handleSave() {
      // 只在资源列表选择时设置 fileList
      if (this.ruleForm.type == 2) {
        this.ruleForm.fileList = [...this.viewList, ...this.wordList];
      } else {
        this.ruleForm.fileList = [];
      }
      console.log(this.ruleForm.fileList, this.viewList, this.wordList);

      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          this.ruleForm.courseId = this.info.courseId;
          this.ruleForm.chapterId = this.info.id;
          // 添加
          if (this.ruleForm.type == 2) {
            if (this.ruleForm.fileList.length == 0) {
              this.$message({
                message: "请选择一个资源内容",
                type: "warning",
              });
              return;
            }
          }
          if (!this.ruleForm.id) {
            addStudySubsectionNew(this.ruleForm).then((res) => {
              if (res.returnCode == 200) {
                this.$message({
                  message: res.returnMessage,
                  type: "success",
                });
                this.show = false;
                this.getSubsectionList();
              } else {
                this.$message({
                  message: res.returnMessage,
                  type: "warning",
                });
              }
            });
          } else {
            // 修改
            if (this.fileListData.length > 0) {
              this.ruleForm.fileList = this.fileListData;
            }
            editSubsection(this.ruleForm).then((res) => {
              if (res.returnCode == 200) {
                this.$message({
                  message: res.returnMessage,
                  type: "success",
                });
                this.show = false;
                this.getSubsectionList();
              } else {
                this.$message({
                  message: res.returnMessage,
                  type: "warning",
                });
              }
            });
          }
        } else {
          let errList = Object.values(obj)[0];
          this.$message({
            message: errList[0].message,
            type: "error",
          });
        }
      });
    },
    // 获取小节列表
    getSubsectionList() {
      this.query.courseId = this.info.courseId;
      this.query.chapterId = this.info.id;

      getStudySubsectionList(this.query).then((res) => {
        if (res.returnCode == 200) {
          this.total = res.returnCount;
          this.tableData = res.returnData;
        }
      });
    },
    // 分页
    handlePageChange(current, pageSize) {
      this.query.pageNo = current;
      this.query.pageSize = pageSize;
      this.getSubsectionList();
    },
    handleClose(val) {
      this.show = false;
    },
    /**
     * @description: 添加小节
     * @return {*}
     */
    addSubsection() {
      this.checkedCities = [];
      this.fileListData = [];
      this.checkedCitiesTo = [];
      this.getResourceType();

      if (this.tableData && this.tableData.length) {
        this.minValue = this.tableData.length + 1;
      } else {
        this.minValue = 1;
      }
      this.ruleForm = {
        courseId: "",
        chapterId: "",
        fileId: "",
        score: "",
        speedTag: "1",
        dragTag: "1",
        sort: "",
        subsectionName: "",
        videoTime: "",
        type: "1",
        fileList: [],
        studyFiles: {
          fileName: "",
          filePath: "",
          fileType: "",
          videoTime: "",
        },
      };
      this.fileId = "";
      this.show = true;
    },
    /**
     * @description: 返回章节列表
     * @return {*}
     */
    backChapter() {
      this.$emit("backChapter", {});
    },
    /**
     * @description: 小节详情
     * @param {*} row
     * @return {*}
     */
    handleDetails(row) {
      getSubsectionDetail({ id: row.id, type: row.type }).then((res) => {
        if (res.returnCode == "200") {
          this.detailData = res.returnData;
          console.log(this.detailData);
          if (this.detailData.studyFiles) {
            this.showVideo(this.detailData.studyFiles.fileType);
          }
          this.detailShow = true;
        } else {
          this.$message({
            message: res.returnMessage,
            type: "error",
          });
        }
      });
    },
    /**
     * @description: 小节编辑
     * @param {*} row
     * @return {*}
     */
    async handleEdit(row) {
      this.resTotal = 0;
      this.resTotalTo = 0;
      this.minValue = 0;
      this.fileId = row.fileId;
      var res = await getSubsectionDetail({ id: row.id, type: row.type });
      if (res.returnCode == "200") {
        this.ruleForm = Object.assign(this.ruleForm, res.returnData);
        if (!this.ruleForm.studyFiles) {
          this.ruleForm.studyFiles = {};
        }
        this.ruleForm.studyFiles.fileName =
          this.ruleForm.studyFiles.fileName || "";
        this.ruleForm.studyFiles.filePath =
          this.ruleForm.studyFiles.filePath || "";
        this.ruleForm.studyFiles.fileType =
          this.ruleForm.studyFiles.fileType || "";
        this.ruleForm.studyFiles.videoTime =
          this.ruleForm.studyFiles.videoTime || "";
      }
      this.ruleForm.fileList = res.returnData.fileList;

      this.resTypeData.resourceType = "";
      this.resTypeData.resourceTypeSub = "";
      this.fileListData = res.returnData.fileList;
      this.show = true;
    },
    /**
     * @description: 小节答题
     * @param {*} row
     * @return {*}
     */
    handleAnswer(row) {
      let param = {
        id: row.id,
      };
      getSubsectionDetail(param).then((res) => {
        if (res.returnCode == "200") {
          this.addDisplay = true;
          this.answerList = res.returnData;
        } else {
          this.$message({
            message: res.returnMessage,
            type: "error",
          });
        }
      });
    },
    /**
     * @description: 小节删除
     * @param {*} row
     * @return {*}
     */
    handleDelete(row) {
      console.log(row);
      this.$confirm(
        `此操作将永久删除小节 ${row.subsectionName}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        deleteSubsection({ courseId: this.info.courseId, id: row.id }).then(
          (res) => {
            if (res.returnCode == 200) {
              this.getSubsectionList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "error",
                message: res.returnMessage,
              });
            }
          }
        );
      });
    },
    /**
     * @description: 每页多少条
     * @param {*} val
     * @return {*}
     */
    handleSizeChange(val) {
      console.log(val);
    },
    /**
     * @description: 当前第几页
     * @param {*} val
     * @return {*}
     */
    showVideo(fileType) {
      console.log(fileType, 2333);
      switch (fileType) {
        case "doc":
        case "DOC":
        case "docx":
        case "DOCX":
        case "pdf":
        case "PDF":
        case "ppt":
        case "PPT":
        case "pptx":
        case "PPTX":
        case "xls":
        case "XLS":
        case "xlsx":
        case "XLSX":
        case "pptx":
        case "PPTX":
          this.officeVisable = true;
          this.imageVisable = false;
          this.videoVisable = false;

          break;
        case "jpg":
        case "JPG":
        case "png":
        case "PNG":
        case "jpeg":
        case "JPEG":
        case "bmp":
        case "BMP":
        case "webp":
        case "WEBP":
          this.officeVisable = false;
          this.imageVisable = true;
          this.videoVisable = false;

          break;
        case "mp4":
        case "MP4":
        case "mp3":
        case "MP3":
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = true;
          this.playerOptions.sources[0].src =
            this.detailData.studyFiles.filePath;
          break;

        default:
          this.officeVisable = false;
          this.imageVisable = false;
          this.videoVisable = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin Flex($d: row, $j: normal, $a: normal, $w: nowrap) {
  display: flex;
  flex-direction: $d;
  justify-content: $j;
  align-items: $a;
  flex-wrap: $w;
}

@mixin Font($s: 12px, $c: #000, $w: 500, $f: "Roboto-Medium, Roboto") {
  font-size: $s;
  color: $c;
  font-weight: $w;
  font-family: $f;
}

.Subsection {
  .SubsectionTop {
    @include Flex(row, space-between, center, wrap);
  }

  .SubsectionTopLeft {
    font-size: 16px;
    font-weight: 500;
  }

  .SubsectionCenter {
    margin: 15px 0;
  }

  .SubsectionFooter {
    margin-top: 15px;
    @include Flex(row, center, center, warp);
  }
}

::v-deep .el-dialog {
  .el-dialog__footer {
    margin-top: 0;
  }
}

::v-deep .el-descriptions__body {
  .el-descriptions-item {
    padding-bottom: 20px;

    .el-descriptions-item__content {
      color: rgba(150, 156, 156, 1);
    }
  }
}
.new-box {
  width: 100%;
  min-height: 140px;
  border: 1px solid rgba($color: #000000, $alpha: 0.1);
  .look {
    display: flex;
    flex-wrap: wrap;

    .box {
      margin: 5px;
      width: 32%;
      height: 240px;
      border: 1px solid rgba($color: #000000, $alpha: 0.1);
      overflow: hidden;

      .view {
        margin: 0 15px;
        width: 90%;
        height: 140px;
        position: relative;

        .bg {
          position: absolute;
          left: 44%;
          top: 36%;
        }
        .bg:hover {
          cursor: pointer;
        }
      }
      .type {
        height: 20px;
        line-height: 20px;
        margin: 5px 15px 0 15px;
      }
      .tiem {
        height: 20px;
        line-height: 20px;
        margin: 0px 15px 0 15px;
      }
    }
  }
  .block {
    display: flex;
    justify-content: center;
    align-content: center;
  }
}
.look-no {
  width: 100%;
  min-height: 240px;
  border: 1px solid rgba($color: #000000, $alpha: 0.1);
  display: flex;
  flex-wrap: wrap;

  .ts {
    width: 100%;
    font-size: 14px;
    color: rgba($color: #ff3838, $alpha: 0.3);
  }

  .box {
    margin: 5px;
    width: 32%;
    height: 200px;
    border: 1px solid rgba($color: #000000, $alpha: 0.1);

    .view {
      margin: 0 15px;
      width: 90%;
      height: 140px;
      position: relative;

      .bg {
        position: absolute;
        left: 44%;
        top: 36%;
      }
      .bg:hover {
        cursor: pointer;
      }
    }
    .type {
      height: 20px;
      line-height: 20px;
      margin: 5px 15px 0 15px;
    }
    .tiem {
      height: 20px;
      line-height: 20px;
      margin: 0px 15px 0 15px;
      white-space: nowrap; /* 禁止换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis;
    }
  }
}
::v-deep .el-checkbox {
  width: 100%;
  .el-checkbox__label {
    width: 90%;
    overflow: hidden;
    /* 设置文本一行显示 */
    text-overflow: ellipsis;
    /* 设置文本不换行 */
    white-space: nowrap;
  }
}

</style>
