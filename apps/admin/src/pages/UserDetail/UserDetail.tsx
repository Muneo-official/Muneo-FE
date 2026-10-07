import { Modal } from '@muneo/design-system';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ROLE_LABEL, PROVIDER_LABEL } from '@/lib/formatters';
import { UserActivity } from './components/UserActivity/UserActivity';
import { UserDangerZone } from './components/UserDangerZone';
import { UserEditForm } from './components/UserEditForm';
import { UserRoleSection } from './components/UserRoleSection';
import { useUserDetail } from './hooks/useUserDetail';
import * as styles from './UserDetail.css';

export const UserDetail = () => {
  const {
    userId,
    detail,
    user,
    isSelf,
    form,
    setForm,
    errors,
    submitForm,
    isSubmitting,
    pendingRole,
    setPendingRole,
    confirm,
    setConfirm,
    closeConfirm,
    runConfirmedAction,
    goBack,
  } = useUserDetail();

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return <div className={styles.loading}>잘못된 사용자 ID입니다.</div>;
  }

  if (detail.isLoading) {
    return <div className={styles.loading}>불러오는 중...</div>;
  }

  if (detail.isError || !user) {
    return (
      <div className={styles.errorBox}>
        {detail.error instanceof Error ? detail.error.message : '사용자 정보를 불러오지 못했습니다.'}
      </div>
    );
  }

  const confirmTitle =
    confirm === 'delete'
      ? '사용자를 탈퇴 처리하시겠습니까?'
      : confirm === 'restore'
        ? '사용자를 복구하시겠습니까?'
        : '권한을 변경하시겠습니까?';

  const confirmSubtitle =
    confirm === 'delete'
      ? `${user.email} 계정이 탈퇴 처리되며 refresh token이 삭제됩니다.`
      : confirm === 'restore'
        ? `${user.email} 계정이 다시 활성화됩니다.`
        : `${user.email}의 권한이 ${pendingRole ? ROLE_LABEL[pendingRole] : ''}(으)로 변경됩니다.`;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={goBack}>
        ← 목록으로
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{user.name}</h1>
        <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{ROLE_LABEL[user.role]}</Badge>
        <Badge tone={user.deleted ? 'danger' : 'success'}>{user.deleted ? '탈퇴' : '활성'}</Badge>
      </div>

      <Card title="계정 정보">
        <div className={styles.grid}>
          <div className={styles.fieldRow}>
            <span className={styles.readLabel}>사용자 ID</span>
            <span className={styles.readValue}>{user.id}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.readLabel}>가입 방식</span>
            <span className={styles.readValue}>{PROVIDER_LABEL[user.authProvider]}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.readLabel}>이메일 인증</span>
            <span className={styles.readValue}>{user.emailVerified ? '인증됨' : '미인증'}</span>
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.readLabel}>프로필 완성</span>
            <span className={styles.readValue}>{user.profileCompleted ? '완료' : '미완료'}</span>
          </div>
        </div>
      </Card>

      <UserActivity key={userId} userId={userId} />

      <UserEditForm form={form} errors={errors} isSubmitting={isSubmitting} onChange={setForm} onSubmit={submitForm} />

      <UserRoleSection
        currentRole={user.role}
        pendingRole={pendingRole}
        isSelf={isSelf}
        isDeleted={user.deleted}
        onRoleSelect={setPendingRole}
        onApply={() => setConfirm('role')}
      />

      <UserDangerZone
        isDeleted={user.deleted}
        isSelf={isSelf}
        onDelete={() => setConfirm('delete')}
        onRestore={() => setConfirm('restore')}
      />

      <Modal
        isOpen={confirm !== null}
        title={confirmTitle}
        subtitle={confirmSubtitle}
        confirmLabel={confirm === 'delete' ? '탈퇴 처리' : '확인'}
        cancelLabel="취소"
        onCancel={closeConfirm}
        onConfirm={runConfirmedAction}
      />
    </div>
  );
};
