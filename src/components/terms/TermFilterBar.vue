<script setup>
/**
 * 筛选工具条 TermFilterBar
 * ------------------------------------------------------------------
 * 这个组件一次演示了"多个组件 v-model"：
 *   <TermFilterBar
 *     v-model:keyword="keyword"
 *     v-model:season="season"
 *     v-model:sortBy="sortBy"
 *     v-model:onlyFavorites="onlyFavorites"
 *   />
 * 每个 v-model:xxx 对应组件里的一个 defineModel('xxx')。
 *
 * 另外：把搜索框组件（SearchInput）嵌进来，演示组件嵌套与事件向上传递。
 */
import SearchInput from '@/components/common/SearchInput.vue'
import { SEASONS } from '@/data/terms'

const keyword = defineModel('keyword', { type: String, default: '' })
const season = defineModel('season', { type: String, default: 'all' })
const sortBy = defineModel('sortBy', { type: String, default: 'order' })
const onlyFavorites = defineModel('onlyFavorites', { type: Boolean, default: false })

const props = defineProps({
  /** 各季节数量：{ all, spring, summer, autumn, winter } */
  counts: { type: Object, default: () => ({}) },
  favoriteCount: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})

const emit = defineEmits(['reset'])

const sortOptions = [
  { value: 'order', label: '按节气顺序' },
  { value: 'order-desc', label: '倒序' },
  { value: 'name', label: '按名称' }
]

/** 季节按钮列表：把 SEASONS 对象转成数组方便 v-for */
const seasonButtons = [
  { key: 'all', name: '全部', emoji: '🌗' },
  ...Object.values(SEASONS).map((s) => ({ key: s.key, name: s.full, emoji: s.emoji }))
]
</script>

<template>
  <div class="filter-bar">
    <div class="row">
      <SearchInput
        v-model="keyword"
        class="search"
        placeholder="搜节气、习俗、食材、诗句… 例如：饺子 / 杜牧 / 冬至"
      />

      <label class="sort">
        <span class="sr-only">排序方式</span>
        <select v-model="sortBy">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <!-- 收藏筛选：点击切换布尔值 -->
      <button
        class="fav-toggle"
        :class="{ on: onlyFavorites }"
        :aria-pressed="onlyFavorites"
        @click="onlyFavorites = !onlyFavorites"
      >
        ★ 只看收藏
        <span class="count">{{ favoriteCount }}</span>
      </button>
    </div>

    <div class="row seasons">
      <button
        v-for="item in seasonButtons"
        :key="item.key"
        class="season-btn"
        :class="{ on: season === item.key }"
        @click="season = item.key"
      >
        <span aria-hidden="true">{{ item.emoji }}</span>
        {{ item.name }}
        <span class="count">{{ counts[item.key] ?? 0 }}</span>
      </button>

      <button class="reset" @click="emit('reset')">重置</button>
      <span class="total text-muted">共 {{ total }} 个结果</span>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--bg-soft) 62%, transparent);
  backdrop-filter: blur(6px);
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.search {
  flex: 1;
  min-width: 240px;
}

.sort select {
  height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  color: var(--fg);
  cursor: pointer;
  outline: none;
}
.sort select:focus {
  border-color: var(--brand);
}

.fav-toggle {
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  cursor: pointer;
  color: var(--fg-muted);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.22s ease;
}
.fav-toggle.on {
  color: var(--accent);
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.count {
  font-size: 0.74rem;
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--line);
}

.season-btn {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  cursor: pointer;
  color: var(--fg-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  transition: all 0.22s ease;
}
.season-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}
.season-btn.on {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
  font-weight: 600;
}
.season-btn.on .count {
  background: rgba(255, 255, 255, 0.28);
}

.reset {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--fg-muted);
  cursor: pointer;
  text-decoration: underline dashed;
  text-underline-offset: 4px;
  font-size: 0.85rem;
}
.reset:hover {
  color: var(--danger);
}
.total {
  font-size: 0.82rem;
}
</style>