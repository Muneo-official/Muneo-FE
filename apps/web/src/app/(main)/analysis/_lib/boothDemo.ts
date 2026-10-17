import { type RiskAnalyzeRequestBody, type RiskDetectAnalyzeResponse } from '@/api/analyze';
import { buildBoothDemoReport } from '../_mocks/boothDemo.mock';

/**
 * 부스 운영용 데모 모드 스위치. 켜져 있으면 진단 API를 호출하지 않고
 * 6~10초 대기 후 퀴즈용 견적서 기준의 고정 레포트를 반환한다.
 * 부스 운영 기간에만 true로 바꾸고, 평소에는 false로 두어 실제 진단 로직을 쓴다.
 */
const BOOTH_DEMO_ENABLED = false;

/**
 * `NEXT_PUBLIC_ANALYSIS_DEMO_MODE`가 'true'/'false'면 상수보다 우선한다.
 * 테스트·E2E는 이를 이용해 데모·실제 진단 경로를 각각 고정한다.
 */
export const isBoothDemoMode = () => {
  const env = process.env.NEXT_PUBLIC_ANALYSIS_DEMO_MODE;
  return env === 'true' || (env !== 'false' && BOOTH_DEMO_ENABLED);
};

export const BOOTH_DEMO_DELAY_MS = { min: 6000, max: 10000 } as const;

const abortError = () => {
  const error = new Error('분석이 취소되었습니다.');
  error.name = 'AbortError';
  return error;
};

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });

export const runBoothDemoAnalysis = async (
  input: RiskAnalyzeRequestBody,
  signal: AbortSignal
): Promise<RiskDetectAnalyzeResponse> => {
  const { min, max } = BOOTH_DEMO_DELAY_MS;
  await wait(min + Math.random() * (max - min), signal);
  return { report: buildBoothDemoReport(input) };
};
