import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/* Layout */
import Layout from '@/layout/index.vue';
import ScreenLayout from '@/layout/screen.vue';

/**
 *
 * hidden: true                   记录为过场路由，处理某些事物的路由
 *
 * redirect: noRedirect           不会重定向
 * name:'router-name'             路由名称
 * meta : {
    title: 'title'               标题
  }
 */

export const constantRoutes = [
    // 用来不刷新页面，就更新组件
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index.vue'),
            },
        ],
    },

    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true,
    },

    {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        hidden: true,
    },

    {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        hidden: true,
    },
    // 大屏
    {
        path: '/screen',
        component: ScreenLayout,
        children: [
            {
                path: '',
                name: 'screen',
                component: () => import('@/views/screen/index.vue'),
                meta: { title: '大屏', type: 'screen' },
            }
        ]
    },

    // 兜底
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/404',
    //     hidden: true,
    // }
];

export const whiteAsyncRoutes = [
    // {
    //     path: '/',
    //     name: 'Layout',
    //     component: Layout,
    //     // redirect: '/home',
    //     children: [
    {
        path: 'index/config/see-configuration-pro/:id',
        name: 'SeeConfigUration',
        component: () => import('@/views/configuration-pro/index.vue'),
        meta: { title: '组态' },
    },
    // ],
    // },
];


export const asyncRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/analysis',
        children: [
            // 节能减碳
            // {
            //     path: '/energy',
            //     meta: { title: '节能减碳', icon: 'energy' },
            //     redirect: '/energy/strategy',
            //     component: Layout,
            //     children: [
            {
                path: 'strategy',
                name: 'EnergyStrategy',
                component: () => import('@/views/energyAndCarbonReduction/energyStrategy/index.vue'),
                meta: { title: '节能策略' }
            },
            {
                path: 'analysis',
                name: 'EnergyAnalysis',
                component: () => import('@/views/emptyPage/index.vue'),
                meta: { title: '节能分析' },
            },
            {
                path: 'energySavingPlan',
                name: 'EnergySavingPlan',
                component: () => import('@/views/energySavingControl/energySavingPlan/index.vue'),
                meta: { title: '节能预案' },
            },
            {
                path: 'energyPrediction',
                name: 'EnergyPrediction',
                component: () => import('@/views/energyDataAnalysis/energyPrediction/index.vue'),
                meta: { title: '能耗预测' },
            },
            {
                path: 'areaEnergySaving',
                name: 'AreaEnergySaving',
                component: () => import('@/views/energyAndCarbonReduction/ZonalEnergySaving/index.vue'),
                meta: { title: '分区节能' },
            },
            {
                path: 'environmentComfort',
                name: 'EnvironmentComfort',
                component: () => import('@/views/energyAndCarbonReduction/environmentComfort/index.vue'),
                meta: { title: '环境舒适度' }
            },
            {
                path: 'carbonEmission',
                component: () => import('@/views/energyDataManagement/carbonEmission/index.vue'),
                name: 'CarbonEmission',
                meta: { title: '碳排放' },
            },
            {
                path: 'otherSupportData',
                name: 'OtherSupportData',
                component: () => import('@/views/energyDataAnalysis/WeatherForecast/index.vue'),
                meta: { title: '其他支撑数据' }

            }

            //     ]
            // }
            ,

            // 能耗数据
            // {
            //     path: '/energyData',
            //     component: Layout,
            //     meta: { title: '能耗数据' },
            //     children: [
            {
                path: 'energyMonitoring',
                name: 'EnergyMonitoring',
                component: () => import('@/views/energyDataManagement/energyMonitoring/index.vue'),
                meta: { title: '能源站监测' },
            },
            {
                path: 'energyArea',
                name: 'EnergyArea',
                component: () => import('@/views/energyDataManagement/energyArea/index.vue'),
                meta: { title: '区域能耗' }
            },
            {
                path: 'itemizedEnergyReport',
                component: () => import('@/views/energyDataManagement/itemizedEnergyReport/index.vue'),
                name: 'ItemizedEnergyReport',
                meta: { title: '分项能耗' },
            },
            {
                path: 'energyData',
                name: 'EnergyData',
                component: () => import('@/views/energyDataManagement/energyData/index.vue'),
                meta: { title: '能耗基础数据' },
            },
            {
                path: 'totalEnergyReport',
                name: 'TotalEnergyReport',
                component: () => import('@/views/energyDataManagement/totalEnergyReport/index.vue'),
                meta: { title: '总能耗报表' },
            },
            {
                path: 'coldStationEnergyReport',
                component: () => import('@/views/energyDataManagement/coldStationEnergyReport/index.vue'),
                name: 'ColdStationEnergyReport',
                meta: { title: '冷站能耗报表' },
            },
            {
                path: 'meterConfig',
                component: () => import('@/views/energyDataManagement/meterConfig/index.vue'),
                name: 'MeterConfig',
                meta: { title: '表计配置' },
            },
            {
                path: 'systemEnergy',
                component: () => import('@/views/energyDataManagement/systemEnergy/index.vue'),
                name: 'SystemEnergy',
                meta: { title: '系统能效' },
            },
            {
                path: 'energyAbnormalAnalysis',
                component: () => import('@/views/energyDataManagement/energyAbnormalAnalysis/index.vue'),
                name: 'EnergyAbnormalAnalysis',
                meta: { title: '能耗异常分析' },
            },
            {
                path: 'energyReport',
                name: 'EnergyReport',
                component: () => import('@/views/energyDataAnalysis/WeatherForecast/EnergyReportManagement.vue'),
                meta: { title: '能耗报告' },  // 能耗分析报告
            },
            {
                path: 'codeStationTrend',
                component: () => import('@/views/energySavingControl/codeStationTrend/index.vue'),
                name: 'codeStationTrend',
                meta: { title: '冷站趋势图' }
            },
            //     ]
            // },

            // 设备运营（子菜单子路由）
            // 说明：侧边栏层级由后端菜单树驱动（见 src/mock/data.js 的「设备运营」分组 menuTree），
            // 此处只需将各叶子路由平铺注册，filterRoutes 会按 meta.title 与菜单名匹配并组织成子菜单。
            // 按需求整理设备运营下的设备控制类子路由，其中「网络设备监测」「设备运行参数」
            // 保持原状（作为菜单树中的直接子项，不在本次整理范围内）。
            {
                path: 'equipmentOperationStatus',
                component: () => import('@/views/energySavingControl/equipmentOperationStatus/index.vue'),
                name: 'EquipmentOperationStatus',
                meta: { title: '设备运行状态' },
            },
            {
                path: 'equipmentOperationControl',
                component: () => import('@/views/energySavingControl/equipmentOperationControl/index.vue'),
                name: 'EquipmentOperationControl',
                meta: { title: '设备运行控制' },
            },
            {
                path: 'equipmentRunningTime',
                component: () => import('@/views/energySavingControl/equipmentRunningTime/index.vue'),
                name: 'EquipmentRunningTime',
                meta: { title: '设备累计运行时长' },
            },
            {
                path: 'equipmentBatchControl',
                component: () => import('@/views/energySavingControl/equipmentBatchControl/index.vue'),
                name: 'EquipmentBatchControl',
                meta: { title: '设备批量控制' },
            },
            {
                path: 'devicePlan',
                component: () => import('@/views/energySavingControl/equipmentPlan/index.vue'),
                name: 'DevicePlan',
                meta: { title: '设备日程控制' },
            },
            {
                path: 'sequentialStartControl',
                component: () => import('@/views/energySavingControl/sequentialStartControl/index.vue'),
                name: 'SequentialStartControl',
                meta: { title: '顺序启停控制' },
            },
            {
                path: 'policyControl',
                component: () => import('@/views/energySavingControl/policyControl/index.vue'),
                name: 'PolicyControl',
                meta: { title: 'AI策略控制' },
            },
            // 以下两项按要求保持原状
            {
                path: 'networkDeviceDetection',
                component: () => import('@/views/energySavingControl/networkDeviceDetection/index.vue'),
                name: 'NetworkDeviceDetection',
                meta: { title: '网络设备监测' },
            },
            {
                path: 'codeStationReport',
                component: () => import('@/views/energySavingControl/codeStationReport/index.vue'),
                name: 'codeStationReport',
                meta: { title: '设备运行参数' }
            },

            // 智慧运维
            // {
            //     path: '/maintenance',
            //     component: Layout,
            //     meta: { title: '智慧运维' },
            //     children: [
            {
                path: 'intelligentOperationHome',
                component: () => import('@/views/intelligentOperationHome/index.vue'),
                name: 'intelligentOperationHome',
                meta: { title: '运维总览' },
            },
            {
                path: 'accountListManagement',
                component: () => import('@/views/accountListManagement/index.vue'),
                name: 'accountListManagement',
                meta: { title: '台账管理' }
            },
            {
                path: 'repairWorkOrder',
                component: () => import('@/views/repairWorkOrder/index.vue'),
                name: 'repairWorkOrder',
                meta: { title: '维修工单' },
            },
            // 巡检管理
            // {
            //     path: 'inspectManagement',
            //     component: { render: h => h('router-view') },
            //     meta: { title: '巡检管理' },
            //     children: [
            {
                path: 'autoInspection',
                component: () => import('@/views/inspectionManagement/autoInspection/index.vue'),
                name: 'autoInspection',
                meta: { title: '智能巡检' },
            },
            {
                path: 'planInspection',
                component: () => import('@/views/inspectionManagement/planInspection/index.vue'),
                name: 'planInspection',
                meta: { title: '计划巡检' }
            },
            {
                path: 'inspectionWordOrder',
                component: () => import('@/views/inspectionManagement/inspectionWordOrder/index.vue'),
                name: 'inspectionWordOrder',
                meta: { title: '巡检工单' }
            },
            {
                path: 'autoInspectionRecord',
                component: () => import('@/views/inspectionManagement/autoInspectionRecord/index.vue'),
                name: 'autoInspectionRecord',
                meta: { title: '智能巡检记录' }
            },
            {
                path: 'inspectionSet',
                component: () => import('@/views/inspectionManagement/inspectionSet/index.vue'),
                name: 'inspectionRecord',
                meta: { title: '智能巡检配置' },
            },
            {
                path: 'inspectionPath',
                component: () => import('@/views/inspectionManagement/inspectionPath/index.vue'),
                name: 'inspectionPath',
                meta: { title: '巡检路线' }
            },
            {
                path: 'inspectionHistory',
                component: () => import('@/views/inspectionManagement/inspectionHistory/index.vue'),
                name: 'inspectionHistory',
                meta: { title: '巡检记录' }
            },
            {
                path: 'inspectionContent',
                component: () => import('@/views/inspectionManagement/inspectionContent/index.vue'),
                name: 'inspectionContent',
                meta: { title: '巡检内容配置' }
            },
            {
                path: 'currentTrajectory',
                component: () => import('@/views/inspectionManagement/currentTrajectory/index.vue'),
                name: 'currentTrajectory',
                meta: { title: '实时巡检轨迹' }
            },
            //     ]
            // },
            //     ]
            // },

            // 系统管理
            // {
            //     path: '/system',
            //     component: Layout,
            //     meta: { title: '系统管理' },
            //     children: [
            {
                path: 'user',
                component: () => import('@/views/accountManagement/user/index.vue'),
                meta: { title: '用户管理' }
            },
            {
                path: 'role',
                component: () => import('@/views/accountManagement/role/index.vue'),
                meta: { title: '角色管理' }
            },
            {
                path: 'dataCorrection',
                component: () => import('@/views/accountManagement/dataCorrection/index.vue'),
                name: 'DataCorrection',
                meta: { title: '异常数据校正' },
            },
            //     ]
            // }
            {
                path: 'upkeepPlan',
                component: () => import('@/views/upkeep/upkeepPlan.vue'),
                name: 'upkeepPlan',
                meta: { title: '保养计划' },
            },
            {
                path: 'upkeepWorkOrder',
                component: () => import('@/views/upkeep/upkeepWorkOrder.vue'),
                name: 'upkeepWorkOrder',
                meta: { title: '保养工单' },
            },
            {
                path: 'warehouseManagement',
                component: () => import('@/views/warehouseManagement/index.vue'),
                name: 'warehouseManagement',
                meta: { title: '仓库管理' },
            },
            {
                path: 'stockTaking',
                component: () => import('@/views/stockTaking/index.vue'),
                name: 'stocktaking',
                meta: { title: '盘点' },
            },
            {
                path: 'stockRecord',
                component: () => import('@/views/stockRecord/index.vue'),
                name: 'stockRecord',
                meta: { title: '库存信息记录' },
            },
            {
                path: 'alarmLog',
                component: () => import('@/views/energySavingControl/alarmLog/index.vue'),
                name: 'AlarmLog',
                meta: { title: '告警记录' },
            },
            // 详情
            {
                path: 'alarmDetail/:id',
                component: () => import('@/views/energySavingControl/alarmLog/AlarmDetail.vue'),
                name: 'WarnDetail',
                meta: { title: '告警详情' }
            },
        ]
    }
]

const createRouter = () =>
    new VueRouter({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes,
    });

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
