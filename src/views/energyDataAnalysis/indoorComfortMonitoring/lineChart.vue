<template>
  <div id="trendLine" ref="trendLine" :style="{ height: '100%' }"></div>
</template>

<script>
import resize from '@/utils/resize.js';
// import * as echarts from 'echarts';

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
    dataType: {
      type: String,
      default: '',
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
      chart: null,
      optionNew: {},
      curData: {},
      options: {
        color: ['#9F80F5'],
        title: {},
        grid: {
          // top: 105,
          // bottom: 85,
          // right: 100,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {},
          },
        },
        xAxis: [
          {
            name: '时间',
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
            },
            axisLabel: {
              color: '#FEFEFF',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#263557'],
                width: 1,
                type: 'solid',
              },
            },
            data: [],
          },
        ],
        yAxis: [
          {
            position: 'left',
            name: 'PMV (人体热舒适评价指标)',
            nameTextStyle: {
              color: '#FFFFFF',
              fontSize: 14,
            },
            max: 3,
            min: -3,
            type: 'value',
            color: '#FEFEFF',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
            },
            axisLabel: {
              color: '#FEFEFF',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#263557'],
                width: 1,
                type: 'solid',
              },
            },
          },
        ],
        series: [
          {
            name: '舒适度推荐值峰值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            // areaStyle: {},
            lineStyle: {
              width: 1,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9F80F5' },
                { offset: 1, color: '#2EDCFF' },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [
              0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
              0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
            ],
          },
          {
            name: 'PMV',
            type: 'line',
            smooth: true,
            symbol: 'none',
            // areaStyle: {},
            lineStyle: {
              width: 1,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9F80F5' },
                { offset: 1, color: '#2EDCFF' },
              ]),
            },
            emphasis: {
              focus: 'series',
            },

            data: [11, 12, 13, 14, 15, 16, 15, 14, 13, 12, 11],
          },
          {
            name: '舒适度推荐值谷值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            // areaStyle: {},
            lineStyle: {
              width: 1,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9F80F5' },
                { offset: 1, color: '#2EDCFF' },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: [
              -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
              -0.5, -0.5, -0.5, -0.5, -0.5,
            ],
          },
        ],
      },
      tempArr: [],
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      let myChart = this.$echarts.init(document.getElementById('trendLine'));
      this.getXaxisData();
      window.onresize = myChart.resize;
      myChart.setOption(this.options);
    },
    getXaxisData() {
      let temp = [];
      for (let i = -1; i < 24; i++) {
        i++;
        // this.optionNew.xAxis[0].data.push(i);
        temp.push(i);
        this.tempArr.push((Math.random() - 0.5).toFixed(2));
      }
      console.log(this.tempArr);
      this.options.xAxis[0].data = temp;
      this.options.series[1].data = this.tempArr;
    },
    getData() { },
  },
};
</script>

<style lang="scss" scoped></style>
