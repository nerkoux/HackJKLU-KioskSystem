"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { calculateMBTI } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const progress = (currentQuestion / mbtiQuestions.length) * 100;
  
  const handleOptionSelect = (value: string) => {
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
      const mbtiResult = calculateMBTI(newResponses);
      // Store result in localStorage for the results page
      localStorage.setItem('mbtiResult', mbtiResult);
      localStorage.setItem('mbtiResponses', JSON.stringify(newResponses));
      router.push('/results');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Personality Assessment</h2>
        <p className="text-slate-300 mb-4">
          Discover your personality type to find career paths that match your natural strengths.
        </p>
        <Progress value={progress} className="h-2" />
        <p className="text-right text-sm text-slate-400 mt-1">
          Question {currentQuestion + 1} of {mbtiQuestions.length}
        </p>
      </div>
      
      <motion.div
        key={currentQuestion}
        initial={showAnimation ? { x: 100, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8"
      >
        <h3 className="text-xl font-semibold mb-6">
          {mbtiQuestions[currentQuestion].question}
        </h3>
        
        <div className="space-y-4">
          {mbtiQuestions[currentQuestion].options.map((option, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-slate-600 hover:bg-slate-700 hover:text-white"
                onClick={() => handleOptionSelect(option.value)}
              >
                <span className="text-lg">{option.text}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
              setResponses(responses.slice(0, -1));
            }
          }}
          disabled={currentQuestion === 0}
        >
          Previous Question
        </Button>
        
        <div className="flex space-x-2">
          {Array.from({ length: Math.min(5, mbtiQuestions.length) }).map((_, i) => {
            const questionIndex = Math.floor(currentQuestion / 5) * 5 + i;
            return questionIndex < mbtiQuestions.length ? (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${
                  questionIndex === currentQuestion 
                    ? 'bg-blue-500' 
                    : questionIndex < currentQuestion 
                      ? 'bg-slate-500' 
                      : 'bg-slate-700'
                }`}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}