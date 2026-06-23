import { http } from './http'
import type {
  CreateRoomRequest,
  GetRoomsParams,
  PagedResult,
  RoomDto,
  RoomStatus,
  UpdateRoomRequest,
} from '@/types/room'

export const roomsApi = {
  // GET /api/rooms?search=&pageNumber=&pageSize=  -> PagedResult<RoomDto>
  getRooms(params: GetRoomsParams) {
    return http.get<PagedResult<RoomDto>>('/rooms', { params })
  },

  // GET /api/rooms/{id}
  // NOTE: backend chưa expose endpoint này (RoomsController mới có GET list + PATCH status).
  getRoomById(id: number) {
    return http.get<RoomDto>(`/rooms/${id}`)
  },

  // POST /api/rooms
  // NOTE: cần nối CreateRoomCommand vào RoomsController ([HttpPost]) thì UI mới chạy.
  createRoom(payload: CreateRoomRequest) {
    return http.post<RoomDto>('/rooms', payload)
  },

  // PUT /api/rooms/{id}
  // NOTE: cần nối UpdateRoomCommand vào RoomsController ([HttpPut("{id}")]).
  updateRoom(id: number, payload: UpdateRoomRequest) {
    return http.put<RoomDto>(`/rooms/${id}`, payload)
  },

  // DELETE /api/rooms/{id}
  // NOTE: cần nối DeleteRoomCommand vào RoomsController ([HttpDelete("{id}")]).
  deleteRoom(id: number) {
    return http.delete<void>(`/rooms/${id}`)
  },

  // PATCH /api/rooms/{id}/status  — body là RoomStatus dạng SỐ (đã expose sẵn ở backend)
  updateStatus(id: number, newStatus: RoomStatus) {
    return http.patch<RoomDto>(`/rooms/${id}/status`, newStatus)
  },
}
