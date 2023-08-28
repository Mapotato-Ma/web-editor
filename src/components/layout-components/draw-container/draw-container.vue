<template>
  <div
    class="draw-container"
    ref="drawContainer"
    :style="{
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
});
</script>

<style lang="less" scoped>
.draw-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #543f3f;
  transition: transform 233ms;
}
</style>
