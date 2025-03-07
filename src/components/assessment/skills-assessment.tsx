"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  const [currentCategory, setCurrentCategory] = useState(0);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  
  const progress = ((currentCategory / skillCategories.length) * 100);
  
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
      localStorage.setItem('skillRatings', JSON.stringify(skillRatings));
    }
  };
  
  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };
  
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Skills Assessment Complete!</h2>
          <p className="text-slate-300 mb-6">
            Thank you for completing the skills assessment. Your results have been saved to your profile.
          </p>
          <Button variant="gradient" onClick={() => window.location.href = '/profile'}>
            View Results in Profile
          </Button>
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
                    ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][skillRatings[skill] - 1] : 
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
    </div>
  );
}