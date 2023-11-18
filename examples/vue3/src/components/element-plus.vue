<script setup lang="ts">
import { ref } from 'vue';
import { createTableByRange, getColumnsByRow } from '@span-method/mock';
import { ElTable, ElTableColumn } from 'element-plus';
import defineSpanMethod from '@span-method/element-plus';
import type { ElementPlusSpanMethodProp } from '@span-method/element-plus';


interface Section {
  title: string;
  spanMethod?: () => ElementPlusSpanMethodProp;
}

const data = createTableByRange({
  rowStart: 2,
  rowEnd: 5
});

// @ts-ignore
const columns = getColumnsByRow(data[0]);

const sections = ref<Section[]>([
  {
    title: 'Not Merged'
  },
  {
    title: 'Merge columns',
    spanMethod: () => defineSpanMethod(data, 'col')
  },
  {
    title: 'Merge Rows',
    spanMethod: () => defineSpanMethod(data, 'row')
  },
  {
    title: 'Merge rows and columns',
    spanMethod: () => defineSpanMethod(data, 'both')
  }
]);
</script>

<template>
  <div class="element-plus">
    <div v-for="item in sections" class="section">
      <h2>{{ item.title }}</h2>
      <el-table :data="data" :span-method="item.spanMethod && item.spanMethod()" border>
        <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" align="center" />
      </el-table>
    </div>
  </div>
</template>
