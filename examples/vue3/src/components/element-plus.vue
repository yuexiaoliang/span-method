<script setup lang="ts">
import { createTable, getColumnsByRow } from '@span-method/mock';
import { ElTable, ElTableColumn } from 'element-plus';
import defineSpanMethod from '@span-method/element-plus';
import type { Model } from '@span-method/element-plus';

const tableData = createTable(5, 5);

// @ts-ignore
const columns = getColumnsByRow(tableData[0]);
const spanMethod = (model: Model) => defineSpanMethod(tableData, model);
</script>

<template>
  <div class="element-plus">
    <div class="section">
      <h2>合并列</h2>
      <el-table :data="tableData" :span-method="spanMethod('col')" border>
        <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" align="center" />
      </el-table>
    </div>

    <div class="section">
      <h2>合并行</h2>
      <el-table :data="tableData" :span-method="spanMethod('row')" border>
        <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" align="center" />
      </el-table>
    </div>
  </div>
</template>
