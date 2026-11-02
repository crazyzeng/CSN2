<!-- 冷站趋势图 -->
<template>
  <div class="code_station_trend">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="时间" class="ml-5">
        <el-select class="time_type" v-model="timeType" placeholder="请选择时间类型"  @change="typeChange">
          <el-option :label="'年'" :value="'year'"></el-option>
          <el-option :label="'月'" :value="'month'"></el-option>
          <el-option :label="'日'" :value="'date'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="ml-2" prop="select">
        <el-date-picker v-model="formData.queryDate" :type="timeType" :format="date_format"
          :value-format="value_format" placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="ml-2">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="echars_box">
      <div class="content_title">武广冷站离心机COP</div>
      <lineChart :dataItem="chartData[0].value" :dateType="dateType"  :dateColor="'#D6E9A8'"></lineChart>
    </div>
    <div class="echars_box">
      <div class="content_title">沪昆冷站离心机COP</div>
      <lineChart :dataItem="chartData[1].value" :dateType="dateType"  :dateColor="'#FFECC2'"></lineChart>
    </div>
    <div class="echars_box">
      <div class="content_title">长沙南站离心机COP</div>
      <lineChart :dataItem="chartData[2].value" :dateType="dateType"  :dateColor="'#DFCEFF'"></lineChart>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import lineChart from "./components/lineChart.vue";
import { getColdStationTrend } from "@/api/cold-station";

export default {
  components: {
    lineChart,
  },
  data() {
    return {
      timeType: "date",
      date_format: "yyyy-MM-dd",
      value_format: "yyyy-MM-dd",
      formData: {
        dateType: "day",
        queryDate: dayjs(new Date()).format("YYYY-MM-DD"),
      },
      chartData: [
        { name: "武广冷站cop", value: [1000, 2000, 3000, 4000, 3500, 3000] },
        { name: "沪昆冷站cop", value: [1000, 2000, 3000, 4000, 3500, 3000] },
        { name: "长沙南站冷热源系统cop", value: [2000, 4000, 6000, 8000, 7000, 6000] },
      ],
      dateType: "date",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    typeChange() {
      if (this.timeType === "month") {
        this.formData.queryDate = dayjs(new Date()).format("YYYY-MM");
        this.formData.dateType = "month";
        this.date_format = "yyyy-MM";
        this.value_format = "yyyy-MM";
      } else if (this.timeType === "date") {
        this.formData.queryDate = dayjs(new Date()).format("YYYY-MM-DD");
        this.formData.dateType = "day";
        this.date_format = "yyyy-MM-dd";
        this.value_format = "yyyy-MM-dd";
      } else {
        this.formData.queryDate = dayjs(new Date()).format("YYYY");
        this.formData.dateType = "year";
        this.date_format = "yyyy";
        this.value_format = "yyyy";
      }
    },
    //查询
    query() {
      this.dateType = this.timeType;
      this.getData();
    },
    //重置
    reset() {
      this.formData.queryDate = dayjs(new Date()).format("YYYY-MM-DD");
      this.formData.dateType = "day";
      this.timeType = "date";
      this.dateType = "date";
      this.date_format = "yyyy-MM-dd";
      this.value_format = "yyyy-MM-dd";
      this.getData();
    },

    // 获取数据
    getData() {
      getColdStationTrend(this.formData).then((res) => {
        this.chartData.forEach((item, index) => {
          item.name = Object.keys(res.data)[index];
          item.value = res.data[item.name];
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.code_station_trend {
  width: 100%;
  height: 100%;
  position: relative;
  color: #000;

  .echars_box {
    height: calc(33.3% - 25.5px);
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 10px;
    position: relative;

    .content_title {
      width: 223px;
      height: 25px;
      line-height: 25px;
      color: #313131;
      font-size: 14px;
      text-indent: 35px;
      background-image: url(../../../assets/img/energyManagement/title_bg.png);
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      top: 10px;
      left: 15px;
    }
  }
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
