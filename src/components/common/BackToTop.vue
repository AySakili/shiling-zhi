<script setup>
/**
 * 回到顶部按钮
 * ------------------------------------------------------------------
 * 知识点：
 *  - 组合式 API 里操作 DOM：用模板引用 ref="btn" 拿到元素
 *  - onMounted / onUnmounted 注册和清理 scroll 监听
 *  - <Transition> 包裹 + v-if 实现"滚动到一定距离才出现"
 *  - <Teleport> 传送到 body，防止被父级定位影响
 */
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 480
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <button v-if="visible" class="to-top" title="回到顶部" @click="toTop">
        <span aria-hidden="true">↑</span>
        <span class="sr-only">回到顶部</span>
      </button>
    </Transition>
  </Teleport>
</template>

<style scoped>
.to-top {
  position: fixed;
  right: 20px;
  bottom: 24px;
  z-index: 150;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  box-shadow: var(--shadow);
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--brand);
  transition: transform 0.2s ease;
}
.to-top:hover {
  transform: translateY(-3px);
}
</style>