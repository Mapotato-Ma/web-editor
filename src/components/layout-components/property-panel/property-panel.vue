<template>
  <div class="property-panel bg-grey-darken-3">
    <div>
      historyStackPointer:
      {{
        useOperationStackStore().historyStackMap.get(useProjectManageStore().selectedPageId)
          ?.historyStackPointer
      }}
    </div>
    <div
      v-for="(item, index) in useOperationStackStore().historyStackMap.get(
        useProjectManageStore().selectedPageId
      )?.historyStack"
      :key="index"
    >
      historyStack:
      {{ item.sliceValue }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOperationStackStore, useProjectManageStore } from '@/stores';
</script>

<style lang="less" scoped>
.property-panel {
  position: absolute;
  top: var(--header-bar-height);
  right: 0;
  z-index: 2;
  width: 300px;
  height: calc(100% - var(--header-bar-height));
  box-shadow: 0 10px 10px 3px rgba(80, 78, 187, 0.408);
}
</style>
