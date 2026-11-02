import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'

/**
 * Vite 构建配置
 *
 * 说明：
 * - 本项目采用 Vue 2.7 桥接方案：`@vitejs/plugin-vue2` 负责编译 .vue 单文件组件，
 *   同时保留了 element-ui（Vue2 组件库），因此无需迁移到 element-plus。
 * - 所有接口已在 `src/utils/request.js` 的拦截器中统一替换为 mock 实现，
 *   因此 devServer.proxy 仅在存在“真实后端联调”需求时生效。
 */
export default defineConfig(({ mode }) => {
    // 读取 .env 文件中的环境变量（prefix 传空字符串以兼容 VUE_APP_* 历史变量）
    const env = loadEnv(mode, process.cwd(), '')
    const baseApi = env.VITE_APP_BASE_API || env.VUE_APP_BASE_API || '/'

    return {
        // 生产环境使用相对路径，方便任意目录部署（与原 vue-cli 行为一致）
        base: mode === 'production' ? './' : '/',
        // github
        // base: '/CSN2/',

        plugins: [vue()],

        resolve: {
            alias: {
                // 用 fileURLToPath 代替 __dirname，保证 ESM 环境下路径解析正确
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                // element-ui 主题源码与字体使用 `~` 前缀引用，这里显式映射到 node_modules
                '~element-ui': fileURLToPath(new URL('./node_modules/element-ui', import.meta.url)),
            },
        },

        define: {
            // Vue2 老代码大量使用 process.env.*，这里用 compile-time 替换保持兼容
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env.VUE_APP_BASE_API': JSON.stringify(baseApi),
        },

        css: {
            preprocessorOptions: {
                scss: {
                    // 将全局变量与 mixin 注入到每一个 scss 文件（等价于原 webpack prependData）
                    additionalData: '@import "@/styles/variables.scss"; @import "@/styles/mixin.scss";',
                },
            },
        },

        server: {
            port: 8080,
            proxy: {
                // 历史接口前缀，仅在取消 mock 联调真实后端时使用
                '/api': {
                    target: 'http://192.168.2.132:908/',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/api/, '/'),
                },
                '/nodeImages': {
                    target: 'http://192.168.2.132:908/',
                    changeOrigin: true,
                },
            },
        },

        build: {
            target: 'es2018',
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    // 将重型第三方库单独拆包，提升首屏加载与缓存命中率
                    manualChunks: {
                        'vendor-vue': ['vue', 'vue-router', 'vuex', 'element-ui'],
                        'vendor-three': ['three'],
                        'vendor-echarts': ['echarts'],
                    },
                },
            },
        },
    }
})
