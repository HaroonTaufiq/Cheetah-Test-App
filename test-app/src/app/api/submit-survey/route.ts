import { NextResponse } from 'next/server'
import { z } from 'zod'

const step2Schema = z.enum(['orange', 'black']);

const step3Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const surveySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step2: step2Schema,
    step3: step3Schema,
  }),
  status: z.enum(['in-progress', 'completed']),
  created_at: z.string(),
  updated_at: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', JSON.stringify(body, null, 2))

    const validationResult = surveySchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation error:', JSON.stringify(validationResult.error, null, 2))
      return NextResponse.json(
        { message: 'Invalid survey data', errors: validationResult.error.errors }, 
        { status: 400 }
      )
    }

    const mongoData = {
      ...validationResult.data,
      updatedAt: new Date().toISOString()
    }

    console.log('Sending to MongoDB:', JSON.stringify(mongoData, null, 2))

    const response = await fetch('https://cheetah-test-app-flnl.vercel.app/api/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(mongoData)
    })            

    console.log('Response status:', response.status)
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2))

    const responseText = await response.text()
    console.log('Response body:', responseText)

    if (!response.ok) {
      console.error('MongoDB API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      })
      throw new Error(`MongoDB API error: ${responseText || 'Unknown error'}`)
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data, { status: 200 })
    
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { message: 'Error submitting survey', error: (error as Error).message }, 
      { status: 500 }
    )
  }
}