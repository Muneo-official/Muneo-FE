// 로컬 QA 전용 가상 데이터. 운영 데이터나 실제 개인정보를 사용하지 않는다.
export const qaAdmin = {
  id: 900,
  email: 'admin@example.test',
  name: 'QA 관리자',
  phoneNumber: '01000000000',
  birthDate: '1990-01-01',
  authProvider: 'LOCAL',
  profileCompleted: true,
  role: 'ADMIN',
};

export const qaUsers = [
  [101, '기록 있는 사용자'],
  [102, '기록 없는 사용자'],
  [103, 'API 미연결 사용자'],
  [104, '서버 장애 사용자'],
  [105, '소유자 불일치 사용자'],
  [106, '조회 권한 없는 사용자'],
].map(([id, name]) => ({
  ...qaAdmin,
  id: Number(id),
  name: String(name),
  email: `qa${id}@example.test`,
  role: 'USER',
  deleted: false,
  emailVerified: true,
}));

export const qaEstimates = Array.from({ length: 21 }, (_, index) => ({
  id: `qa-estimate-${21 - index}`,
  user_id: '101',
  created_at: new Date(Date.UTC(2026, 9, 6, 12, 0, -index)).toISOString(),
  input: {
    공간유형: '아파트',
    평수: 24,
    방개수: 3,
    지역: '서울',
    공종: ['도배', '욕실'],
    욕실: { 개수: 2, 방수포함: '포함' },
  },
  result: {
    총_견적_범위: { 최소: 9000000, 중간: 11000000, 최대: 14000000 },
    공종별_단가_범위: { 도배: { 최소: 2000000, 중간: 2500000, 최대: 3000000 } },
    선택_공종: ['도배', '욕실'],
    참고_사례_수: 8,
    보정_적용: [],
  },
}));

export const qaReports = [
  {
    id: 'qa-report-1',
    user_id: '101',
    created_at: '2026-10-06T11:00:00Z',
    input: { space_type: '아파트', pyeong: 24, room_count: 3, region: '서울', company_name: 'QA 시공업체' },
    result: {
      report: {
        title: 'QA 견적서 진단 결과',
        subtitle_fields: { pyeong: 24, company_name: 'QA 시공업체' },
        summary: {
          total_risk_items: 2,
          chips: [
            { label: '누락', count: 1 },
            { label: '불분명', count: 1 },
          ],
        },
        process_sections: [
          {
            process: '욕실',
            display_name: '욕실 공사',
            items: [
              {
                title: '방수 공사 범위',
                status: '누락',
                description: '방수 공사 범위가 기재되어 있지 않습니다.',
                guide: '방수 범위를 업체에 확인해 주세요.',
              },
              {
                title: '타일 자재 등급',
                status: '불분명',
                description: '타일의 제품 정보가 명확하지 않습니다.',
                guide: '제품명과 규격을 확인해 주세요.',
              },
            ],
          },
        ],
      },
    },
  },
];

export const qaFeedback = [
  {
    id: 'qa-feedback-1',
    user_id: '101',
    report_id: 'qa-report-1',
    schema_version: 1,
    rating: 'good',
    reasons: ['found_risks', 'useful_questions'],
    comment: '업체에 방수 범위를 물어볼 수 있었어요.',
    created_at: '2026-10-06T11:05:00Z',
    updated_at: '2026-10-06T11:10:00Z',
  },
  {
    id: 'qa-feedback-2',
    user_id: '101',
    report_id: 'qa-report-previous',
    schema_version: 1,
    rating: 'bad',
    reasons: ['unclear_explanation'],
    comment: '이전 진단의 설명이 조금 어려웠어요.',
    created_at: '2026-10-05T11:05:00Z',
    updated_at: '2026-10-05T11:05:00Z',
  },
];

export const paginate = <T>(items: T[], page: number, size: number) => ({
  content: items.slice(page * size, (page + 1) * size),
  page,
  size,
  totalElements: items.length,
  totalPages: Math.ceil(items.length / size),
  first: page === 0,
  last: page >= Math.ceil(items.length / size) - 1,
});
