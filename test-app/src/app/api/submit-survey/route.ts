import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch('https://cheetah-test-app-flnl.vercel.app/api/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Error submitting survey');
    }

    const data = await response.json();
    return NextResponse.json({ message: data.message, id: data.id }, { status: 200 });
  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json({ message: 'Error submitting survey' }, { status: 500 });
  }
}
