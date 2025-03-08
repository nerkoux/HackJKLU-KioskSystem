import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Find user by ID
    const user = await User.findOne({ 
      $or: [
        { _id: userId },
        { userId: userId } // In case userId is stored as a separate field
      ]
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if career guidance exists
    if (!user.careerGuidance) {
      return NextResponse.json(
        { status: 'processing', message: 'Career guidance is still being generated' },
        { status: 202 }
      );
    }
    
    return NextResponse.json({
      mbti_type: user.mbtiResult,
      career_guidance: user.careerGuidance,
      learning_resources: user.learningResources || {},
      status: 'completed'
    });
  } catch (error) {
    console.error('Error retrieving career guidance:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}