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
        series: [],
      },
    }
  },
  watch: {
    barData: {
      handler() {
        this.barChartOptions.series = [];
        this.chartInit();
      },
      deep: true,
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

      if (this.barData.length > 0) {
        this.barData.forEach((v, i) => {
          let tempObj = {};
          tempObj = deepClone(this.seriesItem);
          tempObj.name = v.name;
          tempObj.data = v.energy;
          tempObj.itemStyle.color = this.colors[i];
          tempObj.label.formatter = function (params) {
            return v.num[params.dataIndex] || ''
          }
          this.barChartOptions.series.push(tempObj)
        })
      }
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
