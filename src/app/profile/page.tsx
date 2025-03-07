"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import FormattedDate from '@/components/ui/formatted-date';

interface UserProfile {
  name: string;
  email: string;
  mbtiType: string | null;
  savedCareers: string[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    mbtiType: null,
    savedCareers: []
  });
  
  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    const mbtiResult = localStorage.getItem('mbtiResult');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else if (mbtiResult) {
      // Initialize with MBTI result if available
      const newProfile = {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        mbtiType: mbtiResult,
        savedCareers: []
      };
      setProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
    }
  }, [session]);
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Your Career Profile
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-6">
                {session ? (
                  <div className="text-center mb-4">
                    {session.user?.image && (
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image 
                          src={session.user.image}
                          alt={session.user.name || "Profile"}
                          fill
                          className="rounded-full border-4 border-purple-500"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      </div>
                    )}
                    <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                    <p className="text-slate-400 text-sm">{session.user?.email}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => signOut()}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                    <p className="text-slate-300 mb-4">Sign in to save your progress and unlock more features</p>
                    <Button variant="gradient" onClick={() => signIn('google')}>
                      Sign in with Google
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Profile information section */}
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400">Personality Type</h4>
                    <p className="text-lg">{profile.mbtiType || "Not assessed yet"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-400">Saved Career Paths</h4>
                    {profile.savedCareers.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {profile.savedCareers.map((career, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            <span>{career}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400">No saved careers yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">Your Career Journey</h3>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-700"></div>
                  
                  <div className="space-y-6 relative">
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white">✓</span>
                      </div>
                      <h3 className="font-medium">Self-Discovery</h3>
                      
                      <p className="text-sm text-slate-400">Completed on {new Date().toISOString().split('T')[0]}</p>
                    </div>
                    
                    <div className="ml-12 relative">
                      <div className="absolute -left-12 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                        <span className="text-white">2</span>
                      </div>
                      <h3 className="font-medium">Skill Assessment</h3>
                      <p className="text-sm text-slate-400">In progress...</p>
                      <Link href="/assessment" className="text-blue-400 text-sm hover:underline">
                        Continue
                      </Link>
                    </div>
                    
                    <div className="ml-12 relative opacity-50">
                      <div className="absolute -left-12 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-white">3</span>
                      </div>
                      <h3 className="font-medium">Career Consultation</h3>
                      <p className="text-sm text-slate-400">Locked</p>
                    </div>
                    
                    <div className="ml-12 relative opacity-50">
                      <div className="absolute -left-12 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-white">4</span>
                      </div>
                      <h3 className="font-medium">Career Decision</h3>
                      <p className="text-sm text-slate-400">Locked</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl">🏆</span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">Self-Discovery Master</h3>
                    <p className="text-xs text-slate-400">Completed personality assessment</p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center opacity-50">
                    <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl">🔍</span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">Skill Explorer</h3>
                    <p className="text-xs text-slate-400">Complete skills assessment to unlock</p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center opacity-50">
                    <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl">💬</span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">Consultation Pro</h3>
                    <p className="text-xs text-slate-400">Complete AI consultation to unlock</p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg text-center opacity-50">
                    <div className="w-12 h-12 bg-slate-600 rounded-full mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl">📊</span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">Career Pathfinder</h3>
                    <p className="text-xs text-slate-400">Save 3 career paths to unlock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}