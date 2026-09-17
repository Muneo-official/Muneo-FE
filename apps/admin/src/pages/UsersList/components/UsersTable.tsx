import { type PagedResult, type UserDetail } from '@/api';
import { Badge } from '@/components/Badge';
import { PROVIDER_LABEL, ROLE_LABEL, formatPhone } from '@/lib/formatters';
import * as styles from './UsersTable.css';

interface UsersTableProps {
  data?: PagedResult<UserDetail>;
  isLoading: boolean;
  onRowClick: (userId: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const UsersTable = ({ data, isLoading, onRowClick, onPrevPage, onNextPage }: UsersTableProps) => (
  <div className={styles.card}>
    <div className={styles.tableScroll} role="region" aria-label="사용자 목록" tabIndex={0}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>이메일</th>
            <th className={styles.th}>이름</th>
            <th className={styles.th}>연락처</th>
            <th className={styles.th}>가입 방식</th>
            <th className={styles.th}>권한</th>
            <th className={styles.th}>상태</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((user) => (
            <tr key={user.id} className={styles.tr} onClick={() => onRowClick(user.id)}>
              <td className={styles.td}>{user.id}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{formatPhone(user.phoneNumber)}</td>
              <td className={styles.td}>{PROVIDER_LABEL[user.authProvider]}</td>
              <td className={styles.td}>
                <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{ROLE_LABEL[user.role]}</Badge>
              </td>
              <td className={styles.td}>
                <Badge tone={user.deleted ? 'danger' : 'success'}>{user.deleted ? '탈퇴' : '활성'}</Badge>
              </td>
            </tr>
          ))}
          {data && data.content.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.empty}>
                조건에 맞는 사용자가 없습니다.
              </td>
            </tr>
          )}
          {isLoading && !data && (
            <tr>
              <td colSpan={7} className={styles.empty}>
                불러오는 중...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {data && data.totalElements > 0 && (
      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          총 {data.totalElements.toLocaleString()}명 · 페이지 {data.page + 1} / {data.totalPages}
        </span>
        <div className={styles.pageButtons}>
          <button type="button" className={styles.pageBtn} disabled={data.first} onClick={onPrevPage}>
            이전
          </button>
          <button type="button" className={styles.pageBtn} disabled={data.last} onClick={onNextPage}>
            다음
          </button>
        </div>
      </div>
    )}
  </div>
);
