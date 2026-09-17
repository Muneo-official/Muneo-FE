import { ArrowUndoDownLeftIcon, Button } from '@muneo/design-system';
import * as styles from './StepActions.css';

interface StepActionsProps {
  onNext: () => void;
  onSecondary: () => void;
  secondaryLabel?: string;
  showResetIcon?: boolean;
}

export const StepActions = ({
  onNext,
  onSecondary,
  secondaryLabel = '이전',
  showResetIcon = false,
}: StepActionsProps) => {
  return (
    <div className={styles.container}>
      <Button variant="primary" size="md" className={styles.actionButton} onClick={onNext}>
        다음 단계
      </Button>
      <Button variant="outlineSecondary" size="md" className={styles.actionButton} onClick={onSecondary}>
        {showResetIcon ? (
          <span className={styles.resetIconWrapper}>
            <ArrowUndoDownLeftIcon width={16} height={16} />
            {secondaryLabel}
          </span>
        ) : (
          secondaryLabel
        )}
      </Button>
    </div>
  );
};
