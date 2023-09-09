<template>
  <div class="tool-bar bg-grey-darken-3">
    <div class="left-regions">
      <v-btn-group>
        <v-btn size="large" @click="useOperationStackStore().redo">撤销</v-btn>
      </v-btn-group>
      <v-btn-group>
        <v-btn size="large" @click="useOperationStackStore().undo">回退</v-btn>
      </v-btn-group>
    </div>
    <div class="middle-regions">
      <v-btn-group>
        <v-btn
          v-for="zoom in drawContainerStore.zoomOptions"
          :key="zoom"
          :value="zoom"
          @click="selectZoom(zoom)"
          :class="{ 'bg-deep-purple-accent-3': zoom === drawContainerStore.scaleRelatedZoom }"
        >
          {{ zoom }}%
        </v-btn>
      </v-btn-group>
      <v-btn-group>
        <v-btn
          size="large"
          @click="
            clearFocusStatus();
            drawContainerStore.centeredDrawContainer();
          "
        >
          居中画布
        </v-btn>
      </v-btn-group>
    </div>
    <div class="right-regions">
      <v-btn-group>
        <v-btn size="large">保存</v-btn>
      </v-btn-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDrawContainerStore, useOperationStackStore } from '@/stores';
import { clearFocusStatus } from '@/utils';
// 画布数据库
const drawContainerStore = useDrawContainerStore();
const selectZoom = (zoom: number) => {
  clearFocusStatus();
  drawContainerStore.setScale(zoom / 100);
};
</script>

<style lang="less" scoped>
.tool-bar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: var(--header-bar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-bottom: 1px solid rgb(80, 78, 187);
  box-shadow: 0 0 10px 3px rgba(80, 78, 187, 0.408);
}
</style>
