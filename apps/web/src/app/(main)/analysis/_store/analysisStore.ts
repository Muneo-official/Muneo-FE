import { create } from 'zustand';
import { analyzeRisk, type RiskAnalyzeRequestBody, type RiskReport } from '@/api/analyze';
import { trackEvent } from '@/lib/analytics';
import { mapApiReportToDiagnosisResult } from '../_lib/mapApiReport';
import { type AnalysisFormData, type DiagnosisResult, type UploadedFile } from '../_types/analysis.types';

const DEFAULT_FORM: AnalysisFormData = {
  spaceType: null,
  pyeong: null,
  roomCount: null,
  floor: null,
  elevator: null,
  region: null,
  buildingAge: null,
  companyName: null,
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

interface AnalysisStore {
  view: 'input' | 'report';
  loading: boolean;
  error: string | null;
  form: AnalysisFormData;
  files: UploadedFile[];
  diagnosisResult: DiagnosisResult | null;
  /** 저장 API에 전달할 원본 분석 결과 */
  rawReport: RiskReport | null;
  /** 저장 API에 전달할 원본 요청 데이터 */
  rawInput: RiskAnalyzeRequestBody | null;
  setForm: (patch: Partial<AnalysisFormData>) => void;
  addFile: (file: File) => void;
  removeFile: (name: string) => void;
  submitAnalysis: (userId: number) => Promise<void>;
  cancelAnalysis: () => void;
  reset: () => void;
}

let _abortController: AbortController | null = null;

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  view: 'input',
  loading: false,
  error: null,
  form: { ...DEFAULT_FORM },
  files: [],
  diagnosisResult: null,
  rawReport: null,
  rawInput: null,
  setForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
  addFile: (file) =>
    set((s) => ({
      files: [...s.files, { file, name: file.name, size: formatSize(file.size) }],
    })),
  removeFile: (name) => set((s) => ({ files: s.files.filter((f) => f.name !== name) })),
  submitAnalysis: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { form, files } = get();

      if (
        !form.spaceType ||
        form.pyeong === null ||
        form.roomCount === null ||
        form.floor === null ||
        !form.elevator ||
        !form.region ||
        !form.buildingAge ||
        !form.companyName
      ) {
        set({ error: '모든 공사 정보를 입력해주세요.', loading: false });
        return;
      }

      // 1. 요청 데이터 구성
      const requestBody: RiskAnalyzeRequestBody = {
        space_type: form.spaceType,
        pyeong: form.pyeong,
        room_count: form.roomCount,
        floor: form.floor,
        elevator: form.elevator === '있음',
        region: form.region,
        building_age: form.buildingAge,
        company_name: form.companyName,
      };

      // 2. multipart FormData 구성 — 각 필드를 개별 form 파라미터로 전송
      const formData = new FormData();
      formData.append('space_type', requestBody.space_type);
      formData.append('pyeong', String(requestBody.pyeong));
      formData.append('room_count', String(requestBody.room_count));
      formData.append('floor', String(requestBody.floor));
      formData.append('elevator', String(requestBody.elevator));
      formData.append('region', requestBody.region);
      formData.append('building_age', requestBody.building_age);
      formData.append('company_name', requestBody.company_name);
      files.forEach((f) => formData.append('files', f.file, f.name));

      // 3. 분석 요청 — 이전 요청이 진행 중이면 먼저 중단
      _abortController?.abort();
      _abortController = new AbortController();
      const { report } = await analyzeRisk(formData, userId, _abortController.signal);

      // 4. UI 상태 업데이트 — 저장은 사용자가 직접 버튼으로 트리거
      const diagnosisResult = mapApiReportToDiagnosisResult(report);
      set({ diagnosisResult, rawReport: report, rawInput: requestBody, view: 'report', loading: false });
      trackEvent('analysis_submit_success', { file_count: files.length });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      trackEvent('analysis_submit_error', { file_count: get().files.length });
      if (process.env.NODE_ENV === 'development') {
        console.error('[견적서 진단] 오류:', err);
      }
      const apiDetail = (err as { body?: { detail?: string } }).body?.detail;
      const errorMessage = apiDetail ?? '분석 중 오류가 발생했습니다.';
      set({ error: errorMessage, loading: false });
    } finally {
      _abortController = null;
    }
  },
  cancelAnalysis: () => {
    _abortController?.abort();
    _abortController = null;
    set({
      view: 'input',
      form: { ...DEFAULT_FORM },
      files: [],
      diagnosisResult: null,
      rawReport: null,
      rawInput: null,
      error: null,
      loading: false,
    });
  },
  reset: () =>
    set({
      view: 'input',
      form: { ...DEFAULT_FORM },
      files: [],
      diagnosisResult: null,
      rawReport: null,
      rawInput: null,
      error: null,
      loading: false,
    }),
}));
