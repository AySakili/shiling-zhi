<script setup>
/**
 * 通用卡片容器 BaseCard
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - defineProps：声明 props 并给出默认值、类型校验
 *  - 具名插槽（header / default / footer / media）
 *  - 透传 attribute：没有声明成 props 的属性（class、id、@click…）会自动
 *    落到组件根元素上（这就是"属性继承"）。这里用 inheritAttrs: false +
 *    v-bind="$attrs" 手动指定落到 .card 上，方便外部加样式。
 */
import { useAttrs } from 'vue'

defineOptions({
  // 关闭自动继承，改为手动绑定到根元素（更可控）
  inheritAttrs: false
})

const props = defineProps({
  /** 卡片标题 */
  title: { type: String, default: '' },
  /** 副标题 */
  subtitle: { type: String, default: '' },
  /** 鼠标悬停时轻微上浮 */
  hoverable: { type: Boolean, default: false },
  /** 内边距尺寸 */
  padding: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
  /** 是否显示边框 */
  bordered: { type: Boolean, default: true }
})

const attrs = useAttrs()

/** 用 computed 拼 class，比在模板里堆三元表达式更清晰 */
const classes = () => [
  'card',
  `pad-${props.padding}`,
  { hoverable: props.hoverable, bordered: props.bordered }
]
</script>

<template>
  <div class="card-wrap">
    <div :class="classes()" v-bind="attrs">
      <!-- 顶部：优先用外部传入的 header 插槽，没传就用 title/subtitle -->
      <header v-if="$slots.header || title || subtitle" class="card-head">
        <slot name="header">
          <h3 v-if="title" class="title">{{ title }}</h3>
          <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        </slot>
      </header>

      <div class="card-body">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="card-foot">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(8px);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
  overflow: hidden;
}
.card.bordered {
  border: 1px solid var(--line);
}
.card.hoverable:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}
.pad-sm {
  padding: 14px;
}
.pad-md {
  padding: 20px;
}
.pad-lg {
  padding: 30px;
}

.card-head {
  margin-bottom: 12px;
}
.title {
  font-size: 1.05rem;
  margin: 0 0 4px;
  letter-spacing: 0.02em;
}
.subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--fg-muted);
}
.card-foot {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>