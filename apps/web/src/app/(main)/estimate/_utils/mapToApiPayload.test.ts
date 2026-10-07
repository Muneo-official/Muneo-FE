import { describe, expect, it } from 'vitest';
import { mapToApiPayload } from './mapToApiPayload';
import { type ProcessId, type Step1Data, type Step3Data } from '../_types';

const STEP1: Step1Data = { region: '수도권', spaceType: '아파트', area: 30, roomCount: '3개', bathroomCount: '2개' };

const STEP3: Step3Data = {
  buildingAge: '10~20년 이하',
  elevator: '있음',
  floor: 5,
  occupancy: '공실',
  truckAccess: '가능',
  constructionTiming: '미정',
};

const buildPayload = (selectedProcesses: ProcessId[]) =>
  mapToApiPayload(STEP1, { mode: 'partial', selectedProcesses }, STEP3, {});

describe('mapToApiPayload — 창호/도어 공종', () => {
  it('창호(샷시)만 고르면 "창호"만 보낸다', () => {
    expect(buildPayload(['sash']).공종).toEqual(['창호']);
  });

  it('도어만 고르면 "도어"만 보낸다', () => {
    expect(buildPayload(['door']).공종).toEqual(['도어']);
  });

  it('둘 다 고르면 "창호"와 "도어"를 함께 보낸다', () => {
    expect(buildPayload(['sash', 'door']).공종).toEqual(['창호', '도어']);
  });
});

describe('화장실 개수와 선택한 공정 반영', () => {
  it('기본 정보의 화장실 개수를 욕실 API에 전달하고 교체 안함도 허용한다', () => {
    const result = mapToApiPayload(STEP1, { mode: 'partial', selectedProcesses: ['bathroom'] }, STEP3, {
      bathroom: { bathroomSize: '중형(1~2평)', bathroomTileGrade: '일반', sanitaryWare: [] },
    });
    expect(result.욕실).toMatchObject({ 개수: 2, 도기교체: '없음' });
  });
  it('욕실을 해제하면 이전 상세값을 전송하지 않는다', () => {
    const result = mapToApiPayload(STEP1, { mode: 'partial', selectedProcesses: ['door'] }, STEP3, {
      bathroom: { sanitaryWare: [] },
    });
    expect(result.욕실).toBeUndefined();
  });
});
