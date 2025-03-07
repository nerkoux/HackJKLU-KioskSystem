"use client";

import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import VideoConsultation from '@/components/consultation/video-consultation';

export default function ConsultationPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Career Consultation
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            Get personalized career guidance through an interactive consultation with our AI career expert.
            Ask questions about career paths, skill development, or job market trends.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="text-blue-400 text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Career Guidance</h3>
              <p className="text-slate-400">
                Get personalized advice on career paths that match your personality and skills.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="text-purple-400 text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold mb-2">Education Planning</h3>
              <p className="text-slate-400">
                Discover courses and educational paths to help you reach your career goals.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="text-green-400 text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">Industry Insights</h3>
              <p className="text-slate-400">
                Learn about job market trends and opportunities in your field of interest.
              </p>
            </div>
          </div>
          
          <VideoConsultation />
        </motion.div>
      </div>
    </MainLayout>
  );
}