'use client';

import dynamic from 'next/dynamic';
import { useLocale } from '@/app/i18n/LocaleContext';
import { translations } from '@/app/i18n/translations';
import ThemeToggle from '@/components/ThemeToggle';

const SpeedTest = dynamic(() => import('@/components/SpeedTest'), {
  ssr: false,
});

export default function Home() {
  const { locale } = useLocale();
  const t = translations[locale];

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
      <ThemeToggle />
      <div className="w-full">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-500 mb-4">
            {t.title}
          </h1>
        </div>
        <SpeedTest />
      </div>
    </main>
  );
}
