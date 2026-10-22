<script setup>
/**
 * 通用按钮 BaseButton
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - props 校验（type / variant / size / loading / disabled / block）
 *  - defineEmits 声明自定义事件，并把原生 click 事件透传出去
 *  - 具名插槽 + 插槽默认值（<slot>默认内容</slot>）
 *  - 动态 class 绑定、:disabled 属性绑定
 */
const props = defineProps({
  /** 语义类型：决定颜色 */
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'ghost', 'danger'].includes(v)
  },
  size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  /** 显示加载中，自动禁用点击 */
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** 是否占满整行 */
  block: { type: Boolean, default: false }
})

// 声明组件会发出的事件；不声明也能用，但声明后语义更清楚
const emit = defineEmits(['click'])

function handleClick(event) {
  if (props.loading || props.disabled) return
  emit('click', event)
}
</script>

<template>
  <button
    class="btn"
    :class="[`variant-${variant}`, `size-${size}`, { block, loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加个 :key 让动画在切换时重新播放 -->
    <Transition name="pop" mode="out-in">
      <span v-if="loading" key="loading" class="spinner" aria-hidden="true" />
      <span v-else key="label" class="label"><slot>按钮</slot></span>
    </Transition>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.18s ease, background-color 0.22s ease, border-color 0.22s ease,
    color 0.22s ease, box-shadow 0.22s ease;
  white-space: nowrap;
}
.btn:active:not(:disabled) {
  transform: scale(0.97);
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn.block {
  width: 100%;
}

.size-sm {
  padding: 6px 12px;
  font-size: 0.82rem;
}
.size-md {
  padding: 9px 18px;
  font-size: 0.92rem;
}
.size-lg {
  padding: 13px 26px;
  font-size: 1rem;
}

.variant-primary {
  background: var(--brand);
  color: #fff;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand) 35%, transparent);
}
.variant-primary:hover:not(:disabled) {
  filter: brightness(1.07);
  transform: translateY(-2px);
}

.variant-default {
  background: var(--surface-solid);
  border-color: var(--line);
  color: var(--fg);
}
.variant-default:hover:not(:disabled) {
  border-color: var(--brand);
  color: var(--brand);
}

.variant-ghost {
  background: transparent;
  color: var(--fg-muted);
}
.variant-ghost:hover:not(:disabled) {
  background: var(--brand-soft);
  color: var(--brand);
}

.variant-danger {
  background: transparent;
  border-color: var(--danger);
  color: var(--danger);
}
.variant-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
}

.spinner {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>