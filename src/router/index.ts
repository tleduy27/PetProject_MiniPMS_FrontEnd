import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/guests',
    },
    {
      path: '/guests',
      name: 'guest-list',
      component: () => import('@/views/guests/GuestListView.vue'),
    },
    {
      path: '/guests/new',
      name: 'guest-create',
      component: () => import('@/views/guests/GuestFormView.vue'),
    },
    {
      path: '/guests/:id(\\d+)',
      name: 'guest-detail',
      component: () => import('@/views/guests/GuestDetailView.vue'),
      props: true,
    },
    {
      path: '/guests/:id(\\d+)/edit',
      name: 'guest-edit',
      component: () => import('@/views/guests/GuestFormView.vue'),
      props: true,
    },
    {
      path: '/room-types',
      name: 'room-type-list',
      component: () => import('@/views/room-types/RoomTypeListView.vue'),
    },
    {
      path: '/rooms',
      name: 'room-list',
      component: () => import('@/views/rooms/RoomListView.vue'),
    },
    {
      path: '/rate-plans',
      name: 'rate-plan-list',
      component: () => import('@/views/rate-plans/RatePlanListView.vue'),
    },
    {
      path: '/room-rates',
      name: 'room-rate-list',
      component: () => import('@/views/room-rates/RoomRateListView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
