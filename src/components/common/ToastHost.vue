<script setup>
/**
 * 提示条容器（Toast Host）
 * ------------------------------------------------------------------
 * 知识点：
 *  - <Teleport to="body">：把组件渲染到 DOM 树的其它位置（这里是 body），
 *    避免被父元素的 overflow / transform 影响层级
 *  - <TransitionGroup>：给"列表的增删"做动画，需要每一项有唯一的 :key
 *  - 数据来自 Pinia 的 ui store，任何组件调用 toast() 都会在这里显示
 */
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const { toasts } = storeToRefs(ui)

const ICONS = { success: '✅', error: '⚠️', info: '💡' }
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" aria-live="polite">
      <TransitionGroup name="list" tag="div" class="toast-list">
        <div v-for="item in toasts" :key="item.id" class="toast" :class="`is-${item.type}`">
          <span class="icon">{{ ICONS[item.type] || '💡' }}</span>
          <span class="msg">{{ item.message }}</span>
          <button class="close" aria-label="关闭" @click="ui.removeToast(item.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  z-index: 200;
  right: 20px;
  bottom: 92px;
  pointer-events: none;
}
.toast-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}
.toast {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 220px;
  max-width: 340px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  box-shadow: var(--shadow-lg);
  font-size: 0.9rem;
}
.toast.is-success {
  border-left: 4px solid #3f9e6a;
}
.toast.is-error {
  border-left: 4px solid var(--danger);
}
.toast.is-info {
  border-left: 4px solid var(--accent);
}
.msg {
  flex: 1;
}
.close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--fg-muted);
  font-size: 0.8rem;
}
.close:hover {
  color: var(--danger);
}

@media (max-width: 520px) {
  .toast-host {
    right: 12px;
    left: 12px;
    bottom: 84px;
  }
  .toast-list {
    align-items: stretch;
  }
  .toast {
    max-width: none;
  }
}
</style>