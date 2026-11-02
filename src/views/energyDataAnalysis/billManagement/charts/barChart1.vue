<template>
  <div id="bar1" ref="bar1" :style="{ height: '100%' }"></div>
</template>

<script>
import resize from '@/utils/resize.js';
import * as echarts from 'echarts';

export default {
  name: 'barChart1',
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
          top: 100,
          left: 30,
          right: '3%',
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
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ['尖峰电费', '高峰电费', '平段电费', '谷段电费'],
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          top: 5,
        },
        xAxis: [
          {
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
            name: '尖峰电费',
            type: 'bar',
            stack: '电费',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#E7570B' },
              { offset: 1, color: '#F6905A' },
            ]),
            data: [],
          },
          {
            name: '高峰电费',
            type: 'bar',
            stack: '电费',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#FFAD5B' },
              { offset: 1, color: '#FFCD9C' },
            ]),
            data: [],
          },
          {
            name: '平段电费',
            type: 'bar',
            stack: '电费',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#008AFF' },
              { offset: 1, color: '#51AFFF' },
            ]),
            data: [],
          },
          {
            name: '谷段电费',
            type: 'bar',
            stack: '电费',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              { offset: 0, color: '#8357FC' },
              { offset: 1, color: '#BAA9EB' },
            ]),
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    dataOption: {
      handler(val) {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.myChart = this.$echarts.init(document.getElementById('bar1'));
      this.myChart?.setOption(this.options);
      window.onresize = this.myChart.resize;
    },

    getData() {
      this.options.xAxis[0].name = this.dataOption.unit;
      this.options.xAxis[0].data = this.dataOption.xData;
      this.options.series[0].data = this.dataOption.seriesData;
      this.options.series[1].data = this.dataOption.seriesData1;
      this.options.series[2].data = this.dataOption.seriesData2;
      this.options.series[3].data = this.dataOption.seriesData3;
      this.myChart?.setOption(this.options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
