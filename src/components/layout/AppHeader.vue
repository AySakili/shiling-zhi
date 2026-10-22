<script setup>
/**
 * 顶部导航栏
 * ------------------------------------------------------------------
 * 涉及知识点：
 *  - RouterLink：声明式导航，自动给"当前路由"加 .router-link-active 类
 *  - useRoute / useRouter：读取当前路由、编程式导航（router.push）
 *  - v-for 渲染导航项 + :key
 *  - 动态 class 绑定（:class="{ active: ... }"）
 *  - Pinia store 读取收藏数量角标
 *  - 滚动监听：滚动后给导航栏加毛玻璃背景
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import ThemeToggle from './ThemeToggle.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'
import { TERMS } from '@/data/terms'

const route = useRoute()
const router = useRouter()
const favorites = useFavoritesStore()
const ui = useUiStore()
const { mobileMenuOpen } = storeToRefs(ui)

/** 导航项配置：新增页面只要在这里加一行 */
const navItems = [
  { name: 'home', to: { name: 'home' }, label: '首页' },
  { name: 'terms', to: { name: 'terms' }, label: '节气图鉴' },
  { name: 'workshop', to: { name: 'workshop' }, label: '时令工坊' },
  { name: 'about', to: { name: 'about' }, label: '关于' }
]

const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 12)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

/** 判断某个导航项是否处于激活状态（详情页也认为"节气图鉴"是激活的） */
const isActive = (item) =>
  route.name === item.name ||
  (item.name === 'terms' && route.name === 'term-detail') ||
  (item.name === 'about' && route.path === '/about-us')

const favoriteCount = computed(() => favorites.count)

function goRandomTerm() {
  // 随机逛一个节气：演示编程式导航 router.push({ name, params })
  const term = TERMS[Math.floor(Math.random() * TERMS.length)]
  router.push({ name: 'term-detail', params: { id: term.id } })
}

function closeMenu() {
  ui.toggleMobileMenu(false)
}
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled || mobileMenuOpen }">
    <div class="container bar">
      <!-- 站点标识：点击回首页 -->
      <RouterLink :to="{ name: 'home' }" class="brand" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">🌗</span>
        <span class="brand-text">
          <strong>时令志</strong>
          <small>二十四节气</small>
        </span>
      </RouterLink>

      <!-- 桌面端导航 -->
      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item) }"
        >
          {{ item.label }}
          <span v-if="item.name === 'terms' && favoriteCount" class="badge">{{ favoriteCount }}</span>
        </RouterLink>
      </nav>

      <div class="actions">
        <button class="ghost-btn" title="随机看一个节气" @click="goRandomTerm">🎲</button>
        <ThemeToggle />

        <!-- 移动端汉堡按钮 -->
        <button
          class="ghost-btn menu-btn"
          :aria-expanded="mobileMenuOpen"
          aria-label="打开菜单"
          @click="ui.toggleMobileMenu()"
        >
          {{ mobileMenuOpen ? '✕' : '☰' }}
        </button>
      </div>
    </div>

    <!-- 移动端下拉菜单：用 Transition 做展开动画 -->
    <Transition name="fade">
      <nav v-if="mobileMenuOpen" class="mobile-nav" aria-label="移动端导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="mobile-link"
          :class="{ active: isActive(item) }"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--header-h);
  z-index: 50;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}
.site-header.is-scrolled {
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 1px 0 var(--line);
}

.bar {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.brand-mark {
  font-size: 1.5rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.brand-text strong {
  letter-spacing: 0.16em;
}
.brand-text small {
  font-size: 0.68rem;
  color: var(--fg-muted);
  letter-spacing: 0.24em;
}

.nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.nav-link {
  position: relative;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.95rem;
  color: var(--fg-muted);
  transition: color 0.25s ease, background-color 0.25s ease;
}
.nav-link:hover {
  color: var(--fg);
  background: var(--brand-soft);
}
/* 这个 .active 是我们自己加的动态 class；同时 RouterLink 也会自动加 router-link-active */
.nav-link.active {
  color: var(--brand);
  background: var(--brand-soft);
  font-weight: 600;
}

.badge {
  position: absolute;
  top: -2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent);
  color: #241f0a;
  font-size: 0.68rem;
  font-weight: 700;
  display: inline-grid;
  place-items: center;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.nav + .actions {
  margin-left: 12px;
}

.ghost-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.ghost-btn:hover {
  transform: translateY(-2px) rotate(-6deg);
  border-color: var(--brand);
}

.menu-btn {
  display: none;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 10px 20px 18px;
  background: color-mix(in srgb, var(--bg) 96%, transparent);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
}
.mobile-link {
  padding: 12px 8px;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
}
.mobile-link.active {
  color: var(--brand);
  background: var(--brand-soft);
  font-weight: 600;
}

@media (max-width: 720px) {
  .nav {
    display: none;
  }
  .menu-btn,
  .mobile-nav {
    display: flex;
  }
  .actions {
    margin-left: auto;
  }
}
</style>