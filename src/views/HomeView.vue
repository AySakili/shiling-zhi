<script setup>
/**
 * 首页 HomeView
 * ------------------------------------------------------------------
 * 这一页把所有基础组件"拼装"起来，本身几乎不写逻辑：
 *   HeroSection（主视觉） → CountdownCard（倒计时） → 节气圆盘 → 功能入口 → 收藏条
 *
 * 涉及知识点：
 *  - 组合式函数 useSeasonNow()：拿到"当前节气 / 下一个节气"的响应式数据
 *  - computed：从当前节气派生"本季节的其他节气"做推荐
 *  - 组件通信：@select（圆盘点击）、@finished（倒计时结束）、@toggle-favorite（收藏）
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import HeroSection from '@/components/home/HeroSection.vue'
import CountdownCard from '@/components/home/CountdownCard.vue'
import FeatureList from '@/components/home/FeatureList.vue'
import FavoritesStrip from '@/components/home/FavoritesStrip.vue'
import TermWheel from '@/components/terms/TermWheel.vue'
import TermCard from '@/components/terms/TermCard.vue'

import { useSeasonNow } from '@/composables/useSeasonNow'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@/composables/useToast'
import { TERMS, SEASONS } from '@/data/terms'

const router = useRouter()
const toast = useToast()
const favorites = useFavoritesStore()
const { ids: favoriteIds } = storeToRefs(favorites)

// 当前/下一个节气的响应式数据（内部会自动跨天刷新）
const { currentTerm, nextTerm, next, daysToNext, currentDateText } = useSeasonNow()

/** 下一个节气的 Date 对象，传给倒计时组件 */
const nextDate = computed(() => next.value.date)

/** 同一季节里、接下来的 3 个节气，作为"时令推荐" */
const seasonPicks = computed(() => {
  const sameSeason = TERMS.filter((t) => t.season === currentTerm.value.season)
  const index = sameSeason.findIndex((t) => t.id === currentTerm.value.id)
  return [
    ...sameSeason.slice(index + 1),
    ...sameSeason.slice(0, index + 1)
  ].slice(0, 3)
})

const seasonInfo = computed(() => SEASONS[currentTerm.value.season])

const features = [
  {
    icon: '📖',
    title: '节气图鉴',
    desc: '24 个节气的三候、习俗、时令食材、养生与诗词，支持搜索、筛选与排序。',
    tag: '列表渲染 / 表单绑定',
    to: { name: 'terms' }
  },
  {
    icon: '🧪',
    title: '时令工坊',
    desc: '食材推荐器、知识小测、诗词轮播，以及异步组件、渲染函数、自定义指令的现场演示。',
    tag: '组件进阶 / 组合式函数',
    to: { name: 'workshop' }
  },
  {
    icon: '🎞️',
    title: '动画与过渡',
    desc: '页面切换、列表增删、弹窗、提示条都带过渡效果，直接对着源码看 6 个过渡类名。',
    tag: 'Transition / Teleport',
    to: { name: 'workshop', hash: '#anim' }
  },
  {
    icon: 'ℹ️',
    title: '关于本站',
    desc: '技术栈、目录结构、知识点与文件的对应关系，以及"数据从哪来"的说明。',
    tag: '工程化 / 路由',
    to: { name: 'about' }
  }
]

function onWheelSelect(id) {
  router.push({ name: 'term-detail', params: { id } })
}

function onFavorite(term) {
  const added = favorites.toggle(term.id)
  toast[added ? 'success' : 'info'](added ? `已收藏「${term.name}」` : `已取消收藏「${term.name}」`)
}

function onCountdownFinished() {
  toast.success('新的节气到了，页面数据已自动更新')
}
</script>

<template>
  <div class="home">
    <!-- 1. 主视觉 -->
    <HeroSection
      :current-term="currentTerm"
      :next-term="nextTerm"
      :days-to-next="daysToNext"
      :current-date-text="currentDateText"
    >
      <template #extra>
        <button class="extra-btn" @click="router.push({ name: 'workshop' })">🎲 去工坊玩一下</button>
      </template>
    </HeroSection>

    <div class="container">
      <!-- 2. 倒计时 -->
      <section class="section" v-reveal>
        <CountdownCard
          :current-term="currentTerm"
          :next-term="nextTerm"
          :next-date="nextDate"
          @finished="onCountdownFinished"
        />
      </section>

      <!-- 3. 节气圆盘 -->
      <section class="section">
        <header class="section-head" v-reveal>
          <h2 class="section-title">二十四节气圆盘</h2>
          <p class="text-muted">
            一年 24 个节气均匀分布在一个圆上 —— 鼠标悬停看物候，点击进详情（当前：
            {{ seasonInfo.emoji }} {{ seasonInfo.full }}）
          </p>
        </header>

        <TermWheel
          :center-term-id="currentTerm.id"
          :radius="150"
          @select="onWheelSelect"
        />
      </section>

      <!-- 4. 时令推荐 -->
      <section class="section">
        <header class="section-head" v-reveal>
          <h2 class="section-title">{{ seasonInfo.emoji }} {{ seasonInfo.full }}·时令推荐</h2>
          <p class="text-muted">按节气顺序，为你推荐同季节的后 3 个节气</p>
        </header>

        <div class="picks">
          <TermCard
            v-for="(term, i) in seasonPicks"
            :key="term.id"
            :term="term"
            :favorite="favoriteIds.includes(term.id)"
            class="pick"
            v-reveal="{ delay: i * 120 }"
            @toggle-favorite="onFavorite"
            @preview="onWheelSelect($event.id)"
          />
        </div>
      </section>

      <!-- 5. 功能入口 -->
      <section class="section">
        <header class="section-head" v-reveal>
          <h2 class="section-title">站点功能</h2>
          <p class="text-muted">每个入口都对应一类 Vue 知识点，点进去看代码注释</p>
        </header>

        <FeatureList :items="features">
          <template #footer="{ item, index }">
            <span class="feature-index">0{{ index + 1 }}</span>
          </template>
        </FeatureList>
      </section>

      <!-- 6. 我的收藏 -->
      <section class="section" v-reveal>
        <FavoritesStrip />
      </section>
    </div>
  </div>
</template>

<style scoped>
.section-head {
  margin-bottom: 22px;
}
.section-head p {
  margin: 0;
  font-size: 0.88rem;
  max-width: 60ch;
}
.picks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}
.extra-btn {
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px dashed var(--line);
  background: transparent;
  cursor: pointer;
  font-size: 0.92rem;
  color: var(--fg-muted);
  transition: all 0.22s ease;
}
.extra-btn:hover {
  border-style: solid;
  border-color: var(--brand);
  color: var(--brand);
}
</style>