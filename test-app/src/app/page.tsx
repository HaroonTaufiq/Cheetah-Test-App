'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { isEmail } from 'validator'

import { getOrCreateSurveyProgress } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

    try {
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
    <div className="min-h-screen bg-gradient-to-tl from-black to-gray-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 max-w-4xl w-full lg:grid lg:grid-cols-2 gap-8 items-center">
        {/* Image container - absolute on mobile, relative on desktop */}
        <div className="absolute inset-0 lg:relative lg:col-start-1 lg:row-start-1 h-full lg:h-[400px]">
          <div className="relative h-full w-full">
            <Image
              src="/shoe.png"
              alt="Athletic shoe"
              fill
              className="object-contain scale-80 lg:scale-100 transform -rotate-12 hover:rotate-0 transition-transform duration-500 "
              priority
            />
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-50 lg:opacity-50">
              <Image
                src="/Union.png"
                alt="Decorative element"
                width={250}
                height={250}
                className="object-contain scale-75 lg:scale-100"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full opacity-60 lg:opacity-60">
              <Image
                src="/Elipse.png"
                alt="Decorative element"
                width={700}
                height={100}
                className="object-contain scale-75 lg:scale-100"
                priority
              />
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="relative z-20 lg:col-start-2 lg:row-start-1 p-9 rounded-lg">
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
        </div>
      </div>
    </div>
  )
}