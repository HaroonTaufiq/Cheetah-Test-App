'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { completeSurvey } from '@/lib/supabase'

export default function Component() {

    // const router = useRouter()

    useEffect(() => {
        const finalizeSurvey = async () => {
            const email = localStorage.getItem('userEmail') // Assuming you stored the email in localStorage
            if (email) {
                const success = await completeSurvey(email)
                if (!success) {
                    console.error('Failed to complete survey')
                    // Handle error (e.g., show error message to user)
                }
                localStorage.removeItem('userEmail') // Clear the stored email
            }
        }

        finalizeSurvey()
    }, [])


    return (
        <div className="min-h-screen bg-gradient-to-tl from-black to-gray-600 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] lg:h-[400px] order-1 lg:order-none">
                    <Image
                        src="/shoe.png"
                        alt="Athletic shoe"
                        fill
                        className="object-contain scale-75 lg:scale-100  transform -rotate-12 hover:rotate-0 transition-transform duration-500"
                        priority
                    />
                    {/* Union image at top left of the shoe */}
                    <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-20 lg:opacity-30">
                        <Image
                            src="/Union.png"
                            alt="Union"
                            width={250} // Adjust the width as needed
                            height={250} // Adjust the height as needed
                            className="object-contain scale-75 lg:scale-100"
                            priority
                        />
                    </div>
                    {/* Ellipse image below the shoe */}
                    <div className="absolute bottom-0 left-0 w-full opacity-40 lg:opacity-60">
                        <Image
                            src="/Elipse.png"
                            alt="Ellipse"
                            layout="responsive"
                            width={700} // Adjust the width as needed
                            height={100} // Adjust the height as needed
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

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                            variant="ghost"
                            className="bg-pink-200 hover:bg-pink-300 text-black"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button
                            className="bg-white hover:bg-gray-100 text-black"
                        >
                            <Home className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}