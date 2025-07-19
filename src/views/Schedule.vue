<script setup lang="ts">
import { ref, computed, h } from "vue";
import {
  Tag,
  type TableColumnsType,
} from "ant-design-vue";
import courtData from "../mock/mock_court_schedule.json";
import dayjs from "dayjs";


const rawData = courtData;
const filterCourt = ref<number | null>(null);
const filterTime = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
const filterStatus = ref<StatusCourt | null>(null);

const twoDigit = (n: number): string => n.toString().padStart(2, "0");

type StatusCourt = "Available" | "Occupied" | "Maintenance";

interface DataType {
  key: string;
  court: string;
  status: StatusCourt;
  [key: string]: string;
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    Available: "green",
    Occupied: "red",
    Maintenance: "orange",
  };
  return colorMap[status] || "default";
};

const getMergedSchedule = (row: DataType) => {
  const blocks: { text: string; colSpan: number; timeRange: string }[] = [];
  const slots = Array.from({ length: 18 }, (_, i) => `${twoDigit(6 + i)}00`);
  let prev = "";
  let count = 0;
  let startHour = 6;

  for (let i = 0; i <= slots.length; i++) {
    const curr = row[slots[i]] || "";
    if (curr !== prev) {
      if (count > 0) {
        const endHour = startHour + count;
        blocks.push({
          text: prev,
          colSpan: count,
          timeRange: `${twoDigit(startHour)}.00 - ${twoDigit(endHour)}.00`,
        });
      }
      prev = curr;
      count = 1;
      startHour = 6 + i;
    } else {
      count++;
    }
  }

  if (filterStatus.value) {
    return blocks.filter((block) => block.text === filterStatus.value);
  }

  return blocks;
};

const filteredData = computed(() => {
  return rawData.filter((row: any) => {
    const courtNo = parseInt(row.court.replace(/\D/g, ""));
    const matchCourt =
      filterCourt.value === null || filterCourt.value === courtNo;

    if (!matchCourt) return false;

    const [start, end] = filterTime.value || [];
    const startHour = start ? dayjs(start).hour() : 6;
    const endHour = end ? dayjs(end).hour() : 23;
    const hours = Array.from(
      { length: endHour - startHour },
      (_, i) => `${twoDigit(startHour + i)}00`
    );

    const hasTimeMatch = hours.some((h) => row[h]);

    if (!filterStatus.value) return hasTimeMatch;

    return (
      hasTimeMatch && hours.some((h) => row[h]?.trim() === filterStatus.value)
    );
  });
});

const columns: TableColumnsType = [
  {
    title: "Court No.",
    dataIndex: "court",
    fixed: "left",
    width: 120,
    responsive: ["xs", "sm", "md", "lg", "xl"],
  },
  {
    title: "Schedule (06:00 - 23:00)",
    key: "schedule",
    customRender: ({ record }: { record: DataType }) => {
      const blocks = getMergedSchedule(record);
      return h(
        "div",
        { class: "schedule-tags" },
        blocks.map((block) =>
          h(
            Tag,
            {
              color: getStatusColor(block.text),
              style: {
                flex: block.colSpan,
                textAlign: "center",
                borderRadius: "8px",
                margin: "4px",
                fontSize: "13px",
                padding: "6px 10px",
                minWidth: "60px",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              },
            },
            () => `${block.text}\n${block.timeRange}`
          )
        )
      );
    },
  },
];
</script>

<template>
  <div class="table-controls">
    <div class="center">
      <div class="top-container">
        <div>
          <div>Court No:</div>
        <a-input-number
        class="gap"
          v-model:value="filterCourt"
          :min="1"
          :max="50"
          placeholder="e.g. 10"
        />
        </div>
      
      <div>
        Time Range:
        <a-time-range-picker class="gap" />
      </div>
      </div>
    </div>
    <div>
      <div>Status:</div>
      <a-radio-group class="status-filter gap" v-model:value="filterStatus">
        <a-radio-button value="Available">Available</a-radio-button>
        <a-radio-button value="Occupied">Occupied</a-radio-button>
        <a-radio-button value="Maintenance">Maintenance</a-radio-button>
        <a-radio-button value="">Clear</a-radio-button>
      </a-radio-group>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table
      :columns="columns"
      :data-source="filteredData"
      :pagination="false"
      :scroll="{ x: '100%', y: 'calc(100vh - 200px)' }"
      bordered
      class="mobile-table"
      row-key="key"
    />
  </div>
</template>

<style scoped>
.table-wrapper {
  padding: 0 12px;
  overflow-x: auto;
}

.schedule-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.table-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 12px;
  margin-top: 120px;
  justify-content: center;
}

@media (max-width: 768px) {
  .mobile-table .ant-table-thead > tr > th {
    font-size: 12px;
  }
  .mobile-table .ant-table-cell {
    font-size: 12px;
    padding: 6px 8px;
  }
  .schedule-tags {
    flex-direction: column;
    align-items: flex-start;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gap {
    margin-top: 3px;
  }

  .status-filter {
    flex: 1;
    gap: 5px;
    max-width: 412px;
    overflow-x: auto;
    white-space: nowrap;
  }

  .top-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
  }
}
</style>
