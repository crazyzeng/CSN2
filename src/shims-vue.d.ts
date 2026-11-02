/**
 * 让 TypeScript 识别 .vue 单文件组件以及若干缺失类型声明的第三方库。
 * 本项目采用“渐进式宽松 TS”，多数业务页面仍为 JS Options API，
 * 此声明主要用于保证 IDE 中的导入不报错。
 */
declare module '*.vue' {
  import type Vue from 'vue'
  const component: Vue
  export default component
}

// 以下历史依赖没有自带类型声明，统一按 any 处理
declare module 'vue-quill-editor'
declare module 'v-charts'
declare module 'vue-draggable-resizable'
declare module 'qrcode.vue'
declare module 'vue-easytable'
declare module 'vue-pdf'
declare module 'vuedraggable'
declare module 'js-file-download'
declare module 'print-js'
declare module 'stompjs'