<!--  -->
<template>
    <div>
        <el-table :data="tableData" style="width:100%;" header-cell-class-name="tabble_header">
            <template v-for="(tabitem, tabindex) in  tabbleList ">
                <el-table-column v-if="tabitem.type == 'index'" type="index" :label="tabitem.label" align="center"
                    :width="tabitem.width ? tabitem.width : '80'"></el-table-column>
                <el-table-column v-else-if="tabitem.type == 'custom'" :label="tabitem.label" align="center"
                    :width="tabitem.width">
                    <template slot-scope="scope">
                        <slot :name="tabitem.custom" :row="scope.row"></slot>
                    </template>
                </el-table-column>
                <el-table-column v-else :label="tabitem.label" align="center" :width="tabitem.width">
                    <template slot-scope="scope">
                        <span>{{ scope.row[tabitem.props] }}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>

export default {
    props: ['tabbleList', 'tableData'],
    components: {},
    data() {
        return {

        };
    },
    computed: {},
    watch: {},
    methods: {

    },
    created() {

    },
    mounted() {

    },

}
</script>

<style lang="scss" scoped>
::v-deep .el-table {
    .tabble_header {
        text-align: center;
        color: #121111;

        background-color: #f5f5f5;
    }
}
</style>