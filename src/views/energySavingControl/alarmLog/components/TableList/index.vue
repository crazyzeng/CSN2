<template>
    <div class="table-list-container">
        <el-table :data="dataList" height="100%" header-cell-class-name="th-table-header-cell"
            @selection-change="handleSelectionChange">
            <el-table-column label type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
            <el-table-column v-if="alarmType == 'warning'" label="告警类别" prop="masterplateName" align="center"
                min-width="120px"></el-table-column>
            <el-table-column v-if="alarmType == 'warning'" label="告警级别" prop="gradeNumName" width="100" align="center">
            </el-table-column>
            <el-table-column
                v-if="alarmType == 'energy-abnormal-early-warning' || alarmType == 'energy-abnormal-warning'"
                label="能耗类别" prop="energyType" align="center">
                <template slot-scope="scope">
                    <div>
                        {{ getEnergyTypeName(scope.row.energyType) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="alarmType == 'energy-warning'" label="区域名称" prop="areaName" width="200"
                align="center">
            </el-table-column>
            <el-table-column v-if="alarmType == 'warning'" label="设备名称" prop="orgName" align="center"
                min-width="120px"></el-table-column>
            <el-table-column v-else label="告警内容" prop="content" align="center"></el-table-column>
            <el-table-column v-if="alarmType == 'energy-warning'" label="处理意见" prop="handleSuggestion"
                align="center"></el-table-column>
            <el-table-column
                v-if="alarmType == 'energy-abnormal-early-warning' || alarmType == 'energy-abnormal-warning'" label="区域"
                prop="area" align="center">
            </el-table-column>
            <el-table-column label="告警时间" prop="alarmDate" width="235" align="center"></el-table-column>
            <el-table-column v-if="alarmType == 'warning'" label="处理时间" prop="handleDate" width="235" align="center">
            </el-table-column>
            <el-table-column
                v-if="alarmType == 'warning' || alarmType == 'system-warning' || alarmType == 'energy-warning'"
                label="解除时间" prop="resolveDate" width="235" align="center">
            </el-table-column>
            <!--  v-if="alarmType == 'warning' || alarmType == 'energy-warning'" -->
            <el-table-column label="告警状态" prop="alarmStatusName" width="100" align="center">
                <template slot-scope="scope">
                    <span :class="alarmStatusClass(scope.row.status)">{{ scope.row.alarmStatusName }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="alarmType == 'warning' || alarmType == 'system-warning'" label="处理人" width="200"
                prop="handleUserName" align="center"></el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-link class="blue-link" v-if="alarmType == 'warning'" type="primary"
                        @click="detail(scope.row.alarmRecordId)">
                        查看
                    </el-link>
                    <el-link :disabled="isDisabled(scope.row.status)" type="warning"
                        :class="alarmType !== 'energy-warning' ? 'th-table-button' : ''" class="dealBtn"
                        @click="handle(scope.row.alarmRecordId)">
                        处理
                    </el-link>
                    <el-link v-if="alarmType !== 'energy-warning'" class="red-link"
                        @click="del(scope.row.alarmRecordId)">
                        删除
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import CommonTableListMixin from '@/mixins/common-table-list-mixin';

export default {
    name: 'TableList',
    mixins: [CommonTableListMixin],
    props: {
        dataList: {
            type: Array,
            default() {
                return [];
            },
        },
        dataOptions: {
            type: Object,
            default() {
                return {
                    deviceType: [],
                };
            },
        },
        alarmType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            energyTypeOptions: [
                { label: 'ENERGY_ElECTRIC', value: '电' },
                { label: 'ENERGY_WATER', value: '水' },
            ]
        }
    },
    computed: {
        isDisabled() {
            return status => status === 'OLD' || status === 'ERROR'
        },
        alarmStatusClass() {
            return data => {
                return data;
            };
        },
    },
    methods: {
        getEnergyTypeName(name) {
            for (let i = 0; i < this.energyTypeOptions.length; i++) {
                if (this.energyTypeOptions[i].label == name) {
                    return this.energyTypeOptions[i].value
                }
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.table-list-container {
    width: 100%;
    height: calc(100vh - 157px);
    min-height: 400px;
    background-color: #fff !important;
    border-radius: 10px;
    // padding: 20px;
    display: flex;
    flex-direction: column;
}

.NEW {
    color: red;
}

.OLD {
    color: rgb(11, 226, 29);
}

.SURE {
    color: orange;
}

.ERROR {}

.view {
    &::before {
        display: none;
    }
}

::v-deep .dealBtn {
    font-size: 14px !important;
}
</style>
