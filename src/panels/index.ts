/**
 * 面板注册表
 * 新增或调整面板优先改这里，布局组件会按 side/order 自动渲染。
 */

import type { PanelColumnMeta, PanelMeta, PanelSide } from './types'

export const panelColumns: Record<PanelSide, PanelColumnMeta> = {
  left: {
    side: 'left',
    title: '城市运行',
    subtitle: '基础态势',
  },
  right: {
    side: 'right',
    title: '治理协同',
    subtitle: '事件与资源',
  },
}

export const panels: PanelMeta[] = [
  {
    id: 'overview',
    label: '总览',
    title: '运行总览',
    subtitle: '实时汇总',
    side: 'right',
    order: 10,
    span: 1,
    component: () => import('@/views/panels/OverviewPanel.vue'),
    keepAlive: true,
  },

  // {
  //   id: 'traffic',
  //   label: '交通态势',
  //   title: '交通态势',
  //   subtitle: '路网监测',
  //   side: 'left',
  //   order: 20,
  //   span: 3,
  //   component: () => import('@/views/panels/TrafficPanel.vue'),
  //   keepAlive: true,
  // },
  {
    id: 'environment',
    label: '环境监测',
    title: '环境监测',
    subtitle: '空气与气象',
    side: 'left',
    order: 30,
    span: 0.92,
    component: () => import('@/views/panels/testUi.vue'),
    keepAlive: true,
  },
  // {
  //   id: 'security',
  //   label: '安防监控',
  //   title: '安防监控',
  //   subtitle: '告警闭环',
  //   side: 'left',
  //   order: 10,
  //   span: 3,
  //   component: () => import('@/views/panels/SecurityPanel.vue'),
  //   keepAlive: false, // 视频流需要每次重新挂载
  // },
  {
    id: 'security-detail',
    label: '安防详情',
    title: '安防处置详情',
    subtitle: '事件钻取',
    side: 'right',
    order: 11,
    span: 1.1,
    defaultVisible: false,
    component: () => import('@/views/panels/SecurityDetailPanel.vue'),
    keepAlive: false,
  },
  {
    id: 'energy',
    label: '能耗管理',
    title: '能耗管理',
    subtitle: '今日消耗',
    side: 'right',
    order: 20,
    span: 1,
    component: () => import('@/views/panels/EnergyPanel.vue'),
    keepAlive: true,
  },
]

/** 按 ID 索引 */
export const panelMap = new Map(panels.map((p) => [p.id, p]))

/** 按左右列取面板，供布局组件直接消费 */
export function getPanelsBySide(side: PanelSide) {
  return panels
    .filter((panel) => panel.side === side && panel.defaultVisible !== false)
    .sort((a, b) => a.order - b.order)
}

/** keep-alive include 列表 */
export const cachedPanelNames = panels
  .filter((panel) => panel.keepAlive !== false)
  .map((panel) => panel.cacheName ?? panel.id)

/** 默认面板 */
export const DEFAULT_PANEL_ID = panels[0]?.id ?? 'overview'
