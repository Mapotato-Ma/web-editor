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
  >
    <div class="dc-page">
      <div
        class="dc-element"
        v-for="element in projectManageStore.selectedPage.elements"
        :style="{
          width: numberToPx(element.commonStyle.size.width),
          height: numberToPx(element.commonStyle.size.height),
          transform: element.commonStyle.transform
        }"
        :id="element.elementId"
        :key="element.elementId"
      >
        {{ JSON.stringify(element, undefined, 4) }}
      </div>
      <drag-box></drag-box>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useDrawContainerStore } from '@/stores';
import { DragBox } from '@/components/com-components';
import { numberToPx } from '@/utils';
import { useProjectManageStore } from '@/stores/project-manage-store';

// 画布容器
const drawContainer = ref<HTMLElement>();
// 画布数据库
const drawContainerStore = useDrawContainerStore();
// 项目管理数据库
const projectManageStore = useProjectManageStore();

// 画布事件管理器实例
onMounted(() => {
  // 创建画布事件管理器实例
  projectManageStore.initDrawContainerEventController(drawContainer.value!);
  // 居中画布
  drawContainerStore.centeredDrawContainer();
  projectManageStore.activeElements([
    projectManageStore.project.pages[0].elements[0],
    projectManageStore.project.pages[0].elements[1]
  ]);
});
</script>

<style lang="less" scoped>
.draw-container {
  position: relative;
  transform-origin: center center;
  transition: transform 233ms;
  .dc-element {
    position: absolute;
    border: 1px solid #fff;
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 50ms ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
</style>
