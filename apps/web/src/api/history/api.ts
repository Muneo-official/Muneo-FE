import 'server-only';
import { cache } from 'react';
import { serverFetch } from '../server-client';
import { type EstimateItem, type RiskItem } from './types';

export const getServerEstimates = cache(
  async (userId: number): Promise<EstimateItem[]> =>
    serverFetch<EstimateItem[]>('api/v1/estimates', { headers: { 'x-user-id': String(userId) } })
);

export const getServerRiskDetections = cache(
  async (userId: number): Promise<RiskItem[]> =>
    serverFetch<RiskItem[]>('api/v1/risk-detector', { headers: { 'x-user-id': String(userId) } })
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
