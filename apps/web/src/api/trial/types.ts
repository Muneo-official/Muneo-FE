import { type RiskAnalyzeRequestBody, type RiskDetectAnalyzeResponse } from '@/api/analyze';
import { type EstimateGenerateRequest, type EstimateGenerateResponse } from '@/api/estimate';

export type TrialKind = 'analysis' | 'estimate';
export interface AnalysisPreview {
  kind: 'analysis';
  expiresAt: string;
  totalItems: number;
  counts: { 누락: number; 중복: number; 불분명: number };
  firstItem: { process: string; status: string; title: string; description: string; guide: string } | null;
}
export interface EstimatePreview {
  kind: 'estimate';
  expiresAt: string;
  totalProcesses: number;
  firstProcess: { name: string; min: number; max: number } | null;
}
export type TrialPreview = AnalysisPreview | EstimatePreview;
export interface FullAnalysisTrial {
  input: RiskAnalyzeRequestBody;
  result: RiskDetectAnalyzeResponse;
}
export interface FullEstimateTrial {
  input: EstimateGenerateRequest;
  result: EstimateGenerateResponse;
}
