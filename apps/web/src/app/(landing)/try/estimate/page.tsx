import { type Metadata } from 'next';
import { TrialEstimate } from './TrialEstimate';
export const metadata: Metadata = { title: '로그인 없이 가견적 만들기', robots: { index: false, follow: false } };
export default function Page() {
  return <TrialEstimate />;
}
