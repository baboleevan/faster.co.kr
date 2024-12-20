import { NextRequest, NextResponse } from 'next/server';

// 새로운 설정 방식
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // 1MB 크기의 랜덤 데이터 생성
    const totalSize = 1024 * 1024; // 1MB
    const chunkSize = 65536; // 64KB 청크
    const data = new Uint8Array(totalSize);
    
    // 청크 단위로 랜덤 데이터 생성
    for (let offset = 0; offset < totalSize; offset += chunkSize) {
      const chunk = new Uint8Array(Math.min(chunkSize, totalSize - offset));
      globalThis.crypto.getRandomValues(chunk);
      data.set(chunk, offset);
    }

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': totalSize.toString(),
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
} 