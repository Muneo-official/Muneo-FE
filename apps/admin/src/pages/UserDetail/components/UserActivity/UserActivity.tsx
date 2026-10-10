import { useState } from 'react';
import { useUserActivity } from '@/api/activity/queries';
import { ACTIVITY_KINDS, ACTIVITY_LABELS, type ActivityKind } from '@/api/activity/types';
import { ApiError } from '@/api/request';
import { Card } from '@/components/Card';
import { ActivityRecord } from './ActivityRecord';
import * as styles from './UserActivity.css';

const errorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '조회 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
  if (error.status === 403) {
    return '이 데이터를 조회할 관리자 권한이 없습니다.';
  }
  if (error.code === 'USER_NOT_FOUND') {
    return '사용자를 찾을 수 없습니다. 사용자 목록에서 다시 확인해 주세요.';
  }
  if (error.status === 400) {
    return '사용자 또는 페이지 조회 조건이 올바르지 않습니다. 사용자 목록에서 다시 선택해 주세요.';
  }
  if (error.status === 503) {
    return '사용자 이용 내역 저장소에 일시적으로 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (error.status === 500) {
    return '서버에서 이용 내역을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (error.status === 404 || error.status === 501) {
    return '조회 API가 아직 제공되지 않거나 사용자를 찾을 수 없습니다. API 연결 상태를 확인해 주세요.';
  }
  if (error.code.startsWith('INVALID_ACTIVITY') || error.code === 'ACTIVITY_OWNER_MISMATCH') {
    return `${error.message} 데이터 표시를 중단했습니다.`;
  }
  return '서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.';
};

export const UserActivity = ({ userId }: { userId: number }) => {
  const [kind, setKind] = useState<ActivityKind>('estimates');
  const [page, setPage] = useState(0);
  const query = useUserActivity(userId, kind, page);
  const data = query.data;

  return (
    <Card title="사용자 이용 내역" className={styles.body}>
      <p className={styles.muted}>사용자 #{userId}의 저장된 기록입니다. 날짜는 한국 시간을 기준으로 표시합니다.</p>
      <div className={styles.controls} aria-label="이용 내역 종류">
        {ACTIVITY_KINDS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={kind === value}
            className={styles.button}
            onClick={() => {
              setKind(value);
              setPage(0);
            }}
          >
            {ACTIVITY_LABELS[value]}
          </button>
        ))}
        <button
          type="button"
          className={styles.button}
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          새로고침
        </button>
      </div>
      <div aria-live="polite" aria-busy={query.isFetching}>
        {query.isPending ? (
          <p className={styles.notice}>이용 내역을 불러오는 중입니다.</p>
        ) : query.isError ? (
          <div role="alert" className={styles.error}>
            <p>{errorMessage(query.error)}</p>
            <p>조회 실패는 기록이 0건이라는 의미가 아닙니다.</p>
            <button
              className={styles.button}
              type="button"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : data ? (
          <>
            <p className={styles.muted}>
              {ACTIVITY_LABELS[kind]} 총 {data.totalElements.toLocaleString('ko-KR')}건
            </p>
            {data.totalElements === 0 ? (
              <p className={styles.notice}>저장된 {ACTIVITY_LABELS[kind]} 기록이 없습니다.</p>
            ) : (
              <div className={styles.list}>
                {data.content.length === 0 ? (
                  <p>이 페이지의 기록이 변경되었습니다. 이전 페이지를 확인해 주세요.</p>
                ) : (
                  data.content.map((item) => <ActivityRecord key={`${kind}-${item.id}`} item={item} kind={kind} />)
                )}
              </div>
            )}
            <nav className={styles.controls} aria-label="이용 내역 페이지">
              <button
                className={styles.button}
                type="button"
                disabled={page === 0 || query.isFetching}
                onClick={() => setPage((value) => value - 1)}
              >
                이전
              </button>
              <span>
                {page + 1} / {Math.max(1, data.totalPages)} 페이지
              </span>
              <button
                className={styles.button}
                type="button"
                disabled={data.last || query.isFetching}
                onClick={() => setPage((value) => value + 1)}
              >
                다음
              </button>
            </nav>
          </>
        ) : null}
      </div>
      <details className={styles.notice}>
        <summary className={styles.summary}>조회 범위와 아직 제공되지 않는 정보</summary>
        <p>예상 견적과 진단은 사용자가 저장한 입력·결과만 조회합니다. 저장하지 않은 생성 결과는 포함되지 않습니다.</p>
        <p>업로드 원본 파일, 약관 동의 이력, 가입·최근 접속 일시는 현재 관리자 API에서 제공하지 않습니다.</p>
        <p>
          진단 피드백은 good/bad, 선택 이유, 추가 의견과 연결된 진단 ID를 표시합니다. 사용자 화면에서 의견을 변경한
          뒤에는 새로고침으로 확인해 주세요.
        </p>
      </details>
    </Card>
  );
};
