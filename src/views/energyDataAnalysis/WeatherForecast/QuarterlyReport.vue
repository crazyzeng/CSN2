<template>
    <el-dialog :visible.sync="dialogVisible" title="" width="80%" style='background:#fff;'>
        <div ref='dialog' id='pdf_area'>
            <h1 class='text-center' style="padding-top: 5px;padding-bottom: 5px;">{{
                reportDetails.reportName }}</h1>
            <ul class="table-of-contents menu-container">
                <li v-for="section in sections" :key="section.title" @click.prevent="scrollToSection(section.ref)"
                    class="menu-item">
                    <a href="#">{{ section.title }}</a>
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
            <div class='flex justify-center my-10'>
                <XPieChart :chartData='reportDetails.elecSubList'></XPieChart>
            </div>

            <h3>1.6.3 2019年的旅客发送量情况</h3>
            <p>{{ reportDetails.touristData }}</p>
            <div class='flex justify-center my-10'>
                <ComboChart :chartData='reportDetails.touristDataDetail' />
            </div>
            <h3>1.6.4 2019年的天气情况</h3>
            <p>{{ reportDetails.weatherCase }}</p>
            <div class='flex justify-center my-10'>
                <HorizontalBarChart :weatherCaseList='reportDetails.weatherCaseList' />
            </div>
            <h2>1.7新增设备说明</h2>
            <p>{{ reportDetails.newDescription }}</p>
            <h1 id="section2" class="section">2. {{ reportDetails.monthStr }}能耗情况</h1>
            <h2>2.1 总体情况</h2>
            <p>{{ reportDetails.energyCase }}</p>
            <h2>2.2 数据对比情况</h2>
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
                    <div class="table-row" v-for="item in tbData" :key="item.time">
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
            <h2>2.3 逐月能耗对比分析</h2>
            <p>{{ reportDetails.chainRelative }}</p>
            <div class='flex justify-center my-10'>
                <div class="comparison-table">
                    <div class="table-row header">
                        <div class="cell">时间</div>
                        <div class="cell">用电量 (kWh)</div>
                        <div class="cell">发送旅客 (人次)</div>
                        <div class="cell">发送旅客人均用电量 (kWh)</div>
                        <div class="cell">2019年用电量 (kWh)</div>
                        <div class="cell">发送旅客 (人次)</div>
                        <div class="cell">节电量 (kWh)</div>
                        <div class="cell">节能率 (%)</div>
                        <div class="cell">发送旅客人均节电量 (kWh)</div>
                    </div>
                    <div class="table-row" v-for="item in reportDetails.hbDataDetail" :key="item.time">
                        <div class="cell">{{ item.time }}</div>
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
            <p style="text-align: center;"><span>本季度数据对比</span></p>
            <div class='flex justify-center'>
                <BarLineChart :chartData='comboChartData' />
            </div>
            <section v-for="(item, index) in equinoctialMonthDetail">
                <h2>{{ `2.${4 + index}` }} 本季度{{ item.month }}月能耗情况</h2>
                <h3>{{ `2.${4 + index}.${index + 1}` }} 总体情况</h3>
                <p>{{ item.ztqk }}</p>
                <h3>{{ `2.${4 + index}.${index + 2}` }} 数据对比情况</h3>
                <p>{{ item.sjdbqk }}</p>
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
                        <div class="table-row" v-for="listItem in item.list" :key="listItem.time">
                            <div class="cell">{{ listItem.time }}</div>
                            <div class="cell">{{ listItem.dataValue }}</div>
                            <div class="cell">{{ listItem.areaValue }}</div>
                            <div class="cell">{{ listItem.touristNumber }}</div>
                            <div class="cell">{{ listItem.touristAvgElec }}</div>
                            <div class="cell">{{ listItem.highSpecificDay }}</div>
                            <div class="cell">{{ listItem.specificDay }}</div>
                        </div>
                    </div>
                </div>
            </section>
            <h1 id="section3" class="section">3.2023年第四季度能耗分析</h1>
            <h2>3.1 设备类型能耗分析</h2>
            <p style="text-align: center;"><span>本季度设备类型能耗排名</span></p>
            <div class='flex justify-center my-10'>
                <SortBarChart :chartData="reportDetails.equipmentAnalyseDetail?.list" />
            </div>
            <p v-html="equipmenntAnalyse"></p>
            <h2>3.2 区域能耗分析</h2>
            <p style="text-align: center;"><span>本季度区域能耗排名</span></p>
            <div class='flex justify-center my-10'>
                <SortBarChart :chartData="reportDetails.areaAnalyseDetail?.list" />
            </div>
            <p v-html="areaAnalyse"></p>
            <h2>3.3 运行时长分析</h2>
            <p style="text-align: center;"><span>本季度运行时长分析</span></p>
            <div class='flex justify-center my-10'>
                <SortBarChart :chartData="reportDetails.runningAnalyseDetail?.list" :chartOverSize="true"
                    :yAxisName="'小时'" />
            </div>
            <p v-html="runningAnalyse"></p>
            <h1 id="section4" class="section">4.节能指标总结</h1>
            <p v-html="sumupAnalyse"></p>
            <el-button v-if="isExportBtnShow" @click="exportDialogAsImage(reportDetails.reportName)"
                style="margin-left: 10px;">导出</el-button>
        </div>
    </el-dialog>
</template>
<script>
import ComboChart from './chart/ComboChart.vue';
import BarLineChart from './chart/BarLineChart.vue';
import XBarChart from '@/views/energyDataAnalysis/WeatherForecast/chart/BarChart.vue';
import HorizontalBarChart from '@/views/energyDataAnalysis/WeatherForecast/chart/HorizontalBarChart.vue';
import XPieChart from '@/views/energyDataAnalysis/WeatherForecast/chart/pieChart.vue';
import MonthlyDataTable from '@/views/energyDataAnalysis/WeatherForecast/MonthlyDataTable.vue';
import SortBarChart from './chart/SortBarChart.vue'

import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { deepCopy } from '@/utils/index'

export default {
    components: { ComboChart, XBarChart, HorizontalBarChart, XPieChart, MonthlyDataTable, BarLineChart, SortBarChart },
    data() {
        return {
            dialogVisible: false,
            reportDetails: {},
            isExportBtnShow: true,
            sections: [
                { title: '1.项目情况', ref: 'section1' },
                { title: '2.季度能耗情况', ref: 'section2' },
                { title: '3.季度能耗分析', ref: 'section3' },
                { title: '4.节能指标总结', ref: 'section4' },
            ],
        }
    },
    computed: {
        sumupAnalyse() {
            return this.reportDetails.sumupAnalyse?.replace(/\r/g, '<br />')
        },
        equipmenntAnalyse() {
            return this.reportDetails.equipmentAnalyseDetail?.sblxStr.replace(/\n/g, '<br />')
        },
        areaAnalyse() {
            return this.reportDetails.areaAnalyseDetail?.qyStr.replace(/\n/g, '<br />')
        },
        runningAnalyse() {
            return this.reportDetails.runningAnalyseDetail?.yxscStr.replace(/\n/g, '<br />')
        },
        tbData() {
            if (Object.values(this.reportDetails).length > 0) return JSON.parse(this.reportDetails.tbData)
            else return []
        },
        comboChartData() {
            const tempObj = {}
            if (Object.values(this.reportDetails).length > 0) {
                tempObj.submeterDepict = JSON.parse(this.reportDetails.submeterDepict);
                tempObj.submeterData = JSON.parse(this.reportDetails.submeterData);
                return tempObj;
            } else return {}
        },
        equinoctialMonthDetail() {
            const tempArray = []
            if (Object.values(this.reportDetails).length > 0) {
                const tempObj = deepCopy(this.reportDetails.equinoctialMonthDetail)
                for (let key in tempObj) {
                    const tempObject = {
                        month: key,
                        list: [],
                        sjdbqk: '',
                        ztqk: ''
                    };
                    tempObject.list = JSON.parse(tempObj[key].list);
                    tempObject.sjdbqk = tempObj[key].sjdbqk;
                    tempObject.ztqk = tempObj[key].ztqk;
                    tempArray.push(tempObject);
                }
            }
            return tempArray;
        }
    },
    methods: {
        open(data) {
            this.dialogVisible = true;
            if (data && Object.keys(data).length > 0) this.reportDetails = data;
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
        scrollToSection(ref) {
            const sectionElement = this.$refs.dialog.querySelector(`#${ref}`);
            if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth' });
            }
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

.menu-item:nth-child(4)::after {
    border-color: transparent transparent transparent #c5e1fe;
    /* 第四个菜单项的三角渐变结束色 */
}
</style>
