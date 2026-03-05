<!-- 章节管理 -->
<template>
  <div class=''>
    <setChapter style="marginTop: 20px;" :courseId="courseId" :editTag="true" />
  </div>
</template>

<script>

export default {
  props: {
    courseId: {
      type: String,
      default: '',
    },
  },
  components: {
    setChapter: () => import('@/views/train/components/publish/components/setChapter.vue'),
  },
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

<style scoped></style>