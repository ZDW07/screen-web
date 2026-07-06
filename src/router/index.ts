import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

const routes: any[] = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})

export const setupRouter = (app: App<Element>) => {
  return app.use(router)
}

export default router
