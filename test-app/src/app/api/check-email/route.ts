import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const response = await fetch('https://cheetah-test-app-flnl.vercel.app/api/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Error checking email');
    }

    const data = await response.json();
    return NextResponse.json({ exists: data.exists }, { status: 200 });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ message: 'Error checking email' }, { status: 500 });
  }
}