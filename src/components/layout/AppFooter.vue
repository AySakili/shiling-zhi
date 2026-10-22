<script setup>
/**
 * 页脚
 * ------------------------------------------------------------------
 * 演示：inject 读取插件 provide 出来的站点信息（替代层层 props 传递）。
 */
import { inject } from 'vue'
import { RouterLink } from 'vue-router'
import { SEASONS } from '@/data/terms'

// inject 的第二个参数是"默认值"：万一没有祖先 provide 也不会报错
const site = inject('siteInfo', { name: '时令志', version: '1.0.0', author: '匿名' })

const links = [
  { name: 'terms', label: '节气图鉴' },
  { name: 'workshop', label: '时令工坊' },
  { name: 'about', label: '关于本站' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="container inner">
      <div class="col">
        <h4>{{ site.name }} · {{ site.subtitle || '二十四节气' }}</h4>
        <p class="text-muted">
          一个用 Vue 3 单文件组件构建的中华时令文化站点。<br />
          数据仅用于教学演示，节气日期为常年日期（±1 天）。
        </p>
      </div>

      <div class="col">
        <h4>快速导航</h4>
        <ul>
          <li v-for="link in links" :key="link.name">
            <RouterLink :to="{ name: link.name }">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <div class="col">
        <h4>四季</h4>
        <ul>
          <li v-for="(season, key) in SEASONS" :key="key">
            <RouterLink :to="{ name: 'terms', query: { season: key } }">
              {{ season.emoji }} {{ season.full }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="container bottom">
      <span>© {{ new Date().getFullYear() }} {{ site.name }} v{{ site.version }}</span>
      <span class="text-muted">Vue 3 + Vite + Vue Router + Pinia · 课程：{{ site.course }}</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 64px;
  padding: 48px 0 28px;
  border-top: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg-soft) 70%, transparent);
}
.inner {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 32px;
}
h4 {
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
p {
  font-size: 0.88rem;
  max-width: 42ch;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
li {
  font-size: 0.9rem;
}
li a {
  color: var(--fg-muted);
  transition: color 0.2s ease;
}
li a:hover {
  color: var(--brand);
}
.bottom {
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px dashed var(--line);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--fg-muted);
}

@media (max-width: 720px) {
  .inner {
    grid-template-columns: 1fr 1fr;
  }
}
</style>