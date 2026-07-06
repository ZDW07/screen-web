/**
 * UI Store —— 全局 UI 状态
 * 职责：沉浸模式、时钟
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ScreenLayoutMode = 'overlay' | 'column'

export const useUIStore = defineStore('ui', () => {
  /** 是否沉浸模式（隐藏顶部标题栏） */
  const fullscreen = ref(false)

  /** 大屏主体布局模式：overlay 为中心底层、左右覆盖；column 为普通三栏 */
  const layoutMode = ref<ScreenLayoutMode>('column')

  /** 当前时间 */
  const now = ref(new Date())

  /** 格式化时间 */
  const formattedTime = computed(() => {
    const d = now.value
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  })

  let clockTimer: ReturnType<typeof setInterval> | null = null

  function startClock() {
    if (clockTimer) return
    now.value = new Date()
    clockTimer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stopClock() {
    if (clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }

  function toggleFullscreen() {
    fullscreen.value = !fullscreen.value
  }

  function setLayoutMode(mode: ScreenLayoutMode) {
    layoutMode.value = mode
  }

  function toggleLayoutMode() {
    layoutMode.value = layoutMode.value === 'overlay' ? 'column' : 'overlay'
  }

  return {
    fullscreen,
    layoutMode,
    now,
    formattedTime,
    startClock,
    stopClock,
    toggleFullscreen,
    setLayoutMode,
    toggleLayoutMode,
  }
})
