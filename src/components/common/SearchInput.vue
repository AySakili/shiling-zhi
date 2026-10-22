<script setup>
/**
 * 搜索框 SearchInput
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - defineModel 实现组件 v-model（父组件写 v-model="keyword"）
 *  - watch + 防抖（debounce）：输入停止 300ms 后才对外 emit
 *  - onUnmounted 清理定时器，避免组件销毁后回调还在跑
 *  - 透传 attrs：placeholder 等属性直接写在使用处即可
 */
import { ref, watch, onUnmounted } from 'vue'

const keyword = defineModel({ type: String, default: '' })

const props = defineProps({
  /** 防抖延迟（毫秒） */
  delay: { type: Number, default: 300 },
  placeholder: { type: String, default: '搜索…' }
})

const emit = defineEmits(['search', 'clear'])

const inputRef = ref(null)
let timer = null

watch(keyword, (value) => {
  // 每次输入都清掉上一次的定时器 —— 这就是防抖的核心
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    emit('search', value)
  }, props.delay)
})

onUnmounted(() => timer && window.clearTimeout(timer))

function clear() {
  keyword.value = ''
  emit('clear')
  inputRef.value?.focus()
}

/** 暴露一个方法给父组件：父组件用 ref 调用 focus() */
defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>

<template>
  <div class="search">
    <span class="icon" aria-hidden="true">🔍</span>
    <input
      ref="inputRef"
      v-model.trim="keyword"
      type="search"
      class="input"
      :placeholder="placeholder"
      autocomplete="off"
    />
    <!-- v-if + Transition：有内容才显示清除按钮 -->
    <Transition name="pop">
      <button v-if="keyword" class="clear" aria-label="清空" @click="clear">✕</button>
    </Transition>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  transition: border-color 0.22s ease, box-shadow 0.22s ease;
}
.search:focus-within {
  border-color: var(--brand);
  box-shadow: 0 0 0 4px var(--brand-soft);
}
.icon {
  font-size: 0.95rem;
  opacity: 0.7;
}
.input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--fg);
}
/* 隐藏原生 search 的清空按钮，用我们自己的 */
.input::-webkit-search-cancel-button {
  display: none;
}
.clear {
  border: none;
  background: var(--line);
  color: var(--fg);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.7rem;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.clear:hover {
  background: var(--danger);
  color: #fff;
}
</style>