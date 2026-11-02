<!-- 表计配置 -->
<template>
    <section class="content_warp h-full">
        <section class="container_box h-full">
            <!-- <el-divider class="curDivider" direction="vertical" /> -->
            <!-- <wl-main-container data-title="表计配置"> -->
                <el-form :inline="true" :model="formData" class="demo-form-inline">
                    <el-form-item label="分项名称">
                        <el-select class="mulSelect_class" v-model="formData.parentSubItemIds" placeholder="请选择分项名称" clearable
                            multiple collapse-tags>
                            <el-option v-for="item in systemTypeList" :key="item.orgId" :label="item.orgName"
                                :value="item.orgId"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="表计名称：">
                        <el-input v-model="formData.meterName" placeholder="请输入表计名称"></el-input>
                    </el-form-item>
                    <el-form-item class="ml-10">
                        <el-button type="primary" icon="el-icon-search" @click="onQueryClick">查询</el-button>
                        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <section class="btn_group">
                    <el-button type="primary" plain icon="el-icon-plus" @click="add">新增</el-button>
                    <el-button type="primary" plain icon="el-icon-delete"
                        @click="handleBatchDelete">批量删除</el-button>
                </section>
                <div class="table_div">
                    <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)" v-loading="loading"
                            element-loading-spinner="el-icon-loading"
                        @selection-change="handleSelectionChange" @select-all="handleSelectAllChange">
                        <el-table-column align="center" type="selection" width="60"> </el-table-column>
                        <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
                        <el-table-column align="center" prop="meterName" label="表计名称" width=""> </el-table-column>
                        <el-table-column align="center" prop="subItemName" label="分项名称" width=""> </el-table-column>
                        <el-table-column align="center" prop="pointId" label="点位ID" width=""></el-table-column>
                        <el-table-column align="center" prop="location" label="安装位置" width=""> </el-table-column>
                        <el-table-column align="center" prop="area" label="所在区域" width=""> </el-table-column>
                        <el-table-column align="center" label="操作" width="220px">
                            <template #default="{ row }">
                                <el-link class="blue-link" @click="handleEdit(row)">编辑</el-link>
                                <el-divider direction="vertical" />
                                <el-link class="red-link" @click="handleDel(row)">删除</el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
                        @size-change="handleSizeChange" :current-page="paging.pageNum" :page-sizes="[10, 20, 50, 100, 500]"
                        :page-size="paging.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paging.total">
                    </el-pagination>
                </div>
                <AddOrEditModal ref="addEditmodal" @success="query()"></AddOrEditModal>
            <!-- </wl-main-container> -->
        </section>
    </section>
</template>

<script>
import { getSubItemList } from '@/api/itemizedEnergyReport'
import { getMeterConfigPage, getMeterConfigAdd, getMeterConfigEdit, getMeterConfigDel } from '@/api/meter-config'
import AddOrEditModal from "./modal/AddOrEditModal.vue";
export default {
    data() {
        return {
            loading: false,
            paging: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            formData: {
                // subItems:[],
                parentSubItemIds:[],
                meterName: "",
            },
            selectedData: [],
            systemTypeList: [],
            tableData: [],
        };
    },

    components: { AddOrEditModal },

    computed: {
    },

    mounted() {
        this.init()
    },
    methods: {
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
                    this.query()
                }
            });
        },

        onQueryClick(){
            this.paging.pageNum = 1
            this.paging.pageSize = 10
            this.query()
        },

        query() {
            if (this.formData.parentSubItemIds.length) {
                this.loading = true;
                getMeterConfigPage(this.formData, this.paging).then((res) => {
                    if (res.code === 200 && res.data) {
                        this.loading = false;
                        this.tableData = res.data.records;
                        this.paging.total = res.data.total;
                    }
                });
            } else {
                this.$message.warning('最少选择一个分项名称')
            }
        },
        reset() {
            for (let k in this.formData) this.formData[k] = "";
            this.paging.pageNum = 1;
            this.paging.pageSize = 10;
            this.getItemList();
        },

        add() {
            this.$refs.addEditmodal?.open({});
        },

        // 处理 批量删除
        handleBatchDelete() {
            console.log(this.selectedData)
            if (!this.selectedData.length) return this.$message.warning('请选择要删除的数据');
            const idArray = this.selectedData.map(item => item.id);
            console.log(idArray)
            this.$confirm('确认删除选中的内容？', '提示', { type: 'warning' }).then(async () => {
                await getMeterConfigDel(idArray).then((res) => {
                    if (res.code === 200) this.$message.success("删除成功");
                    this.query();
                });
            });
        },

        handleSelectionChange(val) {
            console.log(val)
            this.selectedData = val;
        },

        handleSelectAllChange(val) {
            this.selectedData = val;
        },

        handleEdit(item) {
            this.$refs.addEditmodal?.open(item);
        },

        // 删除
        handleDel(item) {
            this.$confirm("确定删除?", "提示", {
                confirmButtonClass: 'confirm-btn ',
                cancelButtonClass: 'cancel-btn ',
            })
                .then(() => {
                    getMeterConfigDel([item.id]).then((res) => {
                        if (res.code === 200) this.$message.success("删除成功");
                        this.getItemList();
                    });
                })
                .catch(() => { });
        },

        handleCurrentChange(val) {
            this.paging.pageNum = val;
            this.getItemList();
        },
        handleSizeChange(val) {
            this.paging.pageSize = val;
            this.getItemList();
        },
    },
};
</script>
<style lang="scss" scoped>

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

.table_div {
  width: 100%;
  height: calc(100% - 85px);
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
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
</style>
