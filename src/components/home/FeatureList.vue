<script setup>
/**
 * 功能入口卡片组 FeatureList
 * ------------------------------------------------------------------
 * 演示：
 *  - v-for 渲染"配置数组"驱动的界面（想加一个入口只需加一条数据）
 *  - 具名插槽 + 作用域插槽：每个卡片底部的内容由父组件通过插槽决定
 *  - 自定义指令 v-reveal 的 stagger 效果（按索引给不同延迟）
 */
import { RouterLink } from 'vue-router'

const props = defineProps({
  /** [{ to, icon, title, desc, tag }] */
  items: { type: Array, required: true }
})
</script>

<template>
  <div class="features">
    <RouterLink
      v-for="(item, index) in items"
      :key="item.title"
      class="feature"
      :to="item.to"
      v-reveal="{ delay: index * 110 }"
    >
      <span class="icon" aria-hidden="true">{{ item.icon }}</span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
      <span v-if="item.tag" class="tag">{{ item.tag }}</span>
      <span class="arrow" aria-hidden="true">→</span>

      <!-- 作用域插槽：把当前 item 和索引交给父组件 -->
      <slot name="footer" :item="item" :index="index" />
    </RouterLink>
  </div>
</template>

<style scoped>
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.feature {
  position: relative;
  display: block;
  padding: 24px 22px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease;
}
.feature::after {
  content: '';
  position: absolute;
  inset: auto auto -60% -20%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--brand-soft);
  opacity: 0;
  transition: opacity 0.35s ease;
}
.feature:hover {
  transform: translateY(-6px);
  border-color: var(--brand);
}
.feature:hover::after {
  opacity: 1;
}
.icon {
  font-size: 1.9rem;
  display: block;
  margin-bottom: 10px;
}
h3 {
  font-size: 1.08rem;
  margin: 0 0 6px;
}
p {
  font-size: 0.86rem;
  color: var(--fg-muted);
  margin: 0;
  min-height: 3.2em;
}
.tag {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
}
.arrow {
  position: absolute;
  right: 20px;
  bottom: 18px;
  font-size: 1.1rem;
  color: var(--brand);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.feature:hover .arrow {
  opacity: 1;
  transform: none;
}
</style>