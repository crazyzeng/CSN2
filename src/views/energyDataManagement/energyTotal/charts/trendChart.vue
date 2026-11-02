<template>
  <div id="trendLine" ref="trendLine" :style="{ height: '100%' }"></div>
</template>

<script>
import { deepClone } from '@/utils/index';
import resize from './mixins/resize';

export default {
  name: 'TrendChart',
  mixins: [resize],
  props: {
    dataTitle: {
      type: String,
      default: '',
    },
    dataFlag: {
      type: Boolean,
      default: false,
    },
    dataType: {
      type: String,
      default: '',
    },
    dataOption: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
      optionNew: {},
      curData: {},
      options: {
        color: ['#a4ffff', '#408fc3', '#7d55e0'],
        title: {},
        grid: {
          top: 120,
          bottom: 85,
          right: 100,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {},
          },
        },
        legend: {
          data: ['本期', '同比', '环比'],
          right: 120,
          top: 45,
          textStyle: {
            color: '#fff',
          },
          itemStyle:{
            color:'#1e2a45'
          }
        },
        //下方滚动条
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            bottom: 15,
            backgroundColor: 'transparent',
            fillerColor: '#47A3FF',
            textStyle: {
              color: '#fff',
            },
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
            textStyle: {
              color: '#fff',
            },
          },
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
            },
            axisLabel: {
              color: '#FEFEFF',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#263557'],
                width: 1,
                type: 'solid',
              },
            },
            data: [
              // '2009/10/17 18:00',
            ].map(function (str) {
              return str.replace(' ', '\n');
            }),
          },
        ],
        yAxis: [
          {
            name: 'kWh',
            nameTextStyle: {
              color: '#FFFFFF',
              fontSize: 14,
            },

            type: 'value',
            color: '#FEFEFF',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#28385d',
              },
            },
            axisLabel: {
              color: '#FEFEFF',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#263557'],
                width: 1,
                type: 'solid',
              },
            },
          },
        ],
        series: [
          {
            name: '本期',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            lineStyle: {
              width: 1,
            },
            emphasis: {
              focus: 'series',
            },
            data: [],
          },
          {
            name: '同比',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            lineStyle: {
              width: 1,
            },
            emphasis: {
              focus: 'series',
            },

            data: [],
          },
          {
            name: '环比',
            type: 'line',
            smooth: true,
            // areaStyle: {},
            lineStyle: {
              width: 1,
            },
            emphasis: {
              focus: 'series',
            },

            data: [],
          },
        ],
      },
    };
  },
  watch: {
    dataOption(data) {
      let myChart = this.$echarts.init(document.getElementById('trendLine'));
      this.curData = data;
      this.options.xAxis[0].data = data.labels;
      this.dataChange(data);
      myChart.setOption(this.options);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      let myChart = this.$echarts.init(document.getElementById('trendLine'));
      window.onresize = myChart.resize;
      myChart.setOption(this.options);
    },
    dataChange(data) {
      let myChart = this.$echarts.init(document.getElementById('trendLine'));
      this.options.series[0].data = this.curData.current || [];
      let index = 0;
      if (this.curData.current?.length > 0) index = this.curData.current.length;
      if (Object.keys(this.curData.tb).length > 0 && this.curData.tb.length > 0) this.options.series[1].data = this.curData.tb.splice(0, index);
      if (Object.keys(this.curData.hb).length > 0 && this.curData.hb.length > 0) this.options.series[2].data = this.curData.hb.splice(0, index);
      switch (this.dataType) {
        case 'ENERGY_ELECTRIC':
          this.options.yAxis[0].name = 'KWH';
          // energyName = '电';
          break;
        case 'ENERGY_WATER':
          this.options.yAxis[0].name = 't';
          // energyName = '水';
          break;
        case 'ENERGY_HEAT':
          this.options.yAxis[0].name = 'GJ';
          // energyName = '热';
          break;
        case 'ENERGY_GAS':
          this.options.yAxis[0].name = 'm³';
          // energyName = '气';
          break;
        default:
          break;
      }
      let tempOptions = deepClone(this.options)
      let tempArr = []
      tempOptions.series.forEach(v => {
        tempArr = []
        v.data.forEach(w => {
          if (w === 0) tempArr.push(null)
          else tempArr.push(w)
          v.data = tempArr
        })
      })
      myChart.setOption(tempOptions);
    },
    getData() { },
  },
};
</script>

<style lang="scss" scoped></style>
