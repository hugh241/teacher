<template>
    <div class="content">
        <div class="searchbox">
            <span style="font-size: 18px;">{{ courseNameItem.courseName || "" }}</span>
            <el-select v-model="courseNameItem" value-key="id" @change="hanlderChange" placeholder="请选择培训名称">
                <el-option v-for="item in options" :key="item.id" :label="item.courseName" :value="item">
                </el-option>
            </el-select>
        </div>
        <!-- 用户卡片 -->
        <div class="card-box">
            <div class="left">
                <!-- 头像 -->
                <div class="head">
                    <div class="block">
                        <el-avatar :size="60" :src="imgHead"></el-avatar>
                    </div>
                </div>
                <div class="introduce">
                    <p class="name">{{ userInfo.userName }}</p>
                    <p class="school">{{ userInfo.schoolName }}</p>
                </div>
            </div>
            <div class="right">
                <div class="card">
                    <p class="num">{{ courseHour | getTime }}</p>
                    <p class="title">该课程时长</p>
                </div>
                <div class="card">
                    <p class="num">{{ completedHour | getTime }}</p>
                    <p class="title">已学习时长</p>
                </div>
                <div class="card">
                    <p class="num">{{ coursePlan }}</p>
                    <p class="title">学习进度</p>
                </div>
                <!-- <div class="card">
                    <p class="num">{{ rating || "暂无" }}</p>
                    <p class="title">评价等级</p>
                </div> -->
                <!-- <div class="card">
                    <p class="num">{{ cardData.notCompletedTrain || 0 }}</p>
                    <p class="title">未完成培训</p>
                </div> -->
            </div>
        </div>
        <div class="textbox">
            <!-- 心得 -->
            <div class="xd">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item class="fromlabel" label="心得：">
                        <span style="font-size: 16px; word-break: break-all;" v-if="xdtext" v-html="xdtext"></span>
                        <el-empty :image-size=100 v-else description="暂无数据"></el-empty>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 证书 -->
            <div class="certificate">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item class="fromlabel" label="证书：">
                        <div class="box">
                            <!-- <img src="@/assets/images/header/zhengshu.png" alt=""> -->
                            <img :src="xdimg" v-if="xdimg" alt="">
                            <el-empty :image-size=100 v-else description="暂无数据"></el-empty>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="homework">

                <el-form ref="form" :model="form" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="分数：">
                                <span class="box1" v-if="editData && editData.score"
                                    v-html="editData.score ? editData.score : '暂未评分'"></span>
                                <span class="box1" v-else v-html="'暂未评分'"></span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="作业列表：">
                                <el-table :data="editData?.studyFiles" border style="width: 100%"
                                    :header-cell-style="{ 'background-color': '#F7F8FA' }">
                                    <el-table-column prop="fileName" label="文件名称"> </el-table-column>
                                    <el-table-column prop="fileType" label="文件类型"> </el-table-column>
                                    <el-table-column prop="fileSize" label="文件大小(KB)"> </el-table-column>
                                    <el-table-column prop="address" label="操作" width="120" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="viewClick(scope.row)">预览</el-button>
                                            <el-button type="text" @click="downClick(scope.row)">下载</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>


    </div>
    <!-- </div> -->
</template>
<script>
import { findNotesList, getResNotesList, getMyTrainCount } from '@/api/admin.js'
import { getTrainList } from '@/api/train'
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default {
    data() {
        return {
            userInfo: {},
            cardData: {},
            xdtext: '',
            form: {},
            value: '',
            options: [],
            courseNameItem: {
                id: '',
                courseName: ''
            },
            editData: {},
            userId: '',
            xdimg: '',
            imgHead: '',
            className: '',//课程名称
            courseHour: '',
            completedHour: '',
            rating: '',
            coursePlan: '',
            courseId: '',
            query: {
                courseName: '',
                level: '',
                pageNo: 1,
                pageSize: 1000,
                type: '',
                state:"0"
            },
        }
    },
    mounted() {
        console.log(this.$route.params.userId);
        this.userId = this.$route.params.userId
        this.userInfo.schoolName = this.$route.params.schoolName
        this.userInfo.userName = this.$route.params.userName
        this.courseId = this.$route.params.courseId
        this.courseNameItem.courseName = this.$route.params.courseName
        this.findNotesList()
        this.getStudyCourseList()
        this.getResNotesList()
        this.getMyTrainCount()
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
    methods: {
        //课程名称列表
        async getStudyCourseList() {
            let formData = new FormData()
            Object.keys(this.query).map(key => {
                formData.append(key, this.query[key])
            })
            const res = await getTrainList(formData)
            if (res.returnCode == 200) {
                this.options = res.returnData
            }
        },
        hanlderChange(val) {
            this.courseNameItem = val
            this.courseId = val.id
            this.getResNotesList(),
            this.getMyTrainCount()
            this.findNotesList()
        },
        //心得
        async getResNotesList() {
            const res = await getResNotesList({
                courseId: this.courseNameItem.id ? this.courseNameItem.id : this.courseId,
                userId: this.userId,
                type: '4',
                state: '1',
                pageNo: '1',
                pageSize: '10'
            })
            if (res.returnCode == 200) {
                this.xdimg = res.returnData[0]?.png_url;
                this.xdtext = res.returnData[0]?.content
            }
        },
        // 作业获取数据
        async findNotesList() {
            this.editData = []
            const res = await findNotesList({
                state: '5', userId:
                    this.userId, pageNo: 1, pageSize: 10, courseId: this.courseId
            })
            if (res.returnCode == 200) {
                res.returnData?.studyFiles.forEach(item => {
                    item.fileSize = (item.fileSize / 1024).toFixed(2)
                })
                this.editData = res.returnData
            }
        },
        async getMyTrainCount() {
            const res = await getMyTrainCount({ userId: this.userId, courseId: this.courseNameItem.id ? this.courseNameItem.id : this.courseId })
            if (res.returnCode == 200) {
                this.courseHour = res.returnData.courseHour;
                this.coursePlan = res.returnData.coursePlan;
                this.rating = res.returnData.rating
                this.completedHour = res.returnData.completedHour
            }
        },
        viewClick(val) {
            window.open(val.viewUrl)
        },
        downClick(row) {
            let query = {
                url: row.filePath,
            }
            axios({
                url: process.env.VUE_APP_BASE_API + '/file/download',
                method: 'get',
                params: query,
                headers: {
                    'X-Token': getToken(),
                },
                onDownloadProgress: pro => { },
                responseType: 'blob', // important
            }).then(res => {
                const filename = decodeURIComponent(row.fileName)
                let blob = new Blob([res.data])
                let downloadElement = document.createElement('a')
                let href = window.URL.createObjectURL(blob)
                downloadElement.href = href
                downloadElement.download = filename
                document.body.appendChild(downloadElement)
                downloadElement.click()
                window.URL.revokeObjectURL(href)
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    margin: 0;
    padding: 0;

    .searchbox {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .card-box {
        width: 100%;
        height: 160px;
        border-radius: 6px 6px 6px 6px;
        background: #f3f8ff;
        margin-top: 50px;
        padding: 0 25px 0 25px;

        .left {
            float: left;
            width: 329px;

            .head {
                float: left;
                width: 64px;
                height: 64px;
                margin: 48px 0 48px 37px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .introduce {
                width: 185px;
                float: left;
                margin-top: 50px;
                padding-left: 14px;

                .name {
                    width: 185px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    font-size: 24px;
                    font-weight: 500;
                    color: #000000;
                }

                .school {
                    width: 100%;
                    padding-top: 10px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #979797;
                }
            }
        }

        .right {
            /* width: 1080px; */
            min-width: 1000px;
            height: 100px;
            float: right;
            margin: 30px 41px 30px 0;
            display: flex;
            justify-content: space-between;

            .card {
                text-align: center;
                width: 200px;
                height: 100px;
                background: linear-gradient(180deg,
                        #e5ecff 0%,
                        rgba(255, 255, 255, 0.5) 100%);
                box-shadow: 0px 5px 4px 0px rgba(47, 97, 255, 0.05);
                border-radius: 10px 10px 10px 10px;
                opacity: 1;
                border: 1px solid;
                border-image: linear-gradient(180deg,
                        rgba(255, 255, 255, 1),
                        rgba(255, 255, 255, 0)) 1 1;

                .num {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2f61ff;
                    padding-top: 26px;
                }

                .title {
                    font-size: 16px;
                    font-weight: 400;
                    color: #333333;
                }
            }
        }
    }

    .textbox {
        width: 100%;
        margin-top: 50px;
        min-height: 100px;

        .xd {
            padding: 20px;
            width: 100%;
            min-height: 100px;
            background-color: #f3f8ff;
            margin-bottom: 30px;

            .el-form-item__label {
                font-size: 30px;
            }
        }

        .certificate {
            padding: 20px;
            width: 100%;
            min-height: 100px;
            background-color: #f3f8ff;
            margin-bottom: 30px;
        }

        .homework {
            padding: 20px;
            width: 100%;
            min-height: 100px;
            /* background-color: #f3f8ff; */
            margin-bottom: 30px;
            font-size: 16px;
        }

    }
}

::v-deep.el-form {
    .el-form-item {
        .el-form-item__label {
            font-size: 20px;
            font-weight: bolder;
        }
    }
}
</style>