<template>
  <section ref="myChart" class="center_pie_chart"></section>
</template>
<script>
export default {
  props: {
    dataItem: {
      type: Object,
      default: () => { }
    },
    dataYear: {
      type: String,
      default: ''
    },
    dataName: {
      type: String,
      default: '维修设备'
    }
  },
  data: function () {
    return {
      options: {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '',
          textStyle: {
            color: "rgba(0,0,0,0.65)",
            fontWeight: 400,
            rich: {
              a: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              },
              b: {
                fontSize: 16,
                color: '#b8becc',
                height: '40',
                lineHeight: '30'
              },
              c: {
                fontSize: 36,
                color: '#fff',
                fontWeight: '800'
              },
            }
          },
          textAlign: "center", //图例文字居中显示
          x: "60%",   //距离左边的距离
          y: "25%"    //距离上边的距离
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 'left',
          top: '10%',
          left: '5%',
          textStyle: {
            width: 10,
            fontSize: '13',
            color: '#ccd4ff',
            lineHeight: 25,
            overflow: 'break'
          },
          itemWidth: 14,
          itemHeight: 8,
          formatter: function (val) {
            return val.length > 4 ? val.substr(0, 4) + "..." : val;
          }
        },

        color: ['#fa8b69', '#578fff', '#ffd17f', '#52e5ff', '#d373ff'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['68%', '86%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: 0, name: '' },
            ]
          }
        ]
      }
    }
  },
  watch: {
    'dataItem': function () {
      this.init()
    },
    'dataName': function () {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let myChart = this.$echarts.init(this.$refs.myChart);
      if (this.dataItem !== null && Object.values(this.dataItem).length > 0) {
        let tempArr = [], tempNumber = 0;
        for (let key in this.dataItem) {
          let tempObj = {
            name: '',
            value: -1
          }
          tempObj.name = key;
          tempObj.value = this.dataItem[key];
          tempNumber += this.dataItem[key];
          tempArr.push(tempObj)
        }
        this.options.series[0].data = tempArr;
        this.options.title.text = `{a|${this.dataYear}}\n{b|${this.dataName}}\n{c|${tempNumber}}{b|${this.dataName === '巡检次数' ? '次' : '单'}}`
      } else {
        this.options.title.text = `{a|${this.dataYear}}\n{b|${this.dataName}}\n{c|0}{b|单}`
      }
      myChart.setOption(this.options);
      window.onresize = myChart.resize;
    }
  }
}
</script>
<style lang="scss" scoped>
.center_pie_chart {
  width: 100%;
  height: 200px;
  background-image: url('@/assets/img/bills/bar_bg.png');
  background-repeat: no-repeat;
  background-position: 120px 38px;
}
</style>
      