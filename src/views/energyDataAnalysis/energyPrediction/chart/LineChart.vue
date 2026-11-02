<template>
  <section style="width:100%;height:100%">
    <section ref="chart" class="line_chart"></section>
  </section>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    temperatureData: {
      type: Object,
      default: () => ({
        xAxis: [],
        data: [[], []],
        labels: []
      })
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },

  watch: {
    temperatureData: {
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
      if (!this.$refs.chart) return;

      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      this.chartInstance = echarts.init(this.$refs.chart);

      // 获取动态数据
      const xAxisData = this.temperatureData.xAxis || [];
      const seriesData = this.temperatureData.data || [];
      const legendData = this.temperatureData.labels || [];

      const option = {
        graphic: [
          {
            type: "text",
            left: '2%',
            top: '6%',
            style: {
              text: "(°C)",
              fill: "#666",
              fontSize: 12,
            }
          }
        ],
        grid: {
          top: "15%",
          left: "3%",
          right: "3%",
          bottom: "13%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          right: "5%",
          data: legendData
        },
        xAxis: {
          type: "category",
          data: xAxisData.map(item => item + '月'), 
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
            name: legendData[0] || "当前温度",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[0] || [],
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
          },

          {
            name: legendData[1] || "历史温度",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[1] || [],
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
.line_chart {
  width: 100%;
  height: 100%;
}
</style>
