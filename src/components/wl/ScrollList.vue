<template>
  <!--
    纵向滚动列表（对应原 cict-libs 的 ScrollList，模板标签 <wl-scroll-list>）
  -->
  <div class="wl-scroll-list">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WlScrollList',
}
</script>

<style lang="scss" scoped>
.wl-scroll-list {
  height: 100%;
  overflow-y: auto;
}
</style>