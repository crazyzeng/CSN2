<!-- 节能策略 -->

<template>
    <div style="height: 100%;">
        <div class="flex items-center justify-between py-2">
            <div class="strategy_card px-6 py-4 rounded-lg shadow-lg flex items-center cursor-pointer"
                :class="{ 'active_card': curStrategy == item.id }" v-for="(item, index) in strategyList" :key="index"
                @click="handleStrategyClick(item)" :style="{
                    background: `linear-gradient(to bottom, ${item.gradient}, #fff)`,
                    '--hover-border': item.hoverBorder,
                    '--card-shadow': item.shadow
                }">
                <img class=" ml-6 mr-5" :src="item.icon" width="80px" height="80px" />
                <div class="flex flex-col text-gray-700 text-sm">
                    <div><span class=" text-3xl font-bold mr-1">{{ item.value }}</span>条</div>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div class="mt-4 rounded-lg shadow-lg bg-white py-5" style="height: calc(100% - 145px);">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="(el, index) in tabsList" :key="index" :label="el.label"
                    :name="el.name"></el-tab-pane>
            </el-tabs>

            <div class=" flex justify-between py-3 px-8 text-gray-800"
                style="height: calc(100% - 50px); overflow: auto;">
                <div class="w-2/5 flex flex-col items-center">
                    <img :src="currentImg" height="100%" alt="">
                    <div class="mt-5" v-if="currentImg">策略流程图</div>
                </div>
                <div style="width: 55%;">
                    <el-form ref="form" :model="formData" label-position="left">
                        <el-form-item :label="currentLabel">
                            <el-switch v-model="formData.control" active-color="#3c6dfe" inactive-color="#bfbfbf"
                                active-text="启动" inactive-text="停止">
                            </el-switch>
                        </el-form-item>
                        <div class="card_title my-6">参数调节</div>
                        <!-- 动态参数区域 -->
                        <component :is="currentComponent" v-model="formData" />

                        <div class="card_title mt-10 mb-5">执行日历</div>
                        <el-form-item label="选择日期">
                            <el-date-picker v-model="formData.date" type="month" placeholder="选择日期"
                                style="width: 160px;">
                            </el-date-picker>
                        </el-form-item>
                        <div class=" w-full flex items-center mt-8">
                            <div class="arrowIcon" @click="scrollLeft">
                                <i class="el-icon-arrow-left"></i>
                            </div>
                            <div class="listContainer" ref="listRef">
                                <div class="itemBox px-4 py-5" v-for="(item, index) in dateList" :key="index">
                                    <div>{{ item.date }}</div>
                                    <img :src="getStatusIcon(item.status)" alt="">
                                </div>
                            </div>
                            <div class="arrowIcon" @click="scrollRight">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ZLImg from '@/assets/energy/制冷.png'
import ZRImg from '@/assets/energy/制热.png'
import ZMImg from '@/assets/energy/照明.png'
import SYImg from '@/assets/energy/商业.png'
import TYImg from '@/assets/energy/通用.png'
import runningIcon from '@/assets/energy/正常.png'
import warningIcon from '@/assets/energy/异常.png'
import stopIcon from '@/assets/energy/未执行.png'
import { STRATEGY_MAP } from './data/strategyList'
import CoolingAddReduce from './components/CoolingAddReduce.vue'
import CoolingStart from './components/CoolingStart.vue'
import CoolingStop from './components/CoolingStop.vue'
import CoolingPump from './components/CoolingPump.vue'
import CoolingCoolingPump from './components/CoolingCoolingPump.vue'
import HeatStart from './components/HeatStart.vue'
import HeatStop from './components/HeatStop.vue'
import IndoorLighting from './components/IndoorLighting.vue'
import OutdoorLighting from './components/OutdoorLighting.vue'

export default {
    name: "EnergyStrategy",
    components: { CoolingAddReduce, CoolingStart, CoolingStop, CoolingPump, CoolingCoolingPump, HeatStart, HeatStop, IndoorLighting, OutdoorLighting },

    data() {
        return {
            strategyList: [
                {
                    id: 1,
                    name: "制冷策略",
                    icon: ZLImg,
                    value: "5",
                    gradient: "#e6efff",
                    hoverBorder: "#86a3f8",
                    shadow: "0 6px 16px rgba(134,163,248,0.18)"
                },
                {
                    id: 2,
                    name: "制热策略",
                    icon: ZRImg,
                    value: "2",
                    gradient: "#fcf3e3",
                    hoverBorder: "#fec76f",
                    shadow: "0 6px 16px rgba(254,199,111,0.20)"
                },
                {
                    id: 3,
                    name: "照明策略",
                    icon: ZMImg,
                    value: "2",
                    gradient: "#eee6fe",
                    hoverBorder: "#d7c3fd",
                    shadow: "0 6px 16px rgba(215,195,253,0.20)"
                },
                // {
                //     id: 4,
                //     name: "商业策略",
                //     icon: SYImg,
                //     value: "24",
                //     gradient: "#f7ffe6",
                //     hoverBorder: "#c0e88e",
                //     shadow: "0 6px 16px rgba(192,232,142,0.20)"
                // },
                // {
                //     id: 5,
                //     name: "通用策略",
                //     icon: TYImg,
                //     value: "21",
                //     gradient: "#e6f9ff",
                //     hoverBorder: "#9fdef3",
                //     shadow: "0 6px 16px rgba(159,222,243,0.20)"
                // },
            ],
            curStrategy: 1,
            activeName: '1',
            value: '启动',
            radio: '1',
            formData: {
                control: true, //启动
                adjust: true, //参数调节
                reduce: '1', //单日启动
                loadLimit: 92, //负载上限
                loadLover: 65.0,  //负载下限
                waterTemp: 8.0,  //水温
                machineTime: 15,  //加减机时间
                isTemp: false,
                temp: 24.0,  // 舒适温度
                isHumidity: false,
                humidity: 40.0,  // 湿度
                returnTemp: 20.0,  //回水温度
                startTime: '2026.03.15',  //启动时间
                endTime: '2026.03.16',  //关机时间
                runningFreq: 40,  //运行频率
                pressure: 140, //压差
                lowerFreq: 120, // 最低运行频率
                higherFreq: 160, // 最高运行频率
                sunRunningTime: ['08:00', '18:00'],  //日间运行时间
                summerRunningTime: ['08:00', '18:00'],  // 夏秋季日照时间
                winterRunningTime: ['08:00', '18:00'],  // 冬春季日照时间
                morningSetting: 25,  // 早晨照明设定挡位
                daySetting: 25, // 日间照明设定挡位
                nightSetting: 25,  // 夜间照明设定挡位
                darkNightSetting: 25, //深夜照明设定挡位
                date: ''
            },
            dateList: [
                { date: '2026-03-15', status: 1 },
                { date: '2026-03-16', status: 2 },
                { date: '2026-03-17', status: 3 },
                { date: '2026-03-18', status: 1 },
                { date: '2026-03-19', status: 1 },
                { date: '2026-03-20', status: 1 },
                { date: '2026-03-21', status: 2 },
                { date: '2026-03-22', status: 3 },
                { date: '2026-03-23', status: 1 },
            ],
            scrollStep: 130
        };
    },
    computed: {
        tabsList() {
            return STRATEGY_MAP[this.curStrategy]?.tabs || []
        },
        currentComponent() {
            const tab = this.tabsList.find(t => t.name === this.activeName)
            return tab?.component || null
        },
        currentTabIdx() {
            return this.tabsList.findIndex(t => t.name === this.activeName)
        },
        currentLabel() {
            return STRATEGY_MAP[this.curStrategy]?.tabs[this.currentTabIdx]?.title || ''
        },
        currentImg() {
            return STRATEGY_MAP[this.curStrategy]?.tabs[this.currentTabIdx]?.image || ''
        }
    },
    methods: {
        handleStrategyClick(item) {
            this.curStrategy = item.id
            this.activeName = STRATEGY_MAP[this.curStrategy]?.tabs[0]?.name
        },
        scrollLeft() {
            const el = this.$refs.listRef
            el.scrollBy({
                left: -this.scrollStep * 3,
                behavior: 'smooth'
            })
        },

        scrollRight() {
            const el = this.$refs.listRef
            el.scrollBy({
                left: this.scrollStep * 3,
                behavior: 'smooth'
            })
        },

        getStatusIcon(status) {
            if (status == 1) return runningIcon
            if (status == 2) return warningIcon
            return stopIcon
        }
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav {
    margin-left: 50px;
}

::v-deep .el-tabs__nav-wrap::after {
    background-color: #e5e9fb !important;
}

::v-deep .el-form-item__label {
    font-weight: 600;
    color: #444;
    margin-right: 10px;
}

::v-deep .el-form-item {
    display: flex;
    align-items: center;
}

::v-deep .el-form-item__content {
    display: flex;
    align-items: center;
    margin-left: 0 !important;
}

::v-deep .el-input-number--mini {
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    border-radius: 2px !important;
}

::v-deep .el-input--mini .el-input__inner {
    border-radius: 2px !important;
}

::v-deep .el-date-editor {
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
}

::v-deep .el-form-item--mini.el-form-item {
    margin-bottom: 20px !important;
}

.strategy_card {
    width: 32%;
    transition: all 0.3s ease;
    box-shadow: var(--card-shadow);
    outline: 2px solid transparent;
    outline-offset: 0;

    &:hover {
        transform: translateY(-4px);
        outline: 2px solid var(--hover-border);
        box-shadow: var(--card-shadow), 0 8px 20px rgba(0, 0, 0, 0.08);
    }
}

.active_card {
    box-shadow: var(--card-shadow), 0 8px 20px rgba(0, 0, 0, 0.08);
    outline: 2px solid var(--hover-border);
}

.card_title {
    width: 237px;
    height: 24px;
    background-image: url("../../../assets/home/titBg.png");
    background-repeat: no-repeat;
    padding-left: 35px;
    font-weight: bold;
    color: #444;
    line-height: 25px;
    font-size: 14px;
    letter-spacing: 2px;
}

/* 横向滚动核心 */
.listContainer {
    display: flex;
    overflow-x: auto;
    width: calc(100% - 80px);
    scroll-behavior: smooth;
    padding: 6px;
    margin: 0 14px;
}

/* 隐藏滚动条 */
.listContainer::-webkit-scrollbar {
    display: none;
}

.arrowIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(90, 151, 250, 0.3);
    cursor: pointer;

    i {
        font-size: 20px;
    }
}

.itemBox {
    flex-shrink: 0;
    /* 必须有，不然会被压缩 */
    // width: 120px;
    // height: 150px;
    margin: 0 5px;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.date {
    margin-bottom: 10px;
}
</style>