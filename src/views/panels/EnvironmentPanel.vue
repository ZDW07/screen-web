<template>
  <div class="panel-stack">
    <div class="environment-index">
      <div>
        <span>空气质量指数</span>
        <strong>42</strong>
      </div>
      <em>优</em>
    </div>

    <div class="screen-metric-grid">
      <div v-for="item in metrics" :key="item.label" class="screen-metric">
        <span class="screen-metric__label">{{ item.label }}</span>
        <strong class="screen-metric__value">
          {{ item.value }}
          <span class="screen-metric__unit">{{ item.unit }}</span>
        </strong>
      </div>
    </div>

    <div class="screen-progress-list">
      <div class="screen-section-title">监测点达标率</div>
      <div v-for="item in sites" :key="item.name" class="screen-progress">
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
defineOptions({ name: 'environment' })

const metrics = [
  { label: 'PM2.5', value: '18', unit: 'ug/m3' },
  { label: '温度', value: '27.4', unit: '°C' },
  { label: '湿度', value: '61', unit: '%' },
  { label: '噪声', value: '46', unit: 'dB' },
]

const sites = [
  { name: '河岸公园', value: 98 },
  { name: '政务片区', value: 94 },
  { name: '产业园区', value: 91 },
]
</script>

<style lang="less" scoped>
.environment-index {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 74px;
  border-bottom: 1px solid rgba(117, 210, 202, 0.14);

  span {
    display: block;
    color: rgba(227, 252, 250, 0.62);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #64f0dc;
    font-size: 38px;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  em {
    display: grid;
    width: 54px;
    height: 54px;
    place-items: center;
    border: 1px solid rgba(73, 214, 143, 0.42);
    border-radius: 50%;
    color: #49d68f;
    font-style: normal;
    font-size: 22px;
    box-shadow: inset 0 0 20px rgba(73, 214, 143, 0.12);
  }
}
</style>
