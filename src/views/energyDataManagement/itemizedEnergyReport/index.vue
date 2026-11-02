<!-- 分项能耗报表 -->
<template>
    <section class="container_warp">
        <section class="container_box">
            <!-- <el-divider class="curDivider" direction="vertical" /> -->
            <!-- <wl-main-container data-title="分项能耗"> -->
            <!-- 表单查询 -->
            <el-form class="table-view-query-form form" :inline="true" ref="queryForm" :model="queryFormData">
                <el-form-item label="分项名称" prop="select">
                    <el-select class="mulSelect_class" v-model="queryFormData.subItems" placeholder="请选择分项名称" clearable
                        multiple collapse-tags>
                        <el-option v-for="item in itemsList" :key="item.orgId" :label="item.orgName"
                            :value="item.orgId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="能源类型" prop="select">
                    <el-select v-model="queryFormData.energyType" placeholder="请选择能源类型" @change="energyTypeChange">
                        <el-option v-for="item in energyTypeList" :key="item.value" :label="item.label"
                            :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告类型" prop="">
                    <el-select v-model="queryFormData.dateType" placeholder="请选择" @change="reportTypeChange">
                        <el-option v-for="item in dateTypeList" :key="item.value" :label="item.text"
                            :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="select">
                    <el-date-picker v-model="queryFormData.date" :type="periodTimeType" :format="datePickFormat"
                        :value-format="datePickFormat" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="">
                    <el-button type="primary" round icon="el-icon-search"
                        @click="handleTableFormQuery(queryFormData)">查询</el-button>
                    <el-button type="primary" round icon="el-icon-refresh-left"
                        @click="handleQueryFormReset(queryFormData)">重置</el-button>
                </el-form-item>
                <!-- 其他操作 -->
                <el-form-item style="margin-right: 0; float: right">
                    <el-button type="primary" icon="el-icon-my-pieChart"
                        @click="showPie">饼图</el-button>
                    <el-button type="primary" icon="el-icon-my-trendChart"
                        @click="showTrend">趋势图</el-button>
                    <el-button type="primary" icon="el-icon-my-export"
                        @click="exportEquipment">导出</el-button>
                </el-form-item>
            </el-form>
            <!--表格-->
            <div class="table_div">
                <el-table class="th-table e_table" header-cell-class-name="th-table-header-cell" :data="tableData"
                    ref="table" size="mini" height="100%" :span-method="spanMethod"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="selection" width="55"></el-table-column>
                    <!-- <el-table-column align="center" label="序号" type="index" width="55"></el-table-column> -->
                    <el-table-column label="序号" prop="num" width="55" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.num }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="分项名称" width="150">
                    </el-table-column>
                    <el-table-column prop="firstName" align="center" label="一级分项" width="150">
                        <template slot-scope="scope">
                            <span>{{ scope.row.firstName || '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="secondName" align="center" label="二级分项" width="150">
                        <template slot-scope="scope">
                            <span>{{ scope.row.secondName || '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="energyType" align="center" label="能源类型" width="100"></el-table-column>
                    <el-table-column align="left" label="">
                        <template slot="header">
                            <div>
                                <div>{{ queryFormData.date }} 能耗为：{{ tableDataTotal }}</div>
                                <div style="color: #000; font-size: 12px">能耗单位&nbsp;&nbsp;电:（kWh） 水:（t）</div>
                            </div>
                        </template>
                        <el-table-column v-for="(item, index) in timeArr" :key="index" :label="item" align="center"
                            width="110">
                            <template slot-scope="scope">
                                <span>{{ scope.row.detail[index] ? scope.row.detail[index] : "-" }}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="firstTotal" align="center" label="一级分项能耗" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.firstTotal || scope.row.firstTotal == 0 ? scope.row.firstTotal : '--'
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="secondTotal" align="center" label="二级分项能耗" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.secondTotal || scope.row.secondTotal == 0 ? scope.row.secondTotal :
                                '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="total" align="center" label="分项能耗" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.total || scope.row.total == 0 ? scope.row.total : '--' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button @click="handlePieClick(scope.row)" type="text">分项饼图</el-button>
                            <el-divider direction="vertical" />
                            <el-button @click="handleLineClick(scope.row)" type="text">分项趋势图</el-button>
                        </template>
                    </el-table-column>
                    <!---->
                </el-table>
            </div>
            <!--分页-->
            <!-- <el-pagination style="float:right;margin-top: 60px;" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="page.pageNum" :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="page.total" background>
                </el-pagination> -->
            <pieChart ref="pieChartRef" :data-flag="pieChart.flag" :data-arr="pieChart.arrData"
                :data-title="pieChart.title" @close="pieChartClose" @submit="pieChartSubmit"></pieChart>
            <trendChart ref="trendChartRef" :data-flag="trendChart.flag" :data-arr="trendChart.arrData"
                :data-time="timeArr" :data-title="trendChart.title" @close="trendChartClose" @submit="trendChartSubmit">
            </trendChart>
            <!-- </wl-main-container> -->
        </section>
    </section>
</template>

<script>
import { getEnergyReportList, getSubItemList, exportEnergyReport } from '@/api/itemizedEnergyReport'
import trendChart from "./charts/trendChart.vue";
import pieChart from "./charts/pieChart1.vue";
import dayjs from "dayjs";
// import { transformTableData } from "./transformData";

export default {
    components: { pieChart, trendChart },
    data() {
        return {
            top_btn_flag: 0,
            queryFormData: {
                subItems: [], // 分项名称
                energyType: "ENERGY_ELECTRIC",
                dateType: "month",
                date: dayjs(new Date()).format("YYYY-MM"),
            },
            periodTimeType: "month",
            page: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            tableData: [],
            timeArr: [],
            tableDataTotal: 0,
            datePickFormat: "yyyy-MM",
            itemsList: [],
            areaList: [],
            pieChart: {
                flag: false,
                arrData: [],
                title: "分项能耗饼图",
            },
            trendChart: {
                flag: false,
                arrData: [],
                title: "分项能耗趋势图",
            },
            dateTypeList: [
                { text: "日报", value: "day" },
                { text: "月报", value: "month" },
                { text: "年报", value: "year" },
            ],
            energyTypeList: [
                {
                    value: "ENERGY_WATER",
                    label: "水",
                },
                {
                    value: "ENERGY_ELECTRIC",
                    label: "电",
                },
                {
                    value: "ENERGY_HEAT",
                    label: "热",
                },
                {
                    value: "ENERGY_GAS",
                    label: "气",
                },
            ],
            spanCache: {
                nameMap: new Map(),
                firstNameMap: new Map(),
                secondNameMap: new Map(),
            },
            selectedRows: [],
        };
    },

    computed: {},

    mounted() {
        this.init();
    },

    methods: {
        // 图表样式处理
        spanMethod({ row, column, rowIndex }) {
            const field = column.property;
            const label = column.label;

            const mergeKeys = {
                name: ['name', 'num', 'total'],
                firstName: ['firstName', 'firstTotal'],
                secondName: ['secondName', 'secondTotal']
            };

            // name 相关列、选择框、操作列合并
            if (mergeKeys.name.includes(field) || column.type === 'selection' || label === '操作') {
                const info = this.spanCache.nameMap.get(row.name);
                if (info && rowIndex === info.start) {
                    return { rowspan: info.count, colspan: 1 };
                }
                return { rowspan: 0, colspan: 0 };
            }

            // firstName 相关列合并
            if (mergeKeys.firstName.includes(field)) {
                const key = `${row.name}|${row.firstName}`;
                const info = this.spanCache.firstNameMap.get(key);
                if (info && rowIndex === info.start) {
                    return { rowspan: info.count, colspan: 1 };
                }
                return { rowspan: 0, colspan: 0 };
            }

            // secondName 相关列合并
            if (mergeKeys.secondName.includes(field)) {
                const key = `${row.name}|${row.firstName}|${row.secondName}`;
                const info = this.spanCache.secondNameMap.get(key);
                if (info && rowIndex === info.start) {
                    return { rowspan: info.count, colspan: 1 };
                }
                return { rowspan: 0, colspan: 0 };
            }

            return { rowspan: 1, colspan: 1 };
        },

        computeSpanCache() {
            const nameMap = new Map();
            const firstNameMap = new Map();
            const secondNameMap = new Map();
            const data = this.tableData;

            data.forEach((item, index) => {
                // name 分组
                if (!nameMap.has(item.name)) {
                    nameMap.set(item.name, { start: index, count: 0 });
                }
                nameMap.get(item.name).count++;

                // name + firstName 分组
                const firstKey = `${item.name}|${item.firstName}`;
                if (!firstNameMap.has(firstKey)) {
                    firstNameMap.set(firstKey, { start: index, count: 0 });
                }
                firstNameMap.get(firstKey).count++;

                // name + firstName + secondName 分组
                const secondKey = `${item.name}|${item.firstName}|${item.secondName}`;
                if (!secondNameMap.has(secondKey)) {
                    secondNameMap.set(secondKey, { start: index, count: 0 });
                }
                secondNameMap.get(secondKey).count++;
            });

            this.spanCache = {
                nameMap,
                firstNameMap,
                secondNameMap
            };
        },


        init() {
            this.getData();
            this.getItemList();
        },

        getData() {
            const data = { ...this.queryFormData };
            getEnergyReportList(data).then((res) => {

                if (res.code == 200) {
                    let data = res.data;
                    this.tableData = data.data;
                    this.timeArr = data.dates;
                    this.tableDataTotal = data.total;

                    this.computeSpanCache()
                } else {
                    this.$message.error(res.msg);
                }
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            });
        },

        //获取时间段
        getTime(data) {
            getDeviceTime(data).then((res) => {
                if (res.code == 200) {
                    console.log(res.data);
                    this.timeArr = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //设备类型
        getItemList() {
            getSubItemList(this.queryFormData.energyType).then((res) => {
                if (res.code == 200 && res.data) {
                    this.itemsList = res.data;
                }
            });
        },
        // 切换能源类型
        energyTypeChange(e) {
            this.queryFormData.subItems = []
            this.getItemList()
        },
        day() {
            this.top_btn_flag = 0;
            this.periodTimeType = "date";
            this.queryFormData.dateType = "day";
            this.datePickFormat = "yyyy-MM-dd";
            this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
        },
        month() {
            this.top_btn_flag = 1;
            this.periodTimeType = "month";
            this.queryFormData.dateType = "month";
            this.datePickFormat = "yyyy-MM";
            this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
        },
        year() {
            this.top_btn_flag = 2;
            this.periodTimeType = "year";
            this.queryFormData.dateType = "year";
            this.datePickFormat = "yyyy";
            this.queryFormData.date = dayjs(new Date()).format("YYYY");
        },
        //
        reportTypeChange(val) {
            if (val === "day") {
                this.top_btn_flag = 0;
                this.periodTimeType = "date";
                this.queryFormData.dateType = "day";
                this.datePickFormat = "yyyy-MM-dd";
                this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
            }
            if (val === "month") {
                this.top_btn_flag = 1;
                this.periodTimeType = "month";
                this.queryFormData.dateType = "month";
                this.datePickFormat = "yyyy-MM";
                this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
            }
            if (val === "year") {
                this.top_btn_flag = 2;
                this.periodTimeType = "year";
                this.queryFormData.dateType = "year";
                this.datePickFormat = "yyyy";
                this.queryFormData.date = dayjs(new Date()).format("YYYY");
            }
        },
        //查询
        handleTableFormQuery(data) {
            this.getData(data);
        },
        //重置
        handleQueryFormReset(data) {
            Object.keys(data).forEach((key) => (data[key] = ""));
            this.queryFormData.subItems = [];
            this.queryFormData.energyType = 'ENERGY_ELECTRIC'
            this.month();
            this.page.pageNum = 1;
            this.page.pageSize = 10;
            this.handleTableFormQuery(this.queryFormData);
        },
        /****
         * 分页
         */
        // 切换分页大小查询
        handleSizeChange(data) {
            this.page.pageSize = data;
            this.handleTableFormQuery(this.queryFormData);
        },
        // 切换页码
        handleCurrentChange(data) {
            this.page.pageNum = data;
            this.handleTableFormQuery(this.queryFormData);
        },

        //表格选中，返回
        handleSelectionChange(data) {
            // console.log(data, 'ddd');
            const numIds = data.map((item) => item.num);

            this.selectedRows = this.tableData.filter(item => numIds.includes(item.num))

            // 用 Map 根据 name 去重，只保留一个同名项
            const uniqueMap = new Map();

            this.selectedRows.forEach(item => {
                if (!uniqueMap.has(item.name)) {
                    uniqueMap.set(item.name, {
                        name: item.name,
                        value: item.total,
                        detail: item.detail,
                    });
                }
            });

            // 转换成数组传给图表
            const result = Array.from(uniqueMap.values());
            // console.log(result, '传递给图表的数据');
            this.pieChart.arrData = result;
            // this.pieChart.title = data[0].name
            this.trendChart.arrData = result;
        },

        // 分项饼图
        handlePieClick(row) {
            const selectedRows = this.tableData.filter(item => row.num === item.num)
            console.log(selectedRows, 'aa');

            const uniqueMap = new Map();

            if (selectedRows.length > 0 && !selectedRows[0].detail.length) {
                this.$message.warning("该一级分项没有数据");
                return;
            }
            selectedRows.forEach(item => {
                if (!uniqueMap.has(item.firstName)) {
                    uniqueMap.set(item.firstName, {
                        name: item.firstName,
                        value: item.firstTotal,
                    });
                }
            });

            // 转换成数组传给图表
            const result = Array.from(uniqueMap.values());

            this.pieChart.flag = true;
            this.pieChart.arrData = result;
        },

        // 分项趋势图
        handleLineClick(row) {
            const selectedRows = this.tableData.filter(item => row.num === item.num)
            console.log(selectedRows, 'aa');

            const uniqueMap = new Map();

            if (selectedRows.length > 0 && !selectedRows[0].detail.length) {
                this.$message.warning("该一级分项没有数据");
                return;
            }
            selectedRows.forEach(item => {
                if (!uniqueMap.has(item.firstName)) {
                    uniqueMap.set(item.firstName, {
                        name: item.firstName,
                        detail: item.detail,
                    });
                }
            });

            // 转换成数组传给图表
            const result = Array.from(uniqueMap.values());

            this.trendChart.flag = true;
            this.trendChart.arrData = result;
        },


        //饼图
        showPie() {
            let data = this.pieChart.arrData;

            if (data.length < 1) {
                this.$message.warning("请选择需要展示的设备");
                return;
            }
            // else if (data.length > 10) {
            //     this.$message.warning("最多可选择10台设备");
            //     return;
            // } 
            else {
                this.pieChart.flag = true;
            }
        },
        //趋势图
        showTrend() {
            let data = this.trendChart.arrData;
            if (data.length < 1) {
                this.$message.warning("请选择需要展示的设备");
                return;
            }
            // else if (data.length > 10) {
            //     this.$message.warning("最多可选择10台设备");
            //     return;
            // } 
            else {
                this.trendChart.flag = true;
            }
        },
        //导出
        exportEquipment() {
            const tempObj = { ...this.queryFormData };
            exportEnergyReport(tempObj).then((res) => {
                let data = res;
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", "分项能耗报表.xls");
                document.body.appendChild(link);
                link.click();
            });
        },
        pieChartClose() {
            this.pieChart.arrData = [];
            this.pieChart.flag = false;
        },
        pieChartSubmit() {
            this.pieChart.flag = false;
        },
        trendChartClose() {
            this.trendChart.arrData = [];
            this.trendChart.flag = false;
        },
        trendChartSubmit() {
            this.trendChart.flag = false;
        },


    },
};
</script>
<style lang="scss" scoped>
::v-deep ::-webkit-scrollbar {
    display: block;
}

.container_warp {
    width: 100%;
    height: 100%;
}

.container_box {
    height: 100%;
}

.table_div {
    width: 100%;
    height: calc(100% - 47px);
    background-color: #fff !important;
    border-radius: 10px;
      box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    padding: 20px;
}

.e_table {
    background-color: #fff !important;
    overflow: hidden;
}

::v-deep .e_table {
    box-shadow: none !important;
    border: none !important;
}

::v-deep {
    .mulSelect_class {

        .el-tag.el-tag--info {
            color: #fff;
            background-color: #fff;
            border-color: #000;
        }

        .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
            background-color: #fff !important;
        }
    }

}

::v-deep {
    .th-container-view {
        padding: 0 20px;
        background-color: transparent !important;
    }

    .el-form-item {
        >.el-form-item__label {
            color: #000;
        }
    }

    .top_btn {

        .el-button--primary:hover,
        .el-button--primary:focus {
            border-color: transparent !important;
        }

        .el-button--primary {
            margin-left: 0;
            font-size: 14px;
            padding-top: 5px;
            padding-bottom: 5px;
        }
    }

    .tba .th-table-header-cell {
        // background: transparent !important;
    }

    .e_table {

        tr {
            // background-color: #fff !important;
        }

        .el-table__fixed::before {
            display: none;
        }

        th.el-table__cell.is-leaf,
        .el-table td.el-table__cell {
            // background: #fff !important;
            // border-color: #EBEEF5 !important;
            // border-right: 1px solid #EBEEF5;
        }
    }

    .el-table--enable-row-transition .el-table__body td.el-table__cell {
        border-bottom: 1px solid #EBEEF5;
        border-right: 1px solid #EBEEF5;
    }

    .th-table-header-cell {
        border-right: 1px solid #c9d9fc;
    }

    .el-table--scrollable-x .el-table__body-wrapper {
        @include scrollBar;
        // height: 400px !important;
    }

    //自定义图表的
    .el-icon-my-pieChart,
    .el-icon-my-trendChart,
    .el-icon-my-export {
        margin-left: -5px !important;
    }

    .el-dialog {
        background-color: #fff;

        .el-button--primary {
            background: transparent;
            border-color: none;
            color: #fff;
            margin-left: 0;
            font-size: 14px;
            padding-top: 5px;
            padding-bottom: 5px;
        }

        .el-button--primary:hover,
        .el-button--primary:focus {
            border-color: transparent !important;
        }
    }

    .btn-prev,
    button.btn-next {
        border: 1px solid #000;
    }
}

.el-main {
    @include scrollBar;
}

.top_btn {
    position: absolute;
    top: 2px;
    left: 200px;
    background: transparent;
    border: 1px solid #3d4d6a;
    border-radius: 14px;
}

.top_btn_active {
    background: linear-gradient(to right, #13b1ff, #146ef9);
    color: #fff;
}

.energy_water_c {
    color: #00c2cc;
}

.energy_electric_c {
    color: #0090d9;
}

.energy_heat_c {
    color: #d87789;
}

::v-deep .el-table {
    .el-table__fixed-body-wrapper .el-table__body {
        padding-bottom: 10px;
    }

    .el-table__fixed {
        height: calc(100% - 10px) !important;
    }
}

//
.th-main-view {
    padding: 0;
}
</style>
