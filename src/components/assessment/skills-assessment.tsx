"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const skillCategories = [
  {
    name: "Technical Skills",
    skills: [
      "Programming",
      "Data Analysis",
      "Web Development",
      "Graphic Design",
      "Digital Marketing"
    ]
  },
  {
    name: "Soft Skills",
    skills: [
      "Communication",
      "Leadership",
      "Teamwork",
      "Problem Solving",
      "Time Management"
    ]
  },
  {
    name: "Industry Knowledge",
    skills: [
      "Business",
      "Healthcare",
      "Education",
      "Technology",
      "Creative Arts"
    ]
  }
];

export default function SkillsAssessment() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);
  const [mbtiResponses, setMbtiResponses] = useState<Record<string, string> | null>(null);
  
  // Initialize skill ratings and get MBTI data
  useEffect(() => {
    const fetchData = async () => {
      // First try to get MBTI result from localStorage
      const localMbtiResult = localStorage.getItem('mbtiResult');
      const localMbtiResponses = localStorage.getItem('mbtiResponses');
      
      if (localMbtiResult) {
        setMbtiResult(localMbtiResult);
      }
      
      if (localMbtiResponses) {
        try {
          setMbtiResponses(JSON.parse(localMbtiResponses));
        } catch (e) {
          console.error('Error parsing MBTI responses:', e);
        }
      }
      
      // Initialize skill ratings with default values
      const initialRatings: Record<string, number> = {};
      skillCategories.forEach(category => {
        category.skills.forEach(skill => {
          initialRatings[skill] = 3; // Default to middle value
        });
      });
      setSkillRatings(initialRatings);
      
      // If authenticated, try to get data from server
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();
          
          if (data.user) {
            // Set MBTI result from database if available
            if (data.user.mbtiResult) {
              setMbtiResult(data.user.mbtiResult);
            } else if (!localMbtiResult) {
              // Redirect if no MBTI result anywhere
              alert("Please complete the MBTI assessment first.");
              router.push('/assessment');
              return;
            }
            
            // Set MBTI responses from database if available
            if (data.user.mbtiResponses) {
              setMbtiResponses(data.user.mbtiResponses);
            }
            
            // Set skill ratings from database if available
            if (data.user.skillRatings) {
              setSkillRatings(data.user.skillRatings);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Continue with localStorage data if API fails
        }
      } else if (status === 'unauthenticated') {
        // Check if MBTI is completed
        if (!localMbtiResult) {
          alert("Please complete the MBTI assessment first.");
          router.push('/assessment');
          return;
        }
      }
    };
    
    fetchData();
  }, [router, status]);
  
  const handleRatingChange = (skill: string, rating: number) => {
    setSkillRatings({
      ...skillRatings,
      [skill]: rating
    });
  };
  
  const handleNext = () => {
    const currentSkills = skillCategories[currentCategory].skills;
    const allRated = currentSkills.every(skill => skillRatings[skill] !== undefined);
    
    if (!allRated) {
      alert("Please rate all skills in this category before continuing.");
      return;
    }
    
    if (currentCategory < skillCategories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      // Assessment complete
      setCompleted(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save to localStorage first
      localStorage.setItem('skillRatings', JSON.stringify(skillRatings));
      localStorage.setItem('skillsCompleted', 'true');
      
      // If user is authenticated, save to database
      if (status === 'authenticated') {
        // Get MBTI data to ensure it's included in the submission
        const localMbtiResult = mbtiResult || localStorage.getItem('mbtiResult');
        const localMbtiResponses = mbtiResponses || 
          (localStorage.getItem('mbtiResponses') ? 
            JSON.parse(localStorage.getItem('mbtiResponses') || '{}') : null);
        
        // Save to MongoDB via Next.js API
        const response = await fetch('/api/user/assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            skillRatings: skillRatings,
            mbtiResult: localMbtiResult,
            mbtiResponses: localMbtiResponses,
            skillsCompleted: true,
            completedAt: new Date().toISOString()
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save assessment data');
        }
        
        // Pre-generate career guidance
        try {
          await fetch('/api/career-guidance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mbtiType: localMbtiResult,
              skills: skillRatings
            }),
          });
        } catch (error) {
          console.error('Error pre-generating career guidance:', error);
          // Continue even if guidance generation fails
        }
      }
      
      // Redirect to results page
      router.push('/assessment?completed=skills');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const progress = ((currentCategory / skillCategories.length) * 100);
  
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Skills Assessment Complete!</h2>
          <p className="text-slate-300 mb-6">
            Thank you for completing the skills assessment. Your results have been saved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gradient" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                </>
              ) : (
                "Save & View Results"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/assessment')}
              disabled={isSubmitting}
            >
              Return to Assessment Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentCategoryData = skillCategories[currentCategory];
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Skills Assessment</h2>
        <p className="text-slate-300 mb-4">
          Rate your proficiency in various skills to help identify your strengths and areas for development.
        </p>
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-slate-400 mt-1">
          Category {currentCategory + 1} of {skillCategories.length}
        </p>
      </div>
      
      <motion.div
        key={currentCategory}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8"
      >
        <h3 className="text-xl font-semibold mb-6">
          {currentCategoryData.name}
        </h3>
        
        <div className="space-y-6">
          {currentCategoryData.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <label className="font-medium">{skill}</label>
                <span className="text-sm text-slate-400">
                  {skillRatings[skill] ? 
                    ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][Math.min(skillRatings[skill] - 1, 4)] : 
                    'Not Rated'}
                </span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(skill, rating)}
                    className={`flex-1 h-8 rounded ${
                      skillRatings[skill] === rating 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-label={`Rate ${skill} as ${['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][rating - 1]}`}
                  ></button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCategory === 0}
        >
          Previous
        </Button>
        
        <Button
          variant="gradient"
          onClick={handleNext}
        >
          {currentCategory < skillCategories.length - 1 ? 'Next' : 'Complete'}
        </Button>
      </div>
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-4">Processing your results...</p>
          </div>
        </div>
      )}
    </div>
  );
}