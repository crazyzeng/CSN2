export const pageRoutes = [
    {
        path: '/',
        redirect: '/home',
        children: [
            {
                path: 'home',
                component: () => import('@/views/homePage/index.vue'),
                name: 'Home',
                meta: { title: '首页' },
            },
            {
                path: 'accountListManagement',
                component: () => import('@/views/accountListManagement/index.vue'),
                name: 'accountListManagement',
                meta: { title: '台账管理' }
            },
            {
                path: 'intelligentOperationHome',
                component: () => import('@/views/intelligentOperationHome/index.vue'),
                name: 'intelligentOperationHome',
                meta: { title: '智能运维概览' },
            },

            // 仓库管理
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
            //巡检管理
            // 智能巡检
            {
                path: 'autoInspection',
                component: () => import('@/views/inspectionManagement/autoInspection/index.vue'),
                name: 'autoInspection',
                meta: { title: '智能巡检' },
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
            // 计划巡检
            {
                path: 'planInspection',
                component: () => import('@/views/inspectionManagement/planInspection/index.vue'),
                name: 'planInspection',
                meta: { title: '计划巡检' }
            },
            //巡检工单
            {
                path: 'inspectionWordOrder',
                component: () => import('@/views/inspectionManagement/inspectionWordOrder/index.vue'),
                name: 'inspectionWordOrder',
                meta: { title: '巡检工单' }
            },
            //巡检路线
            {
                path: 'inspectionPath',
                component: () => import('@/views/inspectionManagement/inspectionPath/index.vue'),
                name: 'inspectionPath',
                meta: { title: '巡检路线' }
            },
            // 实时巡检轨迹
            {
                path: 'currentTrajectory',
                component: () => import('@/views/inspectionManagement/currentTrajectory/index.vue'),
                name: 'currentTrajectory',
                meta: { title: '实时巡检轨迹' }
            },

            // 巡检记录
            {
                path: 'inspectionHistory',
                component: () => import('@/views/inspectionManagement/inspectionHistory/index.vue'),
                name: 'inspectionHistory',
                meta: { title: '巡检记录' }
            },
            //巡检内容配置
            {
                path: 'inspectionContent',
                component: () => import('@/views/inspectionManagement/inspectionContent/index.vue'),
                name: 'inspectionContent',
                meta: { title: '巡检内容配置' }
            },
            // 维修工单
            {
                path: 'repairWorkOrder',
                component: () => import('@/views/repairWorkOrder/index.vue'),
                name: 'repairWorkOrder',
                meta: { title: '维修工单' },
            },
            // 保养
            {
                path: 'upkeep',
                component: () => import('@/views/upkeep/upkeepPlan.vue'),
                name: 'upkeep',
                meta: { title: '保养管理' },
            },
            // 保养计划
            {
                path: 'upkeepPlan',
                component: () => import('@/views/upkeep/upkeepPlan.vue'),
                name: 'upkeepPlan',
                meta: { title: '保养计划' },
            },
            // 保养工单
            {
                path: 'upkeepWorkOrder',
                component: () => import('@/views/upkeep/upkeepWorkOrder.vue'),
                name: 'upkeepWorkOrder',
                meta: { title: '保养工单' },
            },
            // // 事件记录
            // {
            //     path:'eventRecording',
            //     component:() => import('@/views/intelligentOperationHome/eventRecording/index.vue'),
            //     name:'eventRecording',
            //     meta:{title:'事件记录'},
            // },
            // 事件记录
            {
                path: 'eventHistory',
                component: () => import('@/views/intelligentOperationHome/eventHistory/index.vue'),
                name: 'eventHistory',
                meta: { title: '事件记录' },
            },
            //节能控制管理energySavingControl
            // -------------------------------
            //设备运行状态
            {
                path: 'equipmentOperationStatus',
                component: () => import('@/views/energySavingControl/equipmentOperationStatus/index.vue'),
                name: 'EquipmentOperationStatus',
                meta: { title: '设备运行状态' },
            },
            //网络设备监测
            {
                path: 'networkDeviceDetection',
                component: () => import('@/views/energySavingControl/networkDeviceDetection/index.vue'),
                name: 'NetworkDeviceDetection',
                meta: { title: '网络设备监测' },
            },
            //设备运行控制
            {
                path: 'equipmentOperationControl',
                component: () => import('@/views/energySavingControl/equipmentOperationControl/index.vue'),
                name: 'EquipmentOperationControl',
                meta: { title: '设备运行控制' },
            },
            //设备累计运行时长
            {
                path: 'equipmentRunningTime',
                component: () => import('@/views/energySavingControl/equipmentRunningTime/index.vue'),
                name: 'EquipmentRunningTime',
                meta: { title: '设备累计运行时长' },
            },
            //节能预案
            {
                path: 'energySavingPlan',
                component: () => import('@/views/energySavingControl/energySavingPlan/index.vue'),
                name: 'EnergySavingPlan',
                meta: { title: '节能预案' },
            },
            // 节能预案 > 策略配置
            {
                path: 'energySavingRecord/:buildType',
                component: () => import('@/views/energySavingControl/energySavingPlan/EnergySavingRecord/index.vue'),
                name: 'energySavingRecord',
                hidden: true,
                meta: { title: '策略配置' },
            },
            //节能对比
            {
                path: 'energySavingComparison',
                component: () => import('@/views/energySavingControl/energySavingComparison/index.vue'),
                name: 'EnergySavingComparison',
                meta: { title: '节能对比' },
            },
            //区域能耗阈值
            {
                path: 'energyConsumptionThreshold',
                component: () => import('@/views/energySavingControl/energyConsumptionThreshold/index.vue'),
                name: 'EnergyConsumptionThreshold',
                meta: { title: '区域能耗阈值' },
            },
            //告警记录
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
            // 节能策略
            {
                path: 'energySavingStrategy',
                component: () => import('@/views/energySavingControl/energySavingStrategy/index.vue'),
                name: 'EnergySavingStrategy',
                meta: { title: '节能策略' },
            },
            // 新增策略
            {
                path: 'energySavingStrategySetting',
                component: () => import('@/views/energySavingControl/energySavingStrategy/setting.vue'),
                name: 'energySavingStrategySetting',
                meta: { title: '节能策略设置' }
            },

            //
            //能耗数据管理energyDataManagement
            // -------------------------------
            //能耗总览
            {
                path: 'energyTotal',
                component: () => import('@/views/energyDataManagement/energyTotal/index.vue'),
                name: 'EnergyTotal',
                meta: { title: '能耗总览' },
            },
            //区域能耗
            {
                path: 'energyArea',
                component: () => import('@/views/energyDataManagement/energyArea/index.vue'),
                name: 'EnergyArea',
                meta: { title: '区域能耗' },
            },
            //设备能耗
            {
                path: 'energyEquipment',
                component: () => import('@/views/energyDataManagement/energyEquipment/index.vue'),
                name: 'EnergyEquipment',
                meta: { title: '设备能耗' },
            },
            //碳排放
            {
                path: 'carbonEmission',
                component: () => import('@/views/energyDataManagement/carbonEmission/index.vue'),
                name: 'CarbonEmission',
                meta: { title: '碳排放' },
            },
            //分项能耗报表
            {
                path: 'itemizedEnergyReport',
                component: () => import('@/views/energyDataManagement/itemizedEnergyReport/index.vue'),
                name: 'itemizedEnergyReport',
                meta: { title: '分项能耗报表' },
            },
            //冷站能耗报表
            {
                path: 'coldStationEnergyReport',
                component: () => import('@/views/energyDataManagement/coldStationEnergyReport/index.vue'),
                name: 'coldStationEnergyReport',
                meta: { title: '冷站能耗报表' },
            },
            //17块总表能耗报表
            {
                path: 'totalEnergyReport',
                component: () => import('@/views/energyDataManagement/totalEnergyReport/index.vue'),
                name: 'totalEnergyReport',
                meta: { title: '17块总表能耗报表' },
            },
            // 能耗基础数据
            {
                path: 'energyData',
                component: () => import('@/views/energyDataManagement/energyData/index.vue'),
                name: 'energyData',
                meta: { title: '能耗基础数据' },
            },
            // 表计配置
            {
                path: 'meterConfig',
                component: () => import('@/views/energyDataManagement/meterConfig/index.vue'),
                name: 'meterConfig',
                meta: { title: '表计配置' },
            },
            //系统能效
            {
                path: 'systemEnergy',
                component: () => import('@/views/energyDataManagement/systemEnergy/index.vue'),
                name: 'systemEnergy',
                meta: { title: '系统能效' },
            },

            //
            //能耗数据分析energyDataAnalysis
            // -------------------------------
            //能耗预测
            {
                path: 'energyPrediction',
                component: () => import('@/views/energyDataAnalysis/energyPrediction/index.vue'),
                name: 'EnergyPrediction',
                meta: { title: '能耗预测' },
            },
            //节能统计
            {
                path: 'energySavingStatistics',
                component: () => import('@/views/energyDataAnalysis/energySavingStatistics/index.vue'),
                name: 'EnergySavingStatistics',
                meta: { title: '节能统计' },
            },
            //KPI分析
            {
                path: 'KPIanalysis',
                component: () => import('@/views/energyDataAnalysis/KPIanalysis/index.vue'),
                name: 'KPIanalysis',
                meta: { title: 'KPI分析' },
            },
            //室内舒适度监测
            {
                path: 'indoorComfortMonitoring',
                component: () => import('@/views/energyDataAnalysis/indoorComfortMonitoring/index.vue'),
                name: 'IndoorComfortMonitoring',
                meta: { title: '室内舒适度监测' },
            },
            //专家诊断
            {
                path: 'expertDiagnosis',
                component: () => import('@/views/energyDataAnalysis/expertDiagnosis/index.vue'),
                name: 'ExpertDiagnosis',
                meta: { title: '专家诊断' },
            },
            //设备健康
            {
                path: 'equipmentHealth',
                component: () => import('@/views/energyDataAnalysis/equipmentHealth/index.vue'),
                name: 'EquipmentHealth',
                meta: { title: '设备健康' },
            },
            //账单管理
            {
                path: 'billManagement',
                component: () => import('@/views/energyDataAnalysis/billManagement/index.vue'),
                name: 'BillManagement_DianDu',
                meta: { title: '账单管理' },
            },
            //能耗异常分析
            {
                path: 'energyAbnormalAnalysis',
                component: () => import('@/views/energyDataManagement/energyAbnormalAnalysis/index.vue'),
                name: 'energyAbnormalAnalysis',
                meta: { title: '能耗异常分析' },
            },

            //天气预报
            {
                path: 'weatherForecast',
                component: () => import('@/views/energyDataAnalysis/WeatherForecast/index.vue'),
                name: 'WeatherForecast',
                meta: { title: '天气预报' },
            },
            // 能耗分析报告
            {
                path: 'x',
                component: () => import('@/views/energyDataAnalysis/WeatherForecast/EnergyReportManagement.vue'),
                name: 'x',
                meta: { title: '能耗分析报告' },
            },
            {
                path: 'api',
                component: () => import('@/views/energyDataAnalysis/WeatherForecast/APIRoute.vue'),
                name: 'InterfaceManagement',
                meta: { title: '接口管理' },
            },



            /* //账单管理（力调电费）
            {
                path: 'billManagement_LiDiao',
                component: () => import('@/views/energyDataAnalysis/billManagement_LiDiao/index.vue'),
                name: 'BillManagement_LiDiao',
                meta: { title: '账单管理（力调电费）' },
            },
            //账单管理（基本电费）
            {
                path: 'billManagement_JiBen',
                component: () => import('@/views/energyDataAnalysis/billManagement_JiBen/index.vue'),
                name: 'BillManagement_JiBen',
                meta: { title: '账单管理（基本电费）' },
            }, */
            //
            //账户管理accountManagement
            // -------------------------------
            // 用户管理
            {
                path: 'user',
                component: () => import('@/views/accountManagement/user/index.vue'),
                name: 'User',
                meta: { title: '用户管理' },
            },
            // 数据异常校正
            {
                path: 'dataCorrection',
                component: () => import('@/views/accountManagement/dataCorrection/index.vue'),
                name: 'DataCorrection',
                meta: { title: '数据异常校正' },
            },

            //
            // 角色管理
            {
                path: 'role',
                component: () => import('@/views/accountManagement/role/index.vue'),
                name: 'Role',
                meta: { title: '角色管理' },
            },

            // 设备批量控制
            {
                path: 'equipmentBatchControl',
                component: () => import('@/views/energySavingControl/equipmentBatchControl/index.vue'),
                name: 'EquipmentBatchControl',
                meta: { title: '设备批量控制' },
            },
            // 设备日程控制
            {
                path: 'devicePlan',
                component: () => import('@/views/energySavingControl/equipmentPlan/index.vue'),
                name: 'DevicePlan',
                meta: { title: '设备日程控制' },
            },
            //设备日程控制设置
            {
                path: 'devicePlanSetting',
                component: () => import('@/views/energySavingControl/equipmentPlan/setting.vue'),
                name: 'DevicePlanSetting',
                meta: { title: '日程控制设置' }
            },
            //顺序启停控制
            {
                path: 'sequentialStartControl',
                component: () => import('@/views/energySavingControl/sequentialStartControl/index.vue'),
                name: 'SequentialStartControl',
                meta: { title: '顺序启停控制' }
            },
            //AI策略控制
            {
                path: 'policyControl',
                component: () => import('@/views/energySavingControl/policyControl/index.vue'),
                name: 'PolicyControl',
                meta: { title: 'AI策略控制' }
            },
            // 冷站运行参数
            {
                path: 'codeStationReport',
                component: () => import('@/views/energySavingControl/codeStationReport/index.vue'),
                name: 'codeStationReport',
                meta: { title: '设备运行参数' }
            },
            // 冷站趋势图
            {
                path: 'codeStationTrend',
                component: () => import('@/views/energySavingControl/codeStationTrend/index.vue'),
                name: 'codeStationTrend',
                meta: { title: '冷站趋势图' }
            },
        ],
    },
    {
        path: '/error',
        redirect: 'noRedirect',
        name: 'ErrorPages',
        meta: { title: '错误' },
        children: [
            {
                path: '401',
                component: () => import('@/views/error-page/401.vue'),
                name: 'Page401',
                meta: { title: '401', noCache: true },
            },
            {
                path: '404',
                component: () => import('@/views/error-page/404.vue'),
                name: 'Page404',
                meta: { title: '404', noCache: true },
            },
        ],
    },

    // 404
    { path: '*', redirect: '/error/404', hidden: true },


];
