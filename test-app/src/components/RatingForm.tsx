'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import { updateSurveyProgress, getSurveyProgress } from '@/lib/supabase'
import { Step2Data } from "@/app/types/survey"

type Ratings = Step2Data

export default function RatingForm() {
  const [ratings, setRatings] = useState<Ratings>({
    comfort: null,
    looks: null,
    price: null
  })
  const [showErrors, setShowErrors] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem('surveyEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const loadProgress = async () => {
      if (email) {
        const progress = await getSurveyProgress(email)
        if (progress && progress.data.step2) {
          setRatings(progress.data.step2)
        }
      }
    }
    loadProgress()
  }, [email])

  const handleSend = async () => {
    if (Object.values(ratings).some(rating => rating === null)) {
      setShowErrors(true)
      return
    }
    if (email) {
      const success = await updateSurveyProgress(email, 3, ratings)
      if (success) {
        router.push('/thank-you')
      } else {
        setShowErrors(true)
      }
    }
  }

  const handleRating = (category: keyof Ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }))
    setShowErrors(false)
  }

  const handleBack = () => {
    router.push('/question')
  }

  const RatingScale = ({ category, error }: { category: keyof Ratings; error: boolean }) => (
    <div className="space-y-2">
      <div className="bg-white rounded-full p-4 flex items-center justify-between">
        <span className="font-medium text-black min-w-[100px]">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRating(category, value)}
              className={`w-4 h-4 rounded-full transition-all ${
                ratings[category] === value
                  ? 'bg-black scale-125'
                  : 'bg-zinc-300 hover:bg-zinc-400'
              }`}
              aria-label={`Rate ${category} ${value} out of 5`}
            />
          ))}
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm pl-4">Please select a score</p>
      )}
    </div>
  )

  return (
    <div className="max-w-xl w-full space-y-8 mx-auto pt-48 lg:pt-0">
      <div className="text-center space-y-4">
        <span className="text-white/60 text-sm">QUESTION 2</span>
        <h2 className="text-2xl font-bold text-white">
          How important are these aspects for you?
        </h2>
      </div>

      <div className="space-y-6">
        <RatingScale category="comfort" error={showErrors && ratings.comfort === null} />
        <RatingScale category="looks" error={showErrors && ratings.looks === null} />
        <RatingScale category="price" error={showErrors && ratings.price === null} />
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          className="bg-pink-200 hover:bg-pink-300 text-black"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleSend}
          className="bg-white hover:bg-gray-100 text-black"
        >
          Send <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}