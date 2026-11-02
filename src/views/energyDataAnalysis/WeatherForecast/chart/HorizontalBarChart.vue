<template>
  <div ref="horizontalBarChart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'HorizontalBarChart',
  props: {
    weatherCaseList: {
      type: String,
      default: '{"cool":[31,28,13,0,0,0,0,0,0,0,19,28],"hot":[0,0,0,11,15,27,30,31,26,10,0,0]}'
    },
    categories: {
      type: Array,
      default: function () {
        return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const weatherData = JSON.parse(this.weatherCaseList);
      const seriesDataLowTemp = weatherData.cool;
      const seriesDataHighTemp = weatherData.hot;
      const maxData = Math.max(...seriesDataLowTemp, ...seriesDataHighTemp);

      const chartDom = this.$refs.horizontalBarChart;
      const myChart = echarts.init(chartDom);
      const option = {
        legend: {
          data: ['低温', '高温'],
          right: '10%',
          top: '5%',
          itemWidth: 15,
          itemHeight: 8,
          itemGap: 40,
          textStyle: {
            color: '#333' // 图例文字颜色改为白色
          }
        },
        grid: [
          {
            show: false,
            left: '0%',
            top: '10%',
            bottom: '8%',
            containLabel: true,
            width: '50%'
          },
          {
            show: false,
            right: '3.8%',
            top: '10%',
            bottom: '8%',
            containLabel: true,
            width: '50%'
          }
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'value',
            inverse: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }

            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            max: maxData
          },
          {
            name: '天',
            gridIndex: 1,
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            max: maxData
          }
        ],
        yAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: this.categories,
            axisTick: { show: false },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'white' // Y轴文字颜色改为白色
              }
            },

          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.categories,
            axisTick: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'white' // Y轴文字颜色改为白色
              }
            },
            show: false
          }
        ],
        series: [
          {
            name: '低温',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: seriesDataLowTemp,
            barWidth: 16,
            itemStyle: {
              barBorderRadius: [10, 0, 0, 10],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#6a9cfe' },
                { offset: 1, color: '#b5cfff' }
              ]),
            },
            label: {
              show: true,
              position: 'insideTop',
              textStyle: {
                color: 'white' // 数据标签文字颜色改为白色
              },
              formatter: function (params) {
                return params.value !== 0 ? params.value : '';
              }
            }
          },
          {
            name: '高温',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: seriesDataHighTemp,
            barWidth: 16,
            itemStyle: {
              // color: '#DC143C',
              barBorderRadius: [0, 10, 10, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: '#fa2d2d',
                },
                {
                  offset: 1,
                  color: '#fecaca',
                },
              ]),
            },
            label: {
              show: true,
              position: 'insideTop',
              textStyle: {
                color: 'white' // 数据标签文字颜色改为白色
              },
              formatter: function (params) {
                return params.value !== 0 ? params.value : '';
              }
            }
          }
        ]
      };

      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.echart-container {
  height: 500px;
  /* Adjust as needed */
  width: 60%;
}
</style>
