/**
 * 自定义指令 v-reveal
 * ------------------------------------------------------------------
 * 指令的钩子函数（和组件的生命周期类似）：
 *   created / beforeMount / mounted / beforeUpdate / updated / beforeUnmount / unmounted
 *
 * 功能：元素滚动进入视口时淡入浮现。
 * 用法：<div v-reveal>…</div>
 *       <div v-reveal="{ delay: 120, once: false, threshold: 0.2 }">
 *
 * 实现要点（这三层兜底是踩过坑之后加的）：
 *   1. 优先用 IntersectionObserver 监听元素是否进入视口；
 *   2. 但要先"立即检查一次"元素当前是否已经在视口里 —— 首屏内容不应该等观察器回调，
 *      否则首屏会短暂空白（在无头浏览器截图、低性能设备上尤其明显）；
 *   3. 再加一个延时兜底：万一某些环境下观察器没有回调，只要元素确实在视口范围内就显示出来。
 *      宁可少一个动画，也不能让内容看不见。
 *   4. unmounted 时断开观察、清掉定时器，避免内存泄漏。
 */
export const vReveal = {
  mounted(el, binding) {
    const { delay = 0, once = true, threshold = 0.16 } = binding.value || {}
    el.classList.add('reveal')

    let shown = false
    /** 显示元素（delay 用于让多个元素错开出现） */
    const show = () => {
      if (shown) return
      shown = true
      if (el._revealTimer) {
        window.clearTimeout(el._revealTimer)
        el._revealTimer = null
      }
      window.setTimeout(() => el.classList.add('is-visible'), delay)
    }

    // 兜底 1：环境不支持 IntersectionObserver，直接显示，保证内容可见（渐进增强）
    if (typeof IntersectionObserver === 'undefined') {
      show()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show()
            if (once) observer.unobserve(el)
          } else if (!once) {
            shown = false
            el.classList.remove('is-visible')
          }
        })
      },
      { threshold }
    )
    observer.observe(el)
    // 把 observer 存到元素上，unmounted 时才能断开
    el._revealObserver = observer

    // 兜底 2：已经在视口里的（首屏）立即显示，不等观察器回调
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewportH && rect.bottom > 0) {
      show()
    }

    // 兜底 3：延时兜底，防止观察器在个别环境下不回调
    el._revealTimer = window.setTimeout(() => {
      const r = el.getBoundingClientRect()
      const h = window.innerHeight || document.documentElement.clientHeight
      if (r.top < h * 1.3 && r.bottom > -80) show()
    }, 3000)
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
    if (el._revealTimer) {
      window.clearTimeout(el._revealTimer)
      delete el._revealTimer
    }
  }
}