
<!-- 群组设置 -->
<template>
    <div class='setGroup_wrap'>
        <!-- <breadCrumb :title="`群组设置`"></breadCrumb> -->
        <div class="setGroup_title flex_R_B">
            <p>群组设置</p>
        </div>
        <div class="setGroup">

        </div>
    </div>
</template>

<script>
// import { getGroupList } from '@/api/setGroup'
export default {
    // components: {
    //     // 面包屑
    //     breadCrumb: () => import('@/components/Breadcrumb/index.vue'),

    // },
    data() {
        return {
            query:{
                pageIndex:1,
                pageSize:10,
                keyWord:''
            }
        };
    },
    computed: {},
    watch: {},
    methods: {
        // 获取群组列表
        getGroupList(){

        }
    },
    created() {

    },
    mounted() {

    },

}
</script>

<style lang="scss" scoped>
.setGroup_wrap {
    .setGroup_title {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        p {
            font-size: 20px;
            font-weight: 600;
            padding: 5px 0px 20px 30px;
        }

        .backbtn {
            padding-right: 30px;
            color: #1890FF;
            line-height: 40px;

            img {
                position: absolute;
                margin: 8px 0px 0px -30px
            }

            &:hover {
                cursor: pointer;
                opacity: 0.8;
            }
        }

    }
    .setGroup{
        margin: 10px;
    background: #fff;
    min-height: calc( 100vh - 250px );
    padding: 30px;
    border-radius: 10px;
    }
}</style>