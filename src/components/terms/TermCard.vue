<script setup>
/**
 * 节气卡片 TermCard
 * ------------------------------------------------------------------
 * 这是列表里被复用最多的小组件，演示：
 *  - props 接收一个 term 对象（父传子）
 *  - emit 自定义事件把"收藏"动作交给父组件（子传父）
 *  - RouterLink 编程式/声明式跳转：:to="{ name, params }"
 *  - 内联 style 绑定渐变（term.colors）+ 动态 class
 *  - 鼠标悬停改变背景光晕（CSS 变量 + style 绑定）
 */
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import SeasonBadge from './SeasonBadge.vue'

const props = defineProps({
  term: { type: Object, required: true },
  /** 是否已被收藏（由父组件传入，保证"受控"） */
  favorite: { type: Boolean, default: false },
  /** 紧凑模式：首页的小卡片用 */
  compact: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-favorite', 'preview'])

/** 渐变背景：从 term.colors 生成 */
const gradient = computed(() => `linear-gradient(135deg, ${props.term.colors[0]}, ${props.term.colors[1]})`)

/** 英文/拼音首字母，做水印 */
const watermark = computed(() => props.term.pinyin.replace(/\s/g, ''))
</script>

<template>
  <article class="term-card" :class="{ compact }" :style="{ '--c1': term.colors[0], '--c2': term.colors[1] }">
    <!-- 顶部渐变条：既是装饰，也承载"节气主色" -->
    <div class="ribbon" :style="{ background: gradient }">
      <span class="emoji" aria-hidden="true">{{ term.emoji }}</span>
      <span class="order">第 {{ term.order }} 节</span>
    </div>

    <div class="body">
      <header class="head">
        <RouterLink :to="{ name: 'term-detail', params: { id: term.id } }" class="name">
          {{ term.name }}
          <small>{{ term.pinyin }}</small>
        </RouterLink>
        <button
          class="fav"
          :class="{ on: favorite }"
          :aria-pressed="favorite"
          :title="favorite ? '取消收藏' : '收藏这个节气'"
          @click="emit('toggle-favorite', term)"
        >
          {{ favorite ? '★' : '☆' }}
        </button>
      </header>

      <div class="meta">
        <SeasonBadge :season="term.season" />
        <span class="date">{{ term.month }}月{{ term.day }}日前后</span>
      </div>

      <p class="tagline">{{ term.tagline }}</p>

      <!-- v-if：紧凑模式不显示简介 -->
      <p v-if="!compact" class="intro">{{ term.intro }}</p>

      <ul v-if="!compact" class="foods">
        <li v-for="food in term.foods.slice(0, 4)" :key="food">{{ food }}</li>
      </ul>
    </div>

    <footer class="foot">
      <RouterLink class="more" :to="{ name: 'term-detail', params: { id: term.id } }">
        查看详情 →
      </RouterLink>
      <button class="preview" @click="emit('preview', term)">快速预览</button>
    </footer>

    <span class="watermark" aria-hidden="true">{{ watermark }}</span>
  </article>
</template>

<style scoped>
.term-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease,
    border-color 0.32s ease;
}
.term-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--c1) 50%, transparent);
  box-shadow: 0 20px 44px color-mix(in srgb, var(--c2) 26%, transparent);
}

.ribbon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: #fff;
}
.emoji {
  font-size: 1.5rem;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}
.order {
  font-size: 0.76rem;
  letter-spacing: 0.14em;
  opacity: 0.92;
}

.body {
  flex: 1;
  padding: 16px;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.name {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.name small {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--fg-muted);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.name:hover {
  color: var(--brand);
}

.fav {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  color: var(--line);
  transition: transform 0.2s ease, color 0.2s ease;
}
.fav:hover {
  transform: scale(1.2) rotate(-8deg);
}
.fav.on {
  color: var(--accent);
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 8px;
  flex-wrap: wrap;
}
.date {
  font-size: 0.78rem;
  color: var(--fg-muted);
}

.tagline {
  font-family: var(--font-serif);
  font-size: 1.02rem;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
}
.intro {
  font-size: 0.86rem;
  color: var(--fg-muted);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.foods {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.foods li {
  font-size: 0.74rem;
  padding: 2px 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c1) 14%, transparent);
  color: color-mix(in srgb, var(--c2) 80%, var(--fg));
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px dashed var(--line);
  font-size: 0.84rem;
}
.more {
  color: var(--brand);
  font-weight: 600;
}
.preview {
  border: 1px solid var(--line);
  background: transparent;
  border-radius: 999px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--fg-muted);
}
.preview:hover {
  border-color: var(--brand);
  color: var(--brand);
}

.watermark {
  position: absolute;
  right: 10px;
  bottom: 46px;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--c1);
  opacity: 0.07;
  pointer-events: none;
  user-select: none;
}

.term-card.compact .body {
  padding: 14px;
}
.term-card.compact .watermark {
  bottom: 40px;
  font-size: 2rem;
}
</style>