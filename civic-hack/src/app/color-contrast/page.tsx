import type { Metadata } from 'next';
import ContrastChecker from '@/components/color-contrast/ContrastChecker';

export const metadata: Metadata = {
  title: 'Color Contrast | Civic Hack',
  description: 'Check color contrast ratios for web accessibility compliance',
};

export default function ColorContrastPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ContrastChecker />
    </main>
  );
} 