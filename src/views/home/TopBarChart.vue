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
          bottom: '18%',
          left: '13%',
          right: '15%'
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
    this.$nextTick(() => {
      this.init();
      window.addEventListener('resize', this.handleResize);
    });
  },
  beforeDestroy() {
    // 移除监听器，防止内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById('top_bar_chart'));
      this.options.series[0].data = this.dataItem
      this.options.yAxis.name = this.energyType === 'ENERGY_ELECTRIC' ? '(kWh)' : '(t)'
      this.myChart.setOption(this.options);
      window.onresize = this.myChart.resize;
    },
    handleResize() {
      // 自适应图表大小
      if (this.myChart) {
        this.myChart.resize();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#top_bar_chart {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
    