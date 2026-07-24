<template>
  <div :class="['screen-layout', `screen-layout--${uiStore.layoutMode}`]">
    <ScreenPanelColumn side="left" :panels="panelStore.leftPanels" />
    <CenterStage>
      <!-- <testPanel /> -->
      <testUi />
      <!-- <cesiumThreeCom /> -->
    </CenterStage>
    <ScreenPanelColumn side="right" :panels="panelStore.rightPanels" />
  </div>
</template>

<script setup lang="ts">
import CenterStage from '@/components/screen/CenterStage.vue'
import ScreenPanelColumn from '@/components/screen/ScreenPanelColumn.vue'
import { usePanelStore } from '@/stores/modules/panel'
import { useUIStore } from '@/stores/modules/ui'
import cesiumThreeCom from '@/cesiumThreeCom/cesiumThreeCom.vue'
// import testPanel from '../panels/testPanel.vue'
import testUi from '@/views/panels/testUi.vue'
const panelStore = usePanelStore()
const uiStore = useUIStore()
</script>

<style lang="less" scoped>
.screen-layout {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.screen-layout--column {
  display: flex;
  gap: 20px;
  padding: 22px 28px 28px;
}

.screen-layout--overlay :deep(.screen-panel-column) {
  position: absolute;
  z-index: 3;
  top: 14px;
  bottom: 16px;
}

.screen-layout--overlay :deep(.screen-panel-column--left) {
  left: 8px;
}

.screen-layout--overlay :deep(.screen-panel-column--right) {
  right: 8px;
}

.screen-layout--overlay :deep(.center-stage) {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: 0;
  border-radius: 0;
}
</style>
