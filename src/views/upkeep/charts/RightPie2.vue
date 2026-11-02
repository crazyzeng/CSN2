<template>
  <section ref="myChart" class="rightPie2"></section>
</template>
<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      myChart: null,
      baseSize: 1,
      color: ['#6B9CFF', '#B08DF9', '#A4CC45', '#FFD287', '#6B9CFF'],
      options: {}
    }
  },
  watch: {
    chartData: {
      handler: function() {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.calcBaseSize()
    this.init()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.myChart) {
      this.myChart.dispose()
    }
  },
  methods: {
    calcBaseSize() {
      const w = window.innerWidth
      this.baseSize = w / 1920
    },
    handleResize() {
      this.calcBaseSize()
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    hexToRgba(hex, opacity) {
      if (!hex) return `rgba(0,0,0,${opacity})`
      return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(
        hex.slice(3, 5),
        16
      )},${parseInt(hex.slice(5, 7), 16)},${opacity})`
    },
    init() {
      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.myChart)
      }

      let arr = []
      let total = 0

      const sourceData = this.chartData || {}
      
      if (Object.keys(sourceData).length > 0) {
        for (let key in sourceData) {
          const val = Number(sourceData[key] || 0)
          total += val
          arr.push({
            name: key,
            value: val
          })
        }
      }

      const isAllZero = arr.every(item => item.value === 0)
      const finalData = isAllZero
        ? arr.map(item => ({ ...item, value: 1 }))
        : arr

      const dataMap = {}
      finalData.forEach(item => {
        const percent = total > 0 ? ((item.value / total) * 100).toFixed(2) : '0.00'
        dataMap[item.name] = {
          value: item.value,
          percent: percent + '%'
        }
      })

      const gap = total * 0.008 || 1
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

      let color1 = []
      let color2 = []
      let color3 = []

      this.color.forEach(c => {
        color1.push(c, 'transparent')
        color2.push(this.hexToRgba(c, 0.4), 'transparent')
        color3.push(this.hexToRgba(c, 0.1), 'transparent')
      })

      const centerText =
        total > 0
          ? `{a|${total}}{b| 件}`
          : `{a|0}{b| 件}`

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
          left: '30%',
          top: '42%',
          textAlign: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 36 * this.baseSize,
                fontWeight: 'bold',
                color: '#000'
              },
              b: {
                fontSize: 16 * this.baseSize,
                color: '#111',
                lineHeight: 30
              }
            }
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: '25%',
          right: '0%',
          textStyle: {
            fontSize: 10 * this.baseSize,
            color: '#000',
            lineHeight: 15,
            fontFamily: 'monospace'
          },
          itemWidth: 14 * this.baseSize,
          itemHeight: 8 * this.baseSize,
          formatter: function(val) {
            const info = dataMap[val]
            if (info) {
              let displayName = val
              const maxLen = 5
              
              if (val.length > maxLen) {
                displayName = val.substring(0, maxLen - 1) + '...'
              } else {
                const padding = ' '.repeat(maxLen - val.length)
                displayName = val + padding
              }
              
              return `${displayName} ${info.percent} ${info.value}件`
            }
            return val
          },
          data: finalData.map(item => item.name)
        },
        series: [
          // 外层亮
          {
            type: 'pie',
            radius: ['60%', '68%'],
            center: ['30%', '50%'],
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
            center: ['30%', '50%'],
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
            center: ['30%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color3[params.dataIndex]
            },
            label: { show: false }
          }
        ]
      }

      this.myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.rightPie2 {
  width: 100%;
  height: calc(100% - 50px);
}
</style>