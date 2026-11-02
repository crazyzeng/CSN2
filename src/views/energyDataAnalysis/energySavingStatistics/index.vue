<!-- 节能统计 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="节能统计">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="时间">
            <el-radio-group v-model="formData.radioType" @change="radioChange">
              <el-radio label="continuous">连续</el-radio>
              <el-radio label="year">年</el-radio>
              <el-radio label="month">月</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="formData.time" :type="formData.timeType" :format="timeFormat" placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="margin-right: 0;float:right">
            <el-button type="primary" class="exportBtn" icon="iconfont icon-daochu" @click="exportExl">导出</el-button>
            <el-button type="primary" class="valuationBtn" icon="iconfont icon-jijiaguize"
              @click="valuation">计价</el-button>
          </el-form-item>
        </el-form>
      </wl-main-title>
      <el-main>
        <section class="main_content">
          <section class="left_wrap">
            <el-radio-group v-model="tabPosition">
              <el-radio-button label="0" class="tabButton">电 <span class="tabIcon iconfont icon-goumai-shandian"></span>
              </el-radio-button>
              <el-radio-button label="1" class="tabButton">水 <span
                  class="tabIcon iconfont icon-lushuixian"></span></el-radio-button>
              <el-radio-button label="2" class="tabButton">热 <span
                  class="tabIcon iconfont icon-sen018"></span></el-radio-button>
              <el-radio-button label="3" class="tabButton">气 <span
                  class="tabIcon iconfont icon-shouye-keranqitijiancebaojingxitong1"></span></el-radio-button>
            </el-radio-group>
          </section>
          <section class="right_warp">
            <!-- 表格 -->
            <section id="left_table">
              <el-table :data="tableData" min-height="580px" style="width: 100%" class="left-table-class">
                <el-table-column align="center" prop="year" label="年度" min-width="150"></el-table-column>
                <el-table-column  align="center" prop="month" label="月份" min-width="150"></el-table-column>
                <el-table-column align="center" prop="date" label="日期" min-width="150"></el-table-column>
                <el-table-column label="配送信息" align="center">
                  <el-table-column align="center" prop="name" label="尖" min-width="120"></el-table-column>
                  <el-table-column align="center" prop="province" label="峰" min-width="120"></el-table-column>
                  <el-table-column align="center" prop="city" label="平" min-width="120"></el-table-column>
                  <el-table-column align="center" prop="zip" label="谷" min-width="120"></el-table-column>
                </el-table-column>
                <el-table-column align="center" prop="" label="小计" min-width="150"></el-table-column>
              </el-table>
            </section>
            <section id="right_content_wrap">
              <!-- 饼图 -->
              <section id="right_content"></section>
              <section class="numberTitle">
                <p><span class="totalNum">1000</span><span class="totalUnit">万元</span></p>
                <p><span class="tTitle">合计节能费用(电度电费)</span></p>
              </section>
            </section>
          </section>
        </section>
        <add-price v-show="modal.flag" :data-title="modal.title" :data-flag="modal.flag" :data-list="tableData"
          :data-id="modal.id" :disabled="modal.disabled" @close="close" @submit="submit" />
      </el-main>
    </section>
  </section>
</template>

<script>
import AddPrice from './AddPrice.vue';
export default {
  components: { AddPrice },
  data() {
    return {
      tabPosition: '0',
      formData: {
        time: '',
        radioType: "month",
        timeType: 'month',
      },
      modal: {
        flag: false,
        title: "",
        id: "",
        disabled: false
      },
      timeFormat: 'yyyy-MM',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ],
      pieOption: {
        title: {
          text: `${1000}kw/h\n合计节能量`,
          top: 'center',
          left: '47%',
          textAlign: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        color: ['#ff907f', '#fcd97e', '#bf86fc', '#73bbff'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              normal: {
                show: true,
                position: 'inner',
                formatter: function (v) {
                  return `${v.name}\n${v.data.value}%`
                },
                // formatter:function(v){
                //     return `${1000}kWh\n合计节能量`
                // },
                textStyle: {
                  fontSize: 20,
                  color: '#fff',
                }
              }
            },
            itemStyle: {
              borderRadius: 0,
              borderColor: '#1e2a45',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '尖' },
              { value: 735, name: '峰' },
              { value: 484, name: '谷' },
              { value: 300, name: '平' }
            ],
            radius: ['45%', '75%']
          }
        ]
      },
    };
  },
  computed: {},
  filters: {},
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData();
      this.drawPie();
    },
    drawPie() {
      let pie_chart = this.$echarts.init(document.getElementById('right_content'));
      pie_chart.setOption(this.pieOption);
    },
    //查询
    query() { },
    //重置
    reset() { },
    close() {
      this.modal.flag = false;
      this.modal.title = "";
      this.modal.id = "";
      this.modal.disabled = false;
    },

    submit() {
      this.close();
      this.getData({});
    },
    //导出
    exportExl() { },
    //计价
    valuation() {
      this.modal.flag = true;
    },
    getData() { },
    radioChange(e) {
      if (e === 'month') {
        this.formData.timeType = 'month';
        this.timeFormat = 'yyyy-MM';
      } else {
        this.formData.timeType = 'year';
        this.timeFormat = 'yyyy';
      }
    }
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
::v-deep .el-radio {
  color: #fff !important;
}

::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

::v-deep.el-form {
  // margin: 15px 0 0 40px;
  // height: 60px;
  // line-height: 60px;

  .el-form-item:nth-child(1) {
    margin-left: 40px;
  }

  .el-form-item:nth-child(2) {
    margin-right: 20px;
  }

  .el-form-item:last-child {
    margin-left: 240px;
    .el-form-item__content{
      display: flex;
    }
  }

  // .el-form-item {
  //   height: 60px;

  //   .el-form-item__content {
  //     height: 100%;
  //     line-height: 60px;
  //   }
  // }
}

.container_warp {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.container_box {
  height: 100%;
  min-width: 1740px;
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
  overflow: hidden;
}

.exportBtn,
.valuationBtn {
  width: 80px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e446b;
  display: flex;
    justify-content: space-between;
    align-items: center;
}

.valuationBtn {
  width: 80px;
  height: 30px;
}

::v-deep.el-radio-group {
  // margin: 0px 0;

  >.el-radio-button:nth-child(1) {
    .el-radio-button__inner {
      //  border-image: linear-gradient(to top, #00bae0, #00ebcc) 1;
      // border: 2px solid;
      border-image: linear-gradient(to top, #00bae0, #00ebcc) 1;
      clip-path: inset(0 round 3px);
    }
  }

  >.el-radio-button:nth-child(1).is-active .el-radio-button__inner {
    background-image: linear-gradient(to left, #00bae0, #00ebcc);
  }

  >.el-radio-button:nth-child(2) {
    .el-radio-button__inner {
      //  border: 2px solid;
      border-image: linear-gradient(to top, #597ffb, #22d0e7) 1;
      clip-path: inset(0 round 3px);
    }
  }

  >.el-radio-button:nth-child(2).is-active .el-radio-button__inner {
    background-image: linear-gradient(to left, #597ffb, #22d0e7);
  }

  >.el-radio-button:nth-child(3) {
    .el-radio-button__inner {
      //  border: 2px solid;
      border-image: linear-gradient(to top, #f898cf, #f9bfa4) 1;
      clip-path: inset(0 round 3px);
    }
  }

  >.el-radio-button:nth-child(3).is-active .el-radio-button__inner {
    background-image: linear-gradient(to left, #f898cf, #f9bfa4);
  }

  >.el-radio-button:nth-child(4) {
    .el-radio-button__inner {
      //  border: 2px solid;
      border-image: linear-gradient(to top, #7e53ed, #bba7ee) 1;
      clip-path: inset(0 round 3px);
    }
  }

  >.el-radio-button:nth-child(4).is-active .el-radio-button__inner {
    background-image: linear-gradient(to left, #7e53ed, #bba7ee);
  }

  >.el-radio-button:nth-child(n+2) {
    margin-left: 15px;

    .el-radio-button__inner {
      border-left: 1px solid;
    }
  }

  .el-radio-button__inner {
    width: 100%;
    height: 100%;
    line-height: 46px;
    padding: 0;
    background-color: transparent;
    color: #fff;
    font-size: 20px;
  }
}

::v-deep.el-table {
  .el-table__cell {
    border: none;
  }
}

.main_content {
  width: 100%;
  height: 100%;
  padding: 0 20px !important;
.left_wrap{
  margin-bottom: 15px;
}
  #top_content {
    width: 1740px;
    height: 350px;
  }

  .bottom_content {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }

  .tabButton {
    width: 100px;
    height: 46px;
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
    width: 100%;
    height: 350px;
  }

  .right_warp {
    display: flex;
    // justify-content: space-between;
  }

  section.left_warp,
  section.right_warp,
  .top_wrap {
    // background-color: #1e2a45;
    
    border-radius: 6px;
    box-shadow: 6px 6px 8px 0px rgb(0 0 0 / 20%);
  }

  #left_table {
    // width: calc(100% - 480px);
    width: 100%;
    // width: 66%;
    margin-right: 20px;
    height: 580px;
    .left-table-class{
      height: calc(100vh - 225px);
    }
  }

  #left_content {
    width: 860px;
    height: 290px;
  }

  #right_content_wrap {
    background-color: #1e2a45;
    width: 460px;
    height: 580px;
    border-radius: 8px;
    height: calc(100vh - 225px);
    #right_content {
      width: 460px;
      height: 500px;
    }
  }

  section.numberTitle {
    span.totalNum {
      font-size: 30px;
      font-weight: bold;
    }

    text-align: center;
  }

  .tabIcon {
    font-size: 30px;
  }
}
.icon-shouye-keranqitijiancebaojingxitong1{
transform: rotate(-90deg);
display: inline-block;
}
</style>