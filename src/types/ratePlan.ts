// Mirrors Application/Common/DTOs/RatePlanDto.cs (camelCase JSON)
export interface RatePlanDto {
  id: number
  name: string
  description?: string | null
  isIncludeBreakfast: boolean
  isActive: boolean
}

// Mirrors Application/RatePlans/Command/CreateRatePlanCommand.cs
export interface CreateRatePlanRequest {
  name: string
  description?: string | null
  isIncludeBreakfast: boolean
  isActive: boolean
}

// Mirrors Application/RatePlans/Command/UpdateRatePlanCommand.cs
export interface UpdateRatePlanRequest extends CreateRatePlanRequest {
  id: number
}
