<template>
  <section id="center_bar_chart"></section>
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
          top: '10%',
          bottom: '15%',
          left: '26%',
          right: '14%'
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          nameTextStyle: {
            color: '#ccd4ff'
          },
          name: '(kWh)',
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
            show: true,
            lineStyle: {
              type: 'dotted',
              color: '#293E58'
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            color: '#ccd4ff'
          },
          type: 'category',
          data: [],
          axisLabel: {
            textStyle: {
              color: "#ccd4ff",
            },
            formatter: function (val) {
              return val.length > 7 ? val.substr(0, 7) + "..." : val;
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#374D80'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            itemStyle: {
              barBorderRadius: [4, 4, 4, 4],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 1, color: '#0044cc' },
                { offset: 0, color: '#2fdfff' }
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
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.addEventListener('resize', this.handleResize);
    });
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
    'energyType': function () {
      this.init()
    },
  },
  beforeDestroy() {
    // 移除监听器，防止内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById('center_bar_chart'));
      let seriesArray = [], yAxisData = [];
      this.dataItem.forEach(v => {
        for (let key in v) {
          seriesArray.push(v[key]);
          yAxisData.push(key);
        }
      });
      this.options.series[0].data = seriesArray;
      this.options.yAxis.data = yAxisData;
      this.options.xAxis.name = this.energyType === 'ENERGY_ELECTRIC' ? '(kWh)' : '(t)'
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
#center_bar_chart {
  width: 100%;
  height: 270px;
}
</style>