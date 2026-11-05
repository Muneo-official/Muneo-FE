import { client } from '../client';
import {
  type EstimateGenerateRequest,
  type EstimateGenerateResponse,
  type EstimateSaveRequest,
  type EstimateSaveResponse,
} from './types';

export const generateEstimate = (
  payload: EstimateGenerateRequest,
  signal?: AbortSignal
): Promise<EstimateGenerateResponse> =>
  client.post('api/v1/estimates/generate', { json: payload, signal, timeout: 180000 }).json<EstimateGenerateResponse>();

export const saveEstimate = (payload: EstimateSaveRequest, userId: number): Promise<EstimateSaveResponse> =>
  client
    .post('api/v1/estimates/save', { json: payload, headers: { 'x-user-id': String(userId) } })
    .json<EstimateSaveResponse>();

export const deleteEstimate = (id: string, userId: number): Promise<void> =>
  client.delete(`api/v1/estimates/${id}`, { headers: { 'x-user-id': String(userId) } }).then(() => undefined);
