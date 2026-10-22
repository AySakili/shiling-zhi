<script setup>
/**
 * 通用弹窗 BaseModal
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - 组件上的 v-model：defineModel() 会自动生成 modelValue prop + update:modelValue 事件
 *  - <Teleport to="body">：弹窗渲染到 body 下，不受父元素层叠上下文影响
 *  - <Transition>：遮罩淡入 + 弹窗从下方滑入（用 appear 让首次也播放）
 *  - 具名插槽 header / default / footer
 *  - watch + onUnmounted：打开时锁定 body 滚动，关闭/卸载时恢复
 *  - 键盘事件：Esc 关闭（@keydown.esc）
 */
import { watch, onUnmounted } from 'vue'

const open = defineModel({ type: Boolean, default: false })

const props = defineProps({
  title: { type: String, default: '提示' },
  /** 点击遮罩是否关闭 */
  maskClosable: { type: Boolean, default: true },
  width: { type: String, default: '520px' }
})

const emit = defineEmits(['open', 'close'])

// 记录打开前的 overflow，关闭时还原
let previousOverflow = ''

watch(open, (value) => {
  emit(value ? 'open' : 'close')
  if (typeof document === 'undefined') return
  if (value) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousOverflow
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = previousOverflow
})

function close() {
  open.value = false
}

function onMaskClick() {
  if (props.maskClosable) close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade" appear>
      <div
        v-if="open"
        class="mask"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click.self="onMaskClick"
        @keydown.esc="close"
      >
        <Transition name="pop" appear>
          <div class="modal" :style="{ width: props.width }">
            <header class="modal-head">
              <slot name="header">
                <h3>{{ title }}</h3>
              </slot>
              <button class="close" aria-label="关闭" @click="close">✕</button>
            </header>

            <div class="modal-body">
              <slot />
            </div>

            <footer class="modal-foot">
              <slot name="footer">
                <button class="default-btn" @click="close">知道了</button>
              </slot>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(18, 22, 26, 0.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 20px;
}
.modal {
  max-width: 100%;
  max-height: 86vh;
  overflow: auto;
  background: var(--surface-solid);
  border-radius: var(--radius);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-lg);
  padding: 22px;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.modal-head h3 {
  margin: 0;
  font-size: 1.1rem;
}
.close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--fg-muted);
  font-size: 0.95rem;
}
.close:hover {
  color: var(--danger);
}
.modal-foot {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.default-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--brand);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}
</style>