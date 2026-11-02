<template>
  <section ref="myChart" class="center_pie_chart"></section>
</template>

<script>
import { deepClone } from '@/utils/index';
import { getDict, dictTrans } from '@/api/common'

export default {
  props: {
    dataItem: {
      type: Object,
      default: () => { }
    },
    dataOptions: {
      type: Array,
      default: () => []
    },
    legendType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      seriesData: [],
      myChart: null,
      baseSize: 1,
      color: ['#0084ff', '#8568ee', '#36ffca', '#fee878', '#18d6ff', '#4985fd', '#12def2', '#209fd4', '#703ad4', '#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4'],
    }
  },

  watch: {
    dataItem() {
      this.init()
    },
    dataOptions() {
      this.init()
    },
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

    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },

    init() {
      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.myChart);
      }

      let total = 0
      let rawData = []

      if (Object.keys(this.dataItem).length > 0) {
        let tempData = deepClone(this.dataItem)

        for (let key in tempData) {
          const val = Number(tempData[key] || 0)
          total += val

          rawData.push({
            name: key,          // 原始key（唯一）
            labelName: key,     // ⭐修改：展示用名称
            value: val
          })
        }
      }

      // ⭐名称转换（只改 labelName，不改 name）
      rawData.forEach(v => {
        let tempStr = v.name

        if (v.name && v.name.length > 3) {
          tempStr = this.equipmentTypeTrans(this.dataOptions, tempStr) || ''
        }

        if (v.name && v.name.length === 1) {
          tempStr = v.name === '7' ? '报废' : '使用中'
        }

        if (tempStr) v.labelName = tempStr
      })

      // ⭐处理全0
      const isAllZero = rawData.every(item => item.value === 0)
      const finalData = isAllZero
        ? rawData.map(item => ({ ...item, value: 1 }))
        : rawData

      // ⭐ legend 显示数据
      const dataMap = {}
      finalData.forEach(item => {
        const percent = total > 0 ? ((item.value / total) * 100).toFixed(2) : '0.00'
        dataMap[item.name] = {
          value: item.value,
          percent: percent + '%',
          labelName: item.labelName
        }
      })

      // ⭐ gap数据（不再用空name）
      const gap = total * 0.008 || 1
      let dataWithGap = []

      finalData.forEach((item, i) => {
        dataWithGap.push(item)

        dataWithGap.push({
          value: gap,
          name: '__gap__' + i,   // ⭐修改：避免空name
          itemStyle: { color: 'transparent' },
          tooltip: { show: false }
        })
      })

      // 颜色
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
          ? `{a|${total}}{b| 台}`
          : `{a|0}{b| 台}`

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (params.name.includes('__gap__')) return ''
            return `${dataMap[params.name].labelName}：${params.value}`
          }
        },

        title: {
          text: `{a|${total}}{b| 台}`,
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
                color: '#999',
                padding: [0, 0, 0, 5]
              }
            }
          }
        },

        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: 'center',
          left: '50%',
          height: '80%', 
          data: finalData.map(item => item.name),
          formatter: (val) => {
            if (val.includes('__gap__')) return ''
            const info = dataMap[val]
            if (!info) return val
            let displayName = info.labelName
            const maxLen = 5
            if (displayName.length > maxLen) {
              displayName = displayName.substring(0, maxLen - 1) + '...'
            } else {
              displayName = displayName + ' '.repeat(maxLen - displayName.length)
            }
            return `${displayName} ${info.value}台`
          }
        },

        series: [
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
.center_pie_chart {
  height: calc(100% - 30px);
  width: 100%;
}
</style>