import { describe, expect, it } from 'vitest';
import {
  getMissingProcessFields,
  validateBasicInfo,
  validateConditions,
  validateProcessSelection,
} from './validateEstimate';
import { useEstimateStore } from '../_store/estimateStore';

describe('견적 입력 검증', () => {
  it('기본 정보가 비어 있거나 화장실 개수가 없으면 진행하지 않는다', () => {
    expect(validateBasicInfo(useEstimateStore.getInitialState().step1)).not.toBeNull();
    const data = { region: '서울', spaceType: '아파트', area: 25, roomCount: '3개', bathroomCount: null } as const;
    expect(validateBasicInfo(data)).not.toBeNull();
    expect(validateBasicInfo({ ...data, bathroomCount: '2개' })).toBeNull();
  });
  it('선택한 공정에 대해서만 세부 설정을 요구한다', () => {
    expect(validateProcessSelection({ mode: 'partial', selectedProcesses: ['door'] }, {})).toEqual([]);
    expect(validateProcessSelection({ mode: 'partial', selectedProcesses: ['wallpaper'] }, {})).toHaveLength(1);
  });
  it('부분 도배는 공간 선택을 요구하고 모름도 명시적인 답으로 인정한다', () => {
    const wallpaper = { wallpaperType: '실크벽지', wallpaperScope: '부분 도배', underpaperWork: '모름' } as const;
    expect(getMissingProcessFields('wallpaper', { wallpaper })).toContain('부분 도배 공간');
    expect(getMissingProcessFields('wallpaper', { wallpaper: { ...wallpaper, partialRooms: ['거실'] } })).toEqual([]);
  });
  it('위생도기 미선택과 명시적 교체 안함을 구분한다', () => {
    const bathroom = { bathroomSize: '중형(1~2평)', bathroomTileGrade: '중급' } as const;
    expect(getMissingProcessFields('bathroom', { bathroom })).toHaveLength(1);
    expect(getMissingProcessFields('bathroom', { bathroom: { ...bathroom, sanitaryWare: [] } })).toEqual([]);
  });
  it('공사 조건 누락과 음수/소수 층수를 허용하지 않는다', () => {
    expect(validateConditions(useEstimateStore.getInitialState().step3)).not.toBeNull();
    const conditions = {
      buildingAge: '10년 이하',
      elevator: '있음',
      floor: 0,
      occupancy: '공실',
      truckAccess: '모름',
      constructionTiming: '미정',
    } as const;
    expect(validateConditions(conditions)).toBeNull();
    expect(validateConditions({ ...conditions, floor: -1 })).not.toBeNull();
    expect(validateConditions({ ...conditions, floor: 1.5 })).not.toBeNull();
  });
});
