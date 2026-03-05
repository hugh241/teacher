<!--  -->
<template>
  <div class="flex_R">
    <li class="oneLi" v-for="(item, index) in buttonName" :key="index" :class="{ btn: true, active: btnIndex == index }"
      @click="handleBtnTwo(item, index)">
      {{ item.title }} 
      <div class="redbox" v-if="item.count == 1"></div>
    </li>
  </div>
</template>

<script>
export default {
  props: ["buttonName",],
  components: {},
  data() {
    return {
      btnIndex: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleBtnTwo(item, index) {
      this.btnIndex = index;
      this.$emit("handleBtn", item);
    },
  },
  created() { },
  mounted() { 
    console.log('适当',this.buttonName);
  },
};
</script>

<style lang="scss" scoped>
li {
  position: relative;
  font-size: 14px;
  padding: 0 20px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: 500;
  border-radius: 70px;
  cursor: pointer;
  color: #4E5969;
}

.active {
  background: rgba(191, 217, 255, 0.25);
  color: #165dff;
}
.redbox{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: 0;
  right: 5px;
}
</style>