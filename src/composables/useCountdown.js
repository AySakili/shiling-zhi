/**
 * 组合式函数：倒计时
 * ------------------------------------------------------------------
 * 输入一个"目标时间"（可以是 Date，也可以是返回 Date 的函数/getter），
 * 输出距离目标还剩多少天/时/分/秒。
 *
 * 这个例子集中演示了三件事：
 *   1. 组合式函数里也能用生命周期钩子（onMounted 开始计时、onUnmounted 清理定时器）
 *   2. watch 监听目标变化后重新计算（切换到别的节气时倒计时要跟着变）
 *   3. computed 派生数据：isOver、totalSeconds
 */
import { ref, computed, watch, onMounted, onUnmounted, unref } from 'vue'

/** 把各种输入统一成 Date */
function resolveTarget(target) {
  const value = typeof target === 'function' ? target() : unref(target)
  if (value instanceof Date) return value
  return new Date(value)
}

export function useCountdown(target) {
  const now = ref(Date.now())
  let timer = null

  const targetDate = computed(() => resolveTarget(target))

  const remainingMs = computed(() => Math.max(0, targetDate.value.getTime() - now.value))

  const totalSeconds = computed(() => Math.floor(remainingMs.value / 1000))
  const days = computed(() => Math.floor(totalSeconds.value / 86400))
  const hours = computed(() => Math.floor((totalSeconds.value % 86400) / 3600))
  const minutes = computed(() => Math.floor((totalSeconds.value % 3600) / 60))
  const seconds = computed(() => totalSeconds.value % 60)
  const isOver = computed(() => remainingMs.value <= 0)

  /** 补零，用于显示 08 而不是 8 */
  const pad = (n) => String(n).padStart(2, '0')

  const formatted = computed(
    () => `${days.value}天 ${pad(hours.value)}:${pad(minutes.value)}:${pad(seconds.value)}`
  )

  /** 进度：距离上一个节气到目标节气之间走了多少（0~1），给进度环用 */
  function start() {
    stop()
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  // 目标变了就刷新一次 now，让界面立刻反映新目标
  watch(targetDate, () => {
    now.value = Date.now()
  })

  onMounted(start)
  onUnmounted(stop)

  return { days, hours, minutes, seconds, formatted, isOver, totalSeconds, start, stop }
}