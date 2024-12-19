import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    // 1MB의 랜덤 데이터 생성
    const chunkSize = 1 * 1024 * 1024; // 1MB
    const buffer = Buffer.alloc(chunkSize);
    crypto.randomFillSync(buffer);

    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-store, no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });

    return response;
  } catch (error) {
    console.error('Speed test API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 