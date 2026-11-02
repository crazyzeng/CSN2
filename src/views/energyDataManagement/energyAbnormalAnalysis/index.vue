<!-- 能耗异常分析 -->

<template>
    <section class="container_warp">
        <section class="container_box">
            <!-- <el-divider class="curDivider" direction="vertical" />
            <wl-main-title data-title="能耗异常分析"> </wl-main-title> -->
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <!-- <el-form-item label="" class="ml-5">
                        <el-radio-group v-model="formData.type">
                            <el-radio-button label="WG" value="WG">武广</el-radio-button>
                            <el-radio-button label="HK" value="HK">沪昆</el-radio-button>
                        </el-radio-group>
                    </el-form-item> -->
                <el-form-item label="时间" class="ml-5">
                    <el-select class="time_type" v-model="dateType" placeholder="请选择时间类型" @change="timeTypeChange">
                        <el-option :label="'年'" :value="'year'"></el-option>
                        <el-option :label="'月'" :value="'month'"></el-option>
                        <el-option :label="'日'" :value="'day'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" class="ml-2" prop="select">
                    <el-date-picker v-model="formData.date" :type="periodTimeType" :format="datePickFormat"
                        :value-format="datePickFormat" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="ml-2">
                    <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
                <el-form-item style="margin-right: 0; float: right">
                    <el-button type="primary" icon="el-icon-upload2" @click="exportData">导出</el-button>
                </el-form-item>
            </el-form>
            <!---->

            <div class="chartContainer">
                <div class="chartTitle">
                    {{ dateType == 'year' ? '年' : dateType == 'month' ? '月' : '日' }}对比分析
                </div>
                <div class="lineChart">
                    <analysisChart :chart-data="chartData" :date-type="dateType" :x-axis="chartAxis"></analysisChart>
                </div>
            </div>

            <div class="chartContainer">
                <div class="chartTitle">
                    环境参数对比
                </div>
                <div class="lineChart">
                    <div class="select_radio">
                        <el-radio-group v-model="lineType">
                            <el-radio-button label="温度">温度</el-radio-button>
                            <el-radio-button label="湿度">湿度</el-radio-button>
                        </el-radio-group>
                    </div>
                    <paramCompareChart :chart-data="envData" :date-type="dateType" :x-axis="chartAxis"
                        :line-type="lineType"></paramCompareChart>
                </div>
            </div>

            <div class="results">
                <div class="title">总结：</div>
                <div>
                    <p>1. 本期能耗：<span class="num">{{ summary.currentTotal }}</span>kWh，上期能耗：<span class="num">{{
                        summary.compareTotal }}</span>kWh，本期比上期耗电量<span class="num">{{ summary.diff == 0 ? '持平' :
                            (summary.diff > 0 ? '高' : '低') + Math.abs(summary.diff) }}</span>kWh。</p>
                    <p>2. 本期环境参数：温度<span class="num">{{ summary.currentTemperature }}</span>℃ 、湿度<span class="num">{{
                        summary.currentHumidity }}</span>%</p>
                    <p style="margin-left: 45px">上期环境参数：温度<span class="num">{{ summary.compareTemperature }}</span>℃
                        、湿度<span class="num">{{ summary.compareHumidity }}</span>%</p>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import dayjs from 'dayjs';
import analysisChart from './charts/analysisChart.vue';
import paramCompareChart from './charts/paramCompareChart.vue';
import { getAbnormalAnalysis, exportAbnormalAnalysis } from '@/api/energyManagement';

export default {
    components: {
        analysisChart,
        paramCompareChart,
    },
    data() {
        return {
            datePickFormat: 'yyyy-MM',
            periodTimeType: 'month',
            dateType: 'month',
            formData: {
                // type: 'WG',
                date: dayjs(new Date()).format('YYYY-MM'),
            },
            chartAxis: [],
            chartData: {},
            envData: {},
            lineType: '温度',
            summary: {
                compareHumidity: 0,
                compareTemperature: 0,
                compareTotal: 0,
                currentHumidity: 0,
                currentTemperature: 0,
                currentTotal: 0,
                diff: 0,
            },
        };
    },
    created() {
        this.query();
    },
    methods: {
        // 时间类型改变
        timeTypeChange(data) {
            if (data === 'year') {
                this.periodTimeType = 'year';
                this.datePickFormat = 'yyyy';
                this.formData.date = dayjs(new Date()).format('YYYY');
            } else if (data === 'month') {
                this.periodTimeType = 'month';
                this.datePickFormat = 'yyyy-MM';
                this.formData.date = dayjs(new Date()).format('YYYY-MM');
            } else if (data === 'day') {
                this.periodTimeType = 'date';
                this.datePickFormat = 'yyyy-MM-dd';
                this.formData.date = dayjs(new Date()).format('YYYY-MM-DD');
            }
        },

        // 查询
        query() {
            getAbnormalAnalysis(this.formData).then((res) => {
                if (res.code === 200) {
                    this.chartData = res.data.energyData;
                    this.chartAxis = res.data.energyData.labels;
                    this.envData = res.data.envData.data;
                    this.summary = res.data.summary;
                }
            });
        },

        // 重置
        reset() {
            this.datePickFormat = 'yyyy-MM';
            this.periodTimeType = 'month';
            this.dateType = 'month';
            this.formData.date = dayjs(new Date()).format('YYYY-MM');
            this.query();
        },

        // 导出
        exportData() {
            exportAbnormalAnalysis(this.formData).then((res) => {
                let data = res;
                console.log(res);
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `能耗异常分析报表.xls`);
                document.body.appendChild(link);
                link.click();
            });
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep ::-webkit-scrollbar {
    display: block;
}

::v-deep.time_type .el-input__inner {
    width: 100px !important;
}

.container_warp {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.container_box {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.chartContainer {
    position: relative;
    // margin-bottom: 10px;
    flex: 1;

    .chartTitle {
        position: absolute;
        top: 12px;
        left: 25px;
        width: 223px;
        height: 25px;
        line-height: 25px;
        color: #313131;
        font-size: 14px;
        text-indent: 35px;
        background-image: url(../../../assets/img/energyManagement/title_bg.png);
        background-size: contain;
        background-repeat: no-repeat;
    }

    .lineChart {
        height: calc(100% - 15px);
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);

        .select_radio {
            position: absolute;
            top: 15px;
            right: 45%;
            z-index: 10;
        }
    }
}

.results {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    padding: 15px;
    flex-shrink: 0;

    .title {
        color: #333;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
        margin-left: 10px;
    }

    p {
        color: #333;
        font-size: 16px;
        margin-left: 30px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
    }

    .num {
        color: #409eff;
        font-weight: 600;
        font-size: 18px;
        margin: 0 3px;
    }
}
</style>
