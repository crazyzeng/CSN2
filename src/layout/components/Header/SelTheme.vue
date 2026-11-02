<template>
  <el-dropdown @command="setTheme" trigger="click">
    <span class="el-dropdown-link">
      <i class="th-icon-theme"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="blue">科技</el-dropdown-item>
      <el-dropdown-item command="white">简约</el-dropdown-item>
      <el-dropdown-item command="grey">黑白</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SelTheme',
  methods: {
    // 设置皮肤
    setTheme(type) {
      this.$store.dispatch('settings/replaceTheme', type)
    },
  }
}
</script>

<style></style>
