import { describe, expect, it } from 'vitest';
import { isTrialPreview } from './types';

describe('isTrialPreview', () => {
  it('대표 공정 형식의 진단·가견적 결과를 받아들인다', () => {
    expect(isTrialPreview({ kind: 'analysis', sections: [], report: { process_sections: [] } }, 'analysis')).toBe(true);
    expect(isTrialPreview({ kind: 'estimate', input: {}, result: {}, lockedProcesses: [] }, 'estimate')).toBe(true);
  });

  it('배포 전환 중 이전 형식으로 보관된 결과와 다른 종류의 결과는 거른다', () => {
    expect(isTrialPreview({ kind: 'analysis', totalItems: 2, firstItem: null }, 'analysis')).toBe(false);
    expect(isTrialPreview({ kind: 'estimate', firstProcess: null }, 'estimate')).toBe(false);
    expect(isTrialPreview({ kind: 'estimate', input: {}, result: {}, lockedProcesses: [] }, 'analysis')).toBe(false);
    expect(isTrialPreview(null, 'analysis')).toBe(false);
  });
});
