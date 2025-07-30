import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'Debug endpoint active',
    timestamp: new Date().toISOString()
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Response-Time': Date.now().toString(),
    },
  });
}