<template>
  <aside :class="['screen-panel-column', `screen-panel-column--${side}`]">
    <div class="screen-panel-column__heading">
      <span class="screen-panel-column__title">{{ columnMeta.title }}</span>
      <span v-if="columnMeta.subtitle" class="screen-panel-column__subtitle">
        {{ columnMeta.subtitle }}
      </span>
    </div>

    <ScreenPanel
      v-for="entry in renderedPanels"
      :key="entry.slot.id"
      :panel="entry.current"
      :can-back="panelStore.canGoBack(entry.slot.id)"
      @back="panelStore.goBack(entry.slot.id)"
    >
      <keep-alive :include="panelStore.cachedPanels">
        <component
          :is="resolvePanelComponent(entry.current)"
          :key="`${entry.slot.id}:${entry.current.id}`"
          :slot-id="entry.slot.id"
          :panel-id="entry.current.id"
        />
      </keep-alive>
    </ScreenPanel>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScreenPanel from './ScreenPanel.vue'
import { panelColumns } from '@/panels'
import type { PanelMeta, PanelSide } from '@/panels/types'
import { usePanelStore } from '@/stores/modules/panel'
import { usePanelComponent } from '@/composables/usePanelComponent'

const props = defineProps<{
  side: PanelSide
  panels: PanelMeta[]
}>()

const panelStore = usePanelStore()
const { resolvePanelComponent } = usePanelComponent()

const columnMeta = computed(() => panelColumns[props.side])
const renderedPanels = computed(() =>
  props.panels
    .map((slot) => ({
      slot,
      current: panelStore.getPanelInSlot(slot.id),
    }))
    .filter((entry): entry is { slot: PanelMeta; current: PanelMeta } => Boolean(entry.current)),
)
</script>

<style lang="less" scoped>
.screen-panel-column {
  position: relative;
  z-index: 2;
  display: flex;
  width: 430px;
  min-width: 430px;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}

.screen-panel-column__heading {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
  padding: 0 4px 0 12px;
  color: rgba(237, 255, 255, 0.92);
  border-left: 3px solid #64f0dc;

  background:
    linear-gradient(135deg, rgba(18, 52, 64, 0.84), rgba(8, 19, 27, 0.9)),
    radial-gradient(circle at 100% 0%, rgba(229, 177, 75, 0.14), transparent 36%);
}

.screen-panel-column__title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
}

.screen-panel-column__subtitle {
  color: rgba(245, 198, 86, 0.9);
  font-size: 12px;
}

.screen-panel-column--right .screen-panel-column__heading {
  border-right: 3px solid #64f0dc;
  border-left: 0;
  padding: 0 12px 0 4px;
}
</style>
