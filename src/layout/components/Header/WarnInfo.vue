<template>
  <i class="th-icon-warn" @click="$router.push({ name: 'AlarmLog' })" :title="`告警数量: ${getNumber}`"><span
      v-if="getNumber">{{ getNumber }}</span></i>
  <!-- <el-tooltip effect="dark" :content="dataMsg" placement="bottom-start">
  </el-tooltip> -->
</template>

<script>
export default {
  name: 'WarnInfo',
  props: {
    dataNumber: {
      type: Number,
      default: 0
    },
    dataMsg: {
      type: String,
      default: ""
    }
  },
  computed: {
    getNumber() {
      return this.dataNumber > 99 ? '99+' : this.dataNumber
    }
  },
}
</script>

<style lang="scss" scoped>
.th-icon-warn {

  position: relative;

  >span {

    position: absolute;
    top: -50%;
    right: -50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: white;
    font-size: 12px;
    font-style: initial;
    text-align: center;
    border-radius: 50%;
    background-color: red;
  }
}
</style>
