<template>
  <section style="width:100%;height:100%">
    <section class="bar_chart" ref="chart1"></section>
  </section>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    energyData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      chartInstance: null,
    }
  },
  watch: {
    energyData: { deep: true, handler() { this.init(); } }
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) this.chartInstance.dispose();
  },
  methods: {
    init() {
      if (!this.$refs.chart1) return;
      if (this.chartInstance) this.chartInstance.dispose();
      this.chartInstance = echarts.init(this.$refs.chart1);

      const { xAxis = [], data = [], labels = [], currentMonthPrediction, currentMonthBenchmark, currentMonthEnergy } = this.energyData || {};
      
      const convertToMWh = (arr) => (arr || []).map(val => val != null ? Number(val) / 1000 : 0);
      
      const forecastData = convertToMWh(data[0]);
      const currentData = convertToMWh(data[1]);
      const actualData = convertToMWh(data[2]);

      // 构建动态标题文本
      const formatNum = (num) => {
        if (num === null || num === undefined) return '0';
        return (Number(num) / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 });
      };

      const titleText = `当月预测基准:${formatNum(currentMonthPrediction)}MWh   当月基准:${formatNum(currentMonthBenchmark)}MWh   当月负荷:${formatNum(currentMonthEnergy)}MWh`;

      const option = {
        graphic: [
          {
            type: "text",
            left: '2%',
            top: '15%',
            style: {
              text: "(MWh)",
              fill: "#666",
              fontSize: 12,
            }
          }
        ],
        title: {
          text: titleText,
          left: 28,
          top: 10,
          textStyle: { fontSize: 14, fontWeight: 'normal' }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(220,220,220,0.3)',
          textStyle: { color: '#000' },
          formatter: (params) => {
            let res = '';
            const groups = {};

            params.forEach(p => {
              if (p.seriesName.includes('背景')) return;

              if (!groups[p.seriesName]) {
                groups[p.seriesName] = {
                  value: 0,
                  color: p.color
                };
              }

              const val = p.value != null ? p.value : 0;
              groups[p.seriesName].value += val;
            });

            if (params.length > 0) {
              res = `${params[0].axisValue}<br/>`;

              Object.entries(groups).forEach(([name, obj]) => {
                const displayValue = obj.value != null ? obj.value.toFixed(2) : '0.00';
                res += `
        <span style="
          display:inline-block;
          margin-right:5px;
          border-radius:10px;
          width:10px;
          height:10px;
          background-color:${obj.color};
        "></span>
        ${name}: ${displayValue} MWh<br/>
      `;
              });
            }

            return res;
          }
        },
        legend: {
          data: labels.length ? labels : ['预测基准', '当前基准', '实际负荷'],
          top: 0,
          right: 80,
          icon: 'oval',
          itemWidth: 20,
          itemHeight: 12
        },
        grid: {
          top: '25%',
          left: '2%',
          right: '2%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxis,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#DCDCDC' } },
          axisLabel: { 
            color: '#808080', 
            fontSize: 11,
            formatter: (value) => {
              return !isNaN(value) ? `${value}月` : value;
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.02)', // 更淡一点
              width: 1
            }
          }
        },
        yAxis: {
          type: 'value',
          nameTextStyle: { fontSize: 11, color: '#808080' },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.02)',
              width: 1
            }
          },
          axisLabel: { color: '#808080', fontSize: 11 },
          axisTick: { show: false },
          axisLine: { show: false }
        },
        series: [
          {
            name: '预测基准背景',
            type: 'pictorialBar',
            symbol: 'path://M0,10 Q0,0 10,0 L90,0 Q100,0 100,10 L100,100 L0,100 Z',
            symbolSize: [10, '115%'],
            symbolOffset: [-13, 0],
            z: 1,
            itemStyle: {
              color: '#F4F4F4',
              barBorderRadius: [10, 10, 0, 0]
            },
            data: forecastData
          },
          {
            name: '预测基准',
            type: 'bar',
            data: forecastData,
            barWidth: 10,
            barGap: '30%',
            itemStyle: {
              color: '#FFD76D',
              barBorderRadius: [10, 10, 0, 0]
            },
            z: 2
          },
          {
            name: '当前基准背景',
            type: 'pictorialBar',
            symbol: 'path://M0,10 Q0,0 10,0 L90,0 Q100,0 100,10 L100,100 L0,100 Z',
            symbolSize: [10, '115%'],
            symbolOffset: [0, 0],
            z: 1,
            itemStyle: {
              color: '#F4F4F4',
              borderRadius: 10
            },
            data: currentData
          },
          {
            name: '当前基准',
            type: 'bar',
            data: currentData,
            barWidth: 10,
            barGap: '30%',
            itemStyle: {
              color: '#6B9CFE',
              barBorderRadius: [10, 10, 0, 0]
            },
            z: 2
          },
          {
            name: '实际负荷背景',
            type: 'pictorialBar',
            symbol: 'path://M0,10 Q0,0 10,0 L90,0 Q100,0 100,10 L100,100 L0,100 Z',
            symbolSize: [10, '115%'],
            symbolOffset: [13, 0],
            z: 1,
            itemStyle: {
              color: '#F4F4F4',
              borderRadius: 10
            },
            data: actualData
          },
          {
            name: '实际负荷',
            type: 'bar',
            data: actualData,
            barWidth: 10,
            barGap: '30%',
            itemStyle: {
              color: '#A4CC47',
              barBorderRadius: [10, 10, 0, 0]
            },
            z: 2
          }
        ]
      };

      this.chartInstance.setOption(option);
    },
    handleResize() {
      if (this.chartInstance) this.chartInstance.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.bar_chart {
  height: calc(100% - 30px);
  width: 100%;
  background-repeat: no-repeat;
}
</style>
