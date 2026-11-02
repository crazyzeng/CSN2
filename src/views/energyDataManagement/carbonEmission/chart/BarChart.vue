<template>
  <section style="width:100%;height:100%">
    <section class="echarts_box mb-4">
      <span class="content_title">碳排放量</span>
      <section class="bar_chart" ref="chart1"></section>
    </section>
    <section class="echarts_box">
      <span class="content_title">碳减少量</span>
      <section class="bar_chart" ref="chart2"></section>
    </section>
  </section>
</template>
<script>
import * as echarts from 'echarts'
import { deepClone } from '@/utils/index'
export default {
  props: {
    barData: {
      type: Object,
      default: () => { }
    },
    barTime: {
      type: String,
      default: '日'
    }
  },
  data: function () {
    return {
      options: {
        title: {
          subtext: '(t)',
          left: 28,
          top: -15
        },
        grid: {
          top: '8%',
          left: '8%',
          right: '5%',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            position: 'bottom',
            name: '',
            nameTextStyle: {
              padding: [0, 0, 0, -10]
            },
            axisLabel: {
              textStyle: {
                color: '#808080'
              }
            },
            axisTick: {
              show: false,
              inside: true,
            },
            axisLine: {
              lineStyle: {
                color: "#DCDCDC"
              }
            },
            splitLine: {
              show: false
            },
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#808080',
                fontSize: 11
              }
            },
            axisTick: {
              show: false,
              inside: true,
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: [],
            barGap: '-100%',
            itemStyle: {
              color: '#F5F5F5',
              barBorderRadius: [10, 10, 10, 10]
            },
            barWidth: 10,
            silent: true,
            z: 1,
            tooltip: {
              show: false
            }
          },
          {
            name: '',
            type: 'bar',
            data: [],
            barGap: '-100%',
            itemStyle: {},
            barWidth: 10,
            z: 2
          },
        ]
      }
    }
  },
  watch: {
    barData: {
      handler: function () {
        this.init();
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const tempOption = deepClone(this.options)
      // 碳排放量图表
      let myChart = this.$echarts.init(this.$refs.chart1);
      // 碳减少量图表
      let myChart1 = this.$echarts.init(this.$refs.chart2);
      let xAxisData = [];

      if (this.barData && Object.keys(this.barData).length > 0) {
        const emissionData = this.barData.emission.barData;
        const decrementData = this.barData.decrement.barData;

        const emissionBgData = emissionData.map(val => val ? val * 1.2 : 0);
        const decrementBgData = decrementData.map(val => val ? val * 1.2 : 0);

        this.options.series[1].data = emissionData;
        tempOption.series[1].data = decrementData;

        this.options.series[0].data = emissionBgData;
        tempOption.series[0].data = decrementBgData;

        this.options.series[1].name = '碳排放量'
        tempOption.series[1].name = '碳减少量'

        tempOption.series[1].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#85AEFE' },
          { offset: 1, color: '#B5CDFE' }
        ])
        this.options.series[1].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#A4CC47' },
          { offset: 1, color: '#D1E5A5' }
        ])

        tempOption.series[1].itemStyle.barBorderRadius = [10, 10, 10, 10]
        this.options.series[1].itemStyle.barBorderRadius = [10, 10, 10, 10]

        for (let i in this.barData.decrement.barData) { xAxisData.push(Number(i) + 1); }
        this.options.xAxis[0].data = xAxisData;
        tempOption.xAxis[0].data = xAxisData;
        this.barTime === 'month' ? this.options.xAxis[0].name = '日' : this.options.xAxis[0].name = '月';
        this.barTime === 'month' ? tempOption.xAxis[0].name = '日' : tempOption.xAxis[0].name = '月';
      }

      const self = this;
      const tooltipFormatter = function(params) {
        if (!params || params.length === 0) return '';
        const series = params[0];
        const axisValue = series.axisValue; 
        const suffix = self.barTime === 'month' ? '日' : '月';
        const xLabel = `${axisValue}${suffix}`;
        const value = series.value;
        // 保留两位小数
        const valueStr = (typeof value === 'number') ? value.toFixed(2) : value;
        return `${xLabel}<br/>${series.seriesName} ${valueStr}t`;
      };

      // 应用到两个图表
      this.options.tooltip = {
        ...this.options.tooltip,
        formatter: tooltipFormatter
      };
      tempOption.tooltip = {
        ...tempOption.tooltip,
        formatter: tooltipFormatter
      };

      myChart.setOption(this.options);
      myChart1.setOption(tempOption);
      
      window.onresize = function() {
        myChart.resize();
        myChart1.resize();
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.bar_chart {
  height: calc(100% - 30px);
  background-repeat: no-repeat;
}

.echarts_box {
  width: 100%;
  height: calc(50% - 8px);
  background-color: #fff;
  box-shadow: 6px 6px 5px 0px rgb(0 0 0 / 20%);
  border-radius: 5px;
  // margin-bottom: 15px;
  padding: 10px 0 0 10px;
}

.content_title {
  margin: 0 0 10px 0;
  display: block;
  width: 223px;
  height: 25px;
  line-height: 25px;
  color: #313131;
  font-size: 14px;
  text-indent: 35px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(../../../../assets/img/energyManagement/title_bg.png);
}
</style>