'use client';

import { SelectButton } from '@muneo/design-system';
import { type ReactNode, useState } from 'react';
import { useEstimateStore } from '../../_store/estimateStore';
import {
  BASIC_PROCESSES,
  OPTIONAL_PROCESSES,
  SANITARY_WARES,
  WALLPAPER_ROOMS,
  type BathroomDetail,
  type DemolitionDetail,
  type FlooringDetail,
  type KitchenDetail,
  type WallpaperDetail,
} from '../../_types';
import { ChatHint } from '../ChatHint/ChatHint';
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

const DemolitionSection = ({ data, onChange }: SectionProps<DemolitionDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="철거 범위">
      <div className={styles.buttonRow}>
        {(['전체 철거', '부분 철거'] as const).map((opt) => (
          <SelectButton key={opt} selected={data.scope === opt} onClick={() => onChange({ scope: opt })}>
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
  </div>
);

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
      <ChatHint visible={data.underpaperWork === '모름'} message="도배 전 초배 작업이 필요한 경우는 언제인가요?" />
    </Field>
    <p className={styles.infoNote}>
      실크벽지 기준으로 산출됩니다. 합지 선택 시 약 35% 저렴, 천연벽지는 약 40% 비쌉니다.
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
      <ChatHint visible={data.floorDemolition === '모름'} message="기존 바닥을 철거해야 하는 상황은 어떤 경우인가요?" />
    </Field>
    <p className={styles.infoNote}>강마루 기준 산출. 강화마루 약 25% 저렴, 원목마루 약 2배.</p>
  </div>
);

const BathroomSection = ({ data, onChange }: SectionProps<BathroomDetail>) => (
  <div className={styles.sectionBody}>
    <Field label="욕실 개수">
      <div className={styles.buttonRow}>
        {(['1개', '2개', '3개 이상'] as const).map((opt) => (
          <SelectButton
            key={opt}
            selected={data.bathroomCount === opt}
            onClick={() => onChange({ bathroomCount: opt })}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </Field>
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
    <p className={styles.infoNote}>전면 리모델링 시 방수 공사가 필수 포함됩니다. 대형(2평 이상) 시 약 30% 할증.</p>
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
    <p className={styles.infoNote}>ㄱ자 기준으로 산출. ㄷ자 약 40% 추가.</p>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_MAP: Partial<Record<string, React.ComponentType<SectionProps<any>>>> = {
  demolition: DemolitionSection,
  wallpaper: WallpaperSection,
  flooring: FlooringSection,
  bathroom: BathroomSection,
  kitchen: KitchenSection,
};

// ─── 메인 컴포넌트 ───

export const Step2ProcessSelection = () => {
  const { step2, step4, setStep2, setStep4, toggleProcess, nextStep, prevStep } = useEstimateStore();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleNext = () => {
    if (step2.selectedProcesses.length === 0) {
      setValidationError('공정을 1개 이상 선택해주세요.');
      return;
    }
    const wallpaperSelected = step2.selectedProcesses.includes('wallpaper');
    if (
      wallpaperSelected &&
      step4.wallpaper?.wallpaperScope === '부분 도배' &&
      !step4.wallpaper?.partialRooms?.length
    ) {
      setValidationError('부분 도배 시공할 공간을 1개 이상 선택해주세요.');
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
              <span className={styles.detailTitle}>공정 세부 설정</span>
              <p className={styles.detailHint}>
                재질·범위에 따라 비용 차이가 큰 항목들이에요. 나머지 공정은 일반 기준으로 자동 반영됩니다.
              </p>
              <div className={styles.accordionList}>
                {detailProcesses.map((process) => {
                  const isOpen = openId === process.id;
                  const SectionComponent = SECTION_MAP[process.id]!;
                  return (
                    <div key={process.id} className={styles.accordionItem}>
                      <button
                        type="button"
                        className={styles.accordionHeader}
                        onClick={() => setOpenId(isOpen ? null : process.id)}
                      >
                        <span
                          className={`${styles.accordionHeaderText}${isOpen ? ` ${styles.accordionHeaderTextOpen}` : ''}`}
                        >
                          {process.name}
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
                      <div className={`${styles.accordionBody}${isOpen ? ` ${styles.accordionBodyOpen}` : ''}`}>
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

          {validationError && <p style={{ color: 'red', fontSize: '13px', marginBottom: '8px' }}>{validationError}</p>}
          <StepActions onNext={handleNext} onSecondary={prevStep} />
        </div>
      </div>
    </div>
  );
};
