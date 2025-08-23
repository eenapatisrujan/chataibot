"use client"

import { useEffect, useState } from "react"

interface TypingIndicatorProps {
  isVisible: boolean
  className?: string
}

export function TypingIndicator({ isVisible, className = "" }: TypingIndicatorProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isVisible) {
      setDots("")
      return
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce animate-stagger-1" />
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce animate-stagger-2" />
      </div>
      <span className="text-sm text-muted-foreground">EENAPATI is typing{dots}</span>
    </div>
  )
}
