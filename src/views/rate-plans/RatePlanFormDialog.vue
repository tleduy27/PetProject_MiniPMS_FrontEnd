<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ratePlansApi } from '@/api/ratePlans'
import type { RatePlanDto } from '@/types/ratePlan'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{
  modelValue: boolean
  ratePlan: RatePlanDto | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [ratePlan: RatePlanDto]
}>()

const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  name: '',
  description: '',
  isIncludeBreakfast: false,
  isActive: true,
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Tên gói giá không được để trống', trigger: 'blur' },
    { max: 100, message: 'Tên tối đa 100 ký tự', trigger: 'blur' },
  ],
}

function resetForm() {
  const rp = props.ratePlan
  isEdit.value = !!rp
  form.name = rp?.name ?? ''
  form.description = rp?.description ?? ''
  form.isIncludeBreakfast = rp?.isIncludeBreakfast ?? false
  form.isActive = rp?.isActive ?? true
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
      isIncludeBreakfast: form.isIncludeBreakfast,
      isActive: form.isActive,
    }

    const { data } = isEdit.value
      ? await ratePlansApi.updateRatePlan(props.ratePlan!.id, { ...payload, id: props.ratePlan!.id })
      : await ratePlansApi.createRatePlan(payload)

    ElMessage.success(isEdit.value ? 'Cập nhật gói giá thành công' : 'Tạo gói giá thành công')
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
    :title="isEdit ? `Sửa gói giá #${ratePlan?.id}` : 'Thêm gói giá mới'"
    width="480px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" @submit.prevent="onSubmit">
      <el-form-item label="Tên gói giá" prop="name">
        <el-input v-model="form.name" placeholder="Room Only, Bed & Breakfast..." />
      </el-form-item>

      <el-form-item label="Mô tả" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" />
      </el-form-item>

      <el-form-item label="Gồm ăn sáng" prop="isIncludeBreakfast">
        <el-switch v-model="form.isIncludeBreakfast" />
      </el-form-item>

      <el-form-item label="Đang sử dụng" prop="isActive">
        <el-switch v-model="form.isActive" />
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
