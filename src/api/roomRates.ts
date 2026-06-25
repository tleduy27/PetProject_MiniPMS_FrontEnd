import { http } from './http'
import type {
  CreateRoomRateRequest,
  GetRoomRatesParams,
  RoomRateDto,
  UpdateRoomRateRequest,
} from '@/types/roomRate'

export const roomRatesApi = {
  // GET /api/roomrates?roomTypeId=  (roomTypeId optional)
  getRoomRates(params?: GetRoomRatesParams) {
    return http.get<RoomRateDto[]>('/roomrates', { params })
  },

  // GET /api/roomrates/{id} -> 404 nếu không tồn tại
  getRoomRateById(id: number) {
    return http.get<RoomRateDto>(`/roomrates/${id}`)
  },

  // POST /api/roomrates -> 201; nếu khoảng ngày đè nhau -> 409 (ConflictException)
  createRoomRate(payload: CreateRoomRateRequest) {
    return http.post<RoomRateDto>('/roomrates', payload)
  },

  // PUT /api/roomrates/{id}
  updateRoomRate(id: number, payload: UpdateRoomRateRequest) {
    return http.put<RoomRateDto>(`/roomrates/${id}`, payload)
  },

  // DELETE /api/roomrates/{id} -> 204
  deleteRoomRate(id: number) {
    return http.delete<void>(`/roomrates/${id}`)
  },
}
