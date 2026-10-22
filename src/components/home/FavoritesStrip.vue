<script setup>
/**
 * 我的收藏条 FavoritesStrip
 * ------------------------------------------------------------------
 * 数据直接来自 Pinia store（而不是 props），演示"全局状态"的用法：
 *   首页、图鉴页、详情页读到的都是同一份收藏数据。
 * 用 storeToRefs 保持解构后的响应性 —— 这是 Pinia 使用中最容易踩的坑：
 *   直接 const { list } = store 会丢失响应性，必须用 storeToRefs。
 */
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import BaseCard from '@/components/common/BaseCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@/composables/useToast'

const favorites = useFavoritesStore()
const { list, count } = storeToRefs(favorites)

const toast = useToast()

function removeAll() {
  favorites.clear()
  toast.info('已清空收藏')
}
</script>

<template>
  <BaseCard padding="lg">
    <template #header>
      <div class="head">
        <div>
          <h3 class="title">我的收藏</h3>
          <p class="subtitle">收藏的节气会保存在浏览器本地，刷新不丢</p>
        </div>
        <button v-if="count" class="clear" @click="removeAll">清空</button>
      </div>
    </template>

    <!-- v-if / v-else 分支渲染 -->
    <div v-if="count" class="strip">
      <TransitionGroup name="list">
        <RouterLink
          v-for="term in list"
          :key="term.id"
          class="pill"
          :to="{ name: 'term-detail', params: { id: term.id } }"
          :style="{ '--c1': term.colors[0], '--c2': term.colors[1] }"
        >
          <span class="emoji">{{ term.emoji }}</span>
          {{ term.name }}
        </RouterLink>
      </TransitionGroup>
    </div>

    <EmptyState
      v-else
      icon="⭐"
      title="还没有收藏任何节气"
      description="去「节气图鉴」点一下卡片上的星星，就能把喜欢的节气收进来。"
    >
      <template #action="{ suggestion }">
        <div class="empty-action">
          <RouterLink class="go" :to="{ name: 'terms' }">去图鉴逛逛</RouterLink>
          <small class="text-muted">{{ suggestion }}</small>
        </div>
      </template>
    </EmptyState>
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
.subtitle {
  margin: 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.clear {
  border: 1px solid var(--line);
  background: transparent;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 0.78rem;
  cursor: pointer;
  color: var(--fg-muted);
}
.clear:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.strip {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(120deg, var(--c1), var(--c2));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--c2) 32%, transparent);
  transition: transform 0.22s ease;
}
.pill:hover {
  transform: translateY(-3px) scale(1.03);
}
.empty-action {
  display: grid;
  gap: 8px;
  justify-items: center;
}
.go {
  padding: 8px 20px;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
}
</style>