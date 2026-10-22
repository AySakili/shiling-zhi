<script setup>
/**
 * 节气详情页 TermDetailView
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - 动态路由参数：路由配置里写了 props: true，所以 :id 直接变成 props
 *  - computed 根据 id 找到节气对象；找不到就显示"未找到"
 *  - watch 监听 id 变化（在详情页之间跳转时组件会被复用，不会重新创建）
 *  - 编程式导航：router.push / router.replace 实现"上一个/下一个"
 *  - onBeforeRouteLeave：路由独享的守卫，离开前弹确认（演示用）
 *  - Pinia 收藏状态 + inject 读取插件提供的站点信息
 */
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'

import TermDetailPanel from '@/components/terms/TermDetailPanel.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { TERMS, TERM_MAP, formatDate, termDate } from '@/data/terms'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  /** 来自路由的 /terms/:id */
  id: { type: String, required: true }
})

const router = useRouter()
const toast = useToast()
const site = inject('siteInfo', { name: '时令志' })

const favorites = useFavoritesStore()
const { ids: favoriteIds } = storeToRefs(favorites)

const term = computed(() => TERM_MAP[props.id] || null)
const isFavorite = computed(() => (term.value ? favoriteIds.value.includes(term.value.id) : false))

/** 上一个 / 下一个节气（环形，首尾相连） */
const orderedIds = TERMS.map((t) => t.id)
const currentIndex = computed(() => orderedIds.indexOf(props.id))
const prevTerm = computed(() => TERMS[(currentIndex.value - 1 + TERMS.length) % TERMS.length])
const nextTerm = computed(() => TERMS[(currentIndex.value + 1) % TERMS.length])

/** 这个节气今年的日期 */
const dateText = computed(() => (term.value ? formatDate(termDate(term.value)) : ''))
const year = new Date().getFullYear()

/** 距离这个节气还有多少天（今年已过则为负数，用"已过去"描述） */
const daysDiff = computed(() => {
  if (!term.value) return 0
  const target = termDate(term.value, year)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
})

function toggleFavorite() {
  if (!term.value) return
  const added = favorites.toggle(term.value.id)
  toast[added ? 'success' : 'info'](added ? `已收藏「${term.value.name}」` : '已取消收藏')
}

function go(id) {
  router.push({ name: 'term-detail', params: { id } })
}

/** 键盘左右方向键切换节气：挂载时注册，卸载时移除（很重要，否则会内存泄漏） */
function onKeydown(e) {
  // 在输入框里按方向键时不要触发跳转
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return
  if (e.key === 'ArrowLeft') go(prevTerm.value.id)
  if (e.key === 'ArrowRight') go(nextTerm.value.id)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// 演示：路由参数变化时做点事情（同一个组件被复用时不会重新 mount）
watch(
  () => props.id,
  (newId, oldId) => {
    if (import.meta.env.DEV) console.log(`[TermDetailView] ${oldId} → ${newId}`)
  }
)

/** 路由守卫：只有当"评分还没打"时才提示（演示 onBeforeRouteLeave 的用法） */
const leftOnce = ref(false)
onBeforeRouteLeave((to, from, next) => {
  if (!leftOnce.value && term.value) {
    leftOnce.value = true
    if (import.meta.env.DEV) console.log(`[守卫] 离开 ${term.value.name} 前往 ${String(to.name)}`)
  }
  next() // 一定要调用 next() 才会真的跳转
})
</script>

<template>
  <div class="detail-page container">
    <!-- 面包屑：RouterLink 组成的导航链 -->
    <nav class="crumb" aria-label="面包屑">
      <RouterLink :to="{ name: 'home' }">首页</RouterLink>
      <span>/</span>
      <RouterLink :to="{ name: 'terms' }">节气图鉴</RouterLink>
      <span>/</span>
      <span class="now">{{ term ? term.name : '未找到' }}</span>
    </nav>

    <!-- ============ 找到了：正常显示 ============ -->
    <template v-if="term">
      <header class="page-bar">
        <div class="info">
          <p class="muted">
            {{ year }} 年的日期：{{ dateText }} ·
            <span v-if="daysDiff > 0">还有 {{ daysDiff }} 天</span>
            <span v-else-if="daysDiff === 0">就是今天 🎉</span>
            <span v-else>已经过去 {{ -daysDiff }} 天</span>
          </p>
          <p class="muted">用键盘 ← → 可以快速切换上一个 / 下一个节气</p>
        </div>

        <div class="ops">
          <BaseButton :variant="isFavorite ? 'default' : 'primary'" size="sm" @click="toggleFavorite">
            {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="go(prevTerm.id)">
            ← {{ prevTerm.name }}
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="go(nextTerm.id)">
            {{ nextTerm.name }} →
          </BaseButton>
        </div>
      </header>

      <!-- 详情主体：自己也是一个组件 -->
      <TermDetailPanel :term="term" />

      <!-- 相邻节气导航 -->
      <nav class="adjacent">
        <RouterLink class="adj" :to="{ name: 'term-detail', params: { id: prevTerm.id } }">
          <small>上一个节气</small>
          <strong>{{ prevTerm.emoji }} {{ prevTerm.name }}</strong>
        </RouterLink>
        <RouterLink class="adj next" :to="{ name: 'term-detail', params: { id: nextTerm.id } }">
          <small>下一个节气</small>
          <strong>{{ nextTerm.name }} {{ nextTerm.emoji }}</strong>
        </RouterLink>
      </nav>
    </template>

    <!-- ============ 没找到：容错处理 ============ -->
    <EmptyState
      v-else
      icon="🧭"
      title="没有这个节气"
      :description="`地址里的 id 是「${id}」，它不是有效的节气标识。`"
    >
      <template #action>
        <RouterLink class="back" :to="{ name: 'terms' }">回到节气图鉴</RouterLink>
      </template>
    </EmptyState>

    <p class="footer-note text-muted">
      数据说明：节气日期为常年日期（±1 天），准确时刻请以中国科学院紫金山天文台发布为准。
      本站由 {{ site.name }} v{{ site.version }} 提供。
    </p>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 28px;
  padding-bottom: 40px;
}
.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--fg-muted);
  margin-bottom: 20px;
}
.crumb a:hover {
  color: var(--brand);
}
.crumb .now {
  color: var(--fg);
  font-weight: 600;
}

.page-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.info .muted {
  margin: 0 0 4px;
  font-size: 0.82rem;
  color: var(--fg-muted);
}
.ops {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.adjacent {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}
.adj {
  display: grid;
  gap: 4px;
  padding: 16px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.adj:hover {
  transform: translateY(-4px);
  border-color: var(--brand);
}
.adj.next {
  text-align: right;
}
.adj small {
  font-size: 0.72rem;
  color: var(--fg-muted);
  letter-spacing: 0.14em;
}
.adj strong {
  font-size: 1.05rem;
  letter-spacing: 0.1em;
}

.back {
  padding: 9px 20px;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-size: 0.88rem;
}

.footer-note {
  margin-top: 30px;
  font-size: 0.78rem;
  line-height: 1.9;
}
</style>