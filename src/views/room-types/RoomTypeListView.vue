<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { roomTypesApi } from '@/api/roomTypes'
import type { RoomTypeDto } from '@/types/roomType'
import { extractErrorMessage } from '@/utils/errors'
import RoomTypeFormDialog from './RoomTypeFormDialog.vue'

const loading = ref(false)
const roomTypes = ref<RoomTypeDto[]>([])

const dialogVisible = ref(false)
const editingRoomType = ref<RoomTypeDto | null>(null)

async function fetchRoomTypes() {
  loading.value = true
  try {
    const { data } = await roomTypesApi.getRoomTypes()
    roomTypes.value = data
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    loading.value = false
  }
}

function formatPrice(value: number): string {
  return value.toLocaleString('vi-VN') + ' đ'
}

function goCreate() {
  editingRoomType.value = null
  dialogVisible.value = true
}

function goEdit(row: RoomTypeDto) {
  editingRoomType.value = row
  dialogVisible.value = true
}

async function onDelete(row: RoomTypeDto) {
  try {
    await roomTypesApi.deleteRoomType(row.id)
    ElMessage.success('Đã xóa loại phòng')
    await fetchRoomTypes()
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

onMounted(fetchRoomTypes)
</script>

<template>
  <div class="room-type-list">
    <div class="room-type-list__toolbar">
      <h2 class="room-type-list__title">Loại phòng</h2>
      <el-button type="primary" @click="goCreate">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        Thêm loại phòng
      </el-button>
    </div>

    <el-table v-loading="loading" :data="roomTypes" style="width: 100%" class="room-type-list__table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="Tên loại phòng" min-width="160" />
      <el-table-column label="Số người tối đa" width="140" align="center">
        <template #default="{ row }">{{ row.maxOccupancy }}</template>
      </el-table-column>
      <el-table-column label="Giá cơ bản" width="140" align="right">
        <template #default="{ row }">{{ formatPrice(row.basePrice) }}</template>
      </el-table-column>
      <el-table-column prop="description" label="Mô tả" min-width="180">
        <template #default="{ row }">{{ row.description || '-' }}</template>
      </el-table-column>
      <el-table-column prop="amenities" label="Tiện ích" min-width="180">
        <template #default="{ row }">{{ row.amenities || '-' }}</template>
      </el-table-column>
      <el-table-column label="" width="140" align="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="goEdit(row)">Sửa</el-button>
          <el-popconfirm
            title="Xóa loại phòng này?"
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
        <el-empty description="Chưa có loại phòng nào" />
      </template>
    </el-table>

    <RoomTypeFormDialog
      v-model="dialogVisible"
      :room-type="editingRoomType"
      @saved="fetchRoomTypes"
    />
  </div>
</template>

<style scoped>
.room-type-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.room-type-list__title {
  margin: 0;
}

.room-type-list__table {
  background: #fff;
}
</style>
