import 'server-only';
import { serverFetch } from '@/api/server-client';
import { type FullAnalysisTrial, type FullEstimateTrial } from './types';

export const getFullAnalysisTrial = () => serverFetch<FullAnalysisTrial>('api/v1/trials/analysis/result');
export const getFullEstimateTrial = () => serverFetch<FullEstimateTrial>('api/v1/trials/estimate/result');
