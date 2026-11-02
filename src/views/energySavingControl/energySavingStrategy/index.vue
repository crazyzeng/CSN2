<!-- 节能策略 -->

<template>
    <section class="container_warp">
        <section class="container_box">
            <el-divider class="curDivider" direction="vertical" />
            <wl-main-title data-title="节能策略"> </wl-main-title>
            <el-main>
                <el-form :inline="true" :model="formData" class="demo-form-inline">
                    <el-form-item label="策略名称">
                        <el-input v-model="formData.strategyName" placeholder="请输入策略名称"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态">
                        <el-select v-model="formData.strategyStatus" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="开启" :value="1"></el-option>
                            <el-option label="停用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="ml-2">
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                    </el-form-item>
                    <el-form-item style="margin-right: 0; float: right">
                        <el-button class="border-btn b-b-b" type="primary" icon="el-icon-plus" @click="addStrategy"
                            >新增</el-button
                        >
                        <!-- <el-button class="border-btn b-b-b" type="primary" icon="el-icon-circle-check"
                            @click="enableStrategy">批量启用</el-button>
                        <el-button class="border-btn b-b-b" type="primary" icon="el-icon-warning-outline"
                            @click="disableStrategy">批量停用</el-button> -->
                    </el-form-item>
                </el-form>
                <!---->
                <div class="table_div" style="height: calc(100% - 100px)">
                    <el-table class="th-table e_table" :data="tableData" size="mini" height="100%">
                        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
                        <el-table-column align="center" label="序号" type="index" width="100"> </el-table-column>
                        <el-table-column align="center" prop="strategyName" label="策略名称"> </el-table-column>
                        <el-table-column align="center" prop="executeDate" label="执行日期">
                            <template slot-scope="scope">
                                <div class="mt-2 mb-2" v-for="(item, index) in scope.row.executeDate" :key="index">
                                    {{ item }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="executeTime" label="执行时间"> </el-table-column>
                        <el-table-column align="center" prop="createTime" label="创建时间"> </el-table-column>
                        <el-table-column align="center" prop="strategyStatus" label="启用状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.strategyStatus === 1" type="success">开启</el-tag>
                                <el-tag v-else type="danger">停用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template #default="{ row }">
                                <el-link
                                    v-if="row.strategyStatus === 1"
                                    class="yellow-link"
                                    @click="enableSingleStrategy(row, 0)"
                                    >停用</el-link
                                >
                                <el-link v-else class="green-link" @click="enableSingleStrategy(row, 1)">启用</el-link>
                                <el-divider direction="vertical" />
                                <el-link
                                    class="blue-link"
                                    :disabled="row.strategyStatus === 1"
                                    @click="editStrategy(row)"
                                    >修改</el-link
                                >
                                <el-divider direction="vertical" />
                                <el-link class="blue-link" @click="viewStrategy(row)">查看</el-link>
                                <el-divider direction="vertical" />
                                <el-link class="red-link" :disabled="row.strategyStatus === 1" @click="handleDel(row)"
                                    >删除</el-link
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination
                    class="mt-4"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="paging.total"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="paging.pageSize"
                    :current-page="paging.pageNum"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    style="float: right"
                ></el-pagination>
            </el-main>
        </section>
    </section>
</template>

<script>
import {
    fetchEnergyStrategyList,
    deleteEnergyStrategy,
    toggleEnergyStrategyStatus,
} from '@/api/energy-saving-strategy';

export default {
    name: 'energySavingStrategy',
    data() {
        return {
            formData: {
                strategyName: '',
                strategyStatus: '',
            },
            tableData: [],
            paging: {
                total: 0,
                pageNum: 1,
                pageSize: 10,
            },
            selectData: [],
        };
    },
    mounted() {
        this.query();
    },
    methods: {
        // 查询
        async query() {
            const res = await fetchEnergyStrategyList(this.formData, this.paging);
            this.tableData = res.data.records;
            this.paging.total = res.data.total;
        },

        // 重置
        reset() {
            this.formData.strategyName = '';
            this.formData.strategyStatus = '';
            this.paging.pageNum = 1;
            this.query();
        },

        sizeChange(size) {
            this.paging.pageNum = 1;
            this.paging.pageSize = size;
            this.query();
        },

        currentChange(page) {
            this.paging.pageNum = page;
            this.query();
        },

        // 启用
        enableStrategy() {
            if (this.selectData.length === 0) {
                this.$message.warning('请先选择策略');
                return;
            }
            const data = {
                id: this.selectData.map((item) => item.id),
                val: 1,
            };
            this.$message.success('批量启用成功');
        },

        // 停用
        disableStrategy() {
            this.$message.success('批量停用成功');
        },

        // 新增策略
        addStrategy() {
            this.$router.push('energySavingStrategySetting');
        },

        // 编辑策略
        editStrategy(item) {
            this.$router.push({
                path: 'energySavingStrategySetting',
                query: { id: item.id, type: 'edit' },
            });
        },

        // 查看策略
        viewStrategy(item) {
            this.$router.push({
                path: 'energySavingStrategySetting',
                query: { id: item.id, type: 'view' },
            });
        },

        // 启用单个策略
        enableSingleStrategy(row, val) {
            const data = {
                id: row.id,
                val: val,
            };
            this.$confirm('此操作将' + (val === 1 ? '启用' : '停用') + '该策略, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                toggleEnergyStrategyStatus(data).then((res) => {
                    if (res.code === 200) {
                        this.$message.success(`${val === 1 ? '启用' : '停用'}成功`);
                        this.query();
                    }
                });
            });
        },

        // 删除策略
        handleDel(item) {
            this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                const res = await deleteEnergyStrategy(item.id);
                if (res.code === 200) {
                    this.query();
                    this.$message.success('删除成功');
                } else {
                    this.$message.error('删除失败');
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep ::-webkit-scrollbar {
    display: block;
}

.el-main {
    height: calc(100vh - 180px);
    padding: 0 20px;
}

::v-deep {
    .th-container-view {
        padding: 0 20px;
        background-color: transparent !important;
    }

    .el-form-item {
        > .el-form-item__label {
            color: #fff;
        }
    }
}

.el-main {
    @include scrollBar;
}

.el-table--scrollable-x .el-table__body-wrapper {
    @include scrollBar;
    // height: 400px !important;
}

</style>
