<template>
  <div id="bar2" ref="bar2" :style="{ height: '100%' }"></div>
</template>

<script>
import resize from '@/utils/resize.js';
import * as echarts from 'echarts';

export default {
  name: 'barChart2',
  mixins: [resize],
  props: {
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
      myChart: null,
      optionNew: {},
      curData: [],
      options: {
        title: {
          text: '',
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          top: 150,
          left: 30,
          right: 30,
          bottom: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
          axisPointer: {
            type: 'line',
          },
        },
        legend: {
          data: ['容量', '需量'],
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: 96,
        },
        xAxis: [
          {
            name: '(月)',
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            data: [],
            axisPointer: {
              type: 'shadow',
            },
            axisLabel: {
              color: '#93DCFE',
            },
          },
        ],
        yAxis: [
          {
            name: '（元）',
            nameTextStyle: {
              color: '#93DCFE',
              padding: [0, 25, 10, 0],
              fontSize: 12,
            },
            type: 'value',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#2f4761'],
                width: 1,
                type: 'dashed',
              },
            },
            axisLabel: {
              color: '#93DCFE',
            },
          },
        ],
        series: [
          {
            name: '容量',
            type: 'bar',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#E7570B' },
              { offset: 1, color: '#FBAE62' },
            ]),
            data: [],
          },
          {
            name: '需量',
            type: 'bar',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#6A49FF' },
              { offset: 1, color: '#8A84FF' },
            ]),
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    'dataOption.seriesData':
      function (val) {
        this.getData()
      },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      this.myChart = this.$echarts.init(document.getElementById('bar2'));
      this.myChart.setOption(this.options);
      window.onresize = this.myChart.resize;
    },

    getData() {
      this.options.xAxis[0].data = this.dataOption.xData;
      this.options.series[0].data = this.dataOption.seriesData;
      this.options.series[1].data = this.dataOption.seriesData1;
      this.myChart.setOption(this.options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
