'use client';

import { useState } from 'react';

const SpeedTest = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const startSpeedTest = async () => {
    setIsTestRunning(true);
    setDownloadSpeed(null);
    setProgress(0);

    const testFileSize = 100 * 1024 * 1024; // 100MB in bytes
    const startTime = performance.now();

    try {
      let downloadedSize = 0;
      
      while (downloadedSize < testFileSize) {
        const response = await fetch('/api/speedtest');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const chunk = await response.blob();
        downloadedSize += chunk.size;
        
        const currentProgress = (downloadedSize / testFileSize) * 100;
        setProgress(Math.min(currentProgress, 100));

        const currentTime = performance.now();
        const timeDiff = (currentTime - startTime) / 1000; // seconds
        const speedMbps = (downloadedSize * 8) / (1024 * 1024 * timeDiff); // Mbps
        
        setDownloadSpeed(speedMbps);
      }
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {!isTestRunning && !downloadSpeed && (
        <button
          onClick={startSpeedTest}
          className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
        >
          테스트 시작
        </button>
      )}

      {isTestRunning && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl font-bold">
            {downloadSpeed ? Math.round(downloadSpeed) : '0'}
          </div>
          <div className="text-xl">Mbps</div>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!isTestRunning && downloadSpeed && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl font-bold">{Math.round(downloadSpeed)}</div>
          <div className="text-xl">Mbps</div>
          <button
            onClick={startSpeedTest}
            className="bg-white text-black px-6 py-2 rounded-full text-lg font-bold hover:bg-gray-200 transition-colors"
          >
            다시 테스트
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeedTest; 