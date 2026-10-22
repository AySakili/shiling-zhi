<script setup>
/**
 * 时令工坊 WorkshopView
 * ------------------------------------------------------------------
 * 一页集合了 7 个"进阶知识点"演示组件。
 *
 * 本页新演示的知识点：
 *  - 动态组件 <component :is="...">：同一个位置切换不同组件
 *  - markRaw + shallowRef：把"组件对象"存进 ref 但不要变成响应式代理
 *    （否则 Vue 会警告"组件被做成响应式对象"，性能也不好）
 *  - <KeepAlive> 缓存动态组件，切回来时保留内部状态（比如答题进度）
 *  - 锚点导航：router hash + scrollBehavior 平滑滚动
 */
import { computed, markRaw, ref, shallowRef } from 'vue'

import FoodRecommender from '@/components/workshop/FoodRecommender.vue'
import QuizGame from '@/components/workshop/QuizGame.vue'
import PoemCarousel from '@/components/workshop/PoemCarousel.vue'
import AsyncFactCard from '@/components/workshop/AsyncFactCard.vue'
import RenderFunctionDemo from '@/components/workshop/RenderFunctionDemo.vue'
import DirectiveDemo from '@/components/workshop/DirectiveDemo.vue'
import TransitionDemo from '@/components/workshop/TransitionDemo.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

/**
 * 动态组件的"组件表"。
 * markRaw：告诉 Vue "这个对象不需要响应式"，否则控制台会报
 * "Vue received a Component that was made a reactive object"。
 */
const DEMOS = [
  { key: 'food', label: '食材推荐', icon: '🍚', comp: markRaw(FoodRecommender) },
  { key: 'quiz', label: '知识小测', icon: '🎯', comp: markRaw(QuizGame) },
  { key: 'poem', label: '诗词轮播', icon: '📜', comp: markRaw(PoemCarousel) },
  { key: 'async', label: '异步组件', icon: '⏳', comp: markRaw(AsyncFactCard) },
  { key: 'render', label: '渲染函数', icon: '🛠️', comp: markRaw(RenderFunctionDemo) },
  { key: 'directive', label: '自定义指令', icon: '✨', comp: markRaw(DirectiveDemo) },
  { key: 'anim', label: '过渡动画', icon: '🎬', comp: markRaw(TransitionDemo) }
]

/** 用 shallowRef 存"当前组件"，避免深层响应式代理 */
const activeKey = ref('food')
const activeComp = shallowRef(DEMOS[0].comp)

const activeMeta = computed(() => DEMOS.find((d) => d.key === activeKey.value) || DEMOS[0])

function switchTo(key) {
  const demo = DEMOS.find((d) => d.key === key)
  if (!demo) return
  activeKey.value = key
  activeComp.value = demo.comp
}

function onQuizFinished({ score, total }) {
  toast.success(`小测结束：答对 ${score}/${total} 题`)
}
</script>

<template>
  <div class="workshop container">
    <header class="page-head">
      <h1 class="section-title">🧪 时令工坊</h1>
      <p class="text-muted">
        把 Vue 的中高级特性做成可以动手玩的小工具：动态组件、异步组件、渲染函数、自定义指令、
        过渡动画、组合式函数与状态管理，全部在这一页。
      </p>
    </header>

    <!-- 动态组件切换器 -->
    <section class="switcher" aria-label="选择演示">
      <button
        v-for="demo in DEMOS"
        :key="demo.key"
        class="switch-btn"
        :class="{ on: activeKey === demo.key }"
        @click="switchTo(demo.key)"
      >
        <span class="icon">{{ demo.icon }}</span>
        {{ demo.label }}
      </button>
    </section>

    <p class="current-tip text-muted">
      当前演示：<strong>{{ activeMeta.icon }} {{ activeMeta.label }}</strong> ——
      切换到别的演示再切回来，内部状态会被 KeepAlive 保留（试试答题小测）。
    </p>

    <!--
      动态组件：
        <component :is="activeComp"> 会根据 activeComp 的值渲染不同组件
        KeepAlive 把切换掉的组件缓存起来，而不是销毁
        <Transition> 让切换更顺滑
    -->
    <Transition name="fade" mode="out-in">
      <KeepAlive>
        <component
          :is="activeComp"
          :key="activeKey"
          class="stage"
          v-bind="activeKey === 'quiz' ? { limit: 5 } : {}"
          @finished="onQuizFinished"
        />
      </KeepAlive>
    </Transition>

    <!-- 说明区：锚点 #anim 供路由跳转 -->
    <section id="anim" class="notes">
      <h2 class="section-title">这一页涉及的知识点</h2>
      <ul class="note-list">
        <li v-for="demo in DEMOS" :key="demo.key">
          <strong>{{ demo.icon }} {{ demo.label }}</strong>
          <span class="file">components/workshop/{{ demo.key }}*.vue</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.workshop {
  padding-top: 40px;
  padding-bottom: 40px;
}
.page-head {
  margin-bottom: 22px;
}
.page-head p {
  margin: 0;
  font-size: 0.9rem;
  max-width: 66ch;
}

.switcher {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg-soft) 62%, transparent);
}
.switch-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.86rem;
  color: var(--fg-muted);
  transition: all 0.22s ease;
}
.switch-btn:hover {
  background: var(--brand-soft);
  color: var(--brand);
}
.switch-btn.on {
  background: var(--brand);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand) 32%, transparent);
}
.switch-btn .icon {
  font-size: 1rem;
}

.current-tip {
  margin: 14px 0 18px;
  font-size: 0.84rem;
}
.stage {
  min-height: 260px;
}

.notes {
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px dashed var(--line);
}
.note-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}
.note-list li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  font-size: 0.86rem;
}
.file {
  font-size: 0.74rem;
  color: var(--fg-muted);
  font-family: 'JetBrains Mono', Consolas, monospace;
}
</style>