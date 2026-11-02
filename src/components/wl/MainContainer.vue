<template>
  <!--
    带标题的外层容器（对应原 cict-libs 的 MainContainer，模板标签 <wl-main-container>）
    - theme-main          ：整体装饰边框（蓝色主题由 theme.scss 控制）
    - theme-main-title    ：头部区域
    - th-container-view   ：内容区域
    header 插槽：覆盖默认标题；默认插槽：正文内容
  -->
  <div class="theme-main">
    <div class="theme-main-title">
      <slot name="header">
        <div class="th-main-title">
          <h2>{{ dataTitle }}</h2>
        </div>
      </slot>
    </div>
    <div class="th-container-view">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WlMainContainer',
  props: {
    dataTitle: { type: String, default: '' },
  },
}
</script>