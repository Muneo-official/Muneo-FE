import { Logo } from '@muneo/design-system';
import Link from 'next/link';
import { CONTACT_EMAIL, OPERATOR_NAME } from '@/constants/app';
import { POLICY_DRAFT_VERSION, POLICY_LINKS, POLICY_UPDATED_AT } from '@/constants/policies';
import { type PolicyContent } from '../../_content/types';
import * as styles from './PolicyDocument.css';

export const PolicyDocument = ({ document }: { document: PolicyContent }) => (
  <div className={styles.shell}>
    <header className={styles.topbar}>
      <Link href="/" aria-label="문어 홈으로 이동" className={styles.home}>
        <Logo />
        <span>홈으로</span>
      </Link>
      <nav aria-label="정책 문서" className={styles.tabs}>
        {POLICY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.tab}
            aria-current={document.path === link.href ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>

    <main className={styles.main}>
      <div className={styles.intro}>
        <span className={styles.badge}>검토용 초안</span>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.description}>{document.description}</p>
        <p className={styles.meta}>
          버전 {POLICY_DRAFT_VERSION} · 작성일 <time dateTime={POLICY_UPDATED_AT}>{POLICY_UPDATED_AT}</time> · 시행일
          미정
        </p>
      </div>

      <aside aria-label="초안 안내" className={styles.draftNotice}>
        <strong>운영 내용을 확인하며 준비 중인 문서입니다.</strong>
        <p>
          운영자와 문의처는 확정되었고, 보관 기간·외부 처리 업체 등은 확인 중입니다. ‘운영 확인 필요’ 항목은 확정된 처리
          내용이 아닙니다. 이 초안은 아직 시행되지 않았습니다.
        </p>
      </aside>

      <div className={styles.documentGrid}>
        <aside className={styles.sidebar}>
          <nav aria-label="문서 목차">
            <p className={styles.tocTitle}>목차</p>
            <ol className={styles.toc}>
              {document.sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={styles.tocLink}>
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className={styles.article} aria-label={`${document.title} 본문`}>
          {document.sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.groups && (
                <dl className={styles.groups}>
                  {section.groups.map((group) => (
                    <div key={group.title} className={styles.group}>
                      <dt className={styles.groupTitle}>{group.title}</dt>
                      <dd className={styles.groupDescription}>{group.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {section.items && (
                <ul className={styles.items}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.pending && (
                <div className={styles.pending}>
                  <strong>운영 확인 필요</strong>
                  <p>{section.pending}</p>
                </div>
              )}
            </section>
          ))}
          <section className={styles.contact} aria-label="운영자 문의">
            <h2 className={styles.sectionTitle}>문의가 있으신가요?</h2>
            <p>운영자 {OPERATOR_NAME}에게 이메일로 문의해 주세요.</p>
            <a className={styles.contactLink} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </section>
        </article>
      </div>
    </main>
  </div>
);
