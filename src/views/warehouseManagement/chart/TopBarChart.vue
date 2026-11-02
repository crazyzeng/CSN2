<template>
  <section ref="myChart" class="ck_bar_chart"></section>
</template>
<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataItem: {
      type: Object,
      default: () => { }
    },
    energyType: {
      type: String,
      default: 'ENERGY_ELECTRIC'
    }
  },
  data: function () {
    return {
      options: {
        graphic: [
          {
            type: "text",
            left: '3%',
            style: {
              text: "(件)",
              fill: "#666",
              fontSize: 12,
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['今年', '去年'],
          textStyle: {
            color: '#000'
          }
        },
        grid: {
          left: '6%',
          right: '8%',
          bottom: '15%',
          top: '10%',
          containLabel: false
        },
        xAxis: [
          {
            name: '（月）',
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisTick: {
              inside: true
            },
            axisLabel: {
              color: '#999'
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
              color: '#999'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
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
                { offset: 0, color: '#FA433D' },
                { offset: 1, color: '#FCA426' }
              ]),
              barBorderRadius: [7, 7, 7, 7],
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
                { offset: 0, color: '#4C88FF' },
                { offset: 1, color: '#4EE6FB' }
              ]),
              barBorderRadius: [7, 7, 7, 7],
            },
            data: []
          },
        ]
      },
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
    'energyType': function () {
      this.init()
    },
  },
  methods: {
    init() {
      let that = this;
      let myChart = this.$echarts.init(this.$refs.myChart);
      myChart.off('click');
      myChart.getZr().on('click', function (e) {
        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [e.offsetX, e.offsetY])[0];
        that.$emit('monthChange', xIndex)
      })
      if (this.dataItem && Object.keys(this.dataItem).length > 0) {
        this.options.series[0].data = this.dataItem.now?.line || [];
        this.options.series[1].data = this.dataItem.compare?.line || [];
      }

      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    },
  }
}
</script>
<style lang="scss" scoped>
.ck_bar_chart {
  width: 100%;
  height: calc(100% - 50px);
}
</style>