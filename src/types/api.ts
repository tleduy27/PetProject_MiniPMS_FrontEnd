// Mirrors API/Middlewares/ExceptionHandlingMiddleware.cs response shapes

export interface ValidationErrorResponse {
  status: 400
  title: string
  errors: { field: string; message: string }[]
}

export interface NotFoundErrorResponse {
  status: 404
  title: string
  message: string
}

export type ApiErrorResponse = ValidationErrorResponse | NotFoundErrorResponse
