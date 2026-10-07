import { type Step1Data, type Step2Data, type Step3Data, type Step4Data } from '../_types';

export const validateBasicInfo = (data: Step1Data): string | null => {
  if (!data.region || !data.spaceType || !data.roomCount || !data.bathroomCount || !data.area || data.area <= 0) {
    return '지역, 공간 유형, 전용 면적, 방 개수, 화장실 개수를 모두 입력해 주세요.';
  }
  return null;
};

export const getMissingProcessFields = (process: string, details: Step4Data): string[] => {
  switch (process) {
    case 'wallpaper': {
      const data = details.wallpaper;
      return [
        !data?.wallpaperType && '벽지 종류',
        !data?.wallpaperScope && '시공 범위',
        !data?.underpaperWork && '초배 작업',
        data?.wallpaperScope === '부분 도배' && !data.partialRooms?.length && '부분 도배 공간',
      ].filter(Boolean) as string[];
    }
    case 'flooring': {
      const data = details.flooring;
      return [
        !data?.floorMaterial && '바닥재 종류',
        !data?.flooringScope && '시공 범위',
        !data?.floorDemolition && '기존 바닥 철거',
      ].filter(Boolean) as string[];
    }
    case 'bathroom': {
      const data = details.bathroom;
      return [
        !data?.bathroomSize && '욕실 크기',
        !data?.bathroomTileGrade && '타일 등급',
        data?.sanitaryWare === undefined && '위생도기 (교체 안함 선택 가능)',
      ].filter(Boolean) as string[];
    }
    case 'kitchen':
      return details.kitchen?.sinkShape ? [] : ['싱크대 형태'];
    default:
      return [];
  }
};

export const validateProcessSelection = (selection: Step2Data, details: Step4Data) =>
  selection.selectedProcesses.flatMap((id) => {
    const fields = getMissingProcessFields(id, details);
    return fields.length ? [{ id, fields }] : [];
  });

export const validateConditions = (data: Step3Data): string | null => {
  if (
    !data.buildingAge ||
    !data.elevator ||
    data.floor === null ||
    !Number.isInteger(data.floor) ||
    data.floor < 0 ||
    !data.occupancy ||
    !data.truckAccess ||
    !data.constructionTiming
  ) {
    return '공사 조건을 모두 입력해 주세요. 층수는 0 이상의 정수로 입력해 주세요.';
  }
  return null;
};
