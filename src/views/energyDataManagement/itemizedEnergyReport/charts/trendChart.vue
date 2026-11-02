<template>
  <el-dialog width="60%" :title="dataTitle" :visible="dataFlag" :before-close="handleClose" @open="open()">
    <div id="trendLine" ref="trendLine" :style="{ height: '500px', width: '100%' }"></div>
    <div slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import resize from './mixins/resize';

export default {
  name: 'TrendChart',
  mixins: [resize],
  props: {
    dataTitle: {
      type: String,
      default: '',
    },
    dataFlag: {
      type: Boolean,
      default: false,
    },
    dataTime: {
      type: Array,
      default: () => { return [] }
    },
    dataArr: {
      type: Array,
      default() {
        return [];
      },
    },
    dataOption: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      myChart: null,
      optionNew: {},
      curData: [],
      options: {
        title: {
          text: '',
          textStyle: {
            color: '#000',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [],
          textStyle: {
            color: '#000',
          },
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#000',
            },
          },
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#000',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'darkgray',
              type: 'dashed'
            }
          },
        },
        series: [],
      },
    };
  },
  watch: {
    dataArr: {
      handler(value) {
        console.log('propData:', value)
        this.options.series = []
        let valueArray = [];
        // value.forEach((v, i) => { valueArray[i] = v.total.map(v => { return v }) })
        this.options.xAxis.data = this.dataTime
        value.forEach(v => {
          this.options.series.push({
            name: v.name,
            type: 'line',
            smooth: true,
            symbol: false,
            stack: 'Total',
            data: [...v.detail] // 只有一个点
          });
        });
        if (this.myChart !== null) this.myChart.setOption(this.options);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() { },
  methods: {
    // 初始化
    async init() {
      this.myChart = this.$echarts.init(document.getElementById('trendLine'));
      this.myChart.setOption(this.options);
    },
    open() {
      this.$nextTick(() => { this.init(); });
    },

    getData() { },
    submit() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.$emit('submit');
    },
    handleClose() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
