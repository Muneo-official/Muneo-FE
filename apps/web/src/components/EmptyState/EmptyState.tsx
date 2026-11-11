import { Logo2 } from '@muneo/design-system';
import { type ReactNode } from 'react';
import * as styles from './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  /** 오류 메시지처럼 바로 읽혀야 하는 설명이면 alert로 알린다. */
  alert?: boolean;
  children?: ReactNode;
}

/** 결과 대신 보여주는 안내 화면(만료, 생성 실패 등). 화면 가운데에 카드 하나로 놓는다. */
export const EmptyState = ({ title, description, alert = false, children }: EmptyStateProps) => (
  <section className={styles.panel}>
    <Logo2 width={56} height={56} aria-hidden="true" />
    <div className={styles.copy}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description} role={alert ? 'alert' : undefined}>
        {description}
      </p>
    </div>
    {children && <div className={styles.actions}>{children}</div>}
  </section>
);
