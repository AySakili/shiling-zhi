<script setup>
/**
 * 404 页面 NotFoundView
 * ------------------------------------------------------------------
 * 由路由通配符 /:pathMatch(.*)* 匹配。
 * 涉及知识点：
 *  - useRoute 读取"用户实际访问的错误地址"并展示出来（route.fullPath）
 *  - 编程式导航 router.replace（用 replace 而不是 push，避免用户"返回"又回到 404）
 *  - computed 随机推荐 3 个节气
 */
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { TERMS } from '@/data/terms'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const suggestions = computed(() =>
  [...TERMS].sort(() => Math.random() - 0.5).slice(0, 3)
)

function goRandom() {
  const term = TERMS[Math.floor(Math.random() * TERMS.length)]
  router.replace({ name: 'term-detail', params: { id: term.id } })
}
</script>

<template>
  <div class="notfound container">
    <div class="code" aria-hidden="true">
      <span>4</span><span class="zero">🌗</span><span>4</span>
    </div>

    <h1>这个节气还没被发明出来</h1>
    <p class="text-muted">
      你访问的地址是 <code>{{ route.fullPath }}</code>，但它没有对应的页面。
      一年只有 24 个节气，页面也一样有限。
    </p>

    <div class="actions">
      <RouterLink class="btn primary" :to="{ name: 'home' }">回首页</RouterLink>
      <RouterLink class="btn" :to="{ name: 'terms' }">去节气图鉴</RouterLink>
      <BaseButton variant="ghost" @click="goRandom">🎲 随机看点别的</BaseButton>
    </div>

    <section class="suggest">
      <h2>要不看看这几个？</h2>
      <div class="cards">
        <RouterLink
          v-for="term in suggestions"
          :key="term.id"
          class="card"
          :to="{ name: 'term-detail', params: { id: term.id } }"
          :style="{ background: `linear-gradient(135deg, ${term.colors[0]}, ${term.colors[1]})` }"
        >
          <span class="emoji">{{ term.emoji }}</span>
          <strong>{{ term.name }}</strong>
          <small>{{ term.tagline }}</small>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.notfound {
  padding: 70px 20px 60px;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 12px;
}
.code {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: clamp(3rem, 12vw, 6rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--brand);
}
.zero {
  animation: spin 8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
h1 {
  margin: 0;
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  letter-spacing: 0.08em;
}
p {
  max-width: 46ch;
  font-size: 0.9rem;
}
code {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 0.84rem;
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0 26px;
}
.btn {
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 0.9rem;
  border: 1px solid var(--line);
  background: var(--surface-solid);
}
.btn.primary {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
  font-weight: 600;
}

.suggest h2 {
  font-size: 1rem;
  color: var(--fg-muted);
  font-weight: 500;
  margin-bottom: 14px;
}
.cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  display: grid;
  gap: 2px;
  min-width: 130px;
  padding: 16px 20px;
  border-radius: var(--radius);
  color: #fff;
  text-align: center;
  transition: transform 0.25s ease;
  box-shadow: var(--shadow);
}
.card:hover {
  transform: translateY(-5px) scale(1.03);
}
.card .emoji {
  font-size: 1.5rem;
}
.card strong {
  letter-spacing: 0.14em;
}
.card small {
  font-size: 0.7rem;
  opacity: 0.85;
}
</style>