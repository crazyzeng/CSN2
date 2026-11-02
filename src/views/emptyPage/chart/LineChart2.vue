<template>
  <section style="width:100%;height:100%">
    <section ref="chart2" class="line_chart2"></section>
  </section>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    chartData: {
      type: Object,
      default: () => ({
        xAxis: [],
        labels: ["用电量", "基准值"],
        data: [[], []]
      })
    }
  },
  data() {
    return {
      chartInstance: null,
      months: [
        "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
      ],
      historyTemp: [4029.14, 3936.23, 3539.29, 2953.34, 3315.87, 4199.72, 5236.93, 6024.42, 5326.19, 3895.93, 2908.36, 3234.52]
    };
  },

  watch: {
    chartData: {
      handler() {
        this.initChart();
      },
      deep: true
    }
  },

  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },

  methods: {
    initChart() {
      if (!this.$refs.chart2) return;

      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      this.chartInstance = echarts.init(this.$refs.chart2);

      // 获取传入的数据，如果为空则使用默认空数组
      const rawSeriesData = this.chartData && this.chartData.data ? this.chartData.data : [[], []];
      
      // 将 kWh 转换为 MWh (除以 1000)，并保留两位小数
      const seriesData = rawSeriesData.map(series => 
        series.map(val => (val !== null && val !== undefined && !isNaN(val)) ? (Number(val) / 1000).toFixed(2) : val)
      );

      const xAxisData = this.chartData && this.chartData.xAxis ? this.chartData.xAxis : this.months;
      const legendData = this.chartData && this.chartData.labels ? this.chartData.labels : ["用电量", "基准值"];

      const option = {
        graphic: [
          {
            type: "text",
            left: '1%',
            top: '20%',
            style: {
              text: "(MWh)",
              fill: "#666",
              fontSize: 12,
            }
          }
        ],
        grid: {
          top: "30%",
          left: "1%",
          right: "3%",
          bottom: "2%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "20%",
          right: "5%",
          data: legendData
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.02)"
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.1)"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.1)"
            }
          },
          axisLabel: {
            color: "#999"
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,0.02)"
            }
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999"
          }
        },
        series: [
          {
            name: legendData[0] || "用电量",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[0] || [],

            lineStyle: {
              width: 3,
              color: "rgba(79,142,247,0.35)"
            },

            itemStyle: {
              color: "rgba(79,142,247,0.35)"
            },

            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(79,142,247,0.65)" },
                { offset: 1, color: "rgba(79,142,247,0.06)" }
              ])
            }
          },

          {
            name: legendData[1] || "基准值",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[1] || [],
            lineStyle: {
              width: 3,
              color: "#E6C36A"
            },
            itemStyle: {
              color: "#E6C36A"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(230,195,106,0.75)" },
                { offset: 1, color: "rgba(230,195,106,0.08)" }
              ])
            }
          }
        ]
      };

      this.chartInstance.setOption(option);
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    }
  }
};
</script>

<style scoped>
.line_chart2 {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
