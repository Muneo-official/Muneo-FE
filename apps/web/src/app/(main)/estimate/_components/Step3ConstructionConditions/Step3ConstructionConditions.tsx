'use client';

import { SelectButton } from '@muneo/design-system';
import { useId, useState } from 'react';
import { useEstimateStore } from '../../_store/estimateStore';
import { BUILDING_AGES, CONSTRUCTION_TIMINGS, ELEVATOR_OPTIONS, OCCUPANCIES, TRUCK_ACCESSES } from '../../_types';
import { validateConditions } from '../../_utils/validateEstimate';
import { StepActions } from '../StepActions/StepActions';
import * as styles from './Step3ConstructionConditions.css';

export const Step3ConstructionConditions = () => {
  const { step3, setStep3, nextStep, prevStep } = useEstimateStore();

  const floorId = useId();
  const [error, setError] = useState<string | null>(null);
  const handleNext = () => {
    const message = validateConditions(step3);
    setError(message);
    if (!message) {
      nextStep();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Step 3 <span className={styles.titleAccent}>공사 조건</span>을 입력해주세요
        </h2>
        <span className={styles.titleHint}>
          가견적은 참고용 예상 범위이며, 현장 조건과 자재에 따라 실제 비용이 달라질 수 있어요.
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.fields}>
          <div className={styles.fieldRows}>
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <span className={styles.fieldLabel}>건물 연식</span>
                <span className={styles.fieldHint}>인건비 지역 단가 반영</span>
              </div>
              <div className={styles.buttonRow}>
                {BUILDING_AGES.map((age) => (
                  <SelectButton
                    key={age}
                    selected={step3.buildingAge === age}
                    onClick={() => setStep3({ buildingAge: age })}
                  >
                    {age}
                  </SelectButton>
                ))}
              </div>
            </div>

            <div className={styles.twoColRow}>
              <div className={styles.twoColLeft}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>엘리베이터</span>
                  <div className={styles.buttonRow}>
                    {ELEVATOR_OPTIONS.map((ev) => (
                      <SelectButton
                        key={ev}
                        selected={step3.elevator === ev}
                        onClick={() => setStep3({ elevator: ev })}
                      >
                        {ev}
                      </SelectButton>
                    ))}
                  </div>
                </div>

                <div className={styles.floorField}>
                  <label htmlFor={floorId} className={styles.fieldLabel}>
                    층수
                  </label>
                  <div className={styles.areaInput}>
                    <input
                      id={floorId}
                      type="number"
                      min={0}
                      className={styles.areaInputNumber}
                      value={step3.floor ?? ''}
                      onChange={(e) => setStep3({ floor: e.target.value === '' ? null : Number(e.target.value) })}
                    />
                    <span className={styles.areaUnit}>층</span>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>공간 상황</span>
                <div className={styles.buttonRow}>
                  {OCCUPANCIES.map((occ) => (
                    <SelectButton
                      key={occ}
                      selected={step3.occupancy === occ}
                      onClick={() => setStep3({ occupancy: occ })}
                    >
                      {occ}
                    </SelectButton>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.twoColRight}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>트럭 접근</span>
                <div className={styles.buttonRow}>
                  {TRUCK_ACCESSES.map((ta) => (
                    <SelectButton
                      key={ta}
                      selected={step3.truckAccess === ta}
                      onClick={() => setStep3({ truckAccess: ta })}
                    >
                      {ta}
                    </SelectButton>
                  ))}
                </div>
                {step3.truckAccess === '모름' && (
                  <p>관리사무소나 시공업체에 진입로 폭과 차량 높이 제한을 확인해 주세요.</p>
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>공사 희망시기</span>
                <div className={styles.buttonRow}>
                  {CONSTRUCTION_TIMINGS.map((ct) => (
                    <SelectButton
                      key={ct}
                      selected={step3.constructionTiming === ct}
                      onClick={() => setStep3({ constructionTiming: ct })}
                    >
                      {ct}
                    </SelectButton>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && <p role="alert">{error}</p>}
          <StepActions onNext={handleNext} onSecondary={prevStep} />
        </div>
      </div>
    </div>
  );
};
