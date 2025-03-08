"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import VideoConsultation from '@/components/consultation/video-consultation';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti'; // Re-add confetti import

export default function ConsultationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true); // Start with animation shown
  const [animationStep, setAnimationStep] = useState(0);
  const [showConsultation, setShowConsultation] = useState(false);
  const userName = session?.user?.name || "Career Explorer";

  // Handle animation steps
  useEffect(() => {
    if (!showWelcomeAnimation) return;
    
    if (animationStep === 0) {
      const timer = setTimeout(() => setAnimationStep(1), 2500);
      return () => clearTimeout(timer);
    }
    
    if (animationStep === 1) {
      const timer = setTimeout(() => setAnimationStep(2), 3000);
      return () => clearTimeout(timer);
    }
    
    if (animationStep === 2) {
      const timer = setTimeout(() => {
        setAnimationStep(3);
        // Add confetti back
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (animationStep === 3) {
      const timer = setTimeout(() => {
        // End welcome animation and show consultation
        setShowWelcomeAnimation(false);
        setShowConsultation(true);
        
        // Add final confetti burst when transitioning to consultation
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeAnimation, animationStep]);

  // If session is loading, show a loading state
  if (status === "loading") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showWelcomeAnimation ? (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-blue-900/80 to-slate-900 backdrop-blur-md"
        >
          <AnimatePresence mode="wait">
            {animationStep === 0 && (
              <motion.div
                key="welcome1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-3xl px-6"
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Your career journey is about to get a powerful ally...
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  🚀
                </motion.div>
              </motion.div>
            )}
            
            {animationStep === 1 && (
              <motion.div
                key="welcome2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-3xl px-6"
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Are you ready to meet your personal AI Career Agent, {userName}?
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  👨‍💼
                </motion.div>
              </motion.div>
            )}
            
            {animationStep === 2 && (
              <motion.div
                key="welcome3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-3xl px-6"
              >
                <motion.h2 
                  className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Meet your AI Agent: Jeorge
                </motion.h2>
                <motion.div 
                  className="flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <div className="relative">
                    <div className="text-8xl">🤖</div>
                    <motion.div 
                      className="absolute -top-4 -right-4 text-4xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5 
                      }}
                    >
                      ✨
                    </motion.div>
                  </div>
                </motion.div>
                <motion.p
                  className="text-xl text-slate-300 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Your personalized AI Career Consultant to help you diversify your career path
                </motion.p>
              </motion.div>
            )}
            
            {animationStep === 3 && (
              <motion.div
                key="welcome4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-3xl px-6"
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Let's begin your journey to career success!
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  🧭
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="absolute bottom-8 right-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowWelcomeAnimation(false);
                setShowConsultation(true);
                // Add confetti when skipping
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
            >
              Skip Animation
            </Button>
          </motion.div>
        </motion.div>
      ) : showConsultation ? (
        <div className="max-w-4xl mx-auto">
          <VideoConsultation autoStart={true} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AI Career Consultation
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Get personalized career guidance through an interactive consultation with our AI career expert.
              Ask questions about career paths, skill development, or job market trends.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="text-blue-400 text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Career Guidance</h3>
                <p className="text-slate-400">
                  Get personalized advice on career paths that match your personality and skills.
                </p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="text-purple-400 text-4xl mb-4">🎓</div>
                <h3 className="text-lg font-semibold mb-2">Education Planning</h3>
                <p className="text-slate-400">
                  Discover courses and educational paths to help you reach your career goals.
                </p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <div className="text-green-400 text-4xl mb-4">📈</div>
                <h3 className="text-lg font-semibold mb-2">Industry Insights</h3>
                <p className="text-slate-400">
                  Learn about job market trends and opportunities in your field of interest.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                onClick={() => {
                  setShowWelcomeAnimation(true);
                  setAnimationStep(0);
                }}
              >
                Start Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
}