"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import FormattedDate from '@/components/ui/formatted-date';
import { useRouter } from 'next/navigation';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  Brain, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Compass, 
  LogOut, 
  RefreshCw, 
  Rocket, 
  Settings, 
  Sparkles 
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  mbtiType: string | null;
  skillRatings: Record<string, number> | null;
  completedAt: string | null;
  image: string | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMbtiResult, setHasMbtiResult] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated') {
        try {
          // Try to get profile from API
          const response = await fetch('/api/user');
          const data = await response.json();
          
          if (data.user) {
            setProfile({
              name: data.user.name || session?.user?.name || 'User',
              email: data.user.email || session?.user?.email || '',
              mbtiType: data.user.mbtiResult || null,
              skillRatings: data.user.skillRatings || null,
              completedAt: data.user.completedAt || null,
              image: data.user.image || session?.user?.image || null,
            });
            
            // Set MBTI result state
            setHasMbtiResult(!!data.user.mbtiResult);
          } else {
            // Fallback to session data
            setProfile({
              name: session?.user?.name || 'User',
              email: session?.user?.email || '',
              mbtiType: null,
              skillRatings: null,
              completedAt: null,
              image: session?.user?.image || null,
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to session data
          setProfile({
            name: session?.user?.name || 'User',
            email: session?.user?.email || '',
            mbtiType: null,
            skillRatings: null,
            completedAt: null,
            image: session?.user?.image || null,
          });
        }
      } else if (status === 'unauthenticated') {
        // Check localStorage for guest data
        const mbtiResult = localStorage.getItem('mbtiResult');
        const skillRatingsStr = localStorage.getItem('skillRatings');
        
        setProfile({
          name: 'Guest User',
          email: '',
          mbtiType: mbtiResult,
          skillRatings: skillRatingsStr ? JSON.parse(skillRatingsStr) : null,
          completedAt: localStorage.getItem('assessmentCompleted') ? new Date().toISOString() : null,
          image: null,
        });
        
        // Set MBTI result state
        setHasMbtiResult(!!mbtiResult);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [session, status]);

  // Add the handleRetake function
  const handleRetake = (type: 'mbti' | 'skills') => {
    if (type === 'mbti') {
      localStorage.removeItem('mbtiResult');
      localStorage.removeItem('mbtiResponses');
    } else {
      localStorage.removeItem('skillRatings');
    }
    
    router.push(`/assessment?type=${type}`);
  };

  // Add the missing handleSignOut function
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Add the missing getAssessmentStatus function
  const getAssessmentStatus = () => {
    if (profile?.mbtiType && profile?.skillRatings) {
      return 'complete';
    } else if (profile?.mbtiType) {
      return 'mbti-only';
    } else {
      return 'none';
    }
  };

  // Calculate assessment status
  const assessmentStatus = getAssessmentStatus();
  
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 2; // MBTI and Skills
    
    if (profile?.mbtiType) completed++;
    if (profile?.skillRatings) completed++;
    
    return (completed / total) * 100;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="h-8 w-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-slate-300">Loading your profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        > */}
          {/* Header with background gradient */}
          <div className="relative mb-8 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-slate-900/60 to-purple-900/40"></div>
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
            
            <div className="relative z-10 px-6 py-12 md:py-16 flex flex-col md:flex-row items-center md:items-end gap-6">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                  <Avatar className="w-full h-full">
                    {profile?.image ? (
                      <AvatarImage src={profile.image} alt={profile.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl md:text-3xl">
                        {profile?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1.5 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="h-4 w-4 text-white" />
                </motion.div>
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {profile?.name}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mt-2 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-indigo-400" />
                      <span className="text-sm">{profile?.email || 'No email'}</span>
                    </div>
                    
                    {profile?.completedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm">
                          Last updated: <FormattedDate date={profile.completedAt} />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-4 flex flex-wrap justify-center md:justify-start gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {status === 'authenticated' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => signIn()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push('/assessment')}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Assessments
                  </Button>
                  
                  {assessmentStatus === 'complete' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/results')}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-indigo-400" />
                      Career Journey Progress
                    </h3>
                    <p className="text-sm text-slate-400">Complete all assessments to unlock your personalized career guidance</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${assessmentStatus === 'complete' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                        assessmentStatus === 'mbti-only' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                        'bg-slate-500/20 text-slate-300 border-slate-500/30'}
                    `}
                  >
                    {assessmentStatus === 'complete' ? 'Complete' : 
                     assessmentStatus === 'mbti-only' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-indigo-400 font-medium">{Math.round(getCompletionPercentage())}%</span>
                    </div>
                    <Progress 
                      value={getCompletionPercentage()} 
                      className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.mbtiType ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                        <Brain className="h-5 w-5" />
                        </div>
                      <div>
                        <h4 className="font-medium">Personality Assessment</h4>
                        <p className="text-sm text-slate-400">
                          {profile?.mbtiType ? (
                            <>MBTI Type: <span className="text-indigo-400 font-medium">{profile.mbtiType}</span></>
                          ) : (
                            "Discover your personality type"
                          )}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {profile?.mbtiType ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRetake('mbti')}
                            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Retake
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => router.push('/assessment?type=mbti')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Rocket className="h-3.5 w-3.5 mr-1.5" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.skillRatings ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Skills Assessment</h4>
                        <p className="text-sm text-slate-400">
                          {profile?.skillRatings ? (
                            <>Rated <span className="text-indigo-400 font-medium">{Object.keys(profile.skillRatings).length}</span> skills</>
                          ) : (
                            "Rate your professional skills"
                          )}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {profile?.skillRatings ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRetake('skills')}
                            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Retake
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => router.push('/assessment?type=skills')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Rocket className="h-3.5 w-3.5 mr-1.5" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main content tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600/20">
                  <User className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="assessments" className="data-[state=active]:bg-indigo-600/20">
                  <Award className="h-4 w-4 mr-2" />
                  Assessments
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-indigo-600/20">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-400" />
                      Profile Overview
                    </CardTitle>
                    <CardDescription>
                      Your personal information and assessment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Information */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Personal Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-indigo-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-400">Name</p>
                              <p className="font-medium">{profile?.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-indigo-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-400">Email</p>
                              <p className="font-medium">{profile?.email || 'Not provided'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Brain className="h-4 w-4 text-indigo-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-400">MBTI Personality Type</p>
                              {profile?.mbtiType ? (
                                <p className="font-medium">{profile.mbtiType}</p>
                              ) : (
                                <p className="text-sm text-slate-500">Not completed</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-indigo-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-slate-400">Last Assessment</p>
                              {profile?.completedAt ? (
                                <p className="font-medium"><FormattedDate date={profile.completedAt} /></p>
                              ) : (
                                <p className="text-sm text-slate-500">No assessments completed</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Assessment Status */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Assessment Status</h3>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium flex items-center gap-1.5">
                                <Brain className="h-4 w-4 text-indigo-400" />
                                Personality Assessment
                              </h4>
                              <Badge variant="outline" className={profile?.mbtiType ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}>
                                {profile?.mbtiType ? 'Completed' : 'Not Started'}
                              </Badge>
                            </div>
                            {profile?.mbtiType ? (
                              <p className="text-sm text-slate-300">Your personality type is <span className="text-indigo-400 font-medium">{profile.mbtiType}</span></p>
                            ) : (
                              <p className="text-sm text-slate-400">Take the MBTI assessment to discover your personality type</p>
                            )}
                          </div>
                          
                          <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4 text-indigo-400" />
                                Skills Assessment
                              </h4>
                              <Badge variant="outline" className={profile?.skillRatings ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}>
                                {profile?.skillRatings ? 'Completed' : 'Not Started'}
                              </Badge>
                            </div>
                            {profile?.skillRatings ? (
                              <p className="text-sm text-slate-300">You've rated <span className="text-indigo-400 font-medium">{Object.keys(profile.skillRatings).length}</span> professional skills</p>
                            ) : (
                              <p className="text-sm text-slate-400">Rate your skills to get personalized career recommendations</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => router.push('/assessment')}
                      disabled={assessmentStatus === 'complete'}
                    >
                      {assessmentStatus === 'complete' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          All Assessments Completed
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          {assessmentStatus === 'none' ? 'Start Assessments' : 'Continue Assessments'}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Career Recommendations Preview */}
                {assessmentStatus === 'complete' && (
                  <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-bl-full blur-xl"></div>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        Career Recommendations
                      </CardTitle>
                      <CardDescription>
                        Based on your personality type and skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
                        <p className="text-slate-300">
                          Your assessments indicate you might excel in careers that match your {profile?.mbtiType} personality type and utilize your top skills.
                        </p>
                        <div className="mt-4">
                          <Button 
                            variant="default" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            onClick={() => router.push('/results')}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            View Detailed Results
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="assessments" className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-400" />
                      Personality Assessment
                    </CardTitle>
                    <CardDescription>
                      Discover your MBTI personality type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.mbtiType ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border-2 border-indigo-500/50">
                            <span className="text-2xl font-bold text-indigo-300">{profile.mbtiType}</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-2">Your Personality Type</h3>
                          <p className="text-slate-400 text-sm">
                            Your MBTI type is <span className="text-indigo-400 font-medium">{profile.mbtiType}</span>. 
                            This personality type indicates your natural preferences in how you interact with the world.
                          </p>
                        </div>
                        
                        <div className="flex justify-center gap-3 mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => handleRetake('mbti')}
                            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retake Assessment
                          </Button>
                          
                          <Button 
                            variant="default" 
                            onClick={() => router.push('/results')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Brain className="h-8 w-8 text-slate-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Personality Assessment Not Started</h3>
                          <p className="text-slate-400 text-sm mb-4">
                            Take the MBTI assessment to discover your personality type and get personalized career recommendations.
                          </p>
                          <Button 
                            variant="default" 
                            onClick={() => router.push('/assessment?type=mbti')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Start Assessment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-indigo-400" />
                        Skills Assessment
                      </CardTitle>
                      <CardDescription>
                        Rate your professional skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile?.skillRatings ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(profile.skillRatings)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 6)
                              .map(([skill, rating]) => (
                                <div key={skill} className="p-3 rounded-lg bg-slate-800/70 border border-slate-700">
                                  <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium">{skill}</h4>
                                    <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                      {rating}/5
                                    </Badge>
                                  </div>
                                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                                    <div 
                                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
                                      style={{ width: `${(rating / 5) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          {Object.keys(profile.skillRatings).length > 6 && (
                            <div className="text-center">
                              <p className="text-sm text-slate-400 mb-2">
                                Showing top 6 of {Object.keys(profile.skillRatings).length} skills
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-center gap-3 mt-4">
                            <Button 
                              variant="outline" 
                              onClick={() => handleRetake('skills')}
                              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retake Assessment
                            </Button>
                            
                            <Button 
                              variant="default" 
                              onClick={() => router.push('/results')}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-8 w-8 text-slate-500" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Skills Assessment Not Started</h3>
                          <p className="text-slate-400 text-sm mb-4">
                            Rate your professional skills to get personalized career recommendations.
                          </p>
                          <Button 
                            variant="default" 
                            onClick={() => router.push('/assessment?type=skills')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Start Assessment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {assessmentStatus === 'complete' && (
                    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-bl-full blur-xl"></div>
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-indigo-400" />
                          Career Match Results
                        </CardTitle>
                        <CardDescription>
                          Your personalized career recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
                          <p className="text-slate-300 mb-4">
                            Based on your {profile?.mbtiType} personality type and skill ratings, we've generated personalized career recommendations for you.
                          </p>
                          <Button 
                            variant="default" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            onClick={() => router.push('/results')}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            View Detailed Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="resources" className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-400" />
                        Career Resources
                      </CardTitle>
                      <CardDescription>
                        Helpful resources for your career journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-indigo-500/30 transition-colors group">
                          <h3 className="font-medium flex items-center gap-2 mb-2 group-hover:text-indigo-400 transition-colors">
                            <Award className="h-4 w-4 text-indigo-400" />
                            Personality Insights
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">
                            Learn more about your MBTI personality type and how it relates to career choices.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            onClick={() => window.open('https://www.16personalities.com/', '_blank')}
                          >
                            Explore
                          </Button>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-indigo-500/30 transition-colors group">
                          <h3 className="font-medium flex items-center gap-2 mb-2 group-hover:text-indigo-400 transition-colors">
                            <Briefcase className="h-4 w-4 text-indigo-400" />
                            Skill Development
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">
                            Resources to help you develop and improve your professional skills.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            onClick={() => window.open('https://www.coursera.org/', '_blank')}
                          >
                            Explore
                          </Button>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-indigo-500/30 transition-colors group">
                          <h3 className="font-medium flex items-center gap-2 mb-2 group-hover:text-indigo-400 transition-colors">
                            <Compass className="h-4 w-4 text-indigo-400" />
                            Career Exploration
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">
                            Explore different career paths and job opportunities that match your profile.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            onClick={() => window.open('https://www.onetonline.org/', '_blank')}
                          >
                            Explore
                          </Button>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-indigo-500/30 transition-colors group">
                          <h3 className="font-medium flex items-center gap-2 mb-2 group-hover:text-indigo-400 transition-colors">
                            <Rocket className="h-4 w-4 text-indigo-400" />
                            Resume Building
                          </h3>
                          <p className="text-sm text-slate-400 mb-3">
                            Tools and tips for creating an effective resume that highlights your strengths.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                            onClick={() => window.open('https://www.resume.com/', '_blank')}
                          >
                            Explore
                          </Button>
                        </div>
                      </div>
                      
                      {profile?.mbtiType && (
                        <div className="mt-6">
                          <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
                            <h3 className="font-medium flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-indigo-400" />
                              Personalized Resources for {profile.mbtiType}
                            </h3>
                            <p className="text-sm text-slate-300 mb-3">
                              We've curated specific resources that are particularly helpful for people with your personality type.
                            </p>
                            <Button 
                              variant="default" 
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                              onClick={() => router.push(`/resources?type=${profile.mbtiType}`)}
                            >
                              View Personalized Resources
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        Upcoming Events
                      </CardTitle>
                      <CardDescription>
                        Career fairs, workshops, and networking opportunities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-lg text-center min-w-[60px]">
                              <div className="text-sm font-medium">JUN</div>
                              <div className="text-xl font-bold">15</div>
                            </div>
                            <div>
                              <h3 className="font-medium">Virtual Career Fair</h3>
                              <p className="text-sm text-slate-400 mt-1">
                                Connect with employers from various industries and explore job opportunities.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                                  Online
                                </Badge>
                                <span className="text-xs text-slate-500">10:00 AM - 4:00 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-500/20 text-purple-300 p-2 rounded-lg text-center min-w-[60px]">
                            <div className="text-sm font-medium">JUN</div>
                              <div className="text-xl font-bold">22</div>
                            </div>
                            <div>
                              <h3 className="font-medium">Resume Workshop</h3>
                              <p className="text-sm text-slate-400 mt-1">
                                Learn how to create a standout resume that highlights your skills and experience.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                                  Workshop
                                </Badge>
                                <span className="text-xs text-slate-500">2:00 PM - 4:00 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-slate-800/70 border border-slate-700">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-500/20 text-green-300 p-2 rounded-lg text-center min-w-[60px]">
                              <div className="text-sm font-medium">JUL</div>
                              <div className="text-xl font-bold">05</div>
                            </div>
                            <div>
                              <h3 className="font-medium">Networking Mixer</h3>
                              <p className="text-sm text-slate-400 mt-1">
                                Connect with professionals in your field and build valuable relationships.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
                                  In-Person
                                </Badge>
                                <span className="text-xs text-slate-500">6:00 PM - 8:00 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                          onClick={() => router.push('/events')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          View All Events
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </MainLayout>
      );
    }
  