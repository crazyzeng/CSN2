<template>
    <div>
        <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="能耗种类"
                v-if="alarmType !== 'warning' && alarmType !== 'system-warning' && alarmType !== 'energy-warning'">
                <el-select v-model="formData.energyType" placeholder="要查询的告警类别">
                    <el-option v-for="item in energyTypeOptions" :key="item.itemValue" :label="item.itemText"
                        :value="item.itemValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="区域名称" v-if="alarmType === 'energy-warning'">
                <el-input v-model="formData.areaName" placeholder="区域名称">
                </el-input>
            </el-form-item>
            <el-form-item label="告警类别" v-if="alarmType == 'warning'">
                <el-select v-model="formData.masterPlateIds" placeholder="要查询的告警类别">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in dataOptions.warnType" :key="item.code" :label="item.value"
                        :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="告警级别" v-if="alarmType == 'warning'">
                <el-select v-model="formData.alarmLevel" placeholder="要查询的告警级别">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in dataOptions.warnLevel" :key="item.itemValue" :label="item.itemText"
                        :value="item.itemValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="告警状态" v-if="alarmType == 'warning'">
                <el-select v-model="formData.alarmStatus" placeholder="要查询的告警状态">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in dataOptions.warnState" :key="item.itemValue" :label="item.itemText"
                        :value="item.itemValue" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-form-item label="告警日期">
                    <el-date-picker type="date" v-model="formData.queryStartTime" style="width: 160px;"
                        value-format="yyyy-MM-dd" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="至">
                    <el-date-picker type="date" v-model="formData.queryEndTime" style="width: 160px;"
                        value-format="yyyy-MM-dd" placeholder="选择日期" />
                </el-form-item>
            </el-form-item>
            <el-form-item>
                <el-button round type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button round type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            </el-form-item>
            <el-form-item style="margin-right: 0;float:right">
                <el-button v-if="alarmType !== 'energy-warning'" type="primary"
                    @click="dels">批量删除</el-button>
                <el-button type="primary" @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { resetFormData } from '@/utils';
import CommonQueryFromMixin from '@/mixins/common-query-from-mixin';

export default {
    name: 'QueryFrom',
    mixins: [CommonQueryFromMixin],
    props: {
        dataOptions: {
            type: Object,
            default() {
                return {
                    warnType: [],
                    warnLevel: [],
                    warnState: [],
                };
            },
        },
        buttons: {
            type: Array,
            default: [],
        },
        alarmType: {
            type: String,
            default: ''
        }
    },
    data() {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        // 格式化日期为 yyyy-MM-dd 格式
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        return {
            childSystem: [],
            formData: {
                areaName: '',
                orgId: null,
                masterPlateIds: null,
                alarmLevel: null,
                alarmStatus: null,
                queryStartTime: formatDate(oneMonthAgo),  // 默认一个月前
                queryEndTime: formatDate(today),         // 默认今天
                energyType: 'ENERGY_ELECTRIC'//电
            },
            energyTypeOptions: [
                { label: '电', value: 'ENERGY_ELECTRIC' },
                { label: '水', value: 'ENERGY_WATER' },
                { label: '气', value: 'ENERGY_GAS' },
                { label: '热', value: 'ENERGY_HEAT' },
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        reset() {
            resetFormData(this.formData, null);
            this.setDefaultOrgId();
            this.$emit('reset');
        },

        // 设置 默认的 orgId
        setDefaultOrgId() {
            if (Array.isArray(this.childSystem) && this.childSystem.length > 0) {
                this.formData.orgId = this.childSystem[0].orgId;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep {
    .el-select {
        .el-input__inner {
            width: 160px;
        }
    }

    .el-date-editor {
        .el-input__inner {
            width: 160px;
        }
    }
}
</style>
