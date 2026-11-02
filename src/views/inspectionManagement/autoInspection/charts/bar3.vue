<template>
  <div v-if="!noData" id="bar3" ref="bar3" :style="{ height: '350px' }" />
  <div v-else class="noData">
    暂无数据
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    barData: {
      // type: any,
      // default: () => {},
    },
  },
  data() {
    return {
      bar3: null,
      noData: false,
      arr2: [],
      labelOption: {
        show: true,
        position: 'insideTop',
        color: '#fff',
        fontFamily: 'SourceHanSansCN-Regular',
        formatter: (params, a) => {
          const obj = params
          // arr2.value = []
          let res = ''
          if (obj.seriesName === '蓄能罐') {
            if (!this.arr2.value[0][params.dataIndex])
              res = ''
            else
              res = this.arr2.value[0][params.dataIndex]
          }
          if (obj.seriesName === '地源热泵供能') {
            if (!this.arr2.value[1][params.dataIndex])
              res = ''
            else
              res = this.arr2.value[1][params.dataIndex]
          }
          if (obj.seriesName === '锅炉') {
            if (!this.arr2.value[2][params.dataIndex])
              res = ''
            else
              res = this.arr2.value[2][params.dataIndex]
          }
          if (obj.seriesName === '离心机') {
            if (!this.arr2.value[2][params.dataIndex])
              res = ''
            else
              res = this.arr2.value[2][params.dataIndex]
          }
          if (obj.seriesName === '地源热泵蓄能') {
            if (!this.arr2.value[3][params.dataIndex])
              res = ''
            else
              res = this.arr2.value[3][params.dataIndex]
          }
          return res
        },
      },
      barChartOptions: {
        title: {
          text: '',
          textStyle: {
            color: '#444444',
          },
          right: 0,
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
            type: 'line',
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
            name: '冷/热负荷(kW·h)',
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
            name: '储能罐',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#77A7F5',
            },
            label: this.labelOption,
            // data: [130, 140, 90, 100, 110, 105, 80, 60, 30, 0, 0, 0, 0, 0, 60, 70, 65, 70, 90, 40, 0, 0, 0, 80],
            data: [],
          },
          {
            name: '地源热泵供能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#58BFBF',
            },
            label: this.labelOption,
            // data: [0, 0, 0, 0, 0, 0, 0, 120, 30, 50, 60, 70, 80, 90, 100, 85, 120, 65, 30, 80, 55, 30, 20],
            data: [],
          },
          {
            name: '锅炉',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#FFAD70',
            },
            label: this.labelOption,
            // data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 60, 70, 90, 0, 0, 0, 0, 0, 30, 20, 0, 0],
            data: [],
          },
          {
            name: '地源热泵蓄能',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#FFCC51',
            },
            label: this.labelOption,
            // data: [120, 125, 85, 132, 150, 90, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120],
            data: [],
          },
        ],
      },

    }
  },
  mounted() {
    const arr = []
    for (let i = 0; i < 24; i++)
      arr.push(`${i}`)
    this.barChartOptions.xAxis[0].data = arr
    this.chartInit();
  },
  watch: {
    'barData': function (val) {
      const curData = { ...this.barChartOptions }
      const curBarData = val
      if (curBarData && curBarData.length > 0) {
        this.noData = false
        curData.series[0].name = curBarData[3].name
        curData.series[1].name = curBarData[2].name
        curData.series[2].name = curBarData[1].name
        // curData.series[3].name = curBarData[0].name
        curData.series[3].name = '蓄能罐'
        //
        curData.series[0].data = curBarData[3].energy
        curData.series[1].data = curBarData[2].energy
        curData.series[2].data = curBarData[1].energy
        curData.series[3].data = curBarData[0].energy
        //
        this.arr2.value = []
        const curArr = []
        curBarData.forEach((e) => {
          curArr.push(e.num)
        })
        this.arr2.value = curArr
        this.bar3.setOption(curData, true)
      }
      else {
        this.noData = true
      }
    }
  },
  methods: {
    chartInit() {
      let chartDom = document.getElementById('bar3');
      this.bar3 = echarts.init(chartDom);
      const arr = []
      for (let i = 0; i < 24; i++)
        arr.push(`${i}`)
      this.barChartOptions.xAxis[0].data = arr
      this.bar3.setOption(this.barChartOptions)
    }
  }
}
</script>

<style lang="scss">
.noData {
  height: 350px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
