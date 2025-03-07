"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(0);
  
  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Mark that user has seen welcome screen
  useEffect(() => {
    if (status === 'authenticated') {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [status]);
  
  // Handle animation steps
  useEffect(() => {
    if (status === 'loading') return;
    
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
        // Trigger confetti when moving to step 1
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 2000);
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
      const timer = setTimeout(() => {
        setStep(4);
        // Trigger confetti again for final step
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (step === 4) {
      const timer = setTimeout(() => router.push('/home'), 2500);
      return () => clearTimeout(timer);
    }
  }, [step, status, router]);
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const quotes = [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Your career path is not just a journey, it's an adventure waiting to unfold.",
    "The best way to predict your future is to create it.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Your career is a marathon, not a sprint. Pace yourself and enjoy the journey."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-50 flex items-center justify-center overflow-hidden">
      {/* Floating particles for gaming feel */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0, -10, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500/20 rounded-full z-0"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0, 10, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-purple-500/20 rounded-full z-0"
      />
      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          x: [0, 10, 0, -10, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="absolute top-1/3 right-1/4 w-10 h-10 bg-green-500/20 rounded-full z-0"
      />
      
      <div className="max-w-2xl w-full px-6 relative z-10">
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
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-4xl">🚀</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Welcome to Your Career Quest!
              </h1>
              <p className="text-xl text-slate-300">
                Get ready for an amazing journey of self-discovery
              </p>
            </motion.div>
          )}
          
          {step === 1 && (
            <motion.div 
              key="personalized"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{session?.user?.name || 'Explorer'}</span>!
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                We're excited to help you discover your perfect career path
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div 
              key="journey"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-3xl">🧭</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">Your Career Journey Begins</h2>
              <p className="text-xl text-slate-300 mb-8">
                Discover your strengths, explore career paths, and find your perfect match
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "25%" }}
                  animate={{ width: "50%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div 
              key="quote"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <span className="text-3xl">💭</span>
              </div>
              <p className="text-2xl italic text-slate-300 mb-8 px-6">
                "{randomQuote}"
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-5xl">✨</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                You're All Set!
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Let's start exploring your career possibilities
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "75%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}