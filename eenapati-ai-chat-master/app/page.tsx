"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Particle effect component for hero section background
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
          className="absolute bg-gray-300 rounded-full opacity-60" // Increased base opacity
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [1.9, 1, 1.9], // Increased opacity range
            scale: [1, 1.2, 1], // Subtle scale for shimmer
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

// Continuous ripple effect component for background
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

// Branded SVG logo component for closing section
const BrandedLogo = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    className="mx-auto mb-6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="4" />
    <path
      d="M50 20 L70 50 L50 80 L30 50 Z"
      fill="black"
      fillOpacity="0.1"
      stroke="black"
      strokeWidth="2"
    />
    <text
      x="50"
      y="55"
      textAnchor="middle"
      fontSize="20"
      fontWeight="bold"
      fill="black"
    >
      E
    </text>
  </svg>
)

export default function HomePage() {
  const storytellingRef = useRef(null)
  const [signupHovered, setSignupHovered] = useState(false)
  const [signinHovered, setSigninHovered] = useState(false)
  const [signupClicked, setSignupClicked] = useState(0)
  const [signinClicked, setSigninClicked] = useState(0)
  const [rippleTrigger, setRippleTrigger] = useState(0)

  // Parallax effect for storytelling section
  useEffect(() => {
    const handleScroll = () => {
      if (storytellingRef.current) {
        const scrollY = window.scrollY
        const sectionTop = storytellingRef.current.offsetTop
        const offset = (scrollY - sectionTop) * 0.2
        storytellingRef.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle button clicks to trigger animations
  const handleSignupClick = () => {
    setSignupClicked((prev) => prev + 1)
    setRippleTrigger((prev) => prev + 1)
  }

  const handleSigninClick = () => {
    setSigninClicked((prev) => prev + 1)
    setRippleTrigger((prev) => prev + 1)
  }

  // Animation variants for staggered letter effect
  const titleVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  // Animation variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, rotateX: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: 1 + i * 0.2,
        duration: 0.9,
        ease: [0.25, 0.8, 0.25, 1],
      },
    }),
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Subtle Background Gradient with Hue Shift */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"
          initial={{ opacity: 0, filter: "brightness(0.8)" }}
          animate={{ opacity: 1, filter: "brightness(1)" }}
          transition={{ duration: 2.5, ease: [0.25, 0.8, 0.25, 1] }}
        />
        {/* Continuous Ripple Effect */}
        <BackgroundRipples clickTrigger={rippleTrigger} />
        {/* Particle Effect */}
        <Particles />
        {/* Cinematic Title with Staggered Animation */}
        <div className="relative z-10 text-center">
          <div className="flex justify-center">
            {"EENAPATI".split("").map((char, i) => (
              <motion.span
                key={i}
                className="text-7xl md:text-9xl font-extrabold tracking-tight drop-shadow-md"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* Caption with Animation */}
          <motion.p
            className="mt-6 text-2xl md:text-3xl text-gray-600 font-light"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
          >
            AI that works for you.
          </motion.p>
          {/* Buttons with Sequential Animation */}
          <motion.div
            className="mt-12 flex flex-col md:flex-row gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <Button
                asChild
                size="lg"
                className="h-16 px-10 text-xl font-semibold tracking-wide bg-gradient-to-r from-gray-900 to-gray-700 text-white border border-gray-500 rounded-xl backdrop-blur-sm bg-opacity-80 hover:scale-102 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:bg-opacity-90 transition-all duration-300 ease-in-out"
                onMouseEnter={() => setSignupHovered(true)}
                onMouseLeave={() => setSignupHovered(false)}
                onClick={handleSignupClick}
              >
                <motion.div
                  animate={signupClicked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  <Link href="/auth/signup">SIGN UP</Link>
                </motion.div>
              </Button>
              <ButtonSparkles isHovered={signupHovered} isClicked={signupClicked} />
            </motion.div>
            <motion.div
              className="relative"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 px-10 text-xl font-semibold tracking-wide border border-gray-500 text-gray-900 bg-gray-50 bg-opacity-80 rounded-xl backdrop-blur-sm hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-700 hover:text-white hover:scale-102 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:bg-opacity-90 transition-all duration-300 ease-in-out"
                onMouseEnter={() => setSigninHovered(true)}
                onMouseLeave={() => setSigninHovered(false)}
                onClick={handleSigninClick}
              >
                <motion.div
                  animate={signinClicked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                >
                  <Link href="/auth/login">SIGN IN</Link>
                </motion.div>
              </Button>
              <ButtonSparkles isHovered={signinHovered} isClicked={signinClicked} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Storytelling Section with Parallax */}
      <section
        ref={storytellingRef}
        className="relative py-32 px-8 max-w-5xl mx-auto text-center transition-transform duration-100"
      >
        <motion.h2
          className="text-5xl md:text-6xl font-bold mb-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          A New Era of Intelligence
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          Step into the future where AI is not just a tool but your most trusted partner.
          Crafted with precision, designed to think, and built to evolve alongside you.
        </motion.p>
        <motion.div
          className="mt-8 text-base text-blue-700 font-medium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span>
            Our chatbot adapts its responses to your questions, providing context-aware and dynamic answers every time.
          </span>
        </motion.div>
      </section>

      {/* Cinematic Closing Section with Branded Logo */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <BrandedLogo />
          <h3 className="text-4xl md:text-6xl font-bold mb-6">
            The Story Begins Here.
          </h3>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Every innovation starts with a single step. Make yours today with EENAPATI.
          </p>
        </motion.div>
      </section>
    </div>
  )
}