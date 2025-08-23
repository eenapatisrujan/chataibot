"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, Code, BookOpen, Zap, MessageSquare, Sparkles } from "lucide-react"

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: Lightbulb,
    title: "Creative Ideas",
    text: "Help me brainstorm creative solutions for my project",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Code Help",
    text: "Explain this code snippet and suggest improvements",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: BookOpen,
    title: "Learning",
    text: "Teach me about artificial intelligence and machine learning",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Quick Tasks",
    text: "Help me write a professional email or summary",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: MessageSquare,
    title: "Conversation",
    text: "Let's have an interesting discussion about technology",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Creative Writing",
    text: "Help me write a story or improve my writing style",
    gradient: "from-purple-500 to-pink-500",
  },
]

export default function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <Card
            key={index}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${suggestion.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {suggestion.text}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
