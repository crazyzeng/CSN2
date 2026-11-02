<!-- 冷站趋势图 -->

<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="冷站趋势图">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="日期">
            <el-radio-group v-model="timeType" @change="typeChange" class="custom_radio">
              <el-radio label="year">年</el-radio>
              <el-radio label="month">月</el-radio>
              <el-radio label="date">日</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=" ">
            <el-date-picker v-model="formData.queryDate" :type="timeType" :format="date_format" :value-format="value_format" placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </wl-main-title>
      <el-main>
        <section class="content_warp">
          <section class="top_box">
            <span class="content_title">{{ chartData[0].name }}</span>
            <line-chart :dataItem="chartData[0].value" :dateType="dateType" />
          </section>
          <section class="bottom_box">
            <span class="content_title">{{ chartData[1].name }}</span>
            <line-chart :dataItem="chartData[1].value" :dateType="dateType" />
          </section>
          <section class="bottom_box">
            <span class="content_title">{{ chartData[2].name }}</span>
            <line-chart :dataItem="chartData[2].value" :dateType="dateType" />
          </section>
        </section>
      </el-main>
    </section>
  </section>
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
.container_warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
}

#bar_chart,
#bar_chart1 {
  width: 100%;
  height: calc(100% - 37px);
}

.top_box,
.bottom_box {
  height: 400px;
  overflow: hidden;
}

.custom_radio {
  > .el-radio {
    color: #fff;
  }
}

.content_warp {
  height: auto;
  background: #1e2a45;
  width: calc(100% - 40px);
  margin-left: 20px;
  border-radius: 8px;
  padding-top: 30px;
  padding-left: 20px;
}

::v-deep.el-form-item {
  > .el-form-item__label {
    color: #fff;
  }
}

.el-form {
  margin: 0px 0 0 40px;
}
</style>
