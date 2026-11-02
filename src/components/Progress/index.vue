<template>
  <div class="progress">
    <div>
      <el-tooltip class="item" effect="dark" :content="num" :disabled='!showTooltip' :visible-arrow="false"
        placement="top-start">
        <div :style="'background-color:' + color + ';width:' + percent + ''"></div>
      </el-tooltip>
    </div>
    <span>{{ percent }}</span>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    color: {
      default: "red"
    },
    num: {
      default: "0"
    },
    percent: {
      default: "0"
    },
    showTooltip: {
      default: true
    }
  },
  data() {
    return {};
  },

  created() { },
  mounted() { },
  methods: {},
};
</script>

<style lang="scss" scoped>
.progress {
  overflow: hidden;
  line-height: 20px;
  width: 100%;

  >div {
    border: 1px solid rgba($color: #00aaff, $alpha: 0.4);
    border-radius: 20px;
    height: 20px;
    width: calc(100% - 60px);
    padding: 3px;
    box-sizing: border-box;
    float: left;
    line-height: 12px;

    >div {
      height: 100%;
      border-radius: 20px;
      float: left;
    }

    >font {
      margin-left: 5px;
      font-size: 12px;
    }
  }

  >span {
    margin-left: 10px;
  }
}
</style>
