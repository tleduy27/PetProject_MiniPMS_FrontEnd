<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { roomRatesApi } from '@/api/roomRates'
import { roomTypesApi } from '@/api/roomTypes'
import { ratePlansApi } from '@/api/ratePlans'
import type { RoomRateDto } from '@/types/roomRate'
import type { RoomTypeDto } from '@/types/roomType'
import type { RatePlanDto } from '@/types/ratePlan'
import { formatDate } from '@/utils/date'
import { extractErrorMessage } from '@/utils/errors'
import RoomRateFormDialog from './RoomRateFormDialog.vue'

const loading = ref(false)
const roomRates = ref<RoomRateDto[]>([])
const roomTypes = ref<RoomTypeDto[]>([])
const ratePlans = ref<RatePlanDto[]>([])

const filterRoomTypeId = ref<number | undefined>(undefined)

const dialogVisible = ref(false)
const editingRoomRate = ref<RoomRateDto | null>(null)

// Map id -> tên để hiển thị (DTO chỉ trả về id)
const roomTypeName = computed<Record<number, string>>(() =>
  Object.fromEntries(roomTypes.value.map((rt) => [rt.id, rt.name])),
)
const ratePlanName = computed<Record<number, string>>(() =>
  Object.fromEntries(ratePlans.value.map((rp) => [rp.id, rp.name])),
)

function formatPrice(value: number): string {
  return value.toLocaleString('vi-VN') + ' đ'
}

async function fetchLookups() {
  try {
    const [rtRes, rpRes] = await Promise.all([
      roomTypesApi.getRoomTypes(),
      ratePlansApi.getRatePlans(),
    ])
    roomTypes.value = rtRes.data
    ratePlans.value = rpRes.data
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

async function fetchRoomRates() {
  loading.value = true
  try {
    const { data } = await roomRatesApi.getRoomRates(
      filterRoomTypeId.value ? { roomTypeId: filterRoomTypeId.value } : undefined,
    )
    roomRates.value = data
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    loading.value = false
  }
}

function goCreate() {
  editingRoomRate.value = null
  dialogVisible.value = true
}

function goEdit(row: RoomRateDto) {
  editingRoomRate.value = row
  dialogVisible.value = true
}

async function onDelete(row: RoomRateDto) {
  try {
    await roomRatesApi.deleteRoomRate(row.id)
    ElMessage.success('Đã xóa giá')
    await fetchRoomRates()
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

onMounted(async () => {
  await fetchLookups()
  await fetchRoomRates()
})
</script>

<template>
  <div class="room-rate-list">
    <div class="room-rate-list__toolbar">
      <h2 class="room-rate-list__title">Giá theo ngày (Room Rates)</h2>
      <div class="room-rate-list__actions">
        <el-select
          v-model="filterRoomTypeId"
          placeholder="Lọc theo loại phòng"
          clearable
          style="width: 220px"
          @change="fetchRoomRates"
        >
          <el-option
            v-for="rt in roomTypes"
            :key="rt.id"
            :label="rt.name"
            :value="rt.id"
          />
        </el-select>
        <el-button type="primary" @click="goCreate">
          <el-icon style="margin-right: 4px"><Plus /></el-icon>
          Thêm giá
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="roomRates" style="width: 100%" class="room-rate-list__table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="Loại phòng" min-width="150">
        <template #default="{ row }">{{ roomTypeName[row.roomTypeId] || `#${row.roomTypeId}` }}</template>
      </el-table-column>
      <el-table-column label="Gói giá" min-width="150">
        <template #default="{ row }">{{ ratePlanName[row.ratePlanId] || `#${row.ratePlanId}` }}</template>
      </el-table-column>
      <el-table-column label="Từ ngày" width="130" align="center">
        <template #default="{ row }">{{ formatDate(row.startDate) }}</template>
      </el-table-column>
      <el-table-column label="Đến ngày" width="130" align="center">
        <template #default="{ row }">{{ formatDate(row.endDate) }}</template>
      </el-table-column>
      <el-table-column label="Giá" width="150" align="right">
        <template #default="{ row }">{{ formatPrice(row.price) }}</template>
      </el-table-column>
      <el-table-column label="" width="140" align="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="goEdit(row)">Sửa</el-button>
          <el-popconfirm
            title="Xóa giá này?"
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
        <el-empty description="Chưa có giá nào" />
      </template>
    </el-table>

    <RoomRateFormDialog
      v-model="dialogVisible"
      :room-rate="editingRoomRate"
      :room-types="roomTypes"
      :rate-plans="ratePlans"
      @saved="fetchRoomRates"
    />
  </div>
</template>

<style scoped>
.room-rate-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.room-rate-list__title {
  margin: 0;
}

.room-rate-list__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.room-rate-list__table {
  background: #fff;
}
</style>
