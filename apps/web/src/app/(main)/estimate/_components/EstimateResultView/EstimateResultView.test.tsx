import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type EstimateGenerateRequest, type EstimateGenerateResponse } from '@/api/estimate';
import { EstimateResultView } from './EstimateResultView';

const INPUT: EstimateGenerateRequest = {
  공종: ['도배', '창호', '도어'],
  시공범위: '부분',
  공간유형: '아파트',
  평수: 30,
  방개수: 3,
  지역: '수도권',
  건물연식: '10~20년',
  자재등급: '중급',
  철거여부: '없음',
  층수: 5,
  엘리베이터: '있음',
  트럭접근: '가능',
  거주중공사: '공실',
  공사시기: '미정',
};

const buildResult = (overrides: Partial<EstimateGenerateResponse> = {}): EstimateGenerateResponse => ({
  총_견적_범위: { 최소: 6_817_741, 중간: 8_550_624, 최대: 10_765_933 },
  공종별_단가_범위: {
    도배: { 최소: 2_670_000, 중간: 3_097_500, 최대: 4_525_000 },
    창호: { 최소: 2_917_741, 중간: 3_910_812, 최대: 5_251_933 },
    도어: { 최소: 1_230_000, 중간: 1_612_312, 최대: 2_214_000 },
  },
  공종별_항목_명세: {},
  보정_적용: [],
  시공범위: '부분',
  선택_공종: ['도배', '창호', '도어'],
  참고_사례_수: 15,
  참고_사례: [],
  검색_쿼리: '',
  데이터_부족_공종: null,
  ...overrides,
});

describe('EstimateResultView — 도어 공종', () => {
  it('공정별 합산과 세부 견적에 창호와 도어가 각각 나온다', () => {
    render(<EstimateResultView input={INPUT} result={buildResult()} />);

    expect(screen.getByText('창호')).toBeInTheDocument();
    expect(screen.getByText('도어')).toBeInTheDocument();
    expect(screen.getByText('창호 공사')).toBeInTheDocument();
    expect(screen.getByText('도어 공사')).toBeInTheDocument();
    expect(screen.getAllByText('123만원 ~ 221만원')).toHaveLength(2);
  });

  it('항목 명세가 비어 있어도 깨지지 않는다', () => {
    render(<EstimateResultView input={INPUT} result={buildResult()} />);

    expect(screen.getAllByText('상세 항목 준비 중입니다.')).toHaveLength(3);
  });

  it('데이터_부족_공종에 담긴 도어는 산출 불가로 안내한다', () => {
    const { 도어: _omitted, ...ranges } = buildResult().공종별_단가_범위;
    render(
      <EstimateResultView
        input={INPUT}
        result={buildResult({ 공종별_단가_범위: ranges, 데이터_부족_공종: ['도어'] })}
      />
    );

    expect(screen.getByText(/금액을 산출하지 못한 항목: 도어/)).toBeInTheDocument();
    expect(screen.getByText('참고할 사례가 부족해 금액을 산출하지 못했어요.')).toBeInTheDocument();
    expect(screen.getByText(/공종 선택만 반영된 항목: 창호 —/)).toBeInTheDocument();
  });

  it('데이터_부족_공종 필드가 없는 과거 저장 결과도 그대로 렌더링한다', () => {
    const { 데이터_부족_공종: _omitted, ...legacy } = buildResult();
    render(<EstimateResultView input={INPUT} result={legacy} />);

    expect(screen.queryByText(/금액을 산출하지 못한 항목/)).not.toBeInTheDocument();
  });
});
