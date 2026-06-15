<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import { guestsApi } from '@/api/guests'
import { ID_TYPE_LABEL, type GuestDto } from '@/types/guest'
import { formatDate } from '@/utils/date'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{ id: string }>()
const router = useRouter()

const loading = ref(true)
const notFound = ref(false)
const guest = ref<GuestDto | null>(null)

async function fetchGuest() {
  loading.value = true
  notFound.value = false
  try {
    const { data } = await guestsApi.getGuestById(Number(props.id))
    guest.value = data
  } catch (err) {
    if ((err as AxiosError).response?.status === 404) {
      notFound.value = true
    } else {
      ElMessage.error(extractErrorMessage(err))
    }
  } finally {
    loading.value = false
  }
}

function goEdit() {
  router.push({ name: 'guest-edit', params: { id: props.id } })
}

function goList() {
  router.push({ name: 'guest-list' })
}

onMounted(fetchGuest)
</script>

<template>
  <div v-loading="loading" class="guest-detail">
    <el-result
      v-if="notFound"
      icon="warning"
      title="Không tìm thấy khách hàng"
      :sub-title="`Khách hàng #${props.id} không tồn tại.`"
    >
      <template #extra>
        <el-button type="primary" @click="goList">Về danh sách</el-button>
      </template>
    </el-result>

    <el-card v-else-if="guest" shadow="never" class="guest-detail__card">
      <template #header>
        <div class="guest-detail__header">
          <span>Khách hàng #{{ guest.id }} — {{ guest.fullName }}</span>
          <div>
            <el-button @click="goList">Về danh sách</el-button>
            <el-button type="primary" @click="goEdit">Sửa</el-button>
          </div>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="Họ tên">{{ guest.fullName }}</el-descriptions-item>
        <el-descriptions-item label="Email">{{ guest.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Số điện thoại">{{ guest.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Loại giấy tờ">
          {{ ID_TYPE_LABEL[guest.idType] ?? guest.idType }}
        </el-descriptions-item>
        <el-descriptions-item label="Quốc tịch">{{ guest.nationality || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Ngày sinh">{{ formatDate(guest.dateOfBirth) }}</el-descriptions-item>
        <el-descriptions-item label="Địa chỉ" :span="2">{{ guest.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Ghi chú" :span="2">{{ guest.notes || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Ngày tạo">{{ formatDate(guest.createAt) }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.guest-detail__card {
  background: #fff;
}

.guest-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
