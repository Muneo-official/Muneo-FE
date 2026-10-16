import { type ApiProcessSection, type RiskAnalyzeRequestBody, type RiskReport } from '@/api/analyze';
import { formatDate } from '@/lib/formatters/formatDate';

/**
 * 부스 퀴즈용 견적서(32평 아파트 리모델링) 기준 고정 진단 결과.
 * 답지 견적서에서 빨간색으로 표시된 항목(부자재 품목 미기재, 방범창 미정, 조명 인건비·폐기물 처리비·하자보수증권 누락)을 담는다.
 */
const BOOTH_DEMO_SECTIONS: ApiProcessSection[] = [
  {
    process: '철거',
    display_name: '철거 공사',
    items: [
      {
        title: '철거 범위 기재',
        description:
          '천장몰딩·걸레받이·도배지·장판, 화장실 2개소, 씽크대, 신발장, 문/문틀 철거와 철거물 폐기처리가 항목별로 나뉘어 있어요.',
        guide: '',
        status: '정상',
      },
    ],
  },
  {
    process: '창호',
    display_name: '창호 공사',
    items: [
      {
        title: '방범창 수량·금액 미기재',
        description:
          '방범창은 단가(개당 12만원)만 있고 수량과 금액이 비어 있어요. 설치 여부가 정해지지 않은 채 계약하면 공사 중 추가 비용으로 청구될 수 있어요.',
        guide: '방범창을 설치하나요? 설치한다면 수량과 금액을, 설치하지 않는다면 "제외"로 견적서에 명시해 주세요.',
        status: '불분명',
      },
    ],
  },
  {
    process: '목공',
    display_name: '목공사',
    items: [
      {
        title: '걸레받이 교체',
        description: '걸레받이(예림 6전) 35개와 부자재·장비대, 인건비, 식대, 운송비가 구분돼 있어요.',
        guide: '',
        status: '정상',
      },
    ],
  },
  {
    process: '타일',
    display_name: '타일 공사',
    items: [
      {
        title: '부자재(35만원) 품목 미기재',
        description:
          '부자재가 "1식"으로만 적혀 있어 본드·시멘트·압착 시멘트 등 어떤 자재가 들어가는지 알 수 없어요. 품목이 없으면 금액이 적정한지, 저가 자재로 바뀌지 않을지 확인하기 어려워요.',
        guide: '타일 부자재 35만원에 포함된 자재(본드, 시멘트, 압착 시멘트 등)의 품목과 수량을 알려 주세요.',
        status: '불분명',
      },
    ],
  },
  {
    process: '도기',
    display_name: '도기 공사',
    items: [
      {
        title: '부자재(4만원) 품목 미기재',
        description:
          '부자재가 "1식"으로만 적혀 있어 세면기·양변기 설치에 쓰는 백시멘트·모래 등이 포함됐는지 알 수 없어요.',
        guide: '도기 부자재 4만원에 포함된 자재(백시멘트, 모래 등)의 품목을 알려 주세요.',
        status: '불분명',
      },
    ],
  },
  {
    process: '수전',
    display_name: '수전 공사',
    items: [
      {
        title: '부자재(3만원) 품목 미기재',
        description:
          '부자재가 "1식"으로만 적혀 있어 테프론·피스·실리콘 등 수전과 욕실 액세서리 설치용 자재가 포함됐는지 알 수 없어요.',
        guide: '수전 부자재 3만원에 포함된 자재(테프론, 피스, 실리콘 등)의 품목을 알려 주세요.',
        status: '불분명',
      },
    ],
  },
  {
    process: '도장',
    display_name: '도장 공사',
    items: [
      {
        title: '부자재(3만원) 품목 미기재',
        description:
          '부자재가 "1식"으로만 적혀 있어 실리콘·카바링(보양재)·사포·퍼티 등 바탕 정리와 보양 자재가 포함됐는지 알 수 없어요.',
        guide: '도장 부자재 3만원에 포함된 자재(실리콘, 카바링, 사포, 퍼티 등)의 품목을 알려 주세요.',
        status: '불분명',
      },
    ],
  },
  {
    process: '전기',
    display_name: '전기 공사',
    items: [
      {
        title: '콘센트·스위치 교체',
        description: '콘센트·단자(나노 아트2 화이트) 32개, 감지기, 소모자재와 전기·입선 인건비가 구분돼 있어요.',
        guide: '',
        status: '정상',
      },
    ],
  },
  {
    process: '조명',
    display_name: '조명 공사',
    items: [
      {
        title: '조명 시공 인건비·식대·운송비 누락',
        description:
          '조명 자재비(56.5만원)만 있고 시공 인건비·식대·운송비가 없어요. 다른 공정은 모두 인건비가 따로 잡혀 있어요. 시공 1일 기준 약 30만원이 추가로 청구될 수 있어요.',
        guide: '조명 시공 인건비·식대·운송비가 견적에 포함되어 있나요? 별도라면 금액을 항목으로 추가해 주세요.',
        status: '누락',
      },
    ],
  },
  {
    process: '도배',
    display_name: '도배 공사',
    items: [
      {
        title: '실크벽지 시공',
        description: '핸디퍼티·샌딩, 실크벽지(디딤·개나리) 80평, 부자재 품목과 기공 인건비가 구분돼 있어요.',
        guide: '',
        status: '정상',
      },
    ],
  },
  {
    process: '기타',
    display_name: '기타 공사',
    items: [
      {
        title: '공사 중간·마감 폐기물 처리비 누락',
        description:
          '철거 단계 폐기물(1T)만 있고, 공사 중간과 마감 때 나오는 자재 포장재·잔재 폐기물 처리비가 없어요. 보통 1T 기준 회당 약 25만원이 별도로 청구돼요.',
        guide: '공사 중간·마감 폐기물 처리비가 포함되어 있나요? 별도라면 처리 횟수와 금액을 견적서에 추가해 주세요.',
        status: '누락',
      },
      {
        title: '하자보수이행증권 발행 수수료 누락',
        description:
          '하자보수이행증권 발행 항목이 없어요. 증권이 없으면 공사 후 하자가 생겼을 때 업체가 보수를 미루더라도 보장받기 어려워요.',
        guide: '하자보수이행증권을 발행해 주나요? 발행 수수료를 견적서에 포함하고 하자보수 기간도 명시해 주세요.',
        status: '누락',
      },
    ],
  },
];

const countByStatus = (status: '누락' | '중복' | '불분명') =>
  BOOTH_DEMO_SECTIONS.flatMap((s) => s.items).filter((item) => item.status === status).length;

/** 실제 API처럼 입력한 공사 정보를 레포트 머리말에 반영하고, 진단 항목은 항상 동일하게 반환한다. */
export const buildBoothDemoReport = (input: RiskAnalyzeRequestBody): RiskReport => {
  const chips = { 누락: countByStatus('누락'), 중복: countByStatus('중복'), 불분명: countByStatus('불분명') };

  return {
    title: `${input.company_name} 견적서 진단`,
    subtitle_fields: {
      pyeong: input.pyeong,
      company_name: input.company_name,
      analyzed_date: formatDate(new Date(), 'dash'),
    },
    construction_info: {
      space_type: input.space_type,
      region: input.region,
      building_age: input.building_age,
      floor: input.floor,
      elevator: input.elevator,
      room_count: input.room_count,
    },
    cards: {},
    process_sections: BOOTH_DEMO_SECTIONS,
    summary: { total_risk_items: chips.누락 + chips.중복 + chips.불분명, chips },
  };
};
