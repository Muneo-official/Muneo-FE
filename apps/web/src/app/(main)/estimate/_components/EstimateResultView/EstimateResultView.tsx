'use client';

import { CaretDownSmIcon } from '@muneo/design-system';
import { type ReactNode, useState } from 'react';
import { type EstimateGenerateRequest, type EstimateGenerateResponse, type EstimateLineItem } from '@/api/estimate';
import * as styles from '../Step5EstimateReview/Step5EstimateReview.css';

const formatWon = (amount: number): string => {
  const man = Math.round(amount / 10000);
  return `${man.toLocaleString('ko-KR')}만원`;
};

const formatRange = (min: number, max: number): string => `${formatWon(min)} ~ ${formatWon(max)}`;

const SELECTION_ONLY_KO = new Set(['전기/조명', '목공', '도장', '마감/공과잡비', '창호', '도어', '필름', '가구']);

// ─────────── 아코디언 아이템 ───────────

interface DisplayItem {
  name: string;
  range: string;
  refCount: number;
}

interface ProcessEstimateDisplay {
  processName: string;
  totalRange: string;
  items: DisplayItem[];
  insufficientData: boolean;
}

const buildDisplayItems = (lineItems: EstimateLineItem[]): DisplayItem[] =>
  lineItems.map((item) => ({
    name: item.description,
    range: formatRange(item.amount_range.최소, item.amount_range.최대),
    refCount: item.등장_사례_수,
  }));

const AccordionItem = ({ estimate }: { estimate: ProcessEstimateDisplay }) => {
  const [isOpen, setIsOpen] = useState(estimate.items.length > 0);
  const hasRefData = estimate.items.some((item) => item.refCount > 0);

  return (
    <div className={styles.accordionItemWrapper}>
      <button type="button" className={styles.accordionHeader} onClick={() => setIsOpen((prev) => !prev)}>
        <div className={styles.accordionHeaderLeft}>
          <span className={`${styles.accordionArrow}${isOpen ? ` ${styles.accordionArrowOpen}` : ''}`}>
            <CaretDownSmIcon width={24} height={24} />
          </span>
          <span className={styles.accordionTitle}>{estimate.processName} 공사</span>
        </div>
        <span className={styles.accordionAmount}>{estimate.totalRange}</span>
      </button>

      <div className={`${styles.accordionBody}${isOpen ? ` ${styles.accordionBodyOpen}` : ''}`}>
        {estimate.items.length > 0 ? (
          <div className={styles.accordionContent}>
            <div className={hasRefData ? styles.accordionTableHeader : styles.accordionTableHeaderNoRef}>
              <span>항목</span>
              <span>예상 범위</span>
              {hasRefData && <span>참조</span>}
            </div>
            <div className={styles.accordionDivider} />

            {estimate.items.map((item) => (
              <div key={item.name} className={styles.accordionRow}>
                <div className={hasRefData ? styles.accordionRowContent : styles.accordionRowContentNoRef}>
                  <span>{item.name}</span>
                  <span>{item.range}</span>
                  {hasRefData && (
                    <span className={item.refCount >= 5 ? styles.refCountGreen : styles.refCountOrange}>
                      {item.refCount}건{item.refCount < 5 ? ' ⚠' : ''}
                    </span>
                  )}
                </div>
                <div className={styles.accordionItemDivider} />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyNote}>
            {estimate.insufficientData ? '참고할 사례가 부족해 금액을 산출하지 못했어요.' : '상세 항목 준비 중입니다.'}
          </p>
        )}
      </div>
    </div>
  );
};

// ─────────── 총 견적 배너 ───────────

const TotalBanner = ({ result }: { result: EstimateGenerateResponse }) => {
  const { 최소, 최대 } = result.총_견적_범위;
  return (
    <div className={styles.totalBanner}>
      <div className={styles.bannerLeft}>
        <span className={styles.bannerSubtitle}>총 예상 견적 범위 (부가세 별도)</span>
        <span className={styles.bannerAmount}>{formatRange(최소, 최대)}</span>
      </div>
      {result.참고_사례_수 > 0 && <span className={styles.bannerRef}>{result.참고_사례_수}건 참고</span>}
    </div>
  );
};

// ─────────── 공정별 합산 테이블 ───────────

const ProcessTotalTable = ({ result }: { result: EstimateGenerateResponse }) => {
  const rows = Object.entries(result.공종별_단가_범위).map(([processName, range]) => ({
    name: processName,
    range: formatRange(range.최소, range.최대),
  }));
  const { 최소, 최대 } = result.총_견적_범위;

  return (
    <div className={styles.processTotal}>
      <span className={styles.processTotalTitle}>공정별 합산</span>
      <div className={styles.processTotalTable}>
        <div className={styles.tableRows}>
          <div className={styles.tableHeader}>
            <span className={styles.tableHeaderCell}>공정</span>
            <span className={styles.tableHeaderCell}>범위</span>
          </div>
          {rows.map((row) => (
            <div key={row.name} className={styles.tableRow}>
              <div className={styles.tableRowContent}>
                <span>{row.name}</span>
                <span>{row.range}</span>
              </div>
              <div className={styles.tableDivider} />
            </div>
          ))}
        </div>
        <div className={styles.totalRow}>
          <div className={styles.totalDivider} />
          <div className={styles.totalContent}>
            <span className={styles.totalLabel}>보정 후 합계</span>
            <span className={styles.totalValue}>{formatRange(최소, 최대)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────── 입력 요약 패널 (좌측) ───────────

interface SummaryPanelProps {
  regionLabel: string;
  spaceLabel: string;
  areaLabel: string;
  roomLabel: string;
  buildingAgeLabel: string;
  elevatorLabel: string;
  floorLabel: string;
  occupancyLabel: string;
  demolitionLabel: string;
  modeLabel: string;
  processCount: number;
  corrections: string[];
  result: EstimateGenerateResponse;
  onEdit?: () => void;
}

const SummaryPanel = ({
  regionLabel,
  spaceLabel,
  areaLabel,
  roomLabel,
  buildingAgeLabel,
  elevatorLabel,
  floorLabel,
  occupancyLabel,
  demolitionLabel,
  modeLabel,
  processCount,
  corrections,
  result,
  onEdit,
}: SummaryPanelProps) => {
  const rows = [
    { label: '시공 범위', value: `${modeLabel} (${processCount}개 공정)` },
    { label: '지역 / 공간', value: `${regionLabel} · ${spaceLabel}` },
    { label: '면적 / 방', value: `${areaLabel} / ${roomLabel}` },
    { label: '연식 / 등급', value: `${buildingAgeLabel} / 중급` },
    { label: '철거 / 거주', value: `${demolitionLabel} / ${occupancyLabel}` },
    { label: '층수 / EV', value: `${floorLabel} / ${elevatorLabel}` },
  ];

  return (
    <div className={styles.leftPanel}>
      <div className={styles.summarySection}>
        <div className={styles.summaryHeader}>
          <span className={styles.summaryTitle}>입력 정보 요약</span>
          {onEdit && (
            <button type="button" className={styles.editButton} onClick={onEdit}>
              수정
            </button>
          )}
        </div>

        <div className={styles.summaryRows}>
          {rows.map(({ label, value }) => (
            <div key={label} className={styles.summaryRow}>
              <span className={styles.summaryRowLabel}>{label}</span>
              <span className={styles.summaryRowValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={styles.correctionBox}>
          <span className={styles.correctionTitle}>적용된 보정</span>
          <div className={styles.correctionItems}>
            {corrections.map((c) => (
              <span key={c} className={styles.correctionItem}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ProcessTotalTable result={result} />
    </div>
  );
};

// ─────────── 메인 컴포넌트 ───────────

export interface EstimateResultViewProps {
  input: EstimateGenerateRequest;
  result: EstimateGenerateResponse;
  onEdit?: () => void;
  actions?: ReactNode;
}

export const EstimateResultView = ({ input, result, onEdit, actions }: EstimateResultViewProps) => {
  const regionLabel = input.지역 || '-';
  const spaceLabel = input.공간유형 || '-';
  const areaLabel = input.평수 ? `${input.평수}평` : '-';
  const roomLabel = input.방개수 ? `${input.방개수}개` : '-';
  const buildingAgeLabel = input.건물연식 || '-';
  const elevatorLabel = input.엘리베이터 || '-';
  const floorLabel = input.층수 ? `${input.층수}층` : '-';
  const occupancyLabel = input.거주중공사 || '-';
  const modeLabel = input.시공범위 === '전체' ? '전체 리모델링' : '부분 시공';
  const processCount = input.공종.length;
  const demolitionLabel = input.철거여부;

  const insufficientNames = result.데이터_부족_공종 ?? [];
  const selectionOnlyNames = input.공종.filter(
    (name) => SELECTION_ONLY_KO.has(name) && !insufficientNames.includes(name)
  );

  const accordionItems: ProcessEstimateDisplay[] = result.선택_공종.map((processName) => {
    const rangeData = result.공종별_단가_범위[processName];
    const lineItems = result.공종별_항목_명세[processName] ?? [];
    return {
      processName,
      totalRange: rangeData ? formatRange(rangeData.최소, rangeData.최대) : '-',
      items: buildDisplayItems(lineItems),
      insufficientData: insufficientNames.includes(processName),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <SummaryPanel
          regionLabel={regionLabel}
          spaceLabel={spaceLabel}
          areaLabel={areaLabel}
          roomLabel={roomLabel}
          buildingAgeLabel={buildingAgeLabel}
          elevatorLabel={elevatorLabel}
          floorLabel={floorLabel}
          occupancyLabel={occupancyLabel}
          demolitionLabel={demolitionLabel}
          modeLabel={modeLabel}
          processCount={processCount}
          corrections={result.보정_적용}
          result={result}
          onEdit={onEdit}
        />

        <div className={styles.rightPanel}>
          <TotalBanner result={result} />

          {selectionOnlyNames.length > 0 && (
            <div className={styles.selectionOnlyNotice}>
              <span className={styles.selectionOnlyText}>
                ℹ 공종 선택만 반영된 항목: {selectionOnlyNames.join(', ')} — 세부 단가는 현장 방문 후 확인하세요.
              </span>
            </div>
          )}

          {insufficientNames.length > 0 && (
            <div className={styles.selectionOnlyNotice}>
              <span className={styles.selectionOnlyText}>
                ℹ 참고 사례가 부족해 금액을 산출하지 못한 항목: {insufficientNames.join(', ')} — 현장 견적으로
                확인하세요.
              </span>
            </div>
          )}

          <div className={styles.detailSection}>
            <span className={styles.detailTitle}>공정별 세부 견적</span>
            <div className={styles.accordionList}>
              {accordionItems.map((estimate) => (
                <AccordionItem key={estimate.processName} estimate={estimate} />
              ))}
            </div>
          </div>

          {actions}
        </div>
      </div>
    </div>
  );
};
