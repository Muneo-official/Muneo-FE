import { type ReactNode } from 'react';
import * as styles from '../Step5EstimateReview/Step5EstimateReview.css';

interface EstimateDisclaimerProps {
  error?: string | null;
  /** 버튼 위에 보여줄 안내 (저장 완료, 체험 잠금 안내 등) */
  notice?: ReactNode;
  /** 오른쪽 정렬되는 버튼 영역 */
  children?: ReactNode;
}

/** 가견적 결과 하단의 면책 안내와 액션 버튼. 로그인 결과와 비회원 체험 결과가 같은 모양을 쓴다. */
export const EstimateDisclaimer = ({ error, notice, children }: EstimateDisclaimerProps) => (
  <div className={styles.disclaimerSection}>
    <div className={styles.disclaimerBox}>
      <div className={styles.warningBox}>
        <div className={styles.warningText}>
          <span>⚠ 본 견적은 현장 상태에 따라 변동될 수 있으며, 정확한 견적은 현장 방문 후 확정됩니다.</span>
          <span>⚠ 부가세(10%) 별도이며, 업체별 부가세 포함/별도 기준이 다르므로 계약 시 확인이 필요합니다.</span>
        </div>
      </div>
      <span className={styles.infoText}>ⓘ 해당 가견적을 업체 견적서와 비교하여 항목별 금액 적정성을 판단하세요.</span>
    </div>

    {error && (
      <p role="alert" style={{ color: '#EF4444', fontSize: '13px', marginBottom: '8px' }}>
        {error}
      </p>
    )}

    {notice}
    {children && <div className={styles.actionRow}>{children}</div>}
  </div>
);
