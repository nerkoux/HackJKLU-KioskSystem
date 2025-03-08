"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import MBTIAssessment from '@/components/assessment/mbti-assessment';
import SkillsAssessment from '@/components/assessment/skills-assessment';
import PersonalPreferences from '@/components/assessment/personal-preferences';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

// Create a separate component that uses useSearchParams
function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeAssessment, setActiveAssessment] = useState<string>('');
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  
  useEffect(() => {
    // Check which assessments are completed
    const mbtiCompleted = localStorage.getItem('mbtiCompleted') === 'true';
    const skillsCompleted = localStorage.getItem('skillsCompleted') === 'true';
    const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';
    
    const completed = [];
    if (mbtiCompleted) completed.push('mbti');
    if (skillsCompleted) completed.push('skills');
    if (preferencesCompleted) completed.push('preferences');
    
    setCompletedAssessments(completed);
    
    // Set active assessment based on URL param or default to first incomplete
    const completedParam = searchParams.get('completed');
    
    if (completedParam) {
      // If coming from a completed assessment, show the hub
      if (completedParam === 'mbti' || completedParam === 'skills' || completedParam === 'preferences') {
        setActiveAssessment('');
      } else if (!mbtiCompleted) {
        setActiveAssessment('mbti');
      } else if (!skillsCompleted) {
        setActiveAssessment('skills');
      } else if (!preferencesCompleted) {
        setActiveAssessment('preferences');
      } else {
        // All completed, show results
        setActiveAssessment('');
      }
    } else {
      // No param, set based on completion status
      if (!mbtiCompleted) {
        setActiveAssessment('mbti');
      } else if (!skillsCompleted) {
        setActiveAssessment('skills');
      } else if (!preferencesCompleted) {
        setActiveAssessment('preferences');
      } else {
        // All completed, show hub
        setActiveAssessment('');
      }
    }
  }, [searchParams]);
  
  const handleStartAssessment = (type: string) => {
    setActiveAssessment(type);
  };
  
  const renderAssessmentHub = () => {
    const allCompleted = completedAssessments.length === 3;
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Career Assessment Hub
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Complete all three assessments to receive personalized career guidance based on your personality, skills, and preferences.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* MBTI Assessment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Personality Assessment</h2>
                {completedAssessments.includes('mbti') && (
                  <span className="bg-green-500/20 text-green-400 p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </div>
              <p className="text-slate-400 mb-6">
                Discover your MBTI personality type and how it relates to potential career paths.
              </p>
              <Button
                onClick={() => handleStartAssessment('mbti')}
                className={`w-full ${
                  completedAssessments.includes('mbti')
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {completedAssessments.includes('mbti') ? 'Retake Assessment' : 'Start Assessment'}
              </Button>
            </div>
          </motion.div>
          
          {/* Skills Assessment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Skills Assessment</h2>
                {completedAssessments.includes('skills') && (
                  <span className="bg-green-500/20 text-green-400 p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </div>
              <p className="text-slate-400 mb-6">
                Rate your proficiency in various skills to identify your strengths and areas for growth.
              </p>
              <Button
                onClick={() => handleStartAssessment('skills')}
                disabled={!completedAssessments.includes('mbti')}
                className={`w-full ${
                  !completedAssessments.includes('mbti')
                    ? 'bg-slate-700 cursor-not-allowed opacity-50'
                    : completedAssessments.includes('skills')
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {!completedAssessments.includes('mbti')
                  ? 'Complete Personality First'
                  : completedAssessments.includes('skills')
                  ? 'Retake Assessment'
                  : 'Start Assessment'}
              </Button>
            </div>
          </motion.div>
          
          {/* Personal Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Personal Preferences</h2>
                {completedAssessments.includes('preferences') && (
                  <span className="bg-green-500/20 text-green-400 p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </div>
              <p className="text-slate-400 mb-6">
                Share your interests, values, and career goals to receive more tailored recommendations.
              </p>
              <Button
                onClick={() => handleStartAssessment('preferences')}
                disabled={!completedAssessments.includes('skills')}
                className={`w-full ${
                  !completedAssessments.includes('skills')
                    ? 'bg-slate-700 cursor-not-allowed opacity-50'
                    : completedAssessments.includes('preferences')
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {!completedAssessments.includes('skills')
                  ? 'Complete Skills First'
                  : completedAssessments.includes('preferences')
                  ? 'Retake Assessment'
                  : 'Start Assessment'}
              </Button>
            </div>
          </motion.div>
        </div>
        
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={() => router.push('/results')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-6 h-auto text-lg"
            >
              View Your Personalized Results <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  // Return the appropriate component based on activeAssessment
  return (
    <>
      {activeAssessment === 'mbti' && <MBTIAssessment />}
      {activeAssessment === 'skills' && <SkillsAssessment />}
      {activeAssessment === 'preferences' && <PersonalPreferences />}
      {activeAssessment === '' && renderAssessmentHub()}
    </>
  );
}

// Main component with Suspense boundary
export default function AssessmentPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-slate-300">Loading assessment...</p>
        </div>
      }>
        <AssessmentContent />
      </Suspense>
    </MainLayout>
  );
}