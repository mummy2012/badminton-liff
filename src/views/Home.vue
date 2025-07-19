<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

const selectedDate = ref<Dayjs>(dayjs())

const onSelect = (date: Dayjs) => {
  console.log('Selected:', date.format('YYYY-MM-DD'))
}
</script>

<template>
  <a-calendar
    v-model:value="selectedDate"
    :fullscreen="false"
    @select="onSelect"
  />
</template>

<style scoped>
.ant-picker-calendar {
  border-radius: 8px;
}
</style>
