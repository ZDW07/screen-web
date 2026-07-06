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

    <div class="overview-health">
      <div class="overview-health__score">96<span>%</span></div>
      <div class="overview-health__content">
        <span>综合运行指数</span>
        <strong>平稳</strong>
        <p>人、车、物、事件总体处于可控区间</p>
      </div>
    </div>

    <div class="screen-progress-list">
      <div class="screen-section-title">区域负载</div>
      <div v-for="item in districts" :key="item.name" class="screen-progress">
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
defineOptions({ name: 'overview' })

const metrics = [
  { label: '接入点位', value: '12,486', unit: '个', trend: '+8.4%' },
  { label: '在线设备', value: '9,728', unit: '台', trend: '+3.1%' },
  { label: '今日事件', value: '248', unit: '件', trend: '-6.8%' },
  { label: '处置效率', value: '92.6', unit: '%', trend: '+2.5%' },
]

const districts = [
  { name: '东部片区', value: 86 },
  { name: '西部片区', value: 74 },
  { name: '南部片区', value: 68 },
]
</script>

<style lang="less" scoped>
.overview-health {
  display: grid;
  grid-template-columns: 106px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-height: 92px;
  padding: 8px 0;
}

.overview-health__score {
  color: #64f0dc;
  font-size: 42px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-shadow: 0 0 18px rgba(100, 240, 220, 0.34);

  span {
    margin-left: 2px;
    font-size: 16px;
  }
}

.overview-health__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;

  span {
    color: rgba(227, 252, 250, 0.64);
    font-size: 12px;
  }

  strong {
    color: #49d68f;
    font-size: 20px;
  }

  p {
    overflow: hidden;
    color: rgba(227, 252, 250, 0.66);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
