<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { guestsApi } from '@/api/guests'
import { ID_TYPE_LABEL, type GuestDto } from '@/types/guest'
import { formatDate } from '@/utils/date'

const router = useRouter()

const loading = ref(false)
const guests = ref<GuestDto[]>([])
const search = ref('')
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

let searchDebounce: ReturnType<typeof setTimeout> | undefined

async function fetchGuests() {
  loading.value = true
  try {
    const { data } = await guestsApi.getGuests({
      search: search.value || undefined,
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
    })
    guests.value = data.items
    totalCount.value = data.totalCount
    pageNumber.value = data.pageNumber
    pageSize.value = data.pageSize
  } catch (err) {
    ElMessage.error('Không tải được danh sách khách hàng')
    console.error(err)
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    pageNumber.value = 1
    fetchGuests()
  }, 350)
}

function onPageChange(page: number) {
  pageNumber.value = page
  fetchGuests()
}

function onPageSizeChange(size: number) {
  pageSize.value = size
  pageNumber.value = 1
  fetchGuests()
}

function goCreate() {
  router.push({ name: 'guest-create' })
}

function goDetail(row: GuestDto) {
  router.push({ name: 'guest-detail', params: { id: row.id } })
}

function goEdit(row: GuestDto) {
  router.push({ name: 'guest-edit', params: { id: row.id } })
}

onMounted(fetchGuests)
</script>

<template>
  <div class="guest-list">
    <div class="guest-list__toolbar">
      <el-input
        v-model="search"
        placeholder="Tìm theo tên hoặc số điện thoại..."
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
        Thêm khách hàng
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="guests"
      style="width: 100%"
      @row-click="goDetail"
      class="guest-list__table"
    >
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="fullName" label="Họ tên" min-width="180" />
      <el-table-column prop="phone" label="Số điện thoại" width="140">
        <template #default="{ row }">{{ row.phone || '-' }}</template>
      </el-table-column>
      <el-table-column prop="email" label="Email" min-width="180">
        <template #default="{ row }">{{ row.email || '-' }}</template>
      </el-table-column>
      <el-table-column label="Loại giấy tờ" width="150">
        <template #default="{ row }">{{ ID_TYPE_LABEL[row.idType] ?? row.idType }}</template>
      </el-table-column>
      <el-table-column prop="nationality" label="Quốc tịch" width="120">
        <template #default="{ row }">{{ row.nationality || '-' }}</template>
      </el-table-column>
      <el-table-column label="Ngày tạo" width="120">
        <template #default="{ row }">{{ formatDate(row.createAt) }}</template>
      </el-table-column>
      <el-table-column label="" width="100" align="right">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click.stop="goEdit(row)"
          >
            Sửa
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="Không có khách hàng nào" />
      </template>
    </el-table>

    <div class="guest-list__pagination">
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
  </div>
</template>

<style scoped>
.guest-list__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.guest-list__table {
  background: #fff;
}

.guest-list__table :deep(.el-table__row) {
  cursor: pointer;
}

.guest-list__pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
