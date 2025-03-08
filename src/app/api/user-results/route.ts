import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    // Get the email from the query parameters
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Verify the session to ensure the request is authorized
    const session = await getServerSession();
    
    // Only allow users to access their own data
    if (!session || session.user?.email !== email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return only the necessary data for the results page
    return NextResponse.json({
      mbtiType: user.mbtiResult,
      skillRatings: user.skillRatings,
      careerGuidance: user.careerGuidance,
      learningResources: user.learningResources || [],
      completedAt: user.completedAt
    });
  } catch (error) {
    console.error('Error fetching user results:', error);
    return NextResponse.json({ error: 'Failed to fetch user results' }, { status: 500 });
  }
}