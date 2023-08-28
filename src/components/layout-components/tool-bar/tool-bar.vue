<template>
  <div class="tool-bar">
    <div class="tl-zoom-zone">
      <div class="tl-zoom" v-for="zoom in drawContainerStore.zoomOptions" :key="zoom">
        {{ zoom }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDrawContainerStore } from '@/stores';
const drawContainerStore = useDrawContainerStore();
</script>

<style lang="less" scoped>
.tool-bar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 3vh;
  background: #292a2d;
  display: flex;
  align-items: center;
  justify-content: center;
  .tl-zoom-zone {
    display: flex;
    width: max-content;
    align-items: center;
    gap: 5px;
    padding: 5px;
    box-shadow: inset 0 0 4px -1px #bdabfc;
    clip-path: ellipse(30px 20px);
    transition: clip-path 233ms;
    &:hover {
      clip-path: ellipse(200px 30px);
    }
    .tl-zoom {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-100);
      width: 40px;
      padding: 0 5px;
      border-radius: 9999999em;
      &:hover {
        background-color: var(--primary-200);
      }
    }
  }
}
</style>
