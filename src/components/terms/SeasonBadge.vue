<script setup>
/**
 * 季节徽章 SeasonBadge
 * ------------------------------------------------------------------
 * 小到只有十几行，但把"props + computed + 动态 style"三件事说清楚了：
 * 颜色不是写死的 class，而是从数据里的 SEASONS 取出来绑到 style 上。
 */
import { computed } from 'vue'
import { SEASONS } from '@/data/terms'

const props = defineProps({
  season: { type: String, required: true },
  /** 显示成"春"还是"春季" */
  full: { type: Boolean, default: false }
})

const info = computed(() => SEASONS[props.season] || { name: '未知', color: 'var(--fg-muted)' })
const text = computed(() => (props.full ? info.value.full : info.value.name))
</script>

<template>
  <span
    class="badge"
    :style="{
      color: info.color,
      borderColor: `color-mix(in srgb, ${info.color} 45%, transparent)`,
      background: `color-mix(in srgb, ${info.color} 12%, transparent)`
    }"
  >
    <span aria-hidden="true">{{ info.emoji }}</span>{{ text }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
</style>