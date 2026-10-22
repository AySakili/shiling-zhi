<script setup>
/**
 * 渲染函数演示 RenderFunctionDemo
 * ------------------------------------------------------------------
 * 模板最终也会被编译成渲染函数。这里手写 h() 来对比"模板 vs 渲染函数"。
 *
 * 涉及知识点：
 *  - h(type, props, children)：创建虚拟节点（VNode）
 *  - 用 defineComponent 定义"带渲染函数的组件"，再在模板里当普通组件用
 *  - 函数式组件：一个普通函数就是组件（没有状态，只有 props）
 *  - 插槽在渲染函数里通过 slots 访问
 */
import { defineComponent, h, ref, computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { TERMS } from '@/data/terms'

const topN = ref(4)

/** 用 h() 渲染一个"节气排行榜"，完全不用 <template> */
const TermRank = defineComponent({
  name: 'TermRank',
  props: {
    terms: { type: Array, required: true }
  },
  // setup 返回一个函数 → 这个函数就是渲染函数
  setup(props, { slots }) {
    return () =>
      h(
        'ol',
        { class: 'rank-list' },
        props.terms.map((term, i) =>
          h('li', { class: 'rank-item', key: term.id }, [
            h('span', { class: 'rank-no' }, String(i + 1).padStart(2, '0')),
            h('span', { class: 'rank-name' }, `${term.emoji} ${term.name}`),
            h('span', { class: 'rank-tagline' }, term.tagline),
            // 用 h() 创建 RouterLink 之类的外部组件也可以，这里演示事件
            h(
              'button',
              {
                class: 'rank-btn',
                onClick: () => window.alert(`${term.name}：${term.intro}`)
              },
              '简介'
            )
          ])
        ),
        // 默认插槽放到列表后面
        slots.default?.()
      )
  }
})

/** 函数式组件：没有响应式状态，输入 props 输出视图 */
const Pill = (props) => h('span', { class: 'pill' }, props.label)

/** 准备排行榜数据：按"收藏价值"随便排一下（这里用 order 倒序做演示） */
const ranked = computed(() => [...TERMS].sort((a, b) => b.order - a.order).slice(0, topN.value))
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <h3 class="title">🛠️ 渲染函数 / h() 与函数式组件</h3>
      <p class="sub">下面这个列表没有写 v-for，它是由 JavaScript 的 h() 生成的</p>
    </template>

    <!-- 直接用渲染函数组件，和普通组件没区别 -->
    <TermRank :terms="ranked">
      <p class="slot-tip">↑ 这段文字来自渲染函数里的 slots.default()</p>
    </TermRank>

    <div class="row">
      <Pill label="函数式组件 A" />
      <Pill label="函数式组件 B" />
      <label class="field">
        显示数量
        <input v-model.number="topN" type="range" min="1" max="10" />
        <strong>{{ topN }}</strong>
      </label>
    </div>

    <template #footer>
      <span class="text-muted">等价的模板写法：<code>&lt;li v-for="term in ranked"&gt;</code></span>
    </template>
  </BaseCard>
</template>

<style scoped>
.title {
  margin: 0 0 4px;
  font-size: 1.05rem;
}
.sub {
  margin: 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--fg-muted);
}
.field input {
  accent-color: var(--brand);
}
.slot-tip {
  font-size: 0.78rem;
  color: var(--fg-muted);
  margin: 10px 0 0;
}

/* 因为 h() 生成的元素没有 scoped 属性，这里用 :deep() 穿透 */
:deep(.rank-list) {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
:deep(.rank-item) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  font-size: 0.88rem;
}
:deep(.rank-no) {
  font-weight: 800;
  color: var(--brand);
  font-variant-numeric: tabular-nums;
}
:deep(.rank-name) {
  font-weight: 600;
  min-width: 92px;
}
:deep(.rank-tagline) {
  color: var(--fg-muted);
  font-family: var(--font-serif);
  flex: 1;
}
:deep(.rank-btn) {
  border: 1px solid var(--line);
  background: transparent;
  border-radius: 999px;
  padding: 3px 12px;
  font-size: 0.76rem;
  cursor: pointer;
}
:deep(.rank-btn:hover) {
  border-color: var(--brand);
  color: var(--brand);
}
:deep(.pill) {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 0.78rem;
}
</style>