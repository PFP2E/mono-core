// src/components/ui/stepper.tsx
'use client'

import * as React from 'react'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label='Progress'>
      <ol className='space-y-4 md:flex md:space-y-0 md:space-x-8'>
        {steps.map((step, index) => {
          const stepIndex = index + 1
          const isCompleted = currentStep > stepIndex
          const isCurrent = currentStep === stepIndex

          return (
            <li key={step} className='md:flex-1'>
              {isCompleted ? (
                <div className='group border-primary flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
                  <span className='text-primary text-sm font-medium transition-colors'>
                    Step {stepIndex}
                  </span>
                  <span className='text-sm font-medium'>{step}</span>
                </div>
              ) : isCurrent ? (
                <div
                  className='border-primary flex w-full flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'
                  aria-current='step'
                >
                  <span className='text-primary text-sm font-medium'>
                    Step {stepIndex}
                  </span>
                  <span className='text-sm font-medium'>{step}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors hover:border-gray-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    Step {stepIndex}
                  </span>
                  <span className='text-sm font-medium'>{step}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
