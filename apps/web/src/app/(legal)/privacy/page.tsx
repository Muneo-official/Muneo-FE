import { type Metadata } from 'next';
import { PolicyDocument } from '../_components/PolicyDocument/PolicyDocument';
import { privacyContent } from '../_content/privacy';

export const metadata: Metadata = {
  title: '개인정보 처리방침 · 초안',
  description: privacyContent.description,
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <PolicyDocument document={privacyContent} />;
}
