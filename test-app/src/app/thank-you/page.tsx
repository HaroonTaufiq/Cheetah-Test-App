'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { completeSurvey, getSurveyProgress, deleteSurveyProgress } from '@/lib/supabase'

export default function Component() {
  const [isCompleted, setIsCompleted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const finalizeSurvey = async () => {
      const email = localStorage.getItem('surveyEmail')
      if (email) {
        try {
          const progress = await getSurveyProgress(email)
          if (progress && progress.step === 3) {
            const success = await completeSurvey(email)
            if (success) {
              // Transfer data to MongoDB and delete from Supabase
              const response = await fetch('/api/submit-survey', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress),
              })

              if (!response.ok) {
                throw new Error('Failed to submit survey to MongoDB')
              }

              // Delete from Supabase
              await deleteSurveyProgress(email)

              setIsCompleted(true)
              localStorage.removeItem('surveyEmail')
            } else {
              throw new Error('Failed to complete survey in Supabase')
            }
          } else {
            router.push('/')
          }
        } catch (error) {
          console.error('Error finalizing survey:', error)
          setError('An error occurred while finalizing your survey. Please try again.')
        }
      } else {
        router.push('/')
      }
    }

    finalizeSurvey()
  }, [router])

  const handleBack = () => {
    router.push('/rating')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-black to-gray-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
        <div className="relative h-[300px] lg:h-[400px] order-1 lg:order-none">
          <Image
            src="/shoe.png"
            alt="Athletic shoe"
            fill
            className="object-contain scale-75 lg:scale-100 transform -rotate-12 hover:rotate-0 transition-transform duration-500"
            priority
          />
          <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-20 lg:opacity-30">
            <Image
              src="/Union.png"
              alt="Decorative element"
              width={250}
              height={250}
              className="object-contain scale-75 lg:scale-100"
              priority
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full opacity-40 lg:opacity-60">
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

        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Thank you
            </h1>
            <p className="text-xl text-white/80">
              for your feedback!
            </p>
          </div>

          {isCompleted && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="ghost"
                className="bg-pink-200 hover:bg-pink-300 text-black"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          )}

          <div className="mt-4">
            <Button
              className="bg-white hover:bg-gray-100 text-black"
              onClick={handleHome}
            >
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}