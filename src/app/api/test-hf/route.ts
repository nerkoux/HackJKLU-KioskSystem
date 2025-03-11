import { NextResponse } from 'next/server';
import { HfInference } from "@huggingface/inference";

export async function GET() {
  try {
    // Initialize Hugging Face client
    const hf = new HfInference("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");
    
    // Try a simple text generation request
    const response = await hf.textGeneration({
      model: "google/flan-t5-small", // Using a smaller, more accessible model
      inputs: "What is a good career for someone who likes computers?",
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7
      }
    });
    
    return NextResponse.json({ 
      status: 'API test successful', 
      response: response 
    });
  } catch (error) {
    console.error("Error testing Hugging Face API:", error);
    return NextResponse.json({ 
      status: 'API test failed', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
