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

    <div class="energy-ratio">
      <span>清洁能源占比</span>
      <strong>37.8%</strong>
      <div class="energy-ratio__track">
        <div class="energy-ratio__bar"></div>
      </div>
    </div>

    <div class="screen-progress-list">
      <div class="screen-section-title">分项消耗</div>
      <div v-for="item in categories" :key="item.name" class="screen-progress">
        <span>{{ item.name }}</span>
        <div class="screen-progress__track">
          <div class="screen-progress__bar" :style="{ '--value': `${item.value}%` }"></div>
        </div>
        <span class="screen-progress__value">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'energy' })

const metrics = [
  { label: '用电量', value: '82.6', unit: 'MWh', trend: '-3.2%' },
  { label: '用水量', value: '3,420', unit: 'm3', trend: '+1.6%' },
  { label: '碳排估算', value: '41.8', unit: 't', trend: '-4.1%' },
  { label: '峰值负载', value: '68.4', unit: '%', trend: '+2.2%' },
]

const categories = [
  { name: '公共照明', value: 32 },
  { name: '办公楼宇', value: 46 },
  { name: '交通设施', value: 28 },
]
</script>

<style lang="less" scoped>
.energy-ratio {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  color: rgba(227, 252, 250, 0.68);
  font-size: 12px;
}

.energy-ratio strong {
  color: #e5b14b;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}

.energy-ratio__track {
  grid-column: 1 / -1;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 203, 199, 0.12);
}

.energy-ratio__bar {
  width: 37.8%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e5b14b, #64f0dc);
}
</style>
