import { LoginForm } from './components/LoginForm';
import * as styles from './Login.css';

export const Login = () => (
  <div className={styles.wrapper}>
    <div className={styles.card}>
      <div>
        <h1 className={styles.title}>문어 Admin</h1>
        <p className={styles.subtitle}>관리자 계정으로 로그인하세요.</p>
        {import.meta.env.DEV && import.meta.env.MODE === 'qa' && (
          <p className={styles.subtitle}>가상 데이터 QA: admin@example.test / MuneoQa123!</p>
        )}
      </div>
      <LoginForm />
    </div>
  </div>
);
