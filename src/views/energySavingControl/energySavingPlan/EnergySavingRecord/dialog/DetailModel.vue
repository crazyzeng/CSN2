<template>
    <el-dialog :visible.sync="dataFlag" :title="curTitle" width="1330px" height="100%" :before-close="handleBeforeClose">
        <template #header>
            <el-divider class="curDivider" direction="vertical" />
            <span class="el-dialog__title">{{ curTitle }}</span>
        </template>
        <div class="flex justify-between">
            <span class="title">调度下发策略</span>
            <span class="title">总负荷{{ dispatchSum.toFixed(2) }} kW·h</span>
        </div>
        <BarChart3 ref="bar3" class="bar3 w-full h-full" :bar-data="barDataDispatch" />
        <!-- <span class="title">机组执行策略</span>
        <BarChart4 ref="bar4" class="bar4 w-full h-full" :bar-data="barDataCrew" /> -->
        <div class="flex justify-between">
            <span class="title">机组监测数据</span>
            <span class="title">总负荷{{ crewSum.toFixed(2) }} kW·h</span>
        </div>
        <BarChart5 ref="bar4" class="bar4 w-full h-full" :bar-data="barMonitor" />
    </el-dialog>
</template>

<script>
import BarChart3 from '../../charts/bar3.vue'
import BarChart4 from '../../charts/bar4.vue'
import BarChart5 from '../../charts/bar5.vue'
import { fetchEnergySavingDetail } from '@/api/energy-saving-plan'

export default {
    components: { BarChart3, BarChart4, BarChart5 },
    props: {
        dataFlag: {
            type: Boolean,
            default: false
        },
        dataList: {
            type: Object,
            default: {}
        },
        dataId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            curTitle: '',
            barDataDispatch: [],
            barDataCrew: [],
            barMonitor: [],
            dispatchSum: 0,
            crewSum: 0,
        }
    },
    mounted() {
        this.dataId ?? this.getData()
    },
    watch: {
        dataId: function (val) {
            if (val) this.getData()
        }
    },
    methods: {
        handleBeforeClose() {
            this.$emit('close')
        },
        getData() {
            fetchEnergySavingDetail(this.dataId).then(res => {
                if (res && res.data) {
                    const { actualEnergy, actualNum, predict } = res.data
                    this.barDataDispatch = predict;
                    this.barDataCrew = actualNum;
                    this.barMonitor = actualEnergy;
                    this.dispatchSum = 0;
                    this.crewSum = 0;
                    predict.forEach(v => { this.dispatchSum += parseInt(v.energy.reduce((prev, item) => item + prev)); })
                    this.crewSum = actualEnergy.reduce((prev, item) => item + prev)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-input__inner) {
    width: 212px;
}

.title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #fff;
}
</style>
