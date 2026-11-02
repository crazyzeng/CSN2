<template>
  <el-aside class="th-aside flex flex-col items-center">
    <div class="curTitle">{{ curMenu }}</div>
    <div class="theme-sidebar-box">
      <el-menu :default-active="$route.path" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false"
        router>
        <sidebar-item v-for="item in menuList" :key="item._key" :item="item">
        </sidebar-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
import router from "@/router/index";
import SidebarItem from "./SidebarItem.vue";

export default {
  name: "Sidebar",
  components: { SidebarItem },
  data() {
    return {
      isCollapse: false,
      curMenu: '',
    };
  },
  computed: {
    menuList() {
      const menu = this.$store.getters.routes
      return menu[0].children
    },
  },
  created() {
    this.setCurMenu(this.$route)
  },

  watch: {
    '$route'(val) {
      this.setCurMenu(val)
    }
  },

  methods: {
    setCurMenu(route) {
      const match = this.findMenuByPath(this.menuList, route.path)

      this.curMenu = match?.meta?.title || ''
    },
    matchPath(menuPath, routePath) {
      if (!menuPath) return false

      const fullPath = menuPath.startsWith('/')
        ? menuPath
        : '/' + menuPath

      // 完全匹配
      if (fullPath === routePath) return true

      // 动态路由匹配（关键）
      if (routePath.startsWith(fullPath)) return true

      return false
    },

    findMenuByPath(menuList, path) {
      for (const item of menuList) {

        if (this.matchPath(item.path, path)) {
          return item
        }

        if (item.children?.length) {
          const res = this.findMenuByPath(item.children, path)
          if (res) return res
        }
      }

      return null
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-menu {
    border-right: none;
  }
}

.th-aside {
  width: 250px !important;
  margin: 0 0 20px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 1px 10px 0px rgba(57, 160, 248, 0.2);
  padding: 20px 5px 20px;

  .curTitle {
    font-size: 22px;
    font-weight: bold;
    // letter-spacing: 1px;
    background: linear-gradient(to bottom, #7397fb, #1e59fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    text-align: center;
    margin: 0 10px 10px;
  }

  .theme-sidebar-box {
    height: calc(100% - 50px);
    overflow-y: scroll;
    padding: 5px;
  }
}
</style>
