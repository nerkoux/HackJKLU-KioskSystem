"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { calculateMBTI } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { sendAssessment } from '@/lib/api-utils';

// MBTI questions
const mbtiQuestions = [
  {
    id: 1,
    question: "At a party, you:",
    options: [
      { value: "E", text: "Interact with many, including strangers" },
      { value: "I", text: "Interact with a few, known to you" }
    ]
  },
  {
    id: 2,
    question: "You are more:",
    options: [
      { value: "S", text: "Realistic than speculative" },
      { value: "N", text: "Speculative than realistic" }
    ]
  },
  {
    id: 3,
    question: "Is it worse to:",
    options: [
      { value: "T", text: "Have your head in the clouds" },
      { value: "F", text: "Be in a rut" }
    ]
  },
  {
    id: 4,
    question: "You are more impressed by:",
    options: [
      { value: "T", text: "Principles" },
      { value: "F", text: "Emotions" }
    ]
  },
  {
    id: 5,
    question: "You are drawn more to:",
    options: [
      { value: "J", text: "The structured and scheduled" },
      { value: "P", text: "The unstructured and unplanned" }
    ]
  },
  {
    id: 6,
    question: "You prefer to work:",
    options: [
      { value: "E", text: "In teams, collaborating with others" },
      { value: "I", text: "Alone or in small, familiar groups" }
    ]
  },
  {
    id: 7,
    question: "You tend to choose:",
    options: [
      { value: "S", text: "What is practical and works now" },
      { value: "N", text: "What is innovative and might work in the future" }
    ]
  },
  {
    id: 8,
    question: "When making decisions, you typically rely on:",
    options: [
      { value: "T", text: "Logic and objective analysis" },
      { value: "F", text: "Personal values and how others will be affected" }
    ]
  },
  {
    id: 9,
    question: "You prefer environments that are:",
    options: [
      { value: "J", text: "Organized with clear expectations" },
      { value: "P", text: "Flexible with room for spontaneity" }
    ]
  },
  {
    id: 10,
    question: "When solving problems, you prefer to:",
    options: [
      { value: "S", text: "Follow established methods and procedures" },
      { value: "N", text: "Explore new approaches and possibilities" }
    ]
  },
  {
    id: 11,
    question: "You get more satisfaction from:",
    options: [
      { value: "E", text: "Discussing ideas with others" },
      { value: "I", text: "Reflecting on ideas by yourself" }
    ]
  },
  {
    id: 12,
    question: "In your free time, you prefer to:",
    options: [
      { value: "J", text: "Plan activities in advance" },
      { value: "P", text: "Be spontaneous and go with the flow" }
    ]
  }
];

export default function MBTIAssessment() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetake, setIsRetake] = useState(false);
  const [isComplete, setIsComplete] = useState(false); // Add state to track completion
  
  useEffect(() => {
    // Check if this is a retake
    const mbtiResult = localStorage.getItem('mbtiResult');
    if (mbtiResult) {
      setIsRetake(true);
    }
  }, []);
  
  const progress = (currentQuestion / mbtiQuestions.length) * 100;
  
  const handleOptionSelect = async (value: string) => {
    const newResponses = [...responses, value];
    setResponses(newResponses);
    
    if (currentQuestion < mbtiQuestions.length - 1) {
      setShowAnimation(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setShowAnimation(false);
      }, 500);
    } else {
      // Assessment complete
      setIsSubmitting(true);
      const mbtiResult = calculateMBTI(newResponses);
      
      try {
        // Create a mapping of question IDs to responses
        const responsesMap: Record<string, string> = {};
        newResponses.forEach((response, index) => {
          responsesMap[`q${index + 1}`] = response;
        });
        
        // Save to localStorage first (as a backup)
        localStorage.setItem('mbtiResult', mbtiResult);
        localStorage.setItem('mbtiResponses', JSON.stringify(responsesMap));
        localStorage.setItem('mbtiCompleted', 'true');
        
        // Save to database if user is logged in
        if (status === 'authenticated') {
          // Save to MongoDB via Next.js API
          await fetch('/api/user/assessment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              mbtiResult,
              mbtiResponses: responsesMap,
              mbtiCompleted: true,
              completedAt: new Date().toISOString()
            }),
          });
        }
        
        // Set completion state
        setIsComplete(true);
        
        // Show completion screen by not redirecting immediately
        setIsSubmitting(false);
      } catch (err) {
        console.error('Error saving MBTI result:', err);
        // Even if there's an error, we've saved to localStorage, so continue
        setIsSubmitting(false);
      }
    }
  };
  
  // Show completion screen if all questions are answered
  if (currentQuestion === mbtiQuestions.length && !isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">MBTI Assessment Complete!</h2>
          <p className="text-slate-300 mb-6">
            Your personality type is <span className="text-blue-400 font-semibold">{calculateMBTI(responses)}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gradient" 
              onClick={() => router.push('/assessment?completed=mbti')}
            >
              Return to Assessment Hub
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/assessment?type=skills')}
            >
              Continue to Skills Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Personality Assessment</h2>
        <p className="text-slate-300 mb-4">
          Answer the following questions to discover your MBTI personality type.
        </p>
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-slate-400 mt-1">
          Question {currentQuestion + 1} of {mbtiQuestions.length}
        </p>
      </div>
      
      {isSubmitting ? (
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-center">Processing your results...</p>
        </div>
      ) : (
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: showAnimation ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">
            {mbtiQuestions[currentQuestion].question}
          </h3>
          
          <div className="space-y-4">
            {mbtiQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.value)}
                className="w-full text-left p-4 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}