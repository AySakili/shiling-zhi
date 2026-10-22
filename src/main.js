/**
 * 应用入口文件
 * ------------------------------------------------------------------
 * 这里做的事情就是"装配"：
 *   1. 用 createApp 创建应用实例（Vue 3 的入口 API）
 *   2. app.use(...) 安装 Pinia（状态管理）和 Router（路由）
 *   3. app.directive(...) 注册全局自定义指令
 *   4. app.use(插件) 安装自定义插件
 *   5. app.mount('#app') 把根组件挂载到 index.html 的 <div id="app">
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { SiteInfoPlugin } from './plugins/siteInfo'
import { vReveal } from './directives/reveal'
import { vHighlight } from './directives/highlight'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia()) // 状态管理：必须先于 router 之前/之后都可以，习惯上放前面
app.use(router) // 路由
app.use(SiteInfoPlugin, { version: '1.0.0' }) // 自定义插件：注入 $site 与 provide

// 注册全局自定义指令（组件内也可以局部注册，这里演示全局注册）
app.directive('reveal', vReveal)
app.directive('highlight', vHighlight)

// 全局错误处理：任何一个组件抛错都会走到这里（生产环境可上报日志）
app.config.errorHandler = (err, instance, info) => {
  console.error('[全局错误处理]', info, err)
}

app.mount('#app')

// 开发环境打印一下，方便确认版本
if (import.meta.env.DEV) {
  console.log(
    `%c 时令志 · 二十四节气 %c Vue ${app.version} `,
    'background:#3f7d4a;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#c9a227;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0'
  )
}