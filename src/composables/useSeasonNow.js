/**
 * 组合式函数：当前节气 / 下一个节气 的响应式数据
 * ------------------------------------------------------------------
 * 每 60 秒检查一次日期是否跨天，跨天就自动刷新"当前节气"，
 * 这样页面长时间开着也不会显示过期数据。
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getCurrentTerm, getNextTerm, formatDate } from '@/data/terms'

export function useSeasonNow() {
  const today = ref(new Date())

  let timer = null
  onMounted(() => {
    timer = window.setInterval(() => {
      const now = new Date()
      // 只有日期真的变了才更新，避免无意义的重新渲染
      if (now.getDate() !== today.value.getDate()) today.value = now
    }, 60000)
  })
  onUnmounted(() => timer && window.clearInterval(timer))

  const current = computed(() => getCurrentTerm(today.value))
  const next = computed(() => getNextTerm(today.value))

  const currentTerm = computed(() => current.value.term)
  const nextTerm = computed(() => next.value.term)
  const daysToNext = computed(() => next.value.diffDays)

  const currentDateText = computed(() => formatDate(current.value.date))
  const nextDateText = computed(() => formatDate(next.value.date))

  /** 节气序号文字：第 18 个节气 */
  const currentOrderText = computed(() => `第 ${currentTerm.value.order} 个节气`)

  return {
    today,
    current,
    next,
    currentTerm,
    nextTerm,
    daysToNext,
    currentDateText,
    nextDateText,
    currentOrderText
  }
}