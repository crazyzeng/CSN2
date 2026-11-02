import {
  menuTree, currentUser, roles, flatMenu, configTheme,
  energySaveAnalysis, energyPredict, energyStationData, energyStationTree,
  stockStatistics, repositoryList,
  repairStatistics, repairDetail,
  policyMode, policyStrategy, policyAllow, policyRecord,
  energyCompareAnalysis,
  billElectricity, priceRuleElectricity, billBasic, priceRuleBasic, billAdjustment,
  equipmentDetail, equipmentList, maintainPlanDetail,
  maintainWorkOrderStatistical, maintainWorkOrderDetail,
  stockOrderDetail, dictMap,
  screenTotal, screenAreaSaving, screenStationEnergy, screenTempData,
  screenItemBenchmark, screenItemEnergy,
  carbonStatistics, subItemList, meterDataList,
} from './data'

/**
 * 统一 mock 拦截器（axios adapter）
 *
 * 需求约定：所有接口调用统一在 src/utils/request.js 中拦截并替换为 mock。
 * 本文件对外提供 createMockAdapter，被 request.js 注入到每个请求的 config.adapter，
 * 使 axios 不再发起真实网络请求，而是直接返回本地模拟数据。
 */

/** 包装成功的响应体（与后端约定的 { code, data, msg } 结构保持一致） */
function ok(data) {
  return { code: 200, data, msg: 'success' }
}

/**
 * 构造「空列表」兜底值。
 *
 * 对未单独覆盖的列表/详情接口，返回一个空数组，并通过不可枚举属性挂载常见分页字段
 * （records / list / rows）。这样既能继续作为「空数组」被各页面正常消费
 * （el-table 绑定、`res.data.map(...)`、`res.data.length`、`Object.keys` 均保持空语义），
 * 又能让 `res.data.records.map(...)` 这类写法在字段为空时不因访问 undefined 而抛 TypeError。
 */
function emptyList() {
  const arr = []
  const define = (key, value) =>
    Object.defineProperty(arr, key, { value, enumerable: false, writable: false })
  define('records', [])
  define('list', [])
  define('rows', [])
  define('total', 0)
  return arr
}

/** 根据接口 url + method 分发到对应的 mock 处理函数 */
function handle(method, url, rawUrl) {
  // ---- 认证与用户 ---- //
  if (method === 'post' && url === '/login') {
    return ok({ token: 'mock-token', ...currentUser })
  }
  if (method === 'post' && url === '/logout') {
    return ok(null)
  }
  // 注意匹配顺序与方式：/getCurrentUserMenu 必须以 endsWith 精确区分，
  // 否则会被 /getCurrentUser 的 includes 判断子串误匹配到用户对象。
  if (url.endsWith('/userController/getCurrentUserMenu')) {
    return ok(flatMenu)
  }
  if (url.endsWith('/userController/getCurrentUser')) {
    return ok(currentUser)
  }
  if (url.includes('/userController/getRoleByUser')) {
    return ok(roles)
  }
  if (url.endsWith('/menuController/new/menu')) {
    return ok(menuTree)
  }

  // ---- 组态 ---- //
  // 用带尾斜杠的 getConfigTheme/ 精确匹配 /getConfigTheme/{id}，
  // 避免误匹配 getConfigThemeByMenuAndOrg/{orgId}/{dicCode}。
  if (url.includes('/configThemeController/getConfigTheme/')) {
    return ok(configTheme)
  }

  // ---- 节能减碳分析（新版节能分析页） ---- //
  if (url.endsWith('/homePage/new/energySaveAnalysis')) {
    return ok(energySaveAnalysis)
  }
  if (url.endsWith('/homePage/new/energyPredict')) {
    return ok(energyPredict)
  }
  if (url.endsWith('/homePage/new/energyStationData')) {
    return ok(energyStationData)
  }
  if (url.endsWith('/homePage/new/energyStationTree')) {
    return ok(energyStationTree)
  }

  // ---- 仓库管理 ---- //
  // 单号接口返回字符串，供表单回填 orderNumber
  if (url.endsWith('/common/outNumber')) return ok('CK20261030-001')
  if (url.endsWith('/common/inNumber')) return ok('RK20261030-001')
  if (url.endsWith('/common/allocateNumber')) return ok('DB20261030-001')
  if (url.endsWith('/common/scrapNumber')) return ok('BF20261030-001')
  if (url.endsWith('/stock/listRepository')) {
    return ok(repositoryList)
  }
  if (url.endsWith('/stock/statistics')) {
    return ok(stockStatistics)
  }

  // ---- 字典（query 中的 dictCode 已被剥离，需从 rawUrl 解析回 code） ---- //
  if (url.includes('/dicController/getDictItemsByCode')) {
    const m = /dictCode=([^&]+)/.exec(rawUrl || '')
    return ok(m ? (dictMap[m[1]] || []) : [])
  }

  // ---- 维修工单 ---- //
  if (url.endsWith('/repair/statistics')) {
    return ok(repairStatistics)
  }
  if (method === 'get' && /\/repair\/\d+$/.test(url)) {
    return ok(repairDetail)
  }

  // ---- 碳排放 ---- //
  // 注意：该接口 url 为 `carbon/statistics?date=...`（无前导斜杠），
  // axios 自定义 adapter 不会拼接 baseURL，故用 includes 兼容两种写法。
  if (url.includes('carbon/statistics')) {
    return ok(carbonStatistics)
  }

  // ---- 能耗基础数据 ---- //
  // /energyData/subItem 需用 endsWith 精确匹配，避免误伤 /energyData/subItemEnergy 等接口。
  if (url.endsWith('/energyData/subItem')) {
    return ok(subItemList)
  }
  if (url.endsWith('/meter/data/list')) {
    return ok(meterDataList)
  }

  // ---- 能耗异常分析 ---- //
  if (url.endsWith('/energyData/energyCompareAnalysis')) {
    return ok(energyCompareAnalysis)
  }

  // ---- AI 策略控制 ---- //
  if (url.endsWith('/energySave/getModeSelect')) {
    return ok(policyMode)
  }
  if (url.endsWith('/energySave/getStrategy')) {
    return ok(policyStrategy)
  }
  if (url.endsWith('/energySave/getAllow')) {
    return ok(policyAllow)
  }
  if (url.endsWith('/energySave/getRecord')) {
    return ok(policyRecord)
  }

  // ---- 账单管理 ---- //
  if (url.endsWith('/bill/electricity')) {
    return ok(billElectricity)
  }
  if (url.endsWith('/bill/basic')) {
    return ok(billBasic)
  }
  if (url.endsWith('/bill/adjustment')) {
    return ok(billAdjustment)
  }
  if (url.endsWith('/priceRule/electricity')) {
    return ok(priceRuleElectricity)
  }
  if (url.endsWith('/priceRule/basic')) {
    return ok(priceRuleBasic)
  }

  // ---- 台账 / 设备 ---- //
  if (url.endsWith('/equipment/listByParam')) {
    return ok(equipmentList)
  }
  if (method === 'get' && /\/equipment\/\d+$/.test(url)) {
    return ok(equipmentDetail)
  }

  // ---- 保养 ---- //
  if (url.endsWith('/maintain/workOrder/statistical')) {
    return ok(maintainWorkOrderStatistical)
  }
  if (method === 'get' && /\/maintain\/plan\/\d+$/.test(url)) {
    return ok(maintainPlanDetail)
  }
  if (method === 'get' && /\/maintain\/workOrder\/\d+$/.test(url)) {
    return ok(maintainWorkOrderDetail)
  }

  // ---- 库存信息记录 ---- //
  if (url.includes('/stock/getStockOrderDetail/')) {
    return ok(stockOrderDetail)
  }

  // ---- 大屏（screen） ---- //
  if (url.includes('/homePage/new/total/')) {
    return ok(screenTotal)
  }
  if (url.includes('/homePage/new/stationEnergy/')) {
    return ok(screenStationEnergy)
  }
  // itemEnergyBenchmark 比 itemEnergy 更具体，须先匹配
  if (url.includes('/homePage/new/itemEnergyBenchmark/')) {
    return ok(screenItemBenchmark)
  }
  if (url.includes('/homePage/new/itemEnergy/')) {
    return ok(screenItemEnergy)
  }
  if (url.endsWith('/homePage/new/tempData')) {
    return ok(screenTempData)
  }
  if (url.endsWith('/homePage/yearStatistics')) {
    return ok(screenAreaSaving)
  }

  // ---- 其它列表/详情接口：返回带分页字段的空数组，保证各页面渲染空态而不报错 ---- //
  return ok(emptyList())
}

/**
 * axios adapter 实现：返回符合 AxiosResponse 形状的对象，
 * 以便现有响应拦截器（读取 response.data）继续正常工作。
 */
export function createMockAdapter(config) {
  const rawUrl = config.url || ''
  const url = rawUrl.split('?')[0]
  const method = String(config.method || 'get').toLowerCase()
  const body = handle(method, url, rawUrl)

  return Promise.resolve({
    data: body,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  })
}