"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showOptions, setShowOptions] = useState(false);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
  
  if (status === 'loading') {
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
      <div className="relative py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{session?.user?.name || 'Explorer'}</span>!
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              Let's start your career path journey
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => setShowOptions(true)}
            >
              Begin Your Adventure
            </Button>
          </motion.div>
          
          {showOptions ? (
            <>
              {/* Career Path Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-2xl mr-2">🧭</span> Choose Your Path
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group"
                    onClick={() => router.push('/assessment')}
                  >
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-3xl">🧠</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">Personality Assessment</h3>
                    <p className="text-slate-300 mb-4">Discover your MBTI personality type and how it relates to career choices.</p>
                    <Button className="w-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 group-hover:from-blue-500 group-hover:to-blue-600">
                      Start Assessment
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group"
                    onClick={() => router.push('/assessment')}
                  >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                      <span className="text-3xl">🔧</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">Skills Assessment</h3>
                    <p className="text-slate-300 mb-4">Identify your strengths and areas for growth to find matching careers.</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500/80 to-purple-600/80 group-hover:from-purple-500 group-hover:to-purple-600">
                      Discover Skills
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group"
                    onClick={() => router.push('/consultation')}
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                      <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-colors">Career Consultation</h3>
                    <p className="text-slate-300 mb-4">Chat with our AI career advisor for personalized guidance.</p>
                    <Button className="w-full bg-gradient-to-r from-green-500/80 to-green-600/80 group-hover:from-green-500 group-hover:to-green-600">
                      Start Consultation
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Career Progress Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-2xl mr-2">📊</span> Your Progress
                </h2>
                
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-400">Personality</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2 flex-1" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-purple-400">Skills</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2 flex-1" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/70 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-green-400">Career Matches</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2 flex-1" />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-center mb-4">Complete your assessments to see your progress and career matches!</p>
                </div>
              </motion.div>
              
              {/* Recommended Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-2xl mr-2">🚀</span> Recommended Next Steps
                </h2>
                
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                  <ol className="space-y-4 mb-6">
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Take the Personality Assessment</h3>
                        <p className="text-slate-300">Understand your personality type and how it influences your career preferences.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Complete the Skills Assessment</h3>
                        <p className="text-slate-300">Identify your key strengths and areas for development.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Explore Career Matches</h3>
                        <p className="text-slate-300">Review personalized career recommendations based on your assessments.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Get Personalized Guidance</h3>
                        <p className="text-slate-300">Chat with our AI career advisor for tailored advice and next steps.</p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="flex justify-center">
                    <Link href="/assessment">
                      <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        Start Your Journey
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 text-center"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Discover Your Ideal Career Path?</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Our personalized assessments and AI-powered guidance will help you find career options that match your unique personality, skills, and interests.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => setShowOptions(true)}
              >
                Explore Career Options
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}