import { type ActivityKind, FEEDBACK_REASON_LABELS, type JsonValue, type UserActivity } from '@/api/activity/types';
import { Badge } from '@/components/Badge';
import * as styles from './UserActivity.css';

const FIELD_LABELS: Record<string, string> = {
  space_type: '공간 유형',
  pyeong: '평수',
  room_count: '방 개수',
  floor: '층수',
  elevator: '엘리베이터',
  region: '지역',
  building_age: '건물 연식',
  company_name: '업체명',
  analyzed_date: '분석일',
};
const isObject = (value: JsonValue | undefined): value is Record<string, JsonValue> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const displayValue = (value: JsonValue) =>
  typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '미입력');
const formatActivityDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul' }).format(
    new Date(value)
  );

const Fields = ({ value }: { value: Record<string, JsonValue> }) => (
  <dl className={styles.fields}>
    {Object.entries(value).map(([key, item]) => (
      <div className={styles.field} key={key}>
        <dt className={styles.label}>{FIELD_LABELS[key] ?? key.replaceAll('_', ' ')}</dt>
        <dd className={styles.value}>{displayValue(item)}</dd>
      </div>
    ))}
  </dl>
);

const ResultSummary = ({ result, kind }: { result: Record<string, JsonValue>; kind: ActivityKind }) => {
  if (kind === 'estimates') {
    const range = result['총_견적_범위'];
    return isObject(range) ? (
      <div className={styles.notice}>
        <strong>총 예상 견적 (원)</strong>
        <Fields value={range} />
      </div>
    ) : null;
  }
  const report = result.report;
  if (!isObject(report)) {
    return null;
  }
  const summary = report.summary;
  return (
    <div className={styles.notice}>
      <strong>{typeof report.title === 'string' ? report.title : '견적서 진단 결과'}</strong>
      {isObject(summary) && typeof summary.total_risk_items === 'number' && (
        <p>확인할 항목 {summary.total_risk_items}개</p>
      )}
      {Array.isArray(report.process_sections) &&
        report.process_sections.map((section, index) => {
          if (!isObject(section)) {
            return null;
          }
          return (
            <details key={index} className={styles.record}>
              <summary className={styles.summary}>{String(section.display_name ?? section.process ?? '공종')}</summary>
              {Array.isArray(section.items) &&
                section.items.map((item, itemIndex) =>
                  isObject(item) ? (
                    <div className={styles.record} key={itemIndex}>
                      <strong>{String(item.title ?? '진단 항목')}</strong>
                      <p>{String(item.status ?? '')}</p>
                      <p className={styles.comment}>{String(item.description ?? '')}</p>
                      <p className={styles.comment}>{String(item.guide ?? '')}</p>
                    </div>
                  ) : null
                )}
            </details>
          );
        })}
    </div>
  );
};

export const ActivityRecord = ({ item, kind }: { item: UserActivity; kind: ActivityKind }) => {
  const feedback = 'rating' in item;
  return (
    <details className={styles.record}>
      <summary className={styles.summary}>
        {feedback
          ? item.rating === 'good'
            ? '도움이 됐어요'
            : '아쉬워요'
          : kind === 'estimates'
            ? '저장한 예상 견적'
            : '저장한 견적서 진단'}
        {' · '}
        {formatActivityDate(item.created_at)}
      </summary>
      <div className={styles.metadata}>
        <span>ID: {item.id}</span>
        <span>사용자: {item.user_id}</span>
      </div>
      {feedback ? (
        <>
          <Badge tone={item.rating === 'good' ? 'success' : 'danger'}>{item.rating === 'good' ? 'good' : 'bad'}</Badge>
          <p>진단 ID: {item.report_id}</p>
          <p>마지막 수정: {formatActivityDate(item.updated_at)} (한국 시간)</p>
          <div className={styles.metadata}>
            {item.reasons.length ? (
              item.reasons.map((reason, index) => (
                <Badge key={`${reason}-${index}`} tone="neutral">
                  {FEEDBACK_REASON_LABELS[reason] ?? reason}
                </Badge>
              ))
            ) : (
              <span>선택한 이유 없음</span>
            )}
          </div>
          <p className={styles.comment}>{item.comment || '추가 의견 없음'}</p>
        </>
      ) : (
        <>
          <h3>입력 정보</h3>
          <Fields value={item.input} />
          <ResultSummary result={item.result} kind={kind} />
          <details className={styles.notice}>
            <summary className={styles.summary}>저장된 결과 전체 보기</summary>
            <pre className={styles.json}>{JSON.stringify(item.result, null, 2)}</pre>
          </details>
        </>
      )}
    </details>
  );
};
