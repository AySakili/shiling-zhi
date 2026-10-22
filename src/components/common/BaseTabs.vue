<script setup>
/**
 * 通用标签页 BaseTabs
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - 组件 v-model（defineModel）控制当前选中的 tab
 *  - 动态具名插槽：<slot :name="tab.key"> —— 用变量决定插槽名，
 *    父组件写 <template #hou> ... </template> 就能填进来
 *  - 键盘无障碍：左右方向键切换
 *  - <Transition> 给面板内容做淡入
 */
import { computed } from 'vue'

const active = defineModel({ type: String, default: '' })

const props = defineProps({
  /** [{ key, label, icon? }] */
  tabs: { type: Array, required: true }
})

const emit = defineEmits(['change'])

const activeTab = computed(() => props.tabs.find((t) => t.key === active.value) || props.tabs[0])

function select(key) {
  if (active.value === key) return
  active.value = key
  emit('change', key)
}

function move(step) {
  const index = props.tabs.findIndex((t) => t.key === active.value)
  const next = (index + step + props.tabs.length) % props.tabs.length
  select(props.tabs[next].key)
}
</script>

<template>
  <div class="tabs">
    <div class="tab-bar" role="tablist" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        role="tab"
        :aria-selected="active === tab.key"
        :class="{ active: active === tab.key }"
        @click="select(tab.key)"
      >
        <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
      <!-- 滑块：跟随选中项移动（用 style 绑定 translateX） -->
      <span
        class="slider"
        :style="{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${tabs.findIndex((t) => t.key === active) * 100}%)`
        }"
      />
    </div>

    <div class="tab-panel" role="tabpanel">
      <Transition name="fade" mode="out-in">
        <div :key="active" class="panel-inner">
          <!-- 动态插槽名：父组件用 #hou / #customs 等填内容 -->
          <slot :name="active">
            {{ activeTab?.emptyText || '暂无内容' }}
          </slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--line);
  margin-bottom: 18px;
  overflow: hidden;
}
.tab {
  flex: 1;
  padding: 11px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--fg-muted);
  font-size: 0.92rem;
  transition: color 0.25s ease;
}
.tab.active {
  color: var(--brand);
  font-weight: 700;
}
.tab-icon {
  margin-right: 4px;
}
.slider {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--brand);
  border-radius: 2px;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-inner {
  min-height: 60px;
}
</style>