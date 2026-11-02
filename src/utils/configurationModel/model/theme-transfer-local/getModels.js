// 模型工厂聚合入口
//
// 原实现使用 webpack 的 require.context('./model', ...) 动态加载模型文件，
// 迁移到 Vite 后改用 import.meta.glob（eager 立即加载），效果等价：
// 一次性收集 ./model 目录下所有 JS 模型文件，并以“文件名”作为 key 注册工厂函数。

// 逐个匹配 ./model 目录下的 JS 文件并立即加载（返回 { 路径: 模块命名空间 }）
const modulesFiles = import.meta.glob('./model/*.js', { eager: true })

export default Object.keys(modulesFiles).reduce((modules, modulePath) => {
  // 由 ./model/TextModel.js 解析出 TextModel 作为导出 key（与 baseModelByType 的值对齐）
  const moduleName = modulePath.replace(/^\.\/model\/(.*)\.js$/, '$1')

  // 每个模型文件默认导出其 Model 类，这里包装成工厂函数 (data) => new Model(data)
  const { default: Model } = modulesFiles[modulePath]
  modules[moduleName] = (data) => new Model(data)

  return modules
}, {})