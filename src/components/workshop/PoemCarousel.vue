<script setup>
/**
 * 诗词轮播 PoemCarousel
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - <Transition> 的不同 name：根据"上一张/下一张"切换动画方向（computed）
 *  - 定时器自动播放 + onUnmounted 清理（组件销毁后不能还在跑）
 *  - watch + 鼠标悬停暂停（mouseenter / mouseleave）
 *  - 键盘操作（@keydown）与无障碍 aria-label
 *  - computed 从 24 个节气里取出诗句组成轮播数据
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { TERMS } from '@/data/terms'
import BaseCard from '@/components/common/BaseCard.vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  /** 自动播放间隔（毫秒），0 表示不自动播放 */
  interval: { type: Number, default: 4200 }
})

/** 把每个节气的诗句抽出来做成轮播项 */
const poems = computed(() =>
  TERMS.map((term) => ({
    id: term.id,
    name: term.name,
    emoji: term.emoji,
    colors: term.colors,
    text: term.poem.text,
    author: term.poem.author,
    title: term.poem.title,
    tagline: term.tagline
  }))
)

const index = ref(0)
const direction = ref('next')
const paused = ref(false)
let timer = null

const current = computed(() => poems.value[index.value])
const transitionName = computed(() => (direction.value === 'next' ? 'slide-next' : 'slide-prev'))

function go(step) {
  direction.value = step > 0 ? 'next' : 'prev'
  index.value = (index.value + step + poems.value.length) % poems.value.length
}

function jump(i) {
  direction.value = i > index.value ? 'next' : 'prev'
  index.value = i
}

function startTimer() {
  stopTimer()
  if (props.interval > 0) {
    timer = window.setInterval(() => {
      if (!paused.value) go(1)
    }, props.interval)
  }
}

function stopTimer() {
  if (timer) window.clearInterval(timer)
  timer = null
}

// 鼠标悬停暂停 / 离开恢复
watch(paused, (value) => {
  if (import.meta.env.DEV) console.log(`[PoemCarousel] 自动播放${value ? '暂停' : '恢复'}`)
})

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <div class="head">
        <div>
          <h3 class="title">📜 节气诗词轮播</h3>
          <p class="sub">二十四节气各配一句古诗 · 悬停暂停</p>
        </div>
        <div class="nav">
          <button aria-label="上一首" @click="go(-1)">‹</button>
          <button aria-label="下一首" @click="go(1)">›</button>
        </div>
      </div>
    </template>

    <!-- 轮播舞台：@mouseenter / @mouseleave 控制暂停 -->
    <div
      class="stage"
      tabindex="0"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focus="paused = true"
      @blur="paused = false"
      @keydown.left.prevent="go(-1)"
      @keydown.right.prevent="go(1)"
    >
      <Transition :name="transitionName" mode="out-in">
        <article
          :key="current.id"
          class="poem"
          :style="{
            background: `linear-gradient(135deg, ${current.colors[0]}, ${current.colors[1]})`
          }"
        >
          <div class="poem-head">
            <span class="emoji">{{ current.emoji }}</span>
            <span class="name">{{ current.name }}</span>
            <span class="tagline">{{ current.tagline }}</span>
          </div>
          <p class="text">{{ current.text }}</p>
          <p class="from">—— {{ current.author }}《{{ current.title }}》</p>
          <RouterLink class="detail-link" :to="{ name: 'term-detail', params: { id: current.id } }">
            查看 {{ current.name }} 详情 →
          </RouterLink>
        </article>
      </Transition>
    </div>

    <!-- 圆点导航 -->
    <template #footer>
      <div class="dots">
        <button
          v-for="(poem, i) in poems"
          :key="poem.id"
          class="dot"
          :class="{ on: i === index }"
          :title="poem.name"
          :aria-label="`第 ${i + 1} 首：${poem.name}`"
          @click="jump(i)"
        />
      </div>
      <span class="counter text-muted">{{ index + 1 }} / {{ poems.length }}</span>
      <span class="state">{{ paused ? '⏸ 已暂停' : '▶ 播放中' }}</span>
    </template>
  </BaseCard>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.title {
  margin: 0 0 4px;
  font-size: 1.05rem;
}
.sub {
  margin: 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.nav {
  display: flex;
  gap: 6px;
}
.nav button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
}
.nav button:hover {
  border-color: var(--brand);
  color: var(--brand);
}

.stage {
  position: relative;
  min-height: 210px;
  border-radius: var(--radius);
  overflow: hidden;
  outline: none;
}
.stage:focus-visible {
  box-shadow: 0 0 0 4px var(--brand-soft);
}
.poem {
  position: absolute;
  inset: 0;
  padding: 26px 24px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.poem-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  opacity: 0.95;
}
.poem-head .name {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}
.poem-head .tagline {
  font-family: var(--font-serif);
  letter-spacing: 0.1em;
}
.text {
  font-family: var(--font-serif);
  font-size: clamp(1.15rem, 3vw, 1.6rem);
  letter-spacing: 0.16em;
  margin: 8px 0 0;
}
.from {
  font-size: 0.82rem;
  opacity: 0.85;
  margin: 0;
}
.detail-link {
  margin-top: 6px;
  font-size: 0.82rem;
  text-decoration: underline;
  text-underline-offset: 4px;
  align-self: flex-start;
}

/* 轮播切换动画：左右方向不同 */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
}
.slide-next-enter-from {
  transform: translateX(60px);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-prev-enter-from {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(60px);
  opacity: 0;
}

.dots {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  max-width: 60%;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--line);
  cursor: pointer;
  padding: 0;
  transition: all 0.25s ease;
}
.dot.on {
  width: 20px;
  border-radius: 999px;
  background: var(--brand);
}
.counter,
.state {
  font-size: 0.78rem;
  color: var(--fg-muted);
}
.state {
  margin-left: auto;
}
</style>