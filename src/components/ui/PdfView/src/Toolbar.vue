<template>
  <div class="pdf-toolbar" role="toolbar" aria-label="PDF 工具栏">
    <Pagination
      v-if="mode === 'page'"
      :current-page="currentPage"
      :total-pages="totalPages"
      :disabled="disabled"
      @update:current-page="handleCurrentPageUpdate"
      @change="handlePageChange"
    />

    <div class="toolbar-actions" :class="{ 'toolbar-actions--end': mode === 'page' }">
      <Zoom
        :scale="scale"
        :disabled="disabled"
        @update:scale="handleScaleUpdate"
        @change="handleScaleChange"
      />

      <span class="toolbar-divider" aria-hidden="true" />

      <button
        type="button"
        class="toolbar-button"
        :disabled="disabled"
        title="下载 PDF"
        @click="emit('download')"
      >
        下载
      </button>
      <button
        type="button"
        class="toolbar-button"
        :disabled="disabled"
        title="打印 PDF"
        @click="emit('print')"
      >
        打印
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Zoom from './Zoom.vue'
import Pagination from './Pagination.vue'

type PdfMode = 'continuous' | 'page'

interface Props {
  mode: PdfMode
  currentPage: number
  totalPages: number
  scale: number
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'page-change': [page: number]
  'update:scale': [scale: number]
  'scale-change': [scale: number]
  download: []
  print: []
}>()

function handleCurrentPageUpdate(page: number): void {
  emit('update:currentPage', page)
}

function handlePageChange(page: number): void {
  emit('page-change', page)
}

function handleScaleUpdate(scale: number): void {
  emit('update:scale', scale)
}

function handleScaleChange(scale: number): void {
  emit('scale-change', scale)
}
</script>

<style scoped>
.pdf-toolbar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  padding: 8px 12px;
  border-bottom: 1px solid #dfe2e5;
  box-sizing: border-box;
  background: #fafafa;
  color: #25282b;
  font-size: 14px;
  letter-spacing: 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.toolbar-actions--end {
  margin-left: auto;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  margin: 0 2px;
  background: #d5d8db;
}

.toolbar-button {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #c8ccd0;
  border-radius: 4px;
  background: #fff;
  color: #25282b;
  font: inherit;
  letter-spacing: 0;
  cursor: pointer;
  white-space: nowrap;
}

.toolbar-button:hover:not(:disabled) {
  border-color: #70767c;
  background: #f3f4f5;
}

.toolbar-button:disabled {
  color: #999;
  cursor: not-allowed;
  background: #f0f0f0;
}

@media (max-width: 720px) {
  .pdf-toolbar {
    flex-wrap: wrap;
  }

  .toolbar-actions,
  .toolbar-actions--end {
    width: 100%;
    margin-left: 0;
  }
}
</style>
