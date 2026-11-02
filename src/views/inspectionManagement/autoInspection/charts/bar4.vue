<template>
  <div v-if="!noData" id="bar4" ref="bar4" :style="{ height: '350px' }" />
  <div v-else class="noData">
    暂无数据
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  props: {
    barData: {}
  },
  data() {
    return {
      bar4: null,
      noData: false,
      labelOption: {
        show: true,
        position: 'insideTop',
        color: '#fff',
        fontFamily: 'SourceHanSansCN-Regular',
        formatter: (params, a) => {
          const obj = params
          let res = ''
          if (params.value === 0)
            res = ''
          else
            res = params.value
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
          left: 60,
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
                + '台'
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
            name: '机组数量(台)',
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
            // data: [2, 2, 2, 2, 2, 2, 1, 2, 2, null, null, null, null, null, 2, 2, 2, 2, 2, 2, null, null, 0, 2],
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
            // data: [null, null, null, null, null, null, null, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1],
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
            // data: [null, null, null, null, null, null, null, null, null, 1, 1, 1, 1, 2, 2, 2, 2, null, null, null, 1, 2, null, null],
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
            // data: [2, 2, 2, 2, 2, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2],
            data: [],
          },
        ],
      },
    }
  },
  watch: {
    barData: function (val) {
      if (val && val.length > 0) {
        this.noData = false
        this.barChartOptions.series[0].name = val[3].name
        this.barChartOptions.series[1].name = val[2].name
        this.barChartOptions.series[2].name = val[1].name
        // barChartOptions.series[3].name = val[0].name
        this.barChartOptions.series[3].name = '蓄能罐'
        //
        this.barChartOptions.series[0].data = val[3].num
        this.barChartOptions.series[1].data = val[2].num
        this.barChartOptions.series[2].data = val[1].num
        this.barChartOptions.series[3].data = val[0].num
        //
        // val.forEach((e) => {
        //   arr2.push(e.num)
        // })
        this.bar4.setOption(this.barChartOptions)
      }
      else {
        this.noData = true
      }
    }
  },
  mounted() {
    const arr = []
    for (let i = 0; i < 24; i++)
      arr.push(`${i}`)
    this.barChartOptions.xAxis[0].data = arr
    this.chartInit()
  },
  methods: {
    chartInit() {
      let chartDom = document.getElementById('bar4');
      this.bar4 = echarts.init(chartDom);
      const arr = []
      for (let i = 0; i < 24; i++)
        arr.push(`${i}`)
      this.barChartOptions.xAxis[0].data = arr
      this.bar4.setOption(this.barChartOptions)
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
