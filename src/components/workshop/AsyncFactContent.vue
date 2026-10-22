<script setup>
/**
 * 异步组件的内容部分 AsyncFactContent
 * ------------------------------------------------------------------
 * 这个组件故意"很慢"：用顶层 await 模拟一次网络请求（比如调用后端接口）。
 *
 * 重点：<script setup> 里可以直接写顶层 await —— 此时这个组件就变成了
 * "异步组件"，必须由外层的 <Suspense> 包住才能渲染，否则会报错。
 * 加载期间显示 Suspense 的 #fallback，加载完成再切到真实内容。
 */
import { TERMS } from '@/data/terms'

/** 模拟接口：900ms 后返回一条节气冷知识 */
function fetchFact() {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const term = TERMS[Math.floor(Math.random() * TERMS.length)]
      resolve({
        term,
        fact: `${term.name}的第三候是「${term.hou[2]}」，此时${term.tagline}。养生提示：${term.health}`,
        fetchedAt: new Date().toLocaleTimeString('zh-CN')
      })
    }, 900)
  })
}

// 顶层 await：Vue 会等这个 Promise 完成后再渲染本组件
const data = await fetchFact()
</script>

<template>
  <div class="fact" :style="{ '--c1': data.term.colors[0], '--c2': data.term.colors[1] }">
    <div class="fact-head">
      <span class="emoji">{{ data.term.emoji }}</span>
      <div>
        <strong>{{ data.term.name }} · 冷知识</strong>
        <small>接口返回时间 {{ data.fetchedAt }}</small>
      </div>
    </div>
    <p class="fact-text">{{ data.fact }}</p>
  </div>
</template>

<style scoped>
.fact {
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--c1);
  background: color-mix(in srgb, var(--c1) 10%, transparent);
  padding: 16px 18px;
}
.fact-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.emoji {
  font-size: 1.7rem;
}
.fact-head strong {
  display: block;
  letter-spacing: 0.08em;
}
.fact-head small {
  color: var(--fg-muted);
  font-size: 0.72rem;
}
.fact-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.8;
}
</style>