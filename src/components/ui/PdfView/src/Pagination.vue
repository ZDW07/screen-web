<template>
  <nav class="pdf-pagination" aria-label="PDF 分页">
    <button
      type="button"
      class="pagination-button"
      :disabled="disabled || !hasPages || currentPage <= 1"
      @click="changePage(currentPage - 1)"
    >
      上一页
    </button>

    <label class="page-indicator">
      <span class="sr-only">当前页</span>
      <input
        v-model="pageInput"
        class="page-input"
        type="number"
        inputmode="numeric"
        min="1"
        :max="maxPage"
        :disabled="disabled || !hasPages"
        @change="commitPage"
        @keydown.enter="commitPage"
      />
      <span aria-hidden="true">/</span>
      <span class="total-pages">{{ totalPages }}</span>
    </label>

    <button
      type="button"
      class="pagination-button"
      :disabled="disabled || !hasPages || currentPage >= totalPages"
      @click="changePage(currentPage + 1)"
    >
      下一页
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  change: [page: number]
}>()

const pageInput = ref(String(props.currentPage))
const hasPages = computed(() => props.totalPages > 0)
const maxPage = computed(() => Math.max(1, props.totalPages))

function normalizePage(page: number): number {
  if (!Number.isFinite(page)) {
    return props.currentPage
  }

  return Math.min(maxPage.value, Math.max(1, Math.trunc(page)))
}

function changePage(page: number): void {
  if (!hasPages.value || props.disabled) {
    return
  }

  const normalizedPage = normalizePage(page)
  pageInput.value = String(normalizedPage)

  if (normalizedPage === props.currentPage) {
    return
  }

  emit('update:currentPage', normalizedPage)
  emit('change', normalizedPage)
}

function commitPage(): void {
  changePage(Number(pageInput.value))
  pageInput.value = String(normalizePage(Number(pageInput.value)))
}

watch(
  () => props.currentPage,
  (page) => {
    pageInput.value = String(page)
  },
)
</script>

<style scoped>
.pdf-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pagination-button,
.page-input {
  height: 32px;
  border: 1px solid #c8ccd0;
  background: #fff;
  color: #25282b;
  font: inherit;
  letter-spacing: 0;
}

.pagination-button {
  padding: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.pagination-button:hover:not(:disabled) {
  border-color: #70767c;
  background: #f3f4f5;
}

.pagination-button:disabled,
.page-input:disabled {
  color: #999;
  cursor: not-allowed;
  background: #f0f0f0;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4e5358;
  white-space: nowrap;
}

.page-input {
  width: 58px;
  padding: 0 4px;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
}

.total-pages {
  min-width: 2ch;
  font-variant-numeric: tabular-nums;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
