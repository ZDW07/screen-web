<template>
  <div ref="mainBoxRef" class="map-box" id="three"></div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'

// 引入原生 Three.js 及其需要的加载器和控制器
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const ENGINE_URL = 'https://192.168.0.45:8192/static/eryuan'
const mainBoxRef = ref()

// 定义 Three.js 的全局变量，方便后续维护或销毁
let scene, camera, renderer, controls, animationFrameId
let resizeObserver

function getContainerSize() {
  const dom = mainBoxRef.value
  if (!dom) return { width: 1, height: 1 }

  return {
    width: dom.clientWidth || 1,
    height: dom.clientHeight || 1,
  }
}

function resizeRenderer() {
  if (!camera || !renderer) return

  const { width, height } = getContainerSize()
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

function getMap() {
  const dom = mainBoxRef.value
  if (!dom) return

  const { width, height } = getContainerSize()

  // 1. 创建场景 (Scene)
  scene = new THREE.Scene()

  // 2. 创建相机 (Camera) - 对应你原有的 initView 坐标
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000)
  camera.position.set(-143.41, 209.72, 382.91)
  console.log(width, height)

  // 3. 创建渲染器 (Renderer) 并开启阴影
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true // 开启阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping // 提升 HDR 色调映射效果
  renderer.toneMappingExposure = 1.0
  renderer.domElement.className = 'map-canvas'
  dom.appendChild(renderer.domElement)

  // 4. 添加轨道控制器 (Controls) 用于鼠标拖拽旋转和缩放
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 开启阻尼感
  controls.dampingFactor = 0.05

  // 5. 添加基础光源 (Lights)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(200, 400, 200)
  dirLight.castShadow = true // 开启光源阴影
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  scene.add(dirLight)

  // 6. 加载 HDR 环境贴图 (对应 envUrl)
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load(ENGINE_URL + '/glassEnvMap.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture // 设置为环境反射
    // 如果需要将 HDR 作为背景，可以解开下一行的注释：
    // scene.background = texture;
  })

  // 7. 加载基础底座 GLB 模型 (对应 modelUrl)
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(
    ENGINE_URL + '/ZT_base.glb',
    (gltf) => {
      const model = gltf.scene

      // 遍历模型开启阴影接收和投射
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(model)
      console.log('底座模型加载成功')
    },
    (progress) => {
      // 可以在这里计算加载进度
    },
    (error) => {
      console.error('模型加载失败:', error)
    },
  )

  // 8. 渲染循环动画
  function animate() {
    animationFrameId = requestAnimationFrame(animate)
    controls.update() // 只有在 controls.enableDamping = true 时需要
    renderer.render(scene, camera)
  }
  animate()

  // 将变量挂载到 window，保持你原代码的习惯（可选）
  window.EngineScene = scene
}

onMounted(() => {
  nextTick(() => {
    getMap()

    if (window.ResizeObserver && mainBoxRef.value) {
      resizeObserver = new ResizeObserver(resizeRenderer)
      resizeObserver.observe(mainBoxRef.value)
    }

    window.addEventListener('resize', onWindowResize)
  })
})

// 提取 Resize 回调，方便销毁
function onWindowResize() {
  resizeRenderer()
}

// 组件销毁时清除定时器与事件，防止内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (resizeObserver) resizeObserver.disconnect()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
})
</script>

<style scoped lang="less">
.map-box {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(.map-canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  :deep(.el-loading-mask) {
    background-color: black;
    opacity: 0.75;
  }
}
</style>
