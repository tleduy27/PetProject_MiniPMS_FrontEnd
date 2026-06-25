<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormItemRule, type FormRules } from 'element-plus'
import { roomRatesApi } from '@/api/roomRates'
import type { RoomRateDto } from '@/types/roomRate'
import type { RoomTypeDto } from '@/types/roomType'
import type { RatePlanDto } from '@/types/ratePlan'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{
  modelValue: boolean
  roomRate: RoomRateDto | null
  roomTypes: RoomTypeDto[]
  ratePlans: RatePlanDto[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [roomRate: RoomRateDto]
}>()

const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  roomTypeId: undefined as number | undefined,
  ratePlanId: undefined as number | undefined,
  startDate: '',
  endDate: '',
  price: 0,
})

// Validator: EndDate phải sau StartDate (khớp luật backend).
const endAfterStart: FormItemRule['validator'] = (_rule, value, callback) => {
  if (form.startDate && value && new Date(value) <= new Date(form.startDate)) {
    callback(new Error('Đến ngày phải sau Từ ngày'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  roomTypeId: [{ required: true, type: 'number', message: 'Vui lòng chọn loại phòng', trigger: 'change' }],
  ratePlanId: [{ required: true, type: 'number', message: 'Vui lòng chọn gói giá', trigger: 'change' }],
  startDate: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'change' }],
  endDate: [
    { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'change' },
    { validator: endAfterStart, trigger: 'change' },
  ],
  price: [{ required: true, type: 'number', min: 1, message: 'Giá phải lớn hơn 0', trigger: 'blur' }],
}

function resetForm() {
  const rr = props.roomRate
  isEdit.value = !!rr
  form.roomTypeId = rr?.roomTypeId
  form.ratePlanId = rr?.ratePlanId
  // DTO trả "2026-07-01T00:00:00" -> cắt lấy "2026-07-01" cho date-picker (value-format YYYY-MM-DD)
  form.startDate = rr?.startDate?.slice(0, 10) ?? ''
  form.endDate = rr?.endDate?.slice(0, 10) ?? ''
  form.price = rr?.price ?? 0
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
      roomTypeId: form.roomTypeId!,
      ratePlanId: form.ratePlanId!,
      startDate: form.startDate,
      endDate: form.endDate,
      price: form.price,
    }

    const { data } = isEdit.value
      ? await roomRatesApi.updateRoomRate(props.roomRate!.id, { ...payload, id: props.roomRate!.id })
      : await roomRatesApi.createRoomRate(payload)

    ElMessage.success(isEdit.value ? 'Cập nhật giá thành công' : 'Tạo giá thành công')
    emit('saved', data)
    emit('update:modelValue', false)
  } catch (err) {
    // Trùng khoảng ngày -> backend trả 409, extractErrorMessage hiển thị message rõ ràng.
    ElMessage.error(extractErrorMessage(err))
  } finally {
    submitting.value = false
  }
}

function onClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? `Sửa giá #${roomRate?.id}` : 'Thêm giá mới'"
    width="480px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" @submit.prevent="onSubmit">
      <el-form-item label="Loại phòng" prop="roomTypeId">
        <el-select v-model="form.roomTypeId" placeholder="Chọn loại phòng" style="width: 100%">
          <el-option v-for="rt in roomTypes" :key="rt.id" :label="rt.name" :value="rt.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Gói giá" prop="ratePlanId">
        <el-select v-model="form.ratePlanId" placeholder="Chọn gói giá" style="width: 100%">
          <el-option v-for="rp in ratePlans" :key="rp.id" :label="rp.name" :value="rp.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Từ ngày" prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="Chọn ngày bắt đầu"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Đến ngày" prop="endDate">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="Chọn ngày kết thúc"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Giá" prop="price">
        <el-input-number v-model="form.price" :min="0" :step="100000" style="width: 100%" />
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
