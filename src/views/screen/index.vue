<template>
    <div class="content_warp">
        <section class="left_warp">
            <!-- 统计卡片 -->
            <el-card class="top_area" body-style="padding: 0 15px 0 0; border-radius: 20px;">
                <div class="flex items-center">
                    <!-- 左侧tab -->
                    <div class="tab-container relative flex flex-col py-5">
                        <div class="absolute right-0 bg-blue-500 rounded transition-all duration-300"
                            :style="indicatorStyle"></div>

                        <div v-for="(item, index) in tabs" :key="item.value" @click="changeTab(item.value)"
                            class="relative w-8 px-1 py-2 text-center cursor-pointer transition-all text-sm"
                            :class="activeTab === item.value ? 'text-blue-500 font-medium' : 'text-gray-500'">
                            {{ item.label }}
                        </div>
                    </div>
                    <!-- 右侧统计 -->
                    <div class="flex flex-1 gap-3 ml-4">
                        <div v-for="(card, index) in cards" :key="card.title"
                            class="flex-1 px-4 py-6 rounded-xl relative overflow-hidden"
                            :style="{ backgroundColor: card.bg }">
                            <img :src="card.img" width="76px" height="107px" class="absolute right-0 bottom-0 z-0" />
                            <div class="relative z-10 flex items-center justify-evenly">
                                <div class="flex flex-col">
                                    <div class="text-base text-black">
                                        <span>{{ activeTab == 'month' ? '月度' : '年度' }}</span>{{ card.title }}
                                    </div>
                                    <div class="flex items-end mt-2 text-2xl font-semibold">
                                        {{ card.value || '--' }}
                                        <span class="text-xs ml-1 text-gray-500 mb-1">
                                            {{ card.unit }}
                                        </span>
                                    </div>
                                </div>
                                <!-- 中间竖线 -->
                                <div class="mx-4 h-6 w-px bg-gray-300"></div>
                                <!-- 右侧模块 -->
                                <div class="flex flex-col">
                                    <div v-if="card.compare" class="text-base text-black font-medium">
                                        <span v-if="index != 2">{{ activeTab == 'month' ? '月度' : '年度' }}</span>{{
                                            card.compare.label }}
                                        <span class="text-xs" :style="{ color: `${card.compare.color}` }">
                                            {{ card.compare.value || '--' }}
                                        </span>
                                    </div>
                                    <div v-if="card.extra" class="flex items-end mt-2 text-2xl font-semibold">
                                        {{ card.extra.value || '--' }}
                                        <span class="text-xs ml-1 text-gray-500 mb-1">
                                            {{ card.extra.unit }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
            <!-- 三维模型 -->
            <el-card class="model_area relative">
                <threeD :stationMenus="stationMenus" @change="modelTabChange" />
            </el-card>
            <!-- 监测数据卡片--其他站台 -->
            <div v-if="curModelTab == 1">
                <el-card class="w-full h-full">
                    <div class="w-full h-full flex items-center justify-between">
                        <div class="w-6/12 flex items-center justify-between">
                            <div class="w-1/12 flex flex-col justify-evenly font-semibold pl-3">
                                <span>分</span><span>区</span><span>节</span><span>能</span>
                            </div>
                            <div class="h-24 w-2/12 mx-2">
                                <RatioPieChart title="环境舒适度" :percent="85" />
                            </div>
                            <div class="w-9/12 flex justify-around items-center">
                                <!-- <div class="w-full flex items-center mb-2">
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">{{ newTempData.temperature }} <span class="text-sm">°c</span></div>
                                        <span class="text-sm">温度</span>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">20.0<span class="text-sm">PPM</span></div>
                                        <span class="text-sm">CO2</span>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">+1<span class="text-sm">%</span></div>
                                        <span class="text-sm">节能率</span>
                                    </div>
                                    <el-divider direction="vertical" class="hidden_line"></el-divider>
                                    <div class="flex-1"></div>
                                </div>
                                <div class="w-full flex items-center">
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">{{ newTempData.humidity }} <span class="text-sm">%</span></div>
                                        <span class="text-sm">湿度</span>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">
                                            25.0 <span class="text-sm">μ/m3</span>
                                        </div>
                                        <span class="text-sm">PM2.5</span>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">高</div>
                                        <span class="text-sm">旅客流量</span>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1 flex flex-col items-center">
                                        <div class="font-semibold text-base">高</div>
                                        <span class="text-sm">旅客密度</span>
                                    </div>
                                </div> -->
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-base mr-4">温度</span>
                                        <div class="font-semibold text-base">{{ newTempData.temperature }} <span
                                                class="text-sm">°c</span></div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-base mr-4">湿度</span>
                                        <div class="font-semibold text-base">{{ newTempData.humidity }} <span
                                                class="text-sm">%</span></div>
                                    </div>
                                </div>
                                <div class="">
                                    <div class="text-base">当年节能率</div>
                                    <div class="font-semibold text-base">{{ newTempData.yearRate > 0 ? '+' : '-' }}{{
                                        newTempData.yearRate }}<span class="text-sm">%</span></div>
                                </div>
                                <div class="">
                                    <div class="text-base">累计节能率</div>
                                    <div class="font-semibold text-base">{{ newTempData.allRate > 0 ? '+' : '-' }}{{
                                        newTempData.allRate }}<span class="text-sm">%</span></div>
                                </div>
                            </div>
                        </div>
                        <div class=" line"></div>
                        <div class="w-6/12 h-full flex items-center justify-between">
                            <div class="flex flex-col items-center ml-4">
                                <div class="relative">
                                    <img src="@/assets/home/saveEnergy.png" width="80px" alt="" />
                                    <span class="absolute top-7 left-6 text-white font-semibold">节能</span>
                                </div>
                                <span>策略模式</span>
                            </div>
                            <div class="flex flex-col items-center ml-2">
                                <div>
                                    <div class="font-semibold text-base">-10<span class="text-sm">%</span></div>
                                    <span class="text-sm">动态调温</span>
                                </div>
                                <div>
                                    <div class="font-semibold text-base">-10<span class="text-sm">%</span></div>
                                    <span class="text-sm">照明调节</span>
                                </div>
                            </div>
                            <div class="w-4/6 h-full" style="height: 100%">
                                <SparkLine color="#5B8FF9" :chartData="[20, 40, 35, 60, 55, 30, 70, 65, 80, 75]" />
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <!-- 监测数据卡片--能源站 -->
            <div v-if="curModelTab == 2" class="monitor_area flex items-center justify-between">
                <el-card class="" style="width: 38%">
                    <div class="mb-2">
                        {{ curStationName == '武广' || curStationName == '沪昆' ? '水系统监测' : '热源系统监测' }}
                    </div>
                    <div class="flex items-center justify-between gap-3 mb-2">
                        <div v-for="(item, index) in curDataList" :key="index"
                            class="flex items-center px-3 py-5 rounded-md shadow-md" :style="{
                                background: `linear-gradient(to bottom, rgba(${item.bgColor}, 0.9), rgba(${item.bgColor}, 0.2))`,
                                width: 'calc(50% - 5px)',
                            }">
                            <!-- 左侧名称 -->
                            <span v-show="item.name" class="text-xs w-4 mr-3 leading-[14px]">
                                {{ item.name }}
                            </span>

                            <!-- 右侧动态指标 -->
                            <div class="flex flex-1 items-center justify-center">
                                <div class="flex items-center justify-around w-full">
                                    <template v-for="(sub, i) in item.values" :key="'item-' + i">
                                        <div class="flex flex-col items-center">
                                            <div class="text-sm font-semibold whitespace-nowrap">
                                                {{ sub.value }}
                                                <span class="text-xs font-normal">{{ sub.unit }}</span>
                                            </div>
                                            <div class="text-sm whitespace-nowrap">{{ sub.label }}</div>
                                        </div>
                                        <div v-if="i !== item.values.length - 1" :key="'line-' + i"
                                            class="h-4 w-px mx-2 bg-gray-300"></div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <el-card v-if="curStationName == '锅炉房' || curStationName == '风冷热泵'" style="width: 32%; height: 100%">
                    <div class="mb-2">运行监测</div>
                    <div class="flex items-center justify-between gap-3 mb-2">
                        <div v-for="(item, index) in curRunningDataList" :key="index"
                            class="flex items-center px-3 py-5 rounded-md shadow-md" :style="{
                                background: `linear-gradient(to bottom, rgba(${item.bgColor}, 0.9), rgba(${item.bgColor}, 0.2))`,
                                width: 'calc(50% - 5px)',
                            }">
                            <!-- 左侧名称 -->
                            <span v-show="item.name" class="text-xs w-4 mr-3 leading-[14px]">
                                {{ item.name }}
                            </span>

                            <!-- 右侧动态指标 -->
                            <div class="flex flex-1 items-center justify-center">
                                <div class="flex items-center justify-around w-full">
                                    <template v-for="(sub, i) in item.values" :key="'item-' + i">
                                        <div class="flex flex-col items-center">
                                            <div class="text-sm font-semibold whitespace-nowrap">
                                                {{ sub.value }}
                                                <span class="text-xs font-normal">{{ sub.unit }}</span>
                                            </div>
                                            <div class="text-sm whitespace-nowrap">{{ sub.label }}</div>
                                        </div>
                                        <div v-if="i !== item.values.length - 1" :key="'line-' + i"
                                            class="h-4 w-px mx-2 bg-gray-300"></div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
                <template v-if="curStationName == '武广' || curStationName == '沪昆'">
                    <el-card class="" v-for="(item, index) in roomDataList" :key="index"
                        style="width: 30%; height: 100%">
                        <!-- <div class="mb-1">机房用电量</div> -->
                        <div class="flex items-center justify-between relative" style="height: 100%">
                            <!-- 左侧 -->
                            <!-- <div class=" w-32 "> </div> -->
                            <div class="absolute top-0">
                                <div class="text-gray-800 text-sm fon">{{ item.title }}</div>

                                <div class="text-2xl font-semibold mt-1">
                                    {{ item.value }}
                                    <span class="text-sm font-normal text-gray-500">{{ item.unit }}</span>
                                </div>

                                <div class="flex flex-col text-sm text-gray-500 mt-1">
                                    <div class="flex" v-for="el in item.sub" :key="el.label">
                                        <span class="flex w-10">{{ el.label }}</span> {{ el.value }}
                                    </div>
                                </div>
                            </div>
                            <!-- 右侧图 -->
                            <div class="absolute" style="width: 80%; height: 100%; right: -10px">
                                <SparkLine :color="item.color" :chartData="item.data" />
                            </div>
                        </div>
                    </el-card>
                </template>
                <el-card v-else style="width: 28%; height: 100%">
                    <div class="flex items-center justify-between relative" style="height: 100%">
                        <div class="absolute top-0">
                            <div class="text-gray-800 text-sm fon">{{ curStationName == '锅炉房' ? '锅炉' : '风冷热泵' }}用电量
                            </div>

                            <div class="text-2xl font-semibold mt-1">
                                {{ 2000.0 }}
                                <span class="text-sm font-normal text-gray-500">kWh</span>
                            </div>

                            <div class="flex flex-col text-sm text-gray-500 mt-1">
                                <div class="flex">
                                    <span class="flex w-10">基准</span> +10%
                                </div>
                                <div class="flex">
                                    <span class="flex w-10">节能</span> +10%
                                </div>
                            </div>
                        </div>
                        <!-- 右侧图 -->
                        <div class="absolute" style="width: 80%; height: 100%; right: -10px">
                            <SparkLine color="#5B8FF9" :chartData="[20, 40, 35, 60, 55, 30, 70, 65, 80, 75]" />
                        </div>
                    </div>
                </el-card>
            </div>
        </section>
        <section class="right_warp">
            <el-card class-name="" style="height: 40%">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="card_title">基准负荷</div>
                    </div>
                    <div class="flex items-center">
                        <div v-if="baseLoad.seasonType == 1" class="iconImg">
                            <img src="@/assets/home/gl.png" alt="" />冷季
                        </div>
                        <div v-if="baseLoad.seasonType == 2" class="iconImg">
                            <img src="@/assets/home/gr.png" alt="" />供热
                        </div>
                        <div v-if="baseLoad.seasonType == 3" class="iconImg">
                            <img src="@/assets/home/gdj.png" alt="" />过渡季
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-around">
                    <div class="flex items-center flex-nowrap whitespace-nowrap">
                        <span class="text-base text-gray-500">季度基准</span>
                        <el-divider direction="vertical"></el-divider>
                        <div class="flex items-center text-base">
                            <span class="text-xl font-bold">{{ baseLoad.monthBenchmark || '--' }}</span>
                            <span class="mt-1">kWh</span>
                        </div>
                    </div>
                    <div class="flex items-center flex-nowrap whitespace-nowrap">
                        <span class="text-base text-gray-500">当月基准</span>
                        <el-divider direction="vertical"></el-divider>
                        <div class="flex items-center text-base">
                            <span class="text-xl font-bold">{{ baseLoad.dayBenchmark || '--' }}</span>
                            <span class="mt-1">kWh</span>
                        </div>
                    </div>
                </div>
                <div class="data_link text-sm text-blue-400 cursor-pointer" @click="hangleLink">
                    ( 算法调节 +{{ baseLoad.benchmarkChange || '--' }}% )
                </div>
                <div class=" h-4"></div>
                <div class="" style="height: calc(100% - 90px)">
                    <TriblePieChart :chartData="chartData1" />
                </div>
            </el-card>

            <el-card style="height: 60%">
                <!-- 当季负荷 -->
                <div v-if="!isShowAlgorithm" class="flex flex-col" style="height: 100%">
                    <div class="flex items-center justify-between">
                        <div class="card_title">当季负荷</div>
                        <el-radio-group class="radio_btn" v-model="curType" @change="handleTypeChange">
                            <el-radio-button label="ELECTRIC">电</el-radio-button>
                            <el-radio-button label="WATER">水</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div>
                        <div class="flex items-center mt-3 ml-2">
                            <span class="text-lg text-gray-500">冷季进度</span>
                            <el-divider direction="vertical"></el-divider>
                            <div class="flex items-center text-base">
                                <span class="text-2xl font-bold">{{ seasonalLoad.searonCur }}</span>
                                <span class="mt-1">天/{{ seasonalLoad.seasonProgress }}天（5月-9月）</span>
                            </div>
                        </div>
                        <div class="flex items-center mt-2 ml-2">
                            <span class="text-lg text-gray-500">{{
                                curType == 'ELECTRIC' ? '当日负荷' : '当日用水'
                                }}</span>
                            <el-divider direction="vertical"></el-divider>
                            <div class="flex items-center text-base">
                                <span class="text-2xl font-bold">{{ seasonalLoad.dayEnergy }}</span>
                                <span class="mt-1">{{ curType == 'ELECTRIC' ? 'kWh' : '万吨' }}</span>
                                <!-- <span class=" text-sm text-blue-400 mt-1 ml-1">( 节能10% )</span> -->
                            </div>
                        </div>
                    </div>
                    <div v-if="curType == 'ELECTRIC'" style="width: 100%; height: calc(100% - 110px)">
                        <div class="w-full flex items-center" style="height: 45%;">
                            <div class="w-1/2 h-full">
                                <TriblePieChart2 :chartData="chartData2" />
                            </div>
                            <div class="chartData right-0 top-2">
                                <div class="legend-header">
                                    <span></span>
                                    <span></span>
                                    <span>当季负荷</span>
                                    <span>节能率</span>
                                </div>
                                <div class="legend-item" v-for="(item, index) in chartData2" :key="item.name">
                                    <div class="marker" :style="{ backgroundColor: `${colors[index]}` }"></div>
                                    <span class="name">{{ item.name }}</span>
                                    <span class="value text-center">{{ item.value ? item.value + 'kWh' : '--' }}</span>
                                    <span class="item_percent text-center">{{
                                        item.percent ? '(' + (item.percent > 0 ? '+' : '-') + '%)' : '--'
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <div style="height: 55%">
                            <StackBarChart :chartData="chartData3" />
                        </div>
                    </div>
                    <div v-else style="width: 100%; height: calc(100% - 130px)">
                        <div style="height: 40%">
                            <WaterBarChart :data="barData" />
                        </div>
                        <div style="height: 60%">
                            <WaterLineChart :xData="xData" :seriesData="lineData" />
                        </div>
                    </div>
                </div>

                <!-- 环境预测算法 -->
                <div v-else class="h-full">
                    <div class="flex items-center justify-between">
                        <div class="card_title">环境预测算法</div>
                        <el-button type="primary" size="mini" icon="el-icon-arrow-left"
                            @click="isShowAlgorithm = false">返回</el-button>
                    </div>
                    <div style="width: 100%; height: calc(100% - 30px)">
                        <div style="height: 45%">
                            <DoubleLineChart title="温度距平" diffText="+30%" :months="months" :historyData="tempHistory"
                                :currentData="tempCurrent" :historyAvg="23" :currentAvg="25" unit="℃" historyName="历史温度"
                                currentName="当季温度" />
                        </div>
                        <div style="height: 55%">
                            <DoubleLineChart title="客流距平" diffText="-10%" :months="months" :historyData="peopleHistory"
                                :currentData="peopleCurrent" :historyAvg="600" :currentAvg="500" unit="人次"
                                historyName="历史客流" currentName="当季客流" />
                        </div>
                    </div>
                </div>
            </el-card>
        </section>
    </div>
</template>

<script>
import electricImg from '@/assets/home/electric.png';
import waterImg from '@/assets/home/water.png';
import treeImg from '@/assets/home/tree.png';
import SparkLine from '@/components/Echarts/SparkLine.vue';
import TriblePieChart from '@/components/Echarts/TriblePieChart.vue';
import TriblePieChart2 from '@/components/Echarts/TriblePieChart2.vue';
import StackBarChart from '@/components/Echarts/StackBarChart.vue';
import threeD from '@/views/screen/components/threeD/index.vue';
import DoubleLineChart from '@/components/Echarts/DoubleLineChart.vue';
import WaterBarChart from '@/components/Echarts/WaterBarChart.vue';
import WaterLineChart from '@/components/Echarts/WaterLineChart.vue';
import RatioPieChart from '@/components/Echarts/RatioPieChart.vue';
import {
    getTotalUsageData,
    getTodayColdUsageData,
    getTodayItemUsageData,
    getTodayItemUsageBaseData,
    handleNewTempData,
    getAreaSavingData,
} from '@/api/newHome';

export default {
    name: 'screen',
    components: {
        SparkLine,
        TriblePieChart,
        TriblePieChart2,
        StackBarChart,
        threeD,
        DoubleLineChart,
        WaterBarChart,
        WaterLineChart,
        RatioPieChart,
    },

    data() {
        return {
            activeTab: 'month',
            curArea: 'NY',
            curStation: 'WG',
            tabs: [
                { label: '月度', value: 'month' },
                { label: '年度', value: 'year' },
            ],
            activeIndex: null,
            cards: [
                {
                    title: '用电量',
                    value: '4580.07',
                    unit: 'kWh',
                    img: electricImg,
                    bg: '#fff6e7',
                    compare: {
                        label: '节电量',
                        value: '+10.5%',
                        color: '#fd7670',
                    },
                    extra: {
                        value: '900.07',
                        unit: 'kWh',
                    },
                },
                {
                    title: '用水量',
                    value: '1028.23',
                    unit: '万吨',
                    img: waterImg,
                    bg: '#f0e8ff',
                    compare: {
                        label: '环比',
                        // value: '-4.5%',
                        color: '#a5cd52',
                    },
                    extra: {
                        value: '50%',
                        // unit: '万吨'
                    },
                },
                {
                    title: '碳减排',
                    value: '124.53',
                    unit: 'kgco2',
                    img: treeImg,
                    bg: '#f6fbe3',
                    compare: {
                        label: '等效植树',
                    },
                    extra: {
                        value: '25',
                        unit: '棵',
                    },
                },
            ],
            lists: [
                {
                    name: '冷冻水',
                    bgColor: '230, 239, 255',
                    values: [
                        { label: '供水温度', value: '25.0', unit: '°c' },
                        { label: '回水温度', value: '25.0', unit: '°c' },
                        { label: '压力', value: '30', unit: 'Pa' },
                    ],
                },
                {
                    name: '冷却水',
                    bgColor: '238, 230, 254',
                    values: [
                        { label: '供水温度', value: '25.0', unit: '°c' },
                        { label: '回水温度', value: '25.0', unit: '°c' },
                        { label: '压力', value: '30', unit: 'Pa' },
                    ],
                },
            ],
            lists2: [
                {
                    bgColor: '230, 239, 255',
                    values: [
                        { label: '锅炉进水温度', value: '25.0', unit: '°c' },
                        { label: '锅炉进水压力', value: '30', unit: 'Pa' },
                    ],
                },
                {
                    bgColor: '238, 230, 254',
                    values: [
                        { label: '锅炉出水温度', value: '25.0', unit: '°c' },
                        { label: '锅炉出水压力', value: '30', unit: 'Pa' },
                    ],
                },
            ],
            lists3: [
                {
                    bgColor: '230, 239, 255',
                    values: [
                        { label: '锅炉总量', value: '3', unit: '台' },
                        { label: '锅炉运行', value: '2', unit: '台' },
                    ],
                },
                {
                    bgColor: '238, 230, 254',
                    values: [
                        { label: '热水泵总量', value: '4', unit: '台' },
                        { label: '热水泵运行', value: '3', unit: '台' },
                    ],
                },
            ],
            lists4: [
                {
                    bgColor: '230, 239, 255',
                    values: [
                        { label: '风冷热泵总量', value: '3', unit: '台' },
                        { label: '风冷热泵运行', value: '2', unit: '台' },
                    ],
                },
                {
                    bgColor: '238, 230, 254',
                    values: [
                        { label: '热水泵总量', value: '4', unit: '台' },
                        { label: '热水泵运行', value: '3', unit: '台' },
                    ],
                },
            ],
            roomDataList: [
                {
                    title: '机房用电量',
                    value: '2000.10',
                    unit: 'kWh',
                    sub: [
                        { label: '基准', value: '+10%' },
                        { label: '节能', value: '+10%' },
                    ],
                    color: '#5B8FF9',
                    data: [20, 40, 35, 60, 55, 30, 70, 65, 80, 75],
                },
                {
                    title: '机房制冷量',
                    value: '1500.10',
                    unit: 'kWh',
                    sub: [
                        { label: 'COP', value: '1.2' },
                        { label: 'EER', value: '2.2' },
                    ],
                    color: '#7CB305',
                    data: [15, 30, 20, 40, 50, 45, 55, 60, 50, 70],
                },
            ],
            curType: 'ELECTRIC',
            chartData1: [
                { name: '暖通空调', value: 176 },
                { name: '一般动力', value: 130 },
                { name: '照明', value: 330 },
                { name: '商业', value: 231 },
                { name: '其他', value: 131 },
            ],
            chartData2: [
                { name: '暖通空调', value: 2880, percent: 32 },
                { name: '一般动力', value: 2700, percent: 28 },
                { name: '照明', value: 1350, percent: 24 },
                { name: '商业', value: 1260, percent: 15 },
                { name: '其他', value: 810, percent: 9 },
            ],
            chartData3: {
                labels: ['暖通空调', '一般动力', '照明', '商业', '其他'],
                data: [80, 120, 60, 150, 50],
                benchmark: [120, 160, 90, 200, 80],
            },
            colors: ['#A4CC45', '#FFD287', '#39A0F8', '#FD5655', '#B08DF9', '#6B9CFF'],
            isShowAlgorithm: false, // 是否显示算法
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            tempHistory: [23, 22, 21, 25, 23, 22, 20, 19, 20, 23, 21, 22],
            tempCurrent: [19, 15, 18, 14, 20, 25, 23, 22, 21, 25, 18, 16],
            peopleHistory: [700, 680, 600, 580, 720, 650, 500, 450, 480, 640, 560, 600],
            peopleCurrent: [400, 520, 450, 600, 520, 500, 620, 400, 520, 500, 480, 520],
            baseLoad: {
                dayBenchmark: 60,
                monthBenchmark: 6000,
                seasonType: 1, // 1: 冷季 2: 热季 3: 过渡季
                benchmarkChange: 10,
            },
            seasonalLoad: {
                seasonType: 1,
                seasonProgress: '90',
                searonCur: '60',
                dayEnergy: 6000,
            },
            barData: [
                { name: '生活用水', value: 500 },
                { name: '非生活用水', value: 100 },
            ],
            xData: Array.from({ length: 24 }, (_, i) => i),
            lineData: [
                {
                    name: '生活用水',
                    data: [10, 5, 12, 18, 22, 15, 30, 25, 20, 35, 28, 40],
                },
                {
                    name: '非生活用水',
                    data: [20, 25, 25, 15, 5, 12, 18, 22, 15, 20, 25, 18],
                },
            ],
            curModelTab: 1,
            curStationName: '',
            stationMenus: [
                {
                    label: '出站层111',
                    value: '1',
                    hideNames: ['武广候车区1-7', '武广候车区8-15', '沪昆候车区16-20', '沪昆候车区21-24', '长沙南屋盖', '武广进站厅', '沪昆站进站厅', '轨道多余部分', '武广线冷冻站', '武广线冷却塔', '沪昆线冷冻站', '沪昆线冷却塔', '沪昆线锅炉房外立面', '沪昆线锅炉房设备'],
                    children: [
                        { label: '武广出站广厅', value: '1-1', modelName: '武广出站广厅' },
                        { label: '武广(1-7)', value: '1-2', modelName: '武广出站层1-7' },
                        { label: '武广(8-15)', value: '1-3', modelName: '武广出站层8-15' },
                        { label: '沪昆(16-20)', value: '1-5', modelName: '沪昆出站层16-20' },
                        { label: '沪昆(21-24)', value: '1-6', modelName: '沪昆出站层21-24' },
                        { label: '沪昆出站广厅', value: '1-4', modelName: '沪昆出站广厅' },
                    ],
                },
                {
                    label: '站台层',
                    value: '2',
                    hideNames: ['长沙南屋盖'],
                    children: [
                        { label: '武广进站厅', value: '2-1', modelName: '武广进站厅' },
                        { label: '沪昆进站厅', value: '2-2', modelName: '沪昆站进站厅' },
                    ],
                },
                {
                    label: '高架层',
                    value: '3',
                    hideNames: ['长沙南屋盖'],
                    children: [
                        { label: '武广(1-7)', value: '3-1', modelName: '武广候车区1-7' },
                        { label: '武广(8-15)', value: '3-2', modelName: '武广候车区8-15' },
                        { label: '沪昆(16-20)', value: '3-3', modelName: '沪昆候车区16-20' },
                        { label: '沪昆(21-24)', value: '3-4', modelName: '沪昆候车区21-24' },
                    ],
                },
                {
                    label: '能源站',
                    value: '4',
                    children: [
                        { label: '武广', value: '4-1', modelUrl: '/CSN2/models/WG.glb' },
                        { label: '沪昆', value: '4-2', modelUrl: '/CSN2/models/HK.glb' },
                        { label: '锅炉房', value: '4-3', modelUrl: '/CSN2/models/GLF.glb' },
                        { label: '风冷热泵', value: '4-4', modelUrl: '/CSN2/models/GLF.glb' },
                    ],
                },
            ],
            newTempData: {
                temperature: "",
                humidity: "",
                yearRate: "",
                allRate: "",
            }
        };
    },
    computed: {
        indicatorStyle() {
            const index = this.tabs.findIndex((t) => t.value === this.activeTab);
            const itemHeight = 56;

            return {
                transform: `translateY(${index * itemHeight + 4}px)`,
                height: '50px',
                width: '2px',
                transition: 'transform 0.3s ease',
            };
        },
        curDataList() {
            return this.curStationName == '武广' || this.curStationName == '沪昆' ? this.lists : this.lists2;
        },
        curRunningDataList() {
            return this.curStationName == '锅炉房' ? this.lists3 : this.lists4;
        },
    },
    mounted() {
        this.getTotalData();
        this.loadAreaUsageData()
        this.getMaintenceData();
        this.getAreaUsageData();
        this.getAreaUsageBaseData()
        this.getNewTempData();
    },
    methods: {
        modelTabChange(val, station) {
            console.log(val, 'model');
            if (!station || !val) {
                this.curModelTab = 1;
                this.curStationName = '';
                return;
            }
            this.curStationName = station;
            if (val == '能源站') {
                this.curModelTab = 2;
            } else {
                this.curModelTab = 1;
            }
        },

        hangleLink() {
            this.isShowAlgorithm = !this.isShowAlgorithm;
        },

        changeTab(tab) {
            this.activeTab = tab;
            this.getTotalData();
        },

        // 获取总数据
        async getTotalData() {
            const res = await getTotalUsageData(this.activeTab);
            console.log(res, 'ddd1');
            this.cards[0].value = res.data.totalElectric || '--';
            this.cards[0].compare.value = res.data.changeElectric || '--' + '%';
            this.cards[0].extra.value = res.data.saveElectric || '--';
            this.cards[1].value = res.data.totalWater || '--';
            this.cards[1].extra.value = res.data.hbWaterChange || '--' + '%';
            this.cards[2].value = res.data.carbonSave || '--';
            this.cards[2].extra.value = res.data.carbonSaveTrees || '--';
        },

        // 获取分区节能数据
        async loadAreaUsageData() {
            const res = await getAreaSavingData();
            this.newTempData.allRate = res.data.electric.allRate;
            this.newTempData.yearRate = res.data.electric.yearRate;
        },

        // 冷站用能数据
        async getMaintenceData() {
            const res = await getTodayColdUsageData(this.curStation);
            console.log(res, 'ddd2');
            if (res.code == 200) {
                const isAllNull =
                    Array.isArray(res.data.electricTrend) && res.data.electricTrend.every((item) => item == null);
                const isColdAllNull =
                    Array.isArray(res.data.coldTrend) && res.data.coldTrend.every((item) => item == null);

                if (!isAllNull) this.roomDataList[0].data = res.data.electricTrend;
                if (!isColdAllNull) this.roomDataList[1].data = res.data.coldTrend;

                this.roomDataList[0].value = res.data.electric;
                this.roomDataList[1].value = res.data.cold;
                this.roomDataList[0].sub[0].value = res.data.benchmarkChange;
                this.roomDataList[0].sub[1].value = res.data.saveElectric;
                this.roomDataList[1].sub[0].value = res.data.cop || '--';
                this.roomDataList[1].sub[1].value = res.data.eer || '--';

                console.log(this.roomDataList, 'room');
            }
        },
        // 获取当日温湿度
        async getNewTempData() {
            const res = await handleNewTempData()
            console.log(res, 'rea');
            if (res.code === 200) {
                this.newTempData.humidity = res.data.humidity
                this.newTempData.temperature = res.data.temperature
            }
        },
        // 当日分项用能基准
        async getAreaUsageBaseData() {
            const res = await getTodayItemUsageBaseData('ELECTRIC');
            console.log(res, 'ddd4');
            if (res.code == 200) {
                this.baseLoad.seasonType = res.data.seasonType;
                this.baseLoad.benchmarkChange = res.data.benchmarkChange;
                this.baseLoad.dayBenchmark = res.data.dayBenchmark;
                this.baseLoad.monthBenchmark = res.data.monthBenchmark;
                res.data.pieBenchmark.labels.forEach((item, index) => {
                    this.chartData1[index].name = item;
                });
                res.data.pieBenchmark.data.forEach((item, index) => {
                    this.chartData1[index].value = item;
                });
            }
        },

        // 当日分项用能
        async getAreaUsageData() {
            const res = await getTodayItemUsageData(this.curType);
            console.log(res, 'ddd3');
            if (res.code == 200) {
                if (this.curType == 'ELECTRIC') {
                    this.seasonalLoad.seasonType = res.data.seasonType;
                    this.seasonalLoad.dayEnergy = res.data.dayEnergy || 0;
                    this.seasonalLoad.searonCur = res.data.seasonProgress.split('/')[0];
                    this.seasonalLoad.seasonProgress = res.data.seasonProgress.split('/')[1];
                    res.data.dayEnergyPie.labels.forEach((item, index) => {
                        this.chartData2[index].name = item;
                    });
                    res.data.dayEnergyPie.data.forEach((item, index) => {
                        this.chartData2[index].value = item;
                    });
                    res.data.dayEnergyPie.change.forEach((item, index) => {
                        this.chartData2[index].percent = item;
                    });
                    this.chartData3 = {
                        labels: res.data.dayEnergyPie.labels,
                        data: res.data.dayEnergyPie.data,
                        benchmark: res.data.benchmark,
                    };
                } else if (this.curType == 'WATER') {
                    this.barData.forEach((item, index) => {
                        item.name = res.data.labels[index];
                        item.value = res.data.itemEnergy[index];
                    });
                    this.lineData.forEach((item, index) => {
                        item.name = res.data.labels[index];
                        item.data = res.data.itemTrend[index];
                    });
                }
            }
        },

        // 切换水电
        handleTypeChange() {
            this.getAreaUsageData();
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep {
    .el-card {
        border-radius: 10px;
    }

    .el-card__body {
        height: 100%;
        padding: 12px 15px;
    }

    .el-tabs__nav {
        background: #e5ecff;
    }

    .el-tabs--card>.el-tabs__header {
        border: none;
    }

    .el-tabs__header {
        margin-bottom: 10px;
    }

    .radio_btn {
        .el-radio-button:first-child .el-radio-button__inner {
            border-radius: 20px 0 0 20px;
        }

        .el-radio-button:last-child .el-radio-button__inner {
            border-radius: 0 20px 20px 0;
        }

        .el-radio-button--mini .el-radio-button__inner {
            padding: 5px 15px;
        }
    }

    .el-radio-button__inner {
        background: #e5ecff;
    }

    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: #6e94fe;
    }

    .el-button--primary {
        background: #6e94fe;
    }
}

::v-deep .hidden_line.el-divider {
    visibility: hidden;
}

.line {
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
    margin: 0 20px;
}

.content_warp {
    width: 100%;
    height: calc(100vh - 110px);
    display: flex;
    gap: 12px;
    padding: 0 20px;

    .left_warp {
        width: 69%;
        height: 100%;
        flex: 7;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .top_area {
            flex: 0 0 auto;
        }

        .model_area {
            flex: 1;
        }

        .monitor_area {
            width: 100%;
            flex: 0 0 auto;
        }
    }

    .right_warp {
        width: 30%;
        height: 100%;
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .tab-container::after {
        content: '';
        position: absolute;
        top: 0;
        right: -5px;
        width: 5px;
        height: 100%;
        background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
    }

    .card_title {
        width: 237px;
        height: 24px;
        background-image: url('../../assets/home/titBg.png');
        background-repeat: no-repeat;
        padding-left: 35px;
        font-weight: bold;
        color: #444;
        line-height: 25px;
        font-size: 14px;
        letter-spacing: 2px;
    }

    .iconImg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        border: 1px solid #eee;
        margin-right: 10px;
        border-radius: 12px;
        font-size: 12px;
        box-shadow: 0px 1px 10px 0px rgba(57, 160, 248, 0.2);
        padding: 3px 0;

        img {
            margin-right: 5px;
        }
    }

    .data_link {
        float: right;
        margin-right: 10px;

        &:hover {
            // 出现下划线
            text-decoration: underline;
        }
    }

    .legend-header,
    .legend-item {
        display: grid;
        grid-template-columns: 40px 90px 70px 60px;
        align-items: center;
        margin-bottom: 5px;
    }

    .legend-header {
        font-weight: bold;
        color: #507cff;
    }

    .item_percent {
        color: #4faaff;
    }

    .marker {
        display: inline-block;
        width: 18px;
        height: 10px;
        border-radius: 20%;
    }
}

@media (min-height: 1080px) {
    .content_warp .center_warp .left_top img {
        margin-top: 20px;
    }
}
</style>
