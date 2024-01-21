<template>
  <div class="property-panel bg-grey-darken-3" v-if="PropertyPanelData">
    <div>
      historyStackPointer:
      {{
        useOperationStackStore().historyStackMap.get(useProjectManageStore().selectedPageId)
          ?.historyStackPointer
      }}
    </div>
    <!-- 公共样式 -->
    <!-- 宽高 -->
    <v-layout column>
      <v-text-field name="width" label="宽" suffix="px"
        v-model="PropertyPanelData.selectedElements[0].commonStyle.size.width"></v-text-field>
      <v-text-field name="height" label="高" suffix="px"
        v-model="PropertyPanelData.selectedElements[0].commonStyle.size.height"></v-text-field>
    </v-layout>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useOperationStackStore, useProjectManageStore } from '@/stores';

let PropertyPanelData = ref();
onMounted(async () => {
  PropertyPanelData.value = (await import('./property-panel.service')).PropertyPanelData;
  console.log('🚀 ~ 面板数据 ~ 28行', PropertyPanelData.value);
});
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
