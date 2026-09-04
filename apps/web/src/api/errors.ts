import { type ApiErrorResponse } from './types';

export type ClientError = Error & { status: number; body: unknown };

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly error?: Record<string, string> | string;

  constructor(code: string, message: string, status?: number, error?: Record<string, string> | string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.error = error;
  }
}

export const isClientError = (e: unknown): e is ClientError => e instanceof Error && 'status' in e && 'body' in e;

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;

export const toApiError = (e: unknown): ApiError => {
  if (isClientError(e) && e.body !== null && typeof e.body === 'object') {
    const body = e.body as Partial<ApiErrorResponse> & { detail?: string };
    const message = body.message ?? body.detail ?? 'API 오류가 발생했습니다.';
    return new ApiError(body.code ?? 'UNKNOWN', message, e.status, body.error);
  }
  if (isClientError(e)) {
    return new ApiError('UNKNOWN', 'API 오류가 발생했습니다.', e.status);
  }
  return new ApiError('UNKNOWN', 'API 오류가 발생했습니다.');
};
