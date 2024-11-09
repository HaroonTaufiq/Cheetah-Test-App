// app/api/submit-survey/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

const step2Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
})

const surveySchema = z.object({
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step1: z.enum(['orange', 'black']).optional(),
    step2: z.union([step2Schema, z.string()]).transform((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val)
        } catch {
          throw new Error('Invalid JSON string for step2')
        }
      }
      return val
    }),
  }),
  status: z.enum(['in-progress', 'completed']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the incoming data
    const validationResult = surveySchema.safeParse(body)
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error)
      return NextResponse.json({ message: 'Invalid survey data', errors: validationResult.error.errors }, { status: 400 })
    }

    const validatedData = validationResult.data

    // Proceed with submitting the survey data
    const response = await fetch('https://cheetah-test-app-flnl.vercel.app/api/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validatedData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error from external API:', errorData)
      return NextResponse.json({ message: 'Error submitting survey', error: errorData.message || 'Unknown error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ message: data.message, id: data.id }, { status: 200 })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return NextResponse.json({ message: 'Error submitting survey', error: (error as Error).message }, { status: 500 })
  }
}