<!-- 能源站监测 -->

<template>
    <div class="monitoring-container h-full">
        <div class="w-full flex items-center justify-between py-2">
            <div class="strategy_card px-5 py-7 rounded-lg shadow-lg flex items-center cursor-pointer" :style="{
                background: `linear-gradient(to bottom, #e6efff, #fff)`,
                '--hover-border': '#86a3f8',
                '--card-shadow': '0 6px 16px rgba(134,163,248,0.18)',
            }">
                <img class="mr-5" src="@/assets/home/ele_icon.png" width="66px" height="66px" />
                <div class="flex flex-col text-gray-700 text-sm">
                    <div><span class="text-2xl font-bold mr-1">{{ energyElectricTotal }}</span>kWh</div>
                    <span>用电量</span>
                </div>
            </div>
            <div class="strategy_card px-6 py-5 rounded-lg shadow-lg cursor-pointer text-gray-700"
                v-for="(item, index) in strategyList" :key="index" :style="{
                    background: `linear-gradient(to bottom, ${item.gradient}, #fff)`,
                    '--hover-border': item.hoverBorder,
                    '--card-shadow': item.shadow,
                }">
                <div class="w-full flex items-center justify-between">
                    <div class="font-semibold">{{ item.name }}</div>
                    <!-- <div v-if="item.value">{{ item.text }}：{{ item.value }}%</div> -->
                </div>
                <div class="flex items-center justify-evenly mt-4">
                    <div>
                        <div><span class="text-base font-semibold">{{ item.total }}</span>台</div>
                        <div>总量</div>
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <div>
                        <div><span class="text-base font-semibold">{{ item.run }}</span>台</div>
                        <div>运行</div>
                    </div>
                    <!-- <el-divider direction="vertical"></el-divider>
                    <div>
                        <div><span class="text-base font-semibold">1</span>台</div>
                        <div>检修</div>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="mt-4 rounded-lg shadow-lg bg-white py-5" style="height: calc(100% - 155px)">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="item in deviceInfoList" :key="item.id" :label="item.name"
                    :name="item.name"></el-tab-pane>
            </el-tabs>
            <div class="w-full relative overflow-hidden px-3 pb-3" style="height: calc(100% - 30px); width: 100%;">
                <div ref="container" class="three-container">
                    <div v-if="loading" class="loading-mask">
                        <div class="loading-box">
                            <!-- <div>模型加载中 {{ loadingProgress.toFixed(0) }}%</div> -->
                            <!-- <el-progress :percentage="loadingProgress" /> -->
                            <span class="text-[#327cec] mr-2">正在加载模型...</span>
                            <i class="el-icon-loading text-lg"></i>
                        </div>
                    </div>
                </div>
                <div class="absolute top-3 left-10 z-10 flex flex-col">
                    <el-radio-group v-model="curDeviceType" size="small">
                        <el-radio-button v-for="(el, idx) in typeList" :key="el.value" :label="el.value">{{
                            el.label
                        }}</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="absolute top-3 right-8">
                    <el-select v-model="curDevice" clearable placeholder="请选择" style="width: 220px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <div v-if="curDevice && detailInfos.length" class="detail_box flex flex-col">
                        <div class="w-full flex items-center justify-between mb-2 text-xs"
                            v-for="(item, index) in detailInfos" :key="index">
                            <span>{{ item.name }}</span>
                            <span class=" text-blue-500">{{ item.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { initThree } from '@/utils/threeD/init';
import deviceInfoList from './data/deviceInfo';
import { handleEnergyStation, handleEnergyStationTree } from '@/api/newEnergyDataAnalysis/energyStation';
import { getWebSocket } from '@/utils/websocket';

export default {
    data() {
        return {
            energyElectricTotal: 0,
            strategyList: [
                {
                    name: '主机',
                    text: '总主机效率',
                    value: '70',
                    run: 2,
                    total: 2,
                    gradient: '#fcf3e3',
                    hoverBorder: '#fec76f',
                    shadow: '0 6px 16px rgba(254,199,111,0.20)',
                },
                {
                    name: '冷却塔',
                    run: 2,
                    total: 2,
                    gradient: '#eee6fe',
                    hoverBorder: '#d7c3fd',
                    shadow: '0 6px 16px rgba(215,195,253,0.20)',
                },
                {
                    name: '冷冻泵',
                    run: 2,
                    total: 2,
                    text: '冷冻水输送系数',
                    value: '60',
                    gradient: '#f7ffe6',
                    hoverBorder: '#c0e88e',
                    shadow: '0 6px 16px rgba(192,232,142,0.20)',
                },
                {
                    name: '冷却泵',
                    run: 2,
                    total: 2,
                    text: '冷却水输送系数',
                    value: '21',
                    gradient: '#e6f9ff',
                    hoverBorder: '#9fdef3',
                    shadow: '0 6px 16px rgba(159,222,243,0.20)',
                },
                {
                    name: '水塔',
                    run: 2,
                    total: 2,
                    text: '水塔效率',
                    value: '80',
                    gradient: '#ffecef',           // 浅粉色
                    hoverBorder: '#f7a8b8',
                    shadow: '0 6px 16px rgba(247,168,184,0.20)',
                },
                {
                    name: '其他',
                    run: 2,
                    total: 2,
                    gradient: '#e8f7f3',          // 浅青绿色
                    hoverBorder: '#8fd7c6',
                    shadow: '0 6px 16px rgba(143,215,198,0.20)',
                }
            ],
            activeName: '武广',
            three: null,
            curDeviceType: '',
            curDevice: '',
            deviceInfoList: [],
            loading: false,
            loadingProgress: 0,
            stationMap: {
                武广: 'WG',
                沪昆: 'HK',
                锅炉房: 'BOILER'
            },
            wsDeviceData: {}, // websocket设备数据
            ws: null, // websocket实例
        };
    },
    computed: {
        // 当前站点
        currentStation() {
            return this.deviceInfoList.find((item) => item.name === this.activeName);
        },

        // 左上 radio（设备类型）
        typeList() {
            if (!this.currentStation) return [];
            return this.currentStation.children.map((d) => ({
                label: d.name,
                value: d.name,
            }));
        },

        // 当前设备类型对象
        currentType() {
            if (!this.currentStation) return null;
            return this.currentStation.children.find((d) => d.name === this.curDeviceType);
        },

        // 右侧 select
        options() {
            if (!this.currentType) return [];
            return this.currentType.children.map((d) => ({
                label: d.name,
                value: d.name,
                modelName: d.modelName,
            }));
        },

        // 当前设备
        currentDeviceObj() {
            if (!this.options.length) return null;
            return this.options.find((d) => d.value === this.curDevice);
        },

        // detailInfos() {
        //     if (!this.curDevice) return [];
        //     const curData = this.currentStation.children.find((d) => d.name === this.curDeviceType);
        //     console.log(curData, 'cccur');
        //     return curData.infos;
        // },
        detailInfos() {
            if (!this.curDevice) return [];
            const params = this.wsDeviceData[this.curDevice]
            if (!params) return []
            return Object.keys(params).map(key => ({
                name: key,
                value: parseFloat(params[key]) ? parseFloat(params[key]).toFixed(2) : '-'  // 保留两位小数
            }))
        }
    },
    watch: {
        // 切换tab
        activeName(val) {
            this.curDeviceType = '';
            this.curDevice = '';

            this.connectStationWS(val)

            const modelMap = {
                武广: '/CSN2/models/WG.glb',
                沪昆: '/CSN2/models/HK.glb',
                锅炉房: '/CSN2/models/GLF.glb',
            };

            if (val == '锅炉房') {
                this.three?.loadModel(modelMap[val], {
                    distanceScale: 1.2,
                });
            } else {
                this.three?.loadModel(modelMap[val]);
            }

            this.three.clearHighlight();
        },

        // 切换设备类型
        curDeviceType(val) {
            this.curDevice = '';
            if (!val) return;
            this.$nextTick(() => {
                const list = this.currentType.children.map(
                    d => d.modelName
                );
                this.three.highlightByNames(list);
            });
        },

        // 切换设备 → THREE联动
        curDevice(val) {
            if (!val || !this.currentDeviceObj) {
                this.three.clearHighlight();
                return;
            }

            // 单个设备高亮
            const modelName = this.currentDeviceObj.modelName;

            this.three.highlightOne(modelName);
        },
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.three = initThree(this.$refs.container, '/models/WG.glb', {
        //         enableHighlight: true,
        //     });
        // });
        this.connectStationWS('武广')
        this.$nextTick(async () => {
            this.three = initThree(this.$refs.container, null, { enableHighlight: true });

            // 开启 loading
            this.loading = true;
            this.loadingProgress = 0;

            // 手动加载
            const model = await this.three.loadModel('/CSN2/models/WG.glb', {}, (p) => {
                this.loadingProgress = p;
            });

            this.loading = false;
        });
        this.loadEnergyData();
        this.loadEnergyTree();
    },
    beforeDestroy() {
        if (this.three) {
            this.three.dispose?.();
            this.three = null;
        }
        this.ws?.close()
    },
    methods: {
        // 获取卡片数据
        async loadEnergyData() {
            const res = await handleEnergyStation();
            this.energyElectricTotal = res.data.energy;
            this.strategyList = res.data.data.map((item, index) => {
                const cur = this.strategyList[index];
                return {
                    name: item.typeName,
                    run: item.run,
                    total: item.total,
                    text: cur.text,
                    value: cur.value,
                    gradient: cur.gradient,
                    hoverBorder: cur.hoverBorder,
                    shadow: cur.shadow,
                }
            });
        },

        // 获取树结构
        async loadEnergyTree() {
            const res = await handleEnergyStationTree();
            this.deviceInfoList = res.data;
        },

        // websocket
        connectStationWS(station) {
            if (this.ws) {
                this.ws.close()
            }
            const param = this.stationMap[station]
            const socket = getWebSocket(`homePageWebSocket/${param}`)
            socket.setMessage((event) => {
                const data = JSON.parse(event.data)

                this.handleWSData(data)
            })
            this.ws = socket.init()
        },
        handleWSData(list) {
            const deviceMap = {}
            list.forEach(system => {
                system.data.forEach(device => {
                    const paramMap = {}
                    device.param.forEach(item => {
                        paramMap[item.propertyName] = item.value
                    })
                    deviceMap[device.equipmentName] = paramMap
                })
            })
            this.wsDeviceData = deviceMap
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

::v-deep .el-select {
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    border-radius: 20px;
}

::v-deep {
    .el-radio-button__inner {
        background: #e5ecff;
    }

    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background: #6e94fe;
    }

    .el-button--primary {
        background: #6e94fe;
    }

    .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 20px 0 0 20px;
    }

    .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0 20px 20px 0;
    }

    .el-radio-button--mini .el-radio-button__inner {
        padding: 5px 15px;
    }

    .el-input--mini.el-input__inner {
        border-radius: 20px;
    }
}

.strategy_card {
    width: 24%;
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

.three-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.loading-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-box {
    background: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
    min-width: 200px;
    font-size: 12px;
    font-weight: bold;
    color: #327cec;
}

.detail_box {
    width: 100%;
    min-height: 100px;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6c6c6c;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    border-radius: 15px;
    padding: 10px 20px;
    margin-top: 20px;
}
</style>
