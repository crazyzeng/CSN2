import type { PluginObject } from 'vue'
import MainTitle from './MainTitle.vue'
import MainContainer from './MainContainer.vue'
import Card from './Card.vue'
import ScrollList from './ScrollList.vue'
import FlyBox from './FlyBox.vue'
import Material from './Material/index.vue'

/**
 * 本地化 wl-* 组件集合（替代原私有库 cict-libs / cict-configuration）。
 *
 * 说明：
 * - 原项目通过 cict-libs 全局注册 MainTitle/MainContainer/Card/ScrollList/FlyBox，
 *   通过 cict-configuration 注册 Material（组态物料渲染器）。
 * - 本次按要求移除 cict-* 依赖后，用本目录等价实现替换，保持模板中
 *   <wl-main-title>、<wl-main-container>、<wl-card>、<wl-scroll-list>、
 *   <wl-fly-box>、<wl-material> 等标签无需改动即可继续使用。
 */

const components = {
  MainTitle,
  MainContainer,
  Card,
  ScrollList,
  FlyBox,
  Material,
} as const

/** 将 PascalCase 组件名转换为 kebab-case 的全局标签名 */
function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const install: PluginObject<never> = {
  install(Vue) {
    ;(Object.keys(components) as Array<keyof typeof components>).forEach((key) => {
      Vue.component(`wl-${toKebab(key)}`, components[key])
    })
  },
}

export default install
export { MainTitle, MainContainer, Card, ScrollList, FlyBox, Material }