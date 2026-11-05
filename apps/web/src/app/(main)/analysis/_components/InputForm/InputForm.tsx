'use client';

import { Dropdown, TextField } from '@muneo/design-system';
import { parsePositiveNumber } from '@/lib/parsers/parseNumber';
import { useAnalysisStore } from '../../_store/analysisStore';
import { type BuildingAge, type ElevatorOption, type Region, type SpaceType } from '../../_types/analysis.types';
import * as styles from './InputForm.css';

const SPACE_TYPE_OPTIONS: Array<{ value: SpaceType; label: string }> = [
  { value: '아파트', label: '아파트' },
  { value: '빌라', label: '빌라' },
  { value: '오피스텔', label: '오피스텔' },
  { value: '단독 주택', label: '단독 주택' },
];
const REGION_OPTIONS: Array<{ value: Region; label: string }> = [
  { value: '서울', label: '서울' },
  { value: '수도권', label: '수도권' },
  { value: '지방', label: '지방' },
];
const BUILDING_AGE_OPTIONS: Array<{ value: BuildingAge; label: string }> = [
  { value: '10년 이하', label: '10년 이하' },
  { value: '10~20년', label: '10~20년' },
  { value: '20년 이상', label: '20년 이상' },
];
const ELEVATOR_OPTIONS: Array<{ value: ElevatorOption; label: string }> = [
  { value: '있음', label: '있음' },
  { value: '없음', label: '없음' },
];

export const InputForm = () => {
  const form = useAnalysisStore((state) => state.form);
  const setForm = useAnalysisStore((state) => state.setForm);

  const handleNumberInput = (field: 'pyeong' | 'roomCount' | 'floor', value: string) => {
    setForm({ [field]: parsePositiveNumber(value) });
  };

  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>공사 정보</span>
      <div className={styles.fields}>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="spaceType" className={styles.label}>
              공간유형
            </label>
            <Dropdown
              id="spaceType"
              options={SPACE_TYPE_OPTIONS}
              value={form.spaceType ?? undefined}
              onChange={(v) => setForm({ spaceType: v })}
              placeholder="선택하세요"
            />
          </div>
          <div className={styles.fieldGroupFixed}>
            <TextField
              id="pyeong"
              label="면적 (평)"
              type="number"
              min={1}
              placeholder="평수를 입력하세요"
              value={form.pyeong ?? ''}
              onChange={(e) => handleNumberInput('pyeong', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.fieldGroupFixed}>
          <TextField
            id="roomCount"
            label="방 개수"
            type="number"
            min={1}
            placeholder="방 개수를 입력하세요"
            value={form.roomCount ?? ''}
            onChange={(e) => handleNumberInput('roomCount', e.target.value)}
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldGroupFixed}>
            <TextField
              id="floor"
              label="층수"
              type="number"
              min={1}
              placeholder="층을 입력하세요"
              value={form.floor ?? ''}
              onChange={(e) => handleNumberInput('floor', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="elevator" className={styles.label}>
              엘리베이터
            </label>
            <Dropdown
              id="elevator"
              options={ELEVATOR_OPTIONS}
              value={form.elevator ?? undefined}
              onChange={(v) => setForm({ elevator: v })}
              placeholder="선택하세요"
            />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="region" className={styles.label}>
              지역
            </label>
            <Dropdown
              id="region"
              options={REGION_OPTIONS}
              value={form.region ?? undefined}
              onChange={(v) => setForm({ region: v })}
              placeholder="선택하세요"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="buildingAge" className={styles.label}>
              건물 연식
            </label>
            <Dropdown
              id="buildingAge"
              options={BUILDING_AGE_OPTIONS}
              value={form.buildingAge ?? undefined}
              onChange={(v) => setForm({ buildingAge: v })}
              placeholder="선택하세요"
            />
          </div>
        </div>

        <div className={styles.fieldGroupFixed}>
          <TextField
            id="companyName"
            label="업체명"
            placeholder="업체명을 입력하세요"
            value={form.companyName ?? ''}
            onChange={(e) => setForm({ companyName: e.target.value || null })}
          />
        </div>
      </div>
    </div>
  );
};
