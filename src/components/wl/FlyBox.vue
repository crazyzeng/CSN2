<template>
  <!--
    装饰性边框盒子（对应原 cict-libs 的 FlyBox，模板标签 <wl-fly-box>）
    保留为通用占位容器，供大屏装饰性内容使用。
  -->
  <div class="wl-fly-box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WlFlyBox',
}
</script>

<style lang="scss" scoped>
.wl-fly-box {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>