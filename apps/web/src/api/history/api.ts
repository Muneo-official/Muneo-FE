import 'server-only';
import { cache } from 'react';
import { serverFetch } from '../server-client';
import { type EstimateItem, type RiskItem } from './types';

/**
 * 목록 응답을 배열로 정규화한다.
 * AI 중계 엔드포인트는 원본 배열을 그대로 내려주지만, 공통 응답 봉투(`{ result }`)로
 * 감싸 오거나 예상 밖의 형태가 오는 경우가 있어 배열이 아니면 빈 목록으로 대체한다.
 */
const asList = <T>(payload: unknown, label: string): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const result = (payload as { result?: unknown } | null)?.result;
  if (Array.isArray(result)) {
    return result as T[];
  }

  console.warn(`[history] ${label} 응답이 배열이 아니라 빈 목록으로 대체`, payload);
  return [];
};

export const getServerEstimates = cache(
  async (userId: number): Promise<EstimateItem[]> =>
    asList<EstimateItem>(
      await serverFetch<unknown>('api/v1/estimates', { headers: { 'x-user-id': String(userId) } }),
      'estimates'
    )
);

export const getServerRiskDetections = cache(
  async (userId: number): Promise<RiskItem[]> =>
    asList<RiskItem>(
      await serverFetch<unknown>('api/v1/risk-detector', { headers: { 'x-user-id': String(userId) } }),
      'risk-detector'
    )
);

const settleList = async <T>(promise: Promise<T[]>, label: string): Promise<T[]> => {
  try {
    return await promise;
  } catch (e) {
    // 한쪽 API가 죽어도 페이지는 살리는 의도된 폴백이므로 warn 레벨로만 남긴다.
    console.warn(`[history] ${label} 조회 실패 — 빈 목록으로 대체`, e);
    return [];
  }
};

/**
 * 견적/리스크 이력을 함께 조회한다. 한쪽 API가 실패해도 페이지 전체가 죽지 않도록
 * 실패한 목록은 빈 배열로 대체한다.
 */
export const getServerHistory = cache(
  async (userId: number): Promise<{ estimates: EstimateItem[]; risks: RiskItem[] }> => {
    const [estimates, risks] = await Promise.all([
      settleList(getServerEstimates(userId), 'estimates'),
      settleList(getServerRiskDetections(userId), 'risk-detector'),
    ]);
    return { estimates, risks };
  }
);
