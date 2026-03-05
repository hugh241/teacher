<template>
    <div class="views">
        <Header></Header>
        <div>
            <router-view></router-view>
        </div>



    </div>
</template>
  
<script>

import Header from '@/components/header/index'

export default {


    components: {
        Header,
    },
    data() {
        return {

        };
    },
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
.views {
    background-color: #eef0f7;
}
</style>
  