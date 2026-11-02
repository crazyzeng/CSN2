<!-- 分区节能 -->

<template>
    <div class=" h-full flex flex-col">
        <el-card class="top_area rounded-lg mb-5">
            <div class="flex flex-1 gap-4">
                <div v-for="(item, index) in totalList" :key="index"
                    class="flex-1 px-4 py-6 rounded-xl relative overflow-hidden" :style="{ backgroundColor: item.bg }">
                    <div class="relative z-10 flex items-center justify-evenly">
                        <div class="flex flex-col items-center">
                            <div class="text-xl font-semibold text-black">
                                {{ item.value1 }}<span v-if="index == 0" class=" font-normal mx-1">/</span>
                                <span class="text-xs text-gray-600 font-normal"> {{ item.unit1 }}</span>
                            </div>
                            <div class=" mt-2 font-semibold"> {{ item.name1 }} </div>
                        </div>
                        <!-- 中间竖线 -->
                        <div class="mx-4 h-6 w-px bg-gray-300"></div>
                        <!-- 右侧模块 -->
                        <div class="flex flex-col items-center">
                            <div class="text-xl text-black font-semibold">
                                {{ item.value2 }}<span class="text-xs text-gray-600 font-normal"> {{ item.unit2
                                }}</span>
                            </div>
                            <div class="mt-2 font-semibold"> {{ item.name2 }} </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-row :gutter="20" style="height: calc(100% - 170px);">
            <el-col :span="19" class="h-full">
                <el-card class="model_area rounded-lg relative">
                    <threeD :stationMenus="stationMenus" @change="modelTabChange" />
                </el-card>
            </el-col>
            <el-col :span="5" class="h-full">
                <el-card class="h-full rounded-lg">
                    <el-form ref="form" :model="formData" label-width="80px" label-position="top">
                        <el-form-item label="区域">
                            <div>{{ formData.areaName }}</div>
                        </el-form-item>
                        <el-form-item label="策略模式">
                            <el-radio-group v-model="formData.strategyMode">
                                <el-radio label="1">舒适</el-radio>
                                <el-radio label="2">节能</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="策略舒适度">
                            <div>{{ formData.strategyComfort }}</div>
                        </el-form-item>
                        <el-form-item label="策略设定">
                            <div class="flex items-center">
                                温度<el-input v-model="formData.strategySetTemp"></el-input>
                                湿度<el-input v-model="formData.strategySetHum"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="室内外温差">
                            <div class="flex items-center">
                                温差<el-input v-model="formData.strategyExecuteTemp"></el-input>风柜温度设定低
                            </div>
                        </el-form-item>
                        <el-form-item label="室内外湿差">
                            <div class="flex items-center">
                                湿差<el-input v-model="formData.strategyExecuteHum"></el-input>新风风阀开度高
                            </div>
                        </el-form-item>
                        <el-form-item label="空气质量">
                            <div class="flex items-center">
                                质量等级：<span class=" mr-5">{{ '高' }}</span>新风风阀开度低
                            </div>
                        </el-form-item>
                        <el-form-item label="照明设定">
                            <el-radio-group v-model="formData.lighting" size="small">
                                <el-radio label="1">平衡</el-radio>
                                <el-radio label="2">明亮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="策略修正">
                            <el-switch v-model="formData.saveEnergy"></el-switch><span class="ml-3">关闭节能</span>
                            <div class=" mt-1">
                                <span>区域流量：高</span>
                                <span class="ml-5">区域密度：拥挤</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import threeD from '@/views/screen/components/threeD/index.vue';

export default {
    components: {
        threeD
    },

    data() {
        return {
            totalList: [
                { name1: '冷季', name2: '舒适度', value1: '60天', value2: '79', unit1: '90天', unit2: '', bg: '#fff6e7' },
                { name1: '室外温度', name2: '室外湿度', value1: '28', value2: '30', unit1: '℃', unit2: '%', bg: '#f0e8ff' },
                { name1: '室内温度', name2: '室内湿度', value1: '28', value2: '30', unit1: '℃', unit2: '%', bg: '#f6fbe3' },
            ],
            stationMenus: [
                {
                    label: '出站层',
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
            ],
            formData: {
                areaName: '出站层-武广出站厅',
                strategyMode: '1',
                strategyComfort: '80',
                strategySetTemp: '25℃',
                strategySetHum: '50%',
                strategyExecuteTemp: '25℃',
                strategyExecuteHum: '50%',
                lighting: '1',
                saveEnergy: true,
            }
        }
    },
    mounted() {
    },
    methods: {
        modelTabChange(val, station) {
            console.log(val, station, 'vv');
        },
    }
}
</script>

<style scoped lang="scss">
::v-deep .el-card__body {
    height: 100%;
}

::v-deep .el-form {
    height: 100%;
    overflow-y: scroll;
}

::v-deep .el-form-item__label {
    font-weight: 600;
    color: #444;
}

::v-deep .el-input--mini {
    width: 80px;
    font-size: 14px;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    border-radius: 10px;
    margin: 0 16px 0 10px;
}
::v-deep .el-input--mini .el-input__inner {
    border-radius: 2px !important;
}
::v-deep .el-form-item--mini.el-form-item {
    margin-bottom: 10px;
}

::v-deep {
    .el-tabs__nav {
        background: #e5ecff;
    }

    .el-tabs--card>.el-tabs__header {
        border: none;
    }

    .el-tabs__header {
        margin-bottom: 10px;
    }

    .el-radio-button__inner {
        background: #e5ecff;
    }

    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: #6e94fe;
    }
}

.top_area {
    flex: 0 0 auto;
}

.model_area {
    flex: 1;
    height: 100%;
}
</style>
