# 长沙南综合节能管理控制系统（csn-1）

面向长沙南片区的综合节能管理控制平台，覆盖节能减碳、能耗数据、设备运营、智慧运维、系统管理、告警管理等业务域，并集成了基于 three.js 的三维站场可视化大屏。

## 技术栈

本项目采用 **Vue 2.7 桥接 + Vite + TypeScript + pnpm** 的渐进式重构方案：

| 类别 | 技术 |
| --- | --- |
| 运行时 | Vue `2.7.16`（保留 Vue2 生态与 Composition API） |
| 构建 | Vite `5.4` + `@vitejs/plugin-vue2` |
| 语言 | TypeScript `5.4`（渐进式宽松，允许 `.js` / `.vue` 共存） |
| 组件库 | Element UI `2.15`（未迁移至 element-plus） |
| 状态 / 路由 | Vuex `3.6` / Vue Router `3.6`（hash 模式） |
| 三维 | three.js `0.180`（GLTF/GLB + Draco + HDR + 后处理描边） |
| 图表 | ECharts `5.6` |
| 样式 | Tailwind CSS `3.4` + SCSS（全局注入 variables / mixin） |
| 包管理 | pnpm |

## 环境要求

- Node.js ≥ 18（推荐 18 / 20 LTS）
- pnpm ≥ 8

## 安装与启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认端口 8080）
pnpm dev

# 生产构建
pnpm build

# 本地预览构建产物
pnpm preview
```

启动后访问 http://localhost:8080 ，登录流程走 mock（任意账号密码均可进入，实际由 mock 返回 `admin` 用户）。

## 脚本说明

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | 生产构建，产物输出至 `dist/` |
| `pnpm preview` | 预览 `dist/` 构建产物 |
| `pnpm new` | 通过 plop 按模板生成代码（按提示操作） |

## 目录结构

```
csn-1
├─ src
│  ├─ api                   # 接口定义（约定 url + method，实际走 mock）
│  ├─ assets                # 图片 / 图标 / echarts 主题
│  ├─ components
│  │  └─ wl                 # 本地化组件（替代已移除的 cict-libs / cict-configuration）
│  ├─ filters               # 全局过滤器
│  ├─ layout                # 主布局 / 大屏布局
│  ├─ mixins                # 业务 mixin
│  ├─ mock                  # mock 数据（index.js 分发 / data.js 数据）
│  ├─ router                # 路由表（含静态 + 动态异步路由）
│  ├─ store                 # Vuex 模块（import.meta.glob 自动注册）
│  ├─ styles                # tailwind 入口 / 全局样式 / scss 变量与 mixin
│  ├─ utils
│  │  ├─ request.js         # axios 实例（统一在拦截器中注入 mock）
│  │  └─ threeD             # three.js 初始化 / 相机 / 高亮控制器
│  ├─ views                 # 业务页面
│  ├─ main.ts               # 应用入口
│  ├─ settings.ts           # 全局配置
│  ├─ router-permission.js  # 路由守卫 + 动态路由挂载
│  └─ App.vue
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.js
├─ postcss.config.cjs
└─ package.json
```

## 核心机制说明

### 1. 接口统一 mock 拦截

所有接口调用统一收敛到 [src/utils/request.js](src/utils/request.js) 的**请求拦截器**中：通过注入 `config.adapter`，让 axios 直接返回本地 mock 数据而**不发起真实网络请求**。

- mock 分发逻辑：[src/mock/index.js](src/mock/index.js)
- mock 数据定义：[src/mock/data.js](src/mock/data.js)
- 返回结构遵循后端约定：`{ code: 200, data, msg }`，响应拦截器逻辑保持不变。
- 如需临时联调真实后端，可在单个请求配置中设置 `useMock: false` 关闭 mock：
  ```js
  request({ url: '/xxx', method: 'get', useMock: false })
  ```

### 2. 动态路由与菜单

路由采用「后端菜单树 + 前端路由表匹配」的方式生成：

1. 登录后通过 mock 返回菜单树（`getNewMenu`）与用户菜单（`getCurrentUserMenu`）；
2. `src/router-permission.js` 的路由守卫调用 `routerPermission/generateRoutes`；
3. 依据菜单树叶节点 `menuName` 与路由表 `meta.title` 匹配，动态挂载侧边栏子路由。

`src/router/index.js` 中的异步路由按业务域平铺注册，「设备运营」分组的子菜单由菜单树驱动组织；「网络设备监测」「设备运行参数」按要求保持原状、未纳入本次子路由整理。

### 3. cict-* 私有库移除

- 原 `cict-utils`、`cict-libs`、`cict-configuration` 等私有依赖已全部移除；
- 相关能力本地化为：
  - 工具函数迁移至 `src/utils/`；
  - 组态物料能力迁移至 `src/utils/configurationModel/`；
  - 通用 UI 组件本地化为 `src/components/wl/`（MainTitle / MainContainer / Card / ScrollList / FlyBox / Material）。

### 4. three.js 三维可视化

三维能力集中在：

- [src/utils/threeD/init.js](src/utils/threeD/init.js) — 场景 / 相机 / 渲染器 / 灯光 / 模型加载与资源释放；
- [src/utils/threeD/cameraController.js](src/utils/threeD/cameraController.js) — 相机平滑飞行；
- [src/utils/threeD/highlightManager.js](src/utils/threeD/highlightManager.js) — 后处理描边高亮；
- [src/views/screen/components/threeD/](src/views/screen/components/threeD/) — 三维组件集成与选择控制器（射线拾取 / 高亮 / 相机飞行）。

上述文件均附带详细中文注释，便于理解与二次开发。

## 环境变量

- `.env.development`：开发环境变量，`VITE_APP_BASE_API` 为历史接口前缀（mock 拦截下不实际发起请求）。
- `.env.production`：生产环境变量，构建时使用相对路径 `./`，便于任意目录部署。

## 注意事项

- **Windows 构建 esbuild 报错**：若出现 `Access is denied`，本项目已通过 `package.json` 的 `pnpm.overrides` 将 esbuild 锁定为 `0.25.2` 修复，请勿随意降级。
- **scss 全局注入**：`styles/variables.scss` 与 `styles/mixin.scss` 已通过 `vite.config.ts` 的 `additionalData` 注入到每个 `.scss/.vue`，无需手动 `@import`。
- **路径别名**：`@` 指向 `src`，`~element-ui` 指向 element-ui 包（仅为兼容历史引用）。