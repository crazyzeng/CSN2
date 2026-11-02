<template>
  <div style="height:100%">
    <div id="topChart" ref="barChart" :style="{ height: '50%' }"></div>
    <div id="bottomChart" ref="barChart1" :style="{ height: '50%' }"></div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index';
import resize from '@/utils/resize.js';
import * as echarts from 'echarts';

export default {
  name: 'TrendChart',
  mixins: [resize],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      myChart: null,
      myChart1: null,
      optionNew: {},
      curData: {},
      options: {
        title: {
          text: '',
          subtext: '',
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          // top: 10,
          // left: 25,
          // right: 25,
          // bottom: 20,
          // containLabel: true,
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
          show: false,
          data: ['实际值', '预测值'],
          textStyle: {
            color: '#fff',
          },
          right: 88,
          top: 5,
        },
        xAxis: [
          {
            type: 'category',
            name: '(时)',
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
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
            name: '',
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
            name: '',
            type: 'bar',
            barWidth: 10,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#B2FEFF' },
              { offset: 1, color: '#02E0EF' },
            ]),
            showBackground: false,
            backgroundStyle: {
              color: '#f5f7ff',
            },
            itemStyle: {
              normal: {
                borderRadius: [5, 5, 0, 0],
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    data: function (data) {
      this.initChartData()
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    drawChart() {
      this.myChart = this.$echarts.init(document.getElementById('topChart'));
      window.onresize = this.myChart.resize;
      this.myChart.setOption(this.options);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById('bottomChart'));
      window.onresize = this.myChart1.resize;
      this.myChart1.setOption(this.options);
    },
    // 初始化
    async init() {
      this.drawChart();
      this.drawChart1();
    },
    initChartData() {
      const tempOption = deepClone(this.options);
      this.options.series[0].data = Object.values(this.data)[0];
      this.options.title.subtext = '实际';
      let tempUnit = '';
      if (this.type === '1') tempUnit = '热';
      else if (this.type === '2') tempUnit = '电';
      else if (this.type === '3') tempUnit = '水';
      else if (this.type === '4') tempUnit = '气';
      this.options.yAxis[0].name = tempUnit;
      this.drawChart();
      tempOption.series[0].data = Object.values(this.data)[1];
      tempOption.title.subtext = '预测';
      tempOption.yAxis[0].name = tempUnit;
      this.myChart1?.setOption(tempOption);
    },
  },
};
</script>

<style lang="scss" scoped></style>
