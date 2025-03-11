import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client with your API token
const hf = new HfInference("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");

// Regular non-streaming chat response
export async function generateChatResponse(prompt: string, context: string = '') {
  try {
    // Format the prompt with context
    let formattedPrompt = prompt;
    
    if (context) {
      formattedPrompt = `Previous conversation: ${context}\n\nUser: ${prompt}`;
    }
    
    console.log("Sending request to Hugging Face API with prompt:", formattedPrompt);
    
    try {
      // Use a model that's known to work well with text generation
      const response = await hf.textGeneration({
        model: "mistralai/Mistral-Nemo-Instruct-2407",
        inputs: `<|im_start|>system
You are Jeorge, an AI career consultant. Only provide advice related to career paths, job opportunities, skills development, and professional growth. If asked about topics unrelated to careers, politely redirect the conversation back to career guidance.
Format your responses with proper spacing:
- Use double line breaks between paragraphs
- For numbered lists, ensure each number is followed by a period and space
- For bullet points, use a dash followed by a space
- Ensure proper indentation for sub-points
<|im_end|>
<|im_start|>user
${formattedPrompt}
<|im_end|>
<|im_start|>assistant`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      });
      
      console.log("Received response from Hugging Face API:", response);
      
      // Extract and clean up the generated text
      let generatedText = response.generated_text || "";
      
      // Clean up any remaining tags or prefixes
      generatedText = generatedText
        .replace(/<\|im_start\|>assistant/g, "")
        .replace(/<\|im_end\|>/g, "")
        .replace(/^You are Jeorge.*?paths\.\s*/g, "")
        .replace(/^User query:.*?\n/g, "")
        .trim();
      
      // Format the response for better readability
      generatedText = formatResponse(generatedText);
      
      console.log("Processed response:", generatedText);
      
      if (!generatedText) {
        console.warn("Empty response from API, using fallback");
        return getFallbackResponse(prompt);
      }
      
      return generatedText;
    } catch (error) {
      console.error("Error with Hugging Face API:", error);
      return getFallbackResponse(prompt);
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return getFallbackResponse(prompt);
  }
}

// Format the response for better readability
function formatResponse(text: string): string {
  // Ensure proper spacing for numbered lists
  text = text.replace(/(\d+)\.\s*([A-Z])/g, '$1. $2');
  
  // Ensure proper spacing after bullet points
  text = text.replace(/[-•]\s*([A-Z])/g, '- $1');
  
  // Ensure double line breaks between paragraphs
  text = text.replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2');
  
  // Ensure proper spacing for sub-bullets
  text = text.replace(/(\n\s*[-•].*\n)([A-Z])/g, '$1\n$2');
  
  // Ensure proper spacing after numbered items
  text = text.replace(/(\n\s*\d+\..*\n)([A-Z])/g, '$1\n$2');
  
  return text;
}

// Streaming version of the chat response
export async function generateStreamingChatResponse(
  prompt: string, 
  context: string = '', 
  onChunk: (chunk: string) => void
) {
  try {
    // For now, use the non-streaming version since it's more reliable
    const response = await generateChatResponse(prompt, context);
    onChunk(response);
    return response;
  } catch (error) {
    console.error("Error generating streaming response:", error);
    const fallback = getFallbackResponse(prompt);
    onChunk(fallback);
    return fallback;
  }
}

// Fallback responses when API is unavailable or rate limited
function getFallbackResponse(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('software') || promptLower.includes('programming') || promptLower.includes('developer')) {
    return "Software development is a great career path! With your skills, you might consider specializing in web development, mobile apps, or AI. Would you like me to suggest some learning resources?";
  } else if (promptLower.includes('design') || promptLower.includes('ux') || promptLower.includes('ui')) {
    return "Design is a creative and rewarding field! Have you considered UX/UI design for digital products? Your creative skills would be valuable there.";
  } else if (promptLower.includes('data') || promptLower.includes('analytics') || promptLower.includes('science')) {
    return "Data science and analytics are in high demand! With your analytical mindset, you could excel in roles like Data Analyst or Data Scientist.";
  } else if (promptLower.includes('hello') || promptLower.includes('hi') || promptLower.includes('hey')) {
    return "Hello there! I'm Jeorge, your AI career consultant. How can I help you with your career planning today?";
  } else if (promptLower.includes('thank')) {
    return "You're welcome! I'm here to help with any other career questions you might have.";
  }
  
  return "I'm analyzing your career path options. Could you tell me more about your interests and skills?";
}
