import { type Metadata } from 'next';
import { TrialAnalysis } from './TrialAnalysis';
export const metadata: Metadata = { title: '로그인 없이 견적서 진단', robots: { index: false, follow: false } };
export default function Page() {
  return <TrialAnalysis />;
}
