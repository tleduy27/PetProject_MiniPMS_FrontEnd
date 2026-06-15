import { http } from './http'
import type { CreateRoomTypeRequest, RoomTypeDto, UpdateRoomTypeRequest } from '@/types/roomType'

export const roomTypesApi = {
  // GET /api/roomtypes
  getRoomTypes() {
    return http.get<RoomTypeDto[]>('/roomtypes')
  },

  // GET /api/roomtypes/{id} -> 404 (NotFoundException) if missing
  getRoomTypeById(id: number) {
    return http.get<RoomTypeDto>(`/roomtypes/${id}`)
  },

  // POST /api/roomtypes -> 201 Created
  createRoomType(payload: CreateRoomTypeRequest) {
    return http.post<RoomTypeDto>('/roomtypes', payload)
  },

  // PUT /api/roomtypes/{id}
  updateRoomType(id: number, payload: UpdateRoomTypeRequest) {
    return http.put<RoomTypeDto>(`/roomtypes/${id}`, payload)
  },

  // DELETE /api/roomtypes/{id} -> 204 No Content
  // Nếu RoomType đang có Room dùng -> backend throw InvalidOperationException
  // (không được middleware bắt -> 500), FE chỉ hiển thị message lỗi chung.
  deleteRoomType(id: number) {
    return http.delete<void>(`/roomtypes/${id}`)
  },
}
