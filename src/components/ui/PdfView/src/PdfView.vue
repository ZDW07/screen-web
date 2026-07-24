<template>
  <div class="pdf-viewer" :aria-busy="isLoading || isRendering">
    <Toolbar
      :mode="mode"
      :current-page="currentPage"
      :total-pages="totalPages"
      :scale="currentScale"
      :disabled="isLoading || !isDocumentReady"
      @update:current-page="handleCurrentPageUpdate"
      @page-change="handlePageChange"
      @update:scale="handleScaleUpdate"
      @scale-change="handleScaleChange"
      @download="handleDownload"
      @print="handlePrint"
    />

    <div class="pdf-document">
      <p v-if="isLoading || isRendering" class="pdf-status">
        {{ isLoading ? '正在加载 PDF...' : '正在渲染 PDF...' }}
      </p>
      <p v-else-if="errorMessage" class="pdf-status pdf-error" role="alert">
        {{ errorMessage }}
      </p>

      <div ref="pagesRef" class="pdf-pages" :class="{ 'pdf-pages--single': mode === 'page' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import Toolbar from './Toolbar.vue'

type PdfMode = 'continuous' | 'page'

interface Props {
  url?: string
  src?: string
  mode?: PdfMode
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  src: '',
  mode: 'continuous',
  scale: 3,
})

const emit = defineEmits<{
  'update:scale': [scale: number]
  'scale-change': [scale: number]
}>()

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const pagesRef = ref<HTMLDivElement | null>(null)
const isLoading = ref(false)
const isRendering = ref(false)
const isDocumentReady = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const currentScale = ref(normalizeScale(props.scale))
const source = computed(() => (props.url || props.src).trim())

let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null
let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null
let pageRendering: pdfjsLib.RenderTask | null = null
let printFrame: HTMLIFrameElement | null = null
let printObjectUrl: string | null = null
let loadId = 0
let renderId = 0
let isUnmounted = false

function normalizeScale(scale: number): number {
  if (!Number.isFinite(scale) || scale <= 0) {
    return 1.5
  }

  return Number(scale.toFixed(2))
}

function normalizePage(page: number): number {
  return Math.min(Math.max(1, Math.trunc(page)), Math.max(1, totalPages.value))
}

function clearCanvas(): void {
  pagesRef.value?.replaceChildren()
}

function isRenderCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === 'RenderingCancelledException'
}

function beginRender(): number {
  renderId += 1
  pageRendering?.cancel()
  pageRendering = null
  clearCanvas()
  return renderId
}

function cleanupPrintFrame(): void {
  printFrame?.remove()
  printFrame = null

  if (printObjectUrl) {
    URL.revokeObjectURL(printObjectUrl)
    printObjectUrl = null
  }
}

async function destroy(): Promise<void> {
  renderId += 1
  pageRendering?.cancel()
  pageRendering = null
  pdfDocument = null
  isDocumentReady.value = false

  const task = loadingTask
  loadingTask = null
  if (task) {
    await task.destroy()
  }
}

async function renderPage(
  documentProxy: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  currentLoadId: number,
  currentRenderId: number,
  scale: number,
): Promise<void> {
  const page = await documentProxy.getPage(pageNumber)

  try {
    if (
      currentLoadId !== loadId ||
      currentRenderId !== renderId ||
      documentProxy !== pdfDocument ||
      isUnmounted
    ) {
      return
    }

    const ratio = window.devicePixelRatio || 1
    const displayViewport = page.getViewport({ scale })
    const renderViewport = page.getViewport({ scale: scale * ratio })
    const canvas = document.createElement('canvas')

    canvas.width = Math.ceil(renderViewport.width)
    canvas.height = Math.ceil(renderViewport.height)
    canvas.style.width = `${displayViewport.width}px`
    canvas.style.height = `${displayViewport.height}px`
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', `PDF 第 ${pageNumber} 页`)

    pagesRef.value?.appendChild(canvas)

    const task = page.render({
      canvas,
      viewport: renderViewport,
    })
    pageRendering = task

    try {
      await task.promise
    } finally {
      if (pageRendering === task) {
        pageRendering = null
      }
    }
  } finally {
    page.cleanup()
  }
}

async function renderAllPages(
  documentProxy: pdfjsLib.PDFDocumentProxy,
  currentLoadId: number,
  currentRenderId: number,
  scale: number,
): Promise<void> {
  for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
    if (currentLoadId !== loadId || currentRenderId !== renderId || isUnmounted) {
      return
    }

    await renderPage(documentProxy, pageNumber, currentLoadId, currentRenderId, scale)
  }
}

async function renderSinglePage(
  documentProxy: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  currentLoadId: number,
  currentRenderId: number,
  scale: number,
): Promise<void> {
  await renderPage(documentProxy, normalizePage(pageNumber), currentLoadId, currentRenderId, scale)
}

async function renderDocument(): Promise<void> {
  const documentProxy = pdfDocument
  if (!documentProxy || isUnmounted) {
    return
  }

  const currentLoadId = loadId
  const currentRenderId = beginRender()
  const scale = currentScale.value
  isRendering.value = true
  errorMessage.value = ''

  try {
    if (props.mode === 'page') {
      await renderSinglePage(
        documentProxy,
        currentPage.value,
        currentLoadId,
        currentRenderId,
        scale,
      )
    } else {
      await renderAllPages(documentProxy, currentLoadId, currentRenderId, scale)
    }
  } catch (error: unknown) {
    if (
      currentLoadId !== loadId ||
      currentRenderId !== renderId ||
      isUnmounted ||
      isRenderCancellation(error)
    ) {
      return
    }

    console.error('PDF 页面渲染失败:', error)
    clearCanvas()
    errorMessage.value = 'PDF 页面渲染失败'
  } finally {
    if (currentRenderId === renderId && !isUnmounted) {
      isRendering.value = false
    }
  }
}

async function loadPdf(): Promise<void> {
  const currentLoadId = ++loadId
  isLoading.value = true
  errorMessage.value = ''
  totalPages.value = 0
  currentPage.value = 1
  clearCanvas()

  try {
    await destroy()

    if (currentLoadId !== loadId || isUnmounted) {
      return
    }

    if (!source.value) {
      throw new Error('PDF 地址不能为空')
    }

    const task = pdfjsLib.getDocument({ url: source.value })
    loadingTask = task
    const documentProxy = await task.promise

    if (currentLoadId !== loadId || isUnmounted) {
      return
    }

    pdfDocument = documentProxy
    totalPages.value = documentProxy.numPages
    isDocumentReady.value = true
    await renderDocument()
  } catch (error: unknown) {
    if (currentLoadId !== loadId || isUnmounted || isRenderCancellation(error)) {
      return
    }

    console.error('PDF 加载失败:', error)
    clearCanvas()
    errorMessage.value = 'PDF 加载失败'
  } finally {
    if (currentLoadId === loadId && !isUnmounted) {
      isLoading.value = false
    }
  }
}

function handleCurrentPageUpdate(page: number): void {
  currentPage.value = normalizePage(page)
}

function handlePageChange(page: number): void {
  currentPage.value = normalizePage(page)
  void renderDocument()
}

function handleScaleUpdate(scale: number): void {
  const normalizedScale = normalizeScale(scale)
  currentScale.value = normalizedScale
  emit('update:scale', normalizedScale)
}

function handleScaleChange(scale: number): void {
  const normalizedScale = normalizeScale(scale)
  currentScale.value = normalizedScale
  emit('scale-change', normalizedScale)
  void renderDocument()
}

async function createPdfBlob(documentProxy: pdfjsLib.PDFDocumentProxy): Promise<Blob> {
  const data = await documentProxy.getData()
  const buffer = new ArrayBuffer(data.byteLength)
  new Uint8Array(buffer).set(data)
  return new Blob([buffer], { type: 'application/pdf' })
}

function getDownloadFileName(): string {
  try {
    const pathname = new URL(source.value, window.location.href).pathname
    const fileName = pathname.split('/').filter(Boolean).at(-1)
    return fileName ? decodeURIComponent(fileName) : 'document.pdf'
  } catch {
    return 'document.pdf'
  }
}

async function handleDownload(): Promise<void> {
  const documentProxy = pdfDocument
  if (!documentProxy) {
    return
  }

  try {
    const blob = await createPdfBlob(documentProxy)
    if (documentProxy !== pdfDocument || isUnmounted) {
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = getDownloadFileName()
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
  } catch (error: unknown) {
    console.error('PDF 下载失败:', error)
  }
}

async function handlePrint(): Promise<void> {
  const documentProxy = pdfDocument
  if (!documentProxy) {
    return
  }

  try {
    const blob = await createPdfBlob(documentProxy)
    if (documentProxy !== pdfDocument || isUnmounted) {
      return
    }

    cleanupPrintFrame()
    printObjectUrl = URL.createObjectURL(blob)
    printFrame = document.createElement('iframe')
    printFrame.className = 'pdf-print-frame'
    printFrame.src = printObjectUrl
    printFrame.title = 'PDF 打印预览'
    printFrame.onload = () => {
      const frameWindow = printFrame?.contentWindow
      frameWindow?.focus()
      frameWindow?.print()
      window.setTimeout(cleanupPrintFrame, 1000)
    }
    printFrame.onerror = cleanupPrintFrame
    document.body.appendChild(printFrame)
  } catch (error: unknown) {
    console.error('PDF 打印失败:', error)
    cleanupPrintFrame()
  }
}

onMounted(() => {
  void loadPdf()
})

watch(source, () => {
  void loadPdf()
})

watch(
  () => props.mode,
  () => {
    currentPage.value = normalizePage(currentPage.value)
    void renderDocument()
  },
)

watch(
  () => props.scale,
  (scale) => {
    const normalizedScale = normalizeScale(scale)
    if (normalizedScale === currentScale.value) {
      return
    }

    currentScale.value = normalizedScale
    void renderDocument()
  },
)

onBeforeUnmount(() => {
  isUnmounted = true
  loadId += 1
  clearCanvas()
  cleanupPrintFrame()
  void destroy()
})
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  flex-direction: column;
  background: #f5f5f5;
}

.pdf-document {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

.pdf-pages {
  width: 100%;
  min-height: 100%;
  padding: 1px 0;
  box-sizing: border-box;
}

.pdf-pages--single {
  display: grid;
  align-content: start;
}

.pdf-pages :deep(canvas) {
  display: block;
  max-width: calc(100% - 32px);
  height: auto !important;
  margin: 16px auto;
  background: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 16%);
}

.pdf-status {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  margin: 0;
  color: #555;
  font-size: 14px;
  letter-spacing: 0;
  transform: translate(-50%, -50%);
}

.pdf-error {
  color: #c62828;
}

:global(.pdf-print-frame) {
  position: fixed;
  width: 1px;
  height: 1px;
  border: 0;
  visibility: hidden;
}
</style>
