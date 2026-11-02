<template>
  <div id="line1" ref="line1" :style="{ height: '100%' }"></div>
</template>

<script>
import resize from '@/utils/resize.js';
import * as echarts from 'echarts';

export default {
  name: 'barChart1',
  mixins: [resize],
  props: {
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
          top: 75,
          left: 30,
          right: 75,
          bottom: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#505765',
            },
            crossStyle: {
              color: '#999',
            },
          },
        },
        legend: {
          data: ['无功罚款', '功率因素'],
          textStyle: {
            color: '#fff',
          },
          right: 175,
          top: 33,
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
              type: 'line',//shadow,line
            },
            axisLabel: {
              color: '#93DCFE',
            },
          },
        ],
        yAxis: [
          {
            name: '无功罚款（元）',
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
          {
            name: '功率因素',
            // nameLocation: 'start',
            min: -5,
            max: 5,
            type: 'value',
            // inverse: true,
            //
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
              show: false,
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
            name: '无功罚款',
            type: 'line',
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#4EC8FF' },
              { offset: 1, color: '#D76DFF' },
            ]),
            data: [],
          },
          {
            name: '功率因素',
            type: 'line',
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#E95F16' },
              { offset: 1, color: '#FFC78F' },
            ]),
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    'dataOption.seriesData': function () {
      this.getData()
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      this.myChart = this.$echarts.init(document.getElementById('line1'));
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
