<!--  -->
<template>
  <!-- <wl-main-container data-title="舒适度监测">
        <div class="top_block"></div>
    </wl-main-container> -->
  <div>
    <iframe src="/comfortableTools/index.html" ref="iframe" width="100%" height="1000px" scrolling="no"></iframe>
  </div>
</template>

<script>
import lineChart from './lineChart.vue';

export default {
  components: { lineChart },
  data() {
    return {
      queryFormData: { orgName: '', },
      areaList: [
        { name: '区域1', value: '1' },
        { name: '区域2', value: '2' },
        { name: '区域3', value: '3' },
        { name: '区域4', value: '4' },
        { name: '区域5', value: '5' },
      ],
      select_form: {
        metabolic_rate: '',
      },
      air_temperature: 1000,
      radiation_temperature: 1000,
      wind_speed: 1000,
      air_humidity: 1000,
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData();
    },
    getData() { },
    //查询
    handleTableFormQuery() { },
    //重置
    handleQueryFormReset() { },
  },
};
</script>
<style lang="scss" scoped>
iframe {
  border: none;
}

::v-deep {
  .th-container-view {
    padding-top: 15px;
  }

  .el-button--primary:hover,
  .el-button--primary:focus {
    border-color: transparent !important;
    background-color: #2a3e62;
  }

  .top_btn {

    .el-button--primary:hover,
    .el-button--primary:focus {
      border-color: transparent !important;
    }
  }

  .el-main {
    overflow: hidden;
    min-height: 715px;
  }

  .select_form {
    .el-form-item--mini .el-form-item__label {
      font-size: 16px;
    }

    .el-input>.el-input__inner {
      border-radius: 0;
      width: 280px;
      height: 32px;
      border: 1px transparent solid;
      border-image: linear-gradient(to right, #0fefff, #0088d6) 1 10;
    }
  }
}

.top_block {
  width: 4px;
  height: 20px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  top: 31px;
  left: 20px;
}

.top_btn {
  position: absolute;
  top: 25px;
  left: 200px;
  background: transparent;

  .operation_btn {
    margin-left: 50px;
  }
}

.left_top,
.left_bot {
  width: 550px;
  height: 370px;
  background: #1e2a45;
  box-shadow: 4px 4px 7px 0px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.left_title {
  position: relative;
  top: 30px;
  left: 35px;

  span {
    position: absolute;
    left: 16px;
    top: 3px;
    font-size: 18px;
    font-weight: bold;
  }
}

.row1 {
  margin-top: 68px;
}

.row1,
.row2 {
  .text_block {
    position: relative;

    .inner_title {
      color: #57eeff;
      font-size: 14px;
      position: absolute;
      top: 7px;
      left: 17px;
    }

    .environment_num {
      width: 180px;
      height: 36px;
      background-color: #1f4670;
      color: #fff;
      text-align: center;
      line-height: 36px;
      font-size: 28px;
      position: absolute;
      top: 30px;
      left: 37px;
    }
  }
}

.row2 {
  margin-top: 68px;
}

.left_bot {
  .select_form {
    margin-top: 88px;
    display: flex;
    justify-content: center;
  }

  .cloth {
    margin-top: 105px;
  }
}

/*select_inner_color*/
.select_inner_color {
  color: #0088D6;
}

.select_inner_color.el-select-dropdown__item.hover {
  background-color: #0088D6;
  border-radius: 50px;
  color: #fff;
}

.main {
  width: 100%;
  // height: calc(100% - 15px);
  min-height: 745px;
  background: #1e2a45;
  box-shadow: 4px 4px 7px 0px rgba(0, 0, 0, 0.3);
  border-radius: 10px;

  .top_table {
    height: 100px;
    margin: 30px 30px 0 30px;
    background-color: #1f4670;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;

    .container {
      width: 25%;
      display: flex;
      justify-content: center;
    }

    .container:not(:last-child) {
      border-right: 1px solid #fff;
      border-image: -webkit-linear-gradient(#0088d6, #0fefff) 10 10;
      border-image: -moz-linear-gradient(#0088d6, #0fefff) 10 10;
      border-image: -o-linear-gradient(#0088d6, #0fefff) 10 10;
      border-image: linear-gradient(#0088d6, #0fefff) 10 10;
    }

    .container p:first-child {
      color: #57eeff;
    }

    .container p:nth-child(2) {
      font-size: 28px;
      margin-top: 15px;
    }

    .punctuation {
      font-size: 18px;
    }
  }

  .chart_info {
    width: 265px;
    height: 226px;
    background: rgba(31, 70, 112, 0.42);
    border-radius: 4px;
    margin: 35px 0 0 30px;

    .chart_info_left .block {
      display: inline-block;
      position: relative;
      width: 12px;
      height: 3px;
      background-color: #9f80f5;
      bottom: 4px;
      right: 5px;
    }

    .chart_info_left,
    .chart_info_right {
      float: left;
    }

    .chart_info_left p,
    .chart_info_right p {
      height: 30px;
      line-height: 30px;
      margin-top: 5px;
    }

    .chart_info_left {
      margin-left: 34px;

      p span:nth-child(2) {
        font-size: 20px;
      }

      p span:nth-child(3) {
        font-size: 14px;
      }
    }

    .chart_info_right {
      font-size: 20px;
      margin-left: 24px;
    }
  }
}

.lineChart {
  height: 550px;
}
</style>
