'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isEmail } from 'validator'

import { getOrCreateSurveyProgress } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SharedLayout from '../components/SharedLayout';

export default function Component() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStartSurvey = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isEmail(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {// Check if email exists
      const checkResponse = await fetch('https://cheetah-test-app-flnl-bqs3e9usc-haroon-taufiqs-projects.vercel.app/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      const checkData = await checkResponse.json();
  
      if (checkData.exists) {
        setError('This email has already been used.');
        setLoading(false);
        return;
      }
      const progress = await getOrCreateSurveyProgress(email)
      if (progress) {
        localStorage.setItem('surveyEmail', email)
        if (progress.status === 'completed') {
          router.push('/thank-you')
        } else {
          if (progress.step === 1) {
            router.push('/question')
          } else if (progress.step === 2) {
            router.push('/rating')
          } else {
            router.push('/question')
          }
        }
      }
    } catch (error) {
      console.error('Error starting survey:', error)
      setError('An error occurred while starting the survey. Please try again later.')
    }
    setLoading(false)
  }, [email, router])

  const isValidEmail = isEmail(email)

  return (
    <SharedLayout>

          <div className="space-y-6">
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Questionnaire
              </h1>
            </div>

            <Card className="bg-pink-200 border-none">
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold">Welcome!</h2>
                <p className="text-sm">
                  We&apos;re excited to hear your thoughts, ideas, and insights. Don&apos;t worry about right or wrong answers—just speak from the heart.
                </p>
                <p className="text-sm">
                  Your genuine feedback is invaluable to us!
                </p>
              </CardContent>
            </Card>

            <form onSubmit={handleStartSurvey} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-white">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  className="bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  aria-invalid={!isValidEmail}
                  aria-describedby="email-error"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-lime-300 hover:bg-lime-400 text-black font-semibold group"
                disabled={!isValidEmail || loading}
                aria-disabled={!isValidEmail || loading}
              >
                {loading ? 'Loading...' : 'Start Survey'}
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">
                  →
                </span>
              </Button>
            </form>
          </div>
          </SharedLayout>
  )
}