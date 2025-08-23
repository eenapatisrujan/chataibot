// chatbotResponse.ts

// Function to generate adaptive replies for the chatbot
export function getChatbotReply(userQuestion: string): string {
  // Simple example: adapt reply based on question type
  if (/hello|hi|hey/i.test(userQuestion)) {
    return "Hello! How can I assist you today?";
  }
  if (/error|bug|issue/i.test(userQuestion)) {
    return "It looks like you're facing a problem. Can you describe the issue in detail?";
  }
  if (/feature|add|implement/i.test(userQuestion)) {
    return "Great idea! Let me help you with the steps to add that feature.";
  }
  // Default fallback
  return `Thanks for your question: "${userQuestion}". Let me look into it for you.`;
}