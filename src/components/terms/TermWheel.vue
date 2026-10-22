<script setup>
/**
 * 二十四节气圆盘 TermWheel
 * ------------------------------------------------------------------
 * 全站最"炫"的组件，也是 computed 用得最重的地方：
 *  1. 用三角函数把 24 个节气平均分布到一个圆上：
 *       角度 angle = -90 + index * (360 / 24)   （-90 是为了从正上方开始）
 *       x = R * cos(angle)， y = R * sin(angle)
 *  2. 每个点的坐标由 computed 算出来，绑定到 left / top，不用手动维护
 *  3. 响应式：用 ResizeObserver 监听容器宽度，算出可用的半径 R
 *     （容器窄了就自动缩小半径，手机上也不会溢出）
 *  4. 鼠标悬停某个节气 → 中间显示它的名字、物候（ref + 事件）
 *  5. 点击 → emit('select', id)，父组件负责路由跳转
 *
 * 踩坑记录（很重要，答辩时可以讲）：
 *   最初给圆环加了 CSS 旋转动画，同时用 transform: translate(...) 定位每个点，
 *   结果动画里的 transform 覆盖了行内样式的 transform，24 个点全部叠在圆心。
 *   解决：定位改用 left/top（不用 transform），动画只加在不影响定位的装饰层上。
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { TERMS, SEASONS } from '@/data/terms'

const props = defineProps({
  /** 期望半径（px），容器不够宽时会自动变小 */
  radius: { type: Number, default: 168 },
  /** 高亮的节气 id（通常是"当前节气"） */
  activeId: { type: String, default: '' },
  centerTermId: { type: String, default: '' }
})

const emit = defineEmits(['select'])

const hoveredId = ref('')
const wrapRef = ref(null)
const boxWidth = ref(0)
let observer = null

/** 圆盘最大尺寸：半径*2 + 留出标签的空间 */
const maxSize = computed(() => props.radius * 2 + 80)

/** 真正可用的半径：取"容器宽度"和"最大尺寸"的较小值再扣掉边缘留白 */
const effRadius = computed(() => {
  const width = boxWidth.value || maxSize.value
  return Math.max(58, (Math.min(width, maxSize.value) - 80) / 2)
})

const size = computed(() => Math.round(effRadius.value * 2 + 80))

/** 小屏时把圆点也做小一点，避免相邻节气互相压住 */
const pointSize = computed(() => (effRadius.value < 120 ? 30 : effRadius.value < 150 ? 36 : 42))

/** 计算每个节气在圆周上的坐标（含它所属季节的颜色） */
const points = computed(() =>
  TERMS.map((term, index) => {
    const angle = (-90 + index * (360 / TERMS.length)) * (Math.PI / 180)
    return {
      term,
      x: Math.cos(angle) * effRadius.value,
      y: Math.sin(angle) * effRadius.value,
      color: SEASONS[term.season].color
    }
  })
)

/** 中间要展示的节气：优先"悬停的" → 其次外部指定的 → 最后取第一个 */
const focused = computed(() => {
  const id = hoveredId.value || props.activeId || props.centerTermId || TERMS[0].id
  return TERMS.find((t) => t.id === id) || TERMS[0]
})

onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !wrapRef.value) return
  observer = new ResizeObserver((entries) => {
    boxWidth.value = entries[0].contentRect.width
  })
  observer.observe(wrapRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    ref="wrapRef"
    class="wheel-wrap"
    :style="{ maxWidth: `${maxSize}px`, height: `${size}px` }"
  >
    <!-- 装饰用的同心圆（纯装饰，不参与交互） -->
    <span class="ring-deco outer" />
    <span class="ring-deco inner" />

    <!-- 24 个节气按钮：用 left/top 定位，不用 transform，避免和动画冲突 -->
    <button
      v-for="point in points"
      :key="point.term.id"
      class="point"
      :class="{ active: focused.id === point.term.id }"
      :style="{
        left: `calc(50% + ${point.x}px)`,
        top: `calc(50% + ${point.y}px)`,
        width: `${pointSize}px`,
        height: `${pointSize}px`,
        '--c': point.color
      }"
      :title="`${point.term.name} · ${point.term.tagline}`"
      :aria-label="`${point.term.name}，${point.term.tagline}`"
      @mouseenter="hoveredId = point.term.id"
      @mouseleave="hoveredId = ''"
      @focus="hoveredId = point.term.id"
      @blur="hoveredId = ''"
      @click="emit('select', point.term.id)"
    >
      <span class="emoji" aria-hidden="true">{{ point.term.emoji }}</span>
      <span class="label">{{ point.term.name }}</span>
    </button>

    <!-- 圆心信息区 -->
    <div class="center">
      <Transition name="fade" mode="out-in">
        <div :key="focused.id" class="center-inner">
          <div class="center-name">{{ focused.name }}</div>
          <div class="center-pinyin">{{ focused.pinyin }}</div>
          <div class="center-tagline">{{ focused.tagline }}</div>
          <div class="center-season">
            {{ SEASONS[focused.season].emoji }} {{ SEASONS[focused.season].full }} ·
            {{ focused.month }}月{{ focused.day }}日
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.wheel-wrap {
  position: relative;
  width: 100%;
  margin: 0 auto;
  /* 高度由 :style 根据半径动态给出，保证圆盘是正方形的 */
}

.ring-deco {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
}
.ring-deco.outer {
  width: 84%;
  height: 84%;
  border: 1px dashed var(--line);
}
.ring-deco.inner {
  width: 46%;
  height: 46%;
  border: 1px solid color-mix(in srgb, var(--brand) 22%, transparent);
}

.point {
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface-solid) 82%, transparent);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease,
    scale 0.25s ease;
}
.point:hover,
.point.active {
  border-color: var(--c);
  background: var(--surface-solid);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--c) 40%, transparent);
  scale: 1.18;
  z-index: 2;
}
.emoji {
  font-size: 1.05rem;
  line-height: 1;
}

/* 节气名：默认隐藏，悬停或选中时从圆点下方浮出来 */
.label {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 9px;
  border-radius: 999px;
  border: 1px solid var(--c);
  background: var(--surface-solid);
  font-size: 0.7rem;
  line-height: 1.6;
  letter-spacing: 0.06em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.point:hover .label,
.point.active .label {
  opacity: 1;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 42%;
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 6px;
  background: radial-gradient(
    circle at 50% 30%,
    color-mix(in srgb, var(--brand) 16%, transparent),
    transparent 70%
  );
}
.center-inner {
  display: grid;
  gap: 2px;
}
.center-name {
  font-size: clamp(1.2rem, 3.2vw, 1.8rem);
  font-weight: 700;
  letter-spacing: 0.16em;
}
.center-pinyin {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.center-tagline {
  font-family: var(--font-serif);
  font-size: clamp(0.68rem, 1.7vw, 0.84rem);
  letter-spacing: 0.08em;
}
.center-season {
  font-size: 0.66rem;
  color: var(--fg-muted);
}
</style>