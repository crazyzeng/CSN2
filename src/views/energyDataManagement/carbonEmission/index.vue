<!-- 碳排放 -->
<template>
  <section class="container_warp">
    <!-- <section class="container_box"> -->
    <!-- <el-divider class="curDivider" direction="vertical" /> -->
    <!-- <wl-main-title data-title="碳排放"> -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="formData.date" :type="timeType" :format="date_format" value-format="yyyyMM"
          placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-radio-group v-model="timeType" @change="typeChange">
          <el-radio label="year">年</el-radio>
          <el-radio label="month">月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- </wl-main-title> -->
    <section class="main_content">
      <section class="left_content">
        <section class="left_top_content">
          <section
            style="background-color: #FFFFFF; width: 49%; border-radius: 8px;box-shadow: 6px 6px 8px 0px rgb(0 0 0 / 20%);">
            <section class="top_left">
              <span class="content_title">累计碳排放量</span>
              <section id="top_left_chart" class="chart_box" style="width: 100%; height: 100%;"></section>
              <div class="content_total">
                <div class="content_num">{{ totalCarbonNum }}</div>
                <div class="content_unit">吨/CO2</div>
              </div>
            </section>
          </section>
          <section
            style="background-color: #FFFFFF; width: 49%; border-radius: 8px;box-shadow: 6px 6px 8px 0px rgb(0 0 0 / 20%);">
            <section class="top_right">
              <span class="content_title">累计碳减少量</span>
              <section id="top_right_chart" class="chart_box" style="width: 100%; height: 100%;"></section>
              <div class="content_total">
                <div class="content_num">{{ decreaseNum }}</div>
                <div class="content_unit">吨/CO2</div>
              </div>
            </section>
          </section>
        </section>
        <section class="left_bottom_content">
          <ul class="flex justify-between flex-col">
            <li v-for="item in dataList" :key="item.name">
              <span class="icon"></span>
              <section class="num_box">
                <el-tooltip class="item" effect="dark" :content="String(item.total)" placement="top">
                  <span class="eleNum">{{ item.total }}<span class="eleUnit">{{ item.unit }}</span></span>
                </el-tooltip>
                <!-- <span class="eleNum">{{ item.total }}</span> -->
                <span class="eleTitle">{{ item.label }}
                </span>
              </section>
              <section class="ratio_box">
                <span class="eleFactor">{{ item.ratio }}tco2 </span>
                <span class="eleFactorunit">{{ item.result_unit }}</span>
                <!-- <span class="eleTranunit">MWh</span> -->
              </section>
              <section class="carbonNum_box">
                <span class="eleResultnum">{{ item.value }}</span><span class="resultUnit">吨</span>
                <span class="resultTitle">碳排放量</span>
              </section>
            </li>
          </ul>
        </section>
      </section>
      <section class="right_content">
        <!-- <span class="content_title">双碳目标</span> -->
        <!-- <section id="right_chart" :style="{ width: '912px', height: '680px' }"></section> -->
        <section class="barChart_box">
          <BarChart :bar-data="tableData" :bar-time="timeType"></BarChart>
        </section>
      </section>
    </section>
    <!-- </section> -->
  </section>
</template>

<script>
import { getAlldata } from "@/api/carbon-emission.js";
import * as echarts from "echarts";
import dayjs from "dayjs";
import Big from "big.js";
import BarChart from "./chart/BarChart.vue";
import { string } from "three/src/nodes/TSL.js";
export default {
  data() {
    return {
      timeType: "month",
      date_format: "yyyy-MM",
      formData: {
        date: "",
      },
      tableData: {},
      dataList: [
        { name: 'electricity', label: '累计用电量', total: '', value: '', ratio: '0', result_unit: 'MWh', unit: 'KW/h' },
        { name: 'water', label: '累计用水量', total: '', value: '', ratio: '0', result_unit: 't', unit: 'T' },
        { name: 'heat', label: '累计用热量', total: '', value: '', ratio: '0', result_unit: 'GJ', unit: 'KJ' },
        { name: 'gas', label: '累计用气量', total: '', value: '', ratio: '0', result_unit: 'm³', unit: 'KW/H' }
      ],
      decrement: {},
      emission: {},
      max: 1500,
      timer: 1.5,
      timeTickId: null,
      cData: {
        name: "",
        num: 1000,
      },
      cData1: {
        name: "",
        num: 800,
      },
      option: {},
      option1: {},
      chart: null,
      chart1: null,
      gaugeOption: {
        series: [
          {
            type: "gauge",
            progress: {
              show: true,
              width: 18,
            },
            axisLine: {
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 12,
              },
            },
            startAngle: 0,
            endAngle: 359.999,
            anchor: {
              show: true,
              showAbove: false,
              size: 25,
              itemStyle: {
                borderWidth: 5,
                borderColor: "yellow",
                color: "transparent",
              },
            },
            pointer: {
              length: "100%",
              width: 4,
              offsetCenter: [0, 0],
              itemStyle: {
                color: "yellow",
              },
            },
            axisTick: {
              show: false,
              length: 10,
              splitNumber: 100,
              lineStyle: {
                width: 2,
                // 给点颜色
              },
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: "#999",
              },
            },
            axisLabel: {
              show: false,
              distance: 25,
              fontSize: 20,
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}%",
              fontSize: 20,
              offsetCenter: [0, "80%"],
            },
            data: [],
          },
        ],
      },
      barOption: {
        title: {
          subtext: "(t)",
          left: 85,
          top: 10,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["碳排放量", "碳减少量"],
          textStyle: {
            color: "#fff",
            fontSize: "12",
          },
        },
        calculable: true,
        xAxis: [
          {
            position: "bottom",
            name: "月",
            nameTextStyle: {
              padding: [0, 0, 0, -10], // 四个数字分别为上右下左与原位置距离
            },
            axisLabel: {
              textStyle: {
                color: "white",
              },
            },
            type: "category",
            data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "white",
              },
            },
          },
        ],
        series: [
          {
            name: "碳排放量",
            type: "bar",
            data: [],
            barGap: 0,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2fdfff" },
                { offset: 1, color: "#0044cc" },
              ]),
            },
            barWidth: 10,
          },
          {
            name: "碳减少量",
            type: "bar",
            data: [],
            barGap: 0,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#ffc169" },
                { offset: 1, color: "#c02900" },
              ]),
            },
            barWidth: 10,
          },
        ],
      },
      totalCarbonNum: 0,
      decreaseNum: 0,
    };
  },

  components: { BarChart },

  computed: {},
  filters: {
    toThousands(num) {
      var num = (num || 0).toString(),
        result = "";
      while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return result;
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.formData.date = dayjs().format("YYYYMM");
      this.getData();
    },

    chartInit() {
      let PolarGauge = document.getElementById("top_left_chart");
      let PolarGauge1 = document.getElementById("top_right_chart");
      this.chart = echarts.init(PolarGauge); //初始化chart容器
      this.chart1 = echarts.init(PolarGauge1);
      this.createPolarGauge(); //配置chart
      this.createPolarGauge1();

      window.addEventListener("resize", () => {
        this.chart && this.chart.resize();
        this.chart1 && this.chart1.resize();
      });
    },

    createPolarGauge() {
      var _this = this;
      let chartDom = document.getElementById("top_left_chart");
      let size = chartDom.offsetWidth;
      this.option = {
        angleAxis: {
          show: false,
          max: (this.max * 3) / 2, //这里将极坐标最大值转换成仪表盘的最大值，(360度除以240度)
          type: "value",
          startAngle: 210, //极坐标初始角度，从第一象限算起，大约在7-8点钟角度之间
          splitLine: {
            show: false, //隐藏坐标
          },
        },
        barMaxWidth: 28, //圆环宽度
        radiusAxis: {
          //隐藏坐标
          show: false,
          type: "category",
        },
        polar: {
          //设置圆环位置和大小
          radius: "0",
        },
        series: [
          {
            type: "bar",
            data: [
              {
                //上层圆环，用于显示真实数据
                value: this.totalCarbonNum,
                itemStyle: {
                  color: {
                    //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 1, //从左到右 0-1
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#0033a6", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#11c4ff", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                  shadowColor: "rgba(255, 255, 255, 0.2)", //加白色阴影产生高亮效果
                  shadowBlur: 10,
                },
              },
            ],
            barGap: "-100%", //柱间距离,用来将上下两层圆环重合
            coordinateSystem: "polar", //类型，极坐标
            roundCap: true, //顶端圆角
            z: 2, //圆环层级，和zindex相似
          },
          {
            //下层圆环，用于显示最大值
            type: "bar",
            data: [
              {
                value: this.max,
                itemStyle: {
                  color: "#0b1624",
                  shadowColor: "rgba(0, 0, 0, 0.2)", //加白色阴影产生高亮效果
                  shadowBlur: 5,
                  shadowOffsetY: 2,
                },
              },
            ],
            barGap: "-100%", //柱间距离,用来将上下两层圆环重合
            coordinateSystem: "polar", //类型，极坐标
            roundCap: true, //顶端圆角
            z: 1, //圆环层级，和zindex相似
          },
          {
            //仪表盘
            type: "gauge",
            radius: "50%",
            center: ["50%", "45%"],
            startAngle: 215, //起始角度，同极坐标
            endAngle: -35, //终止角度，同极坐标
            max: this.max,
            splitNumber: 10, //分割线个数（除原点外）
            axisLine: {
              // 坐标轴线
              show: false,
            },
            pointer: {
              show: true,
              length: "90%",
              width: 2,
              itemStyle: {
                color: "#f0d00a",
              },
            },
            axisLabel: {
              // 坐标轴数字
              show: false,
            },
            axisTick: {
              show: true,
              distance: -15,
              length: 8,
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            splitLine: {
              show: true,
              distance: -20,
              length: 15,
              lineStyle: {
                color: "#666",
                width: 2,
              },
            },
            title: {
              //标题，显示'馆藏量'
              textStyle: {
                color: "#fff",
                shadowColor: "#fff",
                fontSize: 30,
              },
              offsetCenter: ["0", "-35%"], //位置偏移
            },
            detail: {
              //仪表盘数值
              show: false,
              formatter: function (params) {
                var name = _this.totalCarbonNum.toString();
                var list = "";
                for (var i = 0; i < name.length; i++) {
                  list += "{value|" + name[i] + "}"; //每个数字用border隔开
                  if (i !== name.length - 1) {
                    list += "{margin|}"; //添加margin值
                  }
                }
                return [list];
              },
              offsetCenter: ["0", "90%"],
              rich: {
                //编辑富文本样式
                value: {
                  width: 34,
                  height: 42,
                  // borderColor: '#02A0F0',
                  // borderWidth: 2,
                  // borderRadius: 5,
                  lineHeight: 1000,
                  fontSize: 36,
                  padding: [0, 0, 4, 0],
                  color: "#fff",
                  shadowColor: "rgb(2,157,239)",
                  shadowBlur: 5,
                },
                margin: {
                  width: 8,
                  height: 42,
                },
              },
            },
            data: [
              {
                value: this.totalCarbonNum,
                name: this.cData.name,
              },
            ],
          },
        ],
      };
      this.setOption();
    },
    createPolarGauge1() {
      var _this = this;
      this.option1 = {
        series: [
          {
            //仪表盘
            type: "gauge",
            radius: "50%",
            center: ["50%", "45%"],
            startAngle: 215, //起始角度，同极坐标
            endAngle: -35, //终止角度，同极坐标
            max: this.max,
            splitNumber: 10, //分割线个数（除原点外）
            axisLine: {
              // 坐标轴线
              show: false,
            },
            pointer: {
              show: true,
              length: "90%",
              width: 2,
              itemStyle: {
                color: "#f0d00a",
              },
            },
            axisLabel: {
              // 坐标轴数字
              show: false,
            },
            axisTick: {
              show: true,
              distance: -15,
              length: 8,
              lineStyle: {
                color: "#ccc",
                width: 1,
              },
            },
            splitLine: {
              show: true,
              distance: -20,
              length: 15,
              lineStyle: {
                color: "#666",
                width: 2,
              },
            },
            title: {
              //标题，显示'馆藏量'
              textStyle: {
                color: "#fff",
                shadowColor: "#fff",
                fontSize: 30,
              },
              offsetCenter: ["0", "-35%"], //位置偏移
            },
            detail: {
              //仪表盘数值
              show: false,
              formatter: function (params) {
                var name = _this.cData.num.toString();
                var list = "";
                for (var i = 0; i < name.length; i++) {
                  list += "{value|" + name[i] + "}"; //每个数字用border隔开
                  if (i !== name.length - 1) {
                    list += "{margin|}"; //添加margin值
                  }
                }
                return [list];
              },
              offsetCenter: ["0", "90%"],
              rich: {
                //编辑富文本样式
                value: {
                  width: 34,
                  height: 42,
                  // borderColor: '#02A0F0',
                  // borderWidth: 2,
                  // borderRadius: 5,
                  lineHeight: 1000,
                  fontSize: 36,
                  padding: [0, 0, 4, 0],
                  color: "#fff",
                  shadowColor: "rgb(2,157,239)",
                  shadowBlur: 5,
                },
                margin: {
                  width: 8,
                  height: 42,
                },
              },
            },
            data: [
              {
                value: this.decreaseNum,
                name: this.cData1.name,
              },
            ],
          },
        ],
      };
      this.setOption1();
    },
    setOption() {
      //更新数据
      this.option.series[2].data[0].value = this.totalCarbonNum;
      this.option.series[0].data[0].value = this.totalCarbonNum;
      this.chart.setOption(this.option);
    },
    setOption1() {
      this.option1.series[0].data[0].value = this.decreaseNum;
      this.chart1.setOption(this.option1);
    },

    timeTick() {
      //定时器,最好用延时加递归，如果用setInterval，容易造成堵塞
      if (this.timeTickId) {
        clearTimeout(this.timeTickId);
        this.timeTickId = 0;
      }
      this.setOption();
      this.timeTickId = setTimeout(this.timeTick, 1000 * this.timer || 5000);
    },
    drawBar() {
      let bar_chart = this.$echarts.init(document.getElementById("right_chart"));
      let xAxisData = [];
      if (Object.keys(this.tableData).length > 0) {
        this.barOption.series[0].data = this.tableData.emission.barData;
        this.barOption.series[1].data = this.tableData.decrement.barData;
        for (let i in this.tableData.decrement.barData) {
          xAxisData.push(Number(i) + 1);
        }
        this.barOption.xAxis[0].data = xAxisData;
      }
      bar_chart.setOption(this.barOption);
    },
    drawGauge() {
      let gauge_chart = this.$echarts.init(document.getElementById("top_left_chart"));
      let gauge1_chart = this.$echarts.init(document.getElementById("top_right_chart"));
      this.gaugeOption.series[0].data = [{ value: 80 }];
      gauge_chart.setOption(this.gaugeOption);
      this.gaugeOption.series[0].data = [{ value: 60 }];
      gauge1_chart.setOption(this.gaugeOption);
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.timeType = "month";
      this.date_format = "yyyy-MM";
      this.formData.date = dayjs().format("YYYYMM");
      this.getData();
    },
    getData() {
      getAlldata(this.formData).then((res) => {
        if (res.code == 200 && Object.keys(res.data).length > 0) {
          this.tableData = res.data;
          this.decrement = res.data.decrement;
          this.emission = res.data.emission;
          // this.dataList = this.getDataFactory();
          //
          // 定义排序顺序
          const order = ["累计用电量", "累计用水量", "累计用热量", "累计用气量"];
          // 排序函数
          const sortedData = this.getDataFactory().sort((a, b) => {
            return order.indexOf(a.label) - order.indexOf(b.label);
          });
          this.dataList = sortedData;
          this.chartInit();
        }
      });
    },
    typeChange() {
      if (this.timeType === "month") {
        this.date_format = "yyyy-MM";
        this.formData.date = dayjs().format("YYYYMM");
      } else {
        this.date_format = "yyyy";
        this.formData.date = dayjs().format("YYYY");
      }
    },
    /* 格式化数据 */
    getDataFactory() {
      let cur_electricity = 0,
        cur_water = 0,
        cur_heat = 0,
        cur_gas = 0,
        resultData = [];
      let num1 = new Big(this.emission.info.electricity),
        num2 = new Big(this.emission.info.gas),
        num3 = new Big(this.emission.info.heat),
        num4 = new Big(this.emission.info.water);
      this.totalCarbonNum = num1.plus(num2).plus(num3).plus(num4).toNumber();
      let d_num1 = new Big(this.decrement.info.electricity),
        d_num2 = new Big(this.decrement.info.gas),
        d_num3 = new Big(this.decrement.info.heat),
        d_num4 = new Big(this.decrement.info.water);
      this.decreaseNum = d_num1.plus(d_num2).plus(d_num3).plus(d_num4).toNumber();
      for (let item in this.decrement.info) {
        if (item === "electricity") cur_electricity += this.decrement.info[item];
        else if (item === "water") cur_water += this.decrement.info[item];
        else if (item === "heat") cur_heat += this.decrement.info[item];
      }
      for (let item in this.emission.info) {
        let tempObj = {};
        if (item === "electricity") {
          cur_electricity = this.emission.info[item];
          tempObj.name = "electricity";
          tempObj.label = "累计用电量";
          tempObj.value = cur_electricity;
          tempObj.total = this.emission.info.electricityOrigin;
          tempObj.ratio = "0.4543";
          tempObj.result_unit = "MWh";
          tempObj.unit = "KW/h";
          resultData.push(tempObj);
        }
        if (item === "water") {
          cur_water = this.emission.info[item];
          tempObj.name = "water";
          tempObj.label = "累计用水量";
          tempObj.value = cur_water;
          tempObj.total = this.emission.info.waterOrigin;
          tempObj.ratio = "0.000194";
          tempObj.result_unit = "t";
          tempObj.unit = "T";
          resultData.push(tempObj);
        }
        if (item === "heat") {
          cur_heat = this.emission.info[item];
          tempObj.name = "heat";
          tempObj.label = "累计用热量";
          tempObj.value = cur_heat;
          tempObj.total = this.emission.info.heatOrigin;
          tempObj.ratio = "0.11";
          tempObj.result_unit = "GJ";
          tempObj.unit = "KJ";
          resultData.push(tempObj);
        }
        if (item === "gas") {
          cur_gas = this.emission.info[item];
          tempObj.name = "gas";
          tempObj.label = "累计用气量";
          tempObj.value = cur_gas;
          tempObj.total = this.emission.info.gasOrigin;
          tempObj.ratio = "0.00219";
          tempObj.result_unit = "m³";
          tempObj.unit = "KW/H";
          resultData.push(tempObj);
        }
      }
      // 这里需要重新排序，电，水，热，气的顺序
      return resultData;
    },
  },
};
</script>
<style lang="scss" scoped>
.barChart_box {
  width: 100%;
  height: 100%;
}

::v-deep.el-radio-group {
  .el-radio {
    color: #fff;
  }
}

.el-date-picker {
  position: relative;
  z-index: 99999;
}

.el-form {
  margin: 0px 0 0 50px;
}

.container_warp {
  width: 100%;
  height: 100%;
  // position: relative;
  // overflow: auto;
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

.container_box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.el-main {
  flex: 1;
  overflow: auto;
}

.main_content {
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
  display: flex;
  justify-content: space-between;
  // overflow: auto;

  >.left_content {
    width: 50%;
    height: 100%;

    section.left_top_content {
      display: flex;
      height: 52%;
      justify-content: space-between;
    }

    section.left_bottom_content {
      width: 100%;
      height: calc(48% - 16px);
      margin-top: 16px;

      >ul {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        >li {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 6px 6px 8px 0px rgb(0 0 0 / 20%);
          border-radius: 5px;
          background-color: #FFFFFF;
          padding-right: 15px;
          overflow: hidden;

          .num_box {
            width: 200px;
            overflow: hidden;
            margin-left: 10px;
            text-align: center;
          }

          .carbonNum_box {
            width: 200px;
            overflow: hidden;
          }

          >span.icon {
            display: block;
            width: 102px;
            height: 90px;
            background-position: center;
            background-size: 70% auto;
            background-repeat: no-repeat;
          }

          .eleNum {
            color: #000;
          }

          .eleUnit {
            color: #666;
            color: #666;
            font-size: 14px;
            font-weight: 400;
          }

          >section:nth-child(2) {



            .eleNum {
              font-size: 24px;
              font-weight: bold;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              display: block;
            }

            >.eleTitle {
              display: block;
              color: #666;
              font-size: 14px;
            }
          }

          >section:nth-child(3) {
            width: 293px;
            height: 90px;
            background-image: url(../../../assets/img/energyManagement/formula.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            text-align: center;

            span.eleFactor,
            span.eleFactorunit {
              display: block;
              color: #666666;
              font-size: 13px;
            }

            span.eleFactor {
              margin-top: 24px;
            }

            span.eleFactorunit {
              margin-top: 5px;
              text-align: center;
            }

          }

          >section:nth-child(4) {
            text-align: center;

            span.eleResultnum {
              font-size: 24px;
              color: #000;
              font-weight: 600;
            }

            span.resultTitle {
              display: block;
              color: #666;
              font-size: 14px;
            }

            span.resultUnit {
              color: #666;
              font-size: 12px;
            }
          }
        }

        >li:nth-child(1) {
          >span.icon:nth-child(1) {
            background-image: url(../../../assets/img/energyManagement/electricity.png);
          }
        }

        >li:nth-child(2) {
          >span.icon:nth-child(1) {
            background-image: url(../../../assets/img/energyManagement/water.png);
          }
        }

        >li:nth-child(3) {
          >span.icon:nth-child(1) {
            background-image: url(../../../assets/img/energyManagement/hot.png);
          }
        }

        >li:nth-child(4) {
          >span.icon:nth-child(1) {
            background-image: url(../../../assets/img/energyManagement/air.png);
          }
        }
      }
    }
  }

  >.right_content {
    width: 50%;
    height: 100%;
    // overflow: hidden;
    margin-left: 20px;
  }

  .content_title {
    display: block;
    width: 223px;
    height: 25px;
    line-height: 25px;
    color: #313131;
    font-size: 14px;
    text-indent: 32px;
    background-image: url(../../../assets/img/energyManagement/title_bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    margin: 20px 0 10px 10px;
  }
}

section.top_right,
section.top_left {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  position: relative;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-size: auto 70%;
  border-radius: 8px;
}

.chart_box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
}

section.top_right {
  background-image: url(../../../assets/img/energyManagement/carbon_reduction.png);
}

section.top_left {
  background-image: url(../../../assets/img/energyManagement/carbon_emissions.png);
}

.content_total {
  text-align: center;
  font-weight: bold;
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  text-align: center;

  .content_num {
    color: #000;
    font-size: 30px;
    font-weight: 600;
  }

  .content_unit {
    color: #666;
    font-size: 14px;
  }
}

//
.curDivider {
  left: 13px;
  top: 3px;
}

.th-main-view {
  padding: 0;
}

::v-deep .el-form-item__label {
  font-weight: 600;
  color: #444;
  margin-right: 10px;
}

::v-deep .el-radio__label {
  color: #000 !important;
  font-weight: 600;
}

/* 改变选中时的文字颜色 */
::v-deep .el-radio__input.is-checked+.el-radio__label {
  color: #507CFF !important;
  font-weight: 600;
}

/* 鼠标悬浮时的外圈光晕（可选） */
::v-deep .el-radio__input.is-checked:hover .el-radio__inner {
  box-shadow: 0 0 6px 0 #507CFF;
  font-weight: 600;
}

// 时间选择器圆圈样式
::v-deep .el-radio__inner::after {
  width: 8px;
  height: 8px;
}
</style>