import { COMPANY_NAME } from './app';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.muneo.ai.kr';
export const SITE_NAME = COMPANY_NAME;
export const SITE_TITLE_DEFAULT = `${COMPANY_NAME} - 문제 없는 시공을 위한 어시스턴트`;
export const SITE_TITLE_TEMPLATE = `%s | ${COMPANY_NAME}`;
export const SITE_DESCRIPTION =
  'RAG 기반 인테리어 시공 의사결정 도우미. 가견적서 생성과 견적서 리스크 진단으로 시공 전 확인할 내용을 살펴보세요.';
export const SITE_KEYWORDS = [
  '문어',
  '인테리어',
  '인테리어 견적',
  '견적서 검토',
  '리스크 진단',
  '하자 점검',
  'AI 인테리어',
  '시공 어시스턴트',
  'RAG',
];
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const DEFAULT_OG_IMAGE_ALT = `${COMPANY_NAME} — 인테리어 시공 어시스턴트`;
