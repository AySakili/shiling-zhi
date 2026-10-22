<script setup>
/**
 * 时令知识小测 QuizGame
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - ref 管理游戏状态（当前题号、得分、选择、是否已答）
 *  - computed 派生：当前题目、正确率、进度百分比、是否结束
 *  - watch 监听答题结果，答对自动跳下一题（延迟执行）
 *  - <Transition mode="out-in"> 做题目切换动画
 *  - emit 把最终得分抛给父组件
 *  - 通过 v-for 渲染选项，并用 :disabled 控制已答后不能再点
 */
import { computed, onUnmounted, ref, watch } from 'vue'
import { QUIZ } from '@/data/quiz'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ProgressRing from '@/components/common/ProgressRing.vue'

const props = defineProps({
  /** 题目数量上限 */
  limit: { type: Number, default: 6 }
})

const emit = defineEmits(['finished'])

const questions = ref(QUIZ.slice(0, props.limit))
const index = ref(0)
const score = ref(0)
const picked = ref(null)
const answered = ref(false)
const done = ref(false)
let nextTimer = null

const current = computed(() => questions.value[index.value])
const total = computed(() => questions.value.length)
const progress = computed(() => (index.value / total.value) * 100)
const accuracy = computed(() =>
  index.value === 0 ? 0 : Math.round((score.value / index.value) * 100)
)
const isCorrect = computed(() => answered.value && picked.value === current.value.answer)

function pick(optionIndex) {
  if (answered.value) return
  picked.value = optionIndex
  answered.value = true
  if (optionIndex === current.value.answer) score.value++
}

/** 自动进入下一题：答完 1.2 秒后跳转 */
watch(answered, (value) => {
  if (!value) return
  nextTimer = window.setTimeout(next, 1200)
})

function next() {
  if (nextTimer) window.clearTimeout(nextTimer)
  if (index.value >= total.value - 1) {
    done.value = true
    emit('finished', { score: score.value, total: total.value })
    return
  }
  index.value++
  picked.value = null
  answered.value = false
}

function restart() {
  index.value = 0
  score.value = 0
  picked.value = null
  answered.value = false
  done.value = false
  // 重新洗牌题目顺序，让第二次玩不一样
  questions.value = [...QUIZ].sort(() => Math.random() - 0.5).slice(0, props.limit)
}

onUnmounted(() => nextTimer && window.clearTimeout(nextTimer))
</script>

<template>
  <BaseCard padding="lg" hoverable>
    <template #header>
      <div class="head">
        <div>
          <h3 class="title">🎯 时令知识小测</h3>
          <p class="sub">共 {{ total }} 题 · 答完自动进入下一题</p>
        </div>
        <ProgressRing :percent="progress" :size="56" :stroke="6">
          <small>{{ index + 1 }}/{{ total }}</small>
        </ProgressRing>
      </div>
    </template>

    <!-- ============ 答题区 ============ -->
    <Transition name="fade" mode="out-in">
      <div v-if="!done" :key="index" class="quiz">
        <p class="question">
          <span class="no">Q{{ index + 1 }}</span>
          {{ current.q }}
        </p>

        <ul class="options">
          <li v-for="(option, i) in current.options" :key="option">
            <button
              class="option"
              :class="{
                picked: picked === i,
                right: answered && i === current.answer,
                wrong: answered && picked === i && i !== current.answer
              }"
              :disabled="answered"
              @click="pick(i)"
            >
              <span class="letter">{{ 'ABCD'[i] }}</span>
              {{ option }}
            </button>
          </li>
        </ul>

        <!-- 答题后显示解析 -->
        <Transition name="fade">
          <p v-if="answered" class="tip" :class="{ ok: isCorrect }">
            {{ isCorrect ? '✅ 答对了！' : '❌ 答错了。' }}{{ current.tip }}
          </p>
        </Transition>
      </div>

      <!-- ============ 结算区 ============ -->
      <div v-else key="done" class="result">
        <div class="score">{{ score }} / {{ total }}</div>
        <p class="level">
          {{
            accuracy >= 90
              ? '🏆 节气达人！'
              : accuracy >= 60
                ? '👍 不错，再复习一下就更稳了'
                : '📖 还需努力，去图鉴补补课吧'
          }}
        </p>
        <p class="text-muted">本轮正确率：{{ Math.round((score / total) * 100) }}%</p>
        <BaseButton variant="primary" @click="restart">再来一轮</BaseButton>
      </div>
    </Transition>

    <template #footer>
      <span class="score-live">当前得分：<strong>{{ score }}</strong></span>
      <span class="text-muted">正确率 {{ accuracy }}%</span>
      <button class="skip" :disabled="answered || done" @click="next">跳过这题 →</button>
    </template>
  </BaseCard>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.title {
  margin: 0 0 4px;
  font-size: 1.05rem;
}
.sub {
  margin: 0;
  font-size: 0.84rem;
  color: var(--fg-muted);
}

.question {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 6px 0 18px;
  line-height: 1.7;
}
.no {
  display: inline-block;
  margin-right: 8px;
  padding: 1px 9px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 0.78rem;
}

.options {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface-solid);
  cursor: pointer;
  text-align: left;
  font-size: 0.92rem;
  transition: all 0.22s ease;
}
.option:hover:not(:disabled) {
  border-color: var(--brand);
  transform: translateX(4px);
}
.option:disabled {
  cursor: default;
}
.letter {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  background: var(--line);
  display: grid;
  place-items: center;
  font-size: 0.74rem;
  font-weight: 700;
}
.option.right {
  border-color: #3f9e6a;
  background: color-mix(in srgb, #3f9e6a 14%, transparent);
}
.option.right .letter {
  background: #3f9e6a;
  color: #fff;
}
.option.wrong {
  border-color: var(--danger);
  background: color-mix(in srgb, var(--danger) 12%, transparent);
}
.option.wrong .letter {
  background: var(--danger);
  color: #fff;
}

.tip {
  margin: 16px 0 0;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.86rem;
  background: color-mix(in srgb, var(--danger) 10%, transparent);
}
.tip.ok {
  background: color-mix(in srgb, #3f9e6a 12%, transparent);
}

.result {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 20px 0;
  text-align: center;
}
.score {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--brand);
  font-variant-numeric: tabular-nums;
}
.level {
  font-size: 1.05rem;
  margin: 0;
}

.score-live {
  font-size: 0.84rem;
  color: var(--fg-muted);
}
.skip {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
  font-size: 0.84rem;
}
.skip:disabled {
  color: var(--fg-muted);
  cursor: not-allowed;
}
</style>