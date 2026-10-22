/**
 * 路由配置
 * ------------------------------------------------------------------
 * 知识点：
 *  - createRouter / createWebHistory：HTML5 History 模式（地址栏没有 #）
 *  - 路由懒加载：() => import(...) 只有访问到该页面时才下载对应 JS 包（代码分割）
 *  - 嵌套路由：children + <RouterView> 占位
 *  - 动态路由参数：/terms/:id  →  组件里用 useRoute().params.id 读取
 *  - props: true：把路由参数作为 props 传给组件，组件就不必依赖 useRoute
 *  - 别名 alias、重定向 redirect、404 通配符 /:pathMatch(.*)*
 *  - meta 元信息 + 全局前置守卫 beforeEach（这里用来设置页面标题）
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // 懒加载：访问首页时才加载 HomeView.vue
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 · 时令流转', icon: '🏠' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/TermsView.vue'),
    meta: { title: '节气图鉴', icon: '📖' }
  },
  {
    path: '/terms/:id',
    name: 'term-detail',
    component: () => import('@/views/TermDetailView.vue'),
    // 把 :id 作为 props 传给 TermDetailView，少写一次 useRoute()
    props: true,
    meta: { title: '节气详情', icon: '🔍' }
  },
  {
    path: '/workshop',
    name: 'workshop',
    component: () => import('@/views/WorkshopView.vue'),
    meta: { title: '时令工坊', icon: '🧪' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于本站', icon: 'ℹ️' },
    // 别名：两个地址都能打开这个页面
    alias: ['/about-us']
  },
  {
    // 老地址重定向到新地址（redirect 也可以写成函数）
    path: '/list',
    redirect: { name: 'terms' }
  },
  {
    // 通配符匹配所有未命中的地址 → 404 页面
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面走丢了' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换路由时的滚动行为：模拟浏览器"后退时恢复位置"
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  }
})

// 全局前置守卫：根据 meta.title 动态修改浏览器标题
router.beforeEach((to, from) => {
  const base = '时令志 · 二十四节气'
  document.title = to.meta?.title ? `${to.meta.title} | ${base}` : base
  // 返回 true / 不返回 表示放行；也可以 return false 取消，或 return '/login' 跳转
  return true
})

// 全局后置钩子：常用于打点统计
router.afterEach((to) => {
  if (import.meta.env.DEV) {
    console.log(`[router] 进入 ${String(to.name)} 路径：${to.fullPath}`)
  }
})

export default router