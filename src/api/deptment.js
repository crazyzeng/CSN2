import request from '@/utils/request.js'

//查询所有部门
export function getAllDeptment(){
    return request({
        method:'get',
        url:'/userController/getAllDept'
    })
}

//根据部门查询用户
export function getUserByDeptment(dept){
    return request({
        method:'get',
        url:`/userController/getUserByDept/${dept}`
    })
}