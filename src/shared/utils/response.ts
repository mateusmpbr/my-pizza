export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  meta?: Record<string, unknown>;
}

export function successResponse<T>(
  data: T,
  message: string,
  meta?: Record<string, unknown>,
): ApiResponse<T> {
  return { success: true, data, message, ...(meta ? { meta } : {}) };
}

export function errorResponse(message: string, details?: unknown): ApiResponse<null> {
  return { success: false, data: null, message, ...(details ? { details } : {}) };
}
