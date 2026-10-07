import { type Metadata } from 'next';
import { PolicyDocument } from '../_components/PolicyDocument/PolicyDocument';
import { termsContent } from '../_content/terms';

export const metadata: Metadata = {
  title: '이용약관 · 초안',
  description: termsContent.description,
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return <PolicyDocument document={termsContent} />;
}
