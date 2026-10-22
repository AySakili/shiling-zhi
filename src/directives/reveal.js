/**
 * 自定义指令 v-reveal
 * ------------------------------------------------------------------
 * 指令的钩子函数（和组件生命周期类似）：
 *   created / beforeMount / mounted / beforeUpdate / updated / beforeUnmount / unmounted
 * 这里用 IntersectionObserver 监听元素是否进入视口，进入后加上 .is-visible 类，
 * 配合 main.css 里的 .reveal 过渡，做出"滚动到才浮现"的动画效果。
 *
 * 用法：<div v-reveal>...</div>   或   <div v-reveal="{ delay: 120, once: false }">
 */
export const vReveal = {
  mounted(el, binding) {
    const { delay = 0, once = true, threshold = 0.16 } = binding.value || {}
    el.classList.add('reveal')

    // 不支持 IntersectionObserver 的环境直接显示，保证内容可见（渐进增强）
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const show = () => {
      window.setTimeout(() => el.classList.add('is-visible'), delay)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show()
            if (once) observer.unobserve(el)
          } else if (!once) {
            el.classList.remove('is-visible')
          }
        })
      },
      { threshold }
    )

    observer.observe(el)
    // 把 observer 存到元素上，unmounted 时才能断开，避免内存泄漏
    el._revealObserver = observer
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
  }
}