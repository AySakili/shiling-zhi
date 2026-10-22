<script setup>
/**
 * 根组件 App.vue
 * ------------------------------------------------------------------
 * 它是整个应用的"外壳"，负责：
 *   1. 顶部导航 + 页脚
 *   2. <RouterView> 显示当前路由匹配到的页面
 *   3. <Transition> + <KeepAlive> 给页面切换加动画、并缓存指定页面
 *   4. 全局只渲染一次的 <ToastHost>（提示条容器）
 */
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import BackToTop from '@/components/common/BackToTop.vue'

const route = useRoute()

/** 页面切换动画的名字：详情页从右侧滑入，其它页面淡入 */
const transitionName = computed(() => (route.name === 'term-detail' ? 'page' : 'fade'))

/**
 * KeepAlive 缓存白名单：只有"节气图鉴"会被缓存。
 * 效果：先去图鉴页搜索/筛选，跳到详情页再返回，筛选条件还在（组件没有被销毁）。
 */
const keepAliveInclude = ['TermsView']
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <!--
        RouterView 的插槽写法可以拿到当前匹配到的组件和路由对象；
        外层包 Transition 做过渡、内层包 KeepAlive 做缓存。
      -->
      <RouterView v-slot="{ Component, route: current }">
        <Transition :name="transitionName" mode="out-in">
          <KeepAlive :include="keepAliveInclude">
            <component :is="Component" :key="current.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>

    <AppFooter />

    <!-- Teleport 到 body 的全局层：提示条 + 回到顶部按钮 -->
    <ToastHost />
    <BackToTop />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: var(--header-h);
}
</style>