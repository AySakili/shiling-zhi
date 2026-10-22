/**
 * 自定义插件
 * ------------------------------------------------------------------
 * Vue 插件就是一个"带有 install 方法的对象"（或者一个函数）。
 * install(app, options) 里的 app 就是应用实例，可以对它做三件事：
 *   1. app.component()  注册全局组件
 *   2. app.directive()  注册全局指令
 *   3. app.provide()     提供全局依赖（配合 inject 使用）
 * 另外还常挂在 app.config.globalProperties 上（模板里用 $xxx 访问）。
 */
export const SiteInfoPlugin = {
  install(app, options = {}) {
    const site = {
      name: '时令志',
      subtitle: '二十四节气',
      version: options.version ?? '1.0.0',
      author: '叶子阳',
      course: '大数据平台与编程实践A'
    }

    // 1) 挂到全局属性：模板中可以直接写 {{ $site.name }}
    app.config.globalProperties.$site = site
    app.config.globalProperties.$formatYear = () => `${new Date().getFullYear()}年`

    // 2) 通过 provide 提供依赖：任何后代组件都能 inject('siteInfo')
    app.provide('siteInfo', site)

    // 3) 一个简单的全局方法，演示插件里也能加"能力"
    app.config.globalProperties.$copy = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        return false
      }
    }
  }
}