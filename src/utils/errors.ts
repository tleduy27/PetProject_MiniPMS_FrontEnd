import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api'

export function extractErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<ApiErrorResponse>
  const data = axiosErr.response?.data

  if (data && 'errors' in data && data.errors?.length) {
    return data.errors.map((e) => e.message).join('; ')
  }
  if (data && 'message' in data && data.message) {
    return data.message
  }
  if (data && 'title' in data && data.title) {
    return data.title
  }
  return axiosErr.message || 'Đã có lỗi xảy ra'
}
