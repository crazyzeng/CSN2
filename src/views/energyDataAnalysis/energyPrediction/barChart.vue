<template>
  <div style="height:100%">
    <div style="height:50%;position:relative">
      <span class="content_title">{{topTitle}}</span>
      <div id="barChart" ref="barChart" :style="{ height: '100%' }"></div>
      <span style="position: absolute;top:30px;right:100px;font-size: 20px;font-weight: bold;">总值:{{ topSum }}{{ unit }}</span>
    </div>
    <div style="height:50%;position:relative">
      <span class="content_title">{{botTitle}}</span>
      <div id="barChart1" ref="barChart1" :style="{ height: '100%' }"></div>
      <span style="position: absolute;top:30px;right:100px;font-size: 20px;font-weight: bold;">总值:{{ botSum }}{{ unit }}</span>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index';
import resize from '@/utils/resize.js';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import Big from 'big.js'

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
      topSum: 0,
      botSum: 0,
      mode: '',
      modeName: '',
      unit: 'kWh',
      topTitle:'',
      botTitle:'',
      options: {
        title: {
          show:false,
          text: '',
          textStyle: {
            color: '#fff',
          },
          left: 'center',
          subtext: '',
          subtextStyle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'normal',
          },
        },
        grid: {
          top: '30%',
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
                color: '#93DCFE',
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
      this.myChart = this.$echarts.init(document.getElementById('barChart'));
      this.myChart.setOption(this.options);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById('barChart1'));
      this.myChart1.setOption(this.options);
    },
    // 初始化
    async init() {
      this.drawChart();
      this.drawChart1();
      window.addEventListener("resize", () => {
        this.myChart.resize();
        this.myChart1.resize();
      });
    },
    initChartData() {
      const tempOption = deepClone(this.options);
      this.mode = this.data.mode
      let tempArray = Object.values(this.data.yc)[0]
      this.options.series[0].data = tempArray;
      this.topSum = this.getSum(Object.values(this.data.yc)[0])
      this.botSum = this.getSum(Object.values(this.data.jc)[0])
      if (this.mode === 1) {
        this.modeName = '制热'
      }
      if (this.mode === 0) {
        this.modeName = '制冷'
      }
      if (!this.mode && this.mode !== 0) {
        this.modeName = ''
      }
      this.options.title.subtext = dayjs(Object.keys(this.data.yc)[0]).format('YYYY-MM-DD') + `${this.modeName}` + ' 预测能耗'
      this.topTitle = dayjs(Object.keys(this.data.yc)[0]).format('YYYY-MM-DD') + `${this.modeName}` + ' 预测能耗'
      let tempUnit = '';
      if (this.type === '1') {
        tempUnit = 'GJ';
        this.unit = 'GJ';
      } else if (this.type === '2') {
        tempUnit = 'kWh';
        this.unit = 'kWh';
      } else if (this.type === '3') {
        tempUnit = 't';
        this.unit = 't';
      } else if (this.type === '4') {
        tempUnit = 'm³';
        this.unit = 'm³';
      }
      this.options.yAxis[0].name = tempUnit;
      this.drawChart();
      let tempArray1 = Object.values(this.data.jc)[0];
      tempOption.series[0].data = tempArray1;
      tempOption.title.subtext = dayjs(Object.keys(this.data.jc)[0]).format('YYYY-MM-DD') + `${this.modeName}` + ' 实际能耗'
      this.botTitle = dayjs(Object.keys(this.data.jc)[0]).format('YYYY-MM-DD') + `${this.modeName}` + ' 实际能耗'
      tempOption.yAxis[0].name = tempUnit;
      this.myChart1.setOption(tempOption);
    },
    getSum(data) {
      let sum = new Big(0)
      if (data && data.length > 0) {
        data.forEach(e => {
          sum = sum.plus(new Big(e ?? 0))
        });
      }
      return sum.toFixed(2)
    }
  },
};
</script>

<style lang="scss" scoped>
.content_title {
  position: absolute;
  display: block;
  width: 223px;
  height: 27px;
  line-height: 27px;
  text-indent: 20px;
  background-image: url(../../../assets/img/title_bg.png);
  // margin: 20px 0 10px 0;
  top:30px;
  left: 20px;
}
</style>
