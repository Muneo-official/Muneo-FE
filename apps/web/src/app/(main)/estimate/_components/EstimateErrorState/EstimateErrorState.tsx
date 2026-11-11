import { ArrowLeftMdIcon, Button } from '@muneo/design-system';
import { EmptyState } from '@/components/EmptyState/EmptyState';

/** 가견적 생성 실패 화면. 로그인 결과와 비회원 체험이 같이 쓴다. */
export const EstimateErrorState = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <EmptyState title="가견적을 만들지 못했어요" description={message} alert>
    <Button variant="outlineSecondary" size="md" onClick={onBack}>
      <ArrowLeftMdIcon width={20} height={20} />
      이전 단계로 돌아가기
    </Button>
  </EmptyState>
);
