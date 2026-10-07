import { client } from '../client';
import { ApiError, requestResult } from '../request';
import { type PagedResult } from '../types';
import { activityPageSchema, type ActivityKind, type UserActivity } from './types';

export const ACTIVITY_PAGE_SIZE = 10;

export const parseActivityPage = (
  payload: unknown,
  userId: number,
  kind: ActivityKind,
  page: number
): PagedResult<UserActivity> => {
  const parsed = activityPageSchema(kind).safeParse(payload);
  if (!parsed.success) {
    throw new ApiError('활동 데이터 응답 형식을 확인해 주세요.', 502, 'INVALID_ACTIVITY_RESPONSE');
  }
  const result = parsed.data;
  if (result.content.some((item) => item.user_id !== String(userId))) {
    throw new ApiError('선택한 사용자와 데이터 소유자가 일치하지 않습니다.', 502, 'ACTIVITY_OWNER_MISMATCH');
  }
  if (
    result.page !== page ||
    result.size !== ACTIVITY_PAGE_SIZE ||
    result.content.length > result.size ||
    result.totalPages !== Math.ceil(result.totalElements / result.size) ||
    result.first !== (page === 0) ||
    result.last !== page >= result.totalPages - 1 ||
    result.content.length !== Math.min(result.size, Math.max(0, result.totalElements - page * result.size))
  ) {
    throw new ApiError('활동 데이터 페이지 정보를 확인해 주세요.', 502, 'INVALID_ACTIVITY_PAGINATION');
  }
  return result;
};

/** 관리자 전용 API 계약. 일반 사용자 본인 조회 API로 대체하지 않는다. */
export const getUserActivity = async (userId: number, kind: ActivityKind, page: number, signal?: AbortSignal) => {
  if (!Number.isSafeInteger(userId) || userId <= 0 || !Number.isSafeInteger(page) || page < 0) {
    throw new ApiError('잘못된 조회 조건입니다.', 400, 'INVALID_ACTIVITY_PARAMS');
  }
  const payload = await requestResult<unknown>(
    client.get(`/api/v1/admin/users/${userId}/${kind}`, {
      params: { page, size: ACTIVITY_PAGE_SIZE },
      signal,
    })
  );
  return parseActivityPage(payload, userId, kind, page);
};
