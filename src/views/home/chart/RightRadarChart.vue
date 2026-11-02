<template>
  <section id="radar_chart"></section>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    dataItem: {
      type: Array,
      default: () => []
    },
    energyType: {
      type: String,
      default: 'ENERGY_ELECTRIC'
    }
  },
  data() {
    return {
      options: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        lineStyle: {
          opacity: 0,
        },
        color: 'none',
        radar: [
          {
            indicator: [
              { text: '健康', max: 100 },
              { text: '亚健康', max: 100 },
              { text: '故障', max: 100 },
            ],
            center: ['50%', '60%'],
            radius: 112,
            axisName: {
              backgroundColor: 'red'
            },
          },
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {
              color: 'red',
            },
            data: [
              {
                value: [90, 85, 10],
                name: '',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: 'rgba(210,111,16, 1)',
                      offset: 0
                    },
                    {
                      color: 'rgba(210,176,144, 1)',
                      offset: 1
                    }
                  ])
                },
              },
            ]
          },
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.addEventListener('resize', this.handleResize);
    });
  },
  beforeDestroy() {
    // 移除监听器，防止内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
    'energyType': function () {
      this.init()
    },
  },
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById('radar_chart'));
      let sum = eval(this.options.series[0].data[0].value.join("+"))
      this.options.series[0].name = `设备总数：${sum}`
      this.myChart.setOption(this.options);
      window.onresize = this.myChart.resize;
    },
    handleResize() {
      // 自适应图表大小
      if (this.myChart) {
        this.myChart.resize();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#radar_chart {
  width: 100%;
  height: 100%;
}
</style>