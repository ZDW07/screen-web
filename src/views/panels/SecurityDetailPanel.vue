<template>
  <div class="panel-stack">
    <div class="detail-header">
      <span>当前事件</span>
      <strong>市民中心北门人流密度偏高</strong>
      <p>已自动关联周边 4 路视频、2 名巡检人员和 1 条广播策略。</p>
    </div>

    <div class="screen-progress-list">
      <div class="screen-section-title">处置进度</div>
      <div v-for="item in steps" :key="item.name" class="screen-progress">
        <span>{{ item.name }}</span>
        <div class="screen-progress__track">
          <div class="screen-progress__bar" :style="{ '--value': `${item.value}%` }"></div>
        </div>
        <span class="screen-progress__value">{{ item.value }}%</span>
      </div>
    </div>

    <div class="screen-event-list">
      <div class="screen-section-title">联动记录</div>
      <div v-for="item in records" :key="item.text" class="screen-event">
        <span class="screen-event__level">{{ item.level }}</span>
        <span class="screen-event__text">{{ item.text }}</span>
        <span class="screen-event__time">{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

defineOptions({ name: 'security-detail' })

const steps = [
  { name: '事件确认', value: 100 },
  { name: '人员派遣', value: 86 },
  { name: '现场处置', value: 62 },
]

const records = [
  { level: '系统', text: '自动提升北门摄像头码率', time: '14:21' },
  { level: '派单', text: '已通知网格员前往现场疏导', time: '14:22' },
  { level: '广播', text: '开启周边人流分流播报', time: '14:23' },
]

onMounted(() => {
  debugger
})
</script>

<style lang="less" scoped>
.detail-header {
  display: flex;
  min-height: 104px;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid rgba(117, 210, 202, 0.14);
}

.detail-header span {
  color: rgba(227, 252, 250, 0.62);
  font-size: 12px;
}

.detail-header strong {
  overflow: hidden;
  color: #efffff;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-header p {
  color: rgba(227, 252, 250, 0.68);
  font-size: 12px;
  line-height: 1.7;
}
</style>
