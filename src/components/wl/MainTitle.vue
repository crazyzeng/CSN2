<template>
  <!--
    标题栏组件（对应原 cict-libs 的 MainTitle，模板标签 <wl-main-title>）
    结构：标题文本 + 默认插槽（插槽用于放置返回按钮等右侧附加内容）
    样式类 .th-main-title 沿用 src/styles（base.scss / fix-style.scss）
  -->
  <div class="th-main-title">
    <h2>{{ dataTitle }}</h2>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WlMainTitle',
  props: {
    // 标题文案。组件标签上使用 data-title 属性会自动映射到该 camelCase 属性
    dataTitle: { type: String, default: '' },
  },
}
</script>