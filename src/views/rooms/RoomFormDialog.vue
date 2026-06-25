<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { roomsApi } from '@/api/rooms'
import { roomTypesApi } from '@/api/roomTypes'
import type { RoomTypeDto } from '@/types/roomType'
import {
  HOUSEKEEPING_STATUS_OPTIONS,
  HousekeepingStatus,
  ROOM_STATUS_OPTIONS,
  RoomStatus,
  type RoomDto,
} from '@/types/room'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{
  modelValue: boolean
  room: RoomDto | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [room: RoomDto]
}>()

const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const roomTypes = ref<RoomTypeDto[]>([])

const form = reactive({
  roomNumber: '',
  floor: 1,
  roomTypeId: undefined as number | undefined,
  status: RoomStatus.Available as number,
  housekeepingStatus: HousekeepingStatus.Clean as number,
  notes: '',
})

const rules: FormRules = {
  roomNumber: [
    { required: true, message: 'Số phòng không được để trống', trigger: 'blur' },
    { max: 20, message: 'Số phòng tối đa 20 ký tự', trigger: 'blur' },
  ],
  floor: [{ required: true, type: 'number', message: 'Vui lòng nhập tầng', trigger: 'blur' }],
  roomTypeId: [{ required: true, type: 'number', message: 'Vui lòng chọn loại phòng', trigger: 'change' }],
}

async function fetchRoomTypes() {
  try {
    const { data } = await roomTypesApi.getRoomTypes()
    roomTypes.value = data
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  }
}

function resetForm() {
  const r = props.room
  isEdit.value = !!r
  form.roomNumber = r?.roomNumber ?? ''
  form.floor = r?.floor ?? 1
  form.roomTypeId = r?.roomTypeId
  // Response trả enum dạng chuỗi -> map ngược về số để gửi lại khi submit
  form.status = r ? RoomStatus[r.status] : RoomStatus.Available
  form.housekeepingStatus = r ? HousekeepingStatus[r.housekeepingStatus] : HousekeepingStatus.Clean
  form.notes = r?.notes ?? ''
  formRef.value?.clearValidate()
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) resetForm()
  },
)

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      roomNumber: form.roomNumber,
      floor: form.floor,
      roomTypeId: form.roomTypeId!,
      status: form.status as RoomStatus,
      housekeepingStatus: form.housekeepingStatus as HousekeepingStatus,
      notes: form.notes || null,
    }

    const { data } = isEdit.value
      ? await roomsApi.updateRoom(props.room!.id, { ...payload, id: props.room!.id })
      : await roomsApi.createRoom(payload)

    ElMessage.success(isEdit.value ? 'Cập nhật phòng thành công' : 'Tạo phòng thành công')
    emit('saved', data)
    emit('update:modelValue', false)
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    submitting.value = false
  }
}

function onClose() {
  emit('update:modelValue', false)
}

onMounted(fetchRoomTypes)
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? `Sửa phòng #${room?.id}` : 'Thêm phòng mới'"
    width="480px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="130px" @submit.prevent="onSubmit">
      <el-form-item label="Số phòng" prop="roomNumber">
        <el-input v-model="form.roomNumber" placeholder="101, 202, ..." />
      </el-form-item>

      <el-form-item label="Tầng" prop="floor">
        <el-input-number v-model="form.floor" :min="0" style="width: 100%" />
      </el-form-item>

      <el-form-item label="Loại phòng" prop="roomTypeId">
        <el-select v-model="form.roomTypeId" placeholder="Chọn loại phòng" style="width: 100%">
          <el-option
            v-for="rt in roomTypes"
            :key="rt.id"
            :label="rt.name"
            :value="rt.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Trạng thái" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option
            v-for="opt in ROOM_STATUS_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Buồng phòng" prop="housekeepingStatus">
        <el-select v-model="form.housekeepingStatus" style="width: 100%">
          <el-option
            v-for="opt in HOUSEKEEPING_STATUS_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Ghi chú" prop="notes">
        <el-input v-model="form.notes" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onClose">Hủy</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ isEdit ? 'Lưu thay đổi' : 'Tạo mới' }}
      </el-button>
    </template>
  </el-dialog>
</template>
