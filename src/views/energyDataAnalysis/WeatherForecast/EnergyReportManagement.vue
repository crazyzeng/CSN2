<!-- 能耗报告 -->
<template>
  <section class="container_warp h-full">
    <section class="container_box h-full">
      <!-- <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="能耗报告"> -->
      <el-form :model="formData" :inline="true" class="form-class">
        <el-form-item label="报告名称">
          <el-input v-model="formData.reportName" placeholder="请输入报告名称"></el-input>
        </el-form-item>
        <el-form-item label="报告类型">
          <el-select v-model="formData.reportType" placeholder="请选择">
            <el-option label="月报" value="month"></el-option>
            <el-option label="季报" value="qtr"></el-option>
            <el-option label="年报" value="year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="formData.publishTime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item style="margin-right: 0;float:right">
          <el-button plain type="primary" icon="el-icon-download" @click="handleBatchExport">批量导出</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->

      <el-dialog :visible.sync="dialogVisible" title="" width="80%" style='background:#fff;'>
        <div ref='dialog' id='test'>
          <h1 class='text-center' style="padding-top: 5px;padding-bottom: 5px;">{{
            reportDetails.reportName }}</h1>
          <ul class="table-of-contents menu-container">
            <li v-for="section in sections" :key="section.title" class="menu-item">
              <a href="#" @click.prevent="scrollToSection(section.ref)">{{ section.title }}</a>
            </li>
          </ul>

          <h1 id="section1" class="section">1.项目情况</h1>
          <h2>1.1 项目背景</h2>
          <p>{{ reportDetails.projectContext }}</p>
          <h2>1.2 项目范围</h2>
          <p>{{ reportDetails.projectScope }}</p>
          <h2>1.3当前数据来源</h2>
          <p>{{ reportDetails.dataSources }}</p>
          <h2>1.4 对比数据说明</h2>
          <p>{{ reportDetails.dataContrast }}</p>
          <h2>1.5 基准数据</h2>
          <p>{{ reportDetails.standardData }}</p>
          <div>
            <MonthlyDataTable :standardDataList="reportDetails.standardDataList" class="my-5"> </MonthlyDataTable>
          </div>
          <h2>1.6 2019年用电量情况</h2>
          <h3>1.6.1 2019年用电量数据情况</h3>
          <p>{{ reportDetails.elecData }}</p>
          <div class="flex justify-center my-10">
            <XBarChart :chartData="reportDetails.elecDataList" />
          </div>
          <h3>1.6.2 2019年用电分项数据情况</h3>
          <p>{{ reportDetails.elecSub }}</p>
          <div class="flex justify-center my-10">
            <XPieChart :chartData="reportDetails.elecSubList"></XPieChart>
          </div>

          <h3>1.6.3 2019年的旅客发送量情况</h3>
          <p>{{ reportDetails.touristData }}</p>
          <div class="flex justify-center my-10">
            <ComboChart :chartData="reportDetails.touristDataDetail" />
          </div>
          <h3>1.6.4 2019年的天气情况</h3>
          <p>{{ reportDetails.weatherCase }}</p>
          <div class="flex justify-center my-10">
            <HorizontalBarChart :weatherCaseList="reportDetails.weatherCaseList" />
          </div>
          <h2>1.7新增设备说明</h2>
          <p>{{ reportDetails.newDescription }}</p>
          <h1 id="section2" class="section">2.当月能耗情况</h1>
          <!-- <h2>2.1本年度9月度能源</h2> -->
          <h2>2.1 {{ reportDetails.monthStr }}能耗情况</h2>
          <p>2.1.1 总体情况</p>
          <p>{{ reportDetails.energyCase }}</p>
          <p>2.1.2 数据对比情况</p>
          <p>{{ reportDetails.chainRelative }}</p>
          <div class="flex justify-center my-10">
            <div class="comparison-table">
              <div class="table-row header">
                <div class="cell">时间</div>
                <div class="cell">用电量 (kWh)</div>
                <div class="cell">单位面积用电量 (kWh)</div>
                <div class="cell">发送旅客 (人次)</div>
                <div class="cell">发送旅客人均用电量 (kWh)</div>
                <div class="cell">高温天数 (天)</div>
                <div class="cell">低温天数 (天)</div>
              </div>
              <div class="table-row" v-for="item in reportDetails.hbDataDetail" :key="item.time">
                <div class="cell">{{ item.time }}</div>
                <div class="cell">{{ item.dataValue }}</div>
                <div class="cell">{{ item.areaValue }}</div>
                <div class="cell">{{ item.touristNumber }}</div>
                <div class="cell">{{ item.touristAvgElec }}</div>
                <div class="cell">{{ item.highSpecificDay }}</div>
                <div class="cell">{{ item.specificDay }}</div>
              </div>
            </div>
          </div>
          <p>{{ reportDetails.yearRelative }}</p>
          <div class="flex justify-center my-10">
            <div class="comparison-table">
              <div class="table-row header">
                <div class="cell">时间</div>
                <div class="cell">用电量 (kWh)</div>
                <div class="cell">单位面积用电量 (kWh)</div>
                <div class="cell">发送旅客 (人次)</div>
                <div class="cell">发送旅客人均用电量 (kWh)</div>
                <div class="cell">高温天数 (天)</div>
                <div class="cell">低温天数 (天)</div>
              </div>
              <div class="table-row" v-for="item in reportDetails.tbDataDetail" :key="item.time">
                <div class="cell">{{ item.time }}</div>
                <div class="cell">{{ item.dataValue }}</div>
                <div class="cell">{{ item.areaValue }}</div>
                <div class="cell">{{ item.touristNumber }}</div>
                <div class="cell">{{ item.touristAvgElec }}</div>
                <div class="cell">{{ item.highSpecificDay }}</div>
                <div class="cell">{{ item.specificDay }}</div>
              </div>
            </div>
          </div>
          <!-- <p>2.1.3分表数据情况</p>
                <p>{{ reportDetails.submeterDepict }}</p> -->
          <h1 id="section3" class="section">3.节能指标总结分析</h1>
          <p v-html="sumupAnalyse"></p>

          <el-button v-if="isExportBtnShow" @click="exportDialogAsImage(reportDetails.reportName)"
            style="margin-left: 10px">导出</el-button>
        </div>
      </el-dialog>
      <quarterly-report ref="quarterlyRef"></quarterly-report>
      <year-report ref="yearRef"></year-report>
      <!-- </wl-main-title> -->
      <!-- 数据表格 -->
      <div class="table_class">
        <el-table :data="tableData" height="calc(100vh - 220px)" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="80"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="reportName" label="能耗报告名称"></el-table-column>
          <el-table-column align="center" prop="reportDate" label="发布时间"></el-table-column>
          <el-table-column align="center" prop="reportType" label="报告类型">
            <template #default="{ row }">
              <span>{{ translateReportType(row.reportType) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template #default="{ row }">
              <el-link class="blue-link" @click="handleView(row)">查看</el-link>
              <!--<el-button type="text" icon="el-icon-download" @click="handleView(row)">导出</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" layout="total,prev,pager,next,jumper" :total="total">
        </el-pagination>
      </div>
    </section>
  </section>
</template>

<script>
import { getEnergyReportById, getEnergyReportPage } from "./api";

import MonthlyDataTable from "@/views/energyDataAnalysis/WeatherForecast/MonthlyDataTable.vue";
import BarChart from "@/views/energyDataManagement/carbonEmission/chart/BarChart.vue";
import XBarChart from "@/views/energyDataAnalysis/WeatherForecast/chart/BarChart.vue";
import XPieChart from "@/views/energyDataAnalysis/WeatherForecast/chart/pieChart.vue";
import ComboChart from "@/views/energyDataAnalysis/WeatherForecast/chart/ComboChart.vue";
import HorizontalBarChart from "@/views/energyDataAnalysis/WeatherForecast/chart/HorizontalBarChart.vue";
import QuarterlyReport from "./QuarterlyReport.vue";
import YearReport from "./YearReport.vue";

import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

export default {
  name: "EnergyReportManagement",
  components: { HorizontalBarChart, ComboChart, XPieChart, XBarChart, BarChart, MonthlyDataTable, QuarterlyReport, YearReport },
  data() {
    return {
      formData: { reportName: "", reportType: "", publishTime: "" },
      tableData: [],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      reportDetails: {},
      sections: [
        { title: "1.项目情况", ref: "section1" },
        { title: "2.当月能耗情况", ref: "section2" },
        { title: "3.节能指标总结分析", ref: "section3" },
      ],
      isExportBtnShow: true,
    };
  },
  computed: {
    sumupAnalyse() {
      return this.reportDetails.sumupAnalyse?.replace(/\r/g, "<br />");
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    scrollToSection(ref) {
      const sectionElement = this.$refs.dialog.querySelector(`#${ref}`);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    query() {
      getEnergyReportPage({
        reportName: this.formData.reportName,
        reportType: this.formData.reportType,
        releaseTime: this.formData.publishTime,
        pageNo: this.currentPage, // 默认第一页
        pageSize: 10, // 默认页面大小
      }).then((response) => {
        if (response.code === 200) {
          this.tableData = response.data.records;
          this.total = response.data.total;
        }
      });
    },
    reset() {
      this.formData.reportName = "";
      this.formData.reportType = "";
      this.formData.publishTime = "";
      this.currentPage = 1;
      this.query();
    },
    handleBatchExport() {
      // 批量导出逻辑
    },
    exportDialogAsImage(title) {
      let _this = this;
      _this.isExportBtnShow = false;
      domtoimage
        .toPng(document.getElementById("test"), {
          style: {
            "background-color": "#1E2A44",
            padding: "0px",
          },
        })
        .then(function (dataUrl) {
          // 创建 jsPDF 实例
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
          });

          // 获取图片的尺寸
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            // 计算 PDF 中图片的位置和尺寸
            const imgWidth = img.width;
            const imgHeight = img.height;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;
            const x = (pageWidth - imgScaledWidth) / 2;
            const y = (pageHeight - imgScaledHeight) / 2;

            // 将图片添加到 PDF 中
            pdf.addImage(dataUrl, "PNG", x, y, imgScaledWidth, imgScaledHeight);
            // 下载 PDF
            pdf.save(`${title}.pdf`);
          };
          _this.isExportBtnShow = true;
        })
        .catch(function (error) {
          console.error("截图出错", error);
        });
    },
    handleView(row) {
      getEnergyReportById(row.id).then((response) => {
        if (response.code === 200) {
          this.reportDetails = response.data;
          if (row.reportType === "month") this.dialogVisible = true;
          else if (row.reportType === "qtr") this.$refs.quarterlyRef?.open(this.reportDetails);
          else this.$refs.yearRef?.open(this.reportDetails);
        }
      });
    },
    handleExport(row) {
      // 导出单个报告的逻辑
    },
    handleSelectionChange(selected) {
      this.selectedRows = selected;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.query();
    },
    translateReportType(value) {
      const types = {
        month: "月报",
        qtr: "季报",
        year: "年报",
      };
      return types[value] || value;
    },
  },
};
</script>

<style scoped lang="scss">
/* 在这里添加您的样式 */
h1 {
  font-size: 24px;
  /* 设置标题的字体大小 */
  font-weight: bold;
  /* 加粗 */
  margin-bottom: 16px;
  /* 设置标题下方的间距 */
  color: #333;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 14px;
  color: #333;
}

h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

p {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

#test {
  padding-right: 10px;

  >ul,
  >p,
  >div,
  >h1,
  >h2,
  >h3 {
    padding-left: 10px;
  }
}
</style>

<style lang="scss" scoped>
.custom-table {
  display: table;
  width: 100%;
  background-color: #cde1f7;
}

.table-row {
  display: table-row;
}

.header {
  font-weight: bold;
  background-color: #cde1f7;
}

.cell {
  display: table-cell;
  padding: 10px;
  border: 1px solid #ffffff;
  /* White border for the cells */
  color: #333;
  /* White text color */
}

.table-of-contents {
  list-style-type: none;
  padding: 0;
}

.table-of-contents li {
  margin-bottom: 10px;
}

.table-of-contents a {
  color: #333;
  cursor: pointer;
  width: 180px;
  display: block;
  height: 41px;
  line-height: 41px;
  margin-left: 15px;
}

.section {
  padding: 10px 0;
}

.menu-container {
  width: 200px;
  // background: #1e2a44;
  border-radius: 10px;
  padding: 10px;
  //   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  position: relative;
}

.menu-item {
  color: #333;
  position: relative;
  margin-bottom: 5px;
  cursor: pointer;
}

.menu-item:nth-child(1) {
  background: linear-gradient(to right, #cfbafd, #ffc2b7);
}

.menu-item:nth-child(2) {
  background: linear-gradient(to right, #a2d3fd, #e5c8fe);
}

.menu-item:nth-child(3) {
  background: linear-gradient(to right, #b4facb, #f8f0b8);
}

.menu-item::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -20px;
  /* 控制三角形的位置 */
  transform: translateY(-50%);
  border-style: solid;
  border-width: 20px 0 20px 20px;
  border-color: transparent transparent transparent #333;
}

.menu-item:nth-child(1)::after {
  border-color: transparent transparent transparent #ffc2b7;
  /* 第一个菜单项的三角渐变结束色 */
}

.menu-item:nth-child(2)::after {
  border-color: transparent transparent transparent #e5c8fe;
  /* 第二个菜单项的三角渐变结束色 */
}

.menu-item:nth-child(3)::after {
  border-color: transparent transparent transparent #f8f0b8;
  /* 第三个菜单项的三角渐变结束色 */
}

// 
.form-class {
  margin-left: 40px;
}

.table_class {
  width: 100%;
  height: calc(100% - 47px);
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
}
</style>
