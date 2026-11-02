<template>
  <div ref="chart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'XBarChart',
  props: {
    chartData: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    // 转换传入的字符串为数字数组
    const dataAsArray = this.chartData.split(',').map(Number);
    this.initChart(dataAsArray); // 传递数组到初始化函数
  },
  methods: {
    initChart(dataArray) {
      this.chartInstance = echarts.init(this.$refs.chart);
      const option = {
        title: {
          text: 'kWh',
          textStyle: {
            color: '#ffffff',
          },
        },
        tooltip: {},
        xAxis: {
          data: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
          axisLine: {
            lineStyle: {
              color: '#ffffff',
            },
          },
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ddd',
              type: 'dashed', // 设置虚线
            },
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
            },
          },

        },
        series: [
          {
            name: '用电量',
            type: 'bar',
            barWidth: 12,
            data: dataArray,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6a9cfe' },
                { offset: 1, color: '#b5cfff' }
              ]),
            },
          },
        ],
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
      };

      this.chartInstance.setOption(option);
    },
  },
  watch: {
    chartData: {
      handler(newVal) {
        const newDataAsArray = newVal.split(',').map(Number);
        if (this.chartInstance) {
          this.chartInstance.setOption({
            series: [
              {
                name: '用电量',
                data: newDataAsArray,
              },
            ],
          });
        }
      },
      deep: true,
    },
  },

};
</script>

<style scoped>
.echart-container {
  height: 400px;
  /* or any other dimension */
  width: 60%;
}
</style>
