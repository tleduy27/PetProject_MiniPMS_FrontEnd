// Mirrors Domain/Enums/GuestEnums.cs -> IdType
// IMPORTANT: backend has no JsonStringEnumConverter, so requests (Create/Update)
// must send this as a NUMBER (0 | 1). Responses (GuestDto.IdType) come back as STRING.
export const IdType = {
  NationalId: 0,
  Passport: 1,
} as const

export type IdType = (typeof IdType)[keyof typeof IdType]

export const ID_TYPE_LABEL: Record<string, string> = {
  NationalId: 'CCCD/CMND',
  Passport: 'Hộ chiếu (Passport)',
}

export const ID_TYPE_OPTIONS = [
  { label: 'CCCD/CMND', value: IdType.NationalId },
  { label: 'Hộ chiếu (Passport)', value: IdType.Passport },
]

// Mirrors Application/Common/DTOs/GuestDto.cs (camelCase JSON)
export interface GuestDto {
  id: number
  fullName: string
  email?: string | null
  phone?: string | null
  idType: 'NationalId' | 'Passport'
  nationality?: string | null
  dateOfBirth?: string | null
  address?: string | null
  notes?: string | null
  createAt: string
}

// Mirrors Application/Guests/Command/CreateGuestCommand.cs
export interface CreateGuestRequest {
  fullName: string
  email: string
  phone: string
  idType: IdType
  idNumber: string
  nationality: string
  address: string
}

// Used for the (to-be-implemented) PUT /api/guests/{id} endpoint
export interface UpdateGuestRequest extends CreateGuestRequest {
  notes?: string
  dateOfBirth?: string | null
}

// Mirrors Application/Guests/Queries/GetGuestsQuery.cs
export interface GetGuestsParams {
  search?: string
  pageNumber?: number
  pageSize?: number
}

// Mirrors Application/Common/Models/PagedResult.cs (camelCase JSON)
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}
