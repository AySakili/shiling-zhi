<script setup>
/**
 * 环形进度条 ProgressRing
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - computed 派生数据：由百分比算出 SVG 圆环的 dashoffset
 *  - 动态绑定 SVG 属性（:stroke-dasharray / :stroke-dashoffset）
 *  - 默认插槽：中间显示任意内容
 *  - watch 观察进度变化（这里用于演示"值改变时触发事件"）
 *
 * SVG 小知识：圆的周长 C = 2πr；把 dasharray 设成 C，
 * dashoffset 设成 C*(1-百分比)，就能画出"走了一部分的圆"。
 */
import { computed, watch } from 'vue'

const props = defineProps({
  /** 0 ~ 100 */
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 132 },
  stroke: { type: Number, default: 10 },
  color: { type: String, default: 'var(--brand)' }
})

const emit = defineEmits(['complete'])

const safePercent = computed(() => Math.min(100, Math.max(0, Number(props.percent) || 0)))

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - safePercent.value / 100))

watch(safePercent, (value) => {
  if (value >= 100) emit('complete')
})
</script>

<template>
  <div class="ring-wrap" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" role="img">
      <!-- 底环 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="var(--line)"
        :stroke-width="stroke"
      />
      <!-- 进度环：从 12 点方向开始，所以整体旋转 -90° -->
      <circle
        class="progress"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>

    <!-- 中间内容：默认插槽，没传就显示百分比 -->
    <div class="center">
      <slot>
        <strong>{{ Math.round(safePercent) }}%</strong>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.ring-wrap {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
}
.progress {
  transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 0.9rem;
}
</style>