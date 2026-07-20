<template>
  <div class="container">
    <div class="control-panel">
      <h3>Worker 计算 + 增量渲染 (Vue 3)</h3>

      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          placeholder="输入关键字搜索(如: 8)"
          @keyup.enter="handleSearch"
        />
        <button :disabled="isCalculating" @click="handleSearch">
          {{ isCalculating ? '计算中...' : '搜索' }}
        </button>
      </div>

      <div class="status-bar">
        <p>
          当前渲染数据量: <strong>{{ renderedList.length }}</strong> / 100,000 条
        </p>
        <p>
          状态: <span class="badge" :class="{ loading: isCalculating }">{{ statusText }}</span>
        </p>
      </div>

      <div class="monitor">
        <p>主线程流畅度监控：</p>
        <div class="spinner"></div>
      </div>
    </div>

    <div class="data-view">
      <div v-for="item in renderedList" :key="item.id" class="data-row">
        <span class="score">得分: {{ item.score.toFixed(1) }}</span>
        <span class="title">{{ item.title }}</span>
      </div>
      <div v-if="renderedList.length === 0 && !isCalculating" class="empty">
        暂无数据，请输入关键字并点击搜索
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onBeforeUnmount } from 'vue'

// 1. 变量定义
const keyword = ref('')
const statusText = ref('待机中')
const isCalculating = ref(false)

/**
 * 性能优化核心点：使用 shallowRef 替代 ref
 * 10万条数据如果使用 ref，Vue 会递归将其所有属性转化为 reactive（Proxy），造成极大的内存和 CPU 浪费。
 * shallowRef 只追踪引用变化，对大列表增量追加极度友好。
 */
const renderedList = shallowRef([])

// 2. 模拟 10 万条本地原始大数据
const generateRawData = () => {
  return Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    title: `业务数据流条目_No.${i}_Tag_${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    score: Math.random() * 100,
  }))
}
const rawData = generateRawData()

// 3. 内联创建 Web Worker 字符串脚本（过滤 + 排序 + 增量分批推送）
const workerCode = `
  self.onmessage = function (e) {
    const { list, keyword } = e.data;
    
    // 耗时计算：过滤
    const filtered = list.filter(item => item.title.includes(keyword));
    
    // 耗时计算：排序
    filtered.sort((a, b) => b.score - a.score);

    const total = filtered.length;
    const batchSize = 2500; // 每一批增量推送 2500 条
    let offset = 0;

    while (offset < total) {
      const chunk = filtered.slice(offset, offset + batchSize);
      
      // 增量向主线程发送分片
      self.postMessage({
        type: 'CHUNK',
        data: chunk,
        isLast: offset + batchSize >= total
      });
      
      offset += batchSize;
    }
  };
`

const blob = new Blob([workerCode], { type: 'application/javascript' })
console.log(URL.createObjectURL(blob))

const worker = new Worker(URL.createObjectURL(blob))

// 4. 监听 Worker 线程返回的增量切片
worker.onmessage = (e) => {
  const { type, data, isLast } = e.data

  if (type === 'CHUNK') {
    // 核心增量更新：利用解构赋值触发 shallowRef 的浅层响应更新
    // 每次收到新批次，通过 requestAnimationFrame 确保在浏览器最佳渲染帧插入
    requestAnimationFrame(() => {
      renderedList.value = [...renderedList.value, ...data]
    })
  }

  if (isLast) {
    isCalculating.value = false
    statusText.value = '渲染完成！'
  }
}

// 5. 搜索触发入口
const handleSearch = () => {
  if (isCalculating.value) return

  renderedList.value = [] // 清空上一轮界面
  isCalculating.value = true
  statusText.value = 'Worker 正在后台计算并增量传输...'

  // 将海量数据和关键字投递给后台线程，主线程瞬间释放
  worker.postMessage({ list: rawData, keyword: keyword.value })
}

// 6. 组件销毁时及时释放 Worker 线程
onBeforeUnmount(() => {
  worker.terminate()
})
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

.control-panel {
  width: 320px;
  padding: 20px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;
}

.search-box button {
  padding: 8px 16px;
  background-color: #42b883; /* Vue Green */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-box button:disabled {
  background-color: #a8e6cf;
  cursor: not-allowed;
}

.status-bar {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-size: 14px;
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  background: #6c757d;
  color: white;
  font-size: 12px;
}
.badge.loading {
  background: #0d6efd;
}

.monitor {
  margin-top: 30px;
  text-align: center;
  font-size: 13px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e9ecef;
  border-top: 5px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 15px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 右侧列表滚动区 */
.data-view {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
}

.data-row {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 6px;
  background: #fdfdfd;
  border: 1px solid #f1f3f5;
  border-left: 4px solid #42b883;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
}

.score {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 6px;
  font-weight: bold;
  border-radius: 4px;
  margin-right: 15px;
  font-size: 12px;
}

.empty {
  text-align: center;
  color: #adb5bd;
  margin-top: 100px;
}
</style>
