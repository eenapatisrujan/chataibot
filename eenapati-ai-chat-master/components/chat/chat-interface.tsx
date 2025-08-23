"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Send,
  Menu,
  Plus,
  MessageSquare,
  LogOut,
  Bot,
  Search,
  MoreVertical,
  Trash2,
  Download,
  UserIcon,
  Copy,
  Check,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"

// Enhanced sparkle effect for buttons with more sparkles
const ButtonSparkles = ({ isHovered }: { isHovered: boolean }) => {
  const sparkles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-blue-200 rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isHovered
              ? {
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 25,
                  y: (Math.random() - 0.5) * 25,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    delay: Math.random() * 0.2,
                  },
                }
              : { opacity: 0, scale: 0 }
          }
        />
      ))}
    </div>
  )
}

// Enhanced particle effect for chat background with length-based adjustment
const ChatParticles = ({ messageLength }: { messageLength: number }) => {
  const particleCount = Math.min(20, 10 + Math.floor(messageLength / 100)) // Increase particles with length, cap at 20
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-50 rounded-full opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, (Math.random() - 0.5) * 10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
            transition: {
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            },
          }}
        />
      ))}
    </div>
  )
}

// Subtle background gradient with length-based opacity
const BackgroundGradient = ({ messageLength }: { messageLength: number }) => {
  const opacity = Math.min(0.5, 0.3 + messageLength / 2000) // Increase opacity with length, cap at 0.5
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-white to-blue-50"
      style={{ opacity }}
      animate={{
        opacity: [opacity, opacity + 0.1, opacity],
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    />
  )
}

// New visual particles effect with length-based adjustment
const VisualParticles = ({ messageLength }: { messageLength: number }) => {
  const particleCount = Math.min(15, 5 + Math.floor(messageLength / 150)) // Increase particles with length, cap at 15
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
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

// Continuous ripple effect with length-based frequency
const BackgroundRipples = ({ clickTrigger, messageLength }: { clickTrigger: number; messageLength: number }) => {
  const rippleCount = Math.min(4, 2 + Math.floor(messageLength / 300)) // Increase ripples with length, cap at 4
  const ripples = Array.from({ length: rippleCount }).map((_, i) => ({
    id: i,
    delay: i * 1.5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
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
            scale: [0, 10 + messageLength / 500, 20],
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

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatInterfaceProps {
  user: User
}

const ChatSuggestions = ({ onSuggestionClick }: { onSuggestionClick: (suggestion: string) => void }) => {
  const allSuggestions = [
    "Provide an overview of quantum computing principles",
    "Draft a professional business email template",
    "Design a balanced weekly meal plan",
    "Recommend strategies for enhancing remote work productivity",
    "Develop a concept for a corporate innovation initiative",
    "Explain the fundamentals of blockchain technology",
    "Offer best practices for effective time management",
    "Create a professional cover letter for a job application",
    "Propose a comprehensive fitness regimen",
    "Describe the core concepts of machine learning",
  ]

  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5)
    setSuggestions(shuffled.slice(0, 4))
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto z-20">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion}
          initial={{ opacity: 0, y: 20, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 120 }}
          whileHover={{ scale: 1.05, rotate: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          <Card
            className="p-4 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-lg bg-white border border-blue-100 rounded-md"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <p className="text-base text-gray-900 font-semibold">{suggestion}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [inputHovered, setInputHovered] = useState(false)
  const [newChatHovered, setNewChatHovered] = useState(false)
  const [clickTrigger, setClickTrigger] = useState(0)
  const [messageLength, setMessageLength] = useState(0) // Track total message length

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0)
    setMessageLength(totalLength)
  }, [messages])

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase.from("conversations").select("*").order("updated_at", { ascending: false })
      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error("Error retrieving conversations:", error)
    }
  }

  const createNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: "New Conversation",
        })
        .select()
        .single()
      if (error) throw error
      setCurrentConversationId(data.id)
      setMessages([])
      await loadConversations()
    } catch (error) {
      console.error("Error initiating new conversation:", error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      setCurrentConversationId(conversationId)
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
      if (error) throw error
      const formattedMessages: Message[] = (data || []).map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        timestamp: new Date(msg.created_at),
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading conversation history:", error)
    }
  }

  const saveMessage = async (content: string, role: "user" | "assistant") => {
    if (!currentConversationId) return
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        content,
        role,
      })
      if (error) throw error
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    let conversationId = currentConversationId
    if (!conversationId) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title: "New Conversation" })
        .select()
        .single()
      if (error) {
        console.error("Error creating new conversation:", error)
        return
      }
      conversationId = data.id
      setCurrentConversationId(conversationId)
      await loadConversations()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    await saveMessage(userMessage.content, "user")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10),
        }),
      })

      if (!response.ok) throw new Error("Failed to process request")
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        assistantContent += text
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: assistantContent,
          }
          return newMessages
        })
      }

      await saveMessage(assistantContent, "assistant")
      await loadConversations()
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "An error occurred while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && input.trim() && !isLoading) {
        e.preventDefault()
        sendMessage()
      }
    }

    window.addEventListener("keydown", handleGlobalEnter)
    return () => window.removeEventListener("keydown", handleGlobalEnter)
  }, [input, isLoading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter((conv) => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredConversations(filtered)
    } else {
      setFilteredConversations(conversations)
    }
  }, [conversations, searchQuery])

  const deleteConversation = async (conversationId: string) => {
    try {
      await supabase.from("messages").delete().eq("conversation_id", conversationId)
      const { error } = await supabase.from("conversations").delete().eq("id", conversationId)
      if (error) throw error
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setMessages([])
      }
      await loadConversations()
      setDeleteDialogOpen(false)
      setConversationToDelete(null)
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  const exportConversation = async (conversationId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
      if (error) throw error
      const conversation = conversations.find((c) => c.id === conversationId)
      const exportData = {
        title: conversation?.title || "Untitled Conversation",
        created_at: conversation?.created_at,
        messages:
          messages?.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.created_at,
          })) || [],
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${conversation?.title || "conversation"}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting conversation:", error)
    }
  }

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    })
  }

  const markdownComponents = {
    p: ({ children }) => <p className="text-base text-gray-900 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 text-base text-gray-900">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 text-base text-gray-900">{children}</ol>,
    li: ({ children }) => <li className="text-base text-gray-900 mb-2">{children}</li>,
    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-900 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-900 mb-2">{children}</h3>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-700 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-gray-200 text-gray-900 rounded px-2 py-1 text-base font-mono">{children}</code>
    ),
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative font-sans">
      <BackgroundGradient messageLength={messageLength} />
      <ChatParticles messageLength={messageLength} />
      <VisualParticles messageLength={messageLength} />
      <BackgroundRipples clickTrigger={clickTrigger} messageLength={messageLength} />
      <motion.div
        className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-30 shadow-md"
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.h1
                className="text-xl font-bold text-gray-900"
                animate={{
                  scale: [1, 1.05, 1],
                  transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
                }}
              >
                EENAPATI
              </motion.h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-gray-100 rounded-full"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </Button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              onMouseEnter={() => setNewChatHovered(true)}
              onMouseLeave={() => setNewChatHovered(false)}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                onClick={createNewConversation}
                className="w-full h-10 text-base font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
              <ButtonSparkles isHovered={newChatHovered} />
            </motion.div>

            <motion.div
              className="relative mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-base border-gray-200 focus:border-blue-300 rounded-md"
              />
            </motion.div>
          </div>

          <ScrollArea className="flex-1 p-3 z-30">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredConversations.length === 0 ? (
                  <motion.div
                    className="text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                    >
                      <MessageSquare className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-base text-gray-700">
                      {searchQuery ? "No conversations found" : "No conversations yet"}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-gray-600 hover:text-blue-700"
                      >
                        Clear Search
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
                    >
                      <Card
                        className={`p-3 cursor-pointer hover:bg-gray-50 border border-gray-200 rounded-md shadow-sm ${
                          currentConversationId === conversation.id ? "bg-gray-50" : ""
                        }`}
                        onClick={() => loadConversation(conversation.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <MessageSquare className="w-4 h-4 text-blue-700" />
                            <span className="text-base font-medium text-gray-900 truncate">{conversation.title}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border-gray-200 rounded-md">
                              <DropdownMenuItem
                                onClick={() => exportConversation(conversation.id)}
                                className="text-gray-800 hover:bg-gray-50"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setConversationToDelete(conversation.id)
                                  setDeleteDialogOpen(true)
                                }}
                                className="text-red-600 hover:bg-gray-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </p>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-gray-200">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                    {getInitials(user.user_metadata?.display_name || user.email?.split("@")[0] || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 truncate">
                    {user.user_metadata?.display_name || user.email?.split("@")[0] || "User"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 rounded-full"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/5 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "ml-0"} z-30`}>
        <motion.div
          className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100 rounded-full"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Welcome, {user.user_metadata?.display_name || user.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-sm text-gray-600">Chat with EENAPATI AI</p>
            </div>
          </div>
        </motion.div>

        <ScrollArea className="flex-1 p-4 bg-white relative z-30">
          <BackgroundGradient messageLength={messageLength} />
          <ChatParticles messageLength={messageLength} />
          <VisualParticles messageLength={messageLength} />
          <BackgroundRipples clickTrigger={clickTrigger} messageLength={messageLength} />
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  className="space-y-10 z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center py-12 z-30">
                    <motion.h3
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      Ready to Assist
                    </motion.h3>
                    <motion.p
                      className="text-base text-gray-700 mt-2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
                    >
                      Choose a suggestion or type your query to start.
                    </motion.p>
                  </div>
                  <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"} z-30`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 mt-1 z-30">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-md p-4 shadow-sm z-30 ${
                        message.role === "user"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="text-base whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <p className={`text-sm ${message.role === "user" ? "text-blue-700" : "text-gray-600"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {message.role === "assistant" && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                              onClick={() => handleCopy(message.content, message.id)}
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 mt-1 z-30">
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          <UserIcon className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  className="flex items-start space-x-3 z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
                    <div className="flex space-x-2">
                      <motion.div
                        className="w-2 h-2 bg-blue-300 rounded-full"
                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-blue-300 rounded-full"
                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-blue-300 rounded-full"
                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <motion.div
          className="p-4 border-t border-gray-200 bg-white shadow-sm z-30"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3">
              <motion.div
                className="flex-1 relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setInputHovered(true)}
                onMouseLeave={() => setInputHovered(false)}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your query..."
                  className="h-12 text-base border-gray-200 focus:border-blue-300 rounded-md pr-12"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="w-10 h-10 bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-md flex items-center justify-center"
                    onMouseDown={() => setClickTrigger((prev) => prev + 1)}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                  <ButtonSparkles isHovered={inputHovered} />
                </div>
              </motion.div>
            </div>
            <motion.p
              className="text-sm text-gray-600 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1}}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              EENAPATI AI may provide inaccurate information. Verify critical details.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-md z-40">
          <DialogHeader>
            <DialogTitle className="text-lg text-gray-900">Delete Conversation</DialogTitle>
            <DialogDescription className="text-base text-gray-700">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-md border-gray-200 hover:bg-gray-50 text-base text-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => conversationToDelete && deleteConversation(conversationToDelete)}
              className="rounded-md text-base text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}