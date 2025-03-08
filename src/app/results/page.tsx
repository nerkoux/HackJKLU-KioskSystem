"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CareerRoadmap from '@/components/results/career-roadmap';
import { useSession } from 'next-auth/react';
import { getMBTIPersonalityInfo } from '@/lib/mbti-data';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, 
  GraduationCap, 
  Lightbulb, 
  Brain, 
  BarChart, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  User,
  Share2,
  Download,
  Star,
  BookOpen,
  Sparkles
} from "lucide-react";
import confetti from 'canvas-confetti';

// Define the MBTI personality info interface
interface MBTIPersonalityInfo {
  title: string;
  description: string;
  strengths: string[];
  careers: string[];
}

// Helper function to format career guidance text
const formatCareerGuidance = (text: string | null) => {
  if (!text) return '';
  
  // Remove the input prompt part (everything before "1. Best Career Paths")
  let formatted = text;
  const responseStartIndex = formatted.indexOf("1. Best Career Paths");
  
  if (responseStartIndex > -1) {
    formatted = formatted.substring(responseStartIndex);
  }
  
  // Clean up any remaining artifacts from the prompt
  formatted = formatted.replace(/\$__parent:[\s\S]*?\/5\./g, '');
  formatted = formatted.replace(/Based on this:[\s\S]*?Provide structured recommendations\./g, '');
  
  // Fix numbered lists formatting
  formatted = formatted.replace(/(\d+)\.\s*([A-Z])/g, '$1. $2');
  
  // Fix lettered lists formatting
  formatted = formatted.replace(/([a-z])\)\s*/g, '$1) ');
  
  // Ensure proper paragraph breaks
  formatted = formatted.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  
  // Remove any extra newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted;
};

// Convert the formatted guidance to proper markdown
const createMarkdownContent = (formattedGuidance: string) => {
  return `
## 1. Best Career Paths Suited to Your Skill Set

${formattedGuidance
  .replace(/a\) /g, '- **')
  .replace(/b\) /g, '- **')
  .replace(/c\) /g, '- **')
  .replace(/d\) /g, '- **')
  .replace(/e\) /g, '- **')
  .replace(/f\) /g, '- **')
  .replace(/g\) /g, '- **')
  .replace(/h\) /g, '- **')
  .replace(/: /g, ':** ')
  .replace(/\. /g, '.\n\n')}
`;
};

export default function ResultsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [careerGuidance, setCareerGuidance] = useState<string | null>(null);
  const [learningResources, setLearningResources] = useState<any[]>([]);
  const [isGeneratingGuidance, setIsGeneratingGuidance] = useState(false);
  const [personalityInfo, setPersonalityInfo] = useState<MBTIPersonalityInfo | null>(null);
  const [activeTab, setActiveTab] = useState("personality");
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedSections, setRevealedSections] = useState({
    personality: false,
    careers: false,
    skills: false,
    preferences: false,
    guidance: false,
    resources: false
  });
  
  // Trigger confetti effect when results are loaded
  useEffect(() => {
    if (mbtiResult && !loading && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Reveal sections one by one with delays
      const revealSequence = async () => {
        setRevealedSections(prev => ({ ...prev, personality: true }));
        await new Promise(r => setTimeout(r, 600));
        setRevealedSections(prev => ({ ...prev, preferences: true }));
        await new Promise(r => setTimeout(r, 600));
        setRevealedSections(prev => ({ ...prev, careers: true }));
        await new Promise(r => setTimeout(r, 600));
        setRevealedSections(prev => ({ ...prev, skills: true }));
        await new Promise(r => setTimeout(r, 600));
        setRevealedSections(prev => ({ ...prev, guidance: true }));
        await new Promise(r => setTimeout(r, 600));
        setRevealedSections(prev => ({ ...prev, resources: true }));
      };
      revealSequence();
    }
  }, [mbtiResult, loading]);
  
  useEffect(() => {
    // Don't try to load data until we know the session status
    if (status === 'loading') return;
    
    const loadUserData = async () => {
      try {
        // First try to get data from localStorage
        const localMbtiResult = localStorage.getItem('mbtiResult');
        const localSkillRatings = localStorage.getItem('skillRatings');
        
        let hasLocalData = false;
        
        if (localMbtiResult) {
          setMbtiResult(localMbtiResult);
          // Set personality info based on MBTI result
          setPersonalityInfo(getMBTIPersonalityInfo(localMbtiResult));
          hasLocalData = true;
        }
        
        if (localSkillRatings) {
          setSkillRatings(JSON.parse(localSkillRatings));
          hasLocalData = true;
        }
        
        // In the loadUserData function, update the API fetch section:
        if (session?.user?.email) {
          try {
            const response = await fetch(`/api/user-results?email=${encodeURIComponent(session.user.email)}`);
            
            if (!response.ok) {
              console.warn(`Server responded with status: ${response.status}`);
              // If the API returns 404, try the fallback API
              if (response.status === 404) {
                // Try the regular user API as fallback
                const fallbackResponse = await fetch('/api/user');
                if (fallbackResponse.ok) {
                  const fallbackData = await fallbackResponse.json();
                  if (fallbackData.user) {
                    if (fallbackData.user.mbtiResult) {
                      setMbtiResult(fallbackData.user.mbtiResult);
                      setPersonalityInfo(getMBTIPersonalityInfo(fallbackData.user.mbtiResult));
                      localStorage.setItem('mbtiResult', fallbackData.user.mbtiResult);
                      hasLocalData = true;
                    }
                    
                    if (fallbackData.user.skillRatings) {
                      setSkillRatings(fallbackData.user.skillRatings);
                      localStorage.setItem('skillRatings', JSON.stringify(fallbackData.user.skillRatings));
                      hasLocalData = true;
                    }
                    
                    // Load career guidance if available
                    if (fallbackData.user.careerGuidance) {
                      setCareerGuidance(fallbackData.user.careerGuidance);
                    } else if (fallbackData.user.mbtiResult && fallbackData.user.skillRatings) {
                      // Generate career guidance if not available
                      generateCareerGuidance(fallbackData.user.mbtiResult, fallbackData.user.skillRatings);
                    }
                    
                    // Load learning resources if available
                    if (fallbackData.user.learningResources) {
                      setLearningResources(fallbackData.user.learningResources);
                    }
                  }
                }
              }
              // Don't throw error here, continue with local data if available
            } else {
              const data = await response.json();
              
              if (data.mbtiType) {
                setMbtiResult(data.mbtiType);
                setPersonalityInfo(getMBTIPersonalityInfo(data.mbtiType));
                localStorage.setItem('mbtiResult', data.mbtiType);
                hasLocalData = true;
              }
              
              if (data.skillRatings) {
                setSkillRatings(data.skillRatings);
                localStorage.setItem('skillRatings', JSON.stringify(data.skillRatings));
                hasLocalData = true;
              }
              
              // Load career guidance if available
              if (data.careerGuidance) {
                setCareerGuidance(data.careerGuidance);
              } else if (data.mbtiType && data.skillRatings) {
                // Generate career guidance if not available
                generateCareerGuidance(data.mbtiType, data.skillRatings);
              }
              
              // Load learning resources if available
              if (data.learningResources) {
                setLearningResources(data.learningResources);
              }
            }
          } catch (error) {
            console.error("Error fetching user data from server:", error);
            // Don't set error state here, as we might have local data
          }
        }
        
        // If we don't have any data, set error state
        if (!hasLocalData) {
          setError("No assessment data found. Please complete the assessment first.");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("An error occurred while loading your results. Please try again later.");
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [session, status]);
  
  // Generate career guidance function
  const generateCareerGuidance = async (mbtiType: string, skills: Record<string, number>) => {
    if (!mbtiType || !skills || Object.keys(skills).length === 0) return;
    
    setIsGeneratingGuidance(true);
    
    try {
      // Check if we have cached guidance first
      const cachedGuidance = localStorage.getItem('careerGuidance');
      const cachedTimestamp = localStorage.getItem('careerGuidanceTimestamp');
      
      // Check if cached guidance is still valid (less than 24 hours old)
      const isValidCache = cachedGuidance && cachedTimestamp && 
        (Date.now() - parseInt(cachedTimestamp)) < 24 * 60 * 60 * 1000;
      
      if (isValidCache) {
        setCareerGuidance(cachedGuidance);
        setIsGeneratingGuidance(false);
        return;
      }
      
      // Get skills and preferences data
      const skillRatingsData = localStorage.getItem('skillRatings');
      const preferencesData = localStorage.getItem('personalPreferences');
      
      let skills = {};
      let preferences = null;
      
      if (skillRatingsData) {
        skills = JSON.parse(skillRatingsData);
      }
      
      if (preferencesData) {
        preferences = JSON.parse(preferencesData);
      }
      
      // Call API with MBTI, skills, and preferences
      const response = await fetch('/api/career-guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbtiType,
          skills,
          preferences
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.careerGuidance) {
        setCareerGuidance(data.careerGuidance);
        
        // Cache the guidance
        localStorage.setItem('careerGuidance', data.careerGuidance);
        localStorage.setItem('careerGuidanceTimestamp', Date.now().toString());
      }
      
      // Set learning resources if available
      if (data.learningResources && Array.isArray(data.learningResources)) {
        setLearningResources(data.learningResources);
        localStorage.setItem('learningResources', JSON.stringify(data.learningResources));
      }
    } catch (error) {
      console.error("Error generating career guidance:", error);
      // Try to use cached guidance as fallback if available
      const cachedGuidance = localStorage.getItem('careerGuidance');
      if (cachedGuidance) {
        setCareerGuidance(cachedGuidance);
      }
    } finally {
      setIsGeneratingGuidance(false);
    }
  };
  
  // Render personality type card with gamified elements
  const renderPersonalityCard = () => {
    if (!personalityInfo || !mbtiResult) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealedSections.personality ? 1 : 0, y: revealedSections.personality ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                      {mbtiResult}
                    </span> - {personalityInfo.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-300">
                    Your Personality Type
                  </CardDescription>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share2 className="w-5 h-5 text-slate-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share your results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-slate-300 leading-relaxed mb-4">{personalityInfo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                      Your Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {personalityInfo.strengths.map((strength, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.4 }}
                          className="flex items-start"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-purple-400 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Recommended Careers
                    </h4>
                    <ul className="space-y-2">
                      {personalityInfo.careers.map((career, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.4 }}
                          className="flex items-start"
                        >
                          <Star className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{career}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Your Personality Traits
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Introversion</span>
                      <span className="text-sm text-slate-400">Extraversion</span>
                    </div>
                    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${mbtiResult?.includes('E') ? 'bg-blue-500' : 'bg-purple-500'}`}
                        style={{ width: mbtiResult?.includes('E') ? '75%' : '25%', left: mbtiResult?.includes('E') ? '25%' : '0' }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{mbtiResult?.includes('E') ? 'E' : 'I'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Sensing</span>
                      <span className="text-sm text-slate-400">Intuition</span>
                    </div>
                    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${mbtiResult?.includes('N') ? 'bg-blue-500' : 'bg-purple-500'}`}
                        style={{ width: mbtiResult?.includes('N') ? '75%' : '25%', left: mbtiResult?.includes('N') ? '25%' : '0' }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{mbtiResult?.includes('N') ? 'N' : 'S'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Thinking</span>
                      <span className="text-sm text-slate-400">Feeling</span>
                    </div>
                    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${mbtiResult?.includes('F') ? 'bg-blue-500' : 'bg-purple-500'}`}
                        style={{ width: mbtiResult?.includes('F') ? '75%' : '25%', left: mbtiResult?.includes('F') ? '25%' : '0' }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{mbtiResult?.includes('F') ? 'F' : 'T'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Judging</span>
                      <span className="text-sm text-slate-400">Perceiving</span>
                    </div>
                    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${mbtiResult?.includes('P') ? 'bg-blue-500' : 'bg-purple-500'}`}
                        style={{ width: mbtiResult?.includes('P') ? '75%' : '25%', left: mbtiResult?.includes('P') ? '25%' : '0' }}
                      ></div>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{mbtiResult?.includes('P') ? 'P' : 'J'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-slate-700 pt-4">
            <Button variant="outline" size="sm" className="text-slate-400 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };
  
  // Render top skills card
  const renderSkillsCard = () => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return null;
    
    // Get top 5 skills
    const topSkills = Object.entries(skillRatings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealedSections.skills ? 1 : 0, y: revealedSections.skills ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-green-400" />
              Your Top Skills
            </CardTitle>
            <CardDescription>
              Based on your self-assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSkills.map(([skill, rating], index) => (
                <motion.div 
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">{skill}</span>
                    <span className="text-sm text-slate-400">{rating}/5</span>
                  </div>
                  <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${(rating / 5) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + (0.1 * index) }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // Add this to the state declarations at the top of the component
  const [personalPreferences, setPersonalPreferences] = useState<any>(null);
  
  // Add this function to render personal preferences
  const renderPreferencesCard = () => {
    if (!personalPreferences) return null;
    
    const { interests, values, philosophy, careerGoals, customSkills } = personalPreferences;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealedSections.personality ? 1 : 0, y: revealedSections.personality ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-400" />
              Your Personal Preferences
            </CardTitle>
            <CardDescription>
              Your interests, values, and career goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {interests && interests.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-3 text-blue-400">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full"
                      >
                        {interest}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {values && values.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-3 text-blue-400">Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full"
                      >
                        {value}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {philosophy && (
                <div>
                  <h4 className="text-md font-semibold mb-2 text-blue-400">Work Philosophy</h4>
                  <p className="text-slate-300">{philosophy}</p>
                </div>
              )}
              
              {careerGoals && (
                <div>
                  <h4 className="text-md font-semibold mb-2 text-blue-400">Career Goals</h4>
                  <p className="text-slate-300">{careerGoals}</p>
                </div>
              )}
              
              {customSkills && customSkills.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-3 text-blue-400">Skills to Develop</h4>
                  <div className="flex flex-wrap gap-2">
                    {customSkills.map((skill: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // Render career guidance section
  const renderCareerGuidance = () => {
    if (isGeneratingGuidance) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Lightbulb className="w-5 h-5 mr-2 text-blue-400" />
                AI Career Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <p>Generating personalized career guidance...</p>
            </CardContent>
          </Card>
        </motion.div>
      );
    }
    
    if (!careerGuidance) return null;
    
    const formattedGuidance = formatCareerGuidance(careerGuidance);
    const markdownContent = createMarkdownContent(formattedGuidance);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealedSections.guidance ? 1 : 0, y: revealedSections.guidance ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  AI Career Guidance
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your MBTI type and skills
                </CardDescription>
              </div>
              <div className="bg-yellow-500/10 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => (
                      <motion.h4 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-semibold mt-6 mb-3 text-blue-400 flex items-center"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />{props.children}
                      </motion.h4>
                    ),
                    h3: ({node, ...props}) => (
                      <motion.h5 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-md font-semibold mt-4 mb-2 text-purple-300 flex items-center"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />{props.children}
                      </motion.h5>
                    ),
                    p: ({node, ...props}) => <p className="mb-4 text-slate-300">{props.children}</p>,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2">{props.children}</ul>,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2">{props.children}</ol>,
                    li: ({node, ...props}) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-300"
                      >
                        {props.children}
                      </motion.li>
                    ),
                    strong: ({node, ...props}) => <strong className="font-bold text-white">{props.children}</strong>,
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // Render learning resources section
  const renderLearningResources = () => {
    if (!learningResources || learningResources.length === 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealedSections.resources ? 1 : 0, y: revealedSections.resources ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
                <Card className="border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-400" />
                  Recommended Learning Resources
                </CardTitle>
                <CardDescription>
                  Curated resources to help you develop skills for your career path
                </CardDescription>
              </div>
              <div className="bg-purple-500/10 p-2 rounded-full">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card className="bg-slate-700/50 hover:bg-slate-700/80 transition-colors border-slate-600 h-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-medium">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-slate-300 mb-3">{resource.description}</p>
                      <div className="flex items-center text-xs text-slate-400">
                        <Badge variant="secondary" className="mr-2">{resource.platform}</Badge>
                        <Badge variant="outline">{resource.difficulty}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-400 hover:text-blue-300"
                        asChild
                      >
                        <Link href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          Visit Resource <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-b-transparent rounded-full animate-spin"></div>
            </div>
          </motion.div>
          <p className="mt-6 text-slate-300 text-lg">Loading your results...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-500/10 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-6">Oops!</h1>
            <p className="text-xl text-slate-300 mb-8">
              {error}
            </p>
            <Button 
              variant="default" 
              onClick={() => router.push('/assessment')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Take Assessment
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }
  
  if (!mbtiResult) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-blue-500/10 p-4 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-6">No Assessment Results Found</h1>
            <p className="text-xl text-slate-300 mb-8">
              You haven't completed any assessments yet.
            </p>
            <Button 
              variant="default" 
              onClick={() => router.push('/assessment')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Take Assessment
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="py-8 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            >
              Your Career Compass Results
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto"
            >
              Based on your personality assessment and skill ratings, we've created personalized career guidance for you.
            </motion.p>
          </div>
          
          <Tabs defaultValue="personality" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="careers">Careers</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personality" className="mt-6">
  {renderPersonalityCard()}
  {renderPreferencesCard()}
  {renderSkillsCard()}
  </TabsContent>
            
            <TabsContent value="careers" className="mt-6">
              {renderCareerGuidance()}
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              {renderLearningResources()}
            </TabsContent>
          </Tabs>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-12 mb-8"
          >
            <Button 
              variant="outline" 
              onClick={() => router.push('/assessment')}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
            <Button 
              variant="default"
              onClick={() => router.push('/profile')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              View Your Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}