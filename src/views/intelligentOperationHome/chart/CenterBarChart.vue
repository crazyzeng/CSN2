<template>
  <section id="center_bar_chart"></section>
</template>
<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataItem: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'center',
          top: '2%',
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 40,
          data: ['今年', '去年'],
        },
        grid: {
          left: '6%',
          right: '8%',
          bottom: '8%',
          top: '15%',
          containLabel: false
        },
        xAxis: [
          {
            name: '（月）',
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
              lineStyle: {
                color: '#9f9f9f'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#9f9f9f'
            }
          }
        ],
        yAxis: [
          {
            name: '(单)',
            type: 'value',
            nameTextStyle: {
              color: '#9f9f9f',
              padding: [0, 20, 5, 0]
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#2d3e54',
                type: 'dashed'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#9f9f9f'
            }
          }
        ],
        series: [
          {
            name: '今年',
            type: 'bar',
            barGap: '40%',
            barWidth: 10,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(245, 245, 245, 0.8)',
            },
            itemStyle: {
              barBorderRadius: [10, 10, 10, 10],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#e7570b' },
                { offset: 1, color: '#fbae62' }
              ])
            },
            data: [1000, 1200, 1380, 900, 1200, 1500, 1300]
          },
          {
            name: '去年',
            type: 'bar',
            barGap: '40%',
            barWidth: 10,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(245, 245, 245, 0.8)',
            },
            itemStyle: {
              barBorderRadius: [10, 10, 10, 10],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4b87ff' },
                { offset: 1, color: '#4ee7fa' }
              ])
            },
            data: [800, 1200, 1500, 1800, 1200, 1600, 1300]
          },
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
  },
  methods: {
    init() {
      let _this = this;
      let myChart = this.$echarts.init(document.getElementById('center_bar_chart'));
      myChart.off('click');
      myChart.getZr().on('click', function (e) {
        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [e.offsetX, e.offsetY])[0];
        _this.$emit('change', xIndex)
      })
      if (this.dataItem !== null && Object.keys(this.dataItem).length > 0) {
        this.options.series[0].data = this.dataItem.now.line;
        this.options.series[1].data = this.dataItem.compare.line || [];
      } else {
        this.options.series[0].data = [];
        this.options.series[1].data = [];
      }
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    },
  }
}
</script>
<style lang="scss" scoped>
#center_bar_chart {
  width: 100%;
  height: 100%;
}
</style>