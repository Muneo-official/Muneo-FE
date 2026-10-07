export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  groups?: Array<{ title: string; description: string }>;
  pending?: string;
}

export interface PolicyContent {
  path: '/privacy' | '/terms';
  title: string;
  description: string;
  sections: PolicySection[];
}
