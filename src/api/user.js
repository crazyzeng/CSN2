import request from '@/utils/request'

// 获取菜单
export function getNewMenu() { 
  return request({
    method: 'get',
    url: `/menuController/new/menu`
  })
}

// 用户登录
export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data,
        transformRequest: data => {
            let formData = new FormData();
            try { for (let key in data) { formData.append(key, data[key]); } }
            catch(err) { console.error(err); }
            return formData;
        }
    })
}

// 用户注销
export function logout(data = {}) {
    return request({
        url: '/logout',
        method: 'post',
        data
    })
}

// 修改用户密码
export function editPassword(data = {}) {
    return request({
        url: '/userController/updatePasswd',
        method: 'post',
        data
    })
}

// 获取当前用户数据
export function getUserData() {
    return request({
        url: `/userController/getCurrentUser`,
        method: 'get'
    })
}

// 获取用户的菜单
export function getUserMenu(userName) {
    return request({
        url: `/userController/getCurrentUserMenu`,
        method: 'get'
    })
}

// 获取当前用户的角色数据
export function getUserRoles(userName) {
    return request({
        url: `/userController/getRoleByUser/${userName}`,
        method: 'get'
    })
}

// 通过角色的到用户
export function getUserByRoleCode(roleCode) {
    return request({
        url: `/userController/getUserByRoleCode/${roleCode}`,
        method: 'get'
    })
}

// 根据页面url获取当前页面权限按钮
export function getCurrentUserMenuBtn(data) {
    return request({
        url: `/userController/getCurrentUserMenuBtn`,
        method: 'post',
        data
    })
}




// 
// 用户管理
// --------------------------

// 获取全部用户
export function getAllUser(data = {}, paging = { page: 1, size: 9999}) {
    return request({
        url: `userController/findUser/${paging.page}/${paging.size}`,
        method: 'post',
        data
    })
}

// 新增用户
export function addUser(data = {}) {
    return request({
        url: `userController/addUser`,
        method: 'post',
        data
    })
}

// 删除用户
export function delUser(userName) {
    return request({
        url: `userController/delUser/${userName}`,
        method: 'delete'
    })
}

// 批量删除用户
export function delBatchUser(userNames) {
    return request({
        url: `userController/delBatchUser/${userNames}`,
        method: 'get'
    })
}

// 修改用户
export function updateUser(data = {}) {
    return request({
        url: `userController/updateUser`,
        method: 'put',
        data
    })
}
//重置密码
export function resetUserPassWord(data = {}) {
    return request({
        url: `userController/resetPasswd?userName=${data.userName}`,
        method: 'put',
        data
    })
}
// 通过 userName 获取用户数据
export function getUserByName(userName) {
    return request({
        url: `/userController/getUser/${userName}`,
        method: 'get'
    })
}

// 删除用户的 资源 权限
export function delOrgUserByUserName(userName) {
    return request({
        url: `userController/delOrgUserByUserName/${userName}`,
        method: 'delete'
    })
}

// 添加用户资源权限
export function saveOrgUserList(data = {}) {
    return request({
        url: `userController/saveOrgUserList`,
        method: 'post',
        data
    })
}


// 日志管理列表
export function pageLog(data = {}, paging = { pageNum: 1, pageSize: 9999}) {
    return request({
        url: `logController/pageLog/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data
    })
}
//日志管理导出
export function exportLog(data = {}) {
    return request({
        url: `logController/exportLog`,
        method: 'post',
        headers: {
            "content-type": "application/json; charset=utf-8"
        },
        responseType: "blob",
        data
    })
}

