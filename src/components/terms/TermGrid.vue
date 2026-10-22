<script setup>
/**
 * 节气卡片网格 TermGrid
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - v-for + :key 渲染列表
 *  - <TransitionGroup> 让筛选后卡片的增删有动画（需要 :key 且不能有包装元素）
 *  - 插槽：把"卡片内部的按钮行为"留给父组件决定（作用域插槽传 term）
 *  - props 校验：terms 必须是数组
 */
import TermCard from './TermCard.vue'

const props = defineProps({
  terms: { type: Array, required: true },
  /** 已收藏的 id 集合，用于把 favorite 传给每张卡片 */
  favoriteIds: { type: Array, default: () => [] },
  columns: { type: Number, default: 3 }
})

const emit = defineEmits(['toggle-favorite', 'preview'])
</script>

<template>
  <TransitionGroup
    tag="div"
    name="list"
    class="grid"
    :style="{ '--cols': columns }"
  >
    <TermCard
      v-for="term in terms"
      :key="term.id"
      :term="term"
      :favorite="favoriteIds.includes(term.id)"
      @toggle-favorite="emit('toggle-favorite', $event)"
      @preview="emit('preview', $event)"
    />
  </TransitionGroup>
</template>

<style scoped>
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 20px;
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 620px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>