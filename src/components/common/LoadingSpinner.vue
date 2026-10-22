<script setup>
/**
 * 加载指示器 LoadingSpinner
 * ------------------------------------------------------------------
 * 最简单的组件之一：只有 props + 模板 + 样式。
 * 演示：props 默认值、动态 style 绑定（用 size 控制尺寸）。
 */
const props = defineProps({
  size: { type: Number, default: 32 },
  label: { type: String, default: '加载中…' },
  /** 是否显示文字 */
  showLabel: { type: Boolean, default: true }
})

const style = () => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderWidth: `${Math.max(2, Math.round(props.size / 12))}px`
})
</script>

<template>
  <div class="spinner-wrap" role="status">
    <span class="ring" :style="style()" />
    <span v-if="showLabel" class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px;
  color: var(--fg-muted);
  font-size: 0.85rem;
}
.ring {
  border-radius: 50%;
  border-style: solid;
  border-color: var(--brand-soft);
  border-top-color: var(--brand);
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>