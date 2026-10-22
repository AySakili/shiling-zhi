<script setup>
/**
 * 过渡与动画演示 TransitionDemo
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - <Transition>：单个元素/组件的进入与离开过渡（6 个 class 的机制）
 *  - name="pop" / "fade"：对应 main.css 里定义的全局过渡类
 *  - appear：首次渲染也播放动画
 *  - <TransitionGroup>：列表的进入/离开/移动（.list-move 处理重排）
 *  - 动态 style 绑定：随机色块
 */
import { ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

let seed = 3

const showBox = ref(true)
const items = ref([
  { id: 1, text: '惊蛰 · 一雷惊蛰始', color: '#9fbf6a' },
  { id: 2, text: '芒种 · 四野皆插秧', color: '#d9b64a' },
  { id: 3, text: '霜降 · 霜叶红于二月花', color: '#a8b0bd' }
])

const PALETTE = ['#7cc07a', '#f0a6b8', '#e8c95a', '#9dc3c9', '#cbb26a', '#8fa9c4']

function addItem() {
  seed += 1
  items.value.push({
    id: seed,
    text: `新节气 · 第 ${seed} 条`,
    color: PALETTE[seed % PALETTE.length]
  })
}

function removeItem(id) {
  items.value = items.value.filter((item) => item.id !== id)
}

function shuffle() {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <h3 class="title">🎬 过渡与动画</h3>
      <p class="sub">Transition 管"单个元素"，TransitionGroup 管"列表"</p>
    </template>

    <div class="block">
      <h4>1. 单元素过渡 &lt;Transition&gt;</h4>
      <div class="stage">
        <!-- appear：首次渲染就播放；mode="out-in" 让旧元素先走再进新的 -->
        <Transition name="pop" appear>
          <div v-if="showBox" class="color-box">🎈 我来啦</div>
        </Transition>
      </div>
      <BaseButton size="sm" @click="showBox = !showBox">
        {{ showBox ? '让它消失' : '让它出现' }}
      </BaseButton>
    </div>

    <div class="block">
      <h4>2. 列表过渡 &lt;TransitionGroup&gt;</h4>
      <div class="btns">
        <BaseButton size="sm" variant="primary" @click="addItem">＋ 添加一项</BaseButton>
        <BaseButton size="sm" @click="shuffle">🔀 打乱顺序</BaseButton>
        <BaseButton size="sm" variant="danger" @click="items = []">清空</BaseButton>
      </div>

      <!-- tag="ul" 指定用 ul 包裹；.list-move 类负责"重排"动画 -->
      <TransitionGroup name="list" tag="ul" class="list">
        <li
          v-for="item in items"
          :key="item.id"
          class="list-item"
          :style="{ borderLeftColor: item.color }"
        >
          <span>{{ item.text }}</span>
          <button class="del" aria-label="删除" @click="removeItem(item.id)">✕</button>
        </li>
      </TransitionGroup>

      <p v-if="!items.length" class="empty-hint text-muted">
        列表空了 —— 点击"添加一项"看看重新进入的动画
      </p>
    </div>

    <template #footer>
      <span class="text-muted">
        过渡类名规律：<code>v-enter-from</code> → <code>v-enter-active</code> →
        <code>v-enter-to</code>，离开同理
      </span>
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
.block {
  margin-bottom: 26px;
}
h4 {
  font-size: 0.9rem;
  color: var(--fg-muted);
  font-weight: 600;
  margin: 0 0 10px;
  letter-spacing: 0.06em;
}
.stage {
  min-height: 78px;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--line);
}
.color-box {
  padding: 16px 34px;
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(120deg, #7cc07a, #3f7d4a);
  box-shadow: 0 12px 26px rgba(63, 125, 74, 0.35);
}

.btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--brand);
  background: var(--surface-solid);
  font-size: 0.88rem;
}
.del {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--fg-muted);
  font-size: 0.78rem;
}
.del:hover {
  color: var(--danger);
}
.empty-hint {
  font-size: 0.82rem;
  margin: 0;
}
</style>