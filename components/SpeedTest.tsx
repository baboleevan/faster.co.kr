'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLocale } from '@/app/i18n/LocaleContext';
import { translations } from '@/app/i18n/translations';
import DeviceInfo from '@/components/DeviceInfo';

// Types
interface SpeedTestState {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  downloadProgress: number;
  uploadProgress: number;
  status: 'idle' | 'testing' | 'complete';
  error: string | null;
}

// Component
const SpeedTest = () => {
  const { locale } = useLocale();
  const t = translations[locale];

  const [state, setState] = useState<SpeedTestState>({
    downloadSpeed: null,
    uploadSpeed: null,
    downloadProgress: 0,
    uploadProgress: 0,
    status: 'idle',
    error: null,
  });

  const measureDownloadSpeed = async () => {
    const testFileSize = 100 * 1024 * 1024; // 100MB
    const startTime = performance.now();
    let downloadedSize = 0;

    try {
      while (downloadedSize < testFileSize) {
        const response = await fetch('/api/speedtest');
        if (!response.ok) throw new Error(t.downloadError);
        
        const chunk = await response.blob();
        downloadedSize += chunk.size;
        
        const currentTime = performance.now();
        const timeDiff = (currentTime - startTime) / 1000; // seconds
        const speedMbps = (downloadedSize * 8) / (1024 * 1024 * timeDiff);
        const progress = (downloadedSize / testFileSize) * 100;

        setState(prev => ({
          ...prev,
          downloadSpeed: speedMbps,
          downloadProgress: Math.min(progress, 100),
        }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: t.downloadError }));
      throw error;
    }
  };

  const generateRandomData = useCallback((size: number) => {
    const buffer = new Uint8Array(size);
    for (let i = 0; i < buffer.length; i += 4096) {
      const chunk = Math.min(4096, buffer.length - i);
      crypto.getRandomValues(buffer.subarray(i, i + chunk));
    }
    return buffer;
  }, []);

  const measureUploadSpeed = async () => {
    const testFileSize = 25 * 1024 * 1024; // 25MB
    const chunkSize = 256 * 1024; // 256KB chunks
    const startTime = performance.now();
    let uploadedSize = 0;

    try {
      while (uploadedSize < testFileSize) {
        const chunk = generateRandomData(Math.min(chunkSize, testFileSize - uploadedSize));
        
        const response = await fetch('/api/speedtest/upload', {
          method: 'POST',
          body: chunk,
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t.uploadError);
        }
        
        uploadedSize += chunk.length;
        const currentTime = performance.now();
        const timeDiff = (currentTime - startTime) / 1000;
        const speedMbps = (uploadedSize * 8) / (1024 * 1024 * timeDiff);
        const progress = (uploadedSize / testFileSize) * 100;

        setState(prev => ({
          ...prev,
          uploadSpeed: speedMbps,
          uploadProgress: Math.min(progress, 100),
        }));

        // 브라우저가 UI를 업데이트할 수 있도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setState(prev => ({ ...prev, error: t.uploadError }));
      throw error;
    }
  };

  const startSpeedTest = async () => {
    setState({
      downloadSpeed: null,
      uploadSpeed: null,
      downloadProgress: 0,
      uploadProgress: 0,
      status: 'testing',
      error: null,
    });

    try {
      // 다운로드와 업로드 테스트를 동시에 시작
      await Promise.all([
        measureDownloadSpeed(),
        measureUploadSpeed()
      ]);
      setState(prev => ({ ...prev, status: 'complete' }));
    } catch (error) {
      console.error('Speed test error:', error);
    }
  };

  const formatSpeed = (speed: number | null) => {
    if (!speed) return '0';
    return speed.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  };

  const convertToMB = (mbps: number | null) => {
    if (!mbps) return '0';
    return (mbps / 8).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  };

  const SpeedGauge = ({ speed, progress, label }: { speed: number | null; progress: number; label: string }) => {
    const radius = 140;
    const strokeWidth = 12;
    const normalizedProgress = Math.min(100, Math.max(0, progress));
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (normalizedProgress / 100) * circumference;
    const startAngle = -180;
    const endAngle = 0;
    
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    const speedMarkers = [0, 100, 200, 300, 400, 500];

    return (
      <div className="flex flex-col items-center">
        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {label}
        </div>
        <div className="relative w-[300px] h-[300px]">
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className="transform -rotate-180"
          >
            <path
              d={describeArc(150, 150, radius, startAngle, endAngle)}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-200 dark:text-gray-800"
            />
            
            <motion.path
              d={describeArc(150, 150, radius, startAngle, endAngle)}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              className="text-purple-600 dark:text-purple-500"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 0.5 }}
            />

            {speedMarkers.map((markerSpeed, index) => {
              const angle = startAngle + (endAngle - startAngle) * (index / (speedMarkers.length - 1));
              const point = polarToCartesian(150, 150, radius + 20, angle);
              return (
                <text
                  key={markerSpeed}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                  transform={`rotate(180 ${point.x} ${point.y})`}
                >
                  {markerSpeed}
                </text>
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center transform rotate-180">
            <div className="transform rotate-180">
              <div className="text-5xl font-bold tabular-nums text-gray-900 dark:text-white">
                {formatSpeed(speed)}
              </div>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>Mbps</span>
                <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <span>{convertToMB(speed)} MB/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {state.status === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.button
              onClick={startSpeedTest}
              className="text-2xl font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.startTest}
            </motion.button>
          </motion.div>
        )}

        {state.status === 'testing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <SpeedGauge 
              speed={state.downloadSpeed}
              progress={state.downloadProgress}
              label={t.downloading}
            />
            <SpeedGauge 
              speed={state.uploadSpeed}
              progress={state.uploadProgress}
              label={t.uploading}
            />
          </motion.div>
        )}

        {state.status === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.download}</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatSpeed(state.downloadSpeed)}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>Mbps</span>
                  <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                  <span>{convertToMB(state.downloadSpeed)} MB/s</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.upload}</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {formatSpeed(state.uploadSpeed)}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>Mbps</span>
                  <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                  <span>{convertToMB(state.uploadSpeed)} MB/s</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <motion.button
                onClick={startSpeedTest}
                className="text-xl font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.retryTest}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center text-red-600 dark:text-red-500"
        >
          {state.error}
        </motion.div>
      )}

      <DeviceInfo />
    </div>
  );
};

export default SpeedTest; 