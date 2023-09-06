<template>
  <div
    class="rectangle-shape"
    :style="{
      width: numberToPx(props.width),
      height: numberToPx(props.height),
      background: props.background
    }"
  ></div>
</template>

<script lang="ts" setup>
import { numberToPx } from '@/utils';
const props = defineProps<{ width: number; height: number; background: string }>();
</script>
