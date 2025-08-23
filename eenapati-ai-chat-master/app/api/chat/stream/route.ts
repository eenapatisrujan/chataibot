import type { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
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
      toneInstruction = "Respond in a simple and casual tone, like a friendly chat. Keep it relaxed and easygoing.";
    } else if (isFormal && !isCasual) {
      toneInstruction = "Respond in a formal and professional tone, using polite and structured language.";
    } else {
      toneInstruction = "Respond in a balanced, neutral tone that is clear and professional yet approachable.";
    }

    // Initialize the model for streaming
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
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

    const systemPrompt = `You are EENAPATI, an advanced AI assistant created by Srujan Eenapati.

Your output requirements:
- Do NOT use any markdown formatting (no asterisks, no bold, no italics, no underscores, no hashes, no backticks).
- Structure your answers using plain text only.
- Use clear section titles (e.g., Areas of Expertise, Steps, Summary) by writing them on a new line and optionally underlining with dashes.
- Use numbered or bulleted lists with numbers or dashes only (e.g., 1., 2., 3. or - ).
- Indent subpoints with spaces for clarity.
- Separate sections with a blank line.
- If you need to show code, use a "Code Example:" section and indent the code with spaces.
- Always keep your output professional, detailed, and easy to read.
- ${toneInstruction}

Example format:

Areas of Expertise
-----------------
1. Answer Questions
   - I can answer a wide range of questions on various topics.
2. Coding Assistance
   - I can help with coding tasks in many programming languages.

Summary
-------
I am here to assist you with any questions or tasks you have.

Never use any markdown symbols or formatting. Only use plain text, indentation, and blank lines for structure. Always provide detailed, professional, and easy to follow responses.`

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