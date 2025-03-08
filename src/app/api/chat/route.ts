import { NextResponse } from 'next/server';
import { generateChatResponse, generateStreamingChatResponse } from '@/lib/chat-api';

export async function POST(request: Request) {
  try {
    const { message, context, stream = false } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            await generateStreamingChatResponse(
              message, 
              context,
              (chunk) => {
                controller.enqueue(encoder.encode(chunk));
              }
            );
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
      
      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }
    
    // Handle regular response
    const response = await generateChatResponse(message, context);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}