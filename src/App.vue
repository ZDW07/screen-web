<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUIStore } from '@/stores/modules/ui'
import { useKeyboard } from '@/composables/useKeyboard'

const uiStore = useUIStore()

// 键盘遥控：F 切换沉浸模式，Esc 退出沉浸模式
useKeyboard()

onMounted(() => {
  window.setScale(1920, 1080)
  uiStore.startClock()
})

onUnmounted(() => {
  uiStore.stopClock()
})
</script>

<template>
  <div id="mainBox" :class="{ 'is-immersive': uiStore.fullscreen }">
    <header v-if="!uiStore.fullscreen" class="screen-header">
      <div class="screen-header__status">
        <span class="screen-header__status-dot"></span>
        <span>城市运行在线</span>
      </div>

      <h1 class="screen-title">智慧城市可视化大屏模板</h1>

      <time class="screen-clock">{{ uiStore.formattedTime }}</time>
    </header>

    <div class="screen-body">
      <RouterView />
    </div>
  </div>
</template>

<style lang="less">
#mainBox {
  width: 1920px;
  height: 1080px;
  background:
    radial-gradient(circle at 16% 18%, rgba(39, 182, 151, 0.16), transparent 26%),
    radial-gradient(circle at 82% 22%, rgba(229, 177, 75, 0.12), transparent 24%),
    linear-gradient(180deg, #061018 0%, #071a22 46%, #03080d 100%);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family:
    'Microsoft YaHei',
    'PingFang SC',
    Arial,
    sans-serif;
}

.screen-header {
  position: relative;
  display: flex;
  flex: 0 0 84px;
  justify-content: space-between;
  align-items: center;
  padding: 0 34px;
  background:
    linear-gradient(90deg, rgba(100, 240, 220, 0.08), transparent 28%),
    linear-gradient(270deg, rgba(229, 177, 75, 0.08), transparent 28%),
    rgba(3, 13, 20, 0.76);
  border-bottom: 1px solid rgba(93, 213, 205, 0.22);
}

.screen-header::before {
  position: absolute;
  right: 480px;
  bottom: -1px;
  left: 480px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, transparent, #64f0dc, transparent);
  box-shadow: 0 0 20px rgba(100, 240, 220, 0.45);
}

.screen-header__status,
.screen-clock {
  width: 300px;
  color: rgba(227, 252, 250, 0.78);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.screen-header__status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.screen-header__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #49d68f;
  box-shadow: 0 0 12px rgba(73, 214, 143, 0.84);
}

.screen-title {
  flex: 1;
  color: #efffff;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 6px;
  line-height: 1;
  margin: 0;
  text-align: center;
  text-shadow:
    0 0 18px rgba(100, 240, 220, 0.36),
    0 2px 0 rgba(0, 0, 0, 0.38);
}

.screen-clock {
  text-align: right;
}

.screen-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  padding: 0;
}

#mainBox.is-immersive .screen-body {
  padding-top: 0;
}
</style>
