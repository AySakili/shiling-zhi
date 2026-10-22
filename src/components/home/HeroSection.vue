<script setup>
/**
 * 首页主视觉 HeroSection
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - props 接收当前/下一个节气（父传子）
 *  - 动态 inline style：把节气主色注入 CSS 变量，整个区域的配色随之变化
 *  - v-for 渲染"三候"小标签
 *  - RouterLink 做 CTA 按钮；slot 允许父组件插入额外按钮
 *  - 自定义指令 v-reveal 做入场动画
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SeasonBadge from '@/components/terms/SeasonBadge.vue'

const props = defineProps({
  currentTerm: { type: Object, required: true },
  nextTerm: { type: Object, default: null },
  daysToNext: { type: Number, default: 0 },
  currentDateText: { type: String, default: '' }
})

/** 把节气主色写成 CSS 变量，供本组件样式使用 */
const themeVars = computed(() => ({
  '--hero-c1': props.currentTerm.colors[0],
  '--hero-c2': props.currentTerm.colors[1]
}))
</script>

<template>
  <section class="hero" :style="themeVars">
    <!-- 背景：两个模糊的色块 + 细网格，全靠 CSS，不依赖图片 -->
    <div class="blob blob-a" aria-hidden="true" />
    <div class="blob blob-b" aria-hidden="true" />

    <div class="container inner">
      <div class="left" v-reveal>
        <p class="kicker">
          <SeasonBadge :season="currentTerm.season" full />
          <span class="dot">·</span>
          <span>{{ currentDateText }}</span>
        </p>

        <h1>
          今日
          <span class="current">{{ currentTerm.name }}</span>
        </h1>
        <p class="tagline">「{{ currentTerm.tagline }}」</p>
        <p class="desc">{{ currentTerm.intro }}</p>

        <ul class="hou">
          <li v-for="(item, i) in currentTerm.hou" :key="item">
            <small>候 {{ i + 1 }}</small>
            {{ item }}
          </li>
        </ul>

        <div class="cta">
          <RouterLink class="btn primary" :to="{ name: 'term-detail', params: { id: currentTerm.id } }">
            了解 {{ currentTerm.name }}
          </RouterLink>
          <RouterLink class="btn ghost" :to="{ name: 'terms' }">浏览全部 24 节气</RouterLink>
          <!-- 具名插槽：父组件可以再塞按钮进来 -->
          <slot name="extra" />
        </div>
      </div>

      <div class="right" v-reveal="{ delay: 180 }">
        <div class="glass">
          <div class="glass-emoji" aria-hidden="true">{{ currentTerm.emoji }}</div>
          <div class="glass-name">{{ currentTerm.name }}</div>
          <div class="glass-pinyin">{{ currentTerm.pinyin }}</div>

          <div class="divider" />

          <div v-if="nextTerm" class="next">
            <span class="next-label">下一个节气</span>
            <strong class="next-name">{{ nextTerm.emoji }} {{ nextTerm.name }}</strong>
            <span class="next-days">
              {{ daysToNext === 0 ? '就是今天！' : `还有 ${daysToNext} 天` }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 54px 0 64px;
  isolation: isolate;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.45;
  z-index: -1;
  animation: drift 18s ease-in-out infinite alternate;
}
.blob-a {
  width: 380px;
  height: 380px;
  top: -120px;
  left: -80px;
  background: var(--hero-c1);
}
.blob-b {
  width: 320px;
  height: 320px;
  bottom: -140px;
  right: -60px;
  background: var(--hero-c2);
  animation-delay: -6s;
}
@keyframes drift {
  to {
    transform: translate3d(40px, 30px, 0) scale(1.12);
  }
}

.inner {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 40px;
  align-items: center;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--fg-muted);
  margin-bottom: 14px;
}
.dot {
  opacity: 0.5;
}

h1 {
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}
.current {
  background: linear-gradient(120deg, var(--hero-c1), var(--hero-c2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.14em;
}

.tagline {
  font-family: var(--font-serif);
  font-size: clamp(1.05rem, 2.4vw, 1.35rem);
  letter-spacing: 0.14em;
  margin: 0 0 14px;
}
.desc {
  max-width: 52ch;
  color: var(--fg-muted);
  font-size: 0.95rem;
}

.hou {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 22px 0 26px;
}
.hou li {
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-family: var(--font-serif);
  font-size: 0.95rem;
}
.hou small {
  font-family: var(--font);
  font-size: 0.66rem;
  color: var(--hero-c2);
  letter-spacing: 0.14em;
}

.cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  padding: 12px 26px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease;
}
.btn:hover {
  transform: translateY(-3px);
}
.btn.primary {
  color: #fff;
  background: linear-gradient(120deg, var(--hero-c1), var(--hero-c2));
  box-shadow: 0 14px 30px color-mix(in srgb, var(--hero-c2) 40%, transparent);
}
.btn.ghost {
  border: 1px solid var(--line);
  background: var(--surface-solid);
}

.glass {
  position: relative;
  padding: 34px 28px;
  border-radius: 26px;
  border: 1px solid var(--line);
  background: var(--surface);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-lg);
  text-align: center;
}
.glass-emoji {
  font-size: 3.6rem;
  animation: floaty 4.5s ease-in-out infinite;
}
@keyframes floaty {
  50% {
    transform: translateY(-10px) rotate(4deg);
  }
}
.glass-name {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  margin-top: 6px;
}
.glass-pinyin {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.divider {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}
.next {
  display: grid;
  gap: 4px;
}
.next-label {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: var(--fg-muted);
}
.next-name {
  font-size: 1.1rem;
  letter-spacing: 0.12em;
}
.next-days {
  font-size: 0.82rem;
  color: var(--hero-c2);
  font-weight: 600;
}

@media (max-width: 880px) {
  .inner {
    grid-template-columns: 1fr;
  }
  .right {
    max-width: 380px;
  }
}
</style>