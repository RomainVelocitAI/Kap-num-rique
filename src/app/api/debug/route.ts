import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'Debug endpoint active',
    timestamp: new Date().toISOString()
  });
}