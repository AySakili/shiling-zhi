<script setup>
/**
 * 关于本站 AboutView
 * ------------------------------------------------------------------
 * 这一个页面主要用来"讲清楚这个项目是怎么写的"，方便上台答辩时对照讲解。
 *
 * 涉及知识点：
 *  - inject 读取插件 provide 的数据
 *  - v-for 渲染"知识点 → 文件"对照表（数据驱动视图）
 *  - <Transition> + v-if 展开/折叠目录结构
 *  - computed 过滤：点击标签只看某一类知识点
 */
import { computed, inject, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const site = inject('siteInfo', { name: '时令志', version: '1.0.0', author: '—', course: '—' })

const techStack = [
  { name: 'Vue 3', desc: '组合式 API + <script setup> 单文件组件', version: '3.5.x' },
  { name: 'Vite', desc: '开发服务器与打包工具，支持热更新与代码分割', version: '8.x' },
  { name: 'Vue Router', desc: '前端路由：动态参数、懒加载、导航守卫、滚动行为', version: '5.x' },
  { name: 'Pinia', desc: '状态管理：收藏、主题、全局提示条', version: '4.x' },
  { name: '原生 CSS', desc: 'CSS 变量做主题，无 UI 框架依赖', version: '—' }
]

/** 知识点 → 文件 对照表 */
const knowledge = [
  { group: '基础', point: '模板语法 / 插值 / 指令', file: '所有 .vue 的 <template>' },
  { group: '基础', point: '响应式基础 ref / reactive', file: 'views/TermsView.vue、stores/*.js' },
  { group: '基础', point: '计算属性 computed', file: 'composables/useTermFilter.js' },
  { group: '基础', point: '侦听器 watch', file: 'composables/useCountdown.js、composables/useLocalStorage.js' },
  { group: '基础', point: 'Class 与 Style 绑定', file: 'components/terms/TermCard.vue' },
  { group: '基础', point: '条件渲染 v-if / v-show', file: 'components/home/FavoritesStrip.vue' },
  { group: '基础', point: '列表渲染 v-for', file: 'components/terms/TermTimeline.vue' },
  { group: '基础', point: '事件处理 @click / 修饰符', file: 'components/common/BaseButton.vue' },
  { group: '基础', point: '表单输入绑定 v-model', file: 'components/common/SearchInput.vue' },
  { group: '基础', point: '生命周期钩子', file: 'components/common/BackToTop.vue' },
  { group: '组件', point: 'Props 与 Emits', file: 'components/terms/TermCard.vue' },
  { group: '组件', point: '组件 v-model（defineModel）', file: 'components/common/StarRating.vue' },
  { group: '组件', point: '插槽（默认/具名/作用域）', file: 'components/common/BaseCard.vue、EmptyState.vue' },
  { group: '组件', point: '动态插槽名', file: 'components/common/BaseTabs.vue' },
  { group: '组件', point: '透传 Attributes', file: 'components/common/BaseCard.vue' },
  { group: '组件', point: '依赖注入 provide / inject', file: 'components/terms/TermDetailPanel.vue' },
  { group: '组件', point: '异步组件 defineAsyncComponent', file: 'components/workshop/AsyncFactCard.vue' },
  { group: '组件', point: 'Suspense 与顶层 await', file: 'components/workshop/AsyncFactContent.vue' },
  { group: '组件', point: '组合式函数（Composables）', file: 'composables/*.js（共 5 个）' },
  { group: '规模化', point: '单文件组件 SFC / scoped 样式', file: '全部 .vue 文件' },
  { group: '规模化', point: 'Vue Router（动态路由 / 守卫 / 懒加载）', file: 'router/index.js' },
  { group: '规模化', point: 'Pinia 状态管理', file: 'stores/theme.js、favorites.js、ui.js' },
  { group: '进阶', point: 'Transition / TransitionGroup', file: 'components/workshop/TransitionDemo.vue' },
  { group: '进阶', point: 'KeepAlive 缓存', file: 'App.vue、views/WorkshopView.vue' },
  { group: '进阶', point: 'Teleport 传送门', file: 'components/common/BaseModal.vue' },
  { group: '进阶', point: '自定义指令', file: 'directives/reveal.js、highlight.js' },
  { group: '进阶', point: '渲染函数 h() 与函数式组件', file: 'components/workshop/RenderFunctionDemo.vue' },
  { group: '进阶', point: '插件（install / provide）', file: 'plugins/siteInfo.js' },
  { group: '进阶', point: '动态组件 component :is', file: 'views/WorkshopView.vue' },
  { group: '工程化', point: 'Vite 配置 / 别名 / 代码分割', file: 'vite.config.js' },
  { group: '工程化', point: 'SPA 部署与 history 回退', file: 'netlify.toml、public/_redirects' }
]

const groups = ['全部', '基础', '组件', '规模化', '进阶', '工程化']
const activeGroup = ref('全部')

const filtered = computed(() =>
  activeGroup.value === '全部'
    ? knowledge
    : knowledge.filter((item) => item.group === activeGroup.value)
)

const showTree = ref(false)

const tree = `vue-solar-terms/
├─ index.html                 页面模板（只有 #app 一个容器）
├─ vite.config.js             别名 @ → src、打包配置
├─ netlify.toml               部署与 SPA 路由回退
├─ public/_redirects          Netlify 的重定向规则
└─ src/
   ├─ main.js                 应用入口：createApp / use / mount
   ├─ App.vue                 根组件：导航 + RouterView + Transition
   ├─ router/index.js         路由表与全局守卫
   ├─ stores/                 Pinia：theme / favorites / ui
   ├─ composables/            useCountdown / useLocalStorage / useSeasonNow …
   ├─ directives/             自定义指令 reveal / highlight
   ├─ plugins/siteInfo.js     插件：$site 与 provide
   ├─ data/                   terms.js（24 节气数据）/ quiz.js
   ├─ components/             layout 3 个、common 9 个、terms 7 个、
   │                          home 4 个、workshop 8 个
   └─ views/                  HomeView / TermsView / TermDetailView /
                              WorkshopView / AboutView / NotFoundView`
</script>

<template>
  <div class="about container">
    <header class="page-head">
      <h1 class="section-title">ℹ️ 关于本站</h1>
      <p class="text-muted">
        《时令志 · 二十四节气》是一个纯前端单页应用，用 Vue 3 单文件组件写成，没有后端、没有数据库。
      </p>
    </header>

    <div class="grid">
      <BaseCard title="项目信息" class="span-2">
        <dl class="info">
          <div>
            <dt>项目名</dt>
            <dd>{{ site.name }} · 二十四节气</dd>
          </div>
          <div>
            <dt>版本</dt>
            <dd>v{{ site.version }}</dd>
          </div>
          <div>
            <dt>作者</dt>
            <dd>{{ site.author }}</dd>
          </div>
          <div>
            <dt>课程</dt>
            <dd>{{ site.course }}</dd>
          </div>
          <div>
            <dt>页面数</dt>
            <dd>6 个路由页面（含 404）</dd>
          </div>
          <div>
            <dt>组件数</dt>
            <dd>40 个单文件组件（33 组件 + 6 页面 + App）</dd>
          </div>
          <div>
            <dt>可复用逻辑</dt>
            <dd>5 个组合式函数 / 3 个 Pinia store / 2 个指令 / 1 个插件</dd>
          </div>
        </dl>
        <template #footer>
          <RouterLink class="link" :to="{ name: 'home' }">← 回首页</RouterLink>
          <RouterLink class="link" :to="{ name: 'workshop' }">去工坊 →</RouterLink>
        </template>
      </BaseCard>

      <BaseCard title="技术栈">
        <ul class="stack">
          <li v-for="item in techStack" :key="item.name">
            <div class="stack-head">
              <strong>{{ item.name }}</strong>
              <span class="ver">{{ item.version }}</span>
            </div>
            <p>{{ item.desc }}</p>
          </li>
        </ul>
      </BaseCard>
    </div>

    <BaseCard title="目录结构" subtitle="点击按钮展开/收起，Transition 做的动画" class="tree-card">
      <BaseButton size="sm" variant="ghost" @click="showTree = !showTree">
        {{ showTree ? '收起目录' : '展开目录' }}
      </BaseButton>
      <Transition name="fade">
        <pre v-if="showTree" class="tree">{{ tree }}</pre>
      </Transition>
    </BaseCard>

    <BaseCard title="知识点对照表" subtitle="按分类查看，方便对照源码">
      <div class="groups">
        <button
          v-for="g in groups"
          :key="g"
          class="group-btn"
          :class="{ on: activeGroup === g }"
          @click="activeGroup = g"
        >
          {{ g }}
        </button>
      </div>

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>分类</th>
              <th>知识点</th>
              <th>对应文件</th>
            </tr>
          </thead>
          <tbody>
            <!-- TransitionGroup 让筛选时行有动画 -->
            <TransitionGroup name="list" tag="tbody">
              <tr v-for="item in filtered" :key="item.point">
                <td><span class="tag">{{ item.group }}</span></td>
                <td>{{ item.point }}</td>
                <td class="file">{{ item.file }}</td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <BaseCard title="数据说明">
      <ul class="notes">
        <li>24 个节气的日期是"常年日期"，实际每年会有 ±1 天浮动，准确时刻以紫金山天文台发布为准。</li>
        <li>三候、习俗、食材、养生内容整理自公开的传统文化资料，仅用于教学演示。</li>
        <li>诗词均标注了作者与出处，用于文化展示。</li>
        <li>收藏、评分、主题、视图模式等数据保存在浏览器 localStorage，不会上传到任何服务器。</li>
      </ul>
    </BaseCard>
  </div>
</template>

<style scoped>
.about {
  padding-top: 40px;
  padding-bottom: 40px;
  display: grid;
  gap: 22px;
}
.page-head p {
  margin: 0;
  max-width: 70ch;
  font-size: 0.9rem;
}
.grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  margin: 0;
}
.info div {
  padding: 10px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--bg-soft) 70%, transparent);
  border: 1px solid var(--line);
}
.info dt {
  font-size: 0.72rem;
  color: var(--fg-muted);
  letter-spacing: 0.1em;
}
.info dd {
  margin: 4px 0 0;
  font-size: 0.92rem;
  font-weight: 600;
}
.link {
  font-size: 0.86rem;
  color: var(--brand);
}

.stack {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.stack li {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
}
.stack-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.ver {
  font-size: 0.72rem;
  color: var(--accent);
  font-family: Consolas, monospace;
}
.stack p {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--fg-muted);
}

.tree {
  margin: 14px 0 0;
  padding: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--bg-soft) 75%, transparent);
  border: 1px solid var(--line);
  font-size: 0.76rem;
  line-height: 1.75;
  overflow-x: auto;
  color: var(--fg-muted);
}

.groups {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.group-btn {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  cursor: pointer;
  font-size: 0.82rem;
  color: var(--fg-muted);
  transition: all 0.22s ease;
}
.group-btn.on {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
  font-weight: 600;
}

.table-wrap {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
}
.table th,
.table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
}
.table th {
  font-size: 0.76rem;
  color: var(--fg-muted);
  letter-spacing: 0.1em;
}
.table tbody tr:hover {
  background: var(--brand-soft);
}
.tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
}
.file {
  font-family: Consolas, monospace;
  font-size: 0.78rem;
  color: var(--fg-muted);
}

.notes {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  font-size: 0.86rem;
  color: var(--fg-muted);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>