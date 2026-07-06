/**
 * 键盘遥控 composable
 * F 切换沉浸模式，Esc 退出沉浸模式。
 */

import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/modules/ui'

export function useKeyboard() {
  const uiStore = useUIStore()

  function handler(e: KeyboardEvent) {
    // 输入框内不拦截
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key) {
      case 'Escape':
        if (uiStore.fullscreen) uiStore.toggleFullscreen()
        break
      case 'f':
      case 'F':
        uiStore.toggleFullscreen()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}
