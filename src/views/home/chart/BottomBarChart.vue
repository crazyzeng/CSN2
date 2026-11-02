<template>
  <section id="bottom_bar_chart"></section>
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
          show: true
        },
        grid: {
          top: '5%',
          right: '5%',
          bottom: '15%',
          left: '12%'
        },
        xAxis: {
          type: 'category',
          data: ['维修工单', '保养工单', '巡检工单'],
          axisTick: {
            inside: true,
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#93dcfe'
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#2f4761'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#93dcfe'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 44,
            data: [{
              value: 160,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#baa9eb' },
                  { offset: 1, color: '#8357fc' }
                ])
              }
            }, {
              value: 180,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#51afff' },
                  { offset: 1, color: '#008aff' }
                ])
              }
            }, {
              value: 170,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#ffcd9c' },
                  { offset: 1, color: '#ffad5b' }
                ])
              }
            }],
          }
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
      let myChart = this.$echarts.init(document.getElementById('bottom_bar_chart'));
      if (this.dataItem !== null && Object.keys(this.dataItem).length > 0) {
        for (let key in this.dataItem) {
          this.options.series[0].data.forEach((v, i) => {
            if (key === 'repair' && i === 0) v.value = this.dataItem[key]
            if (key === 'maintain' && i === 1) v.value = this.dataItem[key]
            if (key === 'inspect' && i === 2) v.value = this.dataItem[key]
          })
        }
      }
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    }
  }
}
</script>
<style lang="scss" scoped>
#bottom_bar_chart {
  width: 100%;
  height: 100%;
}
</style>
      