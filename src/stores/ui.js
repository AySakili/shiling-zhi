/**
 * Pinia Store：全局 UI 状态（提示条 Toast）
 * ------------------------------------------------------------------
 * Toast 需要"在任何地方都能被调用、但只在 App.vue 里渲染一次"，
 * 这正是全局状态管理的典型场景。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

let seed = 0

export const useUiStore = defineStore('ui', () => {
  // ---------- state ----------
  const toasts = ref([]) // [{ id, message, type, timer }]
  const mobileMenuOpen = ref(false)

  // ---------- getters ----------
  const hasToasts = computed(() => toasts.value.length > 0)

  // ---------- actions ----------
  /**
   * 新增一条提示
   * @param {string} message 文本
   * @param {'success'|'error'|'info'} type 类型
   * @param {number} duration 自动消失时间（毫秒），0 表示不自动消失
   */
  function pushToast(message, type = 'info', duration = 2600) {
    const id = ++seed
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      window.setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
  }

  function clearToasts() {
    toasts.value = []
  }

  function toggleMobileMenu(value) {
    mobileMenuOpen.value = typeof value === 'boolean' ? value : !mobileMenuOpen.value
  }

  return { toasts, mobileMenuOpen, hasToasts, pushToast, removeToast, clearToasts, toggleMobileMenu }
})