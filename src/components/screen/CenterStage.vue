<template>
  <section class="center-stage" aria-label="中心业务主视口">
    <div class="center-stage__grid"></div>
    <div class="center-stage__ring center-stage__ring--outer"></div>
    <div class="center-stage__ring center-stage__ring--inner"></div>
    <div class="center-stage__slot">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.center-stage {
  position: relative;
  z-index: 1;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  border: 1px solid rgba(95, 211, 202, 0.18);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 46%, rgba(54, 201, 182, 0.14), transparent 28%),
    radial-gradient(circle at 50% 78%, rgba(229, 177, 75, 0.1), transparent 32%),
    linear-gradient(180deg, rgba(11, 31, 39, 0.46), rgba(3, 12, 18, 0.18));
}

.center-stage::before,
.center-stage::after {
  position: absolute;
  inset: 22px;
  pointer-events: none;
  content: '';
  border: 1px solid rgba(102, 240, 220, 0.16);
}

.center-stage::after {
  inset: 42px;
  border-color: rgba(229, 177, 75, 0.12);
}

.center-stage__grid {
  position: absolute;
  inset: 0;
  opacity: 0.58;
  background-image:
    linear-gradient(rgba(83, 218, 207, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(83, 218, 207, 0.12) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at 50% 52%, #000 0%, transparent 70%);
}

.center-stage__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  border: 1px solid rgba(100, 240, 220, 0.16);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.center-stage__ring--outer {
  width: 56%;
  aspect-ratio: 1;
}

.center-stage__ring--inner {
  width: 34%;
  aspect-ratio: 1;
  border-color: rgba(229, 177, 75, 0.18);
}

.center-stage__slot {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
