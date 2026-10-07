import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiagnosisFeedback } from '@/app/(main)/analysis/_components/DiagnosisFeedback/DiagnosisFeedback';
import { DiagnosisInsights } from '@/app/(main)/analysis/_components/DiagnosisInsights/DiagnosisInsights';
import { ProcessSection } from '@/app/(main)/analysis/_components/ProcessSection/ProcessSection';
import { type DiagnosisResult } from '@/app/(main)/analysis/_types/analysis.types';
import * as styles from './page.css';

export const metadata: Metadata = { title: '진단 UI 미리보기', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const PREVIEW_RESULT: DiagnosisResult = {
  vendorLabel: '미리보기 업체',
  areaLabel: '32평 아파트',
  analyzedAt: '2026.10.06',
  missingCount: 1,
  riskCount: 1,
  insufficientCount: 1,
  sections: [
    {
      id: 'demolition',
      name: '철거 공사',
      items: [
        {
          id: 'demo-waste',
          status: '누락',
          title: '폐기물 처리 비용 확인',
          description: '철거 항목에서 폐기물 처리 범위를 확인하기 어려워요.',
          actionNote: '폐기물 운반·처리 비용이 포함되어 있나요? 별도라면 금액을 견적서에 적어 주세요.',
        },
      ],
    },
    {
      id: 'wallpaper',
      name: '도배 공사',
      items: [
        {
          id: 'wallpaper-model',
          status: '불분명',
          title: '벽지 제품과 시공 범위 확인',
          description: '벽지 종류만 적혀 있고 제품명과 천장 포함 여부는 기재되어 있지 않아요.',
          actionNote: '벽지 브랜드·모델명과 천장 시공 포함 여부를 알려 주세요.',
        },
        {
          id: 'wallpaper-labor',
          status: '중복',
          title: '인건비 중복 가능성 확인',
          description: '도배 항목과 별도 인건비 항목의 범위가 겹칠 수 있어요.',
          actionNote: '도배 금액에 인건비가 포함되어 있나요? 별도 인건비와의 범위를 구분해 주세요.',
        },
      ],
    },
  ],
};

export default function DiagnosisPreviewPage() {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_UI_PREVIEWS !== 'true') {
    notFound();
  }
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.badge}>UI 미리보기 · 예시 데이터</p>
        <h1 className={styles.title}>진단 결과를 다음 행동으로</h1>
        <p>업체에 확인할 내용을 정리하고, 진단에 대한 의견을 남기는 흐름을 체험해 보세요.</p>
        <a href="/maintenance">점검 화면도 확인하기 →</a>
      </header>
      <DiagnosisInsights result={PREVIEW_RESULT} />
      {PREVIEW_RESULT.sections.map((section) => (
        <ProcessSection key={section.id} section={section} />
      ))}
      <DiagnosisFeedback mode="preview" />
    </main>
  );
}
