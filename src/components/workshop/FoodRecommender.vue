<script setup>
/**
 * 时令食材推荐器 FoodRecommender
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - computed 做多条件过滤：先按季节筛，再按"想吃什么"二次筛
 *  - Array.prototype 方法（map/filter/flatMap/Set）与 Vue 的响应式结合
 *  - 用 watch 观察选择变化并记录历史（副作用）
 *  - <TransitionGroup> 让推荐结果切换时有动画
 *  - v-model 绑定 select / radio / checkbox 等各种表单元素
 */
import { computed, ref, watch } from 'vue'
import { TERMS, SEASONS } from '@/data/terms'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SeasonBadge from '@/components/terms/SeasonBadge.vue'

const season = ref('all')
const keyword = ref('')
const healthyOnly = ref(false) // 只看"养生"相关
const history = ref([])
const loading = ref(false)

/** 所有"节气 + 它的食材"打平成一个列表，便于筛选 */
const allFoods = computed(() =>
  TERMS.flatMap((term) =>
    term.foods.map((food) => ({
      food,
      termId: term.id,
      termName: term.name,
      season: term.season,
      emoji: term.emoji,
      health: term.health,
      colors: term.colors
    }))
  )
)

/** 去重后的食材总数（用 Set 去重） */
const foodCount = computed(() => new Set(allFoods.value.map((f) => f.food)).size)

const results = computed(() => {
  return allFoods.value.filter((item) => {
    if (season.value !== 'all' && item.season !== season.value) return false
    if (keyword.value && !item.food.includes(keyword.value.trim())) return false
    return true
  })
})

/** 常见食材 Top：按出现次数排序后取前 8 个 */
const topFoods = computed(() => {
  const counter = new Map()
  allFoods.value.forEach((item) => counter.set(item.food, (counter.get(item.food) || 0) + 1))
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([food, count]) => ({ food, count }))
})

function randomPick() {
  loading.value = true
  // 演示"假装异步"的加载态
  window.setTimeout(() => {
    const pool = results.value.length ? results.value : allFoods.value
    const pick = pool[Math.floor(Math.random() * pool.length)]
    keyword.value = pick.food
    loading.value = false
    pushHistory(pick)
  }, 420)
}

function pushHistory(item) {
  history.value = [item, ...history.value.filter((h) => h.food !== item.food)].slice(0, 6)
}

// watch：搜索词变化时把命中记录加入历史
watch(keyword, (value) => {
  if (!value) return
  const hit = results.value[0]
  if (hit) pushHistory(hit)
})
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <h3 class="title">🍚 时令食材推荐器</h3>
      <p class="sub">
        共收录 <strong>{{ foodCount }}</strong> 种食材，来自 24 个节气的传统食俗
      </p>
    </template>

    <!-- 表单区：v-model 绑定的几种典型用法 -->
    <div class="form">
      <label class="field">
        <span>季节</span>
        <select v-model="season">
          <option value="all">不限</option>
          <option v-for="(s, key) in SEASONS" :key="key" :value="key">
            {{ s.emoji }} {{ s.full }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>食材关键词</span>
        <input v-model="keyword" type="text" placeholder="例如：羊肉 / 藕 / 茶" />
      </label>

      <label class="check">
        <input v-model="healthyOnly" type="checkbox" />
        <span>只看养生推荐（{{ healthyOnly ? '已开启' : '已关闭' }}）</span>
      </label>

      <BaseButton variant="primary" :loading="loading" @click="randomPick">
        🎲 随机推荐一个
      </BaseButton>
    </div>

    <!-- 热门食材标签：点击等于填入搜索框 -->
    <div class="top">
      <span class="top-label">热门：</span>
      <button v-for="item in topFoods" :key="item.food" class="top-chip" @click="keyword = item.food">
        {{ item.food }}<small>{{ item.count }}</small>
      </button>
    </div>

    <!-- 结果列表 -->
    <EmptyState
      v-if="!results.length"
      icon="🥣"
      title="没有匹配的食材"
      description="换个关键词试试，比如「汤」「茶」「饺」。"
      @action="keyword = ''"
    />

    <TransitionGroup v-else name="list" tag="ul" class="results">
      <li
        v-for="item in results.slice(0, 18)"
        :key="item.termId + item.food"
        class="result"
        :style="{ '--c1': item.colors[0], '--c2': item.colors[1] }"
      >
        <span class="food">{{ item.food }}</span>
        <span class="from">
          <SeasonBadge :season="item.season" />
          {{ item.emoji }} {{ item.termName }}
        </span>
      </li>
    </TransitionGroup>

    <!-- v-if 显示"养生"提示：开启复选框后出现 -->
    <Transition name="fade">
      <div v-if="healthyOnly" class="health-tip">
        <strong>养生小贴士：</strong>不同节气各有讲究，例如立冬宜温补、大暑宜清热，
        点击节气名可以查看完整说明。
      </div>
    </Transition>

    <!-- 历史记录 -->
    <template #footer>
      <span class="history-label">最近看过：</span>
      <TransitionGroup name="list" tag="span" class="history">
        <span v-for="item in history" :key="item.food" class="history-chip">
          {{ item.food }}
        </span>
      </TransitionGroup>
      <span v-if="!history.length" class="text-muted">还没有记录</span>
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

.form {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.field {
  display: grid;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--fg-muted);
}
.field select,
.field input {
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  color: var(--fg);
  outline: none;
  font-size: 0.9rem;
}
.field select:focus,
.field input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  color: var(--fg-muted);
  padding-bottom: 10px;
}
.check input {
  accent-color: var(--brand);
  width: 16px;
  height: 16px;
}

.top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  font-size: 0.8rem;
}
.top-label {
  color: var(--fg-muted);
}
.top-chip {
  border: 1px dashed var(--line);
  background: transparent;
  border-radius: 999px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}
.top-chip small {
  color: var(--accent);
  font-size: 0.68rem;
}
.top-chip:hover {
  border-style: solid;
  border-color: var(--brand);
  color: var(--brand);
}

.results {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--c1);
  background: var(--surface-solid);
  font-size: 0.88rem;
}
.food {
  font-weight: 600;
}
.from {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  color: var(--fg-muted);
}

.health-tip {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--brand-soft);
  font-size: 0.85rem;
}

.history-label {
  font-size: 0.78rem;
  color: var(--fg-muted);
}
.history {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}
.history-chip {
  font-size: 0.76rem;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
}
</style>