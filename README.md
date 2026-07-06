# Screen Web 智慧大屏模板

一个基于 Vue 3、Vite、Pinia、Three.js 的智慧城市/智慧园区可视化大屏模板。

项目默认采用“中心主场景 + 左右业务面板覆盖”的大屏结构：中心区域适合承载 Three.js、Cesium、地图、视频墙或核心业务画布，左右两侧面板用于展示指标、告警、列表、任务、统计等业务信息。模板重点放在可维护、可配置、方便二次开发，而不是把所有业务写死在页面里。

如果这个项目对你有帮助，欢迎在 GitHub 点一个 Star。

## 功能特点

- 智慧城市类大屏布局：中心主场景在底层，左右面板覆盖在上层。
- 支持布局模式切换：`overlay` 覆盖式布局、`column` 普通三栏布局。
- 面板配置化：通过 `src/panels/index.ts` 控制面板位置、排序、高度权重和组件。
- 支持面板内钻取：某个面板可以切换到详情面板，并通过统一返回按钮回到上一层。
- 中心场景可替换：默认已接入 `cesiumThreeCom` 示例组件，可替换为 Three.js、Cesium、地图或自研可视化引擎。
- 大屏缩放适配：默认设计稿尺寸为 `1920 x 1080`。
- 架构文档完整：见 `docs/ARCHITECTURE.md`。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router
- Less
- UnoCSS
- Three.js

## 快速开始

环境要求：

- Node.js `^22.18.0` 或 `>=24.12.0`
- npm 或 pnpm

克隆项目：

```bash
git clone <your-repository-url>
cd screen-web
```

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问：

```bash
http://127.0.0.1:5173/
```

构建生产包：

```bash
npm run build
```

本地预览生产包：

```bash
npm run preview
```

## 常用脚本

```bash
npm run dev         # 启动开发服务
npm run build       # 类型检查 + 生产构建
npm run preview     # 预览生产构建
npm run lint        # 代码检查并自动修复
npm run format      # 格式化 src 目录
```

## 项目结构

```text
src/
  App.vue                         # 大屏根外壳：标题栏、时钟、全局背景
  main.ts                         # 应用入口
  router/                         # 路由
  stores/                         # Pinia 状态
  panels/                         # 面板注册表和类型
  views/home/index.vue            # 主体布局：中心场景 + 左右面板
  views/panels/                   # 示例业务面板
  components/screen/              # 大屏布局基础组件
  cesiumThreeCom/                 # 中心 Three/Cesium 场景示例
  styles/                         # 全局样式
  utils/screen.ts                 # 大屏缩放适配
docs/
  ARCHITECTURE.md                 # 架构与二开说明
```

## 面板配置

新增面板通常只需要两步。

1. 在 `src/views/panels/` 下创建业务面板组件：

```vue
<template>
  <div class="panel-stack">业务内容</div>
</template>

<script setup lang="ts">
defineOptions({ name: 'weather' })
</script>
```

2. 在 `src/panels/index.ts` 注册：

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

字段说明：

- `side`：面板所在侧，支持 `left`、`right`。
- `order`：同侧排序，数值越小越靠上。
- `span`：同侧高度权重。
- `defaultVisible`：是否默认显示。详情页、钻取页可以设为 `false`。
- `keepAlive`：是否缓存组件。

## 面板钻取与返回

模板支持在某个面板位中切换到另一个面板，例如从“安防监控”切换到“安防处置详情”：

```ts
panelStore.switchPanel(slotId, 'security-detail')
```

返回上一层：

```ts
panelStore.goBack(slotId)
```

其中 `slotId` 表示当前面板位，例如 `security`。也就是说，切换的是某个固定位置里的内容，而不是重新布局整个左右栏。

## 主体布局模式

布局模式由 `src/stores/modules/ui.ts` 控制：

```ts
const uiStore = useUIStore()

uiStore.setLayoutMode('overlay') // 中心场景铺满底层，左右面板覆盖
uiStore.setLayoutMode('column')  // 普通三栏布局
```

默认是 `overlay`，适合智慧城市/园区类大屏。

## 中心场景

中心区域由 `CenterStage.vue` 承载，默认示例为 `cesiumThreeCom.vue`。

`cesiumThreeCom` 会铺满父容器，适合接入：

- Three.js 场景
- Cesium 场景
- 地图引擎
- 视频墙
- 主业务画布

中心场景不直接影响左右面板，左右面板仍保持更高层级覆盖在上方。

## 二次开发建议

- 只调整面板顺序、左右位置：改 `src/panels/index.ts`。
- 替换业务内容：改 `src/views/panels/*.vue`。
- 替换中心场景：改 `src/cesiumThreeCom/cesiumThreeCom.vue` 或在 `CenterStage.vue` 中挂载你的组件。
- 调整左右栏宽度和覆盖层级：改 `src/components/screen/ScreenPanelColumn.vue` 和 `src/views/home/index.vue`。
- 修改整体标题栏、时钟、背景：改 `src/App.vue`。

更多说明见：

```text
docs/ARCHITECTURE.md
```

## Star

如果你正在做智慧城市、智慧园区、安防态势、IOC 指挥中心、可视化大屏模板，这个项目可以作为一个干净的起点。

觉得有用的话，欢迎 Star 支持。
