<template>
  <section ref="myChart" class="rightPie1"></section>
</template>
<script>
export default {
  props: {
    rightPieData: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      myChart: null,
      baseSize: 1,
      color: ['#6B9CFF', '#B08DF9', '#A4CC45', '#FFD287', '#36e9e9'],
      options: {}
    }
  },
  watch: {
    rightPieData: {
      handler: function() {
        this.init()
      }
    }
  },
  mounted() {
    this.calcBaseSize()
    this.init()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
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
        this.myChart.clear()
        this.init()
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

      // 数据处理
      let arr = []
      let total = 0

      if (this.rightPieData && Object.keys(this.rightPieData).length > 0) {
        for (let key in this.rightPieData) {
          const val = Number(this.rightPieData[key] || 0)
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
          ? `{a|${(total / 1000).toFixed(2)}}{b| MWh}`
          : `{a|0.00}{b| MWh}`

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
          left: '50%',
          top: '43%',
          textAlign: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 18 * this.baseSize,
                fontWeight: 'bold',
                color: '#000'
              },
              b: {
                fontSize: 12 * this.baseSize,
                color: '#111',
                lineHeight: 30
              }
            }
          }
        },
        series: [
          // 外层亮
          {
            type: 'pie',
            // radius: ['60%', '68%'],
            radius: ['80%', '88%'],
            center: ['50%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color1[params.dataIndex]
            },
            label: { show: false }
          },
          // 中层
          {
            type: 'pie',
            // radius: ['52%', '60%'],
            radius: ['72%', '80%'],
            center: ['50%', '50%'],
            data: dataWithGap,
            itemStyle: {
              color: params => color2[params.dataIndex]
            },
            label: { show: false }
          },
          // 内层
          {
            type: 'pie',
            // radius: ['44%', '52%'],
            radius: ['64%', '72%'],
            center: ['50%', '50%'],
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
.rightPie1 {
  width: 100%;
  height: calc(100% - 50px);
}
</style>