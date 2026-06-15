<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <el-result icon="warning" title="404" sub-title="Trang bạn tìm không tồn tại.">
    <template #extra>
      <el-button type="primary" @click="router.push('/guests')">Về trang chủ</el-button>
    </template>
  </el-result>
</template>
