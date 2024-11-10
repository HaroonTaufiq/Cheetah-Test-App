import { NextResponse } from 'next/server'
import { z } from 'zod'

const step1Schema = z.enum(['orange', 'black']);

const step2Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const surveySchema = z.object({
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step1: step1Schema,
    step2: step2Schema,
  }),
  status: z.enum(['in-progress', 'completed']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const validationResult = surveySchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error)
      return NextResponse.json(
        { message: 'Invalid survey data', errors: validationResult.error.errors }, 
        { status: 400 }
      )
    }

    // Transform data for MongoDB
    const mongoData = {
      ...validationResult.data,
      updatedAt: new Date().toISOString()
    }

    console.log('Sending to MongoDB:', mongoData)

    const response = await fetch('https://cheetah-test-app-flnl.vercel.app/api/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(mongoData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('MongoDB API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`MongoDB API error: ${errorData.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
    
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { message: 'Error submitting survey', error: (error as Error).message }, 
      { status: 500 }
    )
  }
}