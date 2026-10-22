<script setup>
/**
 * 倒计时卡片 CountdownCard
 * ------------------------------------------------------------------
 * 这个组件把"组合式函数"的威力展示得很清楚：
 *   const { days, hours, minutes, seconds } = useCountdown(() => nextDate)
 * 一行代码就把"每秒刷新"的逻辑接进来了，组件本身完全不用写 setInterval。
 *
 * 另外演示：
 *  - computed 组合多个值（进度百分比）
 *  - ProgressRing 的默认插槽
 *  - watch 监听倒计时归零，弹出提示（副作用）
 *  - onMounted 时主动 toast 一次，演示生命周期 + 全局状态配合
 */
import { computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import BaseCard from '@/components/common/BaseCard.vue'
import ProgressRing from '@/components/common/ProgressRing.vue'
import { useCountdown } from '@/composables/useCountdown'
import { useToast } from '@/composables/useToast'
import { termDate, formatDate } from '@/data/terms'

const props = defineProps({
  /** 当前节气 */
  currentTerm: { type: Object, required: true },
  /** 下一个节气 */
  nextTerm: { type: Object, required: true },
  /** 下一个节气的日期（Date 对象） */
  nextDate: { type: Date, required: true }
})

const emit = defineEmits(['finished'])

const { days, hours, minutes, seconds, isOver, formatted, start, stop } = useCountdown(
  () => props.nextDate
)

const toast = useToast()

/** 进度：从"上一个节气"走到"下一个节气"之间的百分比 */
const percent = computed(() => {
  const from = termDate(props.currentTerm).getTime()
  const to = props.nextDate.getTime()
  if (to <= from) return 100
  const now = Date.now()
  return Math.min(100, Math.max(0, ((now - from) / (to - from)) * 100))
})

const cells = computed(() => [
  { label: '天', value: days.value },
  { label: '时', value: String(hours.value).padStart(2, '0') },
  { label: '分', value: String(minutes.value).padStart(2, '0') },
  { label: '秒', value: String(seconds.value).padStart(2, '0') }
])

// 倒计时归零 → 通知父组件并提示
watch(isOver, (done) => {
  if (done) {
    emit('finished')
    toast.info(`${props.nextTerm.name} 到了！`)
  }
})

onMounted(() => {
  // 演示"组件挂载后做一件事"
  console.info(`[CountdownCard] 距离 ${props.nextTerm.name} 还有 ${formatted.value}`)
})
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <div class="countdown">
      <ProgressRing :percent="percent" :size="140" :stroke="11">
        <div class="ring-center">
          <strong>{{ days }}</strong>
          <small>天后</small>
        </div>
      </ProgressRing>

      <div class="info">
        <p class="label">距离下一个节气</p>
        <h3 class="name">
          {{ nextTerm.emoji }} {{ nextTerm.name }}
          <small>{{ nextTerm.pinyin }}</small>
        </h3>
        <p class="date">{{ formatDate(nextDate) }} · {{ nextTerm.tagline }}</p>

        <div class="clock" role="timer" aria-live="off">
          <div v-for="cell in cells" :key="cell.label" class="cell">
            <span class="value">{{ cell.value }}</span>
            <span class="unit">{{ cell.label }}</span>
          </div>
        </div>

        <div class="actions">
          <button class="mini" @click="start">▶ 继续计时</button>
          <button class="mini" @click="stop">⏸ 暂停计时</button>
          <RouterLink class="mini" :to="{ name: 'term-detail', params: { id: nextTerm.id } }">
            查看 {{ nextTerm.name }} →
          </RouterLink>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.countdown {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}
.ring-center {
  display: grid;
  line-height: 1.1;
}
.ring-center strong {
  font-size: 1.9rem;
}
.ring-center small {
  font-size: 0.7rem;
  color: var(--fg-muted);
  letter-spacing: 0.16em;
}

.info {
  flex: 1;
  min-width: 240px;
}
.label {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.24em;
  color: var(--fg-muted);
}
.name {
  margin: 4px 0 2px;
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.name small {
  font-size: 0.64rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--fg-muted);
  font-weight: 400;
}
.date {
  margin: 0 0 16px;
  font-size: 0.85rem;
  color: var(--fg-muted);
}

.clock {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.cell {
  min-width: 64px;
  padding: 10px 8px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg-soft) 70%, transparent);
  display: grid;
  place-items: center;
  gap: 2px;
}
.cell .value {
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--brand);
}
.cell .unit {
  font-size: 0.68rem;
  color: var(--fg-muted);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.mini {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--fg-muted);
  transition: all 0.2s ease;
}
.mini:hover {
  border-color: var(--brand);
  color: var(--brand);
  transform: translateY(-2px);
}
</style>