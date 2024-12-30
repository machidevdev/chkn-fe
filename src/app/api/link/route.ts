import { NextResponse } from 'next/server';
const endpoint = 'https://chkn-indexer-production.up.railway.app/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to the actual backend
    const backendResponse = await fetch(`${endpoint}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Forwarding error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 