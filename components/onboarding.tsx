"use client"

import type React from "react"
import { motion } from "framer-motion"

// Add proper type annotations for the OnboardingStep component props
function OnboardingStep({
  stepNumber,
  title,
  description,
  children,
  delay,
}: {
  stepNumber: number
  title: string
  description: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.section
      className="bg-gray-800/50 rounded-lg p-2 sm:p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
          <span className="text-white font-bold">{stepNumber}</span>
        </div>
        <h3 className="text-2xl font-semibold text-blue-400">{title}</h3>
      </div>
      <p className="mb-4 text-gray-300">{description}</p>
      {children}
    </motion.section>
  )
}

export default OnboardingStep
