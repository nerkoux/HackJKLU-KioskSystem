import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Log the received data for debugging
    console.log("Assessment data received:", {
      email: session.user.email,
      skillRatingsCount: data.skillRatings ? Object.keys(data.skillRatings).length : 0,
      mbtiResult: data.mbtiResult ? 'Present' : 'Missing',
      assessmentCompleted: data.assessmentCompleted
    });
    
    await dbConnect();
    
    // Update user with assessment data
    const updateData: Record<string, any> = {};
    
    if (data.mbtiResult) {
      updateData.mbtiResult = data.mbtiResult;
    }
    
    if (data.mbtiResponses) {
      updateData.mbtiResponses = data.mbtiResponses;
    }
    
    // Ensure skillRatings is properly handled
    if (data.skillRatings && Object.keys(data.skillRatings).length > 0) {
      updateData.skillRatings = data.skillRatings;
    } else {
      console.warn("No skill ratings provided in the request");
    }
    
    if (data.assessmentCompleted !== undefined) {
      updateData.assessmentCompleted = data.assessmentCompleted;
    }
    
    if (data.completedAt) {
      updateData.completedAt = data.completedAt;
    }
    
    // Only update if we have valid data
    if (Object.keys(updateData).length > 0) {
      console.log("Updating user with data:", JSON.stringify(updateData));
      
      try {
        const updatedUser = await User.findOneAndUpdate(
          { email: session.user.email },
          { $set: updateData },
          { new: true, upsert: true }
        );
        
        console.log("User updated successfully:", updatedUser.email);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Assessment data saved successfully',
          user: {
            email: updatedUser.email,
            mbtiResult: updatedUser.mbtiResult,
            skillRatingsCount: updatedUser.skillRatings ? Object.keys(updatedUser.skillRatings).length : 0,
            assessmentCompleted: updatedUser.assessmentCompleted
          }
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json({ 
          error: 'Database error', 
          details: dbError instanceof Error ? dbError.message : String(dbError) 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ 
        error: 'No valid data provided for update' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error saving assessment data:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}