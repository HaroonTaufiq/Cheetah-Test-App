import { createClient } from '@supabase/supabase-js'

// Types for our survey data
export type SurveyStep = 1 | 2

// Types for our survey data
export type SurveyProgress = {
  email: string
  progress: {
    step1?: string // Nike Orange or Nike Black
    step2?: {
      Comfort?: number
      Looks?: number
      Price?: number
    }
  }
  status: 'in-progress' | 'completed',
  step: SurveyStep
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to start or resume a survey
export async function getOrCreateSurveyProgress(email: string): Promise<SurveyProgress | null> {
  const { data, error } = await supabase
    .from('survey_progress')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching survey progress:', error)
    return null
  }

  if (!data) {
    const newProgress: SurveyProgress = {
      email,
      progress: {},
      status: 'in-progress',
      step: 1
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: newData, error: insertError } = await supabase
      .from('survey_progress')
      .insert([{ 
        email, 
        data: newProgress,
        step: 1
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating survey progress:', insertError)
      return null
    }

    return newProgress
  }

  return data.data as SurveyProgress
}

// Function to update survey progress
export async function updateSurveyProgress(
  email: string, 
  step: SurveyStep, 
  progressData: Partial<SurveyProgress['progress']>
): Promise<boolean> {
  const { data: existingData } = await supabase
    .from('survey_progress')
    .select('data')
    .eq('email', email)
    .single()

  if (!existingData) return false

  const updatedData = {
    ...existingData.data,
    progress: {
      ...existingData.data.progress,
      ...progressData
    }
  }

  const { error } = await supabase
    .from('survey_progress')
    .update({ 
      step,
      data: updatedData,
      updated_at: new Date().toISOString()
    })
    .eq('email', email)

  if (error) {
    console.error('Error updating survey progress:', error)
    return false
  }

  return true
}

// Function to complete survey
export async function completeSurvey(email: string): Promise<boolean> {
  const { error } = await supabase
    .from('survey_progress')
    .update({ 
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('email', email)

  if (error) {
    console.error('Error completing survey:', error)
    return false
  }

  return true
}

// Function to check survey status
export async function getSurveyStatus(email: string): Promise<{
  step: SurveyStep
  status: string
} | null> {
  const { data, error } = await supabase
    .from('survey_progress')
    .select('step, status')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching survey status:', error)
    return null
  }

  return data
}