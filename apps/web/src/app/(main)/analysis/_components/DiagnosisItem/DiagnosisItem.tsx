import { CircleWarningIcon } from '@muneo/design-system';
import { type DiagnosisStatus } from '@/api/analyze';
import { type DiagnosisItemData } from '../../_types/analysis.types';
import * as styles from './DiagnosisItem.css';

const STATUS_STYLES = {
  정상: { badge: styles.badgeNormal, actionNote: styles.actionNoteInfo },
  누락: { badge: styles.badgeMissing, actionNote: styles.actionNoteDanger },
  중복: { badge: styles.badgeInsufficient, actionNote: styles.actionNoteInfo },
  불분명: { badge: styles.badgeUnclear, actionNote: styles.actionNoteWarning },
} satisfies Record<DiagnosisStatus, { badge: string; actionNote: string }>;

interface DiagnosisItemProps {
  item: DiagnosisItemData;
}

export const DiagnosisItem = ({ item }: DiagnosisItemProps) => {
  const style = STATUS_STYLES[item.status];

  return (
    <div id={`diagnosis-item-${item.id}`} tabIndex={-1} className={styles.item}>
      <span className={`${styles.badge} ${style.badge}`}>{item.status}</span>
      <div className={styles.texts}>
        <span className={styles.title}>{item.title}</span>
        {item.description && <span className={styles.description}>{item.description}</span>}
        {item.actionNote && (
          <span className={`${styles.actionNote} ${style.actionNote}`}>
            <CircleWarningIcon width={16} height={16} />
            {item.actionNote}
          </span>
        )}
      </div>
    </div>
  );
};
