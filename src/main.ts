import Vue from 'vue'
import Cookies from 'js-cookie'

// 全局基础样式重置
import 'normalize.css/normalize.css'

// element-ui：组件 + 预编译主题（替代原 element-variables.scss 的 sass 主题编译）
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 图标与全局样式
import './assets/css/icon.css'
import './assets/icon/iconfont.css'

// Tailwind v3 指令入口与全局样式
import './styles/tailwind.css'
import './styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'

import 'default-passive-events'

import './router-permission'

import * as filters from './filters'
import Validate from './utils/validate'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// echarts 及主题
import * as echarts from 'echarts'
import themeTh from './assets/echarts-theme/theme-th.js'

// 本地化 wl-* 组件（替代已移除的 cict-libs / cict-configuration）
import WlComponents from './components/wl'

echarts.registerTheme('th', themeTh)

// 挂载到原型，方便各页面直接 this.$echarts / this.$validate
Vue.prototype.$echarts = echarts
Vue.prototype.$validate = Validate

Vue.use(VueQuillEditor)
Vue.use(WlComponents)
Vue.use(Element, {
  size: Cookies.get('size') || 'mini',
})

// 注册全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')