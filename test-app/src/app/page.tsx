import MainForm from '@/components/MainForm'
import SharedLayout from '@/components/SharedLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Survey',
  description: 'Questionnaire feedback',
}

export default function Home() {
  return (
    <SharedLayout>
      <MainForm />
    </SharedLayout>
  )
}