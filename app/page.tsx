import dynamic from 'next/dynamic';

const SpeedTest = dynamic(() => import('../components/SpeedTest'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Faster.co.kr</h1>
      <SpeedTest />
    </main>
  );
} 