"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Shield, Smartphone, Database } from "lucide-react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleContinue = () => {
    setIsVisible(false)
    setTimeout(onComplete, 300) // Allow fade out animation
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4 min-h-screen overflow-y-auto">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl my-4">
        <CardContent className="p-6 text-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Diabetic Coverage Calculator"
              width={300}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Medical Disclaimer</span>
            </div>
            <p className="text-sm text-amber-700 leading-relaxed">
              This calculator is for educational purposes only. Always consult with your healthcare provider before
              making insulin dosage decisions. Never rely solely on this tool for medical treatment.
            </p>
          </div>

          {/* Data Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Your Privacy Matters</span>
            </div>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>All your data is saved locally on this device only</p>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Different devices will have separate records</p>
              </div>
              <p className="text-xs italic">No data is sent to external servers</p>
            </div>
          </div>

          {/* How to Use Button */}
          <Button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                window.location.href = "/instructions"
              }, 300)
            }}
            variant="outline"
            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-3 text-base"
            size="lg"
          >
            📖 How to Use This App
          </Button>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 text-lg shadow-lg"
            size="lg"
          >
            Continue to Calculator
          </Button>

          {/* Version Info */}
          <p className="text-xs text-gray-500 mt-4">Version 2.0 - Advanced Diabetic Management Tool</p>
        </CardContent>
      </Card>
    </div>
  )
}
