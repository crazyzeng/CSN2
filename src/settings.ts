/**
 * 全局配置项
 *
 * 由原 settings.js（CommonJS module.exports）迁移为 ESM 默认导出，
 * 并额外以命名导出暴露 stompWebSocket，供 utils/websocket.ts 使用。
 */
const settings = {
  title: '长沙南综合节能管理控制系统',
  /**
   * 接口报错的默认提示
   */
  serviceErrorText: '服务器错误，请稍后重试！',
  /**
   * 主题颜色变量
   */
  theme: {
    blue: { defaultText: '#FFFFFF' },
    white: { defaultText: '#000000' },
    grey: {},
  },
  /**
   * 主题默认类型
   */
  themeType: 'white',
  /**
   * stomp websocket 的认证信息
   */
  stompWebSocket: {
    login: 'guest',
    passcode: 'guest',
  },
}

export default settings
export const stompWebSocket = settings.stompWebSocket