"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { 
  ArrowRight, 
  Brain, 
  Briefcase, 
  CheckCircle, 
  ChevronRight, 
  Compass, 
  GraduationCap, 
  Lightbulb, 
  Rocket, 
  Sparkles, 
  Target 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [assessmentStatus, setAssessmentStatus] = useState({
    mbtiCompleted: false,
    skillsCompleted: false,
    preferencesCompleted: false
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check localStorage for assessment completion status
    const checkAssessmentStatus = () => {
      const mbtiResult = localStorage.getItem('mbtiResult');
      const mbtiCompleted = localStorage.getItem('mbtiCompleted');
      const skillRatings = localStorage.getItem('skillRatings');
      const skillsCompleted = localStorage.getItem('skillsCompleted');
      const personalPreferences = localStorage.getItem('personalPreferences');
      const preferencesCompleted = localStorage.getItem('preferencesCompleted');
      
      setAssessmentStatus({
        mbtiCompleted: !!mbtiResult || mbtiCompleted === 'true',
        skillsCompleted: !!skillRatings || skillsCompleted === 'true',
        preferencesCompleted: !!personalPreferences || preferencesCompleted === 'true'
      });
      
      setLoading(false);
    };
    
    // If user is authenticated, fetch from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setAssessmentStatus({
              mbtiCompleted: !!data.user.mbtiResult || !!data.user.mbtiCompleted,
              skillsCompleted: !!data.user.skillRatings || !!data.user.skillsCompleted,
              preferencesCompleted: !!data.user.personalPreferences || !!data.user.preferencesCompleted
            });
          } else {
            // Fallback to localStorage if no user data
            checkAssessmentStatus();
          }
        } else {
          // Fallback to localStorage if API fails
          checkAssessmentStatus();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage if API fails
        checkAssessmentStatus();
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchUserData();
    } else {
      checkAssessmentStatus();
    }
  }, [status]);

  // Calculate overall progress
  const totalSteps = 3; // MBTI, Skills, Preferences
  const completedSteps = 
    (assessmentStatus.mbtiCompleted ? 1 : 0) + 
    (assessmentStatus.skillsCompleted ? 1 : 0) + 
    (assessmentStatus.preferencesCompleted ? 1 : 0);
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <MainLayout>
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/30 pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col space-y-6"
              >
                <Badge className="w-fit bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                  Career Guidance Platform
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Discover Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Ideal Career Path</span>
                </h1>
                
                <p className="text-xl text-slate-300 max-w-xl">
                  Take our interactive assessments to find careers that match your personality, skills, and interests.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-500/20"
                    onClick={() => router.push('/assessment')}
                  >
                    Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800 transition-colors"
                    onClick={() => status === 'authenticated' ? router.push('/profile') : router.push('/auth/signin')}
                  >
                    {status === 'authenticated' ? 'View Profile' : 'Sign In'}
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-indigo-300" />
                      </div>
                      <h3 className="font-medium text-lg">Personality</h3>
                      <p className="text-sm text-slate-400">Discover your MBTI type</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-300" />
                      </div>
                      <h3 className="font-medium text-lg">Skills</h3>
                      <p className="text-sm text-slate-400">Identify your strengths</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-blue-300" />
                      </div>
                      <h3 className="font-medium text-lg">Preferences</h3>
                      <p className="text-sm text-slate-400">Share your interests</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-green-300" />
                      </div>
                      <h3 className="font-medium text-lg">Guidance</h3>
                      <p className="text-sm text-slate-400">Get career matches</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Journey to Career Clarity
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Our comprehensive assessment process helps you discover career paths that align with who you are.
              </p>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
                <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
                  <Compass className="mr-2 h-4 w-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="process" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                  <Target className="mr-2 h-4 w-4" /> Process
                </TabsTrigger>
                <TabsTrigger value="benefits" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                  <Sparkles className="mr-2 h-4 w-4" /> Benefits
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                      <Brain className="h-6 w-6 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Personality Insights</h3>
                    <p className="text-slate-400">
                      Discover how your personality traits influence your career preferences and work style.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-purple-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Skills Analysis</h3>
                    <p className="text-slate-400">
                      Identify your strongest skills and learn how they align with different career paths.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <Rocket className="h-6 w-6 text-green-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
                    <p className="text-slate-400">
                      Get personalized career recommendations and learning resources based on your profile.
                    </p>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="process" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <ol className="space-y-6">
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-indigo-500/30">
                          <span className="font-semibold text-indigo-300">1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-indigo-300 mb-2">Take the Personality Assessment</h3>
                          <p className="text-slate-300">Discover your MBTI personality type and how it influences your career preferences.</p>
                          </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-purple-500/30">
                          <span className="font-semibold text-purple-300">2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-purple-300 mb-2">Complete the Skills Assessment</h3>
                          <p className="text-slate-300">Rate your proficiency in various skills to identify your strengths and areas for growth.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-blue-500/30">
                          <span className="font-semibold text-blue-300">3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-blue-300 mb-2">Share Your Preferences</h3>
                          <p className="text-slate-300">Tell us about your work environment preferences, interests, and career goals.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-green-500/30">
                          <span className="font-semibold text-green-300">4</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-green-300 mb-2">Receive Personalized Recommendations</h3>
                          <p className="text-slate-300">Get AI-powered career suggestions that match your unique profile and preferences.</p>
                        </div>
                      </li>
                    </ol>
                    
                    <div className="flex justify-center mt-8">
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        onClick={() => router.push('/assessment')}
                      >
                        Begin Your Journey <Rocket className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                        <Compass className="h-6 w-6 text-blue-300" />
                      </div>
                      <CardTitle>Self-Discovery</CardTitle>
                      <CardDescription>Gain deeper insights into your personality and strengths</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Understand your MBTI personality type</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Identify your key strengths and talents</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Recognize your work style preferences</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                    <CardHeader>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                        <Target className="h-6 w-6 text-purple-300" />
                      </div>
                      <CardTitle>Career Clarity</CardTitle>
                      <CardDescription>Find direction in your professional journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Discover careers that match your profile</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Explore industries where you'll thrive</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Make confident career decisions</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
                    <CardHeader>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                        <GraduationCap className="h-6 w-6 text-green-300" />
                      </div>
                      <CardTitle>Growth Opportunities</CardTitle>
                      <CardDescription>Identify paths for professional development</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Find skill gaps to address</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Discover relevant learning resources</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Create a personalized development plan</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                    <CardHeader>
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
                        <Briefcase className="h-6 w-6 text-amber-300" />
                      </div>
                      <CardTitle>Job Satisfaction</CardTitle>
                      <CardDescription>Find fulfillment in your professional life</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Align career with personal values</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Find work environments where you'll thrive</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                          <span className="text-slate-300">Increase long-term career satisfaction</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/30 to-transparent pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto max-w-7xl relative">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors">
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Users Say
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Hear from people who found their ideal career path using our platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-indigo-300">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-slate-400">Software Engineer</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "The personality assessment confirmed my technical inclinations and helped me pivot from marketing to software development. Now I'm in a career I truly love!"
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-purple-300">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-slate-400">UX Designer</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "I was stuck in a career that didn't fulfill me. The skills assessment revealed my creative strengths, leading me to UX design where I can blend creativity with problem-solving."
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl font-bold text-green-300">J</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Jessica Patel</h4>
                    <p className="text-sm text-slate-400">Data Scientist</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "The career guidance helped me discover data science as the perfect intersection of my analytical skills and desire to make an impact. The roadmap provided was invaluable."
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-900/50 via-slate-900/70 to-purple-900/50 p-8 md:p-12 rounded-3xl border border-indigo-500/20 shadow-xl backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                    Get Started Today
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Perfect Career?</span>
                  </h2>
                  <p className="text-slate-300 mb-6 text-lg">
                    Take the first step toward a more fulfilling professional life with our comprehensive career assessment.
                    </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-500/20"
                      onClick={() => router.push('/assessment')}
                    >
                      Start Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 transition-colors"
                      onClick={() => router.push('/about')}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-indigo-300" />
                        </div>
                        <p className="text-slate-300">Personalized career recommendations</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-purple-300" />
                        </div>
                        <p className="text-slate-300">Detailed personality insights</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-blue-300" />
                        </div>
                        <p className="text-slate-300">Skills assessment and development plan</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                        </div>
                        <p className="text-slate-300">AI-powered career guidance</p>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    {!loading && (
                      <div className="mt-6 pt-6 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Your progress</span>
                          <span className="text-sm font-medium text-indigo-300">{progressPercentage}% Complete</span>
                        </div>
                        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${assessmentStatus.mbtiCompleted ? 'bg-green-400' : 'bg-slate-600'}`} />
                            <span className="text-xs text-slate-400">Personality</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${assessmentStatus.skillsCompleted ? 'bg-green-400' : 'bg-slate-600'}`} />
                            <span className="text-xs text-slate-400">Skills</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${assessmentStatus.preferencesCompleted ? 'bg-green-400' : 'bg-slate-600'}`} />
                            <span className="text-xs text-slate-400">Preferences</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 relative">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors">
                Common Questions
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Find answers to common questions about our career guidance platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">How long does the assessment take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    The complete assessment process takes approximately 15-20 minutes. You can save your progress and return later if needed.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Is my data kept private?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Yes, we take privacy seriously. Your assessment data is stored securely and never shared with third parties without your consent.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">How accurate are the career recommendations?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Our recommendations are based on established career development frameworks and AI analysis of thousands of career paths. They provide strong guidance, but final decisions should always be yours.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Do I need to create an account?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    You can take the assessments without an account, but creating one allows you to save your results, track your progress, and receive personalized guidance over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 md:py-16 relative border-t border-slate-800">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Career Guidance Platform
                </h3>
                <p className="text-slate-400 mb-4 max-w-md">
                  Helping you discover and pursue a fulfilling career path through personalized assessments and AI-powered guidance.
                </p>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-slate-200">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/assessment" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Assessments
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-slate-400 hover:text-slate-300 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Career Blog
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-slate-200">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/contact" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-slate-400 hover:text-slate-300 transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-slate-400 hover:text-slate-300 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Career Guidance Platform. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link href="/privacy" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                  Cookies
                </Link>
                </div>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}