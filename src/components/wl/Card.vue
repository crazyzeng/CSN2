<template>
  <!--
    卡片容器（对应原 cict-libs 的 Card，模板标签 <wl-card>）
    由于原私有包样式未随项目源码留存，此处用简洁的中性卡片样式兜底，
    保证布局与可读性稳定；调用方可通过 class 进一步定制。
  -->
  <div class="wl-card" :class="{ 'is-border': border }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WlCard',
  props: {
    border: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.wl-card {
  position: relative;
  box-sizing: border-box;
  padding: 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 10px 0 rgba(57, 160, 248, 0.2);
}
</style>