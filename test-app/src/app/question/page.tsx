'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/router"

export default function Component() {
  const [selected, setSelected] = useState<string>("")
  const [showError, setShowError] = useState(false)

  const router = useRouter();

  const handleNext = () => {
    if (!selected) {
      setShowError(true)
      return
    }
    router.push(`/rating`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-black to-gray-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <span className="text-white/60 text-sm">QUESTION 1</span>
          <h2 className="text-2xl font-bold text-white">
            What is your preferred choice?
          </h2>
        </div>

        <RadioGroup
          value={selected}
          onValueChange={(value) => {
            setSelected(value)
            setShowError(false)
          }}
          className="grid grid-cols-2 gap-4"
        >
          <label
            className={`relative flex flex-col items-center space-y-2 cursor-pointer group ${
              selected === "orange" ? "opacity-100" : "opacity-80 hover:opacity-100"
            }`}
          >
            <RadioGroupItem value="orange" className="absolute top-2" />
            <div className="bg-zinc-700/50 p-6 rounded-xl w-full aspect-square flex items-center justify-center">
              <div className="relative w-4/5 h-4/5">
                <Image
                  src="/Rectangle_orange.png"
                  alt="Nike Orange"
                  fill
                  className="object-contain transform -rotate-12 group-hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-white font-medium">Nike Orange</span>
          </label>

          <label
            className={`relative flex flex-col items-center space-y-2 cursor-pointer group ${
              selected === "black" ? "opacity-100" : "opacity-80 hover:opacity-100"
            }`}
          >
            <RadioGroupItem value="black" className="absolute top-2" />
            <div className="bg-zinc-700/50 p-6 rounded-xl w-full aspect-square flex items-center justify-center">
              <div className="relative w-4/5 h-4/5">
                <Image
                  src="/Rectangle_black.png"
                  alt="Nike Black"
                  fill
                  className="object-contain transform -rotate-12 group-hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
            <span className="text-white font-medium">Nike Black</span>
          </label>
        </RadioGroup>

        {showError && (
          <p className="text-red-500 text-sm text-center">Please select one</p>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="ghost"
            className="bg-pink-200 hover:bg-pink-300 text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-lime-300 hover:bg-lime-400 text-black"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}