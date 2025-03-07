"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // If authenticated, redirect directly to home dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      // Check if user has seen welcome screen
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      
      if (hasSeenWelcome) {
        router.push('/home');
      } else {
        router.push('/welcome');
      }
    }
  }, [status, router]);
  
  // Show loading state while checking authentication
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
  
  // Show landing page for unauthenticated users
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden py-10 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Discover Your Perfect Career Path
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Our AI-powered assessment helps you find the career that matches your personality and skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => router.push('/auth/signin?callbackUrl=/home')}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">95%</div>
              <p className="text-sm md:text-base text-slate-300">User Satisfaction</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">500+</div>
              <p className="text-sm md:text-base text-slate-300">Career Paths</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">10K+</div>
              <p className="text-sm md:text-base text-slate-300">Users Helped</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">AI</div>
              <p className="text-sm md:text-base text-slate-300">Powered Insights</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Core Features</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive tools to guide your career journey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full mb-6 flex items-center justify-center">
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Personality Assessment</h2>
            <p className="text-slate-300 mb-6">
              Take our comprehensive personality assessment to discover your unique traits and strengths.
            </p>
            <Button 
              variant="gradient" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => router.push('/auth/signin?callbackUrl=/assessment')}
            >
              Start Assessment
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full mb-6 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Career Consultation</h2>
            <p className="text-slate-300 mb-6">
              Get personalized career advice based on your assessment results and skills.
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/auth/signin?callbackUrl=/consultation')}
            >
              Get Advice
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full mb-6 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Skills Analysis</h2>
            <p className="text-slate-300 mb-6">
              Identify your key strengths and areas for improvement with our detailed skills analysis.
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/auth/signin?callbackUrl=/skills')}
            >
              Analyze Skills
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Career?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have discovered their ideal career path with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => router.push('/auth/signin?callbackUrl=/home')}
              >
                Get Started Now
              </Button>
            </div>
            <p className="text-slate-400 mt-6">
              No credit card required. Start your journey today.
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}