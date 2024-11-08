'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import SharedLayout from "@/components/SharedLayout";
import { completeSurvey, getSurveyProgress, deleteSurveyProgress } from '@/lib/supabase'

export default function Component() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const finalizeSurvey = async () => {
      const email = localStorage.getItem('surveyEmail');
      if (email) {
        try {
          const progress = await getSurveyProgress(email);
          if (progress && progress.step === 3) {
            const success = await completeSurvey(email);
            if (success) {
              // Transfer data to MongoDB and delete from Supabase
              const response = await fetch('http://localhost:3001/submit-survey', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress),
              });

              if (!response.ok) {
                throw new Error('Failed to submit survey to MongoDB');
              }

              // Delete from Supabase
              await deleteSurveyProgress(email);

              setIsCompleted(true);
              localStorage.removeItem('surveyEmail');
            } else {
              throw new Error('Failed to complete survey in Supabase');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error finalizing survey:', error);
          setError('An error occurred while finalizing your survey. Please try again.');
        }
      } else {
        router.push('/');
      }
    };

    finalizeSurvey();
  }, [router]);

  const handleBack = () => {
    router.push('/rating')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <SharedLayout>

      <div className="text-center lg:text-left space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Thank you
          </h1>
          <p className="text-xl text-white/80">
            for your feedback!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-100 px-4 py-2 rounded">
            {error}
          </div>
        )}

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
    </SharedLayout>
  )
}