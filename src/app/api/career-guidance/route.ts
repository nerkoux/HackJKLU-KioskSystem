import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN || "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");

export async function POST(request: Request) {
  try {
    // Parse request body first to avoid potential issues
    const requestData = await request.json().catch(() => ({}));
    
    // Get session after parsing request to avoid race conditions
    const session = await getServerSession();
    
    // Initialize variables
    let userData = null;
    let mbtiType = null;
    let skills = null;
    let preferences = null;
    
    // Log request data for debugging
    console.log("Request data:", JSON.stringify(requestData));
    
    // If there's a session, get user data from database
    if (session && session.user?.email) {
      await dbConnect();
      userData = await User.findOne({ email: session.user.email });
      
      // Log user data for debugging
      console.log("User data from DB:", userData ? "Found" : "Not found");
      
      if (userData) {
        mbtiType = userData.mbtiResult;
        skills = userData.skillRatings;
        preferences = userData.personalPreferences;
      }
    }
    
    // If data not found in user data, try to get from request body
    mbtiType = mbtiType || requestData?.mbtiType;
    skills = skills || requestData?.skills;
    preferences = preferences || requestData?.preferences;
    
    // Log the data we're working with
    console.log("MBTI Type:", mbtiType);
    console.log("Skills:", skills ? Object.keys(skills).length : "None");
    console.log("Preferences:", preferences ? "Provided" : "None");
    
    // Validate that we have the required data
    if (!mbtiType) {
      return NextResponse.json({ 
        error: 'MBTI type is required. Please complete the MBTI assessment.' 
      }, { status: 400 });
    }
    
    // Check if skills is empty and try to get from database if possible
    if (!skills || Object.keys(skills).length === 0) {
      console.log("No skills provided in request, checking database");
      
      // If we have a user in the database, try to get skills from there
      if (userData && userData.skillRatings && Object.keys(userData.skillRatings).length > 0) {
        console.log("Found skills in user data, using those instead");
        skills = userData.skillRatings;
      } else {
        // If still no skills, generate some default skills for testing
        console.log("No skills found, using default skills");
        skills = {
          "Programming": 3,
          "Communication": 4,
          "Problem Solving": 4,
          "Teamwork": 3,
          "Leadership": 2
        };
      }
    }
    
    console.log("Using skills for guidance:", JSON.stringify(skills));
    
    // Generate career guidance
    const careerGuidance = await generateCareerGuidance(mbtiType, skills, preferences);
    
    // Generate learning resources
    const learningResources = await generateLearningResources(skills, preferences);
    
    // If user is authenticated, update their data
    if (session && session.user?.email && userData) {
      try {
        // Make sure careerGuidance and learningResources are valid before updating
        const updateData: Record<string, any> = {};
        
        if (careerGuidance) {
          updateData.careerGuidance = careerGuidance;
          updateData.careerGuidanceGeneratedAt = new Date();
        }
        
        if (learningResources && Array.isArray(learningResources)) {
          updateData.learningResources = learningResources;
        }
        
        // Only update if we have valid data
        if (Object.keys(updateData).length > 0) {
          // Use updateOne instead of findOneAndUpdate to avoid Map conversion issues
          await User.updateOne(
            { email: session.user.email },
            { $set: updateData }
          );
          
          console.log("User data updated successfully with career guidance");
        }
      } catch (updateError) {
        console.error('Error updating user with career guidance:', updateError);
        // Continue anyway to return the generated guidance
      }
    }
    
    return NextResponse.json({
      careerGuidance,
      learningResources
    });
  } catch (error) {
    console.error('Error generating career guidance:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function generateCareerGuidance(mbtiType: string, skills: Record<string, number>, preferences?: any): Promise<string> {
  try {
    // Prepare skills information
    const topSkills = Object.entries(skills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, rating]) => `${skill}: ${rating}/5`)
      .join(", ");
    
    // Prepare preferences information
    let preferencesText = '';
    if (preferences) {
      const { interests, values, philosophy, careerGoals, customSkills } = preferences;
      
      if (interests && interests.length > 0) {
        preferencesText += `\nInterests: ${interests.join(', ')}`;
      }
      
      if (values && values.length > 0) {
        preferencesText += `\nValues: ${values.join(', ')}`;
      }
      
      if (philosophy) {
        preferencesText += `\nWork Philosophy: ${philosophy}`;
      }
      
      if (careerGoals) {
        preferencesText += `\nCareer Goals: ${careerGoals}`;
      }
      
      if (customSkills && customSkills.length > 0) {
        preferencesText += `\nAdditional Skills to Develop: ${customSkills.join(', ')}`;
      }
    }
    
    // Create a comprehensive prompt for the model
    const prompt = `
      Generate personalized career guidance for someone with MBTI type ${mbtiType}.
      
      Their top skills are: ${topSkills}
      
      ${preferencesText ? `Personal preferences:${preferencesText}` : ''}
      
      Please provide:
      1. A brief overview of their personality type and how it relates to career choices
      2. 5-7 specific career paths that would be a good match based on their personality type and skills
      3. For each career path, explain why it's a good fit and what additional skills they might need
      4. General advice for professional development based on their personality strengths and weaknesses
      5. If they provided personal preferences, tailor the recommendations to align with their interests, values, and goals
      
      Format the response with clear headings and bullet points.
    `;
    
    // Call Hugging Face API with timeout handling
    const response = await Promise.race([
      hf.textGeneration({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500, // Increased to accommodate more detailed response
          temperature: 0.7,
          return_full_text: false,
        }
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out')), 20000)
      )
    ]);
    
    // If we get here, the API call succeeded
    if (typeof response === 'object' && response && 'generated_text' in response) {
      return response.generated_text;
    }
    
    // Fallback response if the API call returns an unexpected format
    return `# Career Guidance for ${mbtiType}

Based on your MBTI type, skills, and personal preferences, here are some career recommendations:

## Your Personality Type Overview
Your ${mbtiType} personality type suggests you would thrive in environments that match your natural strengths and work style.

## Recommended Career Paths
- Consider careers that align with both your personality type and your top skills
- Focus on roles where your personal values and interests can be expressed
- Look for opportunities to develop your identified skills further

## Professional Development Advice
- Build on your existing strengths while addressing areas for growth
- Seek mentorship in fields aligned with your career goals
- Consider both formal education and practical experience to advance

We recommend exploring specific career paths in more detail with a career counselor.`;
  } catch (error) {
    console.error('Error generating career guidance:', error);
    // Return a fallback response if the API call fails
    return `# Career Guidance for ${mbtiType}

Based on your MBTI type and skills, consider exploring careers that align with your strengths. Focus on developing your top skills further through online courses and practical projects.`;
  }
}

async function generateLearningResources(skills: Record<string, number>, preferences?: any): Promise<any[]> {
  try {
    // Get top skills (those with highest ratings)
    const topSkills = Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);
    
    // Add custom skills from preferences if available
    if (preferences?.customSkills && Array.isArray(preferences.customSkills)) {
      for (const skill of preferences.customSkills) {
        if (!topSkills.includes(skill)) {
          topSkills.push(skill);
        }
        
        // Limit to 7 skills total
        if (topSkills.length >= 7) break;
      }
    }
    
    const resources = [];
    
    // For each top skill, create learning resources
    for (const skill of topSkills) {
      // Add Coursera courses
      resources.push({
        title: `${skill} Fundamentals on Coursera`,
        url: `https://www.coursera.org/courses?query=${encodeURIComponent(skill)}`,
        description: `Learn the fundamentals of ${skill} with comprehensive courses from top universities and companies`,
        type: 'course',
        difficulty: 'Beginner',
        platform: 'Coursera'
      });
      
      // Add Udemy courses
      resources.push({
        title: `Advanced ${skill} on Udemy`,
        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`,
        description: `Take your ${skill} knowledge to the next level with practical, hands-on courses`,
        type: 'course',
        difficulty: 'Intermediate',
        platform: 'Udemy'
      });
      
      // Add YouTube tutorials
      resources.push({
        title: `${skill} Video Tutorials`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial+for+beginners`,
        description: `Watch free video tutorials on ${skill} from expert instructors`,
        type: 'video',
        difficulty: 'Various',
        platform: 'YouTube'
      });
      
      // Add edX courses
      resources.push({
        title: `${skill} Professional Certificate`,
        url: `https://www.edx.org/search?q=${encodeURIComponent(skill)}`,
        description: `Earn a professional certificate in ${skill} from leading educational institutions`,
        type: 'certificate',
        difficulty: 'Advanced',
        platform: 'edX'
      });
    }
    
    // If user has interests in preferences, add some interest-based resources
    if (preferences?.interests && Array.isArray(preferences.interests) && preferences.interests.length > 0) {
      // Take up to 3 interests
      const topInterests = preferences.interests.slice(0, 3);
      
      for (const interest of topInterests) {
        resources.push({
          title: `${interest} Communities and Groups`,
          url: `https://www.meetup.com/find/?keywords=${encodeURIComponent(interest)}`,
          description: `Connect with others who share your interest in ${interest}`,
          type: 'community',
          difficulty: 'All Levels',
          platform: 'Meetup'
        });
        
        resources.push({
          title: `${interest} Books and Publications`,
          url: `https://www.goodreads.com/search?q=${encodeURIComponent(interest)}`,
          description: `Discover top-rated books about ${interest}`,
          type: 'reading',
          difficulty: 'Various',
          platform: 'Goodreads'
        });
      }
    }
    
    return resources;
  } catch (error) {
    console.error('Error generating learning resources:', error);
    return [];
  }
}
