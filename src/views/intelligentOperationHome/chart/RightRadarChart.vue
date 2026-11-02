<template>
  <section id="radar_chart"></section>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataItem: {
      type: Array,
      default: () => []
    },
    energyType: {
      type: String,
      default: 'ENERGY_ELECTRIC'
    }
  },
  data() {
    return {
      chart: null,
      options: {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const labels = ['健康', '亚健康', '故障']
            let str = ''
            params.value.forEach((v, i) => {
              str += `${labels[i]}：${v}<br/>`
            })
            return str
          }
        },
        color: ['#b6dc7c', '#fdb45b', '#fe7878'],
        radar: [
          {
            shape: 'polygon',
            indicator: [
              { name: '健康', max: 100 },
              { name: '亚健康', max: 100 },
              { name: '故障', max: 100 }
            ],
            center: ['50%', '60%'],
            radius: '65%',
            splitNumber: 5,
            splitLine: {
              lineStyle: {
                color: 'rgba(200,200,200,0.3)'
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: [
                  'rgba(255,255,255,0.02)',
                  'rgba(255,255,255,0.04)',
                  'rgba(255,255,255,0.06)',
                  'rgba(255,255,255,0.08)',
                  'rgba(255,255,255,0.1)'
                ]
              }
            },

            axisLine: {
              lineStyle: {
                color: 'rgba(180,180,180,0.6)'
              }
            },

            axisName: {
              formatter: function (name) {
                if (name === '健康') return '{a|健康}'
                if (name === '亚健康') return '{b|亚健康}'
                if (name === '故障') return '{c|故障}'
                return name
              },
              rich: {
                a: {
                  color: '#fff',
                  backgroundColor: 'rgba(76, 175, 80, 0.7)',
                  padding: [6, 12],
                  borderRadius: 20
                },
                b: {
                  color: '#fff',
                  backgroundColor: 'rgba(255, 193, 7, 0.7)',
                  padding: [6, 12],
                  borderRadius: 20
                },
                c: {
                  color: '#fff',
                  backgroundColor: 'rgba(244, 67, 54, 0.7)',
                  padding: [6, 12],
                  borderRadius: 20
                }
              }
            }
          }
        ],

        series: [
          {
            type: 'radar',
            symbol: 'circle',
            symbolSize: 6,

            lineStyle: {
              width: 2,
              color: 'rgba(255,255,255,0.3)'
            },

            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(132,255,0,0.7)' },
                { offset: 0.5, color: 'rgba(255,214,0,0.6)' },
                { offset: 1, color: 'rgba(255,80,80,0.6)' }
              ]),
              shadowBlur: 15,
              shadowColor: 'rgba(255,80,80,0.5)'
            },

            data: [
              {
                value: [60, 73, 85],
                name: '状态'
              }
            ]
          },

          {
            type: 'radar',
            silent: true,
            symbol: 'none',

            lineStyle: {
              opacity: 0
            },

            areaStyle: {
              color: 'rgba(255,80,80,0.15)',
              shadowBlur: 60,
              shadowColor: 'rgba(255,80,80,1)'
            },

            data: [
              {
                value: [60, 73, 85]
              }
            ]
          }
        ]
      }
    }
  },

  mounted() {
    this.init()
  },

  watch: {
    dataItem() {
      this.init()
    },
    energyType() {
      this.init()
    }
  },

  methods: {
    init() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('radar_chart'))
      }

      this.chart.clear()

      let values = []
      this.dataItem.forEach(v => {
        for (let key in v) {
          values.push(v[key])
        }
      })

      if (values.length) {
        this.options.series[0].data[0].value = values
        this.options.series[1].data[0].value = values
      }

      this.chart.setOption(this.options)

      window.addEventListener('resize', () => {
        this.chart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#radar_chart {
  width: 100%;
  height: 100%;
}
</style>