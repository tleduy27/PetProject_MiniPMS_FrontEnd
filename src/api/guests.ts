import { http } from './http'
import type {
  CreateGuestRequest,
  GetGuestsParams,
  GuestDto,
  PagedResult,
  UpdateGuestRequest,
} from '@/types/guest'

export const guestsApi = {
  // GET /api/guests?search=&pageNumber=&pageSize=
  getGuests(params: GetGuestsParams) {
    return http.get<PagedResult<GuestDto>>('/guests', { params })
  },

  // GET /api/guests/{id} -> 404 (NotFoundException) if missing
  getGuestById(id: number) {
    return http.get<GuestDto>(`/guests/${id}`)
  },

  // POST /api/guests
  createGuest(payload: CreateGuestRequest) {
    return http.post<GuestDto>('/guests', payload)
  },

  // PUT /api/guests/{id}
  // NOTE: backend UpdateGuestCommand/endpoint is not implemented yet (Phase 1 TODO).
  updateGuest(id: number, payload: UpdateGuestRequest) {
    return http.put<GuestDto>(`/guests/${id}`, payload)
  },
}
