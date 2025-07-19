<script setup lang="ts">
import { h } from 'vue'
import { Tag, type TableColumnsType } from 'ant-design-vue'
import courtData from '../mock/mock_court_schedule.json'

const dataMock = courtData

type StatusCourt = 'Available' | 'Occupied' | 'Maintenance'

interface DataType {
  key: string
  court: string
  status: StatusCourt
  [key: string]: string
}

const twoDigit = (n: number): string => n.toString().padStart(2, '0')

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    Available: 'green',
    Occupied: 'red',
    Maintenance: 'orange',
  }
  return colorMap[status] || 'default'
}

// Merge schedule blocks by status per row
const getMergedSchedule = (row: DataType) => {
  const blocks: { text: string; colSpan: number; timeRange: string }[] = []
  const slots = Array.from({ length: 18 }, (_, i) => `${twoDigit(6 + i)}00`)
  let prev = ''
  let count = 0
  let startHour = 6

  for (let i = 0; i <= slots.length; i++) {
    const curr = row[slots[i]] || ''
    if (curr !== prev) {
      if (count > 0) {
        const endHour = startHour + count
        blocks.push({
          text: prev,
          colSpan: count,
          timeRange: `${twoDigit(startHour)}.00 - ${twoDigit(endHour)}.00`
        })
      }
      prev = curr
      count = 1
      startHour = 6 + i
    } else {
      count++
    }
  }
  return blocks
}

const columns: TableColumnsType = [
  {
    title: 'Court No.',
    dataIndex: 'court',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'Schedule (06:00 - 23:00)',
    key: 'schedule',
    customRender: ({ record }: { record: DataType }) => {
      const blocks = getMergedSchedule(record)
      return h(
        'div',
        { style: { display: 'flex', width: '100%' } },
        blocks.map((block) =>
          h(
            Tag,
            {
              color: getStatusColor(block.text),
              style: {
                flex: block.colSpan,
                textAlign: 'center',
                borderRadius: 0,
                margin: 0,
                fontSize: '12px',
                padding: '4px 8px',
              },
            },
            () => `${block.text} (${block.timeRange})`
          )
        )
      )
    },
  },
]
</script>

<template>
  <div style="padding: 0 12px">
    <a-table
      :columns="columns"
      :data-source="dataMock"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
      bordered
      class="mobile-table"
      row-key="key"
    />
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
}
</style>