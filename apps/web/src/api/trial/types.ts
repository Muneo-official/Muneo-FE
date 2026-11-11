import { type RiskAnalyzeRequestBody, type RiskDetectAnalyzeResponse, type RiskReport } from '@/api/analyze';
import { type EstimateGenerateRequest, type EstimateGenerateResponse, type EstimateResultData } from '@/api/estimate';

export type TrialKind = 'analysis' | 'estimate';

export type RiskCounts = { 누락: number; 중복: number; 불분명: number };

/** 진단 공정 요약. 잠긴 공정은 이름과 건수만 받는다. */
export interface AnalysisPreviewSection {
  id: string;
  display_name: string;
  itemCount: number;
  counts: RiskCounts;
  locked: boolean;
}

export interface AnalysisPreview {
  kind: 'analysis';
  expiresAt: string;
  /** 대표 공정 하나만 담긴 레포트. */
  report: Pick<RiskReport, 'subtitle_fields' | 'construction_info' | 'process_sections'>;
  /** 원래 순서대로 나열한 전체 공정. */
  sections: AnalysisPreviewSection[];
  counts: RiskCounts;
  totalItems: number;
}

export interface EstimateLockedProcess {
  name: string;
  itemCount: number;
  /** 전체 결과에 금액 범위가 있는 공정인지. 공정별 합산 표 행 여부를 맞추는 데 쓴다. */
  priced: boolean;
}

export interface EstimatePreview {
  kind: 'estimate';
  expiresAt: string;
  input: EstimateGenerateRequest;
  /** 대표 공정과 데이터 부족 공정의 금액만 담긴 결과. 총 견적 범위는 없다. */
  result: EstimateResultData;
  revealedProcess: string | null;
  lockedProcesses: EstimateLockedProcess[];
}

export type TrialPreview = AnalysisPreview | EstimatePreview;

/** 배포 전환 중 이전 형식으로 보관된 결과는 화면을 그릴 수 없으므로 걸러낸다. */
export const isTrialPreview = (value: unknown, kind: TrialKind): value is TrialPreview => {
  if (!value || typeof value !== 'object' || (value as { kind?: unknown }).kind !== kind) {
    return false;
  }
  if (kind === 'analysis') {
    const preview = value as Partial<AnalysisPreview>;
    return Array.isArray(preview.sections) && Array.isArray(preview.report?.process_sections);
  }
  const preview = value as Partial<EstimatePreview>;
  return Boolean(preview.input && preview.result) && Array.isArray(preview.lockedProcesses);
};

export interface FullAnalysisTrial {
  input: RiskAnalyzeRequestBody;
  result: RiskDetectAnalyzeResponse;
}
export interface FullEstimateTrial {
  input: EstimateGenerateRequest;
  result: EstimateGenerateResponse;
}
