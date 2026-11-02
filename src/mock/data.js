/**
 * 全局 mock 数据
 *
 * 统一集中存放本项目运行时需要的假数据：
 * - 认证/用户/角色
 * - 侧边栏菜单（getNewMenu 返回的菜单树）
 * - 组态主题数据（最小可用空数据）
 *
 * 说明：接口 mock 的拦截逻辑统一在 src/utils/request.js 实现，本文件只提供数据。
 */

import deviceInfoList from '@/views/energyDataManagement/energyMonitoring/data/deviceInfo'

/** 当前登录用户（对应 /userController/getCurrentUser） */
export const currentUser = {
    userId: 1,
    userName: 'admin',
    realName: '系统管理员',
    orgName: '长沙南',
}

/** 当前用户角色（对应 /userController/getRoleByUser/:userName） */
export const roles = [{ roleCode: 'admin', roleName: '管理员' }]

/**
 * 组态主题数据（对应 /configThemeController/getConfigTheme/:id）
 * 各物料列表为空，保证创建出的 materials 为空、页面可正常渲染空画布。
 */
export const configTheme = {
    configTheme: { name: '示例组态', canvasWidth: '100%', canvasHeight: '100%', themeId: 'mock-theme' },
    configPartTextList: [],
    configPartImgList: [],
    configPartPointNumList: [],
    configPartPointRadioboxList: [],
    configPartPointCheckboxList: [],
    configPartPointSwitchList: [],
    configPartPointSelectList: [],
    configPartPointBitSwitchList: [],
    configPartPointMultiStatusDisplayList: [],
    configPartPointTrendList: [],
    configPartDimensionChartList: [],
    configPartPointFireMonitorList: [],
    configPartPointBatchControlList: [],
    configPartPointLightControlList: [],
}

/** 叶子菜单构造器 */
function leaf(name, path) {
    return { menuName: name, urlAddress: path }
}

/**
 * 侧边栏菜单树（对应 /menuController/new/menu）
 *
 * 结构说明：树的叶节点 name 必须与路由表中 meta.title 完全一致，
 * 以便 routerPermission.filterRoutes 通过标题匹配到具体路由组件。
 * 「设备运营」分组按需求整理出子菜单（设备运行状态/设备运行控制/设备累计运行时长/
 * 设备批量控制/设备日程控制/顺序启停控制/AI策略控制），
 * 网络设备监测、设备运行参数作为直接子项保留（不在本次整理范围内）。
 */
export const menuTree = [
    {
        menuName: '节能减碳',
        urlAddress: '/strategy',
        children: [
            leaf('节能策略', '/strategy'),
            leaf('节能分析', '/analysis'),
            leaf('节能预案', '/energySavingPlan'),
            leaf('能耗预测', '/energyPrediction'),
            leaf('分区节能', '/areaEnergySaving'),
            leaf('环境舒适度', '/environmentComfort'),
            leaf('碳排放', '/carbonEmission'),
            leaf('其他支撑数据', '/otherSupportData'),
        ],
    },
    {
        menuName: '能耗数据',
        urlAddress: '/energyMonitoring',
        children: [
            leaf('能源站监测', '/energyMonitoring'),
            leaf('区域能耗', '/energyArea'),
            leaf('分项能耗', '/itemizedEnergyReport'),
            leaf('能耗基础数据', '/energyData'),
            leaf('总能耗报表', '/totalEnergyReport'),
            leaf('冷站能耗报表', '/coldStationEnergyReport'),
            leaf('表计配置', '/meterConfig'),
            leaf('系统能效', '/systemEnergy'),
            leaf('能耗异常分析', '/energyAbnormalAnalysis'),
            leaf('能耗报告', '/energyReport'),
            leaf('冷站趋势图', '/codeStationTrend'),
        ],
    },
    {
        menuName: '设备运营',
        urlAddress: '/equipmentOperationStatus',
        children: [
            //   leaf('设备运行状态', '/equipmentOperationStatus'),
            //   leaf('设备运行控制', '/equipmentOperationControl'),
            //   leaf('设备累计运行时长', '/equipmentRunningTime'),
            //   leaf('设备批量控制', '/equipmentBatchControl'),
            //   leaf('设备日程控制', '/devicePlan'),
            //   leaf('顺序启停控制', '/sequentialStartControl'),
            //   leaf('AI策略控制', '/policyControl'),
            // 以下两项按要求保持原状，不参与路由整理
            leaf('网络设备监测', '/networkDeviceDetection'),
            leaf('设备运行参数', '/codeStationReport'),
        ],
    },
    {
        menuName: '智慧运维',
        urlAddress: '/intelligentOperationHome',
        children: [
            leaf('运维总览', '/intelligentOperationHome'),
            leaf('台账管理', '/accountListManagement'),
            leaf('维修工单', '/repairWorkOrder'),
            {
                menuName: '巡检管理',
                urlAddress: '/autoInspection',
                children: [
                    leaf('智能巡检', '/autoInspection'),
                    leaf('计划巡检', '/planInspection'),
                    leaf('巡检工单', '/inspectionWordOrder'),
                    leaf('智能巡检记录', '/autoInspectionRecord'),
                    leaf('智能巡检配置', '/inspectionSet'),
                    leaf('巡检路线', '/inspectionPath'),
                    leaf('巡检记录', '/inspectionHistory'),
                    leaf('巡检内容配置', '/inspectionContent'),
                    leaf('实时巡检轨迹', '/currentTrajectory'),
                ],
            },
        ],
    },
    {
        menuName: '系统管理',
        urlAddress: '/user',
        children: [
            leaf('用户管理', '/user'),
            leaf('角色管理', '/role'),
            leaf('异常数据校正', '/dataCorrection'),
            leaf('保养计划', '/upkeepPlan'),
            leaf('保养工单', '/upkeepWorkOrder'),
            leaf('仓库管理', '/warehouseManagement'),
            leaf('盘点', '/stockTaking'),
            leaf('库存信息记录', '/stockRecord'),
        ],
    },
    {
        menuName: '告警管理',
        urlAddress: '/alarmLog',
        children: [leaf('告警记录', '/alarmLog')],
    },
]

/**
 * 节能分析数据（对应 /homePage/new/energySaveAnalysis）
 *
 * 结构与 src/views/emptyPage/index.vue 中 emptyPageData 的初始 shape 完全一致：
 * monthCard/yearCard 单位统一为 kWh，页面会除以 1000 转换为 MWh 显示；
 * energyTrend / systemEnergyTrend 的 data 为 [用电量, 基准值] 两条 12 个月的序列。
 */
export const energySaveAnalysis = {
    // 本月/本年 指标卡片（单位 kWh / kgco2）
    monthCard: {
        benchmark: 120000,
        energy: 115000,
        energyHbChange: 2.5,
        energySave: 5000,
        energySaveHbChange: -1.2,
        energySaveCarbon: 2500,
    },
    yearCard: {
        benchmark: 1440000,
        energy: 1380000,
        energyHbChange: 3.1,
        energySave: 60000,
        energySaveHbChange: 4.5,
        energySaveCarbon: 30000,
    },

    // 节能趋势分析（整体用电量 vs 基准值）
    energyTrend: {
        xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: ['用电量', '基准值'],
        data: [
            [112000, 118000, 121000, 115000, 108000, 99000, 95000, 101000, 109000, 116000, 111000, 124000],
            [120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000, 120000],
        ],
    },

    // 系统节能分析（按系统维度拆分，供下拉切换）
    systemEnergyTrend: {
        xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: ['用电量', '基准值'],
        systemData: [
            {
                systemId: '1',
                systemName: '其他',
                data: [
                    [6000, 6300, 6500, 6200, 5800, 5400, 5100, 5600, 5900, 6200, 6100, 6700],
                    [6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500],
                ],
            },
            {
                systemId: '2',
                systemName: '一般动力',
                data: [
                    [30000, 31500, 32500, 31000, 29000, 27000, 25500, 28000, 29500, 31000, 30500, 33500],
                    [32500, 32500, 32500, 32500, 32500, 32500, 32500, 32500, 32500, 32500, 32500, 32500],
                ],
            },
            {
                systemId: '3',
                systemName: '暖通空调',
                data: [
                    [45000, 48000, 50000, 47000, 43000, 39000, 36000, 40000, 43000, 46000, 44000, 50000],
                    [48000, 48000, 48000, 48000, 48000, 48000, 48000, 48000, 48000, 48000, 48000, 48000],
                ],
            },
            {
                systemId: '4',
                systemName: '商业用电',
                data: [
                    [20000, 21000, 21500, 20500, 19000, 17500, 16500, 18000, 19500, 20500, 20000, 22000],
                    [21500, 21500, 21500, 21500, 21500, 21500, 21500, 21500, 21500, 21500, 21500, 21500],
                ],
            },
            {
                systemId: '5',
                systemName: '照明',
                data: [
                    [11000, 11800, 12100, 11500, 10800, 9900, 9500, 10100, 10900, 11600, 11100, 12400],
                    [12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100],
                ],
            },
        ],
    },

    // 系统节能结构（右侧饼图 + 系统列表）
    systemEnergyPie: {
        total: 60000,
        detail: [
            { systemId: '1', systemName: '其他', yearBenchmark: 78000, yearEnergy: 72000, yearEnergySave: 6000, yearEnergySaveRate: 7.7 },
            { systemId: '2', systemName: '一般动力', yearBenchmark: 390000, yearEnergy: 360000, yearEnergySave: 30000, yearEnergySaveRate: 7.7 },
            { systemId: '3', systemName: '暖通空调', yearBenchmark: 576000, yearEnergy: 540000, yearEnergySave: 36000, yearEnergySaveRate: 6.3 },
            { systemId: '4', systemName: '商业用电', yearBenchmark: 258000, yearEnergy: 246000, yearEnergySave: 12000, yearEnergySaveRate: 4.7 },
            { systemId: '5', systemName: '照明', yearBenchmark: 145200, yearEnergy: 132000, yearEnergySave: 13200, yearEnergySaveRate: 9.1 },
        ],
    },

    // 区域负荷排名（左侧排名列表）
    areaEnergy: [
        { areaName: 'A 区', yearEnergy: 320000, hb: 3.2 },
        { areaName: 'B 区', yearEnergy: 285000, hb: 1.8 },
        { areaName: 'C 区', yearEnergy: 260000, hb: -2.1 },
        { areaName: 'D 区', yearEnergy: 235000, hb: 4.5 },
        { areaName: 'E 区', yearEnergy: 210000, hb: -1.6 },
    ],
}

/**
 * 能耗预测数据（对应 /homePage/new/energyPredict）
 *
 * 结构与 src/views/energyDataAnalysis/energyPrediction/index.vue 的消费 shape 对齐：
 * - card：顶部指标卡（seasonProgress 形如 "已过天数/总天数"）
 * - energy：能耗预测趋势柱状图（data 为 [预测基准, 当前基准, 实际负荷] 三条 12 个月序列，单位 kWh）
 * - temperature：月均温度变化折线（data 为 [当前温度, 历史温度]）
 * - passengerFlow：月均客流变化折线（data 为 [当月均值, 历史均值]）
 */
export const energyPredict = {
    card: {
        seasonType: '夏季',
        seasonProgress: '90/92',
        seasonEnergy: 10800000,
        seasonBenchmark: 9990000,
        seasonBenchamrkChange: 2.5,
        temperatureDiff: -1.2,
        passengerFlowDiff: 3.8,
    },

    energy: {
        xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: ['预测基准', '当前基准', '实际负荷'],
        data: [
            [120000, 118000, 115000, 112000, 108000, 105000, 103000, 106000, 110000, 114000, 117000, 121000],
            [122000, 120000, 118000, 116000, 112000, 109000, 107000, 110000, 113000, 116000, 119000, 123000],
            [121500, 119300, 116800, 114200, 110500, 107800, 105600, 108400, 111900, 115300, 118200, 122400],
        ],
        currentMonthPrediction: 121000,
        currentMonthBenchmark: 123000,
        currentMonthEnergy: 122400,
    },

    temperature: {
        xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: ['当前温度', '历史温度'],
        data: [
            [5.2, 8.1, 13.5, 18.9, 23.4, 27.1, 30.2, 29.6, 25.8, 20.3, 13.9, 7.6],
            [4.8, 7.6, 12.9, 18.1, 22.6, 26.2, 29.3, 28.7, 24.9, 19.4, 13.1, 6.9],
        ],
    },

    passengerFlow: {
        xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: ['当月均值', '历史均值'],
        data: [
            [18200, 21500, 26800, 34200, 39800, 42100, 43500, 42800, 38600, 31200, 24600, 20100],
            [17600, 20800, 25900, 33100, 38600, 40900, 42300, 41600, 37500, 30300, 23800, 19400],
        ],
        current: '43500',
        tb: '42300',
    },
}

/**
 * 能源站监测数据（对应 /homePage/new/energyStationData）
 *
 * 结构与 src/views/energyDataManagement/energyMonitoring/index.vue 消费 shape 对齐：
 * - energy：右侧「用电总量」数值（kWh）
 * - data：策略卡片列表（typeName/run/total），与页面默认 6 张策略卡一一对应
 */
export const energyStationData = {
    energy: 123456,
    data: [
        { typeName: '主机', run: 2, total: 2 },
        { typeName: '冷却塔', run: 2, total: 2 },
        { typeName: '冷冻泵', run: 2, total: 2 },
        { typeName: '冷却泵', run: 2, total: 2 },
        { typeName: '水塔', run: 2, total: 2 },
        { typeName: '其他', run: 2, total: 2 },
    ],
}

/**
 * 能源站树（对应 /homePage/new/energyStationTree）
 * 复用页面本地 deviceInfo 数据结构（武广 / 沪昆 / 锅炉房三个站点及其设备层级），
 * 保证顶部站点 tab 与设备类型 / 设备下拉选择正常渲染。
 */
export const energyStationTree = deviceInfoList

/**
 * 仓库管理统计数据（对应 /stock/statistics）
 *
 * 结构为一个以业务类型（0 出库 / 1 入库 / 2 调拨 / 3 报废）为 key 的对象，
 * 每项含 now/compare 两组：line（柱状图 12 个月序列）、yearCompare（饼图键值对象）。
 * 此处 line/yearCompare 置空，保证图表以空态渲染而不访问 undefined 报错。
 */
export const stockStatistics = {
    '0': { now: { line: [], yearCompare: {} }, compare: { line: [], yearCompare: {} } },
    '1': { now: { line: [], yearCompare: {} }, compare: { line: [], yearCompare: {} } },
    '2': { now: { line: [], yearCompare: {} }, compare: { line: [], yearCompare: {} } },
    '3': { now: { line: [], yearCompare: {} }, compare: { line: [], yearCompare: {} } },
}

/** 仓库列表（对应 /stock/listRepository），返回非空数组以保证弹窗 `res.data[0].id` 可访问 */
export const repositoryList = [
    { id: 1, repoName: '一号仓库' },
    { id: 2, repoName: '二号仓库' },
]

// ============================================================================
// 以下为补全的页面 mock 数据（原先缺失会导致运行时报 TypeError 或数据为空）
// ============================================================================

/** 12 个月份标签（柱状图 x 轴） */
const months12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

/** 工单状态饼图键值（状态名 → 数量），供保养/维修统计饼图复用 */
function workOrderPie() {
    return { 已完成: 18, 进行中: 6, 待处理: 3, 已转单: 2 }
}

// ---- 维修工单 ----

/** 维修工单总览（对应 /repair/statistics） */
export const repairStatistics = {
    now: {
        yearCompare: workOrderPie(),
        line: months12.map(() => 0),
        chart: months12.map(() => workOrderPie()),
    },
    compare: {
        yearCompare: workOrderPie(),
        line: months12.map(() => 0),
        chart: months12.map(() => workOrderPie()),
    },
}

/** 维修工单详情（对应 /repair/{id}） */
export const repairDetail = {
    repair: {
        id: 1,
        orderNumber: 'WX20261030-001',
        source: '人工申报',
        dept: '运维部',
        username: '张三',
        createTime: '2026-10-30 10:00:00',
        completeTime: '',
        description: '主机异响，需检查轴承',
        url: '',
    },
    detail: { process: '已更换轴承并加注润滑脂', url: '' },
    equipment: {
        equipmentNumber: 'SB-001',
        equipmentName: '冷水机组1号',
        equipmentType: '1',
        installLocation: '机房A',
        equipmentDetail: {
            brand: '格力',
            specification: 'LSBLX-1000',
            dutyPerson: '李四',
            contact: '13800000000',
            producer: '格力电器',
            department: '运维部',
            maintenanceUnit: '维保服务公司',
        },
    },
}

// ---- AI 策略控制 ----

/** 策略组合下拉（对应 /energySave/getModeSelect） */
export const policyMode = [
    { id: '1', label: '策略组合A' },
    { id: '2', label: '策略组合B' },
    { id: '3', label: '策略组合C' },
]

/** 当前策略（对应 /energySave/getStrategy），strategy 与 24 个时段一一对应 */
export const policyStrategy = {
    mode: '0',
    strategy: Array.from({ length: 24 }, (_, i) => String((i % 3) + 1)),
}

/** 执行策略开关量（对应 /energySave/getAllow），返回字符串 '0'/'1' */
export const policyAllow = '1'

/** 策略执行记录（对应 /energySave/getRecord） */
export const policyRecord = {
    modeTranslate: Array.from({ length: 24 }, (_, i) => `策略组合${(i % 3) + 1}`),
    actualData: Array.from({ length: 24 }, (_, i) => String((i % 3) + 1)),
}

// ---- 能耗异常分析 ----

/** 能耗异常分析（对应 /energyData/energyCompareAnalysis） */
export const energyCompareAnalysis = {
    energyData: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        current: [112, 118, 121, 115, 108, 99, 95, 101, 109, 116, 111, 124],
        compare: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
    },
    envData: {
        data: {
            temperature: {
                current: [5.2, 8.1, 13.5, 18.9, 23.4, 27.1, 30.2, 29.6, 25.8, 20.3, 13.9, 7.6],
                compare: [4.8, 7.6, 12.9, 18.1, 22.6, 26.2, 29.3, 28.7, 24.9, 19.4, 13.1, 6.9],
            },
            humidity: {
                current: [58, 60, 62, 65, 70, 75, 78, 76, 72, 66, 61, 59],
                compare: [60, 62, 64, 67, 72, 77, 80, 78, 74, 68, 63, 61],
            },
        },
    },
    summary: {
        currentTotal: 1295000,
        compareTotal: 1440000,
        diff: -145000,
        currentTemperature: 24.5,
        currentHumidity: 62,
        compareTemperature: 26.1,
        compareHumidity: 65,
    },
}

// ---- 账单管理 ----

/** 电度电费账单（对应 /bill/electricity） */
export const billElectricity = {
    totalCost: 320000,
    infoList: [
        { intervalType: '尖', totalCost: 80000, totalElectricityAmount: 120000, ratio: 25 },
        { intervalType: '峰', totalCost: 96000, totalElectricityAmount: 150000, ratio: 30 },
        { intervalType: '平', totalCost: 90000, totalElectricityAmount: 140000, ratio: 28 },
        { intervalType: '谷', totalCost: 54000, totalElectricityAmount: 130000, ratio: 17 },
    ],
    data: {
        尖: months12.map((_, i) => ({ billDate: `${i + 1}月`, cost: 8000 + i * 100 })),
        峰: months12.map((_, i) => ({ billDate: `${i + 1}月`, cost: 9000 + i * 100 })),
        平: months12.map((_, i) => ({ billDate: `${i + 1}月`, cost: 7000 + i * 100 })),
        谷: months12.map((_, i) => ({ billDate: `${i + 1}月`, cost: 4000 + i * 100 })),
    },
}

/** 电度电费规则（对应 /priceRule/electricity） */
export const priceRuleElectricity = [
    { ruleType: '尖', price: 1.2 },
    { ruleType: '峰', price: 1.0 },
    { ruleType: '平', price: 0.7 },
    { ruleType: '谷', price: 0.35 },
]

/** 基本电费账单（对应 /bill/basic） */
export const billBasic = {
    rule: {
        type: '按容量计算',
        transformerCapacity: 2000,
        transformerCapacityPrice: 28,
        maximumDemand: 1800,
        maximumDemandPrice: 40,
    },
    data: months12.map((_, i) => ({
        billDate: `${i + 1}月`,
        transformerAmount: 56000 + i * 200,
        maximumDemandAmount: 72000 + i * 200,
    })),
}

/** 基本电费规则（对应 /priceRule/basic） */
export const priceRuleBasic = [
    { ruleType: '基本电费', price: 28 },
]

/** 力调电费账单（对应 /bill/adjustment） */
export const billAdjustment = {
    info: {
        standardPowerFactor: 0.9,
        averageFine: 1200,
        averagePowerFactor: 0.88,
        maxDate: 7,
        maxFine: 3500,
        times: 4,
    },
    data: months12.map((_, i) => ({
        billDate: `${i + 1}月`,
        activePower: 400000 + i * 1000,
        reactivePower: 80000 + i * 500,
        powerFactor: 0.9 - i * 0.005,
        fine: 800 + i * 120,
        adjustmentAmount: 1000 + i * 150,
    })),
}

// ---- 台账管理 / 保养 ----

/** 台账详情（对应 /equipment/{id}） */
export const equipmentDetail = {
    equipment: {
        equipmentNumber: 'SB-001',
        equipmentName: '冷水机组1号',
        equipmentType: '1',
        installLocation: '机房A',
        equipmentStatus: 0,
        url: '',
        equipmentDetail: {
            brand: '格力',
            producer: '格力电器',
            specification: 'LSBLX-1000',
            installationUnit: '安装工程公司',
            purchaseDate: '2020-01-01',
            maintenanceUnit: '维保服务公司',
            serviceLife: 15,
            dutyPerson: '李四',
            originOfPurchase: '中国',
            installDate: '2020-03-01',
            department: '运维部',
            maintenancePeriod: '1年',
            system: '暖通空调',
            contact: '13800000000',
            section: 'A标段',
            subMajor: '暖通',
        },
    },
    map: {
        maintenanceRecord: { repair: [], maintain: [], inspect: [] },
        equipmentHealth: { percent: 85, status: '良好' },
        maintenanceSum: { inspect: 10, maintain: 5, repair: 2 },
    },
}

/** 设备列表（对应 /equipment/listByParam），保养计划弹窗左侧候选设备 */
export const equipmentList = [
    { equipmentId: 1, equipmentNumber: 'SB-001', equipmentName: '冷水机组1号', equipmentType: '1', installLocation: '机房A' },
    { equipmentId: 2, equipmentNumber: 'SB-002', equipmentName: '冷却塔1号', equipmentType: '2', installLocation: '屋顶' },
    { equipmentId: 3, equipmentNumber: 'SB-003', equipmentName: '冷冻泵1号', equipmentType: '3', installLocation: '机房B' },
]

/** 保养计划详情（对应 /maintain/plan/{id}） */
export const maintainPlanDetail = {
    name: '季度保养计划',
    type: '0',
    startDate: '2026-01-01',
    continuous: true,
    period: '90',
    endDate: '2026-12-31',
    generateDay: '3',
    generateTime: '08:00:00',
    equipments: [
        { equipmentId: 1, equipmentNumber: 'SB-001', equipmentName: '冷水机组1号', equipmentType: '1', installLocation: '机房A' },
    ],
}

/** 一段保养工单统计（current/last 共用结构） */
function maintainStatPiece() {
    return {
        normal: [3, 5, 4, 6, 2, 7, 5, 4, 6, 3, 8, 5],
        levelFirst: [2, 3, 4, 2, 3, 4, 3, 2, 4, 3, 5, 4],
        levelSecond: [1, 2, 1, 3, 2, 2, 1, 3, 2, 2, 3, 2],
        yearStatisticalMap: { '0': workOrderPie(), '1': workOrderPie(), '2': workOrderPie() },
        statisticalMap: months12.map(() => ({ '0': workOrderPie(), '1': workOrderPie(), '2': workOrderPie() })),
    }
}

/** 保养工单统计（对应 /maintain/workOrder/statistical） */
export const maintainWorkOrderStatistical = {
    current: maintainStatPiece(),
    last: maintainStatPiece(),
}

/** 保养工单详情（对应 /maintain/workOrder/{id}） */
export const maintainWorkOrderDetail = {
    workNo: 'BY20261030-001',
    name: '季度保养工单',
    type: 0,
    maintainDepart: '运维部',
    maintainUserRealName: '张三',
    generateTime: '2026-10-30 08:00:00',
    distributedTime: '2026-10-30 09:00:00',
    completeTime: '',
    description: '常规保养：更换滤芯、检查管路',
    url: '',
    equipment: {
        equipmentNumber: 'SB-001',
        equipmentName: '冷水机组1号',
        equipmentType: '1',
        installLocation: '机房A',
    },
}

// ---- 库存信息记录 ----

/** 库存单详情（对应 /stock/getStockOrderDetail/{id}） */
export const stockOrderDetail = {
    orderNumber: 'RK20261030-001',
    stockOrderType: 1,
    fromRepository: 1,
    toRepository: 2,
    createTime: '2026-10-30 09:00:00',
    itemNum: 2,
    opratorNum: 10,
    details: [
        { stockNumber: 'SB-001', stockName: '轴承', stockType: '1', belong: '备件', oldNum: 5, newNum: 8, operateNum: 3 },
        { stockNumber: 'SB-002', stockName: '阀门', stockType: '2', belong: '备件', oldNum: 10, newNum: 17, operateNum: 7 },
    ],
}

// ---- 字典 ----

/** 字典项（对应 /dicController/getDictItemsByCode） */
export const dictMap = {
    equipment_type: [
        { itemValue: '1', itemText: '冷水机组' },
        { itemValue: '2', itemText: '冷却塔' },
        { itemValue: '3', itemText: '水泵' },
    ],
    repair_status: [
        { itemValue: '0', itemText: '待处理' },
        { itemValue: '1', itemText: '处理中' },
        { itemValue: '2', itemText: '已完成' },
    ],
    stock_type: [
        { itemValue: '1', itemText: '轴承' },
        { itemValue: '2', itemText: '阀门' },
    ],
}

// ---- 大屏（screen） ----

/** 总用能数据（对应 /homePage/new/total/{date}） */
export const screenTotal = {
    totalElectric: 123456,
    changeElectric: 2.5,
    saveElectric: 5000,
    totalWater: 8765,
    hbWaterChange: -1.2,
    carbonSave: 320,
    carbonSaveTrees: 1500,
}

/** 分区节能数据（对应 /homePage/yearStatistics） */
export const screenAreaSaving = {
    electric: { allRate: 12.3, yearRate: 5.6 },
}

/** 当日冷站用能数据（对应 /homePage/new/stationEnergy/{type}） */
export const screenStationEnergy = {
    electricTrend: [1120, 1180, 1210, 1150, 1080, 990, 950, 1010, 1090, 1160, 1110, 1240],
    coldTrend: [820, 860, 900, 850, 790, 720, 690, 740, 800, 850, 810, 900],
    electric: 45000,
    cold: 32000,
    benchmarkChange: 2.1,
    saveElectric: 800,
    cop: 4.5,
    eer: 3.6,
}

/** 分区节能当日温度湿度（对应 /homePage/new/tempData） */
export const screenTempData = {
    humidity: 55,
    temperature: 24.5,
}

/** 当日分项用能基准（对应 /homePage/new/itemEnergyBenchmark/{type}） */
export const screenItemBenchmark = {
    seasonType: '夏季',
    benchmarkChange: 2.5,
    dayBenchmark: 48000,
    monthBenchmark: 1440000,
    pieBenchmark: {
        labels: ['照明', '暖通空调', '一般动力', '商业用电', '其他'],
        data: [10, 35, 30, 18, 7],
    },
}

/** 当日分项用能（对应 /homePage/new/itemEnergy/{type}） */
export const screenItemEnergy = {
    seasonType: '夏季',
    dayEnergy: 115000,
    seasonProgress: '90/92',
    benchmark: 120000,
    dayEnergyPie: {
        labels: ['照明', '暖通空调', '一般动力', '商业用电', '其他'],
        data: [10, 35, 30, 18, 7],
        change: [1.2, -2.1, 0.5, 1.0, -0.8],
    },
    labels: ['照明', '暖通空调', '一般动力', '商业用电', '其他'],
    itemEnergy: [11000, 45000, 30000, 20000, 9000],
    itemTrend: months12.map(() => [10500, 10800, 10600, 10400, 10100]),
}

/** 碳排放统计（对应 /carbon/statistics） */
export const carbonStatistics = {
    emission: {
        info: {
            electricity: 152.4,
            water: 6.2,
            heat: 88.7,
            gas: 31.5,
            electricityOrigin: 1800000,
            waterOrigin: 32000,
            heatOrigin: 8000,
            gasOrigin: 60000,
        },
        barData: [120.5, 115.3, 118.9, 122.1, 126.4, 130.2, 135.8, 132.6, 128.9, 124.7, 121.3, 118.8],
    },
    decrement: {
        info: {
            electricity: 45.2,
            water: 1.1,
            heat: 22.4,
            gas: 8.6,
        },
        barData: [35.2, 33.8, 36.4, 38.1, 40.5, 42.2, 44.6, 43.1, 41.7, 39.8, 37.5, 36.2],
    },
}

/** 分项名称列表（对应 /energyData/subItem） */
export const subItemList = [
    { orgId: 'LIGHTING', orgName: '照明' },
    { orgId: 'HVAC', orgName: '暖通空调' },
    { orgId: 'POWER', orgName: '一般动力' },
    { orgId: 'COMMERCIAL', orgName: '商业用电' },
    { orgId: 'OTHER', orgName: '其他' },
]

/** 能耗基础数据分页结果（对应 /meter/data/list） */
export const meterDataList = {
    total: 5824.6,
    list: [
        { meterName: '总电表-1', subItemName: '照明', location: '1F 配电间', area: 'A 区', data: 620.5 },
        { meterName: '总电表-2', subItemName: '暖通空调', location: '2F 机房', area: 'B 区', data: 2513.2 },
        { meterName: '总电表-3', subItemName: '一般动力', location: '3F 水泵房', area: 'C 区', data: 1186.4 },
        { meterName: '总电表-4', subItemName: '商业用电', location: '1F 商铺', area: 'A 区', data: 1258.9 },
        { meterName: '总电表-5', subItemName: '其他', location: '地下车库', area: 'D 区', data: 245.6 },
    ],
}

/** 由菜单树生成扁平菜单（对应 /userController/getCurrentUserMenu），携带 menuId/parentMenuId */
export const flatMenu = (function flatten(tree, parentId = null) {
    const result = []
    let seed = 0
    function walk(nodes, pid) {
        nodes.forEach((node) => {
            seed += 1
            const menuId = String(seed)
            result.push({
                menuId,
                parentMenuId: pid,
                menuName: node.menuName,
                urlAddress: node.urlAddress,
            })
            if (node.children && node.children.length) walk(node.children, menuId)
        })
    }
    walk(tree, parentId)
    return result
})(menuTree)
