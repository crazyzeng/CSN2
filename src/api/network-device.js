import request from "@/utils/request";

//获取网络设备列表
export function getAllDevice(){
    return request({
        method:'get',
        url:'netDevice'
    })
}