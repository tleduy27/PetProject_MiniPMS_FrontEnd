// Mirrors Application/Common/DTOs/RoomRateDto.cs (camelCase JSON)
// Lưu ý: startDate/endDate trả về dạng ISO "2026-07-01T00:00:00".
export interface RoomRateDto {
  id: number
  roomTypeId: number
  ratePlanId: number
  startDate: string
  endDate: string
  price: number
}

// Mirrors Application/RoomRates/Command/CreateRoomRateCommand.cs
// startDate/endDate gửi lên dạng "YYYY-MM-DD" (backend parse DateTime OK).
export interface CreateRoomRateRequest {
  roomTypeId: number
  ratePlanId: number
  startDate: string
  endDate: string
  price: number
}

// Mirrors Application/RoomRates/Command/UpdateRoomRateCommand.cs
export interface UpdateRoomRateRequest extends CreateRoomRateRequest {
  id: number
}

// Query params cho GET /api/roomrates?roomTypeId=
export interface GetRoomRatesParams {
  roomTypeId?: number
}
