/**
 * 组合式函数：节气列表的"搜索 + 筛选 + 排序"
 * ------------------------------------------------------------------
 * 图鉴页（TermsView）需要这套逻辑。把它抽成组合式函数的好处：
 *   - 逻辑与模板分离，容易测试
 *   - 以后别的页面想用同一套筛选，直接 import 即可
 *
 * 参数 source 可以是普通数组，也可以是 computed 的 ref。
 */
import { ref, computed, watch } from 'vue'
import { unref } from 'vue'
import { SEASONS } from '@/data/terms'

const SORTERS = {
  order: (a, b) => a.order - b.order,
  'order-desc': (a, b) => b.order - a.order,
  name: (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN')
}

export function useTermFilter(source) {
  const keyword = ref('')
  const season = ref('all') // all | spring | summer | autumn | winter
  const sortBy = ref('order')
  const onlyFavorites = ref(false)

  /** 过滤 + 排序后的结果，全部由 computed 派生，不额外维护一份数组 */
  const filtered = computed(() => {
    const list = unref(source) || []
    const kw = keyword.value.trim().toLowerCase()

    const result = list.filter((term) => {
      const matchSeason = season.value === 'all' || term.season === season.value
      if (!matchSeason) return false
      if (!kw) return true
      // 搜索范围：名称、拼音、物候、习俗、食材、诗句
      const haystack = [
        term.name,
        term.pinyin,
        term.tagline,
        term.intro,
        term.poem?.text,
        term.poem?.author,
        ...(term.customs || []),
        ...(term.foods || []),
        ...(term.hou || [])
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(kw)
    })

    return result.sort(SORTERS[sortBy.value] || SORTERS.order)
  })

  /** 命中数量统计：每个季节各有多少个节气（用于筛选按钮上的角标） */
  const counts = computed(() => {
    const list = unref(source) || []
    const base = { all: list.length }
    Object.keys(SEASONS).forEach((key) => {
      base[key] = list.filter((t) => t.season === key).length
    })
    return base
  })

  const isFiltering = computed(
    () => keyword.value.trim() !== '' || season.value !== 'all' || onlyFavorites.value
  )

  function reset() {
    keyword.value = ''
    season.value = 'all'
    sortBy.value = 'order'
    onlyFavorites.value = false
  }

  // 演示 watch：筛选条件变化时做点"副作用"（这里只是打印日志）
  watch([keyword, season, sortBy], ([kw, s, sort]) => {
    if (import.meta.env.DEV && (kw || s !== 'all')) {
      console.log(`[useTermFilter] 关键词="${kw}" 季节=${s} 排序=${sort}`)
    }
  })

  return { keyword, season, sortBy, onlyFavorites, filtered, counts, isFiltering, reset }
}