import { create } from 'zustand';
import { analyzeRisk, type RiskAnalyzeRequestBody, type RiskReport } from '@/api/analyze';
import { trackEvent } from '@/lib/analytics';
import { buildAnalysisPayload } from '../_lib/analysisPayload';
import { isBoothDemoMode, runBoothDemoAnalysis } from '../_lib/boothDemo';
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
  savedReportId: string | null;
  setSavedReportId: (id: string) => void;
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
  savedReportId: null,
  setSavedReportId: (savedReportId) => set({ savedReportId }),
  setForm: (patch) => set((s) => ({ form: { ...s.form, ...patch } })),
  addFile: (file) =>
    set((s) => ({
      files: [...s.files, { file, name: file.name, size: formatSize(file.size) }],
    })),
  removeFile: (name) => set((s) => ({ files: s.files.filter((f) => f.name !== name) })),
  submitAnalysis: async (userId) => {
    if (_abortController) {
      return;
    }
    const controller = new AbortController();
    _abortController = controller;
    set({ loading: true, error: null });
    try {
      const { form, files } = get();
      const { input, body } = buildAnalysisPayload(form, files);
      const { report } = isBoothDemoMode()
        ? await runBoothDemoAnalysis(input, controller.signal)
        : await analyzeRisk(body, userId, controller.signal);
      if (controller.signal.aborted || _abortController !== controller) {
        return;
      }
      set({
        savedReportId: null,
        diagnosisResult: mapApiReportToDiagnosisResult(report),
        rawReport: report,
        rawInput: input,
        view: 'report',
        loading: false,
      });
      trackEvent('analysis_submit_success', { file_count: files.length });
    } catch (error) {
      if (controller.signal.aborted || _abortController !== controller) {
        return;
      }
      trackEvent('analysis_submit_error', { file_count: get().files.length });
      set({ error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.', loading: false });
    } finally {
      if (_abortController === controller) {
        _abortController = null;
      }
    }
  },
  cancelAnalysis: () => {
    _abortController?.abort();
    _abortController = null;
    set({ view: 'input', error: null, loading: false });
  },
  reset: () => {
    _abortController?.abort();
    _abortController = null;
    set({
      view: 'input',
      form: { ...DEFAULT_FORM },
      files: [],
      diagnosisResult: null,
      rawReport: null,
      rawInput: null,
      savedReportId: null,
      error: null,
      loading: false,
    });
  },
}));
