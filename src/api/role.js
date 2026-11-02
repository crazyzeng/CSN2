import request from '@/utils/request'

// 查询登录用户的所有角色
export function getLoginUserAllRole() {
    return request({
        url: `/roleController/queryLoginAllRole`,
        method: 'get'
    })
}

// 
// 角色管理
// ---------------------

// 查询角色
export function getRoleData(data = {}, paging = { page: 1, size: 1000}) {
    return request({
        url: `roleController/findRole/${paging.page}/${paging.size}`,
        method: 'post',
        data
    })
}

// 通过 角色 code 获取对应的角色
export function getRoleByCode(roleCode) {
    return request({
        url: `/roleController/getRole/${roleCode}`,
        method: 'get'
    })
}
// 查询菜单
export function queryMenu(data) {
    return request({
        url: `/menuController/findMenu`,
        method: 'post',
        data
    })
}

// 新增用户
export function addRole(data = {}) {
    return request({
        url: `roleController/addRole`,
        method: 'post',
        data
    })
}

// 修改角色
export function updateRole(data = {}) {
    return request({
        url: `roleController/updateRole`,
        method: 'put',
        data
    })
}

// 删除角色
export function delRole(roleCode) {
    return request({
        url: `roleController/delRole/${roleCode}`,
        method: 'delete'
    })
}

// 删除角色菜单
export function delRoleMenuByRoleCode(roleCode) {
    return request({
        url: `roleController/delRoleMenuByRoleCode/${roleCode}`,
        method: 'delete'
    })
}

// 添加角色菜单
export function saveRoleMenuList(data) {
    return request({
        url: `roleController/saveRoleMenuList`,
        method: 'post',
        data
    })
}

// 配置角色菜单
export function configureRoleMenu(data,roleCode) {
    return request({
        url: `roleController/configureRoleMenu/${roleCode}`,
        method: 'post',
        data
    })
}

// 通过角色的到菜单
export function getMenuByRole(roleCode) {
    return request({
        url: `/menuController/getMenuByRole/${roleCode}`,
        method: 'get'
    })
}

//查询所有按钮
export function getMenuWithBtnByRoleCode(roleCode) {
    return request({
        url: `/menuController/getMenuWithBtnByRoleCode/${roleCode}`,
        method: 'get'
    })
}

//根据角色查询按钮权限
export function getMenuBtnIdByRoleCode(roleCode) {
    return request({
        url: `/menuController/getMenuBtnIdByRoleCode/${roleCode}`,
        method: 'get'
    })
}


//配置用户数据权限
export function configureRoleOrg(data,roleCode) {
    return request({
        url: `roleController/configureRoleOrg/${roleCode}`,
        method: 'post',
        data
    })
}

//配置用户按钮权限
export function configureRoleBtn(data,roleCode) {
    return request({
        url: `roleController/configureRoleBtn/${roleCode}`,
        method: 'post',
        data
    })
}