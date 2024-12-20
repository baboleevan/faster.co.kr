'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/app/i18n/LocaleContext';
import { translations } from '@/app/i18n/translations';

interface DeviceInfo {
  ip: string;
  isp: string;
  browser: {
    width: number;
    height: number;
    name: string;
    version: string;
  };
}

export default function DeviceInfo() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLocale();
  const t = translations[locale];

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const ua = window.navigator.userAgent;
        const browserName = ua.includes('Chrome') ? 'Chrome' : 
                          ua.includes('Firefox') ? 'Firefox' : 
                          ua.includes('Safari') ? 'Safari' : 
                          ua.includes('Edge') ? 'Edge' : 'Unknown';
        
        const browserVersion = ua.match(new RegExp(`${browserName}\\/([\\d.]+)`))?.[1] || '';

        setInfo({
          ip: data.ip,
          isp: data.org,
          browser: {
            width: window.innerWidth,
            height: window.innerHeight,
            name: browserName,
            version: browserVersion,
          },
        });
      } catch (error) {
        console.error('Failed to fetch device info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getDeviceInfo();

    const handleResize = () => {
      setInfo(prev => prev ? {
        ...prev,
        browser: {
          ...prev.browser,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      } : null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        {t.loading}
      </div>
    );
  }

  if (!info) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center">
          <span className="font-medium mb-1">{t.browser}</span>
          <span>{info.browser.name} {info.browser.version}</span>
          <span>{info.browser.width} x {info.browser.height}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium mb-1">{t.ipAddress}</span>
          <span>{info.ip}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium mb-1">{t.isp}</span>
          <span>{info.isp}</span>
        </div>
      </div>
    </div>
  );
} 