# 时令志 · 二十四节气

一个用 **Vue 3 单文件组件** 写成的中华时令文化站点。纯前端，无后端、无数据库，
数据全部来自 `src/data/terms.js`。

- 6 个路由页面（首页 / 节气图鉴 / 节气详情 / 时令工坊 / 关于 / 404）
- **40 个 `.vue` 单文件组件**（33 个可复用组件 + 6 个页面视图 + 根组件 `App.vue`）
  \+ 5 个组合式函数 + 3 个 Pinia store + 2 个自定义指令 + 1 个插件
- 覆盖 [cn.vuejs.org 教程](https://cn.vuejs.org/tutorial/) 的主要知识点

---

## 一、快速开始

```bash
# 1. 安装依赖（本项目用 pnpm，也可以用 npm / yarn）
pnpm install

# 2. 启动开发服务器（默认 http://localhost:5173，改代码自动热更新）
pnpm dev

# 3. 打包（产物在 dist/）
pnpm build

# 4. 本地预览打包结果（默认 http://localhost:4173）
pnpm preview
```

## 二、页面与路由

| 路径 | 页面 | 主要演示内容 |
| --- | --- | --- |
| `/` | 首页 | 当前节气、倒计时、二十四节气圆盘、时令推荐、收藏 |
| `/terms` | 节气图鉴 | 搜索 / 筛选 / 排序、网格与时间轴双视图、快速预览弹窗 |
| `/terms/:id` | 节气详情 | 动态路由参数、三候 / 习俗 / 时令 / 养生标签页、评分、上一个/下一个 |
| `/workshop` | 时令工坊 | 动态组件、异步组件 + Suspense、渲染函数、自定义指令、过渡动画、小游戏 |
| `/about` | 关于本站 | 技术栈、目录结构、知识点与文件的对照表 |
| `/:pathMatch(.*)*` | 404 | 通配符路由、编程式导航 |

路由表在 `src/router/index.js`，全部页面都是懒加载（`() => import(...)`），
打包后会按页面拆成多个 JS 文件。

## 三、目录结构

```
vue-solar-terms/
├─ index.html                 # 页面模板，只有 <div id="app">
├─ vite.config.js             # 别名 @ → src、base 路径、构建配置
├─ netlify.toml               # Netlify 部署配置 + SPA 路由回退
├─ public/
│  ├─ favicon.svg
│  └─ _redirects              # Netlify 的重定向规则
├─ .github/workflows/deploy.yml  # 自动部署到 GitHub Pages
└─ src/
   ├─ main.js                 # 入口：createApp → use(Pinia/Router) → directive → mount
   ├─ App.vue                 # 根组件：导航栏 + RouterView + Transition + KeepAlive
   ├─ router/index.js         # 路由表、全局守卫、滚动行为
   ├─ stores/                 # Pinia：theme(主题) / favorites(收藏) / ui(提示条)
   ├─ composables/            # useCountdown / useLocalStorage / useSeasonNow
   │                          # / useTermFilter / useToast
   ├─ directives/             # 自定义指令：v-reveal / v-highlight
   ├─ plugins/siteInfo.js     # 插件：$site 全局属性 + provide
   ├─ data/                   # terms.js（24 节气数据）/ quiz.js（题库）
   ├─ assets/main.css         # 全局 CSS 变量（主题）、重置样式、过渡类
   ├─ components/
   │  ├─ layout/    AppHeader / AppFooter / ThemeToggle            （3）
   │  ├─ common/    BaseCard / BaseButton / BaseModal / BaseTabs / SearchInput
   │  │             LoadingSpinner / EmptyState / StarRating / ProgressRing
   │  │             ToastHost / BackToTop                          （11）
   │  ├─ terms/     TermCard / TermGrid / TermFilterBar / TermTimeline
   │  │             TermWheel / TermDetailPanel / SeasonBadge      （7）
   │  ├─ home/      HeroSection / CountdownCard / FeatureList / FavoritesStrip （4）
   │  └─ workshop/  FoodRecommender / QuizGame / PoemCarousel / AsyncFactCard
   │                AsyncFactContent / RenderFunctionDemo / DirectiveDemo
   │                TransitionDemo                                 （8）
   └─ views/        HomeView / TermsView / TermDetailView / WorkshopView
                    AboutView / NotFoundView                       （6）
```

组件合计 33 + 页面 6 + 根组件 1 = **40 个单文件组件**。

## 四、知识点与文件对照

| 知识点 | 位置 |
| --- | --- |
| 模板语法、插值、指令 | 所有 `.vue` 的 `<template>` |
| 响应式基础 `ref` / `reactive` | `views/TermsView.vue`、`stores/*.js` |
| 计算属性 `computed` | `composables/useTermFilter.js` |
| 侦听器 `watch` | `composables/useCountdown.js`、`useLocalStorage.js` |
| Class / Style 绑定 | `components/terms/TermCard.vue` |
| 条件渲染、列表渲染 | `components/home/FavoritesStrip.vue`、`terms/TermTimeline.vue` |
| 事件处理 `.prevent` / `.esc` 等修饰符 | `components/common/BaseModal.vue` |
| 表单输入绑定 `v-model` | `components/common/SearchInput.vue` |
| 生命周期钩子 | `components/common/BackToTop.vue` |
| Props / Emits | `components/terms/TermCard.vue` |
| 组件 `v-model`（`defineModel`） | `components/common/StarRating.vue`、`BaseTabs.vue` |
| 插槽：默认 / 具名 / 作用域 / 动态插槽名 | `common/BaseCard.vue`、`EmptyState.vue`、`BaseTabs.vue` |
| 透传 Attributes | `components/common/BaseCard.vue` |
| 依赖注入 `provide` / `inject` | `components/terms/TermDetailPanel.vue`、`plugins/siteInfo.js` |
| 异步组件 `defineAsyncComponent` | `components/workshop/AsyncFactCard.vue` |
| `Suspense` + 顶层 `await` | `components/workshop/AsyncFactContent.vue` |
| 组合式函数（Composables） | `src/composables/`（5 个） |
| 单文件组件 / `scoped` 样式 / `:deep()` | 全部 `.vue`，`:deep()` 见 `RenderFunctionDemo.vue` |
| Vue Router：动态参数、懒加载、别名、重定向、404、守卫、滚动行为 | `src/router/index.js` |
| Pinia 状态管理（Setup Store） | `src/stores/` |
| `Transition` / `TransitionGroup` | `components/workshop/TransitionDemo.vue` |
| `KeepAlive` | `App.vue`、`views/WorkshopView.vue` |
| `Teleport` | `components/common/BaseModal.vue`、`ToastHost.vue` |
| 自定义指令（钩子、参数、修饰符） | `src/directives/` |
| 渲染函数 `h()`、函数式组件 | `components/workshop/RenderFunctionDemo.vue` |
| 插件 `install()` | `src/plugins/siteInfo.js` |
| 动态组件 `<component :is>`、`markRaw` | `views/WorkshopView.vue` |
| 全局错误处理 | `src/main.js` |

## 五、部署

### 方式 A：GitHub Pages（推荐，仓库内置了自动部署）

1. 把项目推送到 GitHub 仓库（分支 `main`）。
2. 仓库 → **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送后 Actions 会自动构建并发布，地址形如
   `https://<用户名>.github.io/<仓库名>/`。

工作流见 `.github/workflows/deploy.yml`；它会自动把 `BASE_PATH` 设成 `/<仓库名>/`，
并生成 `404.html` 让前端路由的深层链接也能直接打开。

### 方式 B：Netlify

- **拖拽**：执行 `pnpm build`，把 `dist` 目录（或它的 zip）拖到 <https://app.netlify.com/drop>。
- **连仓库**：Netlify 新建站点 → 选择该仓库，配置会自动读取 `netlify.toml`
  （构建命令 `pnpm build`，发布目录 `dist`，并已配置 SPA 路由回退）。

## 六、数据说明

- 24 个节气的日期是「常年日期」，实际每年有 ±1 天浮动，准确时刻以中国科学院紫金山天文台发布为准。
- 三候、习俗、食材、养生内容整理自公开传统文化资料，仅用于教学演示。
- 诗词均标注作者与出处。
- 收藏、评分、主题、视图模式等数据只保存在浏览器 `localStorage`，不会上传到任何服务器。

## 七、许可证

仅用于课程学习与教学演示。