<template>
  <el-dropdown @command="userOperate" trigger="click">
    <span class="el-dropdown-link flex items-center">
      <img class="rounded-full" width="40px" src="@/assets/header/tx.png" alt="">
      <span class=" text-black ml-1">{{ getUserName }}</span>
      <i class="el-icon-caret-bottom text-xl text-blue-600 ml-1"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
      <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'UserInfo',
  computed: {
    getUserName() {
      const { user, roles } = this.$store.getters
      if (roles.length <= 0) roles.push({})
      return user.userName ? `${user.userName}` : 'Admin'
    },
  },
  methods: {
    // 用户操作
    userOperate(type) {
      this.$emit(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown {
  color: #fff !important;
}
</style>>
