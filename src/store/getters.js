const getters = {

  // app.js
  headerFlag: state => state.app.headerFlag,
  sidebarFlag: state => state.app.sidebarFlag,
  size: state => state.app.size,

  // settings.js
  theme: state => state.settings.theme,
  elementTheme: state => state.settings.elementTheme,
  themeType: state => state.settings.themeType,

  // user.js
  user: state => state.user.user,
  menu: state => state.user.menu,
  roles: state => state.user.roles,
  allMenu: state => state.user.allMenu,

  // point.js
  dots: state => state.point.dots,
  station: state => state.point.station,
  updateDataPermission: state => state.point.updateDataPermission,

  // router-permission.js
  routes: state => state.routerPermission.routes
}

export default getters
