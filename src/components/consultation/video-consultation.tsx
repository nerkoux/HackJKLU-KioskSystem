"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useSession } from 'next-auth/react';

interface VideoConsultationProps {
  autoStart?: boolean;
}

export default function VideoConsultation({ autoStart = false }: VideoConsultationProps) {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showIntro, setShowIntro] = useState(false);
  const [showGameAnimation, setShowGameAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [gamePoints, setGamePoints] = useState(0);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: session, status } = useSession();
  const userName = session?.user?.name || "Career Explorer";
  
  // Auto-start the consultation if the prop is true
  useEffect(() => {
    if (autoStart) {
      // Check if user has seen the intro video before
      const hasSeenIntroVideo = localStorage.getItem('hasSeenIntroVideo');
      
      if (hasSeenIntroVideo === 'true') {
        // Skip intro if already seen
        setIsActive(true);
        setMessages([
          { 
            text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
            isUser: false 
          }
        ]);
      } else {
        // Show intro video directly
        setShowIntro(true);
      }
    }
  }, [autoStart, userName]);
  
  // Setup video event handlers when showIntro changes
  useEffect(() => {
    if (showIntro && videoRef.current) {
      // Make sure video plays automatically
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
      });
      
      // Setup video onended handler
      videoRef.current.onended = () => {
        // Mark that user has seen the intro video
        localStorage.setItem('hasSeenIntroVideo', 'true');
        
        // Single subtle confetti celebration when video ends
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6, x: 0.5 }
        });
        
        setShowIntro(false);
        setIsActive(true);
        setMessages([
          { 
            text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
            isUser: false 
          }
        ]);
      };
    }
  }, [showIntro, userName]);
  
  // Check if user has seen the intro video before
  useEffect(() => {
    const hasSeenIntroVideo = localStorage.getItem('hasSeenIntroVideo');
    if (hasSeenIntroVideo === 'true') {
      // Skip the intro if already seen
      console.log('User has already seen the intro video');
    }
  }, []);
  
  // Handle welcome animation steps
  useEffect(() => {
    if (!showWelcomeAnimation) return;
    
    if (welcomeStep === 0) {
      const timer = setTimeout(() => setWelcomeStep(1), 2500);
      return () => clearTimeout(timer);
    }
    
    if (welcomeStep === 1) {
      const timer = setTimeout(() => setWelcomeStep(2), 3000);
      return () => clearTimeout(timer);
    }
    
    if (welcomeStep === 2) {
      const timer = setTimeout(() => setWelcomeStep(3), 3000);
      return () => clearTimeout(timer);
    }
    
    if (welcomeStep === 3) {
      const timer = setTimeout(() => {
        setWelcomeStep(4);
        // Single subtle confetti burst
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (welcomeStep === 4) {
      const timer = setTimeout(() => {
        // End welcome animation and show intro video
        setShowWelcomeAnimation(false);
        
        // Check if user has seen the intro video before
        const hasSeenIntroVideo = localStorage.getItem('hasSeenIntroVideo');
        
        if (hasSeenIntroVideo === 'true') {
          // Skip intro if already seen
          setIsActive(true);
          setMessages([
            { 
              text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
              isUser: false 
            }
          ]);
        } else {
          // Show intro video
          setShowIntro(true);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeAnimation, welcomeStep, userName]);
  
  const startConsultation = () => {
    // Start with welcome animation
    setShowWelcomeAnimation(true);
    setWelcomeStep(0);
    
    // Setup video onended handler
    if (videoRef.current) {
      videoRef.current.onended = () => {
        // Mark that user has seen the intro video
        localStorage.setItem('hasSeenIntroVideo', 'true');
        
        // Single subtle confetti celebration when video ends
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6, x: 0.5 }
        });
        
        setShowIntro(false);
        setIsActive(true);
        setMessages([
          { 
            text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
            isUser: false 
          }
        ]);
      };
    }
  };
  
  const endConsultation = () => {
    setIsActive(false);
    setMessages([]);
    setShowIntro(false);
    setShowGameAnimation(false);
    setShowWelcomeAnimation(false);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Store the current input value
    const currentMessage = inputValue;
    
    // Clear input
    setInputValue('');
    
    // Add a placeholder for the AI response
    const placeholderIndex = messages.length;
    setMessages(prev => [...prev, { text: "Thinking...", isUser: false }]);
    
    try {
      // Get conversation context (last 5 messages)
      const recentMessages = messages.slice(-5).map(msg => 
        `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`
      ).join('\n');
      
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: recentMessages
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Update the AI message with the response
      setMessages(prev => {
        const updated = [...prev];
        updated[placeholderIndex] = { text: data.response, isUser: false };
        return updated;
      });
    } catch (error) {
      console.error('Error getting chat response:', error);
      
      // Fallback response if API fails
      setMessages(prev => {
        const updated = [...prev];
        updated[placeholderIndex] = { 
          text: "I'm having trouble connecting right now. Could you try again in a moment?", 
          isUser: false 
        };
        return updated;
      });
    }
  };
  
  // Dramatic quotes for welcome animation
  const welcomeQuotes = [
    "Your career journey is about to get a powerful ally...",
    `Are you ready to meet your personal AI Career Agent, ${userName}?`,
    "Introducing Jeorge, your personalized AI Career Consultant",
    "Designed to help you diversify your career path",
    "Let's begin your journey to career success!"
  ];
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      {showWelcomeAnimation ? (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-blue-900/80 to-slate-900 backdrop-blur-md"
        >
          <AnimatePresence mode="wait">
            {welcomeStep === 0 && (
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
                  {welcomeQuotes[0]}
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
            
            {welcomeStep === 1 && (
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
                  {welcomeQuotes[1]}
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
            
            {welcomeStep === 2 && (
              <motion.div
                key="welcome3"
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
                  {welcomeQuotes[2]}
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  🤖
                </motion.div>
              </motion.div>
            )}
            
            {welcomeStep === 3 && (
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
                  {welcomeQuotes[3]}
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  🧠
                </motion.div>
              </motion.div>
            )}
            
            {welcomeStep === 4 && (
              <motion.div
                key="welcome5"
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
                  {welcomeQuotes[4]}
                </motion.h2>
                <motion.div 
                  className="text-7xl mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
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
                
                // Check if user has seen the intro video before
                const hasSeenIntroVideo = localStorage.getItem('hasSeenIntroVideo');
                
                if (hasSeenIntroVideo === 'true') {
                  // Skip intro if already seen
                  setIsActive(true);
                  setMessages([
                    { 
                      text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
                      isUser: false 
                    }
                  ]);
                } else {
                  // Show intro video
                  setShowIntro(true);
                }
              }}
            >
              Skip Animation
            </Button>
          </motion.div>
        </motion.div>
      ) : showIntro ? (
        <div className="relative w-full h-[600px] flex items-center justify-center">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover rounded-xl"
            autoPlay
            controls={false}
            src="/videos/ai-intro.mp4"
          />
          <Button
            className="absolute bottom-4 right-4"
            onClick={() => {
              // Mark that user has seen the intro video
              localStorage.setItem('hasSeenIntroVideo', 'true');
              
              setShowIntro(false);
              setIsActive(true);
              setMessages([
                { 
                  text: `Hello ${userName}! I'm Jeorge, your AI Career Consultant. How can I help you with your career decisions today?`, 
                  isUser: false 
                }
              ]);
            }}
          >
            Skip Video
          </Button>
        </div>
      ) : !isActive ? (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">AI Career Consultation</h2>
          <p className="text-slate-300 mb-6">
            Start a conversation with our AI career consultant to get personalized guidance on your career path.
          </p>
          <Button onClick={startConsultation}>Start Consultation</Button>
        </div>
      ) : (
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-700 p-4 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about career paths, skills, or job market trends..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
            >
              Send
            </Button>
          </div>
          
          <div className="border-t border-slate-700 p-2 flex justify-between items-center bg-slate-800/50">
            <div className="text-xs text-slate-400">
              AI Career Consultant
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={endConsultation}
              className="text-slate-400 hover:text-white"
            >
              End Consultation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}