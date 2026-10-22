<script setup>
/**
 * 异步组件演示 AsyncFactCard
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - defineAsyncComponent：把"动态 import"包装成组件，只有在真正渲染时才下载代码
 *      · loadingComponent  加载中显示的组件
 *      · delay             多久之后才显示 loading（避免闪烁）
 *      · errorComponent    加载失败显示的组件
 *  - <Suspense>：等待"异步组件 / 顶层 await"完成，期间显示 #fallback
 *  - :key 强制重建组件（点"再抽一条"就换 key → 组件重新走一遍加载流程）
 *  - defineAsyncComponent 与 Suspense 的关系：异步组件默认是 suspensible 的，
 *    父级有 Suspense 时，加载状态由 Suspense 的 fallback 接管。
 */
import { defineAsyncComponent, h, ref, computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

/**
 * 加载中占位组件。
 * 注意：这里用 h() 写渲染函数，而不是写 template 字符串 ——
 * 因为 Vite 默认使用"运行时版"的 Vue，它不包含模板编译器，
 * 运行时传 template 会报 "Template compilation is not supported"。
 */
const LoadingBox = {
  name: 'LoadingBox',
  setup() {
    return () => h(LoadingSpinner, { label: '正在向后端请求节气冷知识…', size: 26 })
  }
}

/** 加载失败占位 */
const ErrorBox = {
  name: 'ErrorBox',
  props: ['error'],
  setup(props) {
    return () =>
      h(
        'p',
        { style: 'color:var(--danger);font-size:.86rem' },
        `加载失败：${props.error?.message || '未知错误'}`
      )
  }
}

// 关键：动态 import —— 打包后 AsyncFactContent 会是一个独立的 chunk
const AsyncFactContent = defineAsyncComponent({
  loader: () => import('./AsyncFactContent.vue'),
  loadingComponent: LoadingBox,
  errorComponent: ErrorBox,
  delay: 200,
  timeout: 8000
})

const reloadKey = ref(0)

/** 点击"再抽一条"：改变 key，让异步组件重新挂载（重新请求） */
function refresh() {
  reloadKey.value += 1
}

const chunkTip = computed(() =>
  import.meta.env.DEV
    ? '开发环境下可以直接看到浏览器 Network 里的按需加载'
    : '打包后它是一个独立的 .js 文件，用到时才下载'
)
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <h3 class="title">⏳ 异步组件 + Suspense</h3>
      <p class="sub">这段内容 900ms 后才"返回"，加载期间由 Suspense 负责显示占位</p>
    </template>

    <!-- Suspense：default 是真正内容，fallback 是等待期间显示的内容 -->
    <Suspense>
      <AsyncFactContent :key="reloadKey" />

      <template #fallback>
        <div class="fallback">
          <LoadingSpinner label="加载中…（Suspense fallback）" :size="30" />
        </div>
      </template>
    </Suspense>

    <p class="note text-muted">{{ chunkTip }}</p>

    <template #footer>
      <BaseButton variant="primary" size="sm" @click="refresh">🎲 再抽一条</BaseButton>
      <BaseButton variant="ghost" size="sm" @click="reloadKey = 0">重置</BaseButton>
      <span class="text-muted">当前 key：{{ reloadKey }}</span>
    </template>
  </BaseCard>
</template>

<style scoped>
.title {
  margin: 0 0 4px;
  font-size: 1.05rem;
}
.sub {
  margin: 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.fallback {
  display: grid;
  place-items: center;
  min-height: 110px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--line);
}
.note {
  margin: 12px 0 0;
  font-size: 0.78rem;
}
</style>