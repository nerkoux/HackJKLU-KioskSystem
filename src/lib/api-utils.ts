/**
 * Utility functions for API communication using Next.js API routes
 */

/**
 * Send assessment results to Next.js API for processing
 */
export async function sendAssessment(
  mbtiResult: string,
  mbtiResponses: Record<string, string>,
  skillRatings: Record<string, number>
) {
  try {
    // Convert MBTI responses to the format expected by the API
    const eiAnswers: Record<string, number> = {};
    const snAnswers: Record<string, number> = {};
    const tfAnswers: Record<string, number> = {};
    const jpAnswers: Record<string, number> = {};
    
    // Process MBTI responses into separate dimension scores
    Object.entries(mbtiResponses).forEach(([key, value]) => {
      if (value === 'E' || value === 'I') {
        eiAnswers[key] = value === 'E' ? 1 : -1;
      } else if (value === 'S' || value === 'N') {
        snAnswers[key] = value === 'S' ? 1 : -1;
      } else if (value === 'T' || value === 'F') {
        tfAnswers[key] = value === 'T' ? 1 : -1;
      } else if (value === 'J' || value === 'P') {
        jpAnswers[key] = value === 'J' ? 1 : -1;
      }
    });
  
    // Send data to Next.js API with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('/api/user/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mbtiResult,
        mbtiResponses,
        skillRatings,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request timed out but continuing...');
      // We'll still continue with the app flow even if this times out
      return { status: 'timeout', message: 'Request timed out but continuing' };
    }
    console.error('Error sending assessment:', error);
    throw error;
  }
}

/**
 * Get career guidance based on assessment results
 */
export async function getCareerGuidance() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('/api/career-guidance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Career guidance request timed out');
      return { error: 'Request timed out', status: 'timeout' };
    }
    console.error('Error getting career guidance:', error);
    throw error;
  }
}

/**
 * Check if user has completed assessments
 */
export async function checkAssessmentStatus() {
  try {
    const response = await fetch('/api/user');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      isComplete: data.user?.assessmentCompleted || false,
      mbtiResult: data.user?.mbtiResult || null,
      skillRatings: data.user?.skillRatings || null
    };
  } catch (error) {
    console.error('Error checking assessment status:', error);
    return { isComplete: false, mbtiResult: null, skillRatings: null };
  }
}