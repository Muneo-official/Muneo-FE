'use client';

import { Button, SelectButton } from '@muneo/design-system';
import { type ReactNode, useState } from 'react';
import { useEstimateStore } from '../../_store/estimateStore';
import {
  BASIC_PROCESSES,
  OPTIONAL_PROCESSES,
  SANITARY_WARES,
  WALLPAPER_ROOMS,
  type BathroomDetail,
  type FlooringDetail,
  type KitchenDetail,
  type WallpaperDetail,
} from '../../_types';
import { getMissingProcessFields, validateProcessSelection } from '../../_utils/validateEstimate';
import { ProcessCheckbox } from '../ProcessCheckbox/ProcessCheckbox';
import { StepActions } from '../StepActions/StepActions';
import * as styles from './Step2ProcessSelection.css';

const ALL_PROCESSES = [...BASIC_PROCESSES, ...OPTIONAL_PROCESSES];

const toggleItem = <T,>(arr: T[], item: T): T[] =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

const BASIC_ROWS = [BASIC_PROCESSES.slice(0, 5), BASIC_PROCESSES.slice(5, 10), BASIC_PROCESSES.slice(10)];

// ─── 섹션 컴포넌트 ───

interface FieldProps {
  label: string;
  children: ReactNode;
  conditional?: boolean;
}

const Field = ({ label, children, conditional = false }: FieldProps) => (
  <div className={conditional ? styles.conditionalField : styles.field}>
    <span className={styles.fieldLabel}>{label}</span>
    {children}
  </div>
);

interface SectionProps<T> {
  data: Partial<T>;
  onChange: (patch: Partial<T>) => void;
}

const WallpaperSection = ({ data, onChange }: SectionProps<WallpaperDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="벽지 종류">
      <div className={styles.buttonRow}>
        {(['실크벽지', '합지벽지', '천연벽지'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.wallpaperType === opt}
            onClick={() => onChange({ wallpaperType: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <Field label="시공 범위">
      <div className={styles.buttonRow}>
        {(['전체(벽면+천장)', '벽면만', '부분 도배'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.wallpaperScope === opt}
            onClick={() =>
              onChange(opt === '부분 도배' ? { wallpaperScope: opt } : { wallpaperScope: opt, partialRooms: undefined })
            }
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    {data.wallpaperScope === '부분 도배' && (
      <Field label="부분 도배 공간" conditional>
        <div className={styles.buttonRow}>
          {WALLPAPER_ROOMS.map((room) => (
            <SelectButton
              key={room}
              selected={(data.partialRooms ?? []).includes(room)}
              onClick={() => onChange({ partialRooms: toggleItem(data.partialRooms ?? [], room) })}
            >
              {room}
            </SelectButton>
          ))}
        </div>
      </Field>
    )}
    <Field label="초배 작업">
      <div className={styles.buttonRow}>
        {(['포함', '미포함', '모름'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.underpaperWork === opt}
            onClick={() => onChange({ underpaperWork: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
      {data.underpaperWork === '모름' && (
        <p className={styles.infoNote}>
          초배는 벽면을 고르게 준비하는 작업이에요. 기존 벽면 상태에 따라 달라지므로 현장 방문 때 포함 여부를 확인해
          주세요.
        </p>
      )}
    </Field>
    <p className={styles.infoNote}>
      벽지 종류와 시공 범위를 선택해 주세요. 브랜드·모델·벽면 상태에 따라 실제 금액은 달라질 수 있어요.
    </p>
  </div>
);

const FlooringSection = ({ data, onChange }: SectionProps<FlooringDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="바닥재 종류">
      <div className={styles.buttonRow}>
        {(['강마루', '강화마루', '원목마루', '장판', '데코타일'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.floorMaterial === opt}
            onClick={() => onChange({ floorMaterial: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <Field label="시공 범위">
      <div className={styles.buttonRow}>
        {(['전체', '거실+방만', '방만'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.flooringScope === opt}
            onClick={() => onChange({ flooringScope: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <Field label="기존 바닥 철거">
      <div className={styles.buttonRow}>
        {(['필요', '불필요', '모름'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.floorDemolition === opt}
            onClick={() => onChange({ floorDemolition: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
      {data.floorDemolition === '모름' && (
        <p className={styles.infoNote}>
          바닥 들뜸이나 손상, 기존 자재에 따라 철거가 필요할 수 있어요. 현장 상태를 업체에 확인해 주세요.
        </p>
      )}
    </Field>
    <p className={styles.infoNote}>
      자재 종류와 철거 여부를 기준으로 산출해요. 제품 규격과 바닥 상태는 현장에서 확인해 주세요.
    </p>
  </div>
);

const BathroomSection = ({ data, onChange }: SectionProps<BathroomDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="욕실 크기">
      <div className={styles.buttonRow}>
        {(['소형(1평 미만)', '중형(1~2평)', '대형(2평 이상)'] as const).map((opt) => (
          <SelectButton key={opt} selected={data.bathroomSize === opt} onClick={() => onChange({ bathroomSize: opt })}>
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <Field label="타일 등급">
      <div className={styles.buttonRow}>
        {(['일반', '중급', '고급(수입)'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.bathroomTileGrade === opt}
            onClick={() => onChange({ bathroomTileGrade: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <Field label="위생도기">
      <div className={styles.buttonRow}>
        <SelectButton selected={data.sanitaryWare?.length === 0} onClick={() => onChange({ sanitaryWare: [] })}>
          교체 안함
        </SelectButton>
        {SANITARY_WARES.map((item) => (
          <SelectButton
            key={item}
            selected={(data.sanitaryWare ?? []).includes(item)}
            onClick={() => onChange({ sanitaryWare: toggleItem(data.sanitaryWare ?? [], item) })}
          >
            {item}
          </SelectButton>
        ))}
      </div>
    </Field>
    <p className={styles.infoNote}>
      기본 정보에서 입력한 화장실 개수로 산출해요. 현재 산출 기준에는 방수 공사가 포함돼요.
    </p>
  </div>
);

const KitchenSection = ({ data, onChange }: SectionProps<KitchenDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="싱크대 형태">
      <div className={styles.buttonRow}>
        {(['ㄱ자(일자)', 'ㄷ자', 'ㄹ자(아일랜드 포함)'] as const).map((opt) => (
          <SelectButton key={opt} selected={data.sinkShape === opt} onClick={() => onChange({ sinkShape: opt })}>
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
    <p className={styles.infoNote}>
      싱크대 형태를 기준으로 산출해요. 실제 길이·상판·브랜드는 업체 견적에서 확인해 주세요.
    </p>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_MAP: Partial<Record<string, React.ComponentType<SectionProps<any>>>> = {
  wallpaper: WallpaperSection,
  flooring: FlooringSection,
  bathroom: BathroomSection,
  kitchen: KitchenSection,
};

// ─── 메인 컴포넌트 ───

export const Step2ProcessSelection = () => {
  const { step2, step4, setStep2, setStep4, toggleProcess, nextStep, prevStep } = useEstimateStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>('wallpaper');

  const handleNext = () => {
    if (step2.selectedProcesses.length === 0) {
      setValidationError('공정을 1개 이상 선택해주세요.');
      return;
    }
    const missing = validateProcessSelection(step2, step4)[0];
    if (missing) {
      const name = ALL_PROCESSES.find((process) => process.id === missing.id)?.name;
      setValidationError(`${name}: ${missing.fields.join(', ')} 항목을 선택해 주세요.`);
      setOpenId(missing.id);
      requestAnimationFrame(() => document.getElementById(`detail-${missing.id}`)?.focus());
      return;
    }
    setValidationError(null);
    nextStep();
  };

  const handleModeChange = (mode: 'full' | 'partial') => {
    if (mode === 'full') {
      setStep2({ mode, selectedProcesses: BASIC_PROCESSES.map((p) => p.id) });
    } else {
      setStep2({ mode, selectedProcesses: [] });
    }
  };

  const detailProcesses = ALL_PROCESSES.filter((p) => step2.selectedProcesses.includes(p.id) && SECTION_MAP[p.id]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Step 2 <span className={styles.titleAccent}>시공 대상 공정</span>를 선택해주세요
        </h2>
        <span className={styles.titleHint}>전체 리모델링 선택 시 기본 공정이 자동 포함됩니다. 개별 해제 가능.</span>
      </div>

      <div className={styles.card}>
        <div className={styles.tabBar}>
          {(['full', 'partial'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={step2.mode === mode ? styles.tabActive : styles.tabInactive}
              onClick={() => handleModeChange(mode)}
            >
              {mode === 'full' ? '전체 리모델링' : '부분 시공'}
            </button>
          ))}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.buttonRow}>
            <Button
              variant="outlineSecondary"
              onClick={() => setStep2({ selectedProcesses: ALL_PROCESSES.map((process) => process.id) })}
            >
              전체 선택
            </Button>
            <Button variant="outlineSecondary" onClick={() => setStep2({ selectedProcesses: [] })}>
              전체 해제
            </Button>
            <span className={styles.detailHint}>{step2.selectedProcesses.length}개 공정 선택</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div className={styles.processSection}>
              <span className={styles.sectionLabel}>기본 공정 (자동 포함)</span>
              <div className={styles.processGrid}>
                {BASIC_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className={styles.processRow}>
                    {row.map((process) => (
                      <ProcessCheckbox
                        key={process.id}
                        process={process}
                        selected={step2.selectedProcesses.includes(process.id)}
                        onToggle={toggleProcess}
                        hasDetail={Boolean(SECTION_MAP[process.id])}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.processSection}>
              <span className={styles.sectionLabel}>선택 공정 (필요 시 추가)</span>
              <div className={styles.optionalGrid}>
                {OPTIONAL_PROCESSES.map((process) => (
                  <ProcessCheckbox
                    key={process.id}
                    process={process}
                    selected={step2.selectedProcesses.includes(process.id)}
                    onToggle={toggleProcess}
                    hasDetail={Boolean(SECTION_MAP[process.id])}
                  />
                ))}
              </div>
            </div>
          </div>

          {detailProcesses.length > 0 && (
            <div className={styles.detailSection}>
              <div className={styles.detailDivider} />
              <span className={styles.detailTitle}>
                공정 세부 설정 ·{' '}
                {detailProcesses.filter((process) => getMissingProcessFields(process.id, step4).length === 0).length}/
                {detailProcesses.length} 완료
              </span>
              <p className={styles.detailHint}>
                선택한 공정의 모든 항목을 확인해 주세요. 판단이 어려운 항목은 ‘모름’을 선택할 수 있어요. 철거는 선택
                여부만 반영되며, 나머지 공정은 일반 기준으로 산출돼요.
              </p>
              <div className={styles.accordionList}>
                {detailProcesses.map((process) => {
                  const isOpen = openId === process.id;
                  const SectionComponent = SECTION_MAP[process.id]!;
                  return (
                    <div key={process.id} className={styles.accordionItem}>
                      <button
                        type="button"
                        id={`detail-${process.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`detail-body-${process.id}`}
                        className={styles.accordionHeader}
                        onClick={() => setOpenId(isOpen ? null : process.id)}
                      >
                        <span
                          className={`${styles.accordionHeaderText}${isOpen ? ` ${styles.accordionHeaderTextOpen}` : ''}`}
                        >
                          {process.name} ·{' '}
                          {getMissingProcessFields(process.id, step4).length === 0 ? '입력 완료' : '입력 필요'}
                        </span>
                        <span
                          className={`${styles.accordionChevron}${isOpen ? ` ${styles.accordionChevronOpen}` : ''}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M4 6L8 10L12 6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                      <div
                        id={`detail-body-${process.id}`}
                        inert={!isOpen}
                        aria-hidden={!isOpen}
                        className={`${styles.accordionBody}${isOpen ? ` ${styles.accordionBodyOpen}` : ''}`}
                      >
                        <div
                          className={`${styles.accordionBodyInner}${isOpen ? ` ${styles.accordionBodyInnerOpen}` : ''}`}
                        >
                          <SectionComponent
                            data={step4[process.id as keyof typeof step4] ?? {}}
                            onChange={(patch) => setStep4(process.id as keyof typeof step4, patch)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {validationError && (
            <p role="alert" style={{ color: 'red', fontSize: '13px', marginBottom: '8px' }}>
              {validationError}
            </p>
          )}
          <StepActions onNext={handleNext} onSecondary={prevStep} />
        </div>
      </div>
    </div>
  );
};
