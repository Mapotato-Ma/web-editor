<template>
  <div class="component-library bg-grey-darken-3 d-flex flex-row">
    <v-tabs v-model="tab" direction="vertical" color="indigo-accent-2">
      <v-tab value="option-1" min-width="var(--v-tabs-height)">
        <v-icon>mdi-account</v-icon>
      </v-tab>
      <v-tab value="option-2" min-width="var(--v-tabs-height)">
        <v-icon>mdi-lock</v-icon>
      </v-tab>
      <v-tab value="option-3" min-width="var(--v-tabs-height)">
        <v-icon>mdi-access-point</v-icon>
      </v-tab>
    </v-tabs>
    <v-divider vertical></v-divider>
    <v-window v-model="tab">
      <v-window-item value="option-1" width="100%">
        <v-chip class="ma-3" label text-color="white" rounded="0">形状</v-chip>
        <v-divider></v-divider>
        <v-sheet class="d-flex align-center flex-wrap pa-3" width="100%" color="grey-darken-3">
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
        </v-sheet>
      </v-window-item>
      <v-window-item value="option-2">
        <v-chip class="ma-3" label text-color="white" rounded="0">形状</v-chip>
        <v-divider></v-divider>
        <v-sheet class="d-flex align-center flex-wrap pa-3" width="100%" color="grey-darken-3">
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
        </v-sheet>
      </v-window-item>
      <v-window-item value="option-3">
        <v-chip class="ma-3" label text-color="white" rounded="0">形状</v-chip>
        <v-divider></v-divider>
        <v-sheet class="d-flex align-center flex-wrap pa-3" width="100%" color="grey-darken-3">
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-rectangle</v-icon>
            矩形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-circle</v-icon>
            圆形
          </v-sheet>
          <v-sheet color="grey-darken-2">
            <v-icon>mdi-triangle</v-icon>
            三角形
          </v-sheet>
        </v-sheet>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tab = ref('option-1');
</script>

<style lang="less" scoped>
.component-library {
  user-select: none;
  position: absolute;
  top: var(--header-bar-height);
  left: 0;
  z-index: 2;
  width: 300px;
  height: calc(100% - var(--header-bar-height));
  box-shadow: 0 10px 10px 3px rgba(80, 78, 187, 0.408);
  .v-window {
    width: 100%;
    height: 100%;
    &-item > .v-sheet {
      display: flex;
      gap: 12px;
      flex: 1;
      cursor: pointer;
      .v-sheet {
        display: flex;
        gap: 5px;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width: 67px;
        height: 80px;
      }
    }
  }
}
</style>
