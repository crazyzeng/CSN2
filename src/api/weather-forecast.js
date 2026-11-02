import request from "@/utils/request";

//导出
export function exportWeatherForecast(data = {}) {
    return request({
        url: `/weather/exportExcelTemplate`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        data,
        responseType: 'blob',
    });
}

//删除
export function deleteWeather(data){
    return request({
        url:'/weather/deleteRecord',
        method:'post',
        data,
    })
}

//分页
export function getWeatherPage(page,data){
    return request({
        url:`/weather/pageRecord?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        method:'post',
        params:{...data}
    })
}

// 编辑
export function updateWeather(data){
    return request({
        url:'/weather/updateRecord',
        method:'post',
        data,
    })
}
// 新增
export function addWeather(data){
    return request({
        url:'/weather/addRecord',
        method:'post',
        data,
    })
}

// 导入（上传 Excel 文件）
export function handleUpload(file){
    const formData = new FormData()
    formData.append('file', file)
    return request({
        url: '/weather/uploadRecord',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
    })
}