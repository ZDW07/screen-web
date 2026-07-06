import { defineAsyncComponent, type Component } from 'vue'
import type { PanelId, PanelMeta } from '@/panels/types'

const panelComponentCache = new Map<PanelId, Component>()

export function usePanelComponent() {
  function resolvePanelComponent(panel: PanelMeta) {
    const cachedComponent = panelComponentCache.get(panel.id)
    if (cachedComponent) return cachedComponent

    const component = defineAsyncComponent(panel.component)
    panelComponentCache.set(panel.id, component)
    return component
  }

  return {
    resolvePanelComponent,
  }
}
