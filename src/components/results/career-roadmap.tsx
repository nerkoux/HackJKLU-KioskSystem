"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CareerRoadmapProps {
  mbtiType: string;
  skills: Record<string, number>;
}

export default function CareerRoadmap({ mbtiType, skills }: CareerRoadmapProps) {
  // Determine top skills
  const topSkills = Object.entries(skills || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill);
  
  // Determine career path based on MBTI and skills
  const getCareerPath = () => {
    if (!mbtiType) return "General Career Path";
    
    if (mbtiType.includes('T') && topSkills.includes('Programming')) {
      return "Technology & Software Development";
    } else if (mbtiType.includes('F') && topSkills.includes('Communication')) {
      return "Human Resources & Counseling";
    } else if (mbtiType.includes('E') && topSkills.includes('Leadership')) {
      return "Management & Leadership";
    } else if (mbtiType.includes('I') && topSkills.includes('Data Analysis')) {
      return "Research & Analysis";
    } else if (mbtiType.includes('S') && topSkills.includes('Business')) {
      return "Business Administration";
    } else if (mbtiType.includes('N') && topSkills.includes('Creative Arts')) {
      return "Creative & Design";
    } else {
      return "General Career Path";
    }
  };
  
  const careerPath = getCareerPath();
  
  // Define roadmap steps based on career path
  const getRoadmapSteps = () => {
    const baseSteps = [
      {
        title: "Foundation Building",
        description: "Develop core skills and knowledge in your field",
        timeline: "1-2 years",
        tasks: [
          "Complete relevant courses or certifications",
          "Build a portfolio of projects",
          "Join professional communities"
        ]
      },
      {
        title: "Professional Growth",
        description: "Gain practical experience and specialize",
        timeline: "2-5 years",
        tasks: [
          "Take on challenging projects",
          "Develop specialized expertise",
          "Build professional network"
        ]
      },
      {
        title: "Career Advancement",
        description: "Move into more senior or specialized roles",
        timeline: "5+ years",
        tasks: [
          "Take on leadership responsibilities",
          "Mentor others in your field",
          "Contribute to industry knowledge"
        ]
      }
    ];
    
    // Customize based on career path
    if (careerPath === "Technology & Software Development") {
      baseSteps[0].tasks = [
        "Learn programming fundamentals and key languages",
        "Build personal projects for your portfolio",
        "Contribute to open source projects"
      ];
    } else if (careerPath === "Human Resources & Counseling") {
      baseSteps[0].tasks = [
        "Develop strong interpersonal and communication skills",
        "Learn about organizational psychology",
        "Practice active listening and empathy"
      ];
    }
    
    return baseSteps;
  };
  
  const roadmapSteps = getRoadmapSteps();
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
      <h2 className="text-2xl font-semibold mb-6">Your Career Roadmap: {careerPath}</h2>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
        
        <div className="space-y-12">
          {roadmapSteps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="ml-12 relative"
            >
              <div className="absolute -left-12 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {index + 1}
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-medium">{step.title}</h3>
                <span className="text-sm bg-slate-700 px-2 py-1 rounded text-slate-300">
                  {step.timeline}
                </span>
              </div>
              
              <p className="text-slate-300 mb-4">{step.description}</p>
              
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Key Focus Areas:</h4>
                <ul className="space-y-2">
                  {step.tasks.map((task, taskIndex) => (
                    <motion.li 
                      key={taskIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.2) + (taskIndex * 0.1) }}
                      className="flex items-start"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <span>{task}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}