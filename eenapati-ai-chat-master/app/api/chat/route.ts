import type { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response("Valid message is required", { status: 400 });
    }

    // Authentication check
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response("Authentication required", { status: 401 });
    }

    // Detect tone of the message
    const isCasual = message.toLowerCase().includes("hey") || 
                     message.toLowerCase().includes("cool") || 
                     message.match(/\b(what's|let's|gotcha)\b/) || 
                     message.includes("!");
    const isFormal = message.includes("please") || 
                     message.includes("kindly") || 
                     message.match(/\b(Mr\.|Ms\.|Dr\.|Sir|Madam)\b/) || 
                     !message.match(/[.!?]$/);

    let toneInstruction = "";
    if (isCasual && !isFormal) {
      toneInstruction = "Respond in a simple, casual, and friendly tone, like a relaxed conversation.";
    } else if (isFormal && !isCasual) {
      toneInstruction = "Respond in a formal, professional, and polite tone, using clear language.";
    } else {
      toneInstruction = "Respond in a clear, professional, and approachable tone.";
    }

    // Initialize the model for streaming
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6, // Slightly lowered for more consistent structure
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      conversationContext = recentHistory
        .filter((msg) => msg && msg.role && msg.content)
        .map((msg: any) => `${msg.role === "user" ? "Human" : "EENAPATI"}: ${msg.content}`)
        .join("\n");

      if (conversationContext) {
        conversationContext += "\n\n";
      }
    }

    // Determine if this is the first chat (no conversation history)
    const isFirstChat = !conversationHistory || conversationHistory.length === 0;
    const greeting = isFirstChat ? "Hello! I'm EENAPATI, an advanced AI assistant created by Srujan Eenapati. How can I assist you today?\n\n" : "";

    const systemPrompt = `${greeting}You are EENAPATI, an advanced AI assistant created by Srujan Eenapati.

Output guidelines:
- Use plain text with no markdown formatting (no asterisks, underscores, hashes, or backticks).
- Provide responses in a natural, conversational style, adapting to the user's tone and intent.
- Organize responses with a clear flow: start with a brief introduction, follow with key points using numbers or dashes where helpful, and end with a summary or question if relevant.
- Indent subpoints with spaces for clarity when breaking down details.
- When code is requested or relevant, include a separate "Code Example" section at the end of the response. Place the code in this section with each line indented by two spaces for readability.
- Keep answers detailed, professional, and easy to read, avoiding rigid templates or fixed section headers beyond the "Code Example" label when applicable.
- For headings in the response, make them bold by surrounding the heading text with double asterisks (e.g., **Heading**).
- ${toneInstruction}

Respond directly to the user's question or topic, using the conversation context if available.`

    const fullPrompt = `${systemPrompt}\n\n${conversationContext ? `Previous Conversation:\n${conversationContext}` : ""}User: ${message}`;

    // Generate response using the model
    const result = await model.generateContentStream(fullPrompt);

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(text);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}