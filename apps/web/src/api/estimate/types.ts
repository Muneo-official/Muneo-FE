interface WallpaperSubRequest {
  범위: string[];
  도배지종류: string;
  초배포함: string;
}

interface FlooringSubRequest {
  자재종류: string;
  범위: string;
  철거여부: string;
}

interface BathroomSubRequest {
  개수: number;
  크기: string;
  도기교체: string;
  방수포함: string;
  욕조샤워부스: string;
  타일등급: string;
}

interface KitchenSubRequest {
  싱크대형태: string;
}

export interface EstimateGenerateRequest {
  공종: string[];
  시공범위: string;
  공간유형: string;
  평수: number;
  방개수: number;
  지역: string;
  건물연식: string;
  자재등급: string;
  철거여부: string;
  층수: number;
  엘리베이터: string;
  트럭접근: string;
  거주중공사: string;
  공사시기: string;
  도배?: WallpaperSubRequest;
  마루?: FlooringSubRequest;
  욕실?: BathroomSubRequest;
  주방?: KitchenSubRequest;
}

interface AmountRange {
  최소: number;
  중간: number;
  최대: number;
}

export interface EstimateLineItem {
  description: string;
  amount_range: AmountRange;
  등장_사례_수: number;
}

interface ReferenceSample {
  article_id: string;
  지역: string;
  평수: number;
  총금액: number;
  평당: number;
}

export interface EstimateGenerateResponse {
  총_견적_범위: AmountRange;
  공종별_단가_범위: Record<string, AmountRange>;
  공종별_항목_명세: Record<string, EstimateLineItem[]>;
  보정_적용: string[];
  시공범위: string;
  선택_공종: string[];
  참고_사례_수: number;
  참고_사례: ReferenceSample[];
  검색_쿼리: string;
  데이터_부족_공종?: string[] | null;
}

export interface EstimateSaveRequest {
  input: EstimateGenerateRequest;
  result: EstimateGenerateResponse;
}

export interface EstimateSaveResponse {
  id: string;
}
