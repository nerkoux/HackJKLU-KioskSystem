"use client";

import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="text-6xl mb-6">📶</div>
          <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
          <p className="text-xl text-slate-300 mb-8">
            It looks like you've lost your internet connection. Some features may not be available until you're back online.
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}