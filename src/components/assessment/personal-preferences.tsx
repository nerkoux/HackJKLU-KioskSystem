"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, Check, ChevronRight, Sparkles, Heart, Briefcase, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

// Predefined options for dropdowns
const interestOptions = [
  "Technology", "Science", "Art", "Music", "Writing", "Sports", "Travel", 
  "Cooking", "Photography", "Gaming", "Reading", "Nature", "Fashion", 
  "Finance", "Education", "Healthcare", "Social Impact"
];

const valueOptions = [
  "Creativity", "Innovation", "Leadership", "Teamwork", "Independence", 
  "Work-Life Balance", "Financial Security", "Social Impact", "Learning", 
  "Recognition", "Adventure", "Stability", "Diversity", "Integrity"
];

const philosophyOptions = [
  "Growth Mindset", "Continuous Learning", "Work to Live", "Live to Work", 
  "Make a Difference", "Follow Your Passion", "Balance in All Things", 
  "Excellence in Everything", "Practical Outcomes", "Innovation First"
];

export default function PersonalPreferences() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("interests");
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State for user preferences
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');
  const [philosophy, setPhilosophy] = useState<string>('');
  const [careerGoals, setCareerGoals] = useState<string>('');
  
  // Calculate completion progress
  useEffect(() => {
    let completed = 0;
    let total = 4; // Total number of sections
    
    if (interests.length > 0) completed++;
    if (values.length > 0) completed++;
    if (philosophy) completed++;
    if (careerGoals) completed++;
    
    setProgress((completed / total) * 100);
  }, [interests, values, philosophy, careerGoals]);
  
  // Check if MBTI assessment is completed
  useEffect(() => {
    const mbtiResult = localStorage.getItem('mbtiResult');
    if (!mbtiResult) {
      alert("Please complete the MBTI assessment first.");
      router.push('/assessment');
    }
  }, [router]);
  
  // Load existing preferences if available
  useEffect(() => {
    const loadPreferences = async () => {
      // Try to get from localStorage first
      const localPreferences = localStorage.getItem('personalPreferences');
      if (localPreferences) {
        try {
          const parsed = JSON.parse(localPreferences);
          if (parsed.customSkills) setCustomSkills(parsed.customSkills);
          if (parsed.interests) setInterests(parsed.interests);
          if (parsed.values) setValues(parsed.values);
          if (parsed.philosophy) setPhilosophy(parsed.philosophy);
          if (parsed.careerGoals) setCareerGoals(parsed.careerGoals);
        } catch (e) {
          console.error('Error parsing preferences:', e);
        }
      }
      
      // If authenticated, try to get from server
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();
          
          if (data.user && data.user.personalPreferences) {
            const prefs = data.user.personalPreferences;
            if (prefs.customSkills) setCustomSkills(prefs.customSkills);
            if (prefs.interests) setInterests(prefs.interests);
            if (prefs.values) setValues(prefs.values);
            if (prefs.philosophy) setPhilosophy(prefs.philosophy);
            if (prefs.careerGoals) setCareerGoals(prefs.careerGoals);
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        }
      }
    };
    
    loadPreferences();
  }, [status]);
  
  // Handle adding a custom skill
  const handleAddSkill = () => {
    if (newSkill && !customSkills.includes(newSkill)) {
      setCustomSkills([...customSkills, newSkill]);
      setNewSkill('');
    }
  };
  
  // Handle removing a custom skill
  const handleRemoveSkill = (skill: string) => {
    setCustomSkills(customSkills.filter(s => s !== skill));
  };
  
  // Handle adding an interest
  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };
  
  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  // Handle adding a value
  const handleAddValue = () => {
    if (newValue && !values.includes(newValue)) {
      setValues([...values, newValue]);
      setNewValue('');
    }
  };
  
  // Handle removing a value
  const handleRemoveValue = (value: string) => {
    setValues(values.filter(v => v !== value));
  };
  
  // Handle selecting a predefined interest
  const handleSelectInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };
  
  // Handle selecting a predefined value
  const handleSelectValue = (value: string) => {
    if (!values.includes(value)) {
      setValues([...values, value]);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare preferences data
      const preferencesData = {
        customSkills,
        interests,
        values,
        philosophy,
        careerGoals,
        completedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('personalPreferences', JSON.stringify(preferencesData));
      localStorage.setItem('preferencesCompleted', 'true');
      
      // If authenticated, save to database
      if (status === 'authenticated') {
        const response = await fetch('/api/user/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            personalPreferences: preferencesData,
            preferencesCompleted: true
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save preferences');
        }
        
        // Pre-generate updated career guidance with preferences
        try {
          const mbtiResult = localStorage.getItem('mbtiResult');
          const skillRatings = localStorage.getItem('skillRatings') 
            ? JSON.parse(localStorage.getItem('skillRatings') || '{}') 
            : {};
            
          await fetch('/api/career-guidance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mbtiType: mbtiResult,
              skills: skillRatings,
              preferences: preferencesData
            }),
          });
        } catch (error) {
          console.error('Error pre-generating career guidance:', error);
          // Continue even if guidance generation fails
        }
      }
      
      // Show success animation
      setShowConfetti(true);
      
      // Redirect to assessment hub with completion status after a short delay
      setTimeout(() => {
        router.push('/assessment?completed=preferences');
      }, 1500);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('There was an error saving your preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render confetti effect
  useEffect(() => {
    if (showConfetti) {
      const confetti = async () => {
        const module = await import('canvas-confetti');
        module.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      };
      confetti();
    }
  }, [showConfetti]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-6"
    >
      <div className="mb-8 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        >
          Personal Preferences
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-300 max-w-2xl mx-auto"
        >
          Tell us more about your personal preferences to help us provide more tailored career recommendations.
        </motion.p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Completion Progress</span>
          <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="mb-8 border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Navigation</CardTitle>
          <CardDescription>Complete each section to personalize your career guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interests" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="interests" className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Interests</span>
                <span className="md:hidden">Interests</span>
              </TabsTrigger>
              <TabsTrigger value="values" className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Values</span>
                <span className="md:hidden">Values</span>
              </TabsTrigger>
              <TabsTrigger value="philosophy" className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Philosophy</span>
                <span className="md:hidden">Philosophy</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Career Goals</span>
                <span className="md:hidden">Goals</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="interests" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="interest-select" className="mb-2 block">Select from common interests</Label>
                    <Select onValueChange={handleSelectInterest}>
                      <SelectTrigger id="interest-select">
                        <SelectValue placeholder="Select an interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {interestOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="custom-interest" className="mb-2 block">Or add your own</Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Enter interest..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={handleAddInterest} variant="outline" size="icon">
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add custom interest</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Your selected interests</Label>
                  <ScrollArea className="h-[120px] rounded-md border border-slate-700 p-4">
                    <div className="flex flex-wrap gap-2">
                      {interests.length === 0 ? (
                        <p className="text-slate-500 italic">No interests selected yet</p>
                      ) : (
                        interests.map((interest, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full flex items-center"
                          >
                            {interest}
                            <button 
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab("values")} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="values" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="value-select" className="mb-2 block">Select from common values</Label>
                    <Select onValueChange={handleSelectValue}>
                      <SelectTrigger id="value-select">
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                      <SelectContent>
                        {valueOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="custom-value" className="mb-2 block">Or add your own</Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Enter value..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={handleAddValue} variant="outline" size="icon">
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add custom value</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Your selected values</Label>
                  <ScrollArea className="h-[120px] rounded-md border border-slate-700 p-4">
                    <div className="flex flex-wrap gap-2">
                      {values.length === 0 ? (
                        <p className="text-slate-500 italic">No values selected yet</p>
                      ) : (
                        values.map((value, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full flex items-center"
                          >
                            {value}
                            <button 
                              onClick={() => handleRemoveValue(value)}
                              className="ml-2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => setActiveTab("interests")} 
                  variant="outline"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("philosophy")} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="philosophy" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="philosophy-select" className="mb-2 block">Your work philosophy</Label>
                  <Select value={philosophy} onValueChange={setPhilosophy}>
                    <SelectTrigger id="philosophy-select">
                      <SelectValue placeholder="Select your work philosophy" />
                    </SelectTrigger>
                    <SelectContent>
                      {philosophyOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="custom-philosophy" className="mb-2 block">Or describe your own philosophy</Label>
                  <Textarea
                    id="custom-philosophy"
                    value={philosophy.includes(philosophyOptions.join()) ? '' : philosophy}
                    onChange={(e) => setPhilosophy(e.target.value)}
                    placeholder="Describe your work philosophy in your own words..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => setActiveTab("values")} 
                  variant="outline"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("goals")} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="goals" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="career-goals" className="mb-2 block">Your career goals</Label>
                  <Textarea
                    id="career-goals"
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="Describe your short and long-term career goals..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Additional skills you'd like to develop</Label>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill you'd like to develop..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleAddSkill} variant="outline" size="icon">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add skill to develop</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <ScrollArea className="h-[100px] rounded-md border border-slate-700 p-4">
                    <div className="flex flex-wrap gap-2">
                      {customSkills.length === 0 ? (
                        <p className="text-slate-500 italic">No additional skills added yet</p>
                      ) : (
                        customSkills.map((skill, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-slate-700/70 text-slate-200 px-3 py-1 rounded-full flex items-center"
                          >
                            {skill}
                            <button 
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => setActiveTab("philosophy")} 
                  variant="outline"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || progress < 50}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-slate-700 pt-4 flex justify-between">
          <div className="text-sm text-slate-400">
            {progress >= 100 ? (
              <span className="text-green-400 flex items-center">
                <Check className="w-4 h-4 mr-1" /> All sections completed
              </span>
            ) : (
              <span>Complete all sections to continue</span>
            )}
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || progress < 50}
            variant="outline"
            size="sm"
          >
            Save & Continue
          </Button>
        </CardFooter>
      </Card>
      
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl shadow-xl max-w-md text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Preferences Saved!</h3>
              <p className="text-slate-300 mb-6">
                Your personal preferences have been saved successfully. We'll use this information to provide more tailored career guidance.
              </p>
              <Button 
                onClick={() => router.push('/assessment?completed=preferences')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
              >
                Continue to Results
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}