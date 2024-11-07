import { ObjectId } from 'mongodb'

export type SurveyStep = 1 | 2 | 3

export interface SurveyData {
  step1?: 'orange' | 'black'
  step2?: {
    comfort: number | null
    looks: number | null
    price: number | null
  }
}

export interface SurveyDocument {
  _id?: ObjectId
  email: string
  step: SurveyStep
  data: SurveyData
  status: 'in-progress' | 'completed'
  submittedAt?: Date
}