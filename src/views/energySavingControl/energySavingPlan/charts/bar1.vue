<template>
  <div id="bar1" ref="bar1" :style="{ height: `calc(50% - 11px)` }" />
</template>

<script>
import { deepClone } from '@/utils/index';
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
      for (let i = 0; i < 24; i++) tempArr.push(`${i}`);
      this.barChartOptions.xAxis[0].data = tempArr;

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
      this.barChartOptions && this.bar1.setOption(this.barChartOptions, true);
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
