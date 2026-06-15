// Mirrors Application/Common/DTOs/RoomTypeDto.cs (camelCase JSON)
export interface RoomTypeDto {
  id: number
  name: string
  description?: string | null
  maxOccupancy: number
  basePrice: number
  amenities?: string | null
}

// Mirrors Application/RoomTypes/Commands/CreateRoomTypeCommand.cs
export interface CreateRoomTypeRequest {
  name: string
  description?: string | null
  maxOccupancy: number
  basePrice: number
  amenities?: string | null
}

// Mirrors Application/RoomTypes/Commands/UpdateRoomTypeCommand.cs
export interface UpdateRoomTypeRequest extends CreateRoomTypeRequest {
  id: number
}
