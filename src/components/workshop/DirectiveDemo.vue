<script setup>
/**
 * 自定义指令演示 DirectiveDemo
 * ------------------------------------------------------------------
 * 演示两个已经全局注册的指令：
 *   v-highlight            把匹配的文本高亮（mounted / beforeUpdate / updated）
 *   v-highlight:whole      只匹配整词（参数 arg）
 *   v-highlight.ignore-case 忽略大小写（修饰符 modifier）
 *   v-reveal               滚动进入视口时淡入（IntersectionObserver）
 *
 * 另外演示"局部注册指令"：在 <script setup> 里用 vXxx 命名一个对象即可。
 */
import { ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { TERMS } from '@/data/terms'

const keyword = ref('春')
const ignoreCase = ref(true)
const useWhole = ref(false)
const showBoxes = ref(true)

const demoText = TERMS.slice(0, 6)
  .map((t) => `${t.name}：${t.tagline}`)
  .join('；')

/** 局部自定义指令：v-uppercase 把元素文字变成大写（演示最简单的生命周期） */
const vUppercase = {
  mounted(el) {
    el.textContent = el.textContent.toUpperCase()
  }
}

/** 局部指令：v-focus 挂载后自动聚焦（经典用例） */
const vFocus = {
  mounted(el) {
    el.focus()
  }
}

const localInput = ref('')

const code = `<p v-highlight${useWhole ? ':whole' : ''}${ignoreCase ? '.ignore-case' : ''}="keyword">
  {{ demoText }}
</p>`
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <h3 class="title">✨ 自定义指令 v-highlight / v-reveal</h3>
      <p class="sub">指令适合做"直接操作 DOM"的底层逻辑，比如高亮、聚焦、懒加载</p>
    </template>

    <div class="controls">
      <label class="field">
        高亮关键词
        <input v-model="keyword" v-focus type="text" />
      </label>

      <label class="check">
        <input v-model="ignoreCase" type="checkbox" />
        忽略大小写（修饰符 .ignore-case）
      </label>

      <label class="check">
        <input v-model="useWhole" type="checkbox" />
        只匹配整词（参数 :whole）
      </label>

      <BaseButton size="sm" variant="ghost" @click="showBoxes = !showBoxes">
        {{ showBoxes ? '隐藏' : '显示' }}演示区
      </BaseButton>
    </div>

    <Transition name="fade">
      <div v-if="showBoxes" class="demo">
        <!--
          注意：v-highlight 会修改元素的 innerHTML，
          所以里面不要放"有状态的子组件"，纯文本最安全。
          一个元素上只能写一个同名指令，所以这里用两个 <p> 对比不同写法。
        -->
        <p v-highlight.ignore-case="keyword" class="target">{{ demoText }}</p>
        <p v-highlight:whole="keyword" class="target sub">
          :whole 参数 —— {{ demoText }}
        </p>

        <div class="local">
          <span v-uppercase>局部指令 v-uppercase → hello shiling</span>
          <input v-model="localInput" v-focus placeholder="这个输入框被 v-focus 自动聚焦了" />
        </div>
      </div>
    </Transition>

    <!-- v-reveal：往下滚动时才会出现 -->
    <div class="reveal-boxes">
      <div v-for="i in 3" :key="i" class="box" v-reveal="{ delay: i * 150 }">
        第 {{ i }} 块 · 滚动到才出现
      </div>
    </div>

    <template #footer>
      <pre class="code">{{ code }}</pre>
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
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--fg-muted);
}
.field input {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  color: var(--fg);
  outline: none;
}
.field input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--fg-muted);
}
.check input {
  accent-color: var(--brand);
}
.demo {
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--line);
  background: color-mix(in srgb, var(--bg-soft) 60%, transparent);
}
.target {
  font-size: 0.92rem;
  line-height: 2;
  margin: 0 0 10px;
}
.target.sub {
  color: var(--fg-muted);
  margin-bottom: 14px;
}
.local {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: var(--fg-muted);
}
.local input {
  flex: 1;
  min-width: 180px;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  color: var(--fg);
}

.reveal-boxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
}
.box {
  padding: 18px 12px;
  text-align: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  font-size: 0.82rem;
  color: var(--fg-muted);
}

.code {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--fg-muted);
}
</style>