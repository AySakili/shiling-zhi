<script setup>
/**
 * 主题切换按钮
 * ------------------------------------------------------------------
 * 状态全部来自 Pinia 的 theme store：
 *   - storeToRefs 解构 isDark / mode，保持响应性
 *   - 点击时调用 store 的 action，状态一变，<html data-theme> 就跟着变
 */
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const { isDark, mode } = storeToRefs(theme)

/** 三态循环：auto → light → dark → auto */
function cycle() {
  const order = ['auto', 'light', 'dark']
  const next = order[(order.indexOf(mode.value) + 1) % order.length]
  theme.setMode(next)
}
</script>

<template>
  <!--
    :class 对象语法：isDark 为真时加 .is-dark
    :title 属性绑定；aria-pressed 是无障碍属性
  -->
  <button
    class="theme-toggle"
    :class="{ 'is-dark': isDark }"
    :title="`当前：${theme.label}，点击切换`"
    :aria-pressed="isDark"
    @click="cycle"
  >
    <span class="icon">{{ mode === 'auto' ? '🖥️' : isDark ? '🌙' : '☀️' }}</span>
    <span class="track"><span class="thumb" /></span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 6px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  cursor: pointer;
  transition: border-color 0.25s ease;
}
.theme-toggle:hover {
  border-color: var(--brand);
}
.icon {
  font-size: 1rem;
  line-height: 1;
}
.track {
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 999px;
  background: var(--brand-soft);
  transition: background-color 0.3s ease;
}
.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--brand);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.is-dark .thumb {
  transform: translateX(16px);
}
</style>