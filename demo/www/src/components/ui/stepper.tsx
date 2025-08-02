// src/components/ui/stepper.tsx
'use client'

import * as React from 'react'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate which steps to show on mobile (sliding window of 3 steps)
  const getVisibleSteps = () => {
    if (!isMobile) {
      // Desktop: show all steps
      return steps.map((step, index) => ({ step, index }))
    } else {
      // Mobile: show sliding window of 3 steps
      const startIndex = Math.max(0, Math.min(currentStep - 1, steps.length - 3))
      const endIndex = Math.min(startIndex + 3, steps.length)
      return steps.slice(startIndex, endIndex).map((step, relativeIndex) => ({
        step,
        index: startIndex + relativeIndex
      }))
    }
  }

  const visibleSteps = getVisibleSteps()

  return (
    <nav aria-label='Progress'>
      <ol className='flex space-x-4 md:space-x-8 transition-all duration-300'>
        {visibleSteps.map(({ step, index }) => {
          const stepIndex = index + 1
          const isCompleted = currentStep > stepIndex
          const isCurrent = currentStep === stepIndex

          return (
            <li key={`${step}-${index}`} className='flex-1'>
              {isCompleted ? (
                <div className='group border-primary flex w-full flex-col border-l-4 py-2 pl-4 transition-all duration-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
                  <span className='text-primary text-sm font-medium transition-colors'>
                    Step {stepIndex}
                  </span>
                  <span className='text-sm font-medium'>{step}</span>
                </div>
              ) : isCurrent ? (
                <div
                  className='border-primary flex w-full flex-col border-l-4 py-2 pl-4 transition-all duration-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'
                  aria-current='step'
                >
                  <span className='text-primary text-sm font-medium'>
                    Step {stepIndex}
                  </span>
                  <span className='text-sm font-medium'>{step}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-all duration-300 hover:border-gray-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0'>
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
