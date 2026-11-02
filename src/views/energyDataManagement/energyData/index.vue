<!-- 能耗基础数据 -->
<template>
    <section class="container_warp">
        <section class="container_box">
            <!-- <el-divider class="curDivider" direction="vertical" /> -->
            <!-- <wl-main-container data-title="能耗基础数据"> -->
            <el-form :inline="true" :model="formData" class="demo-form-inline">
                <el-form-item label="表计名称：">
                    <el-input v-model="formData.meterName" placeholder="请输入表计名称"></el-input>
                </el-form-item>
                <el-form-item label="时间区间" prop="select" style="margin-left: 20px;">
                    <el-radio-group v-model="formData.dateType" @change="timeTypeChange">
                        <el-radio label="day">日</el-radio>
                        <el-radio label="month">月</el-radio>
                        <el-radio label="year">年</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="时间" prop="select">
                    <el-date-picker style="margin-left: 10px;" ref="dateChose" id="dateChose" v-model="formData.date"
                        :type="periodTimeType" :format="datePickFormat" :value-format="datePickFormat"
                        placeholder="选择时间" :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-right: 0; float: right">
                    <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
                </el-form-item>
            </el-form>
            <div class="energyData_content">
                <div class="energyData_content_left">
                    <div class="left_title">分项名称</div>
                    <el-divider style="background-color: red;"></el-divider>
                    <div class="left_checkbox">
                        <el-checkbox-group v-model="formData.parentSubItemIds" class="checkbox-group-vertical">
                            <el-checkbox v-for="item in systemTypeList" :key="item.orgId" :label="item.orgId"
                                :value="item.orgId">{{ item.orgName }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="rounded-lg overflow-hidden" style="width: 88%; box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);">
                    <div style="padding-bottom: 50px;width: 100%;height: 100%;">
                        <el-table :data="tableData" style="width: 100%; min-height:320px;" height="100%"
                            :row-style="setRowStyle">
                            <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
                            <el-table-column align="center" prop="meterName" label="表计名称" width="">
                            </el-table-column>
                            <el-table-column align="center" prop="subItemName" label="分项名称" width="">
                            </el-table-column>
                            <el-table-column align="center" prop="location" label="安装位置" width="">
                            </el-table-column>
                            <el-table-column align="center" prop="area" label="所在区域" width="">
                            </el-table-column>
                            <el-table-column align="center" prop="data" label="能耗值kWh" width="">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="tableTotal">
                        <div class="tableTotal_title">总能耗</div>
                        <div class="tableTotal_total">{{ tableDataTotal || 0 }}</div>
                    </div>
                </div>
            </div>

            <!-- </wl-main-container> -->
        </section>
    </section>
</template>

<script>
import { getSubItemList } from '@/api/itemizedEnergyReport'
import { handleMeterDataList, exportMeterDataExport } from '@/api/energy-data'
import dayjs from "dayjs";
export default {
    data() {
        return {
            formData: {
                dateType: "month",
                date: dayjs(new Date()).format("YYYY-MM"),
                queryDate: '',
                meterName: "",
                // subItems: [],
                parentSubItemIds: [],
            },
            systemTypeList: [],
            tableData: [],
            tableDataTotal: 0,
            periodTimeType: "month",
            datePickFormat: "yyyy-MM",
        };
    },

    components: {},

    computed: {
    },

    mounted() {
        this.init()
    },
    methods: {
        setRowStyle({ row }) {
            return row.totalDemandText ? {
                background: "#f5f9fd", fontWeight: "bold", position: "-webkit-sticky", position: "sticky",
                bottom: row.isFixed ? '40px' : 0
            } : {}
        },
        timeTypeChange(data) {
            console.log(data);
            switch (data) {
                case "year":
                    this.year();
                    break;
                case "month":
                    this.month();
                    break;
                case "day":
                    this.day();
                    break;
                default:
                    break;
            }
        },
        day() {
            this.periodTimeType = "date";
            this.formData.dateType = "day";
            this.datePickFormat = "yyyy-MM-dd";
            this.formData.date = dayjs(new Date()).format("YYYY-MM-DD");
            this.formData.queryDate = dayjs(this.formData.date).format("YYYYMMDD");
        },
        month() {
            this.periodTimeType = "month";
            this.formData.dateType = "month";
            this.datePickFormat = "yyyy-MM";
            this.formData.date = dayjs(new Date()).format("YYYY-MM");
            this.formData.queryDate = dayjs(this.formData.date).format("YYYYMM");
        },
        year() {
            this.periodTimeType = "year";
            this.formData.dateType = "year";
            this.datePickFormat = "yyyy";
            this.formData.date = dayjs(new Date()).format("YYYY");
            this.formData.queryDate = dayjs(this.formData.date).format("YYYY");
        },

        init() {
            this.getItemList();
        },
        // 获取分项名称数据
        getItemList() {
            this.formData.parentSubItemIds = []
            getSubItemList("ENERGY_ELECTRIC").then((res) => {
                if (res.code == 200 && res.data) {
                    this.systemTypeList = res.data;
                    if (this.systemTypeList.length > 0) {
                        this.systemTypeList.forEach((item) => {
                            this.formData.parentSubItemIds.push(item.orgId)
                        })
                    }
                }
                this.query()
            });
        },
        query() {
            if (this.formData.parentSubItemIds.length) {
                if (this.formData.dateType === 'day') {
                    this.formData.queryDate = dayjs(this.formData.date).format("YYYYMMDD");
                } else if (this.formData.dateType === 'month') {
                    this.formData.queryDate = dayjs(this.formData.date).format("YYYYMM");
                } else if (this.formData.dateType === 'year') {
                    this.formData.queryDate = dayjs(this.formData.date).format("YYYY");
                }
                handleMeterDataList(this.formData).then((res) => {
                    if (res.code === 200 && res.data) {
                        this.tableData = res.data.list;
                        this.tableDataTotal = res.data.total;
                    }
                });
            } else {
                this.$message.warning('最少选择一个分项名称')
            }
        },
        reset() {
            this.formData.dateType = "month"
            this.formData.date = dayjs(new Date()).format("YYYY-MM")
            this.formData.queryDate = dayjs(this.formData.date).format("YYYYMM");
            this.formData.meterName = ""
            this.formData.parentSubItemIds = []
            this.tableDataTotal = 0
            this.periodTimeType = "month"
            this.datePickFormat = "yyyy-MM"
            this.getItemList();
        },
        //导出列表
        handleExport() {
            exportMeterDataExport(this.formData).then((res) => {
                let data = res;
                if (!data) return;
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", "能耗基础数据.xls");
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
}

.container_box {
    height: 100%;
}

.table_div {
    width: 100%;
    height: calc(100% - 47px);
    background-color: #fff !important;
    padding: 20px;
}

._uplaod-div {
    display: inline-block;
    margin: 0 10px;

    button {
        background-color: transparent;
        border: 1px solid #486aa8;
    }
}

.top_block {
    width: 4px;
    height: 20px;
    display: inline-block;
    background: #fff;
    border-radius: 5px;
    margin-right: 10px;
}

.title_text {
    font-size: 20px;
    color: #fefeff;
}

.top_warp {
    width: 100%;
    height: 360px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    .top_pie_box:nth-child(2) {
        margin-left: 10px;
    }

    .top_pie_box {
        background-color: #1e2a45;
        border-radius: 4px;
        padding: 20px 20px 0 20px;
        width: calc(100% / 2 - 20px);
        overflow: hidden;

        >div {
            width: 100%;
            height: calc(100% - 23px);
        }

        >span {
            vertical-align: middle;
        }
    }
}

.btn_group {
    margin-bottom: 10px;
}

.wbtn {
    background-color: transparent;
    color: #fff;
}

.addBtn {
    border-color: #1ec695;
}

.uploadBtn,
.exportBtn,
.templateBtn {
    border-color: #486aa8;
}

.rtCodeBtn {
    border-color: #f4ae50;
}

//
.th-main-view {
    padding: 0 20px;
    // padding-right: 20px;
    right: 0;
}

::v-deep(.th-main-title) {
    h2 {
        line-height: normal !important;
        margin-left: 0px !important;
    }
}

.energyData_content {
    display: flex;
    width: 100%;
    height: calc(100% - 46px);

    .energyData_content_left {
        width: 12%;
        background-color: #fff;
        margin-right: 20px;
        border-radius: 10px;
        box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);

        .left_title {
            color: #000;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            letter-spacing: 10px;
            height: 24px;
            line-height: 50px;
        }
    }
}

.left_checkbox {
    height: 82%;
    overflow: auto;
}

.checkbox-group-vertical .el-checkbox {
    display: block;
    margin-bottom: 10px;
    /* 可选，设置每个复选框之间的间距 */
    margin-left: 20px;
}

.tableTotal {
    display: flex;
    width: 86.8%;
    height: 50px;
    color: #333;
    background-color: #fff;
    margin-top: -50px;
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    line-height: 50px;
    text-align: center;
    border-radius: 0 0 10px 10px;


    .tableTotal_title {
        width: 81.2%;
    }

    .tableTotal_total {
        width: 18.6%;
        border-left: 1px solid #b3b3b4;
    }
}


// ::v-deep .el-table {
//     ::-webkit-scrollbar {
//         display: block;
//         width: 15px !important;
//     }

//     width: 100% !important;
//     overflow-y: scroll !important;
// }
</style>
