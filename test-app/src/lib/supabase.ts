import { createClient } from '@supabase/supabase-js'
import { SurveyStep, SurveyProgress, Step2Data, Step1Data } from '../app/types/survey'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getOrCreateSurveyProgress(email: string): Promise<SurveyProgress | null> {
  try {
    const { data, error } = await supabase
      .from('survey_progress')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching survey progress:', error)
      throw error
    }

    if (!data) {
      const newProgress: SurveyProgress = {
        email,
        step: 1,
        data: {},
        status: 'in-progress'
      }

      const { data: insertedData, error: insertError } = await supabase
        .from('survey_progress')
        .insert([newProgress])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating survey progress:', insertError)
        throw insertError
      }

      return insertedData as SurveyProgress
    }

    return data as SurveyProgress
  } catch (error) {
    console.error('Unexpected error in getOrCreateSurveyProgress:', error)
    throw error
  }
}

export async function updateSurveyProgress(
  email: string, 
  step: SurveyStep, 
  stepData: Step1Data | Step2Data
): Promise<boolean> {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('survey_progress')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError) {
      console.error('Error fetching existing survey progress:', fetchError)
      return false
    }

    if (!existingData) return false

    const updatedData = {
      ...existingData.data,
      [`step${step}`]: stepData
    }

    const { error: updateError } = await supabase
      .from('survey_progress')
      .update({ 
        step, 
        data: updatedData, 
        status: step === 3 ? 'completed' : 'in-progress' 
      })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating survey progress:', updateError)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error in updateSurveyProgress:', error)
    return false
  }
}

export async function completeSurvey(email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('survey_progress')
      .update({ status: 'completed' })
      .eq('email', email)

    if (error) {
      console.error('Error completing survey:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error in completeSurvey:', error)
    return false
  }
}

export async function getSurveyProgress(email: string): Promise<SurveyProgress | null> {
  try {
    const { data, error } = await supabase
      .from('survey_progress')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching survey progress:', error)
      return null
    }

    return data as SurveyProgress
  } catch (error) {
    console.error('Unexpected error in getSurveyProgress:', error)
    return null
  }
}

export async function deleteSurveyProgress(email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('survey_progress')
      .delete()
      .eq('email', email)

    if (error) {
      console.error('Error deleting survey progress:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error in deleteSurveyProgress:', error)
    return false
  }
}