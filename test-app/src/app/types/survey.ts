import { ObjectId } from 'mongodb'

export type SurveyStep = 1 | 2 | 3

export type Step1Data = 'orange' | 'black'

export interface Step2Data {
  comfort: number | null
  looks: number | null
  price: number | null
}

export interface SurveyData {
  step1?: Step1Data
  step2?: Step2Data
}

export interface SurveyProgress {
  email: string
  step: SurveyStep
  data: SurveyData
  status: 'in-progress' | 'completed'
}

export interface SurveyDocument {
  _id?: ObjectId
  email: string
  step: SurveyStep
  data: SurveyData
  status: 'in-progress' | 'completed'
  submittedAt?: Date
}