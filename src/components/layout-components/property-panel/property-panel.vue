<template>
  <div class="property-panel bg-grey-darken-3"></div>
</template>

<script lang="ts" setup></script>

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
