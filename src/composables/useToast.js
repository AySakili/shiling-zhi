/**
 * 组合式函数：轻量级"提示条"（Toast）
 * ------------------------------------------------------------------
 * 逻辑本体放在 Pinia store（stores/ui.js）里，这样任何组件都能共享同一份
 * 消息列表；这里只是包一层更好用的 API，属于"组合式函数 + 状态管理"的配合。
 */
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

export function useToast() {
  const ui = useUiStore()
  // storeToRefs 只把 state/getters 转成 ref，方法仍然从 store 上调用
  const { toasts } = storeToRefs(ui)

  return {
    toasts,
    toast: ui.pushToast,
    success: (msg) => ui.pushToast(msg, 'success'),
    error: (msg) => ui.pushToast(msg, 'error'),
    info: (msg) => ui.pushToast(msg, 'info'),
    dismiss: ui.removeToast
  }
}