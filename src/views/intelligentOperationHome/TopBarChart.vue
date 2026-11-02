<template>
  <section id="top_bar_chart"></section>
</template>
<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataItem: {
      type: Array,
      default: []
    },
    energyType: {
      type: String,
      default: 'ENERGY_ELECTRIC'
    }
  },
  data: function () {
    return {
      options: {
        grid: {
          top: '20%',
          bottom: '9%',
          left: '8%',
          right: '8%'
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          nameTextStyle: {
            color: '#ccd4ff'
          },
          name: '(时)',
          type: 'category',
          data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          axisLabel: {
            textStyle: {
              color: "#ccd4ff",
            },
          },
          axisLine: {
            lineStyle: {
              color: '#374D80'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          nameTextStyle: {
            color: '#ccd4ff'
          },
          name: '',
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#374D80'
            }
          },
          axisLabel: {
            textStyle: {
              color: "#ccd4ff",
            },
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            itemStyle: {
              barBorderRadius: [4, 4, 4, 4],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 1, color: '#00ced8' },
                { offset: 0, color: '#d9ffff' }
              ])
            },
            barWidth: 8,
            data: [],
            type: 'bar'
          }
        ]
      }
    }
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let myChart = this.$echarts.init(document.getElementById('top_bar_chart'));
      this.options.series[0].data = this.dataItem
      this.options.yAxis.name = this.energyType === 'ENERGY_ELECTRIC' ? '(kWh)' : '(t)'
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    }
  }
}
</script>
<style lang="scss" scoped>
#top_bar_chart {
  width: 100%;
  height: 208px;
}
</style>
    