'use client';

import { CaretDownIcon } from '@muneo/design-system';
import { useState } from 'react';
import { type ProcessSectionData } from '../../_types/analysis.types';
import { DiagnosisItem } from '../DiagnosisItem/DiagnosisItem';
import * as styles from './ProcessSection.css';

interface ProcessSectionProps {
  section: ProcessSectionData;
}

export const ProcessSection = ({ section }: ProcessSectionProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.section}>
      <button
        id={`process-toggle-${section.id}`}
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={`${styles.chevron}${open ? '' : ` ${styles.chevronClosed}`}`}>
          <CaretDownIcon width={14} height={14} />
        </span>
        <span className={styles.sectionName}>{section.name}</span>
      </button>
      <div
        inert={!open}
        aria-hidden={!open}
        className={`${styles.collapseWrapper}${open ? '' : ` ${styles.collapseWrapperClosed}`}`}
      >
        <div className={styles.itemList}>
          {section.items.map((item) => (
            <DiagnosisItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
};
