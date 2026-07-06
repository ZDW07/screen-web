<template>
  <section class="screen-panel" :style="panelStyle">
    <header class="screen-panel__header">
      <div class="screen-panel__title-group">
        <span class="screen-panel__label">{{ panel.label }}</span>
        <h2 class="screen-panel__title">{{ panel.title }}</h2>
      </div>
      <div class="screen-panel__tools">
        <span v-if="panel.subtitle" class="screen-panel__subtitle">{{ panel.subtitle }}</span>
        <button
          v-if="canBack"
          class="screen-panel__back"
          type="button"
          title="返回上一个面板"
          aria-label="返回上一个面板"
          @click="$emit('back')"
        >
          ‹
        </button>
      </div>
    </header>

    <div class="screen-panel__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PanelMeta } from '@/panels/types'

const props = defineProps<{
  panel: PanelMeta
  canBack?: boolean
}>()

defineEmits<{
  back: []
}>()

const panelStyle = computed(() => ({
  '--panel-span': props.panel.span ?? 1,
}))
</script>

<style lang="less" scoped>
.screen-panel {
  --panel-border: rgba(88, 204, 214, 0.34);
  --panel-glow: rgba(47, 173, 161, 0.16);

  position: relative;
  display: flex;
  flex: var(--panel-span) 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--panel-border);
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(18, 52, 64, 0.84), rgba(8, 19, 27, 0.9)),
    radial-gradient(circle at 100% 0%, rgba(229, 177, 75, 0.14), transparent 36%);
  box-shadow:
    inset 0 0 28px rgba(36, 203, 217, 0.08),
    0 14px 36px rgba(0, 0, 0, 0.18);
}

.screen-panel::before,
.screen-panel::after {
  position: absolute;
  top: -1px;
  width: 28px;
  height: 2px;
  content: '';
  background: #64f0dc;
  box-shadow: 0 0 14px var(--panel-glow);
}

.screen-panel::before {
  left: 14px;
}

.screen-panel::after {
  right: 14px;
}

.screen-panel__header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(117, 210, 202, 0.16);
  background: linear-gradient(90deg, rgba(23, 105, 116, 0.28), rgba(7, 19, 26, 0));
}

.screen-panel__title-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.screen-panel__label {
  color: rgba(151, 233, 226, 0.68);
  font-size: 12px;
  line-height: 1;
}

.screen-panel__title {
  overflow: hidden;
  color: #efffff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.screen-panel__subtitle {
  flex: 0 0 auto;
  color: #e5b14b;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.screen-panel__tools {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
}

.screen-panel__back {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 1px solid rgba(100, 240, 220, 0.34);
  border-radius: 4px;
  color: #efffff;
  cursor: pointer;
  background: rgba(22, 85, 92, 0.48);
  font-size: 24px;
  line-height: 1;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(100, 240, 220, 0.76);
    background: rgba(37, 124, 126, 0.68);
    transform: translateX(-1px);
  }
}

.screen-panel__content {
  min-height: 0;
  flex: 1;
  padding: 14px 16px 16px;
}
</style>
