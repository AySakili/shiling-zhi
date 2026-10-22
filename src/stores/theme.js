/**
 * Pinia Store：主题（浅色 / 深色 / 跟随系统）
 * ------------------------------------------------------------------
 * 这里用的是"Setup Store"写法：defineStore 的第二个参数传一个函数，
 * 在函数里用 ref / computed / function 定义 state / getters / actions，
 * 和写组合式函数几乎一样。
 *   state   → ref()
 *   getters → computed()
 *   actions → function()
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useThemeStore = defineStore('theme', () => {
  // ---------- state ----------
  // 用 useLocalStorage 让用户的选择在刷新后依然保留
  const mode = useLocalStorage('shiling:theme', 'auto') // 'light' | 'dark' | 'auto'
  const systemDark = ref(false)

  // 监听系统主题（媒体查询）
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    mq.addEventListener('change', (e) => {
      systemDark.value = e.matches
    })
  }

  // ---------- getters ----------
  /** 最终生效的到底是深色还是浅色 */
  const isDark = computed(() => (mode.value === 'auto' ? systemDark.value : mode.value === 'dark'))
  const label = computed(() =>
    mode.value === 'auto' ? '跟随系统' : mode.value === 'dark' ? '深色' : '浅色'
  )

  // ---------- actions ----------
  function toggle() {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  function setMode(value) {
    mode.value = value
  }

  /** 把结果写到 <html data-theme="...">，CSS 变量由它切换 */
  function applyToDocument() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  }

  // state 一变就应用（watch 的 immediate 让首次渲染前也生效）
  watch(isDark, applyToDocument, { immediate: true })

  return { mode, systemDark, isDark, label, toggle, setMode }
})