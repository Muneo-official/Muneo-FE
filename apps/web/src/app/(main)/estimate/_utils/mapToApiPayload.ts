import { type EstimateGenerateRequest } from '@/api/estimate';
import { type Step1Data } from '../_types/step1';
import { type Step2Data } from '../_types/step2';
import { type Step3Data } from '../_types/step3';
import { type Step4Data } from '../_types/step4';

const PROCESS_ID_TO_KO: Record<string, string> = {
  demolition: '철거',
  electrical: '전기/조명',
  carpentry: '목공',
  wallpaper: '도배',
  flooring: '마루',
  bathroom: '욕실',
  kitchen: '주방',
  painting: '도장',
  finishing: '마감/공과잡비',
  sash: '창호',
  door: '도어',
  film: '필름',
  furniture: '가구',
};

const parseRoomCount = (roomCount: string): number => {
  if (roomCount === '4개 이상') {
    return 4;
  }
  return parseInt(roomCount, 10);
};

const normalizeBuildingAge = (age: string): string => age.replace(/\s/g, '');

const normalizeOccupancy = (occupancy: string): string => occupancy.replace(/\s/g, '');

const parseBathroomCount = (count: string): number => {
  if (count === '3개 이상') {
    return 3;
  }
  return parseInt(count, 10);
};

const stripParens = (value: string): string => value.replace(/\(.*?\)/g, '').trim();

export const mapToApiPayload = (
  step1: Step1Data,
  step2: Step2Data,
  step3: Step3Data,
  step4: Step4Data
): EstimateGenerateRequest => {
  const { selectedProcesses, mode } = step2;
  const koProcessNames = selectedProcesses
    .filter((id) => PROCESS_ID_TO_KO[id] !== undefined)
    .map((id) => {
      if (id === 'flooring') {
        return step4.flooring?.floorMaterial === '장판' ? '장판' : '마루';
      }
      return PROCESS_ID_TO_KO[id];
    });

  const hasDemolition = selectedProcesses.includes('demolition');
  const hasWallpaper = selectedProcesses.includes('wallpaper');
  const hasFlooring = selectedProcesses.includes('flooring');
  const hasBathroom = selectedProcesses.includes('bathroom');
  const hasKitchen = selectedProcesses.includes('kitchen');

  const payload: EstimateGenerateRequest = {
    공종: koProcessNames,
    시공범위: mode === 'full' ? '전체' : '부분',
    공간유형: step1.spaceType ?? '',
    평수: step1.area ?? 0,
    방개수: step1.roomCount ? parseRoomCount(step1.roomCount) : 0,
    지역: step1.region ?? '',
    건물연식: step3.buildingAge ? normalizeBuildingAge(step3.buildingAge) : '',
    자재등급: '중급',
    철거여부: hasDemolition ? '있음' : '없음',
    층수: step3.floor ?? 0,
    엘리베이터: step3.elevator ?? '',
    트럭접근: step3.truckAccess ?? '',
    거주중공사: step3.occupancy ? normalizeOccupancy(step3.occupancy) : '',
    공사시기: step3.constructionTiming ?? '',
  };

  if (hasWallpaper && step4.wallpaper) {
    const wp = step4.wallpaper;
    let 범위: string[];
    if (wp.wallpaperScope === '부분 도배') {
      범위 = wp.partialRooms;
    } else if (wp.wallpaperScope === '벽면만') {
      범위 = ['벽면'];
    } else {
      범위 = ['전체'];
    }
    payload.도배 = {
      범위,
      도배지종류: wp.wallpaperType ?? '',
      초배포함: wp.underpaperWork === '포함' ? '있음' : wp.underpaperWork === '미포함' ? '없음' : '모름',
    };
  }

  if (hasFlooring && step4.flooring) {
    const fl = step4.flooring;
    payload.마루 = {
      자재종류: fl.floorMaterial ?? '',
      범위: fl.flooringScope ?? '',
      철거여부: fl.floorDemolition === '필요' ? '있음' : fl.floorDemolition === '불필요' ? '없음' : '모름',
    };
  }

  if (hasKitchen && step4.kitchen?.sinkShape) {
    payload.주방 = { 싱크대형태: step4.kitchen.sinkShape };
  }

  if (hasBathroom && step4.bathroom) {
    const bt = step4.bathroom;
    const hasSanitaryWare = bt.sanitaryWare.length > 0;
    const hasShowerbooth = bt.sanitaryWare.includes('욕조') || bt.sanitaryWare.includes('샤워부스');
    payload.욕실 = {
      개수: bt.bathroomCount ? parseBathroomCount(bt.bathroomCount) : 1,
      크기: bt.bathroomSize ? stripParens(bt.bathroomSize) : '',
      도기교체: hasSanitaryWare ? '있음' : '없음',
      방수포함: '있음',
      욕조샤워부스: hasShowerbooth ? '있음' : '없음',
      타일등급: bt.bathroomTileGrade ? stripParens(bt.bathroomTileGrade) : '',
    };
  }

  return payload;
};
