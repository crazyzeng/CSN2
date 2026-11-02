<template>
  <div id="bar1" ref="bar1" :style="{ height: `calc(50%)` }" />
</template>

<script>
import resize from '@/utils/resize.js';
export default {
  props: {
    supplyStatus: {
      type: String,
      default: 'cold',
    },
    todayData: [],
  },
  mixins: [resize],
  data() {
    return {
      bar1: null,
      noData: true,
      chartDom: null,
      arr2: [],
      labelOption: {
        show: true,
        position: 'insideTop',
        color: '#fff',
        fontFamily: 'SourceHanSansCN-Regular',
        formatter: (params, a) => {
          const obj = params
          let res = ''
          if (obj.seriesName === '蓄能罐') {
            if (!this.arr2[0][params.dataIndex])
              res = ''
            else
              res = this.arr2[0][params.dataIndex]
          }
          //   res = arr2[0][params.dataIndex]
          // else
          //   res = ''
          if (obj.seriesName === '地源热泵供能') {
            if (!this.arr2[1][params.dataIndex])
              res = ''
            else
              res = this.arr2[1][params.dataIndex]
          }

          if (obj.seriesName === '锅炉') {
            if (!this.arr2[2][params.dataIndex])
              res = ''
            else
              res = this.arr2[2][params.dataIndex]
          }
          if (obj.seriesName === '离心机') {
            if (!this.arr2[2][params.dataIndex])
              res = ''
            else
              res = this.arr2[2][params.dataIndex]
          }
          if (obj.seriesName === '地源热泵蓄能') {
            if (!this.arr2[3][params.dataIndex])
              res = ''
            else
              res = this.arr2[3][params.dataIndex]
          }
          return res
        },
      },
      barChartOptions: {
        title: {
          // text: '总负荷：1000KW',
          // text: '制冷 总负荷：1000KW',
          textStyle: {
            color: '#444444',
          },
          right: 0,
          top: 50,
        },
        grid: {
          top: 100,
          left: 30,
          right: 50,
          bottom: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          textStyle: {
            color: '#444444',
          },
          axisPointer: {
            type: 'line', // cross
            crossStyle: {
              color: '#999',
            },
          },
          formatter: (params) => {
            let res = '<div>' + `<span style="color:#3F69E5">第${params[0].name}h</span>`
            for (let i = 0; i < params.length; i++) {
              res
                += `<br>${params[i].marker}${params[i].seriesName}：${params[i].data}&nbsp;`
                + 'kW·h'
            }

            return `${res}</div>`
          },
        },
        legend: {
          textStyle: {
            color: '#777777',
          },
          left: 'center',
          top: 5,
        },
        xAxis: [
          {
            name: '(时)',
            nameTextStyle: {
              color: '#777',
            },
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#E6E6E6',
              },
            },
            data: [],
            axisPointer: {
              type: 'shadow',
            },
            axisLabel: {
              color: '#999999',
            },
          },
        ],
        yAxis: [
          {
            name: '(kW·h)',
            nameTextStyle: {
              color: '#999999',
              padding: [0, 25, 10, 0],
              fontSize: 12,
            },
            type: 'value',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#f5f5f5'],
                width: 1,
                // type: 'dashed',
              },
            },
            axisLabel: {
              color: '#999999',
            },
          },
        ],
        series: [
          {
            // name: '离心机供能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#77A7F5',
            },
            label: {
              show: true,
              position: 'insideTop',
              color: '#fff',
              fontFamily: 'SourceHanSansCN-Regular',
              formatter: (params, a) => {
                const obj = params
                let res = ''
                if (obj.seriesName === '蓄能罐') {
                  if (!this.arr2[0][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[0][params.dataIndex]
                }
                //   res = arr2[0][params.dataIndex]
                // else
                //   res = ''
                if (obj.seriesName === '地源热泵供能') {
                  if (!this.arr2[1][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[1][params.dataIndex]
                }

                if (obj.seriesName === '锅炉') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '离心机') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '地源热泵蓄能') {
                  if (!this.arr2[3][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[3][params.dataIndex]
                }
                return res
              },
            },
            // data: [130, 140, 90, 100, 110, 105, 80, 60, 30, 0, 0, 0, 0, 0, 60, 70, 65, 70, 90, 40, 0, 0, 0, 80],
            data: [],
          },
          {
            // name: '地缘热泵供能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#58BFBF',
            },
            label: {
              show: true,
              position: 'insideTop',
              color: '#fff',
              fontFamily: 'SourceHanSansCN-Regular',
              formatter: (params, a) => {
                const obj = params
                let res = ''
                if (obj.seriesName === '蓄能罐') {
                  if (!this.arr2[0][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[0][params.dataIndex]
                }
                //   res = arr2[0][params.dataIndex]
                // else
                //   res = ''
                if (obj.seriesName === '地源热泵供能') {
                  if (!this.arr2[1][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[1][params.dataIndex]
                }

                if (obj.seriesName === '锅炉') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '离心机') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '地源热泵蓄能') {
                  if (!this.arr2[3][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[3][params.dataIndex]
                }
                return res
              },
            },
            // data: [0, 0, 0, 0, 0, 0, 0, 120, 30, 50, 60, 70, 80, 90, 100, 85, 120, 65, 30, 80, 55, 30, 20],
            data: [],
          },
          {
            // name: '蓄能罐供能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#FFAD70',
            },
            label: {
              show: true,
              position: 'insideTop',
              color: '#fff',
              fontFamily: 'SourceHanSansCN-Regular',
              formatter: (params, a) => {
                const obj = params
                let res = ''
                if (obj.seriesName === '蓄能罐') {
                  if (!this.arr2[0][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[0][params.dataIndex]
                }
                //   res = arr2[0][params.dataIndex]
                // else
                //   res = ''
                if (obj.seriesName === '地源热泵供能') {
                  if (!this.arr2[1][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[1][params.dataIndex]
                }

                if (obj.seriesName === '锅炉') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '离心机') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '地源热泵蓄能') {
                  if (!this.arr2[3][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[3][params.dataIndex]
                }
                return res
              },
            },
            // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 60, 70, 90, 0, 0, 0, 0, 0, 30, 20, 0, 0],
            data: [],
          },
          {
            // name: '地缘热泵储能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#FFCC51',
            },
            label: {
              show: true,
              position: 'insideTop',
              color: '#fff',
              fontFamily: 'SourceHanSansCN-Regular',
              formatter: (params, a) => {
                const obj = params
                let res = ''
                if (obj.seriesName === '蓄能罐') {
                  if (!this.arr2[0][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[0][params.dataIndex]
                }
                //   res = arr2[0][params.dataIndex]
                // else
                //   res = ''
                if (obj.seriesName === '地源热泵供能') {
                  if (!this.arr2[1][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[1][params.dataIndex]
                }

                if (obj.seriesName === '锅炉') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '离心机') {
                  if (!this.arr2[2][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[2][params.dataIndex]
                }
                if (obj.seriesName === '地源热泵蓄能') {
                  if (!this.arr2[3][params.dataIndex])
                    res = ''
                  else
                    res = this.arr2[3][params.dataIndex]
                }
                return res
              },
            },
            // data: [120, 125, 85, 132, 150, 90, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120],
            data: [],
          },
        ],
      }
    };
  },
  watch: {
    todayData: {
      handler() {
        if (this.supplyStatus === 'cold') {
          this.barChartOptions.series[0].name = '离心机供能'
          this.bar1.setOption(this.barChartOptions)
        }
        if (this.supplyStatus === 'heat') {
          this.barChartOptions.series[0].name = '锅炉供能'
          this.bar1.setOption(this.barChartOptions)
        }
        if (this.todayData && this.todayData.length > 0) {
          this.noData = false
          this.barChartOptions.series[0].name = this.todayData[2].name
          this.barChartOptions.series[1].name = this.todayData[1].name
          this.barChartOptions.series[2].name = '蓄能罐'
          this.barChartOptions.series[3].name = this.todayData[3].name
          // //
          this.barChartOptions.series[0].data = this.todayData[2].energy
          this.barChartOptions.series[1].data = this.todayData[1].energy
          this.barChartOptions.series[2].data = this.todayData[0].energy
          this.barChartOptions.series[3].data = this.todayData[3].energy
          //
          this.todayData.forEach((e) => {
            this.arr2.push(e.num)
          })

          this.bar1.setOption(this.barChartOptions)
        }
        else {
          this.noData = true
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.chartInit()
    window.addEventListener("resize", () => {
      this.bar1.resize();
    });
  },
  methods: {
    chartInit() {
      this.chartDom = document.getElementById('bar1');
      this.bar1 = this.$echarts.init(this.chartDom);
      const tempArr = []
      for (let i = 0; i < 24; i++) tempArr.push(`${i}`)
      this.barChartOptions.xAxis[0].data = tempArr
      this.barChartOptions && this.bar1.setOption(this.barChartOptions);
    }
  }
}
</script>

<style lang="scss">
.noData {
  height: calc(50% - 45px);
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#bar1 {
  overflow: hidden;
}
</style>
