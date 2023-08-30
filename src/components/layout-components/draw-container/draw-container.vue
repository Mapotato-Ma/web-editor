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
const drawContainer = ref<HTMLElement>();
const drawContainerStore = useDrawContainerStore();
const drawContainerEventControllerInstance = ref<DrawContainerEventController>();
onMounted(() => {
  drawContainerEventControllerInstance.value = new DrawContainerEventController(
    drawContainer.value!
  );
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
