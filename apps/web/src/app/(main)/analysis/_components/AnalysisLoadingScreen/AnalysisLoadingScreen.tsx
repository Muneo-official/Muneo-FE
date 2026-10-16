'use client';

import { useMemo } from 'react';
import { LoadingScreen } from '@/app/(main)/_components/LoadingScreen';
import { isBoothDemoMode } from '../../_lib/boothDemo';

const TIPS = [
  '견적서에 단가와 수량이 명시될수록 정확한 진단이 가능해요',
  '공종명이 구체적일수록 누락 항목을 더 정확히 찾을 수 있어요',
  '총액만 있고 세부 내역이 없는 견적서는 리스크가 높아요',
  '철거비·폐기물처리비는 별도 항목으로 기재돼야 해요',
  '인건비와 자재비가 구분된 견적서가 더 신뢰할 수 있어요',
  '"기타"로 묶인 항목은 불분명 리스크의 주요 원인이에요',
  '로스율이 명시된 자재 항목이 더 투명한 견적이에요',
];

const PROGRESS_STEPS = [
  { delay: 100, value: 15, duration: 3000, easing: 'ease-out' },
  { delay: 5000, value: 40, duration: 20000, easing: 'linear' },
  { delay: 25000, value: 65, duration: 30000, easing: 'linear' },
  { delay: 55000, value: 82, duration: 40000, easing: 'linear' },
];

/** 부스 데모 모드는 6~10초 안에 끝나므로 진행률을 그 구간에 맞춰 압축한다. */
const BOOTH_DEMO_PROGRESS_STEPS = [
  { delay: 100, value: 30, duration: 2000, easing: 'ease-out' },
  { delay: 2500, value: 65, duration: 3500, easing: 'linear' },
  { delay: 6000, value: 92, duration: 4000, easing: 'linear' },
];

interface Props {
  companyName: string | null;
  fileCount: number;
  onCancel: () => void;
}

export const AnalysisLoadingScreen = ({ companyName, fileCount, onCancel }: Props) => {
  const demo = isBoothDemoMode();
  const messages = useMemo(
    () => [
      '업로드하신 견적서를 읽고 있어요',
      `${fileCount}개 파일의 항목을 분류하고 있어요`,
      `${companyName ?? '해당 업체'}의 견적 구조를 파악하고 있어요`,
      '누락·중복·불분명 항목을 검토하고 있어요',
      '진단 레포트를 생성하고 있어요',
    ],
    [companyName, fileCount]
  );

  return (
    <LoadingScreen
      messages={messages}
      tips={TIPS}
      warningMessage="분석에 시간이 걸리고 있어요. 조금만 더 기다려 주세요."
      warningDelayMs={90000}
      progressSteps={demo ? BOOTH_DEMO_PROGRESS_STEPS : PROGRESS_STEPS}
      footerText={demo ? '보통 10초 안팎으로 끝나요' : '보통 1~2분 정도 소요돼요'}
      onCancel={onCancel}
    />
  );
};
