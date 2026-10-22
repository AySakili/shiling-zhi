<script setup>
/**
 * 节气图鉴 TermsView
 * ------------------------------------------------------------------
 * 这是内容最多的一个页面，也是"列表渲染 + 表单绑定 + 状态管理"的综合练习。
 *
 * 涉及知识点：
 *  - useTermFilter 组合式函数：搜索 / 季节筛选 / 排序（内部全是 computed）
 *  - 组件 v-model：TermFilterBar 用 v-model:keyword / v-model:season 等双向绑定
 *  - 视图模式切换：网格 / 时间轴（动态组件 + 条件渲染）
 *  - Pinia 收藏状态：点击星星立刻更新，首页/详情页同步
 *  - BaseModal + 作用域插槽：卡片上的"快速预览"
 *  - keep-alive：本组件被 App.vue 缓存，来回切换不会丢失筛选条件
 *  - onMounted / onActivated / watch(route.query)：从 URL 带参数进入
 */
import { computed, ref, watch, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import TermFilterBar from '@/components/terms/TermFilterBar.vue'
import TermGrid from '@/components/terms/TermGrid.vue'
import TermTimeline from '@/components/terms/TermTimeline.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SeasonBadge from '@/components/terms/SeasonBadge.vue'
import StarRating from '@/components/common/StarRating.vue'

import { TERMS } from '@/data/terms'
import { useTermFilter } from '@/composables/useTermFilter'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@/composables/useToast'
import { useLocalStorage } from '@/composables/useLocalStorage'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const favorites = useFavoritesStore()
const { ids: favoriteIds, count: favoriteCount } = storeToRefs(favorites)

/** 筛选逻辑（抽到组合式函数里了） */
const { keyword, season, sortBy, onlyFavorites, filtered, counts, isFiltering, reset } =
  useTermFilter(TERMS)

/** 视图模式：grid 网格 / timeline 时间轴，用 localStorage 记住选择 */
const viewMode = useLocalStorage('shiling:view-mode', 'grid')

/** "只看收藏"要在筛选结果上再过滤一层 */
const visibleTerms = computed(() =>
  onlyFavorites.value ? filtered.value.filter((t) => favoriteIds.value.includes(t.id)) : filtered.value
)

/** 评分数据：预览弹窗里打分也写进同一份 localStorage */
const ratings = useLocalStorage('shiling:ratings', {})

/** 快速预览弹窗 */
const previewTerm = ref(null)
const previewOpen = ref(false)
const previewRating = computed({
  get: () => ratings.value[previewTerm.value?.id] || 0,
  set: (v) => {
    if (previewTerm.value) ratings.value = { ...ratings.value, [previewTerm.value.id]: v }
  }
})

function openPreview(term) {
  previewTerm.value = term
  previewOpen.value = true
}

function toggleFavorite(term) {
  const added = favorites.toggle(term.id)
  toast[added ? 'success' : 'info'](added ? `已收藏「${term.name}」` : `已取消收藏「${term.name}」`)
}

function onTimelineSelect(id) {
  router.push({ name: 'term-detail', params: { id } })
}

/** 读取 URL 上的 ?season=spring 之类的参数 */
function applyQuery() {
  const q = route.query
  if (q.season) season.value = String(q.season)
  if (q.keyword) keyword.value = String(q.keyword)
  if (q.sort) sortBy.value = String(q.sort)
}

onMounted(applyQuery)
// KeepAlive 的组件"再次进入"时不会触发 onMounted，但会触发 onActivated
onActivated(applyQuery)
// 同一个页面内 query 变化（比如从页脚点"秋季"）也要响应
watch(() => route.query, applyQuery)
</script>

<template>
  <div class="terms container">
    <header class="page-head">
      <div>
        <h1 class="section-title">节气图鉴</h1>
        <p class="text-muted">
          二十四节气全收录：支持关键词搜索、按季节筛选、多种排序方式，点 ★ 可以收藏。
        </p>
      </div>

      <!-- 视图切换：两个按钮共享同一个响应式变量 -->
      <div class="view-switch" role="group" aria-label="切换视图">
        <button :class="{ on: viewMode === 'grid' }" @click="viewMode = 'grid'">▦ 网格</button>
        <button :class="{ on: viewMode === 'timeline' }" @click="viewMode = 'timeline'">
          ☰ 时间轴
        </button>
      </div>
    </header>

    <!-- 筛选条：一次绑定四个 v-model -->
    <TermFilterBar
      v-model:keyword="keyword"
      v-model:season="season"
      v-model:sortBy="sortBy"
      v-model:onlyFavorites="onlyFavorites"
      :counts="counts"
      :favorite-count="favoriteCount"
      :total="visibleTerms.length"
      @reset="reset"
    />

    <p v-if="isFiltering" class="filter-hint">
      正在筛选：{{ visibleTerms.length }} 个结果
      <button @click="reset">清除全部条件</button>
    </p>

    <!-- 空状态 -->
    <EmptyState
      v-if="!visibleTerms.length"
      icon="🔍"
      title="没有找到匹配的节气"
      description="可以试试「饺子」「冬至」「杜牧」，或者清空筛选条件。"
      @action="reset"
    />

    <!-- 网格视图 -->
    <TermGrid
      v-else-if="viewMode === 'grid'"
      :terms="visibleTerms"
      :favorite-ids="favoriteIds"
      :columns="3"
      @toggle-favorite="toggleFavorite"
      @preview="openPreview"
    />

    <!-- 时间轴视图 -->
    <TermTimeline v-else :active-id="''" @select="onTimelineSelect" />

    <!-- 快速预览弹窗：BaseModal 用 v-model 控制显示 -->
    <BaseModal v-model="previewOpen" :title="previewTerm ? `${previewTerm.emoji} ${previewTerm.name}` : ''">
      <div v-if="previewTerm" class="preview">
        <div class="preview-meta">
          <SeasonBadge :season="previewTerm.season" full />
          <span class="text-muted">{{ previewTerm.month }}月{{ previewTerm.day }}日前后</span>
        </div>
        <p class="preview-tagline">「{{ previewTerm.tagline }}」</p>
        <p>{{ previewTerm.intro }}</p>
        <blockquote class="preview-poem">
          {{ previewTerm.poem.text }}
          <cite>—— {{ previewTerm.poem.author }}《{{ previewTerm.poem.title }}》</cite>
        </blockquote>
        <div class="preview-rate">
          <span>打个分：</span>
          <StarRating v-model="previewRating" :size="22" />
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" size="sm" @click="previewOpen = false">关闭</BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          @click="
            () => {
              previewOpen = false
              onTimelineSelect(previewTerm.id)
            }
          "
        >
          查看完整详情 →
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.terms {
  padding-top: 40px;
  padding-bottom: 40px;
}
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.page-head p {
  margin: 0;
  font-size: 0.9rem;
  max-width: 56ch;
}

.view-switch {
  display: flex;
  padding: 3px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
}
.view-switch button {
  border: none;
  background: transparent;
  padding: 7px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.84rem;
  color: var(--fg-muted);
  transition: all 0.22s ease;
}
.view-switch button.on {
  background: var(--brand);
  color: #fff;
  font-weight: 600;
}

.filter-hint {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.filter-hint button {
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
  text-decoration: underline dashed;
  text-underline-offset: 4px;
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  margin-bottom: 10px;
}
.preview-tagline {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  letter-spacing: 0.1em;
}
.preview-poem {
  margin: 14px 0;
  padding: 12px 16px;
  border-left: 3px solid var(--brand);
  background: var(--brand-soft);
  border-radius: 0 10px 10px 0;
  font-family: var(--font-serif);
  letter-spacing: 0.1em;
  display: grid;
  gap: 6px;
}
.preview-poem cite {
  font-size: 0.76rem;
  color: var(--fg-muted);
  font-style: normal;
  text-align: right;
}
.preview-rate {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--fg-muted);
}
</style>