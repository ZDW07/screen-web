/**
 * Panel Store —— 面板布局派生状态
 * 职责：基于注册表生成左右栏面板和缓存列表。
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cachedPanelNames, getPanelsBySide, panelMap, panels } from '@/panels'
import type { PanelId } from '@/panels/types'

export const usePanelStore = defineStore('panel', () => {
  /** 每个默认面板位独立维护一个钻取栈 */
  const panelStacks = ref<Partial<Record<PanelId, PanelId[]>>>({})

  /** keep-alive include 列表 */
  const cachedPanels = computed(() => cachedPanelNames)

  /** 左侧面板列表 */
  const leftPanels = computed(() => getPanelsBySide('left'))

  /** 右侧面板列表 */
  const rightPanels = computed(() => getPanelsBySide('right'))

  /** 获取某个面板位当前实际展示的面板 */
  function getPanelInSlot(slotId: PanelId) {
    const stack = panelStacks.value[slotId] ?? []
    const currentId = stack[stack.length - 1] ?? slotId
    return panelMap.get(currentId) ?? panelMap.get(slotId)
  }

  /** 从当前面板位切换到目标面板，并保留返回历史 */
  function switchPanel(slotId: PanelId, targetId: PanelId) {
    if (!panelMap.has(slotId) || !panelMap.has(targetId)) return

    const stack = panelStacks.value[slotId] ?? []
    const currentId = stack[stack.length - 1] ?? slotId
    if (currentId === targetId) return

    panelStacks.value = {
      ...panelStacks.value,
      [slotId]: [...stack, targetId],
    }
  }

  /** 返回当前面板位的上一个面板 */
  function goBack(slotId: PanelId) {
    const stack = panelStacks.value[slotId] ?? []
    if (stack.length === 0) return

    panelStacks.value = {
      ...panelStacks.value,
      [slotId]: stack.slice(0, -1),
    }
  }

  /** 当前面板位是否可以返回 */
  function canGoBack(slotId: PanelId) {
    return (panelStacks.value[slotId]?.length ?? 0) > 0
  }

  /** 重置某个面板位到初始面板 */
  function resetSlot(slotId: PanelId) {
    if (!panelStacks.value[slotId]) return

    const nextStacks = { ...panelStacks.value }
    delete nextStacks[slotId]
    panelStacks.value = nextStacks
  }

  return {
    cachedPanels,
    leftPanels,
    rightPanels,
    panels,
    panelStacks,
    getPanelInSlot,
    switchPanel,
    goBack,
    canGoBack,
    resetSlot,
  }
})
