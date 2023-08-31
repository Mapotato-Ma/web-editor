<template>
  <div
    class="draw-container bg-grey-darken-4"
    ref="drawContainer"
    id="drawContainer"
    :style="{
      width: drawContainerStore.widthWithPx,
      height: drawContainerStore.heightWithPx,
      top: drawContainerStore.topWithPx,
      left: drawContainerStore.leftWithPx,
      transform: drawContainerStore.transform,
      cursor: drawContainerStore.cursor
    }"
  ></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { DrawContainerEventController } from './draw-event-controller';
import { useDrawContainerStore } from '@/stores';
// 画布容器
const drawContainer = ref<HTMLElement>();
// 画布store
const drawContainerStore = useDrawContainerStore();
// 画布事件管理器实例
const drawContainerEventControllerInstance = ref<DrawContainerEventController>();
onMounted(() => {
  // 创建画布事件管理器实例
  drawContainerEventControllerInstance.value = new DrawContainerEventController(
    drawContainer.value!
  );
  // 居中画布
  drawContainerStore.centeredDrawContainer();
});
</script>

<style lang="less" scoped>
.draw-container {
  position: relative;
  transform-origin: center center;
  transition: transform 233ms;
}
</style>
