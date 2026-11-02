<template>
  <div v-if="!noData" id="bar5" ref="bar5" :style="{ height: '350px' }" />
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
      bar5: null,
      noData: false,
      labelOption: {
        show: false,
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
            name: '总管能量(kW·h)',
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
            name: '负荷',
            type: 'bar',
            stack: '能耗',
            barWidth: 15,
            itemStyle: {
              color: '#77A7F5',
            },
            label: this.labelOption,
            data: [],
          },
        ],
      },
    }
  },
  watch: {
    'barData': function (val) {
      if (val && val.length > 0) {
        this.noData = false
        this.barChartOptions.series[0].data = val
        this.bar5.setOption(this.barChartOptions)
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
      let chartDom = document.getElementById('bar5');
      this.bar5 = echarts.init(chartDom);
      const arr = []
      for (let i = 0; i < 24; i++)
        arr.push(`${i}`)
      this.barChartOptions.xAxis[0].data = arr
      this.bar5.setOption(this.barChartOptions)
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
