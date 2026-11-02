import axios from 'axios'
import { Message } from 'element-ui'
import defaultSettings from '@/settings'
import store from '@/store'
import { createMockAdapter } from '@/mock'

const serviceErrorText = defaultSettings.serviceErrorText || '服务器错误，请稍后重试！'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 10000 * 10, // 请求超时
})

/**
 * 请求拦截器
 *
 * 统一在此处将请求替换为 mock 实现（符合「接口改 mock 统一在 request.js 拦截」的要求）。
 * - 通过注入 config.adapter 让 axios 直接走本地模拟数据，不发起真实网络请求；
 * - 若某个请求需要临时对接真实后端，可在请求配置中显式设置 useMock: false 关闭 mock。
 */
service.interceptors.request.use(
    config => {
        if (config.useMock !== false) {
            config.adapter = (cfg) => createMockAdapter(cfg)
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

/**
 * 响应拦截器：保持原有业务逻辑不变
 * 当业务码不为 200 时判定为错误，并做登录超时、错误提示处理。
 */
service.interceptors.response.use(
    response => {
        const res = response.data

        if (res.code !== 200 && res.code != undefined) {
            if (res.code === 50014 || res.code === 401) {
                Message({
                    type: 'error',
                    duration: 5 * 1000,
                    message: '登录超时',
                })

                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                })
            }

            Message({
                type: 'error',
                duration: 5 * 1000,
                message: res.msg || serviceErrorText,
            })

            return Promise.reject(new Error(res.msg || serviceErrorText))
        } else if (res === '401') {
            Message({
                type: 'error',
                duration: 5 * 1000,
                message: '登录超时',
            })

            store.dispatch('user/resetToken').then(() => {
                location.reload()
            })
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            type: 'error',
            duration: 5 * 1000,
            message: error.message,
        })
        return Promise.reject(error)
    }
)

export default service