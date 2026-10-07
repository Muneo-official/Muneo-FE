import { type ReactNode } from 'react';
import { Footer } from '@/app/(landing)/_components/Footer/Footer';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
