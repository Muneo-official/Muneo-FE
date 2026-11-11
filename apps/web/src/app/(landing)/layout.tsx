import { type ReactNode } from 'react';

// 랜딩(헤더·푸터)과 비회원 체험(사이드바)이 각자 레이아웃을 갖고, 로그인 모달 슬롯만 함께 쓴다.
const LandingLayout = ({ children, modal }: { children: ReactNode; modal: ReactNode }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default LandingLayout;
