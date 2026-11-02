<!-- 节能对比 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="节能对比">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="时间">
            <el-date-picker v-model="formData.queryDate" :type="timeType" :format="date_format"
              :value-format="value_format" placeholder="请选择" @change="dateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-radio-group v-model="timeType" @change="typeChange" class="custom_radio">
              <el-radio label="year">年</el-radio>
              <el-radio label="month">月</el-radio>
              <el-radio label="date">日</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </wl-main-title>
      <el-main>
        <section class="content_warp">
          <section class="top_box">
            <span class="content_title">用电量对比</span>
            <section id="bar_chart"></section>
          </section>
          <section class="bottom_box">
            <span class="content_title">用水量对比</span>
            <section id="bar_chart1"></section>
          </section>
        </section>
      </el-main>
    </section>
  </section>
</template>

<script>
import * as echarts from 'echarts';
import { fetchEnergySavingCompareList } from '@/api/energy-saving-compare.js'
import { curry } from 'lodash-es';
import dayjs from 'dayjs'
import { deepClone } from '@/utils/index';
export default {
  data() {
    return {
      timeType: "date",
      date_format: 'yyyy-MM-dd',
      value_format: 'yyyyMMdd',
      formData: {
        queryDate: dayjs(new Date()).format('YYYYMMDD'),
      },
      xData: [],
      list: {
        month: [
          {
            itemText: '一月',
            itemValue: 1
          },
          {
            itemText: '二月',
            itemValue: 2
          },
          {
            itemText: '三月',
            itemValue: 3
          },
          {
            itemText: '四月',
            itemValue: 4
          },
          {
            itemText: '五月',
            itemValue: 5
          },
          {
            itemText: '六月',
            itemValue: 6
          },
          {
            itemText: '七月',
            itemValue: 7
          },
          {
            itemText: '八月',
            itemValue: 8
          },
          {
            itemText: '九月',
            itemValue: 9
          },
          {
            itemText: '十月',
            itemValue: 10
          },
          {
            itemText: '十一月',
            itemValue: 11
          },
          {
            itemText: '十二月',
            itemValue: 12
          },
        ]
      },
      barOption: {
        grid: {
          left: '3%',
          right: '5%'
        },
        title: {
          subtext: 'kWh',
          left: 15,
          top: 10,
          subtextStyle: {
            color: '#93dcfe'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          // formatter:function(v){
          //   return v
          // }
        },
        legend: {
          textStyle: {
            color: "#fff",
            fontSize: "12"
          }
        },
        calculable: true,
        xAxis: [
          {
            position: 'bottom',
            name: '(时)',
            nameTextStyle: {
              color: '#93dcfe'
            },
            axisLabel: {
              textStyle: {
                color: '#93dcfe'
              }
            },
            axisLine: {
              lineStyle: {
                color: "#93dcfe"//轴轴线颜色
              }
            },
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                width: 1,
                color: '#154a86'
              }
            },
            axisLine: {
              show:false,
              lineStyle: {
                color: "#93dcfe"//轴轴线颜色
              }
            },
            axisTick: {
              show: false // 不显示y轴刻度
            },
            axisLabel: {
              textStyle: {
                color: '#93dcfe'
              }
            },
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2fdfff' },
                { offset: 1, color: '#0044cc' }
              ])
            },
            // emphasis: {
            //   itemStyle: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: '#14faff' },
            //       { offset: 0.5, color: '#0580fc' },
            //       { offset: 1, color: '#f98973' }
            //     ])
            //   }
            // },
            barWidth: 16
          },
          {
            name: '',
            type: 'bar',
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ffc169' },
                { offset: 1, color: '#c02900' }
              ])
            },
            // emphasis: {
            //   itemStyle: {
            //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: '#14faff' },
            //       { offset: 0.5, color: '#0580fc' },
            //       { offset: 1, color: '#f98973' }
            //     ])
            //   }
            // },
            barWidth: 16
          },
        ]
      },
      bar_chart: null,
      bar_chart1: null
    };
  },

  components: {},

  computed: {},

  mounted() {
    let _this = this;
    window.onresize = function () {
      _this.bar_chart.resize();
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    init() {
      this.getData();
      this.drawBar();
      this.drawBar1();
      this.getXData(24, 0);
    },
    drawBar() {
      this.bar_chart = this.$echarts.init(document.getElementById('bar_chart'));
      this.bar_chart.setOption(this.barOption);
    },
    drawBar1() {
      this.bar_chart1 = this.$echarts.init(document.getElementById('bar_chart1'));
      this.bar_chart1.setOption(this.barOption);
    },
    typeChange() {
      let tempNum = 0;
      if (this.timeType === 'month') {
        this.formData.queryDate = dayjs(new Date).format('YYYYMM')
        this.date_format = 'yyyy-MM';
        this.value_format = 'yyyyMM';
        tempNum = dayjs(this.formData.queryDate).daysInMonth() + 1;
        this.getXData(tempNum, 1)
        this.barOption.xAxis[0].name = '(日)'
      } else if (this.timeType === 'date') {
        this.formData.queryDate = dayjs(new Date).format('YYYYMMDD')
        this.date_format = 'yyyy-MM-dd';
        this.value_format = 'yyyyMMdd';
        tempNum = 24;
        this.getXData(tempNum, 0)
        this.barOption.xAxis[0].name = '(时)'
      } else {
        this.formData.queryDate = dayjs(new Date).format('YYYY')
        this.date_format = 'yyyy';
        this.value_format = 'yyyy';
        tempNum = 13;
        this.getXData(tempNum, 1)
        this.barOption.xAxis[0].name = '(月)'
      }
    },
    dateChange() {
      // this.typeChange();
    },
    getXData(dateMode, startIndex) {
      let tempData = []
      for (let i = startIndex; i < dateMode; i++) {
        tempData.push(i);
      }
      this.xData = tempData;
    },
    //查询
    query() {
      this.getData()
    },
    //重置
    reset() {
      this.formData.queryDate = dayjs(new Date()).format('YYYYMMDD')
      this.getData()
    },
    getData() {
      fetchEnergySavingCompareList(this.formData).then(res => {
        if (res && res.data) {
          let tempOption = deepClone(this.barOption)

          let curLength = 0
          if (res.data && Object.values(res.data['总用电量'][1]).length > 0) curLength = Object.values(res.data['总用电量'][1])[0].length;
          if (curLength > 0) this.barOption.series[0].data = Object.values(res.data['总用电量'][0])[0].splice(0, curLength);
          this.barOption.series[0].name = Object.keys(res.data['总用电量'][0])[0];
          this.barOption.series[1].data = Object.values(res.data['总用电量'][1])[0];
          this.barOption.series[1].name = Object.keys(res.data['总用电量'][1])[0];
          this.barOption.xAxis[0].data = this.xData;
          this.drawBar();
          let curLength1 = 0;
          if (res.data && Object.values(res.data['总用水量'][1]).length > 0) curLength1 = Object.values(res.data['总用水量'][1])[0].length;
          if (curLength > 0) tempOption.series[0].data = Object.values(res.data['总用水量'][0])[0].splice(0, curLength1);
          tempOption.series[0].name = Object.keys(res.data['总用水量'][0])[0];
          tempOption.series[1].data = Object.values(res.data['总用水量'][1])[0];
          tempOption.series[1].name = Object.keys(res.data['总用水量'][1])[0];
          tempOption.title.subtext = 't';
          tempOption.xAxis[0].data = this.xData;
          this.bar_chart1.setOption(tempOption);
        }
      })
    },
  }
}

</script>
<style lang='scss' scoped>
::v-deep(.th-main-title) {
  h2{
    line-height: normal!important;
    margin-left: 20px!important;
  }
}
.el-form{
  margin-top: 0!important;
}
.th-main-title {
    height: 50px !important;
}
.el-main {
  height: calc(100% - 50px)!important;
}
.curDivider{
  left: 13px;
  top: 3px;
}
//
.container_warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
  width: calc(100% - 20px)!important;
}

.container_box {
  // width: 1740px;
  height: 100%;
  overflow: auto;
  min-width: 1740px;
}

.el-main {
  height: calc(100% - 60px);
}

.content_title {
  display: block;
  width: 223px;
  height: 27px;
  line-height: 27px;
  text-indent: 20px;
  background-image: url(../../../assets/img/title_bg.png);
  // margin: 20px 0 39px 0;
}

#bar_chart,
#bar_chart1 {
  width: 100%;
  height: calc(100% - 37px);
}

.top_box,
.bottom_box {
  height: calc(50%);
  overflow: hidden;
}

.custom_radio {
  >.el-radio {
    color: #fff;
  }
}

.content_warp {
  height: 100%;
  background: #1e2a45;
  width: calc(100% - 20px);
  margin-left: 20px;
  border-radius: 8px;
  padding-top: 30px;
  padding-left: 20px;
}

::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.el-form {
  margin: 15px 0 0 40px;
}
</style>