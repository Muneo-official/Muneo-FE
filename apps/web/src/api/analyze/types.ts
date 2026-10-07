export const DIAGNOSIS_STATUSES = ['정상', '누락', '중복', '불분명'] as const;
export type DiagnosisStatus = (typeof DIAGNOSIS_STATUSES)[number];

export interface RiskAnalyzeRequestBody {
  space_type: string;
  pyeong: number;
  room_count: number;
  floor: number;
  elevator: boolean;
  region: string;
  building_age: string;
  company_name: string;
}

export interface ApiProcessItem {
  id?: string;
  title: string;
  description: string;
  guide: string;
  status: DiagnosisStatus;
}

export interface ApiProcessSection {
  id?: string;
  process: string;
  display_name: string;
  items: ApiProcessItem[];
}

export interface RiskSummary {
  total_risk_items: number;
  chips: { 누락: number; 중복: number; 불분명: number };
}

export interface SubtitleFields {
  pyeong: number;
  company_name: string;
  analyzed_date?: string;
}

export interface RiskReport {
  title: string;
  subtitle_fields: SubtitleFields;
  construction_info: {
    space_type: string;
    region: string;
    building_age: string;
    floor: number;
    elevator: boolean;
    room_count: number;
  };
  cards: Record<string, unknown>;
  process_sections: ApiProcessSection[];
  summary: RiskSummary;
}

export interface RiskDetectAnalyzeResponse {
  report: RiskReport;
}

export interface RiskSaveBody {
  input: RiskAnalyzeRequestBody;
  result: { report: RiskReport };
}
