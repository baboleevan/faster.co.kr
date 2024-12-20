import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;

    // 실제 데이터를 읽지만 메모리에 저장하지 않음
    await request.blob();
    
    return NextResponse.json({ 
      success: true,
      size: size
    });
  } catch (error) {
    console.error('Upload test error:', error);
    return NextResponse.json(
      { error: 'Upload test failed' },
      { status: 500 }
    );
  }
} 