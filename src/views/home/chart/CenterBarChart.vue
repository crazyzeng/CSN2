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
          right: '10%',
          data: ['今年', '去年'],
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '6%',
          right: '6%',
          bottom: '8%',
          top: '6%',
          containLabel: false
        },
        xAxis: [
          {
            name: '（月）',
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              inside: true
            },
            axisLabel: {
              color: '#93dcfe'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: '#2d3e54',
                type: 'dashed'
              }
            },
            axisLabel: {
              color: '#93dcfe'
            }
          }
        ],
        series: [
          {
            name: '今年',
            type: 'bar',
            barGap: '30%',
            barWidth: '14px',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fbae62' },
                { offset: 1, color: '#e7570b' }
              ])
            },
            data: []
          },
          {
            name: '去年',
            type: 'bar',
            barGap: '30%',
            barWidth: '14px',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#8a84ff' },
                { offset: 1, color: '#6a49ff' }
              ])
            },
            data: []
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
      