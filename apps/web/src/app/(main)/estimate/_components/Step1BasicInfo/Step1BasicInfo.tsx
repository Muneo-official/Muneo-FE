'use client';

import { SelectButton } from '@muneo/design-system';
import { useId, useState } from 'react';
import { parsePositiveNumber } from '@/lib/parsers/parseNumber';
import { useEstimateStore } from '../../_store/estimateStore';
import { BATHROOM_COUNTS, REGIONS, ROOM_COUNTS, SPACE_TYPES } from '../../_types';
import { validateBasicInfo } from '../../_utils/validateEstimate';
import { StepActions } from '../StepActions/StepActions';
import * as styles from './Step1BasicInfo.css';

export const Step1BasicInfo = () => {
  const { step1, setStep1, nextStep, reset } = useEstimateStore();
  const areaInputId = useId();
  const [error, setError] = useState<string | null>(null);
  const handleNext = () => {
    const message = validateBasicInfo(step1);
    setError(message);
    if (!message) {
      nextStep();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Step 1 <span className={styles.titleAccent}>기본 정보</span>를 입력해주세요
        </h2>
        <span className={styles.titleHint}>
          가견적은 참고용 예상 범위이며, 현장 조건과 자재에 따라 실제 비용이 달라질 수 있어요.
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <span className={styles.fieldLabel}>지역</span>
                <span className={styles.fieldHint}>인건비 지역 단가 반영</span>
              </div>
              <div className={styles.buttonRow}>
                {REGIONS.map((r) => (
                  <SelectButton key={r} selected={step1.region === r} onClick={() => setStep1({ region: r })}>
                    {r}
                  </SelectButton>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>공간 유형</span>
              <div className={styles.buttonRow}>
                {SPACE_TYPES.map((t) => (
                  <SelectButton key={t} selected={step1.spaceType === t} onClick={() => setStep1({ spaceType: t })}>
                    {t}
                  </SelectButton>
                ))}
              </div>
            </div>

            <div className={styles.fieldWithGap}>
              <label htmlFor={areaInputId} className={styles.fieldLabel}>
                전용 면적
              </label>
              <div className={styles.areaInput}>
                <input
                  id={areaInputId}
                  type="number"
                  min={1}
                  className={styles.areaInputNumber}
                  value={step1.area ?? ''}
                  onChange={(e) => setStep1({ area: parsePositiveNumber(e.target.value) })}
                />
                <span className={styles.areaUnit}>평</span>
              </div>
            </div>

            <div className={styles.field} role="group" aria-label="방 개수">
              <div className={styles.fieldHeader}>
                <span className={styles.fieldLabel}>방 개수</span>
                <span className={styles.fieldHint}>도배·마루 면적 추정 보정</span>
              </div>
              <div className={styles.buttonRow}>
                {ROOM_COUNTS.map((c) => (
                  <SelectButton key={c} selected={step1.roomCount === c} onClick={() => setStep1({ roomCount: c })}>
                    {c}
                  </SelectButton>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.field} role="group" aria-label="화장실 개수">
            <span className={styles.fieldLabel}>화장실 개수</span>
            <span className={styles.fieldHint}>욕실 공정 선택 시 이 개수를 기준으로 산출해요.</span>
            <div className={styles.buttonRow}>
              {BATHROOM_COUNTS.map((count) => (
                <SelectButton
                  key={count}
                  selected={step1.bathroomCount === count}
                  onClick={() => setStep1({ bathroomCount: count })}
                >
                  {count}
                </SelectButton>
              ))}
            </div>
          </div>
          {error && <p role="alert">{error}</p>}
          <StepActions onNext={handleNext} onSecondary={reset} secondaryLabel="초기화" showResetIcon />
        </div>
      </div>
    </div>
  );
};
