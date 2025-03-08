"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rocket, Sparkles, ArrowRight, CheckCircle, User, Mail, Lock, Github } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Separate component to use useSearchParams safely
function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = '/welcome';
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [gamePoints, setGamePoints] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, opacity: number, size: number}>>([]);
  const [activeTab, setActiveTab] = useState<string>("signin");
  
  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      size: Math.random() * 3 + 1
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 opacity-80" />
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `rgba(${120 + Math.random() * 80}, ${140 + Math.random() * 60}, ${255}, ${particle.opacity})`
            }}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{ 
              x: [
                `${particle.x}%`, 
                `${(particle.x + 20) % 100}%`,
                `${(particle.x + 40) % 100}%`
              ],
              y: [
                `${particle.y}%`, 
                `${(particle.y + 30) % 100}%`,
                `${(particle.y + 15) % 100}%`
              ],
              opacity: [
                particle.opacity,
                particle.opacity * 1.2,
                particle.opacity
              ]
            }}
            transition={{ 
              duration: 15 + (particle.id % 10),
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            x: ['-25%', '5%', '-15%'],
            y: ['5%', '25%', '15%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '20%', left: '30%' }}
        />
        
        <motion.div 
          className="absolute w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: ['10%', '-10%', '5%'],
            y: ['-5%', '15%', '-15%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '10%', right: '20%' }}
        />
      </div>
      
      {/* Game points display */}
      <motion.div 
        className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/30 flex items-center gap-2 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span 
          className="text-indigo-400 font-bold"
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
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <span className="text-xl">🏆</span>
            <div>
              <p className="font-bold text-white">{achievementText}</p>
              <p className="text-xs text-indigo-100">+{achievementText.includes('adventure') ? '50' : '10'} XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-slate-900/70 backdrop-blur-md border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-2">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
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
            </div>
            <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Career Compass
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Begin your journey to career discovery
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-4">
            <Tabs defaultValue="signin" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="data-[state=active]:bg-indigo-600/20">Sign In</TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-purple-600/20">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-0">
                <motion.div
                  className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => addPoints(5, 'Curious explorer!')}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: isClicking ? "100%" : gamePoints > 0 ? `${Math.min(gamePoints, 100)}%` : "5%" }}
                    transition={{ duration: isClicking ? 1 : 0.5 }}
                  />
                </motion.div>
                
                <div className="space-y-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          animate={isClicking ? {
                            y: [0, -10, 0],
                            boxShadow: [
                              '0 0 0 rgba(79, 70, 229, 0)',
                              '0 0 20px rgba(79, 70, 229, 0.5)',
                              '0 0 0 rgba(79, 70, 229, 0)'
                            ]
                          } : {}}
                          transition={{ duration: 0.8 }}
                        >
                          <Button 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-3 h-14 text-lg relative overflow-hidden border-slate-700"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            onClick={handleSignIn}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Earn 50 XP by signing in!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <motion.span 
                        className="px-2 bg-slate-900 text-slate-400"
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
                      className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/70 hover:to-slate-600/70"
                      onClick={() => {
                        handleExplore();
                        window.location.href = '/';
                      }}
                    >
                      <span className="mr-2">🔍</span> Explore as Guest
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20">
                      <Sparkles className="h-3.5 w-3.5 mr-1" /> New users get 100 bonus XP
                    </Badge>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                    <h3 className="font-medium text-indigo-300 flex items-center gap-2 mb-2">
                      <Rocket className="h-4 w-4" /> About Career Compass
                    </h3>
                    <p className="text-sm text-slate-300">
                      Career Compass is an AI-powered platform that helps you discover your ideal career path through personalized assessments and guidance.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">What you'll get:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Personality assessment based on MBTI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Skills evaluation and development recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Personalized career suggestions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">AI-powered career guidance and resources</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => setActiveTab("signin")}
                    >
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="pt-0 pb-4 flex flex-col">
            <div className="w-full flex justify-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-blue-300 text-sm">🧠</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-purple-300 text-sm">🔮</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-green-300 text-sm">🌱</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-amber-300 text-sm">⭐</span>
              </motion.div>
            </div>
          </CardFooter>
        </Card>
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
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading your adventure...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading your adventure...</p>
        </div>
      }>
        <SignInContent />
      </Suspense>
    </MainLayout>
  );
}