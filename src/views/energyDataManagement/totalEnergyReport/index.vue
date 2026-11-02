<!-- 17块总表能耗报表 / 总能耗报表 -->

<template>
    <section class="container_box h-full">
        <!-- <el-divider class="curDivider" direction="vertical" /> -->
        <!-- <wl-main-title data-title="17块总表能耗报表"> </wl-main-title> -->
        <!-- <el-main> -->
        <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="设备名称" class="ml-5">
                <el-popover placement="bottom" width="300" trigger="click">
                    <el-tree ref="treeRef" :data="treeData" :props="defaultProps" show-checkbox default-expand-all
                        :check-strictly="false" node-key="id" @check="handleNodeClick"
                        style="height: 400px; overflow-y: scroll"></el-tree>
                    <el-input v-model="formData.orgName" slot="reference" :readonly="true" placeholder="请选择设备" />
                </el-popover>
            </el-form-item>
            <el-form-item label="报告类型" prop="">
                <el-select v-model="formData.dateType" placeholder="请选择" @change="typeChange">
                    <el-option v-for="item in dateTypeList" :key="item.value" :label="item.text" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="select">
                <el-date-picker v-model="formData.date" :type="periodTimeType" :format="datePickFormat"
                    :value-format="datePickFormat" placeholder="选择时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="ml-2">
                <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item style="margin-right: 0; float: right">
                <el-button type="primary" icon="el-icon-upload2"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <!---->
        <div class="table_div">
            <el-table ref="tableRef" :data="tableData" v-loading="loading" element-loading-spinner="el-icon-loading"
                class="th-table e_table" height="calc(100vh - 200px)">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="date" label="时间" min-width="120" align="center"></el-table-column>
                <el-table-column label="" min-width="150" align="center">
                    <template #header>
                        <div class="title_header">
                            <span>17块总表{{ curDate }}能耗：{{ totalEnergy }}</span>
                            <span class="unit">能源单位 电：(kWh)</span>
                        </div>
                    </template>
                    <el-table-column :prop="header.id" :label="header.name" align="center"
                        v-for="header in tableHeaders" :key="header.id">
                        <el-table-column v-for="item in header.children" :key="item.id" :prop="item.id"
                            :label="item.name" align="center" min-width="100">
                            <template #default="{ row }">
                                <span>{{ row[item.id] }}</span>
                            </template></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="total" label="用电量" align="center" min-width="120">
                    <template #default="{ row }">
                        <span>{{ row.total }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- <el-pagination style="float: right; margin-top: 20px" @current-change="handleCurrentChange"
                    :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
                    :total="paging.total" /> -->
        <!-- </el-main> -->
    </section>
</template>

<script>
import dayjs from 'dayjs';
import { getTotalDeviceTree, getTotalData, exportTotalData } from '@/api/cold-station';

export default {
    data() {
        return {
            datePickFormat: 'yyyy-MM',
            periodTimeType: 'month',
            radioType: '1',
            timeType: 'month',
            formData: {
                pointIds: [],
                dateType: 'month',
                orgName: '',
                date: dayjs(new Date()).format('YYYY-MM'),
            },
            dateTypeList: [
                { text: '日报', value: 'day' },
                { text: '月报', value: 'month' },
                { text: '年报', value: 'year' },
            ],
            tableRef: null,
            tableHeaders: [],
            tableData: [],
            treeData: [
                {
                    label: '一级 1',
                    children: [
                        {
                            label: '二级 1-1',
                        },
                    ],
                },
                {
                    label: '一级 2',
                    children: [
                        {
                            label: '二级 2-1',
                        },
                        {
                            label: '二级 2-2',
                        },
                    ],
                },
                {
                    label: '一级 3',
                    children: [
                        {
                            label: '二级 3-1',
                        },
                        {
                            label: '二级 3-2',
                        },
                    ],
                },
            ],
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            selectedList: [],
            paging: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
            totalEnergy: 0,
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
        this.getTreeData();
        this.getTableData();
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


        // 复选框点击
        handleNodeClick(val, nodes) {
            this.selectedList = nodes.checkedNodes.filter((item) => item.parentId);
            console.log(this.selectedList, 'node');
            this.formData.pointIds = this.selectedList.map((item) => item.id);
            this.formData.orgName = this.selectedList.map((item) => item.name).join(',');
            console.log(this.formData.orgName, 'name');
        },

        // 获取树状数据
        getTreeData() {
            getTotalDeviceTree().then((res) => {
                this.treeData = res.data;
            });
        },

        // 获取17块总表列表
        getTableData() {
            this.loading = true;
            const data = {
                pointIds: this.formData.pointIds,
                date: this.formData.date,
            };
            getTotalData(data).then((res) => {
                this.tableHeaders = res.data.columns;
                this.totalEnergy = res.data.total;
                this.tableData = res.data.rows;
                this.loading = false;
                this.$nextTick(() => {
                    this.$refs.tableRef.doLayout();
                });
            });
        },

        // 分页
        handleCurrentChange(newPage) {
            this.paging.pageNo = newPage;
            this.query();
        },

        //查询
        query() {
            this.getTableData();
        },
        //重置
        reset() {
            this.formData.dateType = 'month';
            this.periodTimeType = 'month';
            this.datePickFormat = 'yyyy-MM';
            this.formData.date = dayjs(new Date()).format('YYYY-MM');
            this.formData.orgName = '';
            this.formData.pointIds = [];
            this.$refs.treeRef.setCheckedNodes([]);
            this.getTableData();
        },

        // 导出
        exportData() {
            const data = {
                pointIds: this.formData.pointIds,
                date: this.formData.date,
            };
            exportTotalData(data).then((res) => {
                let data = res;
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', '17块总表能耗报表.xls');
                document.body.appendChild(link);
                link.click();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep ::-webkit-scrollbar {
    display: block;
}

::v-deep {


    // .tba .th-table-header-cell {
    //     background: transparent !important;
    // }

    // .e_table {
    //     margin-top: 10px;

    //     tr {
    //         background-color: #1e2a45 !important;
    //     }

    //     .el-table__fixed::before {
    //         display: none;
    //     }

    //     th.el-table__cell.is-leaf,
    //     .el-table td.el-table__cell {
    //         background: #1e2a45 !important;
    //         border-color: #304663 !important;
    //         border-right: 1px solid #304663;
    //     }

    //     .el-table__fixed-right::before {
    //         background-color: transparent;
    //     }
    // }

    // .el-table--enable-row-transition .el-table__body td.el-table__cell {
    //     border-bottom: 1px solid #304663;
    //     border-right: 1px solid #304663;
    // }

    .el-table thead.is-group th.el-table__cell {
        // background-color: transparent !important;
        border-right: 1px solid #c9d9fc !important;
    }

    // .el-table--scrollable-x .el-table__body-wrapper {
    //     @include scrollBar;
    // }

    // .btn-prev,
    // button.btn-next {
    //     border: 1px solid #364d79;
    // }
}

.table_div {
    width: 100%;
    height: calc(100% - 47.5px);
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    padding: 10px;
}

::v-deep .el-table {
    .el-table__fixed-body-wrapper .el-table__body {
        padding-bottom: 10px;
    }

    .el-table__fixed {
        height: calc(100% - 10px) !important;
    }
}

.title_header {
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 20px;
    margin-top: 5px;

    .unit {
        font-size: 14px;
        color: #606060;
        margin-top: 10px;
    }
}
</style>
