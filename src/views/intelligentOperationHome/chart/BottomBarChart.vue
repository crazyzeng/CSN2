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
          show: true,
          trigger: 'axis',
        },
        grid: {
          top: '10%',
          right: '5%',
          bottom: '8%',
          left: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['维修工单', '保养工单', '巡检工单'],
          axisTick: { show: false },
          axisLine: { show: true,
            lineStyle: {
              color: '#ccc'
            }
           },
          axisLabel: {
            color: '#999',
            margin: 15
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#2f4761'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#9f9f9f'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 10,
            barGap: '-100%', // 重叠
            // data: [100, 100, 100],
            itemStyle: {
              color: 'rgba(200,200,200,0.3)',
              borderRadius: [10, 10, 10, 10]
            },
            z: 1
          },

          {
            type: 'bar',
            barWidth: 10,
            data: [
              {
                value: 0,
                itemStyle: {
                  borderRadius: [10, 10, 10, 10],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#a3cc45' },
                    { offset: 1, color: '#d5e6b1' }
                  ]),
                }
              },
              {
                value: 0,
                itemStyle: {
                  borderRadius: [10, 10, 10, 10],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#6a9cfe' },
                    { offset: 1, color: '#b5cfff' }
                  ]),
                }
              },
              {
                value: 0,
                itemStyle: {
                  borderRadius: [10, 10, 10, 10],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#b08cf9' },
                    { offset: 1, color: '#cdb6fe' }
                  ]),
                }
              }
            ],
            z: 2
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

      const values = [
        this.dataItem.repair || 0,
        this.dataItem.maintain || 0,
        this.dataItem.inspect || 0
      ]

      this.options.series[1].data.forEach((item, i) => {
        item.value = values[i]
      })

      myChart.setOption(this.options);
      window.addEventListener('resize', () => {
        myChart.resize()
      })
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