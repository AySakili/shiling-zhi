import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：https://vitejs.dev/config/
export default defineConfig({
  /**
   * base（部署路径）：
   *  - 本地开发和 Netlify / Vercel 等根路径部署 → '/'
   *  - GitHub Pages 的项目站点地址形如 https://用户名.github.io/仓库名/
   *    这时必须把 base 设成 '/仓库名/'，否则 JS/CSS 会 404。
   *    构建时用环境变量 BASE_PATH 传入即可（见 .github/workflows/deploy.yml）。
   */
  base: process.env.BASE_PATH || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      // 用 @ 指向 src 目录，避免出现 ../../.. 这种很深的相对路径
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist'
    // 说明：路由页面都用 () => import() 懒加载，Vite 会自动做代码分割，
    // 不需要手动配置 manualChunks（Vite 8 用的是 rolldown，配置方式也变了）。
  }
})