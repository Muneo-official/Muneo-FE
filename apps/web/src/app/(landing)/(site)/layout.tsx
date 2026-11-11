import { type ReactNode } from 'react';
import { Footer } from '../_components/Footer/Footer';
import { Header } from '../_components/Header/Header';
import * as styles from './layout.css';

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.page}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default SiteLayout;
