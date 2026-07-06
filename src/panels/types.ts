/**
 * 面板类型定义
 * 声明式描述每个面板的元信息，与具体业务逻辑无关
 */

import type { AsyncComponentLoader, Component } from 'vue'

export type PanelId = string
export type PanelSide = 'left' | 'right'

export interface PanelMeta {
  /** 唯一标识 */
  id: PanelId
  /** 导航或快捷入口显示名称 */
  label: string
  /** 面板标题 */
  title: string
  /** 面板副标题，用于表达数据口径或刷新频率 */
  subtitle?: string
  /** 面板所在列 */
  side: PanelSide
  /** 同一列内的排序值，越小越靠上 */
  order: number
  /** 列内高度权重，默认 1 */
  span?: number
  /** 是否默认出现在左右栏布局中，默认 true */
  defaultVisible?: boolean
  /** 图标类名，预留给导航、工具栏或二开组件使用 */
  icon?: string
  /** 异步加载的面板组件 */
  component: AsyncComponentLoader<Component>
  /** 是否缓存（keep-alive），默认 true */
  keepAlive?: boolean
  /** keep-alive 组件名，默认使用 id，需要和组件 defineOptions name 保持一致 */
  cacheName?: string
}

export interface PanelColumnMeta {
  side: PanelSide
  title: string
  subtitle?: string
}
