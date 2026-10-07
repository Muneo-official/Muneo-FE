import { type RiskReport } from '@/api/analyze';
import { type DiagnosisResult } from '../_types/analysis.types';

export const mapApiReportToDiagnosisResult = (report: RiskReport, fallbackDate?: string): DiagnosisResult => {
  const sections = report.process_sections.map((s, si) => ({
    id: s.id ?? String(si),
    name: s.display_name,
    items: s.items.map((item, ii) => ({
      id: item.id ?? `${si}_${ii}`,
      status: item.status,
      title: item.title,
      description: item.description,
      actionNote: item.guide,
    })),
  }));

  const allItems = sections.flatMap((s) => s.items);

  return {
    vendorLabel: report.subtitle_fields.company_name,
    areaLabel: `${report.subtitle_fields.pyeong}평 ${report.construction_info.space_type}`,
    analyzedAt: (report.subtitle_fields.analyzed_date ?? fallbackDate ?? new Date().toISOString())
      .slice(0, 10)
      .replace(/-/g, '.'),
    missingCount: allItems.filter((i) => i.status === '누락').length,
    riskCount: allItems.filter((i) => i.status === '불분명').length,
    insufficientCount: allItems.filter((i) => i.status === '중복').length,
    sections,
  };
};
