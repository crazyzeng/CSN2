<template>
  <section style="width:100%;height:100%">
    <section ref="chart2" class="line_chart2"></section>
  </section>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    passengerFlowData: {
      type: Object,
      default: () => ({
        xAxis: [],
        data: [[], []],
        labels: [],
        current: "",
        tb: ""
      })
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },

  watch: {
    passengerFlowData: {
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

      // 获取动态数据
      const xAxisData = this.passengerFlowData.xAxis || [];
      const seriesData = this.passengerFlowData.data || [];
      const legendData = this.passengerFlowData.labels || [];
      const currentVal = this.passengerFlowData.current !== undefined ? this.passengerFlowData.current : "";
      const tbVal = this.passengerFlowData.tb !== undefined ? this.passengerFlowData.tb : "";

      const option = {
        graphic: [
          {
            type: "text",
            left: '1%',
            top: '6%',
            style: {
              text: `当月均值: ${currentVal || ''}人次   历史值: ${tbVal || ""}人次 `,
              fill: "#666",
              fontSize: 12,
            }
          }
        ],
        grid: {
          top: "15%",
          left: "1%",
          right: "3%",
          bottom: "13%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          right: "5%",
          data: legendData.length > 0 ? legendData : ["当月均值", "历史均值"]
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
            name: legendData[0] || "当月均值",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[0] || [],

            lineStyle: {
              width: 3,
              color: "#B9A6F6"
            },

            itemStyle: {
              color: "#B9A6F6"
            },

            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(185,166,246,0.75)" },
                { offset: 1, color: "rgba(185,166,246,0.01)" }
              ])
            }
          },

          {
            name: legendData[1] || "历史均值",
            type: "line",
            smooth: false,
            showSymbol: false,
            data: seriesData[1] || [],

            lineStyle: {
              width: 3,
              color: "#CFE6A3"
            },

            itemStyle: {
              color: "#CFE6A3"
            },

            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(207,230,163,0.75)" },
                { offset: 1, color: "rgba(207,230,163,0.01)" }
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
}
</style>
