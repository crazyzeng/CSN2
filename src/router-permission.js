import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 配置 - showSpinner：是否显示spinner图片

const whiteList = ['/login'] // 白名单

// router.beforeEach(async (to, from, next) => {
//     // start progress bar
//     NProgress.start()

//     // 设置title
//     document.title = getPageTitle(to.meta.title)
//     // 用户权限验证
//     // ----------------------------
//     const hasToken = getToken()

//     if(hasToken) {
//         if (to.path === '/login') {
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             const hasUser = store.getters.user && Object.keys(store.getters.user).length > 0
//             const hasMenu = store.getters.menu && store.getters.menu.length > 0
//             const hasRoles = store.getters.roles && store.getters.roles.length > 0
//             if(hasUser && hasMenu && hasRoles) {
//                 next()
//             } else {
//                 try {
//                     const { user, menu, roles } = await store.dispatch('user/getUserInfo')
//                     const accessRoutes = await store.dispatch('router-permission/generateRoutes', menu)
//                     router.addRoutes(whiteAsyncRoutes)
//                     router.addRoutes(accessRoutes)
//                     next({ ...to, replace: true })
//                 } catch (error) {
//                     await store.dispatch('user/resetToken')
//                     Message.error(error || 'Has Error')
//                     // next(`/login?redirect=${to.path}`)
//                     next(`/login`)
//                     NProgress.done()
//                 }
//             }
//         }
//     } else {
//         if (whiteList.indexOf(to.path) !== -1) {
//             // 白名单放行
//             next()
//         } else {
//             // 无权限重定向
//             next(`/login`)
//             NProgress.done()
//         }
//     }
// });


router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  // 没登录
  if (!hasToken) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
    return
  }

  // 🔹 已登录
  if (to.path === '/login') {
    next('/')
    NProgress.done()
    return
  }

  // 判断是否已经加载过菜单
  const hasMenu = store.getters.menu && store.getters.menu.length > 0

  let isAddRoute = false

  if (hasMenu) {
    next()
  } else {
    try {
      const { allMenu } = await store.dispatch('user/getUserInfo')

      const accessRoutes = await store.dispatch(
        'routerPermission/generateRoutes',
        allMenu
      )

      // if (!isAddRoute) {
      accessRoutes.forEach(route => {
        router.addRoute(route)
      })
      // 注：白名单路由（whiteAsyncRoutes）已由 generateRoutes 合并进 accessRoutes，
      // 此处无需再单独 addRoute，否则会导致同名路由重复定义。

      next({ ...to, replace: true })
    } catch (error) {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
