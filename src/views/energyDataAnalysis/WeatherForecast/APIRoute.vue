<template>
    <wl-main-container data-title="接口管理">
        <div class="interface-management">
            <!-- <el-row class="toolbar">
                <el-col :span="24">
                    <el-form :inline="true" :model="searchForm">
                        <el-form-item label="接口名称">
                            <el-input v-model="searchForm.interfaceName" placeholder="请输入接口名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button round type="primary" icon="el-icon-search" @click="query">查询</el-button>
                            <el-button round type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row> -->
            <el-table :data="tableData" border height="600" style="width: 100%">
                <el-table-column label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column prop='apiName' label='接口名称'>
                </el-table-column>
                <el-table-column prop='requestType' label='接口类型'>
                </el-table-column>
                <el-table-column prop='url' label='接口路径'>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.disable === 0 ? 'success' : 'info'">{{ row.disable === 0 ? '启用' : '禁用'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button type='text' size='small' @click='handleToggleStatus(row)'>
                            {{ row.disable === 0 ? '禁用' : '启用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin-top: 20px;" background layout="prev, pager, next"
                :current-page="paging.pageNo" :page-size="paging.pageSize" :total="paging.total" @size-change="sizeChange"
                @current-change="pageChange">
            </el-pagination>
        </div>
    </wl-main-container>
</template>

<script>
import { getApiPage, updateApi } from './api';

export default {
    name: 'InterfaceManagement',
    data() {
        return {
            searchForm: {
                interfaceName: '',
            },
            tableData: [],
            paging: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    mounted() {
        this.query();
    },
    methods: {
        query() {
            getApiPage({
                pageNo: this.paging.pageNo,
                pageSize: this.paging.pageSize,
            }).then(res => {
                this.tableData = res.data.records;
                this.paging.total = res.data.total;
            });
        },
        reset() {
            this.searchForm.interfaceName = '';
            this.paging.pageNo = 1;
            this.paging.pageSize = 10;
            this.query();
        },
        handleEdit(row) {
            // 编辑操作
        },
        handleDelete(row) {
            // 删除操作
        },
        handleToggleStatus(row) {
            updateApi({
                url: row.url,
                disable: row.disable === 1 ? 0 : 1,
                requestType: row.requestType,
            }).then(
                res => {
                    this.$message.success('操作成功');
                    this.query();
                },
            )
        },
        pageChange(val) {
            this.paging.pageNo = val
            this.query()
        },
        sizeChange(val) {
            this.paging.pageSize = val
            this.query()
        }
    },
};
</script>

<style scoped lang="scss">
.interface-management {
    padding: 10px;

    .toolbar {}
}
</style>
