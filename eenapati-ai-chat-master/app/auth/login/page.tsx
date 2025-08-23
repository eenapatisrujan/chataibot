"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

// Particle effect component for form side background
const Particles = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 3, // Size range: 3-8px
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gray-300 rounded-full opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1],
            transition: {
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 1.5,
            },
          }}
        />
      ))}
    </div>
  )
}

// Particle effect component for visual side background
const VisualParticles = () => {
  const particles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2, // Size range: 2-6px
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gray-500 rounded-full opacity-50"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.15, 1],
            transition: {
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 1.2,
            },
          }}
        />
      ))}
    </div>
  )
}

// Continuous ripple effect component for form side background
const BackgroundRipples = ({ clickTrigger }) => {
  const ripples = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    delay: i * 1.5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-gray-100 opacity-0"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0, 10, 20],
            opacity: clickTrigger > 0 ? [0.3, 0.15, 0] : [0.2, 0.1, 0],
            boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 20px rgba(200,200,200,0.3)", "0 0 0 rgba(0,0,0,0)"],
            transition: {
              duration: 3,
              ease: "easeOut",
              repeat: Infinity,
              delay: ripple.delay,
            },
          }}
        />
      ))}
    </div>
  )
}

// Sparkle effect component for buttons
const ButtonSparkles = ({ isHovered, isClicked }) => {
  const sparkles = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-gray-300 rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isHovered || isClicked
              ? {
                  opacity: [0, 0.5, 0],
                  scale: [0, isClicked ? 1.1 : 0.8, 0],
                  x: (Math.random() - 0.5) * 20,
                  y: (Math.random() - 0.5) * 20,
                  transition: {
                    duration: isClicked ? 0.2 : 0.3,
                    ease: "easeOut",
                    delay: Math.random() * 0.08,
                  },
                }
              : { opacity: 0, scale: 0 }
          }
        />
      ))}
    </div>
  )
}

export const dynamic = 'force-dynamic';

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [googleHovered, setGoogleHovered] = useState(false)
  const [googleClicked, setGoogleClicked] = useState(0)
  const [signinHovered, setSigninHovered] = useState(false)
  const [signinClicked, setSigninClicked] = useState(0)
  const [rippleTrigger, setRippleTrigger] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("new_user")) {
        setNotification("Your account has been created successfully. Please sign in to continue.")
      } else if (searchParams.get("error")) {
        setNotification(searchParams.get("error_description") || "Authentication failed. Please try again.")
      }
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSigninClicked((prev) => prev + 1)
    setRippleTrigger((prev) => prev + 1)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/chat")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setGoogleClicked((prev) => prev + 1)
    setRippleTrigger((prev) => prev + 1)

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/chat`

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <BackgroundRipples clickTrigger={rippleTrigger} />
        <Particles />
        <div className="w-full max-w-md animate-fade-in-up duration-700 ease-out">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-accent-foreground animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Access your account and continue your premium experience with EENAPATI
            </p>
          </div>

          <Card className="border-border/50 shadow-xl rounded-2xl transition-all hover:shadow-2xl">
            {notification && (
              <div className="p-4 bg-blue-100 border-b border-blue-200 rounded-t-2xl">
                <p className="text-sm text-center text-blue-800">{notification}</p>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to unlock full access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-11 border-border/50 hover:bg-accent/10 transition-all duration-300 bg-transparent rounded-xl"
                  disabled={isLoading}
                  onMouseEnter={() => setGoogleHovered(true)}
                  onMouseLeave={() => setGoogleHovered(false)}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
                <ButtonSparkles isHovered={googleHovered} isClicked={googleClicked} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign in with</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-border/50 focus:border-accent rounded-xl transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-border/50 focus:border-accent rounded-xl transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:shadow-lg"
                    disabled={isLoading}
                    onMouseEnter={() => setSigninHovered(true)}
                    onMouseLeave={() => setSigninHovered(false)}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Signing you in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  <ButtonSparkles isHovered={signinHovered} isClicked={signinClicked} />
                </div>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don’t have an account? </span>
                <Link
                  href="/auth/signup"
                  className="text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  Create one now
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-primary/80 items-center justify-center p-8 relative">
        <VisualParticles />
        <div className="text-center text-primary-foreground max-w-md animate-fade-in-up">
          <div className="w-24 h-24 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8 animate-shimmer shadow-lg">
            <Sparkles className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">EENAPATI</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
            Your intelligent AI partner for elevated, seamless conversations.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>AI-driven precision in responses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Secure and private conversation history</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Personalized experience, tailored to you</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}