"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import WelcomeAnimation from '@/components/auth/welcome-animation';

// Separate component to use useSearchParams safely
function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = '/welcome';
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [gamePoints, setGamePoints] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);
  
  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);
  }, []);
  
  const handleSignIn = () => {
    setIsClicking(true);
    localStorage.removeItem('hasSeenWelcome');
    addPoints(50, 'Ready for adventure!');
    setTimeout(() => {
      signIn('google', { callbackUrl });
    }, 1200);
  };
  
  const addPoints = (points: number, achievement: string) => {
    setGamePoints(prev => prev + points);
    setAchievementText(achievement);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };
  
  const handleExplore = () => {
    addPoints(10, 'Explorer badge earned!');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
      {/* Floating particles background - client-side only */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-blue-500/30"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{ 
              x: [
                `${particle.x}%`, 
                `${(particle.x + 30) % 100}%`,
                `${(particle.x + 60) % 100}%`
              ],
              y: [
                `${particle.y}%`, 
                `${(particle.y + 40) % 100}%`,
                `${(particle.y + 20) % 100}%`
              ]
            }}
            transition={{ 
              duration: 15 + (particle.id % 10),
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Game points display */}
      <motion.div 
        className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30 flex items-center gap-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span 
          className="text-blue-400 font-bold"
          animate={{ scale: gamePoints > 0 ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          {gamePoints}
        </motion.span>
        <span className="text-slate-300 text-sm">XP</span>
      </motion.div>
      
      {/* Achievement notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <span className="text-xl">🏆</span>
            <div>
              <p className="font-bold text-white">{achievementText}</p>
              <p className="text-xs text-blue-100">+{achievementText.includes('adventure') ? '50' : '10'} XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Rest of the component remains the same */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 max-w-md w-full relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-0"
          animate={{ 
            background: [
              'linear-gradient(to bottom right, rgba(37, 99, 235, 0.1), rgba(126, 34, 206, 0.1))',
              'linear-gradient(to bottom right, rgba(126, 34, 206, 0.1), rgba(37, 99, 235, 0.1))',
              'linear-gradient(to bottom right, rgba(37, 99, 235, 0.1), rgba(126, 34, 206, 0.1))'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div 
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            animate={{ 
              rotate: isClicking ? [0, 360] : 0,
              scale: isClicking ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 1.2 }}
          >
            <motion.span 
              className="text-2xl"
              animate={{ opacity: isClicking ? [1, 0.5, 1] : 1 }}
            >
              🚀
            </motion.span>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold mb-6 text-center"
            animate={{ 
              scale: isClicking ? [1, 1.05, 1] : 1,
              color: isClicking ? ['#ffffff', '#60a5fa', '#ffffff'] : '#ffffff'
            }}
            transition={{ duration: 0.8 }}
          >
            Begin Your Career Journey
          </motion.h1>
          
          <motion.div 
            className="h-2 w-full bg-slate-700 rounded-full mb-8 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            onClick={() => addPoints(5, 'Curious explorer!')}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: isClicking ? "100%" : gamePoints > 0 ? `${Math.min(gamePoints, 100)}%` : "5%" }}
              transition={{ duration: isClicking ? 1 : 0.5 }}
            />
          </motion.div>
          
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={isClicking ? {
                y: [0, -10, 0],
                boxShadow: [
                  '0 0 0 rgba(96, 165, 250, 0)',
                  '0 0 20px rgba(96, 165, 250, 0.5)',
                  '0 0 0 rgba(96, 165, 250, 0)'
                ]
              } : {}}
              transition={{ duration: 0.8 }}
            >
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-3 h-14 text-lg relative overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleSignIn}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovering ? '0%' : '-100%' }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  className="relative z-10 flex items-center justify-center gap-3"
                  animate={isClicking ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </motion.div>
              </Button>
            </motion.div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <motion.span 
                  className="px-2 bg-slate-800 text-slate-400"
                  animate={isClicking ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  or explore without signing in
                </motion.span>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="ghost" 
                className="w-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-700/70 hover:to-slate-600/70"
                onClick={() => {
                  handleExplore();
                  window.location.href = '/';
                }}
              >
                <span className="mr-2">🔍</span> Explore as Guest
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="inline-block"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <span className="text-2xl">✨</span>
            </motion.div>
            <p className="text-xs text-slate-400 mt-2">
              Unlock your career potential with personalized insights
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Main component with Suspense for useSearchParams
export default function SignIn() {
  // Use client-side only rendering for this component
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Show nothing during SSR to prevent hydration errors
  if (!isMounted) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading your adventure...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading your adventure...</p>
        </div>
      }>
        <SignInContent />
      </Suspense>
    </MainLayout>
  );
}