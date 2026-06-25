<script setup lang="ts">
import { useRoute } from 'vue-router'
import { User, OfficeBuilding, House, Tickets, Money } from '@element-plus/icons-vue'

const route = useRoute()
</script>

<template>
  <el-container class="layout">
    <el-aside width="220px" class="layout__aside">
      <div class="layout__logo">Mini PMS</div>
      <el-menu
        :default-active="route.path"
        router
        class="layout__menu"
        background-color="#1f2d3d"
        text-color="#c8d1dc"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/guests">
          <el-icon><User /></el-icon>
          <span>Khách hàng (Guests)</span>
        </el-menu-item>
        <el-menu-item index="/room-types">
          <el-icon><OfficeBuilding /></el-icon>
          <span>Loại phòng (Room Types)</span>
        </el-menu-item>
        <el-menu-item index="/rooms">
          <el-icon><House /></el-icon>
          <span>Phòng (Rooms)</span>
        </el-menu-item>
        <el-menu-item index="/rate-plans">
          <el-icon><Tickets /></el-icon>
          <span>Gói giá (Rate Plans)</span>
        </el-menu-item>
        <el-menu-item index="/room-rates">
          <el-icon><Money /></el-icon>
          <span>Giá theo ngày (Room Rates)</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout__header">
        <span>Mini PMS</span>
      </el-header>
      <el-main class="layout__main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.layout__aside {
  background: #1f2d3d;
  color: #fff;
}

.layout__logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.layout__menu {
  border-right: none;
  background: transparent;
}

.layout__header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.layout__main {
  background: #f5f7fa;
}
</style>
