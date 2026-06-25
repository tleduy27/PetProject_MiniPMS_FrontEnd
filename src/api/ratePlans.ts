import { http } from './http'
import type { CreateRatePlanRequest, RatePlanDto, UpdateRatePlanRequest } from '@/types/ratePlan'

export const ratePlansApi = {
  // GET /api/rateplans
  getRatePlans() {
    return http.get<RatePlanDto[]>('/rateplans')
  },

  // GET /api/rateplans/{id} -> 404 nếu không tồn tại
  getRatePlanById(id: number) {
    return http.get<RatePlanDto>(`/rateplans/${id}`)
  },

  // POST /api/rateplans -> 201 Created
  createRatePlan(payload: CreateRatePlanRequest) {
    return http.post<RatePlanDto>('/rateplans', payload)
  },

  // PUT /api/rateplans/{id}
  updateRatePlan(id: number, payload: UpdateRatePlanRequest) {
    return http.put<RatePlanDto>(`/rateplans/${id}`, payload)
  },

  // DELETE /api/rateplans/{id} -> 204; nếu đang được reservation dùng -> 409 (ConflictException)
  deleteRatePlan(id: number) {
    return http.delete<void>(`/rateplans/${id}`)
  },
}
