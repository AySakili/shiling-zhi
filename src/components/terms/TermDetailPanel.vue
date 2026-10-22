<script setup>
/**
 * 节气详情面板 TermDetailPanel
 * ------------------------------------------------------------------
 * 详情页的主体内容，演示：
 *  - props 接收 term 对象
 *  - 使用 BaseTabs（组件 v-model + 动态具名插槽）
 *  - 使用 StarRating（组件 v-model），把评分写到 localStorage
 *  - 使用 useLocalStorage 保存"我给这个节气打的分"
 *  - provide/inject：把 term 提供给内部的深层子组件（这里演示 provide 写法）
 */
import { computed, provide, toRef } from 'vue'
import { RouterLink } from 'vue-router'
import BaseTabs from '@/components/common/BaseTabs.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import StarRating from '@/components/common/StarRating.vue'
import SeasonBadge from './SeasonBadge.vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { formatDate, termDate } from '@/data/terms'

const props = defineProps({
  term: { type: Object, required: true }
})

const tabs = [
  { key: 'hou', label: '三候', icon: '🕰️' },
  { key: 'customs', label: '习俗', icon: '🎏' },
  { key: 'foods', label: '时令', icon: '🍚' },
  { key: 'health', label: '养生', icon: '🌿' }
]

const activeTab = useLocalStorage('shiling:last-tab', 'hou')

/** 评分：每个节气一个键，存在对象里 */
const ratings = useLocalStorage('shiling:ratings', {})
const score = computed({
  get: () => ratings.value[props.term.id] || 0,
  set: (value) => {
    ratings.value = { ...ratings.value, [props.term.id]: value }
  }
})

/** 演示 provide：把当前节气提供给任意深度的后代组件 */
provide('currentTerm', toRef(props, 'term'))

const dateText = computed(() => formatDate(termDate(props.term)))
</script>

<template>
  <div class="detail">
    <!-- 头部大图区：用节气主色做渐变，"没有图片也能好看" -->
    <header
      class="hero"
      :style="{
        background: `linear-gradient(135deg, ${term.colors[0]}, ${term.colors[1]})`
      }"
    >
      <div class="hero-emoji" aria-hidden="true">{{ term.emoji }}</div>
      <div class="hero-text">
        <div class="hero-top">
          <SeasonBadge :season="term.season" full />
          <span class="order">第 {{ term.order }} 个节气</span>
        </div>
        <h1>{{ term.name }}</h1>
        <p class="pinyin">{{ term.pinyin }} · {{ dateText }}前后</p>
        <p class="tagline">「{{ term.tagline }}」</p>
      </div>
    </header>

    <p class="intro">{{ term.intro }}</p>

    <BaseCard padding="lg">
      <!-- BaseTabs 用 v-model 控制当前面板；面板内容用动态具名插槽填入 -->
      <BaseTabs v-model="activeTab" :tabs="tabs">
        <template #hou>
          <ol class="hou">
            <li v-for="(item, index) in term.hou" :key="item">
              <span class="hou-index">候 {{ index + 1 }}</span>
              <span class="hou-text">{{ item }}</span>
              <span class="hou-day">第 {{ index * 5 + 1 }} ~ {{ (index + 1) * 5 }} 天</span>
            </li>
          </ol>
        </template>

        <template #customs>
          <ul class="chips">
            <li v-for="item in term.customs" :key="item">{{ item }}</li>
          </ul>
        </template>

        <template #foods>
          <ul class="chips is-food">
            <li v-for="item in term.foods" :key="item">{{ item }}</li>
          </ul>
        </template>

        <template #health>
          <p class="health">{{ term.health }}</p>
        </template>
      </BaseTabs>
    </BaseCard>

    <!-- 诗句：竖排 + 衬线字体，做出"古籍"感 -->
    <blockquote class="poem" :style="{ borderColor: term.colors[0] }">
      <p class="poem-text">{{ term.poem.text }}</p>
      <footer class="poem-from">—— {{ term.poem.author }}《{{ term.poem.title }}》</footer>
    </blockquote>

    <BaseCard title="你觉得这个节气怎么样？" subtitle="打分只保存在你的浏览器里（localStorage）">
      <div class="rate-row">
        <!-- 组件 v-model：score 是 computed 的 getter/setter -->
        <StarRating v-model="score" :size="26" />
        <span class="rate-tip">
          {{
            score === 0
              ? '还没评分'
              : score >= 4
                ? '看来你很中意这个节气 👏'
                : '已记录你的评分'
          }}
        </span>
      </div>
      <template #footer>
        <RouterLink class="link" :to="{ name: 'terms' }">← 返回图鉴</RouterLink>
        <RouterLink class="link" :to="{ name: 'workshop' }">去工坊看看 →</RouterLink>
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>
.detail {
  display: grid;
  gap: 22px;
}
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  padding: 30px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: var(--shadow-lg);
}
.hero-emoji {
  font-size: clamp(3rem, 10vw, 5.4rem);
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.3));
}
.hero-text {
  flex: 1;
  min-width: 0;
}
.hero-top {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  opacity: 0.95;
}
.hero h1 {
  margin: 6px 0 2px;
  font-size: clamp(2rem, 6vw, 3rem);
  letter-spacing: 0.2em;
}
.pinyin {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  opacity: 0.85;
}
.tagline {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-size: 1.1rem;
  letter-spacing: 0.12em;
}
.order {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.intro {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--fg);
}

.hou {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.hou li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--brand-soft);
}
.hou-index {
  font-size: 0.74rem;
  color: var(--brand);
  font-weight: 700;
}
.hou-text {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  letter-spacing: 0.1em;
}
.hou-day {
  margin-left: auto;
  font-size: 0.74rem;
  color: var(--fg-muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chips li {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  font-size: 0.88rem;
}
.chips.is-food li {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
}

.health {
  margin: 0;
  padding: 14px 16px;
  border-left: 3px solid var(--brand);
  background: var(--brand-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.95rem;
}

.poem {
  margin: 0;
  padding: 22px 26px;
  border-left: 4px solid var(--brand);
  background: color-mix(in srgb, var(--bg-soft) 80%, transparent);
  border-radius: 0 var(--radius) var(--radius) 0;
}
.poem-text {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  letter-spacing: 0.16em;
  margin: 0 0 8px;
}
.poem-from {
  font-size: 0.82rem;
  color: var(--fg-muted);
  text-align: right;
}

.rate-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.rate-tip {
  font-size: 0.85rem;
  color: var(--fg-muted);
}
.link {
  font-size: 0.86rem;
  color: var(--brand);
}
</style>