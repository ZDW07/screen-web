/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface Window {
  s: any // 或者指定具体类型，比如 string、number 等
  h: any
  setScale: (scale: number, heightScale: number) => void // 这里的参数和返回值类型根据你实际情况修改
}
