<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { roomTypesApi } from '@/api/roomTypes'
import type { RoomTypeDto } from '@/types/roomType'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{
  modelValue: boolean
  roomType: RoomTypeDto | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [roomType: RoomTypeDto]
}>()

const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  maxOccupancy: 1,
  basePrice: 0,
  amenities: '',
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Tên loại phòng không được để trống', trigger: 'blur' },
    { max: 100, message: 'Name cannot exceed 100 characters.', trigger: 'blur' },
  ],
  maxOccupancy: [
    { required: true, message: 'Vui lòng nhập số người tối đa', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Số người tối đa phải lớn hơn 0', trigger: 'blur' },
  ],
  basePrice: [
    { type: 'number', min: 0, message: 'Giá không được âm', trigger: 'blur' },
  ],
}

function resetForm() {
  const rt = props.roomType
  isEdit.value = !!rt
  form.name = rt?.name ?? ''
  form.description = rt?.description ?? ''
  form.maxOccupancy = rt?.maxOccupancy ?? 1
  form.basePrice = rt?.basePrice ?? 0
  form.amenities = rt?.amenities ?? ''
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
      name: form.name,
      description: form.description || null,
      maxOccupancy: form.maxOccupancy,
      basePrice: form.basePrice,
      amenities: form.amenities || null,
    }

    const { data } = isEdit.value
      ? await roomTypesApi.updateRoomType(props.roomType!.id, { ...payload, id: props.roomType!.id })
      : await roomTypesApi.createRoomType(payload)

    ElMessage.success(isEdit.value ? 'Cập nhật loại phòng thành công' : 'Tạo loại phòng thành công')
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
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? `Sửa loại phòng #${roomType?.id}` : 'Thêm loại phòng mới'"
    width="480px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" @submit.prevent="onSubmit">
      <el-form-item label="Tên loại phòng" prop="name">
        <el-input v-model="form.name" placeholder="Deluxe, Standard, Suite..." />
      </el-form-item>

      <el-form-item label="Số người tối đa" prop="maxOccupancy">
        <el-input-number v-model="form.maxOccupancy" :min="1" style="width: 100%" />
      </el-form-item>

      <el-form-item label="Giá cơ bản" prop="basePrice">
        <el-input-number
          v-model="form.basePrice"
          :min="0"
          :step="100000"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Mô tả" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item label="Tiện ích" prop="amenities">
        <el-input
          v-model="form.amenities"
          type="textarea"
          :rows="2"
          placeholder="WiFi, TV, Minibar, ..."
        />
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
