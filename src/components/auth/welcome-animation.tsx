"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface WelcomeAnimationProps {
  userName: string;
  onComplete?: () => void;
}

export default function WelcomeAnimation({ userName, onComplete }: WelcomeAnimationProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2500);
      return () => clearTimeout(timer);
    }
    
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 3000);
      return () => clearTimeout(timer);
    }
    
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 3000);
      return () => clearTimeout(timer);
    }
    
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/home');
    }
  };
  
  const quotes = [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Your career path is not just a journey, it's an adventure waiting to unfold.",
    "The best way to predict your future is to create it.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Choose a job you love, and you will never have to work a day in your life."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 1, times: [0, 0.6, 1] }}
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-4xl">🎉</span>
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome, {userName}!
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Let's make your career path more awesome
              </motion.p>
            </motion.div>
          )}
          
          {step === 1 && (
            <motion.div 
              key="quote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-medium text-slate-200 italic mb-4"
              >
                "{randomQuote}"
              </motion.div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              key="assessment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <span className="text-3xl">🧠</span>
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-3"
              >
                Personality Assessment
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300"
              >
                Discover your unique personality type and strengths that will guide your career choices
              </motion.p>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              key="consultation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <span className="text-3xl">💬</span>
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-3"
              >
                AI Career Consultation
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300"
              >
                Get personalized career advice from our AI assistant based on your assessment results
              </motion.p>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-6"
              >
                Discover What We Offer
              </motion.h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800/60 p-4 rounded-lg border border-slate-700"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full mb-3 flex items-center justify-center mx-auto">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-medium mb-1">Personality Assessment</h3>
                  <p className="text-sm text-slate-400">Discover your unique traits</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-800/60 p-4 rounded-lg border border-slate-700"
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full mb-3 flex items-center justify-center mx-auto">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-medium mb-1">AI Consultation</h3>
                  <p className="text-sm text-slate-400">Get personalized advice</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-800/60 p-4 rounded-lg border border-slate-700"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full mb-3 flex items-center justify-center mx-auto">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-medium mb-1">Career Insights</h3>
                  <p className="text-sm text-slate-400">Data-driven recommendations</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-800/60 p-4 rounded-lg border border-slate-700"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full mb-3 flex items-center justify-center mx-auto">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-medium mb-1">Growth Tracking</h3>
                  <p className="text-sm text-slate-400">Monitor your progress</p>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              key="benefits"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-6"
              >
                Your Career Journey Starts Here
              </motion.h2>
              
              <div className="space-y-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✓</span>
                  </div>
                  <p className="text-left text-slate-300">Discover careers that match your personality</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✓</span>
                  </div>
                  <p className="text-left text-slate-300">Get AI-powered career recommendations</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✓</span>
                  </div>
                  <p className="text-left text-slate-300">Track your skills and growth over time</p>
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div 
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold mb-6"
              >
                Ready to begin your journey?
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 justify-center"
              >
                <Button 
                  variant="gradient" 
                  size="lg"
                  className="w-full"
                  onClick={handleComplete}
                >
                  Explore Your Dashboard
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/assessment')}
                  >
                    Take Assessment
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/consultation')}
                  >
                    Get Career Advice
                  </Button>
                </div>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => router.push('/profile')}
                >
                  View Your Profile
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}