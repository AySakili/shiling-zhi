<script setup>
/**
 * 空状态 EmptyState
 * ------------------------------------------------------------------
 * 演示：插槽的"后备内容"（父组件不传 action 插槽时就显示默认按钮）、
 * 以及 Scoped Slot（作用域插槽）——把内部数据交给父组件使用。
 */
const props = defineProps({
  icon: { type: String, default: '🍃' },
  title: { type: String, default: '这里空空如也' },
  description: { type: String, default: '' }
})

const emit = defineEmits(['action'])

/** 作用域插槽要暴露给父组件的数据 */
const slotProps = { suggestion: '试试换个关键词，或者点击"全部"看看所有节气' }
</script>

<template>
  <div class="empty">
    <div class="icon" aria-hidden="true">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p v-if="description" class="text-muted">{{ description }}</p>

    <!-- 作用域插槽：把 slotProps 传给父组件 -->
    <slot name="action" v-bind="slotProps">
      <button class="default-action" @click="emit('action')">重置筛选</button>
    </slot>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 54px 20px;
  text-align: center;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--bg-soft) 55%, transparent);
}
.icon {
  font-size: 2.6rem;
  animation: float 3.4s ease-in-out infinite;
}
h3 {
  margin: 6px 0 0;
  font-size: 1.05rem;
}
p {
  max-width: 40ch;
  font-size: 0.88rem;
}
.default-action {
  margin-top: 10px;
  padding: 8px 20px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  cursor: pointer;
  font-weight: 600;
}
.default-action:hover {
  border-color: var(--brand);
  color: var(--brand);
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>