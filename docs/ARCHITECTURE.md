# 大屏模板架构说明

## 设计目标

本项目定位为通用大屏模板，默认采用“左侧业务面板 + 中心主视口预留 + 右侧业务面板”的智慧城市类布局。中心区域默认留空，仅保留网格、边框和光效，方便后续接入地图、三维场景、视频墙或核心业务图表。

模板代码按“布局外壳”和“业务面板”拆分，二次开发时优先改配置和面板组件，避免改动入口、路由、缩放等基础设施。

## 目录职责

```text
src/
  App.vue                         # 大屏根外壳：标题栏、时钟、整体背景、主体容器
  views/home/index.vue            # 三栏布局编排：左栏、中心预留区、右栏
  components/screen/
    ScreenPanelColumn.vue         # 左右面板列，按配置批量渲染面板
    ScreenPanel.vue               # 单个面板通用边框、标题和内容插槽
    CenterStage.vue               # 中心主视口预留区
  panels/
    index.ts                      # 面板注册表，控制左右分组、排序、高度权重和异步组件
    types.ts                      # 面板配置类型
  views/panels/                   # 具体业务面板示例，可替换为项目业务组件
  stores/modules/
    panel.ts                      # 面板派生状态：左栏、右栏、缓存列表等
    ui.ts                         # 全局 UI 状态：时钟、沉浸模式、过渡名称
  styles/index.less               # 全局基础样式和面板内部通用展示类
  utils/screen.ts                 # 1920x1080 大屏缩放适配
```

## 渲染链路

1. `App.vue` 创建 1920x1080 的大屏画布，并通过 `window.setScale(1920, 1080)` 适配浏览器窗口。
2. 路由 `/` 加载 `views/home/index.vue`。
3. `home/index.vue` 从 `usePanelStore()` 读取 `leftPanels` 和 `rightPanels`。
4. `ScreenPanelColumn.vue` 遍历面板配置，使用 `ScreenPanel.vue` 包裹业务内容。
5. `usePanelComponent.ts` 对异步面板组件做缓存，避免重复创建动态组件。
6. `CenterStage.vue` 作为底层主场景铺在主体区域，后续业务可在这里接入地图或主画布。

## 新增业务面板

1. 在 `src/views/panels/` 下新增面板组件，并设置组件名：

```vue
<script setup lang="ts">
defineOptions({ name: 'weather' })
</script>
```

2. 在 `src/panels/index.ts` 的 `panels` 数组中追加配置：

```ts
{
  id: 'weather',
  label: '气象服务',
  title: '气象服务',
  subtitle: '实时监测',
  side: 'right',
  order: 30,
  span: 1,
  component: () => import('@/views/panels/WeatherPanel.vue'),
  keepAlive: true,
}
```

关键字段说明：

- `side`：控制面板进入左栏或右栏，可选 `left`、`right`。
- `order`：同一列中的排序，数值越小越靠上。
- `span`：列内高度权重，适合让重点面板更高。
- `keepAlive`：控制异步组件是否缓存。视频流、实时连接类面板建议设为 `false`。
- `cacheName`：默认使用 `id`，只有当组件 `name` 和 `id` 不一致时才需要配置。

## 面板切换与返回

模板支持“某个面板位临时切换到另一个面板，再返回上一个面板”。实现位置在 `src/stores/modules/panel.ts`：

- `switchPanel(slotId, targetId)`：把目标面板压入当前面板位的历史栈。
- `goBack(slotId)`：弹出当前面板位的栈顶，回到上一个面板。
- `canGoBack(slotId)`：控制标题栏返回按钮是否显示。
- `resetSlot(slotId)`：直接重置某个面板位到初始面板。

`slotId` 是默认布局里的面板 ID，例如右侧默认的 `security`。目标面板可以是默认不展示的隐藏面板：

```ts
{
  id: 'security-detail',
  label: '安防详情',
  title: '安防处置详情',
  side: 'right',
  order: 11,
  span: 1.1,
  defaultVisible: false,
  component: () => import('@/views/panels/SecurityDetailPanel.vue'),
}
```

业务面板会收到 `slotId`，可以在组件里触发切换：

```ts
const props = defineProps<{ slotId?: PanelId }>()
const panelStore = usePanelStore()

function openDetail() {
  if (!props.slotId) return
  panelStore.switchPanel(props.slotId, 'security-detail')
}
```

返回按钮由 `ScreenPanel.vue` 统一渲染，不需要每个业务面板单独写返回 UI。

## 中心区域二开

中心区域由 `src/components/screen/CenterStage.vue` 提供。默认不放业务文案，作为底层主视口铺在主体区域。

常见接入方式：

- 地图：在 `CenterStage.vue` 的 `.center-stage__slot` 中挂载地图容器。
- 三维场景：将 Three.js、Cesium 或其他渲染画布放到 slot 容器内。
- 核心图表：保留中心背景，增加一个绝对定位的主图表组件。

如果中心业务复杂，建议新增 `src/views/center/` 目录，把地图、弹窗、图层控制拆成独立组件，再由 `CenterStage.vue` 引入。

## 主体布局模式

首页默认使用 `overlay` 布局，也就是“中心主场景在底层，左右面板覆盖在上层”的结构，接近智慧园区、智慧城市、安防态势类大屏：

- `CenterStage.vue`：`z-index: 1`，绝对定位铺满主体区域，用作地图、三维场景或主画布。
- `ScreenPanelColumn.vue`：`z-index: 3`，左右绝对定位固定在主体区域两侧。
- 左右面板自身使用半透明背景，不需要通过快捷键切换透明状态。
- 若要调整左右栏距离、宽度或层级，优先修改 `src/views/home/index.vue` 和 `src/components/screen/ScreenPanelColumn.vue`。

布局模式由 `src/stores/modules/ui.ts` 控制：

```ts
const uiStore = useUIStore()

uiStore.setLayoutMode('overlay') // 中心底层铺满，左右面板覆盖
uiStore.setLayoutMode('column')  // 普通左右中三栏，中心只占中间区域
```

也可以临时切换：

```ts
uiStore.toggleLayoutMode()
```

默认值在 `ui.ts` 中维护：

```ts
const layoutMode = ref<ScreenLayoutMode>('overlay')
```

## 样式约定

- 单个面板外壳统一由 `ScreenPanel.vue` 管理，业务面板只写内部内容。
- 面板内部可复用 `styles/index.less` 中的通用类：`panel-stack`、`screen-metric-grid`、`screen-progress-list`、`screen-event-list` 等。
- 大屏固定设计稿尺寸为 `1920x1080`，不要在业务组件里直接读取浏览器宽高做布局。
- 左右栏宽度在 `ScreenPanelColumn.vue` 中统一维护，中心区作为底层主场景铺满主体区域。

## 推荐二开边界

优先修改：

- `src/panels/index.ts`：调整面板数量、左右位置、标题、排序。
- `src/views/panels/*.vue`：替换业务展示内容。
- `src/components/screen/CenterStage.vue`：接入地图、三维或主图。

谨慎修改：

- `src/utils/screen.ts`：只在设计稿尺寸变化时调整。
- `src/App.vue`：只在标题栏、背景、全局状态展示变化时调整。
- `src/stores/modules/panel.ts`：只有需要新增全局面板行为时再改。
