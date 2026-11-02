import Cookies from 'js-cookie'

// 登录令牌在 Cookie 中的键名（原 cict-system 已随私有库一并移除，改为本项目自身的键名）
const TokenKey = 'csn-token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

