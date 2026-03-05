<!--  -->
<template></template>

<script>

export default {
    props: ['fileType', 'fileUrl', 'ifrWidth', 'ifrHeight'],
    data() {
        return {
            yunViewUrlStr: "",
            officeVisable: false,
            imageVisable: false,
            videoVisable: false,
            otherVisable: false,
            playerOptions: {
                playbackRates: [1.0], // 可选的播放速度
                autoplay: true, // 如果为true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 是否视频一结束就重新开始。
                preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: "zh-CN",
                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
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
    computed: {},
    watch: {},
    methods: {
        // 播放完回调
        onPlayerEnded(e) {
            console.log("播放完成");
        },
        //  监听播放进度
        onPlayerTimeupdate(e) {

        },
        showVideo() {

            switch (this.fileType) {
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
                    this.ifrWidth = "90%";
                    this.ifrHeight = "90%";
                    this.officeVisable = true;
                    this.imageVisable = false;
                    this.videoVisable = false;
                    this.otherVisable = false;
                    // let param = {
                    //   extensionName: a,
                    //   uploadFilePath: this.fileUrl,
                    // };
                    // this.getFilePreview(param);
                    // setTimeout(() => {
                    //   this.ifrWidth = "100%";
                    //   this.ifrHeight = "100%";
                    // }, 200);
                    this.yunViewUrlStr = this.fileUrl;
                    // console.log(this.yunViewUrlStr)
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
                    this.yunViewUrlStr = this.fileUrl;
                    this.officeVisable = false;
                    this.imageVisable = true;
                    this.videoVisable = false;
                    this.otherVisable = false;

                    break;
                case "mp4":
                case "MP4":
                case "mp3":
                case "MP3":
                    this.officeVisable = false;
                    this.imageVisable = false;
                    this.videoVisable = true;
                    this.otherVisable = false;
                    this.playerOptions.sources[0].src = this.fileUrl;
                    // this.playerOptions.sources[0].src = this.fileUrl;
                    this.yunViewUrlStr = this.fileUrl;

                    // this.$refs.videoPlayer.player.play();
                    // this.videoPlayer.play();
                    // console.log("视频",this.videoVisable);
                    break;

                default:
                    this.officeVisable = false;
                    this.imageVisable = false;
                    this.videoVisable = false;
                    this.otherVisable = true;
            }
        },
    },

    mounted() {
        this.showVideo()
    },

}
</script>

<style lang="scss" scoped>
.fileVideo {
    .nodata {
        font-size: 24px;
        background-color: #EEF0F7;
        color: #ccc;

    }
}
</style>