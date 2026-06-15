<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { guestsApi } from '@/api/guests'
import { IdType, ID_TYPE_OPTIONS } from '@/types/guest'
import { extractErrorMessage } from '@/utils/errors'

const props = defineProps<{ id?: string }>()
const router = useRouter()

const isEdit = computed(() => !!props.id)
const guestId = computed(() => Number(props.id))

const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  idType: IdType.NationalId as IdType,
  idNumber: '',
  nationality: '',
  address: '',
  notes: '',
  dateOfBirth: null as string | null,
})

const rules: FormRules = {
  fullName: [
    { required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' },
    { max: 150, message: 'Họ tên tối đa 150 ký tự', trigger: 'blur' },
  ],
  email: [
    {
      validator: (_rule, value: string, callback) => {
        if (!value) return callback()
        callback(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : new Error('Email không hợp lệ'))
      },
      trigger: 'blur',
    },
  ],
  phone: [
    {
      validator: (_rule, value: string, callback) => {
        if (!value) return callback()
        callback(/^0\d{9,10}$/.test(value) ? undefined : new Error('Số điện thoại không hợp lệ'))
      },
      trigger: 'blur',
    },
  ],
}

async function loadGuest() {
  if (!isEdit.value) return
  loading.value = true
  try {
    const { data } = await guestsApi.getGuestById(guestId.value)
    form.fullName = data.fullName
    form.email = data.email ?? ''
    form.phone = data.phone ?? ''
    form.idType = IdType[data.idType]
    // NOTE: GuestDto chưa trả về IdNumber -> để trống khi sửa (xem README/TODO backend).
    form.idNumber = ''
    form.nationality = data.nationality ?? ''
    form.address = data.address ?? ''
    form.notes = data.notes ?? ''
    form.dateOfBirth = data.dateOfBirth ?? null
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
    router.replace({ name: 'guest-list' })
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      idType: form.idType,
      idNumber: form.idNumber,
      nationality: form.nationality,
      address: form.address,
    }

    if (isEdit.value) {
      const { data } = await guestsApi.updateGuest(guestId.value, {
        ...payload,
        notes: form.notes,
        dateOfBirth: form.dateOfBirth,
      })
      ElMessage.success('Cập nhật khách hàng thành công')
      router.push({ name: 'guest-detail', params: { id: data.id } })
    } else {
      const { data } = await guestsApi.createGuest(payload)
      ElMessage.success('Tạo khách hàng thành công')
      router.push({ name: 'guest-detail', params: { id: data.id } })
    }
  } catch (err) {
    ElMessage.error(extractErrorMessage(err))
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.back()
}

onMounted(loadGuest)
</script>

<template>
  <div v-loading="loading" class="guest-form">
    <h2 class="guest-form__title">
      {{ isEdit ? `Sửa khách hàng #${props.id}` : 'Thêm khách hàng mới' }}
    </h2>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="140px"
      class="guest-form__form"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Họ tên" prop="fullName">
        <el-input v-model="form.fullName" placeholder="Nguyễn Văn A" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="example@email.com" />
      </el-form-item>

      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="form.phone" placeholder="0912345678" />
      </el-form-item>

      <el-form-item label="Loại giấy tờ" prop="idType">
        <el-select v-model="form.idType" style="width: 100%">
          <el-option
            v-for="opt in ID_TYPE_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Số giấy tờ" prop="idNumber">
        <el-input v-model="form.idNumber" placeholder="CCCD/CMND hoặc số hộ chiếu" />
      </el-form-item>

      <el-form-item label="Quốc tịch" prop="nationality">
        <el-input v-model="form.nationality" placeholder="Việt Nam" />
      </el-form-item>

      <el-form-item label="Địa chỉ" prop="address">
        <el-input v-model="form.address" type="textarea" :rows="2" />
      </el-form-item>

      <template v-if="isEdit">
        <el-form-item label="Ngày sinh" prop="dateOfBirth">
          <el-date-picker
            v-model="form.dateOfBirth"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Ghi chú" prop="notes">
          <el-input v-model="form.notes" type="textarea" :rows="2" />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="onSubmit">
          {{ isEdit ? 'Lưu thay đổi' : 'Tạo khách hàng' }}
        </el-button>
        <el-button @click="onCancel">Hủy</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.guest-form {
  background: #fff;
  padding: 24px;
  border-radius: 4px;
  max-width: 640px;
}

.guest-form__title {
  margin-top: 0;
  margin-bottom: 24px;
}
</style>
