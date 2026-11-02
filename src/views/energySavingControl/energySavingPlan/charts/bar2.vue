<template>
  <div id="bar2" ref="bar2" :style="{ height: 'calc(50% - 11px)' }"></div>
</template>

<script>
import * as echarts from 'echarts';
import { deepClone } from '@/utils/index'
export default {
  props: { todayData: [] },
  data() {
    return {
      chartDom: null,
      bar2: null,
      noData: true,
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
            if (!arr2[0][params.dataIndex])
              res = ''
            else
              res = arr2[0][params.dataIndex]
          }
          if (obj.seriesName === '地源热泵供能') {
            if (!arr2[1][params.dataIndex])
              res = ''
            else
              res = arr2[1][params.dataIndex]
          }

          // if (obj.seriesName === '离心机/锅炉') {
          //   if (!arr2[2][params.dataIndex])
          //     res = ''
          //   else
          //     res = arr2[2][params.dataIndex]
          // }
          if (obj.seriesName === '锅炉') {
            if (!arr2[2][params.dataIndex])
              res = ''
            else
              res = arr2[2][params.dataIndex]
          }
          if (obj.seriesName === '离心机') {
            if (!arr2[2][params.dataIndex])
              res = ''
            else
              res = arr2[2][params.dataIndex]
          }
          if (obj.seriesName === '地源热泵蓄能') {
            if (!arr2[3][params.dataIndex])
              res = ''
            else
              res = arr2[3][params.dataIndex]
          }
          return res
        },
      },
      colors: ['#77A7F5', '#58BFBF', '#FFAD70', '#FFCC51', '#58BFBF'],
      seriesItem: {
        name: '',
        type: 'bar',
        stack: 'total',
        barWidth: 15,
        itemStyle: {
          color: '#FFAD70',
        },
        label: {
          show: true,
          position: 'insideTop',
          color: '#fff',
          fontFamily: 'SourceHanSansCN-Regular',
        },
        data: [],
      },
      barChartOptions: {
        title: {
          // text: '总负荷：1000KW',
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
          // data: ['尖峰电费', '高峰电费', '平段电费', '谷段电费'],
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
              color: '#93DCFE',
            },
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#93DCFE',
              },
            },
            data: [],
            axisPointer: {
              type: 'shadow',
            },
            axisLabel: {
              color: '#93DCFE',
            },
          },
        ],
        yAxis: [
          {
            name: '(kW·h)',
            nameTextStyle: {
              color: '#93DCFE',
              padding: [0, 25, 10, 0],
              fontSize: 12,
            },
            type: 'value',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#93DCFE',
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
              color: '#93DCFE',
            },
          },
        ],
        series: [],
      }
    };
  },
  watch: {
    todayData: {
      handler() {
        this.barChartOptions.series = [];
        this.chartInit();
      },
      deep: true,
    }
  },
  mounted() {
    this.chartInit()
    window.addEventListener("resize", () => {
      this.bar2.resize();
    });
  },
  methods: {
    chartInit() {
      this.chartDom = document.getElementById('bar2');
      this.bar2 = echarts.init(this.chartDom);
      const arr = []
      for (let i = 0; i < 24; i++)
        arr.push(`${i}`)
      this.barChartOptions.xAxis[0].data = arr

      if (this.todayData.length > 0) {
        this.todayData.forEach((v, i) => {
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
      this.bar2.setOption(this.barChartOptions, true)
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

#bar2 {
  overflow: hidden;
}
</style>
