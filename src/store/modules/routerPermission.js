import { asyncRoutes, constantRoutes, whiteAsyncRoutes } from '@/router'
import { pageRoutes } from '@/router/pageRoutes'
import Layout from '@/layout/index.vue';

/**
 * TODO
 * 获取 生成路由 还没有经过验证，所以直接加载了所有的离线 路由
*/

/**
 * @description 生成用户路由
 * @param routes asyncRoutes
 * @param menu 用户菜单数据
 */
function generateUserRoutes(menu, router) {
    let route = [];
    router[0].children.forEach(v => {
        for (let d of menu) {

            let userPath = d.urlAddress.split('/');
            let routerPath = v.path.split('/');

            if (userPath[userPath.length - 1] == ':id') userPath.length = userPath.length - 1;
            if (userPath[userPath.length - 1].split('?').length > 1) userPath[userPath.length - 1] = userPath[userPath.length - 1].split('?')[0];
            if (userPath[userPath.length - 1] === routerPath[0]) {
                if ((d.children && d.children.length > 0) && (v.children && v.children.length > 0)) {
                    v.children = generateUserRoutes(d.children, v.children);
                }
                route.push(v);
            }
        }
    });

    router[0].children = route
    console.log('router:', router)
    return router
}

const state = {
    routes: [],
    addRoutes: []
}

// const mutations = {
//     SET_ROUTES: (state, routes) => {
//         state.addRoutes = routes
//         state.routes = constantRoutes.concat(routes)
//     }
// }

// const actions = {
//     generateRoutes({ commit }, menu) {
//         return new Promise(resolve => {
//             asyncRoutes[0].children = asyncRoutes[0].children.concat(pageRoutes); // 合并自动添加的路由
//             const accessedRoutes = generateUserRoutes(menu, asyncRoutes)
//             commit('SET_ROUTES', accessedRoutes)
//             resolve(accessedRoutes)
//         })
//     }
// }

/**
 * 处理新菜单接口数据
 */
// 扁平化菜单 name
function getAllMenuNames(menuList) {
    let result = []

    function loop(list) {
        list.forEach(item => {
            result.push(item.name)
            if (item.children && item.children.length) {
                loop(item.children)
            }
        })
    }

    loop(menuList)
    return result
}



const mutations = {
    SET_ROUTES(state, routes) {
        state.routes = routes
    }
}
let uniqueId = 0

function generateUniqueKey(menu, parentPath = '') {
    uniqueId++
    return `${parentPath}_${menu.menuName}_${uniqueId}`
}

// 🔥 扁平化路由（方便查找）
function flattenRoutes(routes) {
    let res = []

    routes.forEach(r => {
        if (r.children) {
            res = res.concat(flattenRoutes(r.children))
        } else {
            res.push(r)
        }
    })

    return res
}

function filterRoutes(allRoutes, menuList, parentPath = '') {
  const res = []
  const flatRoutes = flattenRoutes(allRoutes)

  menuList.forEach(menu => {
    // 后端菜单节点字段约定为 menuName（见 role 页 el-tree 的 props label），
    // 这里按 menuName 匹配路由表 meta.title 并作为侧边栏标题。
    const matchRoute = flatRoutes.find(
      r => r.meta?.title === menu.menuName
    )

    let children = []

    if (menu.children?.length) {
      children = filterRoutes(
        allRoutes,
        menu.children,
        parentPath + '/' + menu.menuName
      )
    }

    const route = {
      path: matchRoute?.path || menu.urlAddress || '',
      meta: {
        title: menu.menuName
      },
      _key: generateUniqueKey(menu, parentPath)
    }

    if (children.length) {
      route.children = children
    }

    res.push(route)
  })

  return res
}

const actions = {
    generateRoutes({ commit }, menuList) {
        return new Promise(resolve => {

            uniqueId = 0

            // 菜单树（只用于 sidebar）
            const menuTree = filterRoutes(asyncRoutes, menuList)

            // sidebar 只放菜单
            commit('SET_ROUTES', [
                {
                    path: '/',
                    component: Layout,
                    children: menuTree
                }
            ])

            // 真正路由
            const realRoutes = [
                {
                    path: '/',
                    component: Layout,
                    children: [
                        ...asyncRoutes[0].children,   // 本地页面
                        ...whiteAsyncRoutes.map(r => ({
                            ...r,
                            path: r.path.startsWith('/') ? r.path : '/' + r.path // ⭐修正
                        }))
                    ]
                }
            ]

            resolve(realRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
