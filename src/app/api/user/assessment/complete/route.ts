import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { assessmentCompleted, completedAt } = await request.json();
    await dbConnect();
    
    // Update user with assessment completion status
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        assessmentCompleted: assessmentCompleted,
        completedAt: completedAt || new Date()
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Assessment completion status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating assessment completion status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}