/**
 * Pinia Store：我的收藏（节气）
 * ------------------------------------------------------------------
 * 演示"跨页面共享状态"：在图鉴页点收藏，回到首页 / 详情页看到的收藏状态是一致的。
 * 数据同时写入 localStorage，刷新不丢。
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { TERM_MAP } from '@/data/terms'

export const useFavoritesStore = defineStore('favorites', () => {
  // ---------- state ----------
  const ids = useLocalStorage('shiling:favorites', [])

  // ---------- getters ----------
  const count = computed(() => ids.value.length)
  /** 收藏的节气对象列表（按节气顺序排好） */
  const list = computed(() =>
    ids.value
      .map((id) => TERM_MAP[id])
      .filter(Boolean)
      .sort((a, b) => a.order - b.order)
  )
  /** 用函数返回 getter：isFavorite('lichun') */
  const isFavorite = computed(() => (id) => ids.value.includes(id))

  // ---------- actions ----------
  function toggle(id) {
    const index = ids.value.indexOf(id)
    if (index > -1) {
      ids.value.splice(index, 1)
      return false // 取消收藏
    }
    ids.value.push(id)
    return true // 添加收藏
  }

  function add(id) {
    if (!ids.value.includes(id)) ids.value.push(id)
  }

  function remove(id) {
    const index = ids.value.indexOf(id)
    if (index > -1) ids.value.splice(index, 1)
  }

  function clear() {
    ids.value = []
  }

  return { ids, count, list, isFavorite, toggle, add, remove, clear }
})