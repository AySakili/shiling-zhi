/**
 * 组合式函数：把"可复用的响应式逻辑"抽出来
 * ------------------------------------------------------------------
 * 约定：名字以 use 开头，内部可以使用 ref / computed / watch / 生命周期钩子。
 * 这个 useLocalStorage 让一个 ref 自动和 localStorage 双向同步：
 *   const theme = useLocalStorage('theme', 'light')  →  theme 是可写的 ref
 */
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // 1) 读取初始值：优先用 localStorage 里存的，读不到或解析失败就用默认值
  let initial = defaultValue
  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null) initial = JSON.parse(raw)
  } catch (err) {
    console.warn(`[useLocalStorage] 读取 ${key} 失败，使用默认值`, err)
  }

  const state = ref(initial)

  // 2) 监听变化，写回 localStorage（deep 处理对象/数组）
  watch(
    state,
    (value) => {
      try {
        if (value === undefined || value === null) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (err) {
        console.warn(`[useLocalStorage] 写入 ${key} 失败`, err)
      }
    },
    { deep: true }
  )

  return state
}