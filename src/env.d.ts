/// <reference types="vite/client" />

/**
 * 补充 Vite 环境变量类型，让 import.meta.env.VITE_* 在 IDE 中获得智能提示。
 * 注意：本项目为迁移兼容，业务代码仍沿用 process.env.*（通过 vite.config.ts 的
 * define 做编译期替换），这里保留声明以防后续逐步切换到 import.meta.env。
 */
interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}