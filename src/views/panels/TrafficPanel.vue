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

    <div class="screen-progress-list">
      <div class="screen-section-title">主干道拥堵指数</div>
      <div v-for="item in roads" :key="item.name" class="screen-progress">
        <span>{{ item.name }}</span>
        <div class="screen-progress__track">
          <div class="screen-progress__bar" :style="{ '--value': `${item.value}%` }"></div>
        </div>
        <span class="screen-progress__value">{{ item.value }}%</span>
      </div>
    </div>

    <div class="screen-event-list">
      <div class="screen-section-title">交通事件</div>
      <div v-for="item in events" :key="item.text" class="screen-event">
        <span class="screen-event__level">{{ item.level }}</span>
        <span class="screen-event__text">{{ item.text }}</span>
        <span class="screen-event__time">{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'traffic' })

const metrics = [
  { label: '实时车流', value: '43,210', unit: '辆', trend: '+5.2%' },
  { label: '平均车速', value: '38.6', unit: 'km/h', trend: '-1.4%' },
]

const roads = [
  { name: '政务大道', value: 72 },
  { name: '滨河路', value: 58 },
  { name: '科创环线', value: 46 },
  { name: '中央立交', value: 81 },
]

const events = [
  { level: '提示', text: '中央立交入口排队 120 米', time: '14:18' },
  { level: '调度', text: '滨河路信号灯进入优化策略', time: '14:08' },
]
</script>
