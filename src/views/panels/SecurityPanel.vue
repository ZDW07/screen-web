<template>
  <div class="panel-stack">
    <div class="screen-metric-grid">
      <div v-for="item in metrics" :key="item.label" class="screen-metric">
        <span class="screen-metric__label">{{ item.label }}</span>
        <strong class="screen-metric__value">
          {{ item.value }}
          <span class="screen-metric__unit">{{ item.unit }}</span>
          <span class="screen-metric__trend">{{ item.trend }}</span>
        </strong>
      </div>
    </div>

    <div class="screen-event-list security-events">
      <div class="screen-section-title">实时告警</div>
      <div v-for="item in alerts" :key="item.text" class="screen-event">
        <span class="screen-event__level">{{ item.level }}</span>
        <span class="screen-event__text">{{ item.text }}</span>
        <span class="screen-event__time">{{ item.time }}</span>
      </div>
    </div>

    <div class="security-summary">
      <div v-for="item in summary" :key="item.label" class="security-summary__item">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>

    <button class="security-drilldown" type="button" @click="openDetail">查看处置详情</button>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from '@/stores/modules/panel'
import type { PanelId } from '@/panels/types'
import gsap from 'gsap'
defineOptions({ name: 'security' })

const props = defineProps<{
  slotId?: PanelId
}>()

const panelStore = usePanelStore()

const metrics = [
  { label: '在线摄像头', value: '1,286', unit: '路', trend: '99.1%' },
  { label: '待处置告警', value: '18', unit: '件', trend: '-12%' },
]

const alerts = [
  { level: '高', text: '市民中心北门人流密度偏高', time: '14:21' },
  { level: '中', text: '地铁口周边发现异常滞留', time: '14:16' },
  { level: '低', text: '河岸巡检点位离线恢复', time: '14:03' },
]

const summary = [
  { label: '已派单', value: '12' },
  { label: '处理中', value: '5' },
  { label: '已关闭', value: '31' },
]

function openDetail() {
  if (!props.slotId) return
  panelStore.switchPanel(props.slotId, 'test')
}
</script>

<style lang="less" scoped>
.security-events {
  flex: 1;
}

.security-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding-top: 4px;
}

.security-summary__item {
  min-width: 0;
  border-top: 1px solid rgba(117, 210, 202, 0.18);
  padding-top: 10px;

  span {
    display: block;
    color: rgba(227, 252, 250, 0.62);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #efffff;
    font-size: 22px;
    font-variant-numeric: tabular-nums;
  }
}

.security-drilldown {
  width: 100%;
  height: 34px;
  border: 1px solid rgba(100, 240, 220, 0.34);
  border-radius: 4px;
  color: #efffff;
  cursor: pointer;
  background: linear-gradient(90deg, rgba(37, 124, 126, 0.42), rgba(73, 214, 143, 0.18));
  font-size: 13px;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: rgba(100, 240, 220, 0.78);
    background: linear-gradient(90deg, rgba(37, 124, 126, 0.62), rgba(73, 214, 143, 0.26));
  }
}
</style>
