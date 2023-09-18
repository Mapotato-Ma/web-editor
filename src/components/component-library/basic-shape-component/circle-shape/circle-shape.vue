<template>
  <div
    :style="{
      width: numberToPx(props.width),
      height: numberToPx(props.height),
      background: props.background,
      borderRadius: '50%'
    }"
  ></div>
</template>

<script lang="ts" setup>
import { numberToPx } from '@/utils';
const props = defineProps<{ width: number; height: number; background: string }>();
</script>
