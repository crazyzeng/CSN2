<template>
  <div class="chart_box">
    <bar-chart :data="data" :type="type" />
  </div>
</template>
<script>
import BarChart from './BarChart1.vue';
export default {
  props: {
    dataFlag: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: { BarChart },
  data() {
    return {}
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData
    },
    handleClose() {
      this.$emit('close')
    },
  }
}
</script>
<style lang="scss" scoped>
.chart_box {
  height: 500px;
}
</style>