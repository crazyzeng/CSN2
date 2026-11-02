<template>
  <section id="bottom_pie_chart"></section>
</template>
<script>

export default {
  props: {
    dataItem: {
      type: Array,
      default: []
    },
    dataType: {
      type: String,
      default: 'ENERGY_ELECTRIC'
    }
  },
  data: function () {
    return {
      options: {
        tooltip: {
        },
        color: ['#F8EA95', '#02C2AE', '#578CF7', '#F38969', '#52DFF7', '#F1B051', '#F8CC7E', '#CE73F8', '#F9B5EB', '#2676DE'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '60%',
            center: ['45%', '50%'],
            label: {
              color: '#ccd4ff'
            },
            labelLine: {
              length: 10,
              length2: 30
            },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
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
  methods: {
    init() {
      this.myChart = this.$echarts.init(document.getElementById('bottom_pie_chart'));
      const tempArray = [];
      const energyType = this.dataType;
      this.dataItem.forEach(v => {
        const tempObj = {
          name: '',
          value: 0
        }
        for (let key in v) {
          tempObj.name = key;
          tempObj.value = v[key];
        }
        tempArray.push(tempObj)
      })
      this.options.series[0].data = tempArray;
      this.options.tooltip = {
        trigger: 'item',
        formatter: function (params) {
          return `${params.name} : ${params.value}${energyType === 'ENERGY_ELECTRIC' ? ' kWh' : ' t'}</br>占比 : ${params.percent} %`
        }
      }
      this.updateChartOptions();
      this.myChart.setOption(this.options);
      window.onresize = this.myChart.resize;
    },
    handleResize() {
      // 自适应图表大小
      if (this.myChart) {
        this.myChart.resize();
        this.updateChartOptions();
        this.myChart.setOption(this.options);
      }
    },
    updateChartOptions() {
      const container = document.getElementById('bottom_pie_chart');
      const radius = Math.min(container.offsetWidth, container.offsetHeight) * 0.3;  // 根据容器动态计算半径
      this.options.series[0].radius = `${radius}px`;
      this.options.series[0].center = ['45%', '50%'];
    }
  }
}
</script>
<style lang="scss" scoped>
#bottom_pie_chart {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
      