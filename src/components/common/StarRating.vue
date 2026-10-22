<script setup>
/**
 * 星级评分 StarRating
 * ------------------------------------------------------------------
 * 这是"组件 v-model"的经典例子：父组件写 <StarRating v-model="score" />
 * 内部用 defineModel 拿到可写的 model，改它就会触发父组件更新。
 *
 * 另外演示：
 *  - computed getter/setter（把 model 包装成更好用的形式）
 *  - Props 校验、只读模式
 *  - emits 额外事件（change）
 *  - 鼠标悬停高亮（hoverIndex）
 */
import { computed, ref } from 'vue'

const model = defineModel({ type: Number, default: 0 })

const props = defineProps({
  max: { type: Number, default: 5 },
  readonly: { type: Boolean, default: false },
  size: { type: Number, default: 22 }
})

const emit = defineEmits(['change'])

const hoverIndex = ref(0)

/** 当前应该点亮几颗星：优先用悬停值，没有悬停就用 model 值 */
const displayValue = computed(() => hoverIndex.value || model.value)

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function setScore(value) {
  if (props.readonly) return
  model.value = value === model.value ? 0 : value // 再点一次同样的分数就清零
  emit('change', model.value)
}
</script>

<template>
  <div class="rating" :class="{ readonly }" :style="{ fontSize: `${size}px` }">
    <button
      v-for="star in stars"
      :key="star"
      class="star"
      :class="{ on: star <= displayValue }"
      :disabled="readonly"
      :aria-label="`${star} 星`"
      @click="setScore(star)"
      @mouseenter="!readonly && (hoverIndex = star)"
      @mouseleave="hoverIndex = 0"
    >
      ★
    </button>
    <span class="value">{{ model }} / {{ max }}</span>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.star {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  color: var(--line);
  transition: transform 0.16s ease, color 0.16s ease;
}
.star.on {
  color: var(--accent);
  text-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 45%, transparent);
}
.star:hover:not(:disabled) {
  transform: scale(1.18) rotate(-6deg);
}
.rating.readonly .star {
  cursor: default;
}
.value {
  margin-left: 8px;
  font-size: 0.42em;
  color: var(--fg-muted);
}
</style>