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
          top: numberToPx(element.commonStyle.position.top),
          left: numberToPx(element.commonStyle.position.left)
        }"
        :id="element.elementId"
        :key="element.elementId"
      >
        <transition name="fade">
          <drag-box
            v-if="
              projectManageStore.selectMode === '单选' &&
              projectManageStore.selectedElementsIds.includes(element.elementId)
            "
            :id="element.elementId"
          ></drag-box>
        </transition>
      </div>
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
