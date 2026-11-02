<!-- KPI分析 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <wl-main-title data-title="KPI分析">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="时间">
            <el-date-picker v-model="formData.month" type="month" format="yyyy-MM" value-format="yyyyMM"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </wl-main-title>
      <el-main>
        <section class="main_content">
          <section class="top_wrap">
            <span class="content_title">每平米空调能耗关系曲线</span>
            <section id="top_content"></section>
          </section>
          <section class="bottom_content">
            <section class="left_warp">
              <span class="content_title">温度与负荷功率关系曲线</span>
              <section id="left_content"></section>
            </section>
            <section class="right_warp">
              <span class="content_title">温度与热量关系曲线</span>
              <section id="right_content"></section>
            </section>
          </section>
        </section>
      </el-main>
    </section>
  </section>
</template>

<script>
import { getAllData } from '@/api/kpi-analysis.js'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      timeType: "month",
      formData: {
        month: '',
      },
      tableData: [],
      scatterOption: {
        grid: {
          top: '10%',
          left: '2%',
          right: '5%',
          bottom: '10%'
        },
        tooltip: {
          show: true,
          trigger: 'item',
        },
        xAxis: {
          name: '时间',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#93dcfe'
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: 'kWh/m²',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#93dcfe'
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        legend: {
          show: true,
          right: 10,
          data: ['1', '2'],
          icon: 'rect',
          // itemWidth:'16',
          // itemHeight:'6',
          textStyle: {
            color: "transparent",
          },
          // top:'0%',
          // left:'80%',
          // orient: "horizontal",
        },
        series: [{
          name: '1',
          symbolSize: 10,
          data: [],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#008afd' },
            { offset: 1, color: '#96d2fc' }
          ]),
          type: 'scatter',
        }, {
          name: '2',
          symbolSize: 10,
          data: [],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#03e0ef' },
            { offset: 1, color: '#b1feff' }
          ]),
          type: 'scatter'
        }]
      },
      scatterOption1: {
        grid: {
          top: '14%',
          left: '4%',
          right: '10%',
          bottom: '10%'
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (v) {
            return `温度：<span>${v.value[0]}</span></br>负荷功率：<span>${v.value[1]}</span>`
          }
        },
        xAxis: {
          name: '温度',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#93dcfe'
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          name: '负荷功率',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#93dcfe'
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        legend: {
          show: false,
          right: 10,
          data: ['1', '2'],
          icon: 'rect',
          textStyle: {
            color: "transparent",
          },
        },
        series: [{
          name: '1',
          symbolSize: 10,
          data: [],
          color: '#926ef0',
          type: 'scatter',
        }]
      },
      top_content_chart: null,
      left_content_chart: null,
      right_content_chart: null
    };
  },

  components: {},

  computed: {},
  filters: {},
  created() {
    this.$nextTick(() => {
      this.init();
    })
  },
  mounted() {
    let _this = this;
    _this.formData.month = new Date().toISOString().substr(0, 7).replace('-', '');
    window.onresize = function () {
      _this.top_content_chart.resize();
      _this.left_content_chart.resize();
      _this.right_content_chart.resize();
    }
  },

  methods: {
    init() {
      this.getData();
      this.drawScatter();
      this.drawScatter1();
      this.drawScatter2();
    },
    drawScatter() {
      this.top_content_chart = this.$echarts.init(document.getElementById('top_content'));
      this.top_content_chart.setOption(this.scatterOption);
    },
    drawScatter1() {
      this.left_content_chart = this.$echarts.init(document.getElementById('left_content'));
      this.left_content_chart.setOption(this.scatterOption1);
    },
    drawScatter2() {
      this.right_content_chart = this.$echarts.init(document.getElementById('right_content'));
      this.scatterOption1.series[0].color = '#f8b0b4';
      this.scatterOption1.yAxis.name = '热量';
      this.scatterOption1.tooltip.formatter = function (v) {
        return `温度：<span>${v.value[0]}</span></br>热量：<span>${v.value[1]}</span>`
      }
      this.right_content_chart.setOption(this.scatterOption1);
    },
    //查询
    query() { },
    //重置
    reset() { },
    getData() {
      getAllData(this.formData).then(res => {
        if (res.code == 200 && res.data.length > 0) { }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.el-form {
  margin: 15px 0 0 40px;
}

.container_warp {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.container_box {
  height: 100%;
  min-width: 100%;
}

::-webkit-scrollbar-track-piece {
  background: transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: $light-blue;
  border-radius: 20px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.el-main {
  height: calc(100% - 60px);
  overflow-x: hidden;
  overflow-y: auto;
}

.main_content {
  height: 100%;

  #top_content {
    min-width: 100%;
    height: calc(100% - 27px);
    overflow: hidden;
  }

  .bottom_content {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    margin-left: 20px;
    height: calc(52% - 25px);
    overflow: hidden;
  }

  .content_title {
    display: block;
    width: 223px;
    height: 27px;
    line-height: 27px;
    text-indent: 20px;
    background-image: url(../../../assets/img/title_bg.png);
  }

  .left_warp,
  .right_warp {
    width: 48%;
    height: 100%;
    padding: 20px 0 0 20px;
  }

  .top_wrap {
    min-width: 100%;
    height: 48%;
    padding: 20px 0 0 20px;
    margin-left: 20px;
  }

  section.left_warp,
  section.right_warp,
  .top_wrap {
    background-color: #1e2a45;
    border-radius: 6px;
    box-shadow: 6px 6px 8px 0px rgb(0 0 0 / 20%);
  }

  #left_content,
  #right_content {
    min-width: 50%;
    height: calc(100% - 27px);
    overflow: hidden;
  }
}
</style>