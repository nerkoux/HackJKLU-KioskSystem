import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { personalPreferences, preferencesCompleted } = await req.json();
    
    // Connect to MongoDB
    await dbConnect();
    
    // Update user document with preferences using Mongoose model
    const result = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          personalPreferences,
          preferencesCompleted,
          updatedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully' 
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}