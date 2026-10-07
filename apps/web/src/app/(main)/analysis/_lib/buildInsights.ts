import { type DiagnosisResult } from '../_types/analysis.types';

const PRIORITY = { 누락: 0, 불분명: 1, 중복: 2, 정상: 3 } as const;
const QUESTIONS = {
  누락: '이 항목이 견적에 포함되어 있나요? 별도라면 범위와 추가 금액을 알려 주세요.',
  불분명: '이 항목의 자재 규격, 수량, 단가와 시공 범위를 구체적으로 알려 주세요.',
  중복: '다른 항목과 비용 또는 시공 범위가 겹치나요? 항목별 내역을 구분해 주세요.',
  정상: '공사 범위와 자재 기준을 최종 견적서에 명시해 주세요.',
};

export const buildInsights = (result: DiagnosisResult) => {
  const items = result.sections
    .flatMap((section) =>
      section.items
        .filter((item) => item.status !== '정상')
        .map((item) => ({
          ...item,
          sectionId: section.id,
          processName: section.name,
          question: item.actionNote.trim() || QUESTIONS[item.status],
        }))
    )
    .sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status]);

  return {
    total: items.length,
    priorities: items.slice(0, 3),
    questions: items
      .map((item, index) => `${index + 1}. [${item.processName}] ${item.title || '상세 내용 확인'}\n${item.question}`)
      .join('\n\n'),
  };
};
