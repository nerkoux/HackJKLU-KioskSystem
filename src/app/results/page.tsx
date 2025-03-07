"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { mbtiCareerPaths } from '@/lib/utils';
import CareerRoadmap from '@/components/results/career-roadmap';

// MBTI type descriptions
const mbtiDescriptions: Record<string, { title: string, description: string, strengths: string[], careers: string[] }> = {
  "ISTJ": {
    title: "The Inspector",
    description: "Practical, fact-minded, and reliable. You value tradition and loyalty, with a strong sense of duty and responsibility.",
    strengths: ["Detail-oriented", "Organized", "Reliable", "Logical", "Committed"],
    careers: ["Accountant", "Auditor", "Financial Analyst", "Project Manager", "Systems Analyst"]
  },
  "ISFJ": {
    title: "The Protector",
    description: "Quiet, friendly, and conscientious. You're committed to meeting obligations and are known for your thoroughness and dependability.",
    strengths: ["Supportive", "Reliable", "Patient", "Detail-oriented", "Observant"],
    careers: ["Nurse", "Teacher", "HR Specialist", "Social Worker", "Administrative Assistant"]
  },
  "INFJ": {
    title: "The Counselor",
    description: "Idealistic, principled, and sensitive. You seek meaning and connection, with a clear vision of how to serve the common good.",
    strengths: ["Insightful", "Creative", "Principled", "Passionate", "Altruistic"],
    careers: ["Counselor", "Psychologist", "Writer", "HR Development Trainer", "Professor"]
  },
  "INTJ": {
    title: "The Mastermind",
    description: "Innovative, independent, and strategic. You have a natural talent for analysis and an ability to see possibilities for improvement.",
    strengths: ["Strategic", "Independent", "Innovative", "Logical", "Determined"],
    careers: ["Scientist", "Engineer", "Investment Banker", "Software Developer", "Business Analyst"]
  },
  "ISTP": {
    title: "The Craftsman",
    description: "Observant, practical, and hands-on. You excel at understanding how mechanical things work and solving problems with logical efficiency.",
    strengths: ["Adaptable", "Practical", "Logical", "Observant", "Self-reliant"],
    careers: ["Mechanic", "Engineer", "Pilot", "Forensic Scientist", "Programmer"]
  },
  "ISFP": {
    title: "The Composer",
    description: "Gentle, sensitive, and artistic. You value personal space and time, with a strong aesthetic appreciation and a desire for harmony.",
    strengths: ["Artistic", "Sensitive", "Loyal", "Adaptable", "Harmonious"],
    careers: ["Artist", "Designer", "Veterinarian", "Chef", "Physical Therapist"]
  },
  "INFP": {
    title: "The Healer",
    description: "Idealistic, creative, and service-oriented. You seek to understand people and help them fulfill their potential.",
    strengths: ["Empathetic", "Creative", "Passionate", "Dedicated", "Open-minded"],
    careers: ["Writer", "Counselor", "HR Manager", "Graphic Designer", "Librarian"]
  },
  "INTP": {
    title: "The Architect",
    description: "Logical, original, and creative thinker. You have a thirst for knowledge and enjoy theoretical and abstract concepts.",
    strengths: ["Analytical", "Original", "Open-minded", "Objective", "Curious"],
    careers: ["Software Developer", "Scientist", "Architect", "Professor", "Research Analyst"]
  },
  "ESTP": {
    title: "The Dynamo",
    description: "Energetic, action-oriented, and pragmatic. You're adaptable, resourceful, and focused on immediate results.",
    strengths: ["Energetic", "Practical", "Persuasive", "Spontaneous", "Adaptable"],
    careers: ["Entrepreneur", "Sales Representative", "Marketing Executive", "Police Officer", "Paramedic"]
  },
  "ESFP": {
    title: "The Performer",
    description: "Outgoing, friendly, and spontaneous. You enjoy working with others and bringing a sense of fun and excitement to any situation.",
    strengths: ["Enthusiastic", "Friendly", "Adaptable", "Practical", "Observant"],
    careers: ["Event Planner", "Tour Guide", "Performer", "Sales Representative", "Public Relations Specialist"]
  },
  "ENFP": {
    title: "The Champion",
    description: "Enthusiastic, creative, and sociable. You see possibilities everywhere and get excited about new ideas and projects.",
    strengths: ["Enthusiastic", "Creative", "Sociable", "Perceptive", "Adaptable"],
    careers: ["Journalist", "Consultant", "Advertising Creative", "Public Relations", "Entrepreneur"]
  },
  "ENTP": {
    title: "The Visionary",
    description: "Quick, ingenious, and outspoken. You enjoy intellectual challenges and are skilled at developing new ideas and strategies.",
    strengths: ["Innovative", "Analytical", "Enterprising", "Adaptable", "Charismatic"],
    careers: ["Entrepreneur", "Lawyer", "Consultant", "Engineer", "Creative Director"]
  },
  "ESTJ": {
    title: "The Supervisor",
    description: "Practical, traditional, and organized. You value security and stability, with a talent for managing people and projects efficiently.",
    strengths: ["Organized", "Dedicated", "Practical", "Direct", "Reliable"],
    careers: ["Manager", "Judge", "Financial Officer", "School Principal", "Military Officer"]
  },
  "ESFJ": {
    title: "The Provider",
    description: "Warm-hearted, conscientious, and cooperative. You value harmony and are skilled at creating order and structure in your environment.",
    strengths: ["Supportive", "Reliable", "Conscientious", "Practical", "Cooperative"],
    careers: ["Teacher", "Healthcare Worker", "Sales Manager", "Public Relations", "Office Manager"]
  },
  "ENFJ": {
    title: "The Teacher",
    description: "Charismatic, empathetic, and responsible. You're naturally drawn to helping others develop and reach their potential.",
    strengths: ["Charismatic", "Empathetic", "Organized", "Inspiring", "Reliable"],
    careers: ["Teacher", "HR Manager", "Marketing Manager", "Counselor", "Sales Trainer"]
  },
  "ENTJ": {
    title: "The Commander",
    description: "Strategic, logical, and efficient. You're a natural leader who excels at finding ways to improve systems and processes.",
    strengths: ["Strategic", "Efficient", "Energetic", "Self-confident", "Decisive"],
    careers: ["Executive", "Lawyer", "Management Consultant", "University Professor", "Entrepreneur"]
  }
};

export default function ResultsPage() {
  const router = useRouter();
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get results from localStorage
    const result = localStorage.getItem('mbtiResult');
    const skills = localStorage.getItem('skillRatings');
    
    if (!result) {
      // If no result, redirect to assessment
      router.push('/assessment');
      return;
    }
    
    setMbtiResult(result);
    if (skills) {
      setSkillRatings(JSON.parse(skills));
    }
    setLoading(false);
  }, [router]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Loading your results...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!mbtiResult || !mbtiDescriptions[mbtiResult]) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
          <p className="text-slate-300 mb-6">
            We couldn't find your assessment results. Please take the assessment again.
          </p>
          <Link href="/assessment">
            <Button variant="gradient">Take Assessment</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const personalityInfo = mbtiDescriptions[mbtiResult];
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Your Personality Type: {mbtiResult}
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {personalityInfo.title}
            </h2>
            <p className="text-xl text-slate-300">
              {personalityInfo.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Your Key Strengths</h3>
              <ul className="space-y-3">
                {personalityInfo.strengths.map((strength, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Recommended Career Paths</h3>
              <ul className="space-y-3">
                {personalityInfo.careers.map((career, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                    <span>{career}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Your Career Development Path</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
              
              <div className="space-y-8 relative">
                <div className="ml-12 relative">
                  <div className="absolute -left-12 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">1</div>
                  <h4 className="text-lg font-medium mb-2">Skill Development</h4>
                  <p className="text-slate-300">
                    Focus on developing these key skills that align with your personality type:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-300">
                    {mbtiResult.includes('T') ? (
                      <>
                        <li>• Analytical thinking and problem-solving</li>
                        <li>• Logical decision making</li>
                        <li>• Strategic planning</li>
                      </>
                    ) : (
                      <>
                        <li>• Emotional intelligence</li>
                        <li>• Interpersonal communication</li>
                        <li>• Conflict resolution</li>
                      </>
                    )}
                    {mbtiResult.includes('E') ? (
                      <li>• Team collaboration and leadership</li>
                    ) : (
                      <li>• Independent work and deep focus</li>
                    )}
                  </ul>
                </div>
                
                <div className="ml-12 relative">
                  <div className="absolute -left-12 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">2</div>
                  <h4 className="text-lg font-medium mb-2">Education Path</h4>
                  <p className="text-slate-300">
                    Consider these educational opportunities:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-300">
                    <li>• Degree programs in {mbtiResult.includes('T') ? 'technical fields, sciences, or business' : 'humanities, arts, or social sciences'}</li>
                    <li>• Certifications in {mbtiResult.includes('J') ? 'project management or structured methodologies' : 'creative fields or flexible approaches'}</li>
                    <li>• Workshops on {mbtiResult.includes('S') ? 'practical skills and applications' : 'theoretical concepts and innovations'}</li>
                  </ul>
                </div>
                
                <div className="ml-12 relative">
                  <div className="absolute -left-12 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">3</div>
                  <h4 className="text-lg font-medium mb-2">Career Growth</h4>
                  <p className="text-slate-300">
                    As you progress in your career, consider these advancement opportunities:
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-300">
                    {mbtiResult.includes('E') ? (
                      <>
                        <li>• Leadership and management roles</li>
                        <li>• Team coordination positions</li>
                      </>
                    ) : (
                      <>
                        <li>• Specialized expert roles</li>
                        <li>• Research and development positions</li>
                      </>
                    )}
                    <li>• Consulting opportunities in your field</li>
                    <li>• Entrepreneurial ventures aligned with your strengths</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center space-x-6">
            <Link href="/assessment">
              <Button variant="outline" size="lg">
                Retake Assessment
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="gradient" size="lg">
                Save to Profile
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <CareerRoadmap mbtiType={mbtiResult || ''} skills={skillRatings} />
        </motion.div>
          </div>
        </MainLayout>
      );
}