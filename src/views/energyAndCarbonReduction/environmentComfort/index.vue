<!-- 环境舒适度 -->

<template>
    <div class=" h-full">
        <el-card class=" rounded-lg mb-4">
            <div class=" flex items-center">
                <PMVScale :pmv="1" />
            </div>
        </el-card>
        <el-row :gutter="20" style="height: calc(100% - 135px);">
            <el-col :span="16" class="h-full">
                <el-card class="three_box rounded-lg mb-4" style="height: calc(75% - 16px);">
                    <threeD class="h-full" :stationMenus="stationMenus" @change="modelTabChange" />
                </el-card>
                <el-card class="rounded-lg" style="height: 25%;">
                    <div class="card_title mb-5">设备运行状态</div>
                    <div class=" flex items-center justify-between gap-16 mx-5">
                        <div class=" w-1/2" v-for="(item, index) in statusList" :key="index">
                            <!-- 上 -->
                            <div class="top flex items-center justify-between px-2">
                                <div>{{ item.name }}</div>
                                <span>基准：{{ item.baseline }}{{ item.unit }}</span>
                                <span>负荷：{{ item.load }}{{ item.unit }}</span>
                            </div>
                            <div class="middle mt-2 mb-4">
                                <div class="progress-bar">
                                    <div class="progress-inner" :style="barStyle(item)"></div>
                                </div>
                            </div>

                            <!-- 下 -->
                            <div class="bottom">
                                <span class="bottom-item" v-for="(el, i) in item.extra" :key="i">
                                    {{ el.label }}：{{ el.value }}
                                </span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8" class="h-full">
                <el-card class="rounded-lg h-full">
                    <div class=" h-full pb-4">
                        <div style="height: 35%;">
                            <div class="card_title">区域舒适度</div>
                            <div class=" flex" style="height: calc(100% - 30px);">
                                <div class="top_right">
                                    <pmvChart class="chart_box" :num="+1" />
                                </div>
                                <div class=" w-1/2 h-full">
                                    <comfortPieChart :detail-data="75" :title="'环境舒适度'" />
                                </div>
                            </div>
                        </div>
                        <div style="height: auto;">
                            <div class="card_title">环境参数</div>
                            <div class=" flex items-center justify-evenly my-3">
                                <div class=" flex flex-col items-center">
                                    <div class=" flex flex-col items-center mb-2">
                                        <div class=" font-semibold text-base">25.0<span class=" font-normal text-xs">℃</span></div>
                                        <span>温度</span>
                                    </div>
                                    <div class=" flex flex-col items-center">
                                        <div class=" font-semibold text-base">50.0<span class=" font-normal text-xs">%</span></div>
                                        <span>湿度</span>
                                    </div>
                                </div>
                                <el-divider direction="vertical" />
                                <div class=" flex flex-col items-center">
                                    <div class=" flex flex-col items-center mb-2">
                                        <div class=" font-semibold text-base">28.0<span class=" font-normal text-xs">℃</span></div>
                                        <span>室外温度</span>
                                    </div>
                                    <div class=" flex flex-col items-center">
                                        <div class=" font-semibold text-base">60.0<span class=" font-normal text-xs">%</span></div>
                                        <span>室外湿度</span>
                                    </div>
                                </div>
                                <el-divider direction="vertical" />
                                <div class=" flex flex-col items-center">
                                    <div class=" flex flex-col items-center mb-2">
                                        <div class=" font-semibold text-base">高</div>
                                        <span>旅客流量</span>
                                    </div>
                                    <div class=" flex flex-col items-center">
                                        <div class=" font-semibold text-base">平峰</div>
                                        <span>旅客密度</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="height: 36%;">
                            <div class="card_title mb-5">环境趋势</div>
                            <div class=" h-full relative">
                                <div class=" absolute right-2 z-50">
                                    <span class=" cursor-pointer" :class="{ 'active_text': curType === '1' }" @click="curType = '1'">温度 </span>/<span class=" cursor-pointer" :class="{ 'active_text': curType === '2' }" @click="curType = '2'"> 湿度</span>
                                </div>
                                <smoothLineChart :xData="xData" :seriesData="lineData" :curType="curType" />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PMVScale from './components/PMVScale.vue';
import threeD from '@/views/screen/components/threeD/index.vue';
import pmvChart from './components/pmvChart.vue';
import comfortPieChart from './components/comfortPieChart.vue';
import smoothLineChart from './components/smoothLineChart.vue';

export default {
    name: 'EnvironmentComfort',
    components: { PMVScale, threeD, pmvChart, comfortPieChart, smoothLineChart },
    data() {
        return {
            stationMenus: [
                {
                    label: '出站层',
                    value: '1',
                    hideNames: ['武广候车区1-7', '武广候车区8-15', '沪昆候车区16-20', '沪昆候车区21-24', '长沙南屋盖', '武广进站厅', '沪昆站进站厅', '轨道多余部分', '武广线冷冻站', '武广线冷却塔', '沪昆线冷冻站', '沪昆线冷却塔', '沪昆线锅炉房外立面', '沪昆线锅炉房设备'],
                },
                {
                    label: '站台层',
                    value: '2',
                    hideNames: ['长沙南屋盖'],
                },
                {
                    label: '高架层',
                    value: '3',
                    hideNames: ['长沙南屋盖'],
                },
            ],
            statusList: [
                {
                    name: "暖通空调",
                    baseline: 5,
                    load: 2.5,
                    unit: "MWh",
                    gradient: ["#caddfe", "#5b8ff9"],
                    extra: [
                        { label: "运行设备", value: "10台" },
                        { label: "控制模式", value: "节能" },
                        { label: "设置温度", value: "25℃" }
                    ]
                },
                {
                    name: "照明",
                    baseline: 5,
                    load: 4.5,
                    unit: "MWh",
                    gradient: ["#d3e5ab", "#73d13d"],
                    extra: [
                        { label: "运行设备", value: "10台" },
                        { label: "控制模式", value: "全开" },
                        { label: "照度", value: "10Lux" }
                    ]
                },
            ],
            xData: Array.from({ length: 24 }, (_, i) => i),
            lineData: [
                {
                    name: '室内',
                    data: [10, 5, 12, 18, 22, 15, 30, 25, 20, 35, 28, 40, 32, 38, 45, 40, 30, 25, 20, 15, 10, 12, 15, 12],
                },
                {
                    name: '室外',
                    data: [20, 25, 25, 15, 5, 12, 18, 22, 15, 20, 25, 18, 22, 28, 35, 30, 25, 20, 15, 10, 15, 18, 12, 18],
                },
            ],
            curType: '1',
        }
    },
    computed: {
        percent() {
            if (!this.statusList.baseline) return 0;
            return (this.statusList.load / this.statusList.baseline) * 100;
        },
    },
    methods: {
        async modelTabChange(val, station) {
        },
        barStyle(item) {
            const g = item.gradient || ["#5b8ff9", "#85a5ff"];
            const percent = item.baseline ? (item.load / item.baseline) * 100 : 0;
            return {
                width: percent + "%",
                background: `linear-gradient(to right, ${g[0]}, ${g[1]})`
            };
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
    height: 100%;
}

::v-deep .three_box .el-card__body {
    padding: 10px;
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

/* 上 */
.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-weight: 600;
    color: #333;
}


.progress-bar {
    width: 100%;
    height: 10px;
    background: #eaeaea;
    border-radius: 6px;
    overflow: hidden;
}

.progress-inner {
    height: 100%;
    border-radius: 6px;
    transition: width 0.4s ease;
}

.bottom {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: 13px;
    color: #888;
}

.bottom-item {
    width: 33.3%;
    text-align: center;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        display: block;
        width: 1px;
        height: 10px;
        background: #ccc;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    &:last-child::after {
        display: none;
    }
}

.top_right {
    width: 50%;
    height: 100%;
    position: relative;

}

.chart_box {
    width: 100%;
    height: 100%;
}

.content_total {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, -50%);

    .content_num {
        color: #333;
        font-size: 30px;
        font-weight: 600;
        vertical-align: middle;
    }

    .content_unit {
        color: #a9a8a8;
        font-size: 14px;
        margin-top: 6px;
        margin-right: 8px;
    }
}
.active_text { 
    color: #5b8ff9;
    font-weight: 600;
}
</style>