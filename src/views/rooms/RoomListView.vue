<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, ArrowDown } from '@element-plus/icons-vue'
import { roomsApi } from '@/api/rooms'
import {
  HOUSEKEEPING_STATUS_META,
  ROOM_STATUS_META,
  ROOM_STATUS_OPTIONS,
  type RoomDto,
  type RoomStatus,
} from '@/types/room'
import { extractErrorMessage } from '@/utils/errors'
import RoomFormDialog from './RoomFormDialog.vue'

const loading = ref(false)
const rooms = ref<RoomDto[]>([])
const search = ref('')
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

const dialogVisible = ref(false)
const editingRoom = ref<RoomDto | null>(null)

let searchDebounce: ReturnType<typeof setTimeout> | undefined

async function fetchRooms() {
  loading.value = true
  try {
    const { data } = await roomsApi.getRooms({
      search: search.value || undefined,
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
    })
    rooms.value = data.items
    totalCount.value = data.totalCount
    pageNumber.value = data.pageNumber
    pageSize.value = data.pageSize
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    pageNumber.value = 1
    fetchRooms()
  }, 350)
}

function onPageChange(page: number) {
  pageNumber.value = page
  fetchRooms()
}

function onPageSizeChange(size: number) {
  pageSize.value = size
  pageNumber.value = 1
  fetchRooms()
}

async function onChangeStatus(row: RoomDto, newStatus: RoomStatus) {
  try {
    await roomsApi.updateStatus(row.id, newStatus)
    ElMessage.success(`Đã đổi trạng thái phòng ${row.roomNumber}`)
    await fetchRooms()
  } catch (err) {
    // Chuyển trạng thái không hợp lệ -> backend trả 409 (ConflictException)
    ElMessage.error(extractErrorMessage(err))
  }
}

function goCreate() {
  editingRoom.value = null
  dialogVisible.value = true
}

function goEdit(row: RoomDto) {
  editingRoom.value = row
  dialogVisible.value = true
}

async function onDelete(row: RoomDto) {
  try {
    await roomsApi.deleteRoom(row.id)
    ElMessage.success('Đã xóa phòng')
    await fetchRooms()
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

onMounted(fetchRooms)
</script>

<template>
  <div class="room-list">
    <div class="room-list__toolbar">
      <el-input
        v-model="search"
        placeholder="Tìm theo số phòng..."
        clearable
        style="max-width: 320px"
        @input="onSearchInput"
        @clear="onSearchInput"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" @click="goCreate">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        Thêm phòng
      </el-button>
    </div>

    <el-table v-loading="loading" :data="rooms" style="width: 100%" class="room-list__table">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="roomNumber" label="Số phòng" width="110" />
      <el-table-column prop="floor" label="Tầng" width="80" align="center" />
      <el-table-column prop="roomTypeName" label="Loại phòng" min-width="140" />

      <el-table-column label="Trạng thái" min-width="180">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="(cmd: RoomStatus) => onChangeStatus(row, cmd)">
            <el-tag :type="ROOM_STATUS_META[row.status].tag" style="cursor: pointer">
              {{ ROOM_STATUS_META[row.status].label }}
              <el-icon style="margin-left: 4px"><ArrowDown /></el-icon>
            </el-tag>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="opt in ROOM_STATUS_OPTIONS"
                  :key="opt.value"
                  :command="opt.value"
                >
                  {{ opt.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column label="Buồng phòng" min-width="150">
        <template #default="{ row }">
          <el-tag :type="HOUSEKEEPING_STATUS_META[row.housekeepingStatus].tag">
            {{ HOUSEKEEPING_STATUS_META[row.housekeepingStatus].label }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="notes" label="Ghi chú" min-width="150">
        <template #default="{ row }">{{ row.notes || '-' }}</template>
      </el-table-column>

      <el-table-column label="" width="140" align="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="goEdit(row)">Sửa</el-button>
          <el-popconfirm
            title="Xóa phòng này?"
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
        <el-empty description="Chưa có phòng nào" />
      </template>
    </el-table>

    <div class="room-list__pagination">
      <el-pagination
        v-model:current-page="pageNumber"
        v-model:page-size="pageSize"
        :total="totalCount"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="onPageChange"
        @size-change="onPageSizeChange"
      />
    </div>

    <RoomFormDialog v-model="dialogVisible" :room="editingRoom" @saved="fetchRooms" />
  </div>
</template>

<style scoped>
.room-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.room-list__table {
  background: #fff;
}

.room-list__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
