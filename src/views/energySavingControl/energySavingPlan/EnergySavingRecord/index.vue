<template>
    <section class="box_wrap">
        <el-form :inline="true" :model="queryForm" class="form">
            <el-row>
                <el-col :xl="7" :lg="6" :md="12" :sm="24" :xs="24" style="height:40px">
                    <el-button type="text" round class="backIcon" icon="el-icon-arrow-left" @click="backTo">返回</el-button>
                    <el-form-item label="" class="energyType_select1">
                        <span>{{ buildType === 'WG' ? '武广' : '沪昆' }}节能预案历史记录</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="策略对应日期" class="energyType_select" label-width="120px">
                    <el-date-picker v-model="queryForm.dataDate" align="right" type="date" placeholder="选择日期"
                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="margin-right:20px" />
                </el-form-item>
                <el-form-item label="模式" class="">
                    <el-select v-model="queryForm.mode">
                        <el-option v-for="item in modeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" class="energyType_select">
                    <el-button type="primary" round icon="el-icon-search" @click="query">查询</el-button>
                    <el-button type="primary" round icon="el-icon-refresh-left" @click="reset">重置</el-button>
                    <!-- <el-button type="primary" round icon="el-icon-setting" @click="settingParams">参数配置</el-button> -->
                </el-form-item>
            </el-row>
        </el-form>
        <el-table ref="table" :data="tableData" border class="customTable">
            <el-table-column type="index" align="center" label="序号" width="80" />
            <el-table-column prop="createTime" align="center" label="策略生成时间" width="200px" />
            <el-table-column prop="dataDate" align="center" label="策略对应日期" width="200px" />
            <el-table-column prop="mode" align="center" label="模式">
                <template #default="{ row }">
                    <div>
                        {{ row.mode === 1 ? '制热' : '制冷' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="downTime" align="center" label="下发时间" width="200px" />
            <el-table-column prop="mark" align="center" label="下发状态" min-width="150px">
                <template #default="{ row }">
                    <div v-if="row.downTime">
                        已下发
                    </div>
                    <div v-else>
                        未下发
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120px">
                <template #default="{ row }">
                    <el-link  class="blue-link seeDetail" @click="toDetail(row)">
                        查看详情
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="float:right;margin-top: 20px;" background layout="prev, pager, next"
            :current-page="paging.pageNum" :page-size="paging.pageSize" :total="paging.total" @size-change="sizeChange"
            @current-change="pageChange">
        </el-pagination>
        <DetailModel :data-flag="dataFlag" :data-id="dataId" :data-list="dataList" @close="modalClose"></DetailModel>
        <!-- <ConfigParameters v-show="settingFlag" :data-flag="settingFlag" :build-type="buildType" @close="settingClose">
        </ConfigParameters> -->
    </section>
</template>
<script>
import { fetchEnergySavingPage } from '@/api/energy-saving-plan'
import { getDict } from '@/api/common.js'
import DetailModel from './dialog/DetailModel.vue'
import ConfigParameters from './dialog/ConfigParameters.vue'
export default {
    data() {
        return {
            queryForm: {
                mode: '',
                dataDate: '',
                buildType: '',
            },
            dataFlag: false,
            dataId: '',
            dataList: {},
            tableData: [],
            paging: {
                pageSize: 10,
                pageNo: 1,
                total: 0
            },
            energyMode: [],
            modeOptions: [
                { label: '制冷', value: 0 },
                { label: '制热', value: 1 },
                { label: '全部', value: '' },
            ],
            settingFlag: false,
        }
    },
    components: { DetailModel, ConfigParameters },
    computed: {
        buildType() { return this.$route.params.buildType; },
    },
    created() {
        this.queryForm.buildType = this.buildType;
    },
    mounted() {
        this.getData();
        // this.findDict();
    },
    methods: {
        getData() {
            fetchEnergySavingPage(this.paging, this.queryForm).then(res => {
                if (res && res.data) {
                    this.tableData = res.data.records
                    this.paging.total = res.data.total
                }
            })
        },
        // findDict() {
        //     getDict('energy_type').then(res => {
        //         if (res && res.data) {
        //             this.energyMode = res.data;
        //             console.log('res.data: ', res.data);
        //         }
        //     });
        // },
        settingParams() {
            this.settingFlag = true;
        },
        backTo() {
            this.$router.push({ name: 'EnergySavingPlan', params: { buildType: this.queryForm.buildType } })
        },
        query() {
            this.paging.pageNo = 1;
            this.getData()
        },
        reset() {
            this.queryForm.mode = '';
            this.queryForm.dataDate = '';
            this.paging.pageNo = 1;
            this.paging.pageSize = 10;
            this.getData();
        },
        settingClose() {
            this.settingFlag = false;
        },
        setting() { },
        sizeChange(val) {
            this.paging.pageSize = val
            this.getData()
        },
        pageChange(val) {
            this.paging.pageNo = val
            this.getData()
        },
        toDetail(item) {
            this.dataId = item.id.toString();
            this.dataFlag = true;
        },
        modalClose() {
            this.dataFlag = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.backIcon {
    color: #fff;
    background-color: transparent;
    border: none;
    position: absolute;
}

.energyType_select1 {
    margin-left: 100px;

    span {
        font-size: 18px;
        font-weight: 400;
    }
}

.box_wrap {
    padding: 20px 0;
}

.seeDetail {
    font-size: 16px;
}
.customTable{
    margin: 0 20px;
    width: calc(100% - 40px);
    height: calc(100vh - 280px);
}
</style>