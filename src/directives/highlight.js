/**
 * 自定义指令 v-highlight
 * ------------------------------------------------------------------
 * 功能：把元素文本里匹配到的关键字用 <mark class="hl"> 包起来。
 * 演示指令的参数（arg）、修饰符（modifiers）和值（value）三种用法：
 *
 *   v-highlight="keyword"                     基本用法
 *   v-highlight:whole="keyword"               参数 arg = whole（只高亮整词）
 *   v-highlight.ignore-case="keyword"         修饰符 .ignore-case 忽略大小写
 *
 * 还演示了 beforeUpdate / updated：当绑定的关键词变化时，要先把旧的还原再重新高亮。
 */
const CLASS_NAME = 'hl'

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function clearHighlight(el) {
  // 如果之前高亮过，用存起来的原始 HTML 还原
  if (el._hlOriginal !== undefined) {
    el.innerHTML = el._hlOriginal
    el._hlOriginal = undefined
  }
}

function applyHighlight(el, binding) {
  const keyword = String(binding.value ?? '').trim()
  if (!keyword) return

  // 第一次修改前，保存原始 HTML
  if (el._hlOriginal === undefined) el._hlOriginal = el.innerHTML

  const flags = binding.modifiers['ignore-case'] ? 'gi' : 'g'
  const source = escapeRegExp(keyword)
  // :whole 参数 → 加词边界
  const pattern = binding.arg === 'whole' ? `\\b(${source})\\b` : `(${source})`
  const re = new RegExp(pattern, flags)

  el.innerHTML = el._hlOriginal.replace(re, `<mark class="${CLASS_NAME}">$1</mark>`)
}

export const vHighlight = {
  mounted: applyHighlight,
  beforeUpdate: clearHighlight,
  updated: applyHighlight,
  unmounted(el) {
    clearHighlight(el)
  }
}