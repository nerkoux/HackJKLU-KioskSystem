export interface FastAPIAssessmentResponse {
    mbti_type: string;
    career_guidance: string;
    learning_resources: LearningResource[];
  }
  
  export interface LearningResource {
    title: string;
    url: string;
    description: string;
    type?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    platform?: string;
    duration?: string;
  }