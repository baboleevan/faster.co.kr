import { NextRequest, NextResponse } from 'next/server';

// 새로운 설정 방식
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// 응답 크기 제한 해제
export async function POST(request: NextRequest) {
  try {
    // 업로드된 데이터를 읽지만 저장하지는 않음
    const data = await request.arrayBuffer();
    
    return NextResponse.json({ 
      success: true,
      size: data.byteLength 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 