import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation } from 'react-router';
import { getAdminSession } from '@/api/auth/api';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute = () => {
  const admin = useAuthStore((s) => s.admin);
  const location = useLocation();
  const session = useQuery({
    queryKey: ['admin-session', admin?.id],
    queryFn: ({ signal }) => getAdminSession(admin!.id, signal),
    enabled: Boolean(admin && admin.role === 'ADMIN'),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  if (!admin || admin.role !== 'ADMIN') {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (session.isPending) {
    return <p role="status">관리자 권한을 확인하는 중입니다.</p>;
  }
  if (session.isError) {
    return (
      <div role="alert">
        <p>{session.error.message}</p>
        <button type="button" disabled={session.isFetching} onClick={() => void session.refetch()}>
          다시 확인
        </button>
        <button type="button" onClick={() => useAuthStore.getState().clear()}>
          로그인 화면으로
        </button>
      </div>
    );
  }

  return <Outlet />;
};
