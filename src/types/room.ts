import type { PagedResult } from '@/types/guest'

// Mirrors Domain/Enums/RoomStatus.cs
// IMPORTANT: backend has no JsonStringEnumConverter, so requests must send this
// as a NUMBER (0..3). Responses (RoomDto.status) come back as STRING.
export const RoomStatus = {
  Available: 0,
  Occupied: 1,
  OutOfOrder: 2,
  OutOfService: 3,
} as const
export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus]

// Mirrors Domain/Enums/HousekeepingStatus.cs (same number-in/string-out rule)
export const HousekeepingStatus = {
  Dirty: 0,
  Cleaning: 1,
  Clean: 2,
  Inspected: 3,
} as const
export type HousekeepingStatus = (typeof HousekeepingStatus)[keyof typeof HousekeepingStatus]

// String name as returned by the API (RoomStatus.ToString())
export type RoomStatusName = keyof typeof RoomStatus
export type HousekeepingStatusName = keyof typeof HousekeepingStatus

// Labels + Element Plus tag types for display
export const ROOM_STATUS_META: Record<
  RoomStatusName,
  { label: string; tag: 'success' | 'danger' | 'info' | 'warning' | 'primary' }
> = {
  Available: { label: 'Trống (Available)', tag: 'success' },
  Occupied: { label: 'Có khách (Occupied)', tag: 'danger' },
  OutOfOrder: { label: 'Hỏng (Out of Order)', tag: 'info' },
  OutOfService: { label: 'Ngừng phục vụ (OOS)', tag: 'warning' },
}

export const HOUSEKEEPING_STATUS_META: Record<
  HousekeepingStatusName,
  { label: string; tag: 'success' | 'danger' | 'info' | 'warning' | 'primary' }
> = {
  Dirty: { label: 'Bẩn (Dirty)', tag: 'warning' },
  Cleaning: { label: 'Đang dọn (Cleaning)', tag: 'info' },
  Clean: { label: 'Sạch (Clean)', tag: 'success' },
  Inspected: { label: 'Đã kiểm (Inspected)', tag: 'primary' },
}

// Options for <el-select> (value = number to send to backend)
export const ROOM_STATUS_OPTIONS = (
  Object.keys(ROOM_STATUS_META) as RoomStatusName[]
).map((name) => ({ label: ROOM_STATUS_META[name].label, value: RoomStatus[name] }))

export const HOUSEKEEPING_STATUS_OPTIONS = (
  Object.keys(HOUSEKEEPING_STATUS_META) as HousekeepingStatusName[]
).map((name) => ({ label: HOUSEKEEPING_STATUS_META[name].label, value: HousekeepingStatus[name] }))

// Mirrors Application/Common/DTOs/RoomDto.cs (camelCase JSON; enums as strings)
export interface RoomDto {
  id: number
  roomNumber: string
  floor: number
  roomTypeId: number
  roomTypeName: string
  status: RoomStatusName
  housekeepingStatus: HousekeepingStatusName
  notes?: string | null
}

// Body for POST /api/rooms (enums sent as NUMBER)
export interface CreateRoomRequest {
  roomNumber: string
  floor: number
  roomTypeId: number
  status: RoomStatus
  housekeepingStatus: HousekeepingStatus
  notes?: string | null
}

// Body for PUT /api/rooms/{id}
export interface UpdateRoomRequest extends CreateRoomRequest {
  id: number
}

// Query params for GET /api/rooms
export interface GetRoomsParams {
  search?: string
  pageNumber?: number
  pageSize?: number
}

export type { PagedResult }
