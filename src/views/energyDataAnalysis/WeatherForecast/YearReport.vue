<template>
  <el-dialog :visible.sync="dialogVisible" title="" width="80%" style='background:#fff;'>
    <div ref='dialog' id='pdf_area'>
      <h1 class='text-center' style="padding-top: 5px;padding-bottom: 5px;">{{
        reportDetails.reportName }}</h1>
      <ul class="table-of-contents menu-container">
        <li v-for="section in sections" :key="section.title" class="menu-item">
          <a href="#" @click.prevent="scrollToSection(section.ref)">{{ section.title }}</a>
        </li>
      </ul>

      <h1 id="section1" class="section">1.项目背景</h1>
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
        <MonthlyDataTable :standardDataList='reportDetails.standardDataList' class='my-5'></MonthlyDataTable>
      </div>
      <h2>1.6 2019年用电量情况</h2>
      <h3>1.6.1 2019年用电量数据情况</h3>
      <p>{{ reportDetails.elecData }}</p>
      <div class='flex justify-center my-10'>
        <XBarChart :chartData="reportDetails.elecDataList" />
      </div>
      <h3>1.6.2 2019年用电分项数据情况</h3>
      <p>{{ reportDetails.elecSub }}</p>
      <div>
        <ElecSubDataTable :elecSubDataList='reportDetails.elecSubDetail' class='my-5'></ElecSubDataTable>
      </div>
      <div class='flex justify-center my-10'>
        <XPieChart :chartData='reportDetails.elecSubList'></XPieChart>
      </div>

      <h3>1.6.3 2019年的旅客发送量情况</h3>
      <p>{{ reportDetails.touristData }}</p>
      <div class='flex justify-center my-10'>
        <!-- <ComboChart :chartData='reportDetails.touristDataDetail' /> -->
        <ComboTable :chartData='reportDetails.touristDataDetail' />
      </div>
      <h3>1.6.4 2019年的天气情况</h3>
      <p>{{ reportDetails.weatherCase }}</p>
      <div class='flex justify-center my-10'>
        <!-- <HorizontalBarChart :weatherCaseList='reportDetails.weatherCaseList' /> -->
        <HorizontalBarTable :weatherCaseList='reportDetails.weatherCaseDetail' />
      </div>
      <h1 id="section2" class="section">2. {{ reportDetails.monthStr }}能耗总体情况</h1>
      <h2>2.1总体情况</h2>
      <p>{{ reportDetails.energyCase }}</p>
      <h2>2.2数据对比情况</h2>
      <p>{{ reportDetails.yearRelative }}</p>
      <div class='flex justify-center my-10'>
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
      <h2>2.3逐月能耗对比分析</h2>
      <p>{{ reportDetails.chainRelative }}</p>
      <div class='flex justify-center my-10'>
        <div class="comparison-table">
          <div class="table-row header">
            <div class="cell">月份</div>
            <div class="cell">{{ year }}年用电量 (kWh)</div>
            <div class="cell">发送旅客 (人次)</div>
            <div class="cell">发送旅客人均用电量 (kWh)</div>
            <div class="cell">2019年用电量 (kWh)</div>
            <div class="cell">发送旅客 (人次)</div>
            <div class="cell">节电量 (kWh)</div>
            <div class="cell">节能率 (%)</div>
            <div class="cell">发送旅客人均节电量 (kWh)</div>
          </div>
          <div class="table-row" v-for="item in reportDetails.hbDataDetail" :key="item.time">
            <div class="cell">{{ item.month }}</div>
            <div class="cell">{{ item.dataValue }}</div>
            <div class="cell">{{ item.touristNumber }}</div>
            <div class="cell">{{ item.touristAvgElec }}</div>
            <div class="cell">{{ item.tbDataValue }}</div>
            <div class="cell">{{ item.tbTouristNumber }}</div>
            <div class="cell">{{ item.savePower }}</div>
            <div class="cell">{{ item.tb }}</div>
            <div class="cell">{{ item.touristAvgSaveElec }}</div>
          </div>
        </div>
      </div>
      <div class='flex justify-center my-10'>
        <YearComboChart :chartData='reportDetails.hbDataDetail' />
      </div>
      <p>{{ reportDetails.submeterData }}</p>
      <h2>2.4节能效益分析</h2>
      <p>{{ reportDetails.submeterDepict }}</p>

      <h1 id="section3" class="section">3.年度能耗分析</h1>
      <h2>3.1设备类型能耗分析</h2>
      <h3 style="text-align: center;">{{ year }}年设备类型能耗排名</h3>
      <div class='flex justify-center my-10'>
        <YearBarChart :chartData="deviceTypeAnalyseData" :chartX="deviceTypeAnalyseName" :chartUnit="'kWh'" />
      </div>
      <p style="margin-bottom: 0;" v-html="equipmentAnalyseStr"></p>
      <p style="margin-bottom: 0;" v-for="item in reportDetails.equipmentAnalyseDetail?.detailStr">{{ item }}</p>
      <p v-html="equipmentAnalyseSuggest"></p>
      <h2>3.2区域能耗分析</h2>
      <h3 style="text-align: center;">{{ year }}年区域能耗排名</h3>
      <div class='flex justify-center my-10'>
        <YearBarChart :chartData="areaAnalyseData" :chartX="areaAnalyseName" :chartUnit="'kWh'" />
      </div>
      <p style="margin-bottom: 0;" v-html="areaAnalyseStr"></p>
      <p style="margin-bottom: 0;" v-for="item in reportDetails.areaAnalyseDetail?.detailStr">{{ item }}</p>
      <p v-html="areaAnalyseSuggest"></p>
      <h2>3.3运行时长分析</h2>
      <h3 style="text-align: center;">{{ year }}年设备类型运行时长排名</h3>
      <div class='flex justify-center my-10'>
        <YearBarChart :chartData="runningAnalyseData" :chartX="runningAnalyseName" :chartOverSize="true"
          :chartUnit="'小时'" />
      </div>
      <p style="margin-bottom: 0;" v-html="runningAnalyseStr"></p>
      <p style="margin-bottom: 0;" v-for="item in reportDetails.runningAnalyseDetail?.detailStr">{{ item }}</p>
      <p v-html="runningAnalyseSuggest"></p>
      <h2>3.4全年供冷供热量分析</h2>
      <h3 style="text-align: center;">{{ year }}年供冷供热量分析</h3>
      <div class='flex justify-center my-10'>
        <YearBarChart :chartData="systemAnalyseData" :chartX="systemAnalyseName" :chartUnit="'kWh'" />
      </div>
      <p v-html="systemAnalyseStr"></p>
      <h1 id="section4" class="section">4.节能指标总结分析</h1>
      <p v-html="sumupAnalyse"></p>
      <el-button v-if="isExportBtnShow" @click="exportDialogAsImage(reportDetails.reportName)"
        style="margin-left: 10px;">导出</el-button>
    </div>
  </el-dialog>
</template>
<script>
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

import HorizontalBarTable from '@/views/energyDataAnalysis/WeatherForecast/HorizontalBarTable.vue'
import ComboTable from '@/views/energyDataAnalysis/WeatherForecast/ComboTable.vue';
import ElecSubDataTable from '@/views/energyDataAnalysis/WeatherForecast/ElecSubDataTable.vue';
import MonthlyDataTable from '@/views/energyDataAnalysis/WeatherForecast/MonthlyDataTable.vue';
import BarChart from '@/views/energyDataManagement/carbonEmission/chart/BarChart.vue';
import XBarChart from '@/views/energyDataAnalysis/WeatherForecast/chart/BarChart.vue';
import XPieChart from '@/views/energyDataAnalysis/WeatherForecast/chart/pieChart.vue';
import ComboChart from '@/views/energyDataAnalysis/WeatherForecast/chart/ComboChart.vue';
import HorizontalBarChart from '@/views/energyDataAnalysis/WeatherForecast/chart/HorizontalBarChart.vue';
import YearComboChart from '@/views/energyDataAnalysis/WeatherForecast/chart/YearComboChart.vue';
import YearBarChart from '@/views/energyDataAnalysis/WeatherForecast/chart/YearBarChart.vue'

export default {
  name: 'YearReport',
  components: { HorizontalBarChart, ComboChart, XPieChart, XBarChart, BarChart, MonthlyDataTable, ElecSubDataTable, ComboTable, HorizontalBarTable, YearComboChart, YearBarChart },
  data() {
    return {
      dialogVisible: false,
      reportDetails: {},
      isExportBtnShow: true,
      sections: [
        { title: '1.项目背景', ref: 'section1' },
        { title: '2.年度能耗总体情况', ref: 'section2' },
        { title: '3.年度能耗分析', ref: 'section3' },
        { title: '4.节能指标总结', ref: 'section4' },
      ],
      deviceTypeAnalyseName: [],
      deviceTypeAnalyseData: [],
      areaAnalyseName: [],
      areaAnalyseData: [],
      runningAnalyseName: [],
      runningAnalyseData: [],
      systemAnalyseName: [],
      systemAnalyseData: [],
      year: '',
    }
  },
  computed: {
    sumupAnalyse() {
      return this.reportDetails.sumupAnalyse?.replace(/\r/g, '<br />')
    },
    equipmentAnalyseSuggest() {
      return this.reportDetails.equipmentAnalyseDetail?.suggest.replace(/\n/g, '<br />')
    },
    equipmentAnalyseStr() {
      return this.reportDetails.equipmentAnalyseDetail?.sblxStr.replace(/\n/g, '<br />')
    },
    areaAnalyseSuggest() {
      return this.reportDetails.areaAnalyseDetail?.suggest.replace(/\n/g, '<br />')
    },
    areaAnalyseStr() {
      return this.reportDetails.areaAnalyseDetail?.qyStr.replace(/\n/g, '<br />')
    },
    runningAnalyseSuggest() {
      return this.reportDetails.runningAnalyseDetail?.suggest.replace(/\n/g, '<br />')
    },
    runningAnalyseStr() {
      return this.reportDetails.runningAnalyseDetail?.yxscStr.replace(/\n/g, '<br />')
    },
    systemAnalyseStr() {
      return this.reportDetails.systemAnalyseDetail?.fxStr.replace(/\n/g, '<br />')
    }
  },
  methods: {
    scrollToSection(ref) {
      const sectionElement = this.$refs.dialog.querySelector(`#${ref}`);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    },
    open(data) {
      this.dialogVisible = true;
      if (data && Object.keys(data).length > 0) this.reportDetails = data;
      this.year = data.year
      this.deviceTypeAnalyseName = this.reportDetails?.equipmentAnalyseDetail?.list?.map(v => { return v.name });
      this.deviceTypeAnalyseData = this.reportDetails?.equipmentAnalyseDetail?.list?.map(v => { return v.dataValue });

      this.areaAnalyseName = this.reportDetails?.areaAnalyseDetail?.list?.map(v => { return v.name });
      this.areaAnalyseData = this.reportDetails?.areaAnalyseDetail?.list?.map(v => { return v.dataValue });

      this.systemAnalyseName = this.reportDetails?.systemAnalyseDetail?.list?.map(v => { return v.name });
      this.systemAnalyseData = this.reportDetails?.systemAnalyseDetail?.list?.map(v => { return v.dataValue });

      this.runningAnalyseName = this.reportDetails?.runningAnalyseDetail?.list?.map(v => { return v.name });
      this.runningAnalyseData = this.reportDetails?.runningAnalyseDetail?.list?.map(v => { return v.dataValue });

    },
    exportDialogAsImage(title) {
      let _this = this;
      _this.isExportBtnShow = false;
      domtoimage.toPng(document.getElementById('pdf_area'), {
        style: {
          'background-color': '#1E2A44',
          'padding': "0px"
        }
      })
        .then(function (dataUrl) {
          // 创建 jsPDF 实例
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
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
            pdf.addImage(dataUrl, 'PNG', x, y, imgScaledWidth, imgScaledHeight);
            // 下载 PDF
            pdf.save(`${title}.pdf`);
          };
          _this.isExportBtnShow = true;
        })
        .catch(function (error) {
          console.error('截图出错', error);
        });
    },
  }
}
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
  // text-indent: 25px;
}

#pdf_area {

  >ul,
  >p,
  >div,
  >h1,
  >h2,
  >h3 {
    padding: 0 10px;
  }
}
</style>
<style scoped>
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
  /* background: #1E2A44; */
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

.menu-item:nth-child(4) {
    background: linear-gradient(to right, #73beff, #c5e1fe);
}

.menu-item::after {
  content: '';
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
  border-color: transparent transparent transparent #E69A8D;
  /* 第一个菜单项的三角渐变结束色 */
}

.menu-item:nth-child(2)::after {
  border-color: transparent transparent transparent #6C5B7B;
  /* 第二个菜单项的三角渐变结束色 */
}

.menu-item:nth-child(3)::after {
  border-color: transparent transparent transparent #DBD5A4;
  /* 第三个菜单项的三角渐变结束色 */
}

.menu-item:nth-child(4)::after {
  border-color: transparent transparent transparent #c5e1fe;
  /* 第四个菜单项的三角渐变结束色 */
}
</style>