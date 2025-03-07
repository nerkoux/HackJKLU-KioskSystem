"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import MBTIAssessment from '@/components/assessment/mbti-assessment';
import SkillsAssessment from '@/components/assessment/skills-assessment';
import { Button } from '@/components/ui/button';

export default function AssessmentPage() {
  const [started, setStarted] = useState(false);
  const [assessmentType, setAssessmentType] = useState<'mbti' | 'skills' | null>(null);
  
  if (!started) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Discover Your Career Path
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Take our interactive assessments to find careers that match your personality, skills, and interests.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
              >
                <div className="text-blue-400 text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold mb-2">Personality Assessment</h3>
                <p className="text-slate-400 mb-4">
                  Discover your MBTI personality type and find careers that match your natural strengths and preferences.
                </p>
                <Button 
                  variant="gradient" 
                  onClick={() => {
                    setAssessmentType('mbti');
                    setStarted(true);
                  }}
                >
                  Start MBTI Assessment
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700"
              >
                <div className="text-purple-400 text-4xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold mb-2">Skills Assessment</h3>
                <p className="text-slate-400 mb-4">
                  Evaluate your skills across different categories to identify your strengths and areas for development.
                </p>
                <Button 
                  variant="gradient" 
                  onClick={() => {
                    setAssessmentType('skills');
                    setStarted(true);
                  }}
                >
                  Start Skills Assessment
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-semibold mb-4">Why Take These Assessments?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <span className="text-blue-400 text-xl">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Self-Discovery</h3>
                  <p className="text-slate-400 text-sm">
                    Gain insights into your personality traits, strengths, and natural preferences.
                  </p>
                </div>
                
                <div>
                  <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <span className="text-purple-400 text-xl">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Career Matching</h3>
                  <p className="text-slate-400 text-sm">
                    Find career paths that align with your unique combination of traits and skills.
                  </p>
                </div>
                
                <div>
                  <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <span className="text-green-400 text-xl">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Development Plan</h3>
                  <p className="text-slate-400 text-sm">
                    Get a personalized roadmap for skill development and career growth.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {assessmentType === 'mbti' ? (
        <MBTIAssessment />
      ) : (
        <SkillsAssessment />
      )}
    </MainLayout>
  );
}