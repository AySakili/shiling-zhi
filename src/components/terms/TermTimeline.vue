<script setup>
/**
 * 节气时间轴 TermTimeline
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - computed 做"数据分组"：把 24 个节气按季节切成 4 段
 *  - 双层 v-for（季节 → 该季节的节气），外层 key 用季节，内层 key 用 id
 *  - 动态 class 与选中态
 *  - emit 把点击的节气 id 抛给父组件，由父组件决定跳转
 */
import { computed } from 'vue'
import { TERMS, SEASONS } from '@/data/terms'

const props = defineProps({
  /** 当前高亮的节气 id */
  activeId: { type: String, default: '' }
})

const emit = defineEmits(['select'])

/** 按节气顺序把 24 个节气分成 4 个季节组 */
const groups = computed(() =>
  Object.keys(SEASONS).map((key) => ({
    key,
    info: SEASONS[key],
    terms: TERMS.filter((t) => t.season === key).sort((a, b) => a.order - b.order)
  }))
)
</script>

<template>
  <div class="timeline">
    <section v-for="group in groups" :key="group.key" class="group">
      <header class="group-head" :style="{ color: group.info.color }">
        <span class="dot" :style="{ background: group.info.color }" />
        <h3>
          {{ group.info.emoji }} {{ group.info.full }}
          <small>{{ group.terms.length }} 个节气</small>
        </h3>
      </header>

      <ul class="nodes">
        <li v-for="term in group.terms" :key="term.id" class="node">
          <button
            class="chip"
            :class="{ active: activeId === term.id }"
            :style="{ '--c': group.info.color }"
            @click="emit('select', term.id)"
          >
            <span class="emoji">{{ term.emoji }}</span>
            <span class="name">{{ term.name }}</span>
            <span class="date">{{ term.month }}/{{ term.day }}</span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.timeline {
  display: grid;
  gap: 22px;
}
.group {
  position: relative;
  padding-left: 22px;
  border-left: 2px solid var(--line);
}
.group-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.dot {
  position: absolute;
  left: -7px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--bg);
}
.group-head h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.1em;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.group-head small {
  font-size: 0.72rem;
  color: var(--fg-muted);
  font-weight: 400;
}
.nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  cursor: pointer;
  font-size: 0.86rem;
  transition: all 0.22s ease;
}
.chip:hover {
  transform: translateY(-2px);
  border-color: var(--c);
}
.chip.active {
  background: var(--c);
  border-color: var(--c);
  color: #fff;
  font-weight: 700;
}
.chip .date {
  font-size: 0.7rem;
  opacity: 0.7;
}
</style>