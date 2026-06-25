<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ratePlansApi } from '@/api/ratePlans'
import type { RatePlanDto } from '@/types/ratePlan'
import { extractErrorMessage } from '@/utils/errors'
import RatePlanFormDialog from './RatePlanFormDialog.vue'

const loading = ref(false)
const ratePlans = ref<RatePlanDto[]>([])

const dialogVisible = ref(false)
const editingRatePlan = ref<RatePlanDto | null>(null)

async function fetchRatePlans() {
  loading.value = true
  try {
    const { data } = await ratePlansApi.getRatePlans()
    ratePlans.value = data
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    loading.value = false
  }
}

function goCreate() {
  editingRatePlan.value = null
  dialogVisible.value = true
}

function goEdit(row: RatePlanDto) {
  editingRatePlan.value = row
  dialogVisible.value = true
}

async function onDelete(row: RatePlanDto) {
  try {
    await ratePlansApi.deleteRatePlan(row.id)
    ElMessage.success('Đã xóa gói giá')
    await fetchRatePlans()
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

onMounted(fetchRatePlans)
</script>

<template>
  <div class="rate-plan-list">
    <div class="rate-plan-list__toolbar">
      <h2 class="rate-plan-list__title">Gói giá (Rate Plans)</h2>
      <el-button type="primary" @click="goCreate">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        Thêm gói giá
      </el-button>
    </div>

    <el-table v-loading="loading" :data="ratePlans" style="width: 100%" class="rate-plan-list__table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="Tên gói giá" min-width="160" />
      <el-table-column prop="description" label="Mô tả" min-width="220">
        <template #default="{ row }">{{ row.description || '-' }}</template>
      </el-table-column>
      <el-table-column label="Gồm ăn sáng" width="140" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isIncludeBreakfast ? 'success' : 'info'">
            {{ row.isIncludeBreakfast ? 'Có' : 'Không' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái" width="130" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'">
            {{ row.isActive ? 'Đang dùng' : 'Ngừng' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="" width="140" align="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="goEdit(row)">Sửa</el-button>
          <el-popconfirm
            title="Xóa gói giá này?"
            confirm-button-text="Xóa"
            cancel-button-text="Hủy"
            @confirm="onDelete(row)"
          >
            <template #reference>
              <el-button link type="danger">Xóa</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="Chưa có gói giá nào" />
      </template>
    </el-table>

    <RatePlanFormDialog
      v-model="dialogVisible"
      :rate-plan="editingRatePlan"
      @saved="fetchRatePlans"
    />
  </div>
</template>

<style scoped>
.rate-plan-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rate-plan-list__title {
  margin: 0;
}

.rate-plan-list__table {
  background: #fff;
}
</style>
