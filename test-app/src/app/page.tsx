'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateSurveyProgress } from '@/lib/supabase'

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { isEmail } from 'validator';

  export default function Component() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
  
    const handleStartSurvey = async () => {
      setLoading(true)
      try {
        const progress = await getOrCreateSurveyProgress(email)
        if (progress) {
          // If there's existing progress, redirect to the appropriate step
          if (progress.status === 'completed') {
            router.push('/thank-you')
          } else {
            router.push(`/question/${progress.step || 1}`)
          }
        }
      } catch (error) {
        console.error('Error starting survey:', error)
        alert('An error occurred while starting the survey. Please try again later.');
      }
      setLoading(false)
    }
  

  return (
    <div className="min-h-screenbg-gradient-to-tl from-black to-gray-600 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 lg:relative lg:h-[400px] order-1 lg:order-none">
        <Image
          src="/path-to-your-shoe-image.png"
          alt="Athletic shoe"
          fill
          className="object-contain transform -rotate-12 scale-150 lg:scale-100 opacity-50 lg:opacity-100 transition-transform duration-500"
          priority
        />
        <div className="absolute top-1/4 left-1/4 w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full opacity-20 lg:opacity-30 transform -rotate-12 lg:rotate-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-8 lg:w-32 lg:h-10 bg-white opacity-20 lg:opacity-30 transform rotate-45 lg:rotate-0"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl w-full lg:grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 lg:col-start-2">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Questionnaire
            </h1>
            <div className="absolute inset-0 border-2 border-orange-400 transform translate-x-2 translate-y-2 -z-10" />
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

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address..."
                className="bg-white"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button onClick={handleStartSurvey} disabled={loading}
              className="w-full bg-lime-300 hover:bg-lime-400 text-black font-semibold group"
            >
              Start Survey
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}