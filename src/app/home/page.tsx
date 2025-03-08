"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  GraduationCap, 
  Brain, 
  Sparkles, 
  Target, 
  ChevronRight, 
  Rocket,
  Lightbulb,
  Compass,
  BarChart
} from 'lucide-react';

function HomeContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [assessmentProgress, setAssessmentProgress] = useState({
    personality: 0,
    skills: 0,
    preferences: 0
  });
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    
    // Check assessment progress from localStorage
    const mbtiCompleted = localStorage.getItem('mbtiCompleted') === 'true';
    const skillsCompleted = localStorage.getItem('skillsCompleted') === 'true';
    const preferencesCompleted = localStorage.getItem('preferencesCompleted') === 'true';
    
    setAssessmentProgress({
      personality: mbtiCompleted ? 100 : 0,
      skills: skillsCompleted ? 100 : 0,
      preferences: preferencesCompleted ? 100 : 0
    });
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-blue-600/10 z-0"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Card className="border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                    Career Guidance Platform
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                    Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">{session?.user?.name || 'Explorer'}</span>
                  </h1>
                  <p className="text-slate-300 mb-6 text-lg">
                    Discover your ideal career path with personalized assessments and AI-powered guidance.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-500/20"
                      onClick={() => setActiveTab("discover")}
                    >
                      Explore Options <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-slate-700 hover:bg-slate-800 transition-colors"
                      onClick={() => router.push('/assessment')}
                    >
                      Start Assessment
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block relative h-full min-h-[300px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-l-3xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative w-64 h-64"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Compass className="h-24 w-24 text-indigo-300" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="discover" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300">
              <Compass className="mr-2 h-4 w-4" /> Discover
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <BarChart className="mr-2 h-4 w-4" /> Progress
            </TabsTrigger>
            <TabsTrigger value="next-steps" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <Rocket className="mr-2 h-4 w-4" /> Next Steps
            </TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Compass className="mr-2 h-6 w-6 text-indigo-400" /> Career Exploration Options
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-500/30 transition-colors">
                      <Brain className="h-6 w-6 text-indigo-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-indigo-300 transition-colors">Personality Assessment</CardTitle>
                    <CardDescription>Discover your MBTI personality type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">Understand how your personality traits align with different career paths.</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-500/80 to-indigo-600/80 group-hover:from-indigo-500 group-hover:to-indigo-600"
                      onClick={() => router.push('/assessment?type=mbti')}
                    >
                      Start Assessment
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                      <Target className="h-6 w-6 text-purple-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-300 transition-colors">Skills Assessment</CardTitle>
                    <CardDescription>Identify your strengths and growth areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">Evaluate your technical, soft, and specialized skills to find matching careers.</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500/80 to-purple-600/80 group-hover:from-purple-500 group-hover:to-purple-600"
                      onClick={() => router.push('/assessment?type=skills')}
                    >
                      Discover Skills
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors">
                      <Sparkles className="h-6 w-6 text-blue-300" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-300 transition-colors">Career Consultation</CardTitle>
                    <CardDescription>Get personalized AI guidance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">Chat with our AI career advisor for tailored advice and recommendations.</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 group-hover:from-blue-500 group-hover:to-blue-600"
                      onClick={() => router.push('/consultation')}
                    >
                      Start Consultation
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-purple-400" /> Your Assessment Progress
              </h2>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                      <h3 className="text-lg font-semibold mb-3 text-indigo-300 flex items-center">
                        <Brain className="mr-2 h-5 w-5" /> Personality
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                          {assessmentProgress.personality}%
                        </div>
                        <div className="flex-1">
                          <Progress value={assessmentProgress.personality} className="h-2.5 bg-slate-700">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all" 
                              style={{ width: `${assessmentProgress.personality}%` }}
                            />
                          </Progress>
                          <p className="text-xs text-slate-400 mt-1">
                            {assessmentProgress.personality === 100 ? "Completed" : "Not started"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                      <h3 className="text-lg font-semibold mb-3 text-purple-300 flex items-center">
                        <Target className="mr-2 h-5 w-5" /> Skills
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                          {assessmentProgress.skills}%
                        </div>
                        <div className="flex-1">
                          <Progress value={assessmentProgress.skills} className="h-2.5 bg-slate-700">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all" 
                              style={{ width: `${assessmentProgress.skills}%` }}
                            />
                          </Progress>
                          <p className="text-xs text-slate-400 mt-1">
                            {assessmentProgress.skills === 100 ? "Completed" : "Not started"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                      <h3 className="text-lg font-semibold mb-3 text-blue-300 flex items-center">
                        <Lightbulb className="mr-2 h-5 w-5" /> Preferences
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                          {assessmentProgress.preferences}%
                        </div>
                        <div className="flex-1">
                          <Progress value={assessmentProgress.preferences} className="h-2.5 bg-slate-700">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all" 
                              style={{ width: `${assessmentProgress.preferences}%` }}
                            />
                          </Progress>
                          <p className="text-xs text-slate-400 mt-1">
                            {assessmentProgress.preferences === 100 ? "Completed" : "Not started"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {(assessmentProgress.personality === 100 && 
                      assessmentProgress.skills === 100 && 
                      assessmentProgress.preferences === 100) ? (
                      <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30 mb-4">
                        <p className="text-green-300 flex items-center justify-center">
                          <Sparkles className="mr-2 h-5 w-5" /> 
                          All assessments completed! View your personalized career guidance.
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-300 mb-4">Complete all assessments to unlock your personalized career guidance!</p>
                    )}
                    
                    <Button 
                      onClick={() => router.push('/assessment')}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      {(assessmentProgress.personality === 100 && 
                        assessmentProgress.skills === 100 && 
                        assessmentProgress.preferences === 100) ? 
                        "View Results" : "Continue Assessments"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Next Steps Tab */}
          <TabsContent value="next-steps" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Rocket className="mr-2 h-6 w-6 text-blue-400" /> Recommended Next Steps
              </h2>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    <ol className="space-y-6 mb-6">
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-indigo-500/30">
                          <span className="font-semibold text-indigo-300">1</span>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 flex-1">
                          <h3 className="font-semibold text-lg text-indigo-300 mb-2 flex items-center">
                            <Brain className="mr-2 h-5 w-5" /> Take the Personality Assessment
                          </h3>
                          <p className="text-slate-300 mb-3">Understand your personality type and how it influences your career preferences.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300"
                            onClick={() => router.push('/assessment?type=mbti')}
                          >
                            Start Assessment <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-purple-500/30">
                          <span className="font-semibold text-purple-300">2</span>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 flex-1">
                          <h3 className="font-semibold text-lg text-purple-300 mb-2 flex items-center">
                            <Target className="mr-2 h-5 w-5" /> Complete the Skills Assessment
                          </h3>
                          <p className="text-slate-300 mb-3">Identify your key strengths and areas for development to match with suitable careers.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-purple-500/30 hover:bg-purple-500/20 text-purple-300"
                            onClick={() => router.push('/assessment?type=skills')}
                          >
                            Start Assessment <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-blue-500/30">
                          <span className="font-semibold text-blue-300">3</span>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 flex-1">
                          <h3 className="font-semibold text-lg text-blue-300 mb-2 flex items-center">
                            <Lightbulb className="mr-2 h-5 w-5" /> Share Your Preferences
                          </h3>
                          <p className="text-slate-300 mb-3">Tell us about your work environment preferences and career interests.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-blue-500/30 hover:bg-blue-500/20 text-blue-300"
                            onClick={() => router.push('/assessment?type=preferences')}
                          >
                            Start Assessment <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-green-500/30">
                          <span className="font-semibold text-green-300">4</span>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 flex-1">
                          <h3 className="font-semibold text-lg text-green-300 mb-2 flex items-center">
                            <Sparkles className="mr-2 h-5 w-5" /> Explore Career Matches
                          </h3>
                          <p className="text-slate-300 mb-3">Review personalized career recommendations based on your assessment results.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-500/30 hover:bg-green-500/20 text-green-300"
                            onClick={() => router.push('/results')}
                          >
                            View Results <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-amber-500/30">
                          <span className="font-semibold text-amber-300">5</span>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 flex-1">
                          <h3 className="font-semibold text-lg text-amber-300 mb-2 flex items-center">
                            <Briefcase className="mr-2 h-5 w-5" /> Get Personalized Guidance
                          </h3>
                          <p className="text-slate-300 mb-3">Chat with our AI career advisor for tailored advice and next steps in your career journey.</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-amber-500/30 hover:bg-amber-500/20 text-amber-300"
                            onClick={() => router.push('/consultation')}
                          >
                            Start Consultation <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    </ol>
                  </ScrollArea>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      onClick={() => router.push('/assessment')}
                    >
                      Begin Your Journey <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </MainLayout>
  );
}