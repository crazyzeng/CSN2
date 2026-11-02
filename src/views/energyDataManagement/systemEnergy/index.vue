<!-- 系统能效 -->

<template>
    <section class="container_warp">
        <section class="container_box">
            <!-- <el-divider class="curDivider" direction="vertical" />
            <wl-main-title data-title="系统能效"> </wl-main-title> -->
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item label="报告类型" prop="">
                    <el-select v-model="formData.dateType" placeholder="请选择" @change="typeChange">
                        <el-option v-for="item in dateTypeList" :key="item.value" :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="select">
                    <el-date-picker v-model="formData.date" :type="periodTimeType" :format="datePickFormat"
                        :value-format="datePickFormat" :clearable="false" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="ml-2">
                    <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
                <el-form-item style="margin-right: 0; float: right">
                    <el-select v-model="headerIds" multiple collapse-tags placeholder="请选择" @change="headerChange">
                        <el-option v-for="item in headerData" :key="item.simulatePointId"
                            :label="item.simulatePointName" :value="item.simulatePointId">
                        </el-option>
                    </el-select>
                    <el-button class="ml-5" type="primary" icon="el-icon-upload2"
                        @click="exportData">导出</el-button>
                </el-form-item>
            </el-form>
            <!---->
            <div class="table_div">
                <el-tabs v-model="formData.type"@tab-click="tabsClick">
                    <el-tab-pane label="武广冷站" name="WG"></el-tab-pane>
                    <el-tab-pane label="沪昆冷站" name="HK"></el-tab-pane>
                </el-tabs>
                <el-table ref="tableRef" v-loading="loading" :data="tableData" :key="Date.now()"
                    element-loading-spinner="el-icon-loading"
                    class="th-table e_table" height="calc(100% - 60px)">
                    <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                    <el-table-column prop="date" label="时间" min-width="150" align="center">
                        <template slot-scope="{ row }">
                            <span>{{ row[0] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, index) in headerTableData" :key="index"
                        :label="item.simulatePointName" min-width="120" align="center">
                        <template slot-scope="{ row, $index }">
                            <span>{{ row[index + 1] }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </section>
    </section>
</template>

<script>
import dayjs from 'dayjs';
import {
    handleEnergyDataSystemEfficiency,
    handleEnergyDataExport,
    getSystemEfficiencyHeader,
} from '@/api/cold-station';
import { WGHeaderData, HKHeaderData } from './js/data';

export default {
    data() {
        return {
            datePickFormat: 'yyyy-MM',
            periodTimeType: 'month',
            timeType: 'month',
            formData: {
                type: 'WG',
                dateType: 'month',
                date: dayjs(new Date()).format('YYYY-MM'),
            },
            dateTypeList: [
                { text: '年报', value: 'year' },
                { text: '月报', value: 'month' },
                { text: '日报', value: 'day' },
            ],
            tableRef: null,
            tableData: [],
            headerData: [],
            headerTableData: [],
            headerIds: [],
            loading: false,
        };
    },

    computed: {
        curDate() {
            const date = this.formData.date;
            const unit = this.formData.dateType == 'day' ? '日' : this.formData.dateType == 'month' ? '月' : '年';
            return `${date}${unit}`;
        },
    },
    created() {
        // this.headerData = WGHeaderData
        this.getHeaderData(this.formData.type);
    },

    methods: {
        typeChange(val) {
            if (val == 'month') {
                this.datePickFormat = 'yyyy-MM';
                this.periodTimeType = 'month';
                this.formData.dateType = 'month';
                this.formData.date = dayjs(new Date()).format('YYYY-MM');
            } else if (val == 'year') {
                this.datePickFormat = 'yyyy';
                this.periodTimeType = 'year';
                this.formData.dateType = 'year';
                this.formData.date = dayjs(new Date()).format('YYYY');
            } else {
                this.datePickFormat = 'yyyy-MM-dd';
                this.periodTimeType = 'date';
                this.formData.dateType = 'day';
                this.formData.date = dayjs(new Date()).format('YYYY-MM-DD');
            }
        },

        // tab栏点击
        tabsClick(val) {
            // if (this.formData.type === 'WG') {
            //     this.headerData = WGHeaderData
            // } else if (this.formData.type === 'HK') {
            //     this.headerData = HKHeaderData
            // }
            this.formData.type = val.name;
            this.tableData = [];
            // this.query();
            this.getHeaderData(this.formData.type);
        },

        // 表头
        async getHeaderData(type) {
            const res = await getSystemEfficiencyHeader(type);
            if (res.code === 200) {
                this.headerData = res.data;
                this.headerIds = res.data.map((item) => item.simulatePointId);
                this.headerTableData = res.data;
                this.query();
            }
        },

        // 表头选择
        headerChange(val) {
            this.headerTableData = this.headerData.filter((item) => val.includes(item.simulatePointId));
            this.query();
        },

        //查询
        query() {
            this.loading = true;
            const data = {
                type: this.formData.type,
                queryDate: this.formData.date,
            };
            console.log(this.headerIds, 'ids');

            handleEnergyDataSystemEfficiency(data, this.headerIds).then((res) => {
                if (res.code === 200) {
                    this.tableData = res.data;
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.tableRef.doLayout();
                    });
                }
            });
        },

        //重置
        reset() {
            this.formData.dateType = 'month';
            this.periodTimeType = 'month';
            this.datePickFormat = 'yyyy-MM';
            // this.formData.type = 'WG'
            this.formData.date = dayjs(new Date()).format('YYYY-MM');
            // this.headerData = WGHeaderData
            this.query();
        },

        // 导出
        exportData() {
            const data = {
                queryDate: this.formData.date,
                type: this.formData.type,
            };
            handleEnergyDataExport(data, this.headerIds).then((res) => {
                let data = res;
                console.log(res);
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `系统能效报表.xls`);
                document.body.appendChild(link);
                link.click();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
  position: relative;
}

.container_box {
  height: 100%;
  position: relative;
}


::v-deep ::-webkit-scrollbar {
    display: block;
}

.table_div {
    position: relative;
    width: 100%;
    height: calc(100% - 47px);
    background-color: #fff !important;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    padding: 20px;
}

::v-deep .el-tag.el-tag--info {
    max-width: 125px;
}

.title_header {
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 20px;
    margin-top: 5px;

    .unit {
        font-size: 14px;
        color: #fff;
        margin-top: 10px;
    }
}
</style>
