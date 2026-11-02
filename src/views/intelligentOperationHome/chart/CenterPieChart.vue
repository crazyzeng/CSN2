<template>
  <section ref="myChart" class="center_pie_chart"></section>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    dataItem: {
      type: Object,
      default: () => ({})
    },
    dataYear: {
      type: String,
      default: ''
    },
    dataName: {
      type: String,
      default: '维修设备'
    }
  },

  data() {
    return {
      myChart: null,
      total: 0,
      baseSize: 1,

      color: ['#A4CC45', '#FFD287', '#39A0F8', '#FD5655', '#B08DF9', '#6B9CFF', '#FF9F7F', '#73C0DE'],

      options: {}
    }
  },

  mounted() {
    this.calcBaseSize()
    this.init()
  },

  watch: {
    dataItem: {
      deep: true,
      handler() {
        this.init()
      }
    },
    dataName() {
      this.init()
    }
  },

  methods: {
    calcBaseSize() {
      const w = window.innerWidth
      this.baseSize = w / 1920
    },

    hexToRgba(hex, opacity) {
      return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(
        hex.slice(3, 5),
        16
      )},${parseInt(hex.slice(5, 7), 16)},${opacity})`
    },

    init() {
      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.myChart)
      }

      // 数据处理
      let arr = []
      let total = 0

      for (let key in this.dataItem) {
        const val = Number(this.dataItem[key] || 0)
        total += val
        arr.push({
          name: key,
          value: val
        })
      }

      this.total = total

      // 防止全空
      const isAllZero = arr.every(item => item.value === 0)
      const finalData = isAllZero
        ? arr.map(item => ({ ...item, value: 1 }))
        : arr

      // 加间隔
      const gap = this.total * 0.008 || 1

      let dataWithGap = []

      finalData.forEach(item => {
        dataWithGap.push(item)
        dataWithGap.push({
          value: gap,
          name: '',
          itemStyle: { color: 'transparent' },
          tooltip: { show: false }
        })
      })

      // 颜色扩展（三层）
      let color1 = []
      let color2 = []
      let color3 = []

      this.color.forEach(c => {
        color1.push(c, 'transparent')
        color2.push(this.hexToRgba(c, 0.4), 'transparent')
        color3.push(this.hexToRgba(c, 0.1), 'transparent')
      })

      // 中间文字
      const centerText =
        total > 0
          ? `{c|${total}}{b|${this.dataName == '巡检次数' ? '次' : '单'
          }}\n{b|${this.dataName}}\n{a|${this.dataYear}}`
          : `{c|-}{b|单}\n{b|${this.dataName}}\n{a|${this.dataYear}}`

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (!params.name) return ''
            return `${params.name}：${params.value}`
          }
        },

        title: {
          text: centerText,
          left: '33%',
          top: '32%',
          textAlign: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 14 * this.baseSize,
                color: '#333'
              },
              b: {
                fontSize: 14 * this.baseSize,
                color: '#b8becc',
                lineHeight: 24
              },
              c: {
                fontSize: 22 * this.baseSize,
                color: '#333',
                fontWeight: 'bold'
              }
            }
          }
        },
        legend: {
          orient: 'vertical',
          right: '0%',
          top: 'center',
          itemWidth: this.baseSize * 14,
          itemHeight: this.baseSize * 6,
          itemGap: this.baseSize * 10,
          type: 'scroll',
          textStyle: {
            width: 80,
            overflow: 'truncate',
            lineHeight: 16
          },
          data: finalData.map(item => item.name)
        },

        series: [
          // 外层亮
          {
            type: 'pie',
            radius: ['60%', '68%'],
            center: ['35%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color1[params.dataIndex]
            },
            label: { show: false }
          },

          // 中层
          {
            type: 'pie',
            radius: ['52%', '60%'],
            center: ['35%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color2[params.dataIndex]
            },
            label: { show: false }
          },

          // 内层
          {
            type: 'pie',
            radius: ['44%', '52%'],
            center: ['35%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color3[params.dataIndex]
            },
            label: { show: false }
          }
        ]
      }

      this.myChart.setOption(option)

      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.center_pie_chart {
  width: 100%;
  height: 100%;
}
</style>