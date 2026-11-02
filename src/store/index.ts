import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

/**
 * 用 Vite 的 import.meta.glob 替代 webpack 的 require.context，
 * 实现 modules 目录下所有 vuex 模块的自动注册。
 * - eager: true 表示立即加载，等价于原 require.context 的同步导入语义。
 */
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true }) as Record<
  string,
  { default: unknown }
>

const modules: Record<string, unknown> = {}

Object.keys(modulesFiles).forEach((modulePath) => {
  // ./modules/app.js -> app
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.js$/, '$1')
  modules[moduleName] = modulesFiles[modulePath].default
})

const store = new Vuex.Store({
  modules,
  getters,
})

export default store