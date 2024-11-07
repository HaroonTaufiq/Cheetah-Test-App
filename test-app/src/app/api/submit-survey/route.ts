import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export async function POST(request: Request) {
  const client = new MongoClient(uri)
  try {
    const body = await request.json()
    await client.connect()
    const database = client.db('survey_db')
    const surveys = database.collection('surveys')

    // Add a timestamp to the survey data
    const surveyData = {
      ...body,
      submittedAt: new Date()
    }

    const result = await surveys.insertOne(surveyData)
    return NextResponse.json({ message: 'Survey submitted successfully', id: result.insertedId }, { status: 200 })
  } catch (error) {
    console.error('Error submitting survey to MongoDB:', error)
    return NextResponse.json({ message: 'Error submitting survey' }, { status: 500 })
  } finally {
    await client.close()
  }
}