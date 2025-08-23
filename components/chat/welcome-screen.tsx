"use client"

import { useState, useEffect } from "react"
import { Sparkles, Bot, Zap, MessageCircle } from "lucide-react"

interface WelcomeScreenProps {
  userName: string
  onComplete: () => void
}

export default function WelcomeScreen({ userName, onComplete }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-xl transition-all duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-floating-orbs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center animate-welcome-entrance">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary via-accent to-secondary rounded-3xl flex items-center justify-center mx-auto animate-welcome-glow shadow-2xl">
            <Sparkles className="w-12 h-12 text-white animate-sparkle-rotate" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
        </div>

        <h1 className="text-5xl font-bold mb-4 animate-welcome-text">
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-shift">
            Hello, {userName}!
          </span>
        </h1>

        <p className="text-2xl text-foreground animate-welcome-subtitle">Welcome to EENAPATI AI</p>

        <div className="mt-8 flex justify-center space-x-4 animate-welcome-icons">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-bounce-delayed-1">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center animate-bounce-delayed-2">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center animate-bounce-delayed-3">
            <MessageCircle className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}
