<template>
  <div class="tool-bar">
    <div class="tl-zoom-zone">
      <div
        class="tl-zoom"
        :class="{ 'tl-zoom-selected': drawContainerStore.scaleRelatedZoom === zoom }"
        v-for="zoom in drawContainerStore.zoomOptions"
        :key="zoom"
        @click="selectZoom(zoom)"
      >
        {{ zoom }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDrawContainerStore } from '@/stores';
const drawContainerStore = useDrawContainerStore();
const selectZoom = (zoom: number) => {
  drawContainerStore.scale = zoom / 100;
};
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
    gap: 1em;
    .tl-zoom {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      background-color: var(--primary-200);
      &:hover {
        opacity: 0.7;
      }
      &-selected {
        background-color: var(--primary-300);
      }
    }
  }
}
</style>
