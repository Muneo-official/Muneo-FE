export const ESTIMATE_STEPS = [1, 2, 3, 4] as const;
export type EstimateStep = (typeof ESTIMATE_STEPS)[number];

export const STEP_LABELS = {
  1: '기본 정보',
  2: '공정 선택',
  3: '공사 조건',
  4: '견적 확인',
} satisfies Record<EstimateStep, string>;

export interface ProcessInfo<TId extends string = string> {
  id: TId;
  name: string;
  description: string;
}

export const BASIC_PROCESSES = [
  { id: 'demolition', name: '철거', description: '기존 자재/가구 해체\n및 폐기' },
  { id: 'electrical', name: '전기/조명', description: '콘센트 스위치 교체\n조명설치, 배선 증설' },
  { id: 'carpentry', name: '목공', description: '몰딩, 걸레받이\n문/문틀 교체, 천장' },
  { id: 'wallpaper', name: '도배', description: '벽면/천장 벽지 시공\n(실크/합지/천연)' },
  { id: 'flooring', name: '바닥', description: '강마루, 강화마루\n장판 등 바닥재' },
  { id: 'bathroom', name: '욕실', description: '타일, 도기, 수전\n방수, 천장 환풍기' },
  { id: 'kitchen', name: '주방', description: '싱크대, 상판\n후드, 수전' },
  { id: 'painting', name: '도장', description: '베란다 탄성코드\n세라믹/페인트' },
  { id: 'finishing', name: '마감/공과잡비', description: '보양, EV, 입주청소\n폐기물, 현장관리' },
] as const satisfies readonly ProcessInfo[];

export const OPTIONAL_PROCESSES = [
  { id: 'sash', name: '창호 (샷시)', description: '샷시(창문) 교체\n발코니 터닝·폴딩도어' },
  { id: 'door', name: '도어', description: '방문·중문·현관문\n문틀, 손잡이 등 부속' },
  { id: 'film', name: '필름', description: '문틀, 샤시 래핑\n가구 표면 필름' },
  { id: 'furniture', name: '가구', description: '붙박이장, 신발장\n냉장고장 맞춤 제작' },
] as const satisfies readonly ProcessInfo[];

export type BasicProcessId = (typeof BASIC_PROCESSES)[number]['id'];
export type OptionalProcessId = (typeof OPTIONAL_PROCESSES)[number]['id'];
export type ProcessId = BasicProcessId | OptionalProcessId;
