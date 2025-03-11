import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN || "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");

// Type definitions
interface CompleteAssessmentData {
  user_id: string;
  ei_answers: Record<string, number>;
  sn_answers: Record<string, number>;
  tf_answers: Record<string, number>;
  jp_answers: Record<string, number>;
  skills: Record<string, number>;
}

export async function POST(request: Request) {
  try {
    const data: CompleteAssessmentData = await request.json();
    const { user_id, ei_answers, sn_answers, tf_answers, jp_answers, skills } = data;
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Calculate MBTI scores
    const ei_score = Object.values(ei_answers).reduce((sum, val) => sum + val, 0);
    const sn_score = Object.values(sn_answers).reduce((sum, val) => sum + val, 0);
    const tf_score = Object.values(tf_answers).reduce((sum, val) => sum + val, 0);
    const jp_score = Object.values(jp_answers).reduce((sum, val) => sum + val, 0);
    
    // Determine MBTI type
    const mbti_type = 
      (ei_score > 0 ? 'E' : 'I') +
      (sn_score > 0 ? 'S' : 'N') +
      (tf_score > 0 ? 'T' : 'F') +
      (jp_score > 0 ? 'J' : 'P');
    
    // Connect to MongoDB
    await dbConnect();
    
    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { _id: user_id },
        { userId: user_id }
      ]
    });
    
    if (!user) {
      user = new User({
        userId: user_id,
        mbtiResult: mbti_type,
        skillRatings: skills,
        assessmentData: {
          ei_answers,
          sn_answers,
          tf_answers,
          jp_answers,
          ei_score,
          sn_score,
          tf_score,
          jp_score
        },
        assessmentCompleted: true,
        assessmentCompletedAt: new Date()
      });
    } else {
      user.mbtiResult = mbti_type;
      user.skillRatings = skills;
      user.assessmentData = {
        ei_answers,
        sn_answers,
        tf_answers,
        jp_answers,
        ei_score,
        sn_score,
        tf_score,
        jp_score
      };
      user.assessmentCompleted = true;
      user.assessmentCompletedAt = new Date();
    }
    
    // Save user data
    await user.save();
    
    // Start background career guidance generation
    // In a real app, you'd use a proper background job system
    setTimeout(async () => {
      try {
        // Generate career guidance
        const careerGuidance = await generateCareerPath(mbti_type, skills);
        const learningResources = await fetchLearningResources(skills);
        
        // Update user with career guidance
        await User.findOneAndUpdate(
          { userId: user_id },
          { 
            careerGuidance,
            learningResources,
            careerGuidanceGeneratedAt: new Date()
          }
        );
      } catch (error) {
        console.error('Error generating career guidance in background:', error);
      }
    }, 0);
    
    return NextResponse.json({
      mbti_type,
      status: 'processing',
      message: 'Assessment data received. Career guidance is being generated.'
    });
  } catch (error) {
    console.error('Error processing complete assessment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// Reuse the same functions from the career-guidance route
async function generateCareerPath(mbtiType: string, skills: Record<string, number>): Promise<string> {
  try {
    const skillSummary = Object.entries(skills)
      .map(([skill, level]) => `${skill}: ${level}/100`)
      .join(", ");
    
    const prompt = `
      A user has an MBTI type of ${mbtiType} and the following skill proficiencies:
      ${skillSummary}.
      
      Based on this:
      1. Suggest the best career paths suited to their skill set.
      2. List specialized fields they should explore.
      3. Provide a step-by-step roadmap for skill improvement and career success.
      
      Provide structured recommendations.
    `;
    
    // Call Hugging Face API with timeout handling
    const response = await Promise.race([
      hf.textGeneration({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
        }
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out')), 30000)
      )
    ]);
    
    if (typeof response === 'object' && 'generated_text' in response) {
      return response.generated_text;
    }
    
    // Fallback response if the API call doesn't return expected format
    return `Based on your MBTI type ${mbtiType} and skills, consider exploring careers that match your personality type and leverage your strongest skills.`;
  } catch (error) {
    console.error('Error generating career path:', error);
    // Return a fallback response if the API call fails
    return `Unable to generate detailed career guidance at this time. Based on your MBTI type ${mbtiType} and skills, consider exploring careers that match your personality type and leverage your strongest skills.`;
  }
}

async function fetchLearningResources(skills: Record<string, number>): Promise<Record<string, string[]>> {
  const resources: Record<string, string[]> = {};
  
  try {
    // Get top skills (those with highest ratings)
    const topSkills = Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill]) => skill);
    
    // For each top skill, fetch some mock learning resources
    // In a production app, you might use a real API or database
    for (const skill of topSkills) {
      resources[skill] = [
        `https://www.coursera.org/courses?query=${encodeURIComponent(skill)}`,
        `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
        `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}`
      ];
    }
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    // Fix: Return an object with error as a string array instead of a string
    return { error: ['Failed to fetch learning resources'] };
  }
  
  return resources;
}
