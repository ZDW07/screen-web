<template>
  <div class="pdf-zoom" aria-label="PDF 缩放控制">
    <button
      type="button"
      class="zoom-button"
      title="缩小"
      aria-label="缩小"
      :disabled="disabled || scale <= min"
      @click="changeScale(scale - step)"
    >
      -
    </button>

    <input
      class="zoom-range"
      type="range"
      aria-label="缩放比例"
      :value="scale"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @input="handleRangeInput"
    />

    <output class="zoom-value">{{ scalePercent }}%</output>

    <button
      type="button"
      class="zoom-button"
      title="放大"
      aria-label="放大"
      :disabled="disabled || scale >= max"
      @click="changeScale(scale + step)"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  scale: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0.5,
  max: 3,
  step: 0.25,
  disabled: false,
})

const emit = defineEmits<{
  'update:scale': [scale: number]
  change: [scale: number]
}>()

const scalePercent = computed(() => Math.round(props.scale * 100))

function normalizeScale(scale: number): number {
  const clampedScale = Math.min(props.max, Math.max(props.min, scale))
  return Number(clampedScale.toFixed(2))
}

function changeScale(scale: number): void {
  if (props.disabled) {
    return
  }

  const normalizedScale = normalizeScale(scale)
  if (normalizedScale === props.scale) {
    return
  }

  emit('update:scale', normalizedScale)
  emit('change', normalizedScale)
}

function handleRangeInput(event: Event): void {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    changeScale(Number(target.value))
  }
}
</script>

<style scoped>
.pdf-zoom {
  display: flex;
  align-items: center;
  gap: 6px;
}

.zoom-button {
  display: inline-grid;
  width: 32px;
  height: 32px;
  padding: 0;
  place-items: center;
  border: 1px solid #c8ccd0;
  border-radius: 4px;
  background: #fff;
  color: #25282b;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.zoom-button:hover:not(:disabled) {
  border-color: #70767c;
  background: #f3f4f5;
}

.zoom-button:disabled,
.zoom-range:disabled {
  color: #999;
  cursor: not-allowed;
  opacity: 0.65;
}

.zoom-range {
  width: 88px;
  accent-color: #2f6f9f;
  cursor: pointer;
}

.zoom-value {
  width: 48px;
  color: #4e5358;
  font-variant-numeric: tabular-nums;
  text-align: center;
}
</style>
